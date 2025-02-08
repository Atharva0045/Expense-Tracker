import { useState } from 'react'
import { format } from 'date-fns'
import { expenseService } from '../services/expenseService'

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function ExpenseForm({ onAddExpense }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [day, setDay] = useState(new Date().getDate())
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !category) return

    try {
      const expenseData = {
        amount: parseFloat(amount),
        category,
        date: new Date(year, month, day)
      }
      await onAddExpense(expenseData)
      resetForm()
    } catch (error) {
      console.error('Failed to add expense:', error)
      showError(error.message || 'Failed to add expense')
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(''), 3000)
  }

  const resetForm = () => {
    setAmount('')
    setCategory('')
    setDay(new Date().getDate())
    setMonth(new Date().getMonth())
    setYear(new Date().getFullYear())
  }

  return (
    <>
      <h2 className="text-lg mb-2 font-semibold text-indigo-200">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="flex-1 bg-gray-700/50 p-1.5 rounded border border-indigo-500/30 focus:outline-none focus:border-indigo-500 text-indigo-100 placeholder-indigo-300/50 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-gray-700/50 p-1.5 rounded border border-indigo-500/30 focus:outline-none focus:border-indigo-500 text-indigo-100 text-sm"
          >
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-700">{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="flex-1 bg-gray-700/50 p-1.5 rounded border border-indigo-500/30 focus:outline-none focus:border-indigo-500 text-indigo-100 text-sm"
          >
            {months.map((monthName, index) => (
              <option key={monthName} value={index} className="bg-gray-700">{monthName}</option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-16 bg-gray-700/50 p-1.5 rounded border border-indigo-500/30 focus:outline-none focus:border-indigo-500 text-indigo-100 text-sm"
          >
            {days.map(day => (
              <option key={day} value={day} className="bg-gray-700">{day}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-20 bg-gray-700/50 p-1.5 rounded border border-indigo-500/30 focus:outline-none focus:border-indigo-500 text-indigo-100 text-sm"
          >
            {years.map(year => (
              <option key={year} value={year} className="bg-gray-700">{year}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-3 py-1.5 bg-indigo-600 rounded hover:bg-indigo-700 transition-all duration-300 text-white text-sm font-medium"
        >
          Add Expense
        </button>
      </form>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </>
  )
}

export default ExpenseForm 