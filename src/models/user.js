//user schema
const mongoose = require("mongoose");
var validator = require("validator");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
//create moongoose schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          //{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
          throw new Error("Type Strong Password :" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      default: 18,
    },
    //skills are array
    skills: {
      type: [String],
      default: [],
    },
    photoUrl: {
      type: String,
      default:
        "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Url is not valid :" + value);
        }
      },
    },
    gender: {
      type: String,
      // validate func by default works for create user
      //if we want to run in update we need to add runValidators: true
      //in update function
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender should be male or female");
        }
      },
    },
  },
  { timestamps: true }
);

//create Model - like a class
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "Lavi1993@",
    { expiresIn: "7d" }
  );
};
userSchema.methods.comparePassword = async function (passwordByInput) {
  return await bcrypt.compare(passwordByInput, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
