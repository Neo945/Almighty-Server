const { createOrder } = require('../config/razorpay.config');
const Order = require('../models/order');

module.exports = {
    getKey: (req, res) => {
        res.send({ key: process.env.RAZORPAY_KEY_ID });
    },
    generateOrder: async (req, res) => {
        const { amount, currency, orderId } = req.body;
        const options = {
            amount,
            currency,
            receipt: orderId,
            payment_capture: 1,
        };
        try {
            const order = await createOrder(options);
            res.send(order);
        } catch (err) {
            res.status(500).send(err);
        }
    },
    listOrder: async (req, res) => {
        const orders = await Order.find();
        res.send(orders);
    },
    payOrdere: async (req, res) => {
        const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
        const newOrder = Order({
            isPaid: true,
            amount: amount,
            razorpay: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            },
        });
        await newOrder.save();
        res.send({
            msg: 'Payment was successfull',
        });
    },
};
