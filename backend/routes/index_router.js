const express = require("express");
const app = express();
const router = express.Router();

const userrouter = require("./user_routes");
const accountrouter = require("./account_routes");

app.use(express.json());
router.use("/user", userrouter);
router.use('/account', accountrouter);

module.exports = router;