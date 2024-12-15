const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// List Transactions API
router.get('/transactions', async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    console.log('\n[Transaction Request]', {
      month,
      search,
      page,
      perPage,
      skip
    });

    const monthQuery = {
      $expr: {
        $eq: [{ $month: { $dateFromString: { dateString: '$dateOfSale' } } }, parseInt(month)]
      }
    };

    console.log('[MongoDB] Month Query:', JSON.stringify(monthQuery));

    const searchQuery = search
      ? {
          $and: [
            monthQuery,
            {
              $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: isNaN(search) ? null : parseFloat(search) }
              ]
            }
          ]
        }
      : monthQuery;

    console.log('[MongoDB] Final Query:', JSON.stringify(searchQuery));

    const [transactions, total] = await Promise.all([
      Transaction.find(searchQuery)
        .skip(skip)
        .limit(parseInt(perPage)),
      Transaction.countDocuments(searchQuery)
    ]);

    console.log('[Response]', {
      transactionsFound: transactions.length,
      totalDocuments: total,
      currentPage: page,
      totalPages: Math.ceil(total / perPage)
    });

    res.json({
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / perPage)
    });
  } catch (error) {
    console.error('[Error] Transactions API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statistics API
router.get('/statistics/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    console.log('\n[Statistics Request] Month:', month);

    const monthQuery = {
      $expr: {
        $eq: [{ $month: { $dateFromString: { dateString: '$dateOfSale' } } }, month]
      }
    };

    console.log('[MongoDB] Statistics Query:', JSON.stringify(monthQuery));

    const [totalSaleAmount, soldItems, notSoldItems] = await Promise.all([
      Transaction.aggregate([
        { 
          $match: monthQuery 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$price' } 
          } 
        }
      ]),
      Transaction.countDocuments({ ...monthQuery, sold: true }),
      Transaction.countDocuments({ ...monthQuery, sold: false })
    ]);

    const response = {
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems: soldItems,
      totalNotSoldItems: notSoldItems
    };

    console.log('[Response] Statistics:', response);
    res.json(response);
  } catch (error) {
    console.error('[Error] Statistics API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bar Chart API
router.get('/bar-chart/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    console.log('\n[Bar Chart Request] Month:', month);

    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: { $dateFromString: { dateString: '$dateOfSale' } } }, month]
          }
        }
      },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
          default: '901-above',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const response = result.map(item => ({
      range: item._id === '901-above' ? '901-above' : `${item._id}-${item._id + 99}`,
      count: item.count
    }));

    console.log('[Response] Bar Chart:', response);
    res.json(response);
  } catch (error) {
    console.error('[Error] Bar Chart API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pie Chart API
router.get('/pie-chart/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    console.log('\n[Pie Chart Request] Month:', month);

    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: { $dateFromString: { dateString: '$dateOfSale' } } }, month]
          }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const response = result.map(item => ({
      category: item._id,
      count: item.count
    }));

    console.log('[Response] Pie Chart:', response);
    res.json(response);
  } catch (error) {
    console.error('[Error] Pie Chart API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route
router.get('/debug/data', async (req, res) => {
  try {
    const count = await Transaction.countDocuments();
    const sample = await Transaction.findOne();
    const dateExample = sample ? sample.dateOfSale : null;

    console.log('\n[Debug] Database Status:', {
      totalDocuments: count,
      sampleDateFormat: dateExample,
      hasData: count > 0
    });

    res.json({
      totalDocuments: count,
      sampleDocument: sample,
      databaseStatus: 'connected'
    });
  } catch (error) {
    console.error('[Error] Debug route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;