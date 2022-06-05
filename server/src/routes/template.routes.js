const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../templates/chat.html')));

router.get('/video', (req, res) => res.sendFile(path.join(__dirname, '../templates/videoc.html')));

router.get('/pay', (req, res) => res.sendFile(path.join(__dirname, '../templates/razorpay.html')));

module.exports = router;
