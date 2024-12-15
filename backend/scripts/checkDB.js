const mongoose = require('mongoose');

async function checkDB() {
    try {
        // Connect using the MongoDB driver directly
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/ProductTran');
        console.log('Connected successfully!');

        const db = mongoose.connection.db;

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('\nAvailable collections:', collections.map(c => c.name));

        // Check the product collection specifically
        const productCollection = collections.find(c => c.name === 'product');
        if (productCollection) {
            const count = await db.collection('product').countDocuments();
            console.log('\nDocuments in product collection:', count);

            // Get a sample document
            const sampleDoc = await db.collection('product').findOne();
            if (sampleDoc) {
                console.log('\nSample document structure:', JSON.stringify(sampleDoc, null, 2));
            } else {
                console.log('\nNo documents found in product collection');
            }
        } else {
            console.log('\nProduct collection not found!');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

checkDB();