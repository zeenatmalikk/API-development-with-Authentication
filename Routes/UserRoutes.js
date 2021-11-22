//Router > where client requests are handled by different endpoints

const express = require("express");
const userRouter = express.Router();
//Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const expressAsyncHandler = require("express-async-handler");
//password hashing
const bcrypt = require("bcrypt");
//import model
const User = require("../Models/User");
const generateToken = require("../Utils");

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const Username = await User.findOne({ email: req.body.email });
    if (Username) {
      res.status(400).json("user already existing");
    //   return;
    }
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      confirmPassword: bcrypt.hashSync(req.body.confirmPassword, 10),
    });
    try {
      if (req.body.password === req.body.confirmPassword) {
        user.save();
      } else {
        res.status(400).json("password does not match!!");
      }
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({
      _id: user._id,
      name: user.firstname,
      email: user.email,
      token: generateToken(user)
    });
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          name: user.firstname,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).json({message:"Invalid email or password"})
  })
);

module.exports = userRouter;
