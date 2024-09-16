const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Invalid username or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).send('Invalid username or password');
    }

    req.session.userId = user._id;
    res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;