const express = require('express');
const User = require('./models/user');
const connectDB = require('./config/database');
const app = express();

connectDB()
  .then(() => {
    console.log('Database connection is established');
    app.listen(7777, () => console.log('Server is running at port 7777'));
  })
  .catch((err) => {
    console.error('Problem connecting to the Database');
  });

app.post('/signup', async (req, res) => {
  const user = new User({
    firstName: 'Sagar',
    lastName: 'joga',
    emailId: 'sagar@joga.com',
    password: 'sagar@123',
  });
  try {
    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Unable to register user');
  }
});
