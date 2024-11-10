const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { encryptPassword } = require("../utils/passwordEncrypt");
const { validateEditProfile } = require("../utils/validation");

const profileRouter = express.Router();

// //get all user from data from database
// profileRouter.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err.message);
//   }
// });

// //get data of particular user bu email
// profileRouter.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (user) {
//       res.send(user);
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err.message);
//   }
// });

//delte the user
profileRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("user delted succesfully");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
//update the user
//once i am updating i dont want to update email
//it can update certain feilds
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const loggedInUser = req?.user;

  try {
    let allowedFeilds = ["gender", "age", "skills", "photoUrl"];
    validateEditProfile(req, allowedFeilds);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({ loggedInUser, message: "profile updated Successfully" });
    // const hashPassword = await encryptPassword(userObj?.password);
    // userObj.password = hashPassword;

    // const user = await User.findByIdAndUpdate(userId, userObj, {
    //   new: true,
    //   runValidators: true,
    // });
    // //user that comes contain old data wth new true updated data comes
    // if (user) {
    //   res.send(user);
    // } else {
    //   res.status(404).send('"User not found"');
    // }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    validateEditProfile(req, ["oldPassword", "newPassword"]);
    const { oldPassword, newPassword } = req.body;
    const isMatch = await loggedInuser.comparePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Invalid old password");
    }
    const hashNewPassword = await encryptPassword(newPassword);
    loggedInuser.password = hashNewPassword;
    loggedInuser.save();
    res.json({ message: "profile  password updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req?.user;
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
