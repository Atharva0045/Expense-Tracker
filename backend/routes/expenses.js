const router = require('express').Router();
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    console.log('Received POST request to /expenses');
    console.log('Request body:', req.body);
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // Validate required fields
    if (!req.body.amount || !req.body.category) {
      console.log('Missing required fields:', req.body);
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body,
        required: ['amount', 'category']
      });
    }

    // Validate amount is a number
    if (isNaN(req.body.amount)) {
      return res.status(400).json({
        message: 'Amount must be a number',
        received: req.body.amount
      });
    }

    // Validate category is in allowed list
    const allowedCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];
    if (!allowedCategories.includes(req.body.category)) {
      return res.status(400).json({
        message: 'Invalid category',
        received: req.body.category,
        allowed: allowedCategories
      });
    }

    const expense = new Expense({
      amount: Number(req.body.amount),
      category: req.body.category,
      date: new Date(req.body.date || Date.now())
    });

    console.log('Created expense object:', expense);

    try {
      const newExpense = await expense.save();
      console.log('Successfully saved expense:', newExpense);
      res.status(201).json(newExpense);
    } catch (saveError) {
      console.error('Error saving expense:', {
        error: saveError,
        stack: saveError.stack,
        modelState: expense.toObject()
      });
      throw saveError;
    }
  } catch (err) {
    console.error('Error in POST /expenses:', err);
    res.status(500).json({ 
      message: err.message,
      type: err.name,
      details: err.errors
    });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get database stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: await Expense.countDocuments(),
      byCategory: await Expense.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        }
      ]),
      latest: await Expense.find().sort({ createdAt: -1 }).limit(5)
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Test endpoint to add sample data
router.post('/test-data', async (req, res) => {
  try {
    const sampleExpenses = [
      {
        amount: 50.00,
        category: 'Food',
        date: new Date()
      },
      {
        amount: 30.00,
        category: 'Transport',
        date: new Date()
      },
      {
        amount: 100.00,
        category: 'Bills',
        date: new Date()
      }
    ];

    const result = await Expense.insertMany(sampleExpenses);
    res.status(201).json({
      message: 'Sample data added successfully',
      count: result.length,
      expenses: result
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add this test route at the top of your routes
router.get('/test-connection', async (req, res) => {
  try {
    // Test database write
    const testExpense = new Expense({
      amount: 1,
      category: 'Test',
      date: new Date()
    });
    await testExpense.save();
    
    // Test database read
    const testRead = await Expense.findById(testExpense._id);
    
    // Test database delete
    await Expense.findByIdAndDelete(testExpense._id);
    
    res.json({
      status: 'success',
      message: 'Database operations working correctly',
      connectionState: mongoose.connection.readyState,
      testData: testRead
    });
  } catch (err) {
    console.error('Database test failed:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
      details: {
        name: err.name,
        code: err.code
      }
    });
  }
});

// Add this near the top of your routes
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'Expenses API is working',
    timestamp: new Date(),
    headers: req.headers
  });
});

// Add a test endpoint to verify database writes
router.post('/test-write', async (req, res) => {
  try {
    // Test simple write
    const testExpense = new Expense({
      amount: 10,
      category: 'Test',
      date: new Date()
    });
    
    console.log('Attempting to save test expense...');
    const saved = await testExpense.save();
    console.log('Test expense saved successfully:', saved);
    
    res.json({
      success: true,
      savedExpense: saved,
      connectionState: mongoose.connection.readyState
    });
  } catch (err) {
    console.error('Test write failed:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

module.exports = router; 