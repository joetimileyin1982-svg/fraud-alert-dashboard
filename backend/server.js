const dotenv = require('dotenv');
// 1. Always load your .env file at the very top
dotenv.config();

// 2. Bring in your secure app configurations from app.js
const app = require('./app');
const connectDB = require('./config/db');

// 3. Open the connection to your MongoDB database
connectDB();

// 4. Set up the server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
