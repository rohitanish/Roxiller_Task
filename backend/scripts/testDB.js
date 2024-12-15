const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ProductTran');
        console.log('Connected to MongoDB');

        // Get direct collection reference
        const db = mongoose.connection.db;
        const collection = db.collection('product');

        // Count documents
        const count = await collection.countDocuments();
        console.log(`Direct count from collection: ${count}`);

        // Get one document
        const sampleDoc = await collection.findOne();
        console.log('Sample document:', sampleDoc);

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

testConnection();
// Add this to backend/scripts/testDB.js
async function testQuery() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ProductTran');
        const collection = mongoose.connection.db.collection('product');
        
        // Test query for February data
        const februaryDocs = await collection.find({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, 2]
            }
        }).toArray();
        
        console.log('February documents:', februaryDocs.length);
        if (februaryDocs.length > 0) {
            console.log('Sample February document:', februaryDocs[0]);
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testQuery();