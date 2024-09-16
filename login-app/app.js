const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyparser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

app.use(session({
    store: new FileStore(),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.get('/', (req, res) => {
    if (req.session.username) {
        return res.send(`<h2>Welcome, ${req.session.username}!</h2><br><a href='/logout'>Logout</a>`);
    }
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;


    if (username === 'admin' && password === 'password') {
        req.session.username = username;
        return res.redirect('/');
    }

    res.send('<h2>Login failed. Please try again.</h2><br><a href="/">Go back</a>');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});