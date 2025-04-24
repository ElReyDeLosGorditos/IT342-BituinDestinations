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
            'BEACH': 'bg-blue-100 text-blue-800',
            'MOUNTAIN': 'bg-green-100 text-green-800',
            'HISTORICAL': 'bg-amber-100 text-amber-800',
            'CULTURAL': 'bg-purple-100 text-purple-800',
            'NATURE': 'bg-emerald-100 text-emerald-800',
            'URBAN': 'bg-gray-100 text-gray-800'
        };
        return badgeStyles[type] || 'bg-indigo-100 text-indigo-800';
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

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Wishlist</h1>
                    <p className="text-lg text-gray-600">Save your favorite tour packages for later</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
                        <Link
                            to="/home"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            Browse Tour Packages
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item) => {
                            const tourPackage = tourPackages[item.tourPackageId];
                            if (!tourPackage) return null;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={tourPackage.image || '/placeholder-image.jpg'}
                                            alt={tourPackage.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => removeFromWishlist(item.tourPackageId)}
                                                className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDestinationTypeBadge(tourPackage.destinationType)}`}>
                                                {tourPackage.destinationType}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Added {new Date(item.addedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tourPackage.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{tourPackage.description}</p>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{tourPackage.duration}</span>
                                            </div>
                                            <div className="text-lg font-semibold text-indigo-600">
                                                ₱{tourPackage.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/tour-package/${item.tourPackageId}`}
                                            className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist; 