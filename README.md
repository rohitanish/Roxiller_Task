# Transaction Dashboard Project - MERN Stack

## Overview
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that visualizes transaction data with search, filtering, and data visualization capabilities.

## Features
- Monthly transaction listing with pagination
- Search functionality for transactions
- Monthly statistics overview
- Price range distribution visualization
- Category-wise distribution charts
- Responsive design

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm (Node Package Manager)

## Project Structure
mern-transaction-app/ 
mern-transaction-app/
├── backend/
│   ├── config/
│   │   └── db.config.js
│   ├── models/
│   │   └── Transaction.js
│   ├── routes/
│   │   └── api.routes.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── TransactionDashboard.js
    │   ├── App.js
    │   └── index.js
    └── package.json

## Installation

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install express mongoose cors dotenv
    ```
3. Create a `.env` file in the backend directory:
    ```env
    MONGODB_URI=your_mongodb_atlas_connection_string
    PORT=3000
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install react-scripts recharts lucide-react @tailwindcss/forms tailwindcss postcss autoprefixer
    ```
3. Set up Tailwind CSS:
    ```bash
    npx tailwindcss init -p
    ```

## Required Dependencies

### Backend Dependencies
- express
- mongoose
- cors
- dotenv

### Frontend Dependencies
- react
- react-dom
- recharts
- lucide-react
- @tailwindcss/forms
- tailwindcss
- postcss
- autoprefixer

## Killing Ports
if you are trying to restart and run again make sure to kill the ports via cmd
- go to cmd - >administration 
- enter the commands
- netstat -ano |findstr :3000
- find the pid which is at the right of listening 
paste it in the below code
- taskkill /PID XXXX /F (where xxx is the id)

## Running the Application

### Start the Backend Server
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Start the server:
    ```bash
    npm start
    ```
   The server will run on `http://localhost:3000`.

### Start the Frontend Development Server
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Start the development server:
    ```bash
    npm start
    ```
   The frontend will run on `http://localhost:3001`.

## API Endpoints

### GET /api/transactions
Query Parameters:
- `month` (1-12)
- `search` (optional)
- `page` (default: 1)
- `perPage` (default: 10)

### GET /api/statistics/:month
Returns monthly statistics.

### GET /api/bar-chart/:month
Returns price range distribution data.

### GET /api/pie-chart/:month
Returns category distribution data.

## Configuration Files

### tailwind.config.js
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
Production Build
To create an optimized production build:

cd frontend
npm run build
Additional Notes
Ensure MongoDB Atlas is properly configured and accessible.
The backend expects a specific data structure in MongoDB.
The frontend uses Tailwind CSS for styling.
Charts are implemented using the Recharts library.
Troubleshooting
If MongoDB connection fails, check your connection string in .env.
If charts don't load, verify the data format in MongoDB.
For CORS issues, verify the frontend URL in backend CORS configuration.
License
This project is licensed under the MIT License.
