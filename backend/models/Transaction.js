const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
}, { 
    collection: 'product',  // specifying the exact collection name
    strict: false  // this will allow for flexibility in document structure
});

module.exports = mongoose.model('Transaction', transactionSchema, 'product');  // explicitly specify collection name