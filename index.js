const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const medRoute = require('./routes/med');

const app = express();

// Connect to DB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  }, () => {
  console.log("connected to DB");
})

//Import Routes
const authRoute = require('./routes/auth')

// Middlewares
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/med',medRoute);

const port = process.env.PORT || 5000

app.listen(port, () => console.log('Server Up and running')
)