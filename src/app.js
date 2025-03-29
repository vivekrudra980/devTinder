const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const connectDB = require('./config/database');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send('Unable to get the user');
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send('Users not found');
    }
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

app.delete('/user', async (req, res) => {
  try {
    const id = req.body._id;
    await User.findByIdAndDelete(id);
    res.send('User got deleted successfully');
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
});

app.patch('/user', async (req, res) => {
  try {
    const id = req.body._id;
    const data = req.body;
    const ALLOWED_UPDATES = [
      'firstName',
      'lastName',
      'password',
      'gender',
      'skills',
      'photoUrl',
      'about',
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error('Updating certain fields is not allowed');
    }
    const user = await User.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    console.log(user);
    res.send('User updated successfully');
  } catch (error) {
    res.status(400).send('Update failed: ' + error.message);
  }
});

connectDB()
  .then(() => {
    console.log('Database connection is established');
    app.listen(7777, () => console.log('Server is running at port 7777'));
  })
  .catch((err) => {
    console.error('Problem connecting to the Database');
  });
