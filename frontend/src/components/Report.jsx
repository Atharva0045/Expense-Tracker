import { useRef } from 'react'
import { getCategoryColor } from '../utils/colors'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function Report({ expenses, charts }) {
  const reportRef = useRef(null)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const handleDownload = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      let yOffset = 20

      // Add title
      pdf.setFontSize(20)
      pdf.text('Expense Report', pageWidth / 2, yOffset, { align: 'center' })
      yOffset += 20

      // Add date
      pdf.setFontSize(12)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yOffset)
      yOffset += 15

      // Add total expenses
      pdf.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, yOffset)
      yOffset += 15

      // Add category breakdown with colors
      pdf.text('Category Breakdown:', 20, yOffset)
      yOffset += 10

      Object.entries(categoryTotals).forEach(([category, amount]) => {
        // Draw color box
        const color = getCategoryColor(category)
        pdf.setFillColor(...hexToRGB(color))
        pdf.rect(25, yOffset - 3, 5, 5, 'F')
        
        // Add category text and amount
        pdf.text(`${category}: $${amount.toFixed(2)}`, 35, yOffset)
        yOffset += 8
      })
      yOffset += 10

      // Add charts if available
      if (charts?.current) {
        const chartsCanvas = await html2canvas(charts.current, {
          scale: 2,
          backgroundColor: null
        })
        const chartsImage = chartsCanvas.toDataURL('image/png')
        const imageWidth = pageWidth - 40 // 20mm margin on each side
        const imageHeight = (chartsCanvas.height * imageWidth) / chartsCanvas.width

        // Add new page if charts won't fit
        if (yOffset + imageHeight > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage()
          yOffset = 20
        }

        // Add chart title
        pdf.text('Expense Charts', 20, yOffset)
        yOffset += 10

        pdf.addImage(chartsImage, 'PNG', 20, yOffset, imageWidth, imageHeight)
      }

      // Save the PDF
      pdf.save('expense-report.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  // Helper function to convert hex color to RGB
  const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  return (
    <div ref={reportRef} className="bg-gray-800/50 p-6 rounded-lg border border-indigo-500/30 backdrop-blur-sm shadow-lg">
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
          onClick={handleDownload}
          className="w-full px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-white font-medium shadow-lg hover:shadow-indigo-500/20"
        >
          Download Report
        </button>
      </div>
    </div>
  )
}

export default Report 