const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Category = require('./models/Category');
const Product = require('./models/Product');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Welcome to the Product Management System');
});

app.get('/categories', async(req, res) => {
    const categories = await Category.find();
    res.render('categories/index', { categories });
});

app.get('/categories/new', (req, res) => {
    res.render('categories/new');
});

app.post('/categories', async(req, res) => {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.redirect('/categories');
});

app.get('/categories/:id/edit', async(req, res) => {
    const category = await Category.findById(req.params.id);
    res.render('categories/edit', { category });
});

app.post('/categories/:id', async(req, res) => {
    await Category.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/categories');
});

app.post('/categories/:id/delete', async(req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
});

app.get('/products', async(req, res) => {
    const products = await Product.find().populate('category');
    res.render('products/index', { products });
});

app.get('/products/new', async(req, res) => {
    const categories = await Category.find();
    res.render('products/new', { categories });
});

app.post('/products', upload.array('images'), async(req, res) => {
    const imagePaths = req.files.map(file => file.path);
    const newProduct = new Product({...req.body, images: imagePaths });
    await newProduct.save();
    res.redirect('/products');
});

app.get('/products/:id/edit', async(req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find();
    res.render('products/edit', { product, categories });
});

app.post('/products/:id', upload.array('images'), async(req, res) => {
    const imagePaths = req.files.map(file => file.path);
    const updatedProduct = {...req.body, images: imagePaths };
    await Product.findByIdAndUpdate(req.params.id, updatedProduct);
    res.redirect('/products');
});

app.post('/products/:id/delete', async(req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});