const express = require('express');
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');

// Configure basic authentication credentials
const authConfig = {
    users: { 'username': 'password' }, // Add your desired username and password here
    unauthorizedResponse: 'Unauthorized',
};

// Create an Express application
const app = express();

// Middleware for basic authentication
app.use(basicAuth(authConfig));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for your data
const schema = new mongoose.Schema({
    name: String,
    age: Number,
});

// Define a model based on the schema
const Model = mongoose.model('Model', schema);

// Define the routes for CRUD operations

// Create a new document
app.post('/api/models', (req, res) => {
    const { name, age } = req.body;
    const model = new Model({ name, age });

    model.save((err, savedModel) => {
        if (err) {
            res.status(500).send('Error saving model');
        } else {
            res.status(201).json(savedModel);
        }
    });
});

// Read all documents
app.get('/api/models', (req, res) => {
    Model.find({}, (err, models) => {
        if (err) {
            res.status(500).send('Error retrieving models');
        } else {
            res.json(models);
        }
    });
});

// Read a specific document
app.get('/api/models/:id', (req, res) => {
    const { id } = req.params;

    Model.findById(id, (err, model) => {
        if (err) {
            res.status(500).send('Error retrieving model');
        } else if (!model) {
            res.status(404).send('Model not found');
        } else {
            res.json(model);
        }
    });
});

// Update a document
app.put('/api/models/:id', (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;

    Model.findByIdAndUpdate(id, { name, age }, { new: true }, (err, updatedModel) => {
        if (err) {
            res.status(500).send('Error updating model');
        } else if (!updatedModel) {
            res.status(404).send('Model not found');
        } else {
            res.json(updatedModel);
        }
    });
});

// Delete a document
app.delete('/api/models/:id', (req, res) => {
    const { id } = req.params;

    Model.findByIdAndDelete(id, (err, deletedModel) => {
        if (err) {
            res.status(500).send('Error deleting model');
        } else if (!deletedModel) {
            res.status(404).send('Model not found');
        } else {
            res.sendStatus(204);
        }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
