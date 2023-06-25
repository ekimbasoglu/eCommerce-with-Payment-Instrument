const express = require('express');
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();


const { DB_HOST, DB_USER, DB_PASSWORD, PORT } = process.env;
// Configure basic authentication credentials
const authConfig = {
    unauthorizedResponse: 'Unauthorized',
    db: DB_HOST
};

// Connect to MongoDB
mongoose.connect("mongodb+srv://" + authConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// Cors
app.use(cors());

// Middleware for parsing JSON request bodies
app.use(express.json());

// Define a schema for your data
const schema = new mongoose.Schema({
    name: String,
    age: Number,
});

app.get('/', (req, res) => {
    res.status(200).send("Success");
});

// Imports 
const users = require('./routes/User');

//Routers
app.use(users);



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
