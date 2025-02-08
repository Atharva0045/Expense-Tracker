const API_URL = import.meta.env.VITE_API_URL;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred while parsing the error response'
    }));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error,
      url: response.url
    });
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const expenseService = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return handleResponse(response);
    } catch (error) {
      throw new Error('Unable to connect to the server');
    }
  },

  async getAllExpenses() {
    try {
      console.log('Fetching expenses from:', `${API_URL}/expenses`);
      const response = await fetch(`${API_URL}/expenses`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  },

  async addExpense(expense) {
    try {
      console.log('Adding expense:', expense);
      const url = `${API_URL}/expenses`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add expense');
      }
      
      // Return the newly created expense
      const newExpense = await response.json();
      console.log('Successfully added expense:', newExpense);
      return newExpense;
    } catch (error) {
      console.error('addExpense error:', error);
      throw error;
    }
  },

  async deleteExpense(id) {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/expenses/ping`);
      console.log('Ping response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  validateExpense(expense) {
    const errors = [];
    
    if (!expense.amount || isNaN(Number(expense.amount))) {
      errors.push('Amount must be a valid number');
    }
    
    const allowedCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];
    if (!expense.category || !allowedCategories.includes(expense.category)) {
      errors.push(`Category must be one of: ${allowedCategories.join(', ')}`);
    }
    
    return errors;
  }
}; 