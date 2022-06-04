const router = require('express').Router();
const controller = require('../controllers/automessage.controller');

router.post('/send', controller.saveRequestMessage);
router.get('/get', controller.getMessage);
router.post('/event', controller.getMessageEvent);

module.exports = router;
