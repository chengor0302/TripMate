const express = require('express'); //Import express framework to create the server
const mongoose = require('mongoose'); //Import mongoose to commuticate with mongoDB
const cors = require('cors'); //Import CORS to allow cross-origin requests 
const upload = require('./routes/upload');
require('dotenv').config(); // Load environment variables from .env file into process.env


const app = express(); //Create express instance(the server)
app.use(cors()); //Enable cors for all routes(applying the middleware)
app.use(express.json()); //Appliying middleware to transfer body requsets to json format
const path = require('path');

//Using routes
app.use('/auth', require('./routes/auth')); // Use all routes defined in routes/auth.js under /auth
app.use('/trips', require('./routes/trips'));//Use all routes defined in routes/trips.js under /trips
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload', express.static('upload'));

//Connecting mongoDB
mongoose.connect(process.env.MONGO_URI).
then(()=> console.log('MongoDB connected!'))
  .catch(err=>console.log(err));

//Defining port and listenning to requests on port
const PORT = process.env.port || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));