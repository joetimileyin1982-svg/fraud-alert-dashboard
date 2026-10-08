const dotenv = require('dotenv');
// 1. Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// 2. Open connection to your MongoDB database
connectDB().then(async () => {
  try {
    // 🌟 FORCE DROP: This line reaches into your database and wipes out the broken phone index constraint!
    await mongoose.connection.db.collection('users').dropIndex('phone_1');
    console.log('🗑️ Successfully dropped the broken unique phone index constraint!');
  } catch (err) {
    console.log('💡 Index already dropped or not found, proceeding safely...');
  }
});

// 3. Set up the server port
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
