const mongoose = require('mongoose');

require('dotenv').config();

const mongoUrl = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.stklc1r.mongodb.net/?retryWrites=true&w=majority`;

const connectToDatabase = () => {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  });
};

module.exports = {
  connectToDatabase,
};
