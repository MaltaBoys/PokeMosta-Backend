const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase } = require('./db');
const userRouter = require('./routes/user');

app.use(express.json());
app.use(cors());

// Connect to database
connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.log('Error connecting to MongoDB', e.message);
  });

// Use user-related routes
app.use('/user', userRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
