import { useError } from '../context/ErrorContext';

function ErrorAlert() {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
        <span className="text-sm">{error}</span>
        <button 
          onClick={clearError}
          className="ml-2 text-white hover:text-red-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ErrorAlert; 