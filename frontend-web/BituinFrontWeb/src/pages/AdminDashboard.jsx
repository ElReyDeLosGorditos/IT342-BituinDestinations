// src/pages/AdminDashboard.jsx

import { useState } from 'react';
import UserManagement from '../components/UserManagement';
import DestinationManagement from '../components/DestinationManagement';
import TourPackageManagement from '../components/TourPackageManagement';
import ReviewManagement from '../components/ReviewManagement';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', label: 'Users' },
        { id: 'destinations', label: 'Destinations' },
        { id: 'tourPackages', label: 'Tour Packages' },
        { id: 'reviews', label: 'Reviews' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'destinations':
                return <DestinationManagement />;
            case 'tourPackages':
                return <TourPackageManagement />;
            case 'reviews':
                return <ReviewManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b px-6 pt-4">
                        <nav className="flex space-x-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-3 text-sm font-medium transition duration-200 border-b-2 ${
                                        activeTab === tab.id
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-indigo-500 hover:border-indigo-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
