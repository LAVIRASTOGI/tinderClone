const User = require("../models/user");
const { encryptPassword } = require("../utils/passwordEncrypt");
const {
  validateHandlerLogin,
  validateHandlerSignUp,
} = require("../utils/validation");

const authRouter = require("express").Router();
authRouter.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "lavi",
  //   lastName: "rastogi",
  //   emailId: "1993lavi@gmail.com",
  //   password: "lavirastogi",
  //   gender: "female",
  // };

  // retuns a promise
  try {
    //validate Data
    const { firstName, lastName, password, emailId } = req?.body;
    validateHandlerSignUp(req?.body);

    //encrypt password
    const hashPassword = await encryptPassword(password);

    //create the user instanace from the model we created
    const user = new User({
      firstName,
      lastName,
      password: hashPassword,
      emailId,
    });
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    //validate Data
    const { password, emailId } = req?.body;
    validateHandlerLogin(req?.body);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    //compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    // send cookie
    let jwtToken = user.getJWTToken();

    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

authRouter.get("/logout", (req, res) => {
  // res.clearCookie("token");
  //  or this can be
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out");
});
module.exports = authRouter;
