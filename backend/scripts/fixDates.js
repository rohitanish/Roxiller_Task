const mongoose = require('mongoose');

async function fixDates() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/ProductTran');
        console.log('Connected successfully!');

        const db = mongoose.connection;
        const collection = db.collection('product');

        // Get all documents
        const documents = await collection.find({}).toArray();
        console.log(`Found ${documents.length} documents to process`);

        // Update each document with proper date
        let updated = 0;
        for (const doc of documents) {
            try {
                await collection.updateOne(
                    { _id: doc._id },
                    { 
                        $set: { 
                            dateOfSale: new Date(doc.dateOfSale) 
                        } 
                    }
                );
                updated++;
            } catch (err) {
                console.error(`Error updating document ${doc._id}:`, err);
            }
        }

        console.log(`Updated ${updated} documents`);

        // Verify updates
        const sampleDoc = await collection.findOne();
        console.log('\nSample document after update:', {
            id: sampleDoc.id,
            dateOfSale: sampleDoc.dateOfSale,
            dateType: typeof sampleDoc.dateOfSale
        });

        // Test date query
        const februaryDocs = await collection.find({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, 2]
            }
        }).toArray();

        console.log(`\nDocuments in February after fix: ${februaryDocs.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

fixDates();