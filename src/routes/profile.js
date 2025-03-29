const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { userAuth } = require('../middlewares/auth');
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send('Something went wrong ' + error.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    const id = req.user._id;
    const user = req.user;
    const ALLOWED_UPDATES = [
      'firstName',
      'lastName',
      'gender',
      'skills',
      'photoUrl',
      'about',
    ];
    const isUpdateAllowed = Object.keys(req.body).every((field) =>
      ALLOWED_UPDATES.includes(field)
    );
    if (!isUpdateAllowed) {
      throw new Error('Updating certain fields is not allowed');
    }
    Object.keys(req.body).forEach((field) => (user[field] = req.body[field]));
    console.log(user);
    await user.save();
    res.send('User updated successfully');
  } catch (error) {
    res.status(400).send('Update failed: ' + error.message);
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Old password is incorrect');
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('Weak password, try a strong one');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.send('User updated successfully');
  } catch (error) {
    res.status(400).send('Update failed: ' + error.message);
  }
});

module.exports = profileRouter;
