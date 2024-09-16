const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const app = express();
const port = 3000;

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        req.session.user = username;
        res.status(200).send('Login successful');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.status(200).send(`Hello, ${req.session.user}`);
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});