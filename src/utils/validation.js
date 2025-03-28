const validator = require('validator');

const validateSignUpData = (user) => {
  const { firstName, lastName, emailId } = user;
  if (!firstName || !lastName) {
    throw new Error('Please fill the required name fields');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Invalid EmailId');
  }
};

module.exports = { validateSignUpData };
