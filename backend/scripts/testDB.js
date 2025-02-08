const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the Expense model
    const Expense = require('../models/Expense');

    // Count documents
    const count = await Expense.countDocuments();
    console.log(`Total expenses: ${count}`);

    // Get latest 5 expenses
    const latest = await Expense.find().sort({ createdAt: -1 }).limit(5);
    console.log('\nLatest expenses:');
    console.log(JSON.stringify(latest, null, 2));

    // Get expenses by category
    const byCategory = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    console.log('\nExpenses by category:');
    console.log(JSON.stringify(byCategory, null, 2));

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testDatabase(); 