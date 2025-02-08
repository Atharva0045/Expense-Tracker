import { getCategoryColor } from '../utils/colors'

function Report({ expenses }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-indigo-500/30 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl mb-4 font-semibold text-indigo-200">Report</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-700/50 rounded-lg border border-indigo-500/20">
          <h3 className="text-lg mb-2 text-indigo-300">Total Expenses</h3>
          <p className="text-2xl font-semibold text-indigo-100">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg text-indigo-300">Category Breakdown</h3>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div 
              key={category}
              className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-indigo-500/20 hover:bg-gray-700/70 transition-all duration-300"
              style={{ borderLeftWidth: '4px', borderLeftColor: getCategoryColor(category) }}
            >
              <span style={{ color: getCategoryColor(category) }}>{category}</span>
              <span className="text-indigo-100 font-medium">
                ${amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <button 
          className="w-full px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-white font-medium shadow-lg hover:shadow-indigo-500/20"
        >
          Download Report
        </button>
      </div>
    </div>
  )
}

export default Report 