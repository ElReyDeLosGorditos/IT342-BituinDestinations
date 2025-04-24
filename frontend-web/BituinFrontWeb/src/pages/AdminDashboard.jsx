// src/pages/AdminDashboard.jsx

import { useState } from 'react';
import UserManagement from '../components/UserManagement';
import DestinationManagement from '../components/DestinationManagement';
import TourPackageManagement from '../components/TourPackageManagement';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="min-h-screen bg-gray-100 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white shadow-sm rounded-lg mb-6">
                    <nav className="flex space-x-4 p-4">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                activeTab === 'users'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('destinations')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                activeTab === 'destinations'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Destinations
                        </button>
                        <button
                            onClick={() => setActiveTab('packages')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                activeTab === 'packages'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Tour Packages
                        </button>
                    </nav>
                </div>

                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'destinations' && <DestinationManagement />}
                {activeTab === 'packages' && <TourPackageManagement />}
            </div>
        </div>
    );
}

export default AdminDashboard;