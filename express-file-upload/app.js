const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const app = express();

mongoose.connect('mongodb://localhost:27017/express-file-upload', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, png) and documents (pdf, docx) are allowed!'));
        }
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', upload.array('files', 5), async(req, res) => {
    try {
        const { username, email } = req.body;
        const files = req.files.map(file => file.path);

        const newUser = new User({ username, email, files });
        await newUser.save();

        res.redirect('/files');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.get('/files', async(req, res) => {
    try {
        const users = await User.find();
        res.render('list', { users });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));