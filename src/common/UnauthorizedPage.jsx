import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, LogIn } from 'lucide-react';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <ShieldX className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Home className="w-5 h-5" />
                        Go to Home
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        <LogIn className="w-5 h-5" />
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;