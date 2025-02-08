import { format } from 'date-fns'
import { getCategoryColor } from '../utils/colors'
import { expenseService } from '../services/expenseService'

function ExpenseList({ expenses, selectedCategory, selectedDate, onExpenseDeleted }) {
  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory
    const date = new Date(expense.date)
    const monthMatch = selectedDate.month === 'all' || date.getMonth() === parseInt(selectedDate.month)
    const yearMatch = selectedDate.year === 'all' || date.getFullYear() === parseInt(selectedDate.year)
    const dayMatch = selectedDate.day === 'all' || date.getDate() === parseInt(selectedDate.day)
    return categoryMatch && monthMatch && yearMatch && dayMatch
  })

  const handleDelete = async (id) => {
    try {
      await expenseService.deleteExpense(id)
      onExpenseDeleted()
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  if (!expenses.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-blue-500/30 p-8 text-center h-full">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-xl text-blue-200 mb-2">No Expenses Yet</h3>
        <p className="text-blue-200/70">Add your first expense to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-blue-500/30 h-full overflow-hidden flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-3 border-b border-blue-500/30">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-blue-200">Expense List</h2>
          <span className="text-sm text-blue-200/70">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
          </span>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        {/* List Content */}
        <div className="divide-y divide-blue-500/20">
          {filteredExpenses.map(expense => (
            <div
              key={expense._id}
              className="group hover:bg-gray-700/50 transition-colors border-b border-blue-500/20 last:border-b-0"
            >
              <div className="p-3 flex items-center gap-3">
                {/* Category Indicator */}
                <div 
                  className="w-1.5 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(expense.category) }}
                />
                
                {/* Expense Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-blue-200 truncate">
                      {expense.category}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-base font-semibold text-blue-100">
                        ${expense.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 text-sm bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-blue-200/60 block truncate mt-0.5">
                    {format(new Date(expense.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExpenseList 