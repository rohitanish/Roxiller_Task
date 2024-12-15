const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rohitanish86:mittuanish@cluster0.0eyoi.mongodb.net/ProductTran';

async function checkConnection() {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        console.log('Connection URI:', MONGODB_URI);
        
        const conn = await mongoose.connect(MONGODB_URI);
        console.log('\nConnection successful!');
        console.log('Database:', conn.connection.name);

        const db = mongoose.connection.db;
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('\nCollections:', collections.map(c => c.name));

        // Get sample documents
        const docs = await db.collection('product').find({})
            .sort({ _id: -1 })
            .limit(5)
            .toArray();

        console.log('\nLatest 5 documents:');
        docs.forEach(doc => {
            console.log('\nDocument:', {
                _id: doc._id.toString(),
                id: doc.id,
                title: doc.title,
                dateOfSale: doc.dateOfSale
            });
        });

    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

checkConnection();