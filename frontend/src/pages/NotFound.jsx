import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
          <ChefHat className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-7xl font-black text-gray-900 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Oops! Recipe Not Found</h2>
          <p className="text-gray-500 text-sm mt-2">
            The page you are looking for seems to have vanished from the menu or has moved to a new address.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/restaurants"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
          >
            Explore Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
