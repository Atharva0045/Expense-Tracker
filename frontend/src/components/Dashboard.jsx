import { useState, useEffect, useCallback, useRef } from 'react'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import Charts from './Charts'
import Report from './Report'
import CategoryFilter from './CategoryFilter'
import { useError } from '../context/ErrorContext'
import { expenseService } from '../services/expenseService'

function Dashboard() {
  const { showError } = useError()
  const [expenses, setExpenses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState({ month: 'all', year: 'all', day: 'all' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const chartsRef = useRef(null)

  // Function to fetch expenses
  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await expenseService.getAllExpenses()
      console.log('Fetched expenses:', data)
      setExpenses(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching expenses:', err)
      setError('Failed to load expenses')
      showError('Failed to load expenses')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleAddExpense = async (expense) => {
    try {
      // Add the expense and get the response
      const newExpense = await expenseService.addExpense(expense);
      
      // Only update the local state, don't fetch from server
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    } catch (err) {
      console.error('Error adding expense:', err);
      showError('Failed to add expense');
    }
  };

  const handleDateChange = ({ month, year }) => {
    setSelectedDate(prev => ({
      ...prev,
      ...(month && { month }),
      ...(year && { year })
    }))
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-indigo-200">Loading expenses...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className="absolute inset-0 p-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column */}
          <div className="col-span-3 flex flex-col h-full overflow-hidden">
            {/* Form Section */}
            <div className="flex-shrink-0 mb-2">
              <div className="bg-gray-800/50 p-3 rounded-lg border border-indigo-500/30 backdrop-blur-sm shadow-lg">
                <ExpenseForm onAddExpense={handleAddExpense} />
                {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
              </div>
            </div>
            
            {/* List Section */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ExpenseList 
                expenses={expenses}
                selectedCategory={selectedCategory}
                selectedDate={selectedDate}
                onExpenseDeleted={fetchExpenses}
              />
            </div>
          </div>

          {/* Middle Column - Fixed Height for Charts */}
          <div className="col-span-6">
            <div className="h-[500px]">
              <Charts 
                ref={chartsRef}
                expenses={expenses}
                selectedCategory={selectedCategory}
                selectedDate={selectedDate}
                onCategoryChange={setSelectedCategory}
                onDateChange={handleDateChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3 max-h-full overflow-auto">
            <Report 
              expenses={expenses} 
              charts={chartsRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard