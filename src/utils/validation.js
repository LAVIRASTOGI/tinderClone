var validator = require("validator");
function validateHandlerSignUp(validateData) {
  const { firstName, lastName, password, emailId } = validateData;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }
  if (!(firstName?.length > 4 && firstName?.length < 20)) {
    throw new Error("First name should be between 4 and 20 characters");
  }
  if (!emailId) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  if (password?.length < 8) {
    throw new Error("Password should be at least 8 characters");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be contain atleast 1 numeric character");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
}
function validateHandlerLogin(validateData) {
  const { emailId, password } = validateData;
  if (!emailId) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
}

function validateEditProfile(req, AllowedFeildsToUpdate) {
  const feildsToUpdate = Object.keys(req.body);
  const isUpdateAllowed = feildsToUpdate.every((feild) => {
    return AllowedFeildsToUpdate.includes(feild);
  });
  if (!isUpdateAllowed) {
    throw new Error("Invalid feilds to update");
  }
  if (req?.body?.skills && req?.body?.skills?.length > 10) {
    throw new Error("Skills cannot be more than 10");
  }
}

module.exports = {
  validateHandlerSignUp,
  validateHandlerLogin,
  validateEditProfile,
};
