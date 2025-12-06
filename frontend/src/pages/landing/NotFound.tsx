import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';

export const NotFound = () => {
  return (
    <main className="flex-1 bg-gradient-to-b from-gray-100 to-white min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-8">
          {['4', '0', '4'].map((number, index) => (
            <div
              key={index}
              className={`text-8xl md:text-9xl font-bold ${
                index === 1 ? 'text-red-700' : 'text-black'
              }`}
            >
              {number}
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <RefreshCw className="w-16 h-16 text-red-700" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have disappeared into the digital void.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
};