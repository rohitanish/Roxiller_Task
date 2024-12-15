const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rohitanish86:mittuanish@cluster0.0eyoi.mongodb.net/ProductTran';

const connectDB = async () => {
    try {
        console.log('\x1b[33m%s\x1b[0m', '[mongodb]', 'Attempting to connect to MongoDB Atlas...');
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('\x1b[42m%s\x1b[0m', '[success]', 'MongoDB Connected successfully');
        console.log('\x1b[36m%s\x1b[0m', '[info]', `Database: ${conn.connection.name}`);

        // Check collection data
        const collection = mongoose.connection.collection('product');
        const count = await collection.countDocuments();
        console.log('\x1b[36m%s\x1b[0m', '[info]', `Found ${count} documents in collection`);

    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', '[error]', 'Error connecting to MongoDB:');
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;