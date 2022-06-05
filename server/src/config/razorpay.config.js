const Razorpay = require('razorpay');
const env = require('./config');

const instance = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });

function createOrder(options) {
    return new Promise((resolve, reject) => {
        instance.orders.create(options, (err, order) => {
            if (err) {
                reject(err);
            } else {
                resolve(order);
            }
        });
    });
}

module.exports = {
    createOrder,
};
