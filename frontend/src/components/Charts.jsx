import { useMemo } from 'react'
import {
  PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer
} from 'recharts'
import CategoryFilter from './CategoryFilter'
import { getCategoryColor } from '../utils/colors'

function Charts({ expenses, selectedCategory, selectedDate, onCategoryChange, onDateChange }) {
  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory
    const date = new Date(expense.date)
    const monthMatch = selectedDate.month === 'all' || date.getMonth() === parseInt(selectedDate.month)
    const yearMatch = selectedDate.year === 'all' || date.getFullYear() === parseInt(selectedDate.year)
    return categoryMatch && monthMatch && yearMatch
  })

  const pieData = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => {
      const existingCategory = acc.find(item => item.name === curr.category)
      if (existingCategory) {
        existingCategory.value += curr.amount
      } else {
        acc.push({ name: curr.category, value: curr.amount })
      }
      return acc
    }, [])
  }, [filteredExpenses])

  const lineData = useMemo(() => {
    return filteredExpenses
      .map(expense => ({
        date: new Date(expense.date).toLocaleDateString(),
        amount: expense.amount
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredExpenses])

  return (
    <div className="bg-gray-800/50 p-3 rounded-lg border border-cyan-500/30 backdrop-blur-sm shadow-lg h-full flex flex-col">
      <div className="mb-2">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          onCategoryChange={onCategoryChange}
          onDateChange={onDateChange}
        />
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-cyan-200 mb-1">Category Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  fill="#06b6d4"
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={(_, index) => {
                    // Optional: Add hover effect logic here
                  }}
                >
                  {pieData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={getCategoryColor(entry.name)}
                      style={{ filter: 'brightness(1)', transition: 'filter 0.3s' }}
                      onMouseEnter={(e) => {
                        e.target.style.filter = 'brightness(1.2)';
                        e.target.style.cursor = 'pointer';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.filter = 'brightness(1)';
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.95)', // Darker background
                    border: '2px solid rgba(6, 182, 212, 0.5)', // Brighter border
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{
                    color: '#e2e8f0', // Light text color
                    fontSize: '14px',
                    padding: '2px 0'
                  }}
                  formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                  labelStyle={{
                    color: '#94a3b8' // Subtle label color
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-cyan-200 mb-1">Expense Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#06b6d4"
                  tick={{ fill: '#06b6d4' }}
                />
                <YAxis 
                  stroke="#06b6d4"
                  tick={{ fill: '#06b6d4' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts