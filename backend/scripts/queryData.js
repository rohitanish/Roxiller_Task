const mongoose = require('mongoose');

async function queryData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/ProductTran');
        console.log('Connected successfully!');

        const db = mongoose.connection.db;
        const collection = db.collection('product');

        // Convert string dates to Date objects
        const updateResult = await collection.updateMany(
            { dateOfSale: { $type: 'string' } },
            [{ 
                $set: { 
                    dateOfSale: { $dateFromString: { dateString: '$dateOfSale' } }
                }
            }]
        );
        console.log('\nUpdated dates:', updateResult.modifiedCount);

        // Get documents by month
        const monthlyData = await collection.aggregate([
            {
                $group: {
                    _id: { $month: '$dateOfSale' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).toArray();

        console.log('\nDocuments by month:', monthlyData);

        // Get all documents sorted by date
        const allDocs = await collection.find({})
            .sort({ dateOfSale: 1 })
            .toArray();

        console.log('\nAll documents sorted by date:');
        allDocs.forEach(doc => {
            console.log(`ID: ${doc.id}, Date: ${doc.dateOfSale}, Title: ${doc.title}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

queryData();