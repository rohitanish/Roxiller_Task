const mongoose = require('mongoose');

async function verifyData() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/ProductTran', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected successfully!');
        
        // Get database and collection information
        console.log('\nConnection details:');
        console.log('Database name:', conn.connection.name);
        console.log('Host:', conn.connection.host);
        console.log('Port:', conn.connection.port);

        const db = mongoose.connection.db;
        const collection = db.collection('product');

        // Count documents
        const count = await collection.countDocuments();
        console.log('\nTotal documents:', count);

        if (count > 0) {
            // Get all documents
            const docs = await collection.find({}).limit(2).toArray();
            console.log('\nFirst two documents:', JSON.stringify(docs, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

verifyData();