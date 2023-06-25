const { Router } = require('express');
const app = Router();
require('dotenv').config();
const Product = require('../models/Product');

exports.get = function (req, res) {
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

exports.post = function (req, res) {
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
                res.status(400).send('Product has already been created');
            } else {
                const product = {
                    name,
                    description,
                    stock,
                    image,
                };
                const newProduct = new Product(product);
                newProduct.save();
                res.status(200).send('Product added successfully');
            }
        })
        .then((product) => {
            if (product) {
                console.log('Product added by id: ' + product.id);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
exports.patch = function (req, res) {
};
exports.delete = function (req, res) {
};

