import { format } from 'date-fns'

function CategoryFilter({ onCategoryChange, onDateChange, selectedCategory, selectedDate }) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({length: 5}, (_, i) => currentYear - i)
  const months = Array.from({length: 12}, (_, i) => {
    const date = new Date(2024, i, 1)
    return {
      value: i,
      label: format(date, 'MMMM')
    }
  })

  return (
    <div className="flex gap-4 mb-6">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-gray-700/50 p-2 rounded-lg border border-cyan-500/30 focus:outline-none focus:border-cyan-500 text-cyan-100"
      >
        <option value="all">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>

      <select
        onChange={(e) => onDateChange({ month: e.target.value })}
        className="bg-gray-700/50 p-2 rounded-lg border border-cyan-500/30 focus:outline-none focus:border-cyan-500 text-cyan-100"
      >
        <option value="all">All Months</option>
        {months.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onDateChange({ year: e.target.value })}
        className="bg-gray-700/50 p-2 rounded-lg border border-cyan-500/30 focus:outline-none focus:border-cyan-500 text-cyan-100"
      >
        <option value="all">All Years</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategoryFilter 