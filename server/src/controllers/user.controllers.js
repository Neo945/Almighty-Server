// const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');
const transport = require('../config/mailer.config');
const { URL } = require('../server');
const { uploadSingleImage } = require('../config/s3.config');

module.exports = {
    getUser: (req, res) => {
        errorHandler(req, res, async () => {
            const artist = await User.findOne({ user: req.user._id }).populate('user', '-password');
            res.status(200).json({ message: 'success', artist });
        });
    },
    updatePassword: (req, res) => {
        errorHandler(req, res, async () => {
            const { oldPassword, newPassword } = req.body;
            if (req.user.isVerified) {
                if (await User.updatePassword(req.user._id, oldPassword, newPassword))
                    return res.status(200).json({ message: 'success' });
                return res.status(400).json({ message: 'old password is not correct' });
            }
            return res.status(400).json({ message: 'old password is not correct' });
        });
    },
    registerUser: (req, res) => {
        errorHandler(req, res, async () => {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                user = await User.create({ ...req.body });
            }
            const token = await User.generateEmailVerificationToken(user._id);
            if (token) {
                const url = `${URL}/verify/${token}`;
                const message = `<h1>Please verify your email</h1>
                    <p>Click on the link below to verify your email</p>
                    <a href="${url}">${url}</a>`;
                transport(req.user.email, 'Learnit Verification', message);
                res.json({ message: 'success' });
            } else {
                res.json({ message: 'Unable to generate token' });
            }
            res.status(201).json({ success: true, message: 'success', user: { ...user, password: null } });
        });
    },
    createUser: (req, res) => {
        errorHandler(req, res, async () => {
            if (!(await User.exists({ email: req.body.email }))) {
                uploadSingleImage(req, res, async (err) => {
                    if (err) res.status(500).json({ error: err });
                    const user = await User.create({ ...req.body, image: req.file.location });
                    if (user) {
                        const message = '<h1>Welcome</h1><p>Click on the link below to verify your email</p>';
                        transport(req.user.email, 'Learnit Verification', message);
                        res.status(201).json({ success: true, message: 'success', user: { ...user, password: null } });
                    }
                    res.status(400).json({ message: 'Unable to create user' });
                });
            } else res.status(400).json({ message: 'User already exists' });
        });
    },
    login: (req, res) => {
        errorHandler(req, res, async () => {
            const { password, email } = req.body;
            const token = await User.login(email, password);
            if (token) {
                res.cookie('jwt', token, {
                    maxAge: require('../config/config').TOKEN_LENGTH,
                });
                res.status(201).json({ mesage: 'login Successful' });
            } else {
                res.clearCookie('jwt');
                res.json({ mesage: 'User not found' });
            }
        });
    },
    logout: (req, res) => {
        errorHandler(req, res, () => {
            try {
                req.logout();
            } catch (err) {
                console.log(err);
            }
            res.clearCookie('jwt');
            res.json({ mesage: 'Logged out successfully' });
        });
    },
    googleOauthRedirect: (req, res) => {
        res.redirect(`${URL}/`);
    },
    sendEmailVerfication: async (req, res) => {
        errorHandler(req, res, async () => {
            /**
             * send token[:3] as the room to join
             */
            const token = await User.generateEmailVerificationToken(req.user ? req.user._id : req.body._id);
            if (token) {
                const url = `${URL}/verify/${token}`;
                const message = `<h1>Please verify your email</h1>
                    <p>Click on the link below to verify your email</p>
                    <a href="${url}">${url}</a>`;
                transport(req.user.email, 'Email Verification', message);
                res.json({ message: 'success' });
            } else {
                res.json({ message: 'Unable to generate token' });
            }
        });
    },
    verifyEmailToken: async (req, res) => {
        errorHandler(req, res, async () => {
            const { token } = req.body;
            const isVerified = await User.verifyEmailToken(req.user._id, token);
            if (isVerified) {
                res.json({ message: 'Email varified!! Now go back and complete teh form' });
            } else {
                res.json({ message: 'Email not verified' });
            }
        });
    },
    emailVerificationRedirct: async (req, res) => {
        res.redirect('http://localhost:3000/verify');
    },
};
