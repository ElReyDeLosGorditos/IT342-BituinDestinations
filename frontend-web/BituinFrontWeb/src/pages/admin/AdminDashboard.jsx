// src/pages/AdminDashboard.jsx

import { useState } from 'react';
import UserManagement from './UserManagement.jsx';
import DestinationManagement from './DestinationManagement.jsx';
import TourPackageManagement from './TourPackageManagement.jsx';
import ReviewManagement from './ReviewManagement.jsx';
import AdminBookingManagement from './AdminBookingManagement.jsx';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', label: 'Users' },
        { id: 'destinations', label: 'Destinations' },
        { id: 'tourPackages', label: 'Tour Packages' },
        { id: 'bookings', label: 'Bookings' },
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
            case 'bookings':
                return <AdminBookingManagement />;
            case 'reviews':
                return <ReviewManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
                        <h1 className="text-3xl font-serif font-bold text-white">Admin Dashboard</h1>
                        <p className="mt-2 text-amber-100">Manage your application's content and users</p>
                    </div>

                    <div className="flex">
                        {/* Left Navigation */}
                        <div className="w-64 border-r border-stone-200 bg-stone-50">
                            <nav className="flex flex-col space-y-1 p-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-3 text-sm font-medium transition duration-200 rounded-lg ${
                                            activeTab === tab.id
                                                ? 'bg-amber-100 text-amber-700 border-l-4 border-amber-600'
                                                : 'text-stone-600 hover:bg-stone-100 hover:text-amber-600'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 bg-white">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
