// const errorHandler = require('../utils/errorHandler');
const AutoMessage = require('../models/automessage.model');
const transporter = require('../config/mailer.config');

const { sendRequest, requestMessage, requestEvent } = require('../config/dialogflow.config');

module.exports = {
    // eslint-disable-next-line consistent-return
    saveRequestMessage: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Un authorized' });
        }
        const requestData = requestMessage(req.body.message, req.body.language);
        const response = await sendRequest(requestData);
        const message = await AutoMessage.create({
            ...req.body,
            user: req.user._id,
            response: response[0].queryResult.fulfillmentText,
        });
        if (response[0].queryResult.action === 'fill.form' && response[0].queryResult.allRequiredParamsPresent) {
            const { email } = req.user;
            // eslint-disable-next-line no-shadow
            const message = '<h1>Thank you for reaching out</h1><p>We will contact you soon!!</p>';
            console.log(await transporter(email, 'Chabot Feedback', message));
        } else if (response[0].queryResult.action === 'add.items' && response[0].queryResult.allRequiredParamsPresent) {
            const product = response[0].queryResult.parameters.fields.item.stringValue;

            return res.send({ message, user: req.user.username, product });
        } else if (response[0].queryResult.action === 'remove.items' && response[0].queryResult.allRequiredParamsPresent) {
            const Removeproduct = response[0].queryResult.parameters.fields.item.stringValue;

            return res.send({ message, user: req.user.username, Removeproduct });
        }
        res.send({ message, user: req.user.username });
    },
    // eslint-disable-next-line consistent-return
    getMessage: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        console.log(req.user);
        const messages = await AutoMessage.find({
            $and: [{ user: req.user?._id }, { $gt: [{ $strLenCP: '$message' }, 1] }],
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit, 10) * 10);
        res.send(messages);
    },
    // eslint-disable-next-line consistent-return
    getMessageEvent: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const requestData = requestEvent(req.body.event, req.body.language);
        const response = await sendRequest(requestData);

        const message = await AutoMessage.create({
            user: req.user._id,
            response: response[0].queryResult.fulfillmentText,
        });
        res.send({ message, user: req.user.username });
    },
};
