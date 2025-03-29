const express = require('express');
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    //check for validations using validation helper functions
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Unable to register user ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      // generate jwt token
      const token = await user.getJWT();
      res.cookie('token', token, { expires: new Date(Date.now() + 900000) });
      res.send('Login Successful!!');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Something went wrong' + error.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) });
  res.send('Logged out successfully!!');
});

module.exports = authRouter;
