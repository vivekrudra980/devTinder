const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Invalid token');
    }
    const decodedData = await jwt.verify(token, 'Vivek@devTinder');
    const { _id } = decodedData;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Some thing went wrong ' + error.message);
  }
};

module.exports = { auth };
