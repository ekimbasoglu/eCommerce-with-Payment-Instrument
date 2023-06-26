const { Router } = require('express');
const app = Router();
require('dotenv').config();
const Preorder = require('../models/Preorder');

exports.get = async (req, res) => {
    const id = req.params.id;

    //Missing fields
    if (!id) {
        res.status(400).send('Id is missing');
        return;
    }

    Preorder.findOne({ _id: id })
        .then((preorder) => {
            if (preorder) {
                res.status(200).json({ preorder });
            } else {
                res.status(400).send('User didnt preordered the product!');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

exports.submit = async (req, res) => {
    const userId = req.body.userId,
        amount = req.body.amount;
    productId = req.body.productId;

    //Missing fields
    if (!userId || !productId) {
        res.status(400).send('Id is missing');
        return;
    }

    User.findOne({ preorders: productId })
        .then(async (preorder) => {
            if (preorder) {
                res.status(400).send('You already placed the preorder!');
            } else {
                // Check the stock & reduce the stock
                try {
                    // Find the product by ID and update the stock
                    const updatedProduct = await Product.findByIdAndUpdate(
                        productId,
                        { $inc: { stock: -1 } },
                        { new: true }
                    );

                    if (!updatedProduct) {
                        return res.status(404).json({ error: 'Product not found' });
                    }
                } catch (error) {
                    // There is no stock
                    return res.status(402).json({ error: 'No stock left for the product!' });
                }

                // Find the user & patch his preorders by adding the productId
                User.findById(userId)
                    .then(user => {
                        if (!user) {
                            throw new Error('User not found');
                        }

                        const newPreorder = new Preorder({
                            productId,
                            amount,
                            userId,
                            hasStockReserved: true
                        });

                        user.preorders.push(newPreorder);
                        return user.save();
                    })
                    .then(updatedUser => {
                        console.log('Updated User:', updatedUser);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                res.status(200).send('Preorder placed successfully!').json(preorder);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

exports.submit = async (req, res) => {
    const productId = req.params.productId,
        userId = req.params.userId;

    User.findById({ preorders: productId })
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }

            Object.values(user.preorders).forEach(preorder => {
                if (preorder == productId) {
                    return preorder.pop();
                }
            });
        })
        .then(updatedUser => {
            console.log('Updated User:', updatedUser);
        })
        .catch(error => {
            console.error(error);
        });
};
