const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');

const app = express();

mongoose.connect('mongodb://localhost:27017/student_management', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/student_management' })
}));

app.use('/', authRoutes);

app.use('/students', studentRoutes);

app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});