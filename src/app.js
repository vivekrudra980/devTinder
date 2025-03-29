const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const connectDB = require('./config/database');
const { validateSignUpData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      // generate jwt token
      const token = await jwt.sign({ _id: user._id }, 'Vivek@devTinder', {
        expiresIn: '1d',
      });
      res.cookie('token', token, { expires: new Date(Date.now() + 900000) });
      res.send('Login Successful!!');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Something went wrong' + error.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send('Something went wrong ' + error.message);
  }
});

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

app.get('/sendConnectionRequest', userAuth, (req, res) => {
  try {
    console.log(req.user.firstName + ' sent a request to you');
    res.send(req.user.firstName + ' sent a request to you');
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
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
