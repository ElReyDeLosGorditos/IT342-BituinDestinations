import { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewManagement() {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tourPackages, setTourPackages] = useState({});

    useEffect(() => {
        fetchAllReviews();
        fetchTourPackages();
    }, []);

    useEffect(() => {
        filterReviews();
    }, [searchTerm, reviews]);

    const fetchTourPackages = async () => {
        try {
            const response = await axios.get('https://it342-bituindestinations-qrwd.onrender.com/tour-packages/getAll');
            const packagesMap = {};
            response.data.forEach(pkg => {
                packagesMap[pkg.id] = pkg.title;
            });
            setTourPackages(packagesMap);
        } catch (error) {
            console.error('Failed to fetch tour packages:', error);
        }
    };

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://it342-bituindestinations-qrwd.onrender.com/reviews');
            setReviews(response.data);
        } catch (error) {
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const filterReviews = () => {
        if (!searchTerm.trim()) {
            setFilteredReviews(reviews);
            return;
        }

        const filtered = reviews.filter(review => {
            const searchLower = searchTerm.toLowerCase();
            return (
                review.comment.toLowerCase().includes(searchLower) ||
                (review.userName && review.userName.toLowerCase().includes(searchLower)) ||
                (tourPackages[review.tourPackageId] && tourPackages[review.tourPackageId].toLowerCase().includes(searchLower))
            );
        });
        setFilteredReviews(filtered);
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            setDeleteLoading(reviewId);
            await axios.delete(`https://it342-bituindestinations-qrwd.onrender.com/reviews/${reviewId}`);
            fetchAllReviews();
        } catch (error) {
            setError('Failed to delete review');
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reviews Management</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        View and manage all reviews across tour packages
                    </p>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search reviews by comment, user name, or package name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <div className="border-t border-gray-200">
                    {filteredReviews.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No reviews found
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredReviews.map((review) => (
                                <li key={review.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-900">{review.comment}</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <span className="font-medium text-gray-900">{review.userName}</span>
                                                <span className="mx-2">•</span>
                                                <span>Package: {tourPackages[review.tourPackageId] || 'Unknown Package'}</span>
                                                <span className="mx-2">•</span>
                                                <span>Posted on {new Date(review.reviewDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                disabled={deleteLoading === review.id}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                            >
                                                {deleteLoading === review.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReviewManagement; 