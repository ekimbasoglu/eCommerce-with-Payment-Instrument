const { Router } = require('express');
const app = Router();
require('dotenv').config();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

exports.get = async (req, res) => {
    const userEmail = req.body.userEmail;
    if (!userEmail) {
        return res.status(400).send('Product or email is missing!');
    }

    // Verifying auth-ed user 
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).json({ error: 'Authorization token not found' });
    }
    const token = bearerToken.substring(7); // Remove "Bearer " prefix
    const fs = require('fs');
    const publicKey = fs.readFileSync('public.pem', 'utf8');

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Access denied.' });
        } else {
            if (decoded.user.email !== userEmail) {
                return res.status(403).json({ error: 'Access denied.' });
            }
        }
    });

    try {
        // Find the user based on teh provided userEmail
        const currentCart = await Cart.findOne({ userEmail });

        if (!currentCart) {
            return res.status(404).json({ error: 'Cart not found!' });
        }
        return res.status(200).send(currentCart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.add = async (req, res) => {
    const productName = req.body.name,
        userEmail = req.body.email,
        amount = req.body.amount;

    //Missing fields
    if (!productName && !userEmail && !amount) {
        return res.status(400).send('Product or email is missing!');
    }

    // Verifying auth-ed user 
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).json({ error: 'Authorization token not found' });
    }
    const token = bearerToken.substring(7); // Remove "Bearer " prefix
    const fs = require('fs');
    const publicKey = fs.readFileSync('public.pem', 'utf8');

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Access denied.' });
        } else {
            if (decoded.user.email !== userEmail) {
                return res.status(403).json({ error: 'Access denied.' });
            }
        }
    });

    // Find the product
    let product = await Product.findOne({ name: productName });
    if (product == undefined) {
        return res.status(403).json({ error: 'Product doesnt exist!' });
    }

    // Adding the product to the cart
    try {
        // Check if the user already has a cart
        let cart = await Cart.findOne({ userEmail });

        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = new Cart({ userEmail, products: [] });
        }

        // Check if the product already exists in the cart
        const existingProduct = cart.products.find(product => product.name === productName);

        if (existingProduct) {
        f    // If the product already exists, update the amount and stockReserved
            existingProduct.amount = amount;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.products.push(product);
        }

        // Save the updated/created cart
        await cart.save();

        return res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.remove = async (req, res) => {
    // To check the credentials
    const userEmail = req.body.userEmail;

    //Missing fields
    if (!userEmail) {
        return res.status(400).send('Email is missing!');
    }

    // Verifying auth-ed user 
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).json({ error: 'Authorization token not found' });
    }
    const token = bearerToken.substring(7); // Remove "Bearer " prefix
    const fs = require('fs');
    const publicKey = fs.readFileSync('public.pem', 'utf8');

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Access denied.' });
        } else {
            if (decoded.user.email !== userEmail) {
                return res.status(403).json({ error: 'Access denied.' });
            }
        }
    });

    // To find and delete the cart
    try {
        // Find and delete the cart based on the provided userEmail
        const deletedCart = await Cart.deleteOne({ userEmail });

        if (deletedCart.deletedCount === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        return res.status(200).send({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};
