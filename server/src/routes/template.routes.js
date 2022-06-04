const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/chat.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/videoc.html'));
});

module.exports = router;
