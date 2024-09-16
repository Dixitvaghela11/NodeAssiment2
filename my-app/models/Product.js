const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: String,
    price: { type: Number, required: true },
    images: [String]
});

module.exports = mongoose.model('Product', ProductSchema);