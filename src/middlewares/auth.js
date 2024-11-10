const User = require("../models/user");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    var { _id } = jwt.verify(token, "Lavi1993@");

    let user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR:" + err.message);
  }
};

module.exports = { userAuth };
