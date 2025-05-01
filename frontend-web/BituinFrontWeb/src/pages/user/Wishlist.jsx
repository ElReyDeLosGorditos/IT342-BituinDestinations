import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tourPackages, setTourPackages] = useState({});

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/wishlist/${userId}`);
            setWishlistItems(response.data);

            // Fetch tour package details for each wishlist item
            const packagePromises = response.data.map(item =>
                axios.get(`http://localhost:8080/tour-packages/getById/${item.tourPackageId}`)
            );
            const packageResponses = await Promise.all(packagePromises);
            const packageMap = {};
            packageResponses.forEach(response => {
                packageMap[response.data.id] = response.data;
            });
            setTourPackages(packageMap);
        } catch (error) {
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (tourPackageId) => {
        try {
            const userId = localStorage.getItem('userId');
            await axios.delete(`http://localhost:8080/wishlist?userId=${userId}&tourPackageId=${tourPackageId}`);
            setWishlistItems(wishlistItems.filter(item => item.tourPackageId !== tourPackageId));
            const newPackages = { ...tourPackages };
            delete newPackages[tourPackageId];
            setTourPackages(newPackages);
        } catch (error) {
            setError('Failed to remove item from wishlist');
        }
    };

    const getDestinationTypeBadge = (type) => {
        const badgeStyles = {
            'BEACH': 'bg-amber-50 text-amber-800',
            'MOUNTAIN': 'bg-olive-50 text-olive-800',
            'HISTORICAL': 'bg-stone-100 text-stone-800',
            'CULTURAL': 'bg-rose-50 text-rose-800',
            'NATURE': 'bg-emerald-50 text-emerald-800',
            'URBAN': 'bg-slate-100 text-slate-800'
        };
        return badgeStyles[type] || 'bg-stone-100 text-stone-800';
    };

    const getDestinationTypeIcon = (type) => {
        const icons = {
            'BEACH': '🏖️',
            'MOUNTAIN': '🏔️',
            'HISTORICAL': '🏛️',
            'CULTURAL': '🎭',
            'NATURE': '🌿',
            'URBAN': '🏙️'
        };
        return icons[type] || type;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="text-red-600 bg-white p-6 rounded-xl shadow-sm border border-red-100">
                    <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Error</span>
                    </div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 fixed inset-0 overflow-y-auto py-12 pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center mb-2">
                        <h1 className="text-4xl font-serif font-bold text-stone-800">Your Travel Wishlist</h1>
                        {wishlistItems.length > 0 && (
                            <div className="ml-4 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-amber-300 rounded-full blur-sm opacity-50"></div>
                                    <div className="relative flex items-center justify-center bg-amber-100 text-amber-800 font-semibold px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-lg text-stone-600 mt-2">Destinations and experiences you've saved for your future adventures</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-stone-200">
                        <div className="w-24 h-24 mx-auto mb-6 text-stone-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-stone-600 mb-4">Your wishlist is empty</p>
                        <p className="text-stone-500 max-w-md mx-auto mb-8">Start saving your favorite destinations and tour packages to plan your next adventure</p>
                        <Link
                            to="/home"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-black bg-olive-700 hover:bg-olive-800 transition-colors shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Explore Tour Packages
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 mb-8 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-2 bg-amber-50 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-stone-700 font-medium">Manage Your Wishlist</p>
                                    <p className="text-stone-500 text-sm">Click the X button to remove items from your wishlist</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-stone-100 text-stone-800 font-medium px-3 py-1.5 rounded-lg flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="mr-1">Total Saved:</span>
                                    <span className="text-amber-700 font-semibold">{wishlistItems.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {wishlistItems.map((item) => {
                                const tourPackage = tourPackages[item.tourPackageId];
                                if (!tourPackage) return null;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-stone-200 p-6"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-semibold text-stone-900 mb-1">{tourPackage.title}</h3>
                                                <p className="text-stone-600 mb-2">{tourPackage.destinationName}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromWishlist(item.tourPackageId)}
                                                className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove from wishlist"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-stone-600 mb-4">{tourPackage.description}</p>
                                                <div className="grid grid-cols-2 gap-4 text-stone-600">
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium">Duration</p>
                                                            <p>{tourPackage.duration}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium">Location</p>
                                                            <p>{tourPackage.destinationName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium">Tour Dates</p>
                                                            <p>{new Date(tourPackage.startDate).toLocaleDateString()} - {new Date(tourPackage.endDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium">Available Slots</p>
                                                            <p>{tourPackage.availableSlots}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <div>
                                                    <div className="text-2xl font-bold text-amber-700 mb-2">
                                                        ₱{tourPackage.price.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-stone-500 mb-4">
                                                        <span className="font-medium">Added:</span> {new Date(item.addedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/tour-package/${item.tourPackageId}`}
                                                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <button
                                                        onClick={() => removeFromWishlist(item.tourPackageId)}
                                                        className="inline-flex items-center px-4 py-2.5 border border-stone-200 rounded-xl shadow-sm text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Wishlist;