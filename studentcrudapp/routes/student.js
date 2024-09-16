const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async(req, res) => {
    const students = await Student.find();
    res.render('students/index', { students });
});

router.get('/create', (req, res) => {
    res.render('students/create');
});

router.post('/create', async(req, res) => {
    const { name, age, course } = req.body;
    await Student.create({ name, age, course });
    res.redirect('/students');
});

router.get('/:id/edit', async(req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student });
});

router.post('/:id/edit', async(req, res) => {
    const { name, age, course } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, age, course });
    res.redirect('/students');
});

router.get('/:id/delete', async(req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/students');
});

module.exports = router;