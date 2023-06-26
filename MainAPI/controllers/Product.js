const { Router } = require('express');
const app = Router();
require('dotenv').config();
const Product = require('../models/Product');

exports.get = async (req, res) => {
    const id = req.query.id;

    //Missing fields
    if (!id) {
        res.status(400).send('Id is missing');
        return;
    }

    Product.findOne({ id })
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

exports.post = async (req, res) => {
    const description = req.body.description,
        name = req.body.name,
        stock = req.body.stock,
        image = req.body.image;

    //Missing fields
    if (!stock || !name || !description) {
        res.status(400).send('Field is missing');
        return;
    }

    Product.findOne({ name: req.body.name })
        .then((product) => {
            if (product) {
                return res.status(400).send('Product has already been created');
            } else {
                const product = {
                    name,
                    description,
                    stock,
                    image,
                };
                const newProduct = new Product(product);
                newProduct.save();
                return res.status(200).send('Product added successfully');
            }
        })
        .then((product) => {
            if (product) {
                console.log('Product added by id: ' + product.req.body.name);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            return res.status(400).send('Product has already been created');
        });
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

