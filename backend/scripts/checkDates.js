const mongoose = require('mongoose');

async function checkDates() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ProductTran');
        console.log('Connected to MongoDB');

        const db = mongoose.connection;
        const collection = db.db.collection('product');

        // Get all documents
        const docs = await collection.find({}).toArray();
        console.log(`\nTotal documents: ${docs.length}`);

        if (docs.length > 0) {
            // Check date formats
            const sampleDates = docs.slice(0, 3).map(doc => ({
                id: doc.id,
                dateOfSale: doc.dateOfSale,
                dateType: typeof doc.dateOfSale,
                isDate: doc.dateOfSale instanceof Date
            }));

            console.log('\nSample dates:', JSON.stringify(sampleDates, null, 2));

            // Count documents by month
            const monthCounts = await collection.aggregate([
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

            console.log('\nDocuments by month:', monthCounts);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

checkDates().catch(console.error);