const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/jwtcrud', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

const StudentSchema = new mongoose.Schema({
    name: String,
    age: Number
});
const Student = mongoose.model('Student', StudentSchema);

const authenticateJWT = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ username: user.username }, 'your_jwt_secret');
    res.json({ token });
});

app.get('/students', authenticateJWT, async(req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/students', authenticateJWT, async(req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send('Student created');
});

app.put('/students/:id', authenticateJWT, async(req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
});

app.delete('/students/:id', authenticateJWT, async(req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.send('Student deleted');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});