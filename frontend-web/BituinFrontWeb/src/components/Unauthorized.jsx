// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-100">
            <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
                <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
                <div className="mt-6">
                    <Link
                        to="/home"
                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;