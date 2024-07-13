const express = require("express");
const router = express.Router();
const { authmiddleware } = require("../middleware/jwtauthentication");
const {accountmodel} = require("../models/account")
const { usermodel } = require("../models/user");
const { default: mongoose } = require('mongoose');

router.get('/balance', authmiddleware, async (req, res) => {
    try {
        const user_id = req.userId;
        const account = await accountmodel.findOne({ userId: user_id });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/transfer", authmiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    try {
        // Fetch the accounts within the transaction
        const account = await accountmodel.findOne({ userId: req.userId }).session(session);

        console.log("User ID:", req.userId);
        console.log("Amount:", amount);
        console.log("Account:", account);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        const toAccount = await accountmodel.findOne({ userId: to }).session(session);

        console.log("To Account:", toAccount);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account",
            });
        }

        // Perform the transfer
        await accountmodel.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await accountmodel.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful",
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction error:", error);
        res.status(500).json({
            message: "Server error",
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;
