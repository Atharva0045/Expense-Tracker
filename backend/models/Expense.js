const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Other']
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema); 