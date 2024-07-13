const express = require("express");
const router = express.Router();
const { JWT_SECRET } = require("../config/jwtsetup");
const { usermodel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { authmiddleware } = require("../middleware/jwtauthentication");
const {accountmodel} = require("../models/account")

const app = express();

app.use(express.json());

const signupschema = zod.object({
  firstname: zod.string(),
  lastname: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/register", async (req, res) => {
  
  const result = signupschema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send("Invalid data");
  }

  let { firstname, lastname, email, password } = req.body;

  // Check if the email already exists
  const emailExist = await usermodel.findOne({ email: email });
  if (emailExist) {
    return res.status(400).send("User already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  // Create a new user
  try {
    const usercreated = await usermodel.create({
      firstname,
      lastname,
      email,
      password,
    });

    const user_id = usercreated._id;

    await accountmodel.create({
      userId: user_id,
      balance: 1 + Math.random() * 1000,
    });

     //save the balance in the account model

     


    const token = jwt.sign({ user_id }, JWT_SECRET);
    await usercreated.save();
    res.json({ message: "User created successfully", usercreated, token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


const signinBody = zod.object({
  email: zod.string().email(),
password: zod.string()
})

router.post("/login", async (req, res) => {

  const result = signinBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send("Invalid data");
  }


  let { email, password } = req.body;

  // Check if the email already exists
  const user = await usermodel.findOne({ email: email });
  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid Credentials");
  }

  // Create a token
  const token = jwt.sign({ user_id: user._id }, JWT_SECRET);
  res.cookie("token", token);
  res.send("Logged in successfully");
});

const updateschema = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().min(6).optional(),
});

router.put("/update", authmiddleware, async (req, res) => {
  const result = updateschema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send("Invalid data");
  }

  let { firstname, lastname, password } = req.body;

  const updateData = {};
  if (firstname) updateData.firstname = firstname;
  if (lastname) updateData.lastname = lastname;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  try {
    const updateduser = await usermodel.updateOne(
      { _id: req.user_id },
      updateData,
      { new: true }
    );
    res.json({ message: "User updated successfully", updateduser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await usermodel.find({
      $or: [
        { firstname: { $regex: filter, $options: "i" } },
        { lastname: { $regex: filter, $options: "i" } },
      ],
    });

    res.json({
      users: users.map((user) => ({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        user_id: user._id,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


module.exports = router;
