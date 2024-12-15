const mongoose = require('mongoose');

const testData = [
    {
        id: 3,  // Changed ID to not conflict with existing data
        title: 'Test Product 3',
        price: 329.85,
        description: 'Test description 3',
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/1.jpg',
        sold: false,
        dateOfSale: new Date('2021-11-27T20:29:54+05:30')
    }
];

async function insertTestData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/ProductTran');
        console.log('Connected successfully!');

        const db = mongoose.connection.db;
        const collection = db.collection('product');

        // First count existing documents
        const beforeCount = await collection.countDocuments();
        console.log(`Existing documents: ${beforeCount}`);

        // Insert new test data without clearing existing data
        const result = await collection.insertMany(testData);
        console.log(`Inserted ${result.insertedCount} documents`);

        // Count after insertion
        const afterCount = await collection.countDocuments();
        console.log(`Total documents after insertion: ${afterCount}`);

        // Show all documents
        const allDocs = await collection.find({}).toArray();
        console.log('\nAll documents:', JSON.stringify(allDocs, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnection closed');
    }
}

insertTestData();