const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

requestRouter.get('/sendConnectionRequest', userAuth, (req, res) => {
  try {
    console.log(req.user.firstName + ' sent a request to you');
    res.send(req.user.firstName + ' sent a request to you');
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

module.exports = requestRouter;
