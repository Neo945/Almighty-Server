const router = require('express').Router();
const controller = require('../controllers/vc.controller');

router.get('/get', controller.getVCRoom);
router.get('/room', controller.getRoom);

module.exports = router;
