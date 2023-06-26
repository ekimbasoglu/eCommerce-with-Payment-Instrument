const { Router } = require('express');
const app = Router();
require('dotenv').config();
const Product = require('../models/Product');

exports.get = async (req, res) => {
    const id = req.params.id;

    //Missing fields
    if (!id) {
        res.status(400).send('Id is missing');
        return;
    }

    Product.findOne({ _id: id })
        .then((product) => {
            if (product) {
                res.status(200).json({ product });
            } else {
                res.status(400).send('Product doesnt exist');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

exports.getAll = async (req, res) => {

    try {
        // Retrieve all products from the database
        const products = await Product.find();

        // Return the products as the response
        res.json(products);
    } catch (error) {
        // Handle any errors that occur during the retrieval process
        res.status(500).json({ error: 'Failed to retrieve products' });
    }

};

exports.post = async (req, res) => {
    const description = req.body.description,
        name = req.body.name,
        stock = req.body.stock,
        price = req.body.price,
        image = req.body.image;

    //Missing fields
    if (!stock || !name || !description || !price) {
        res.status(400).send('Field is missing');
        return;
    }


    try {
        // Check if a product with the same name already exists
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(409).json({ error: 'Product with the same name already exists' });
        }

        // Create a new product
        const product = { name, description, stock, price, image };
        const newProduct = new Product(product);

        // Save the new product
        const createdProduct = await newProduct.save();

        // Return the created product as the response
        res.status(201).json(createdProduct);
    } catch (error) {
        // Handle any errors that occur during the create process
        res.status(500).json({ error: 'Failed to create product' });
    }
};

exports.patch = async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    try {
        // Find the product by ID and update it with the provided data
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return the updated product as the response
        return res.status(200).json(updatedProduct);
    } catch (error) {
        // Handle any errors that occur during the update process
        return res.status(500).json({ error: 'Failed to update product' });
    }

};
exports.delete = async (req, res) => {
    const productId = req.params.id;

    try {
        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return a success message as the response
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        // Handle any errors that occur during the delete process
        return res.status(500).json({ error: 'Failed to delete product' });
    }
};

