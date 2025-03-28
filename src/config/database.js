const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://vivekprudra:uckU4nCqbzsHPYY@cluster0.zmshp.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0'
  );
};

module.exports = connectDB;
