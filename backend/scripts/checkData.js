const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ProductTran');
        console.log('Connected to MongoDB');

        // Get the collection
        const collection = mongoose.connection.collection('product');
        
        // Check if data exists
        const count = await collection.countDocuments();
        console.log(`Found ${count} documents in collection`);

        if (count === 0) {
            console.log('No data found. Please make sure your database is populated.');
            console.log('Collection name should be: product');
            console.log('Database name should be: ProductTran');
        } else {
            // Show sample document
            const sample = await collection.findOne();
            console.log('Sample document:', sample);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

connectDB();