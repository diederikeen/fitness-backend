const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var bodyParser = require('body-parser')

// Middlewares
app.use(bodyParser.json());

// Routes
const authRoute = require('./routes/auth');
const weightRoute = require('./routes/weight');

// Config
dotenv.config();

// Connect to db
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('connected to db');
});

// Route middlewares
app.use('/api/user', authRoute);
app.use('/api/weight', weightRoute);

app.listen(3010, () => console.log('Server is up and running'))
