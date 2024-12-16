
const Transaction = require('../models/Transaction');

const transactionController = {
 
  getTransactions: async (req, res) => {
    try {
      const { month, search = '', page = 1, perPage = 10 } = req.query;
      const skip = (page - 1) * perPage;

      const monthQuery = {
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
        }
      };

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

      const [transactions, total] = await Promise.all([
        Transaction.find(searchQuery)
          .skip(skip)
          .limit(parseInt(perPage)),
        Transaction.countDocuments(searchQuery)
      ]);

      res.json({
        transactions,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / perPage)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
};

module.exports = transactionController;
