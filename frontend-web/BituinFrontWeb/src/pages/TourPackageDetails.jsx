import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TourPackageDetails() {
    const [tourPackage, setTourPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTourPackageDetails();
    }, [id]);

    const fetchTourPackageDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/tour-packages/getById/${id}`);
            setTourPackage(response.data);
        } catch (error) {
            setError('Failed to load tour package details');
        } finally {
            setLoading(false);
        }
    };

    const getHeroTheme = (type) => {
        const themeMap = {
            'BEACH': {
                gradient: 'from-blue-600/80 to-teal-600/80',
                accent: 'text-blue-500',
                badge: 'bg-blue-500/20 text-blue-100',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'
            },
            'MOUNTAIN': {
                gradient: 'from-green-600/80 to-emerald-600/80',
                accent: 'text-green-500',
                badge: 'bg-green-500/20 text-green-100',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            },
            'HISTORICAL': {
                gradient: 'from-amber-600/80 to-orange-600/80',
                accent: 'text-amber-500',
                badge: 'bg-amber-500/20 text-amber-100',
                image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
            },
            'CULTURAL': {
                gradient: 'from-purple-600/80 to-pink-600/80',
                accent: 'text-purple-500',
                badge: 'bg-purple-500/20 text-purple-100',
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            },
            'NATURE': {
                gradient: 'from-emerald-600/80 to-cyan-600/80',
                accent: 'text-emerald-500',
                badge: 'bg-emerald-500/20 text-emerald-100',
                image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            },
            'URBAN': {
                gradient: 'from-gray-600/80 to-slate-600/80',
                accent: 'text-gray-500',
                badge: 'bg-gray-500/20 text-gray-100',
                image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            },
            'default': {
                gradient: 'from-indigo-600/80 to-purple-600/80',
                accent: 'text-indigo-500',
                badge: 'bg-indigo-500/20 text-indigo-100',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        };
        return themeMap[type] || themeMap.default;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!tourPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Tour package not found</div>
            </div>
        );
    }

    const theme = getHeroTheme(tourPackage.destinationType);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[32rem] overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out transform hover:scale-105"
                    style={{ backgroundImage: `url(${theme.image})` }}
                ></div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Blur Orbs */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-16 right-16 w-60 h-60 bg-purple-300/10 rounded-full blur-2xl"></div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <span className={`inline-block ${theme.badge} px-4 py-1 rounded-full text-sm font-medium mb-4`}>
                            {tourPackage.destinationType}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{tourPackage.title}</h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">{tourPackage.description}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Tour Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Card */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Destination</p>
                                            <p className="font-medium text-gray-900">{tourPackage.destinationName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                            <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-medium text-gray-900">{tourPackage.duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="font-medium text-gray-900">₱{tourPackage.price.toLocaleString()}</p>
                                </div>
                            </div>
                                    <div className="flex items-center">
                                        <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                            <div>
                                            <p className="text-sm text-gray-500">Available Slots</p>
                                            <p className="font-medium text-gray-900">{tourPackage.availableSlots}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Card */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
                            <div className="prose max-w-none">
                                <pre className="whitespace-pre-wrap text-gray-600 bg-gray-50 p-6 rounded-lg">{tourPackage.agenda}</pre>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Dates</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Start Date</p>
                                        <p className="font-medium text-gray-900">{new Date(tourPackage.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">End Date</p>
                                        <p className="font-medium text-gray-900">{new Date(tourPackage.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/booking/${id}`)}
                                className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity transform hover:scale-105 duration-300`}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TourPackageDetails;
