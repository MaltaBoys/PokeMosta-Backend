const mongoose = require('mongoose');

const mongoUrl = `mongodb+srv://adr1:gdu22nAdr0HAs8Kt@cluster0.stklc1r.mongodb.net/?retryWrites=true&w=majority`;

const connectToDatabase = () => {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  });
};

module.exports = {
  connectToDatabase,
};
