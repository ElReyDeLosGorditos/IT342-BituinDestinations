import { useState, useEffect } from 'react';
import axios from 'axios';

function Review({ tourPackageId, isAdmin }) {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [tourPackageId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/reviews/tour/${tourPackageId}`);
            setReviews(response.data);
        } catch (error) {
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please login to submit a review');
                return;
            }

            const reviewData = {
                ...newReview,
                userId: parseInt(userId),
                tourPackageId: parseInt(tourPackageId)
            };

            await axios.post('http://localhost:8080/reviews', reviewData);
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            setError('Failed to submit review');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            setDeleteLoading(reviewId);
            await axios.delete(`http://localhost:8080/reviews/${reviewId}`);
            fetchReviews();
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
            
            {/* Review Form - Only for non-admin users */}
            {!isAdmin && (
                <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} {rating === 1 ? 'star' : 'stars'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Comment</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                required
                                placeholder="Share your experience..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No reviews yet. Be the first to review!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
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
                                    <p className="text-gray-600 mb-2">{review.comment}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium text-gray-900">{review.userName || 'Anonymous User'}</span>
                                        <span className="mx-2">•</span>
                                        <span>Posted on {new Date(review.reviewDate).toLocaleDateString()}</span>
                                        {isAdmin && (
                                            <span className="mx-2">•</span>
                                        )}
                                        {isAdmin && (
                                            <span className="text-indigo-600">User ID: {review.userId}</span>
                                        )}
                                    </div>
                                </div>
                                {(isAdmin || review.userId === parseInt(localStorage.getItem('userId'))) && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={deleteLoading === review.id}
                                        className="ml-4 text-red-500 hover:text-red-700 disabled:opacity-50"
                                    >
                                        {deleteLoading === review.id ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Review; 