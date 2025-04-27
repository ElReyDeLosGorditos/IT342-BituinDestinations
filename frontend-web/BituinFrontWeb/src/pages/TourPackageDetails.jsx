import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Review from '../components/Review';
import BookingForm from '../components/BookingForm';

function TourPackageDetails() {
    const [tourPackage, setTourPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

    useEffect(() => {
        // Reset scroll position when component mounts
        window.scrollTo(0, 0);

        fetchTourPackageDetails();
        checkWishlistStatus();
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

    const checkWishlistStatus = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await axios.get(`http://localhost:8080/wishlist/${userId}`);
            const isInWishlist = response.data.some(item => item.tourPackageId === parseInt(id));
            setIsInWishlist(isInWishlist);
        } catch (error) {
            console.error('Failed to check wishlist status:', error);
        }
    };

    const toggleWishlist = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login', { state: { from: `/tour-package/${id}` } });
                return;
            }

            setWishlistLoading(true);
            if (isInWishlist) {
                await axios.delete(`http://localhost:8080/wishlist?userId=${userId}&tourPackageId=${id}`);
            } else {
                await axios.post('http://localhost:8080/wishlist', {
                    userId: parseInt(userId),
                    tourPackageId: parseInt(id)
                });
            }
            setIsInWishlist(!isInWishlist);
        } catch (error) {
            setError('Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleBookNow = () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login', { state: { from: `/tour-package/${id}` } });
            return;
        }
        setShowBookingForm(true);
    };

    const handleBookingClose = (success) => {
        setShowBookingForm(false);
        if (success) {
            // Refresh the tour package details to update available slots
            fetchTourPackageDetails();
        }
    };

    const getHeroTheme = (type) => {
        const themeMap = {
            'BEACH': {
                gradient: 'from-blue-600/80 to-teal-600/80',
                accent: 'text-blue-500',
                badge: 'bg-blue-500/20 text-blue-100',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
                button: 'bg-blue-600 hover:bg-blue-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-blue-600 hover:bg-blue-700',
                bookNow: 'bg-emerald-600 hover:bg-emerald-700'
            },
            'MOUNTAIN': {
                gradient: 'from-green-600/80 to-emerald-600/80',
                accent: 'text-green-500',
                badge: 'bg-green-500/20 text-green-100',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                button: 'bg-green-600 hover:bg-green-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-green-600 hover:bg-green-700',
                bookNow: 'bg-emerald-600 hover:bg-emerald-700'
            },
            'HISTORICAL': {
                gradient: 'from-amber-600/80 to-orange-600/80',
                accent: 'text-amber-500',
                badge: 'bg-amber-500/20 text-amber-100',
                image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
                button: 'bg-amber-600 hover:bg-amber-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-amber-600 hover:bg-amber-700',
                bookNow: 'bg-orange-600 hover:bg-orange-700'
            },
            'CULTURAL': {
                gradient: 'from-purple-600/80 to-pink-600/80',
                accent: 'text-purple-500',
                badge: 'bg-purple-500/20 text-purple-100',
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                button: 'bg-purple-600 hover:bg-purple-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-purple-600 hover:bg-purple-700',
                bookNow: 'bg-pink-600 hover:bg-pink-700'
            },
            'NATURE': {
                gradient: 'from-emerald-600/80 to-cyan-600/80',
                accent: 'text-emerald-500',
                badge: 'bg-emerald-500/20 text-emerald-100',
                image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                button: 'bg-emerald-600 hover:bg-emerald-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-emerald-600 hover:bg-emerald-700',
                bookNow: 'bg-cyan-600 hover:bg-cyan-700'
            },
            'URBAN': {
                gradient: 'from-gray-600/80 to-slate-600/80',
                accent: 'text-gray-500',
                badge: 'bg-gray-500/20 text-gray-100',
                image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                button: 'bg-slate-600 hover:bg-slate-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-slate-600 hover:bg-slate-700',
                bookNow: 'bg-gray-600 hover:bg-gray-700'
            },
            'default': {
                gradient: 'from-indigo-600/80 to-purple-600/80',
                accent: 'text-indigo-500',
                badge: 'bg-indigo-500/20 text-indigo-100',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                button: 'bg-indigo-600 hover:bg-indigo-700',
                wishlistActive: 'bg-red-500 hover:bg-red-600',
                wishlistInactive: 'bg-indigo-600 hover:bg-indigo-700',
                bookNow: 'bg-purple-600 hover:bg-purple-700'
            }
        };
        return themeMap[type] || themeMap.default;
    };

    const isPackageExpired = (pkg) => {
        const endDate = new Date(pkg.endDate);
        const today = new Date();
        return endDate < today;
    };

    const isPackageAvailable = (pkg) => {
        return pkg.availableSlots > 0;
    };

    const getBookingStatus = (pkg) => {
        if (isPackageExpired(pkg)) {
            return {
                canBook: false,
                message: 'This tour package has expired',
                status: 'expired'
            };
        }
        if (!isPackageAvailable(pkg)) {
            return {
                canBook: false,
                message: 'No available slots for this tour package',
                status: 'full'
            };
        }
        return {
            canBook: true,
            message: 'Available for booking',
            status: 'available'
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!tourPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">Tour package not found</div>
            </div>
        );
    }

    const theme = getHeroTheme(tourPackage.destinationType);

    return (
        <div className="bg-gray-50 min-h-screen">
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{tourPackage.title}</h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">{tourPackage.description}</p>
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
                                            <p className={`font-medium ${tourPackage.availableSlots === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {tourPackage.availableSlots}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className={`w-6 h-6 ${theme.accent} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Tour Dates</p>
                                            <p className={`font-medium ${isPackageExpired(tourPackage) ? 'text-red-600' : 'text-gray-900'}`}>
                                                {new Date(tourPackage.startDate).toLocaleDateString()} - {new Date(tourPackage.endDate).toLocaleDateString()}
                                            </p>
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

                    {/* Right Column - Booking and Reviews */}
                    <div className="space-y-8">
                        {/* Booking Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Book This Tour</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Price per person:</span>
                                    <span className="font-semibold">₱{tourPackage?.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Available slots:</span>
                                    <span className={`font-semibold ${tourPackage.availableSlots === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {tourPackage?.availableSlots}
                                    </span>
                                </div>
                                {getBookingStatus(tourPackage).canBook ? (
                                <button
                                    onClick={handleBookNow}
                                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                >
                                    Book Now
                                </button>
                                ) : (
                                    <div className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg text-center">
                                        {getBookingStatus(tourPackage).message}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <Review tourPackageId={id} isAdmin={isAdmin} />
                    </div>
                </div>
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && tourPackage && (
                <BookingForm
                    tourPackage={tourPackage}
                    onClose={handleBookingClose}
                />
            )}
        </div>
    );
}

export default TourPackageDetails;