const mongoose = require('mongoose');

// Define the schema
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
    collection: 'product' 
});

// Create the model
const Transaction = mongoose.model('Transaction', transactionSchema);

async function testDatabase() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/ProductTran');
        console.log('Connected successfully!');

        // Count documents
        const count = await Transaction.countDocuments();
        console.log(`\nTotal documents in collection: ${count}`);

        if (count > 0) {
            // Get one document
            const sampleDoc = await Transaction.findOne();
            console.log('\nSample document:', JSON.stringify(sampleDoc, null, 2));
        }

        // Test month query
        const februaryDocs = await Transaction.find({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, 2]
            }
        });

        console.log(`\nDocuments in February: ${februaryDocs.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

testDatabase();