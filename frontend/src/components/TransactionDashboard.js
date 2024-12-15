// src/components/TransactionDashboard.js

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Search, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const TransactionDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // March by default
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/transactions?month=${selectedMonth}&search=${searchTerm}&page=${page}&perPage=10`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Error loading transactions');
      console.error(err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/${selectedMonth}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics');
    }
  };

  const fetchChartData = async () => {
    try {
      const [barResponse, pieResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/bar-chart/${selectedMonth}`),
        fetch(`${API_BASE_URL}/pie-chart/${selectedMonth}`)
      ]);
      
      if (!barResponse.ok || !pieResponse.ok) {
        throw new Error('Failed to fetch chart data');
      }
      
      const barData = await barResponse.json();
      const pieData = await pieResponse.json();
      
      setBarChartData(barData || []);
      setPieChartData(pieData || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setBarChartData([]);
      setPieChartData([]);
      setError('Failed to load chart data');
    }
  };

 

// Update fetch function
const fetchAllData = async () => {
  setIsLoading(true);
  try {
    await Promise.all([
      fetchTransactions(),
      fetchStatistics(),
      fetchChartData()
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchTransactions(),
        fetchStatistics(),
        fetchChartData()
      ]);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  

  useEffect(() => {
    loadAllData();
  }, [selectedMonth, searchTerm, page]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader className="animate-spin" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Transaction Dashboard</h1>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 p-2 w-full border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="p-2 border rounded-lg"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm">Total Sales</h3>
      <p className="text-2xl font-bold">{formatCurrency(statistics.totalSaleAmount)}</p>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm">Items Sold</h3>
      <p className="text-2xl font-bold">{statistics.totalSoldItems}</p>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm">Items Not Sold</h3>
      <p className="text-2xl font-bold">{statistics.totalNotSoldItems}</p>
    </div>
  </div>
)}
        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {transactions.map((transaction) => (
    <tr key={transaction._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {transaction.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {transaction.title}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {transaction.description}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatCurrency(transaction.price)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {transaction.category}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          transaction.sold 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {transaction.sold ? 'Yes' : 'No'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(transaction.dateOfSale)}
      </td>
    </tr>
  ))}
</tbody>  
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Price Range Distribution</h2>
            <div className="h-80">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="range" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Add loading overlay*/}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <Loader className="animate-spin" />
                <p>Loading...</p>
              </div>
            </div>
          )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
            <div className="h-80">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;