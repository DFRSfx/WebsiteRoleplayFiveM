import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-gray-900 min-h-screen flex items-center justify-center animate-fadeIn">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-red-800">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;