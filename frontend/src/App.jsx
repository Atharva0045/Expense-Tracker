import { ErrorProvider } from './context/ErrorContext';
import ErrorAlert from './components/ErrorAlert';
import Dashboard from './components/Dashboard'

function App() {
  return (
    <ErrorProvider>
      <ErrorAlert />
      <div className="min-h-screen bg-gray-900 text-indigo-300 p-8">
        <Dashboard />
      </div>
    </ErrorProvider>
  )
}

export default App
