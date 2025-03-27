const express = require('express');
const app = express();

app.use('/home', (req, res) => res.end('Welcome home'));

app.use('/TEST', (req, res) => res.end('Hello world'));

app.use('/Dashboard', (req, res) => {
  res.end('welcome to Dashboard');
});

app.listen(7777, () => console.log('Server is running at port 7777'));
