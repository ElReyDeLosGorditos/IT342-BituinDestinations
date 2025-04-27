import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({
        travelDate: '',
        numOfTravelers: 1,
        paymentMethod: 'CASH'
    });
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:8080/bookings/user/${userId}`);

            // Fetch payment details and tour package details for each booking
            const bookingsWithPayments = await Promise.all(
                response.data.map(async (booking) => {
                    try {
                        const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${booking.id}`);
                        const tourPackageResponse = await axios.get(`http://localhost:8080/tour-packages/getById/${booking.tourPackage.id}`);
                        
                        return {
                            ...booking,
                            payment: paymentResponse.data,
                            tourPackage: tourPackageResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching details for booking ${booking.id}:`, error);
                        return { ...booking, payment: null };
                    }
                })
            );

            setBookings(bookingsWithPayments);

            // Check for newly confirmed bookings
            const confirmedBookings = bookingsWithPayments.filter(
                booking => booking.bookingStatus === 'CONFIRMED' && 
                (!booking.payment || booking.payment.paymentStatus === 'PAID')
            );
            
            if (confirmedBookings.length > 0) {
                setNotification('You have confirmed bookings! View your receipts in the booking details.');
                setTimeout(() => setNotification(''), 5000);
            }
        } catch (error) {
            setError('Failed to fetch bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBooking = (booking) => {
        setSelectedBooking(booking);
        setEditFormData({
            travelDate: new Date(booking.travelDate).toISOString().split('T')[0],
            numOfTravelers: booking.numOfTravelers,
            paymentMethod: booking.paymentMethod
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedBooking = {
                travelDate: editFormData.travelDate,
                numOfTravelers: editFormData.numOfTravelers,
                paymentMethod: editFormData.paymentMethod,
                totalPrice: selectedBooking.tourPackage.price * editFormData.numOfTravelers
            };

            await axios.put(`http://localhost:8080/bookings/${selectedBooking.id}`, updatedBooking);
            setShowEditModal(false);
            fetchBookings(); // Refresh the bookings list
            navigate(`/booking-confirmation/${selectedBooking.id}`);
        } catch (error) {
            setError('Failed to update booking');
            console.error('Error updating booking:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

                {notification && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                        {notification}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">You have no bookings yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Browse Tour Packages
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {booking.tourPackage.title}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Destination: {booking.tourPackage.destinationName}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Travel Date: {new Date(booking.travelDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col space-y-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                booking.bookingStatus === 'CONFIRMED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : booking.bookingStatus === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {booking.bookingStatus}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                booking.payment?.paymentStatus === 'PAID'
                                                    ? 'bg-green-100 text-green-800'
                                                    : booking.payment?.paymentStatus === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {booking.payment ? `Payment: ${booking.payment.paymentStatus}` : 'Payment: PENDING'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Number of Travelers</p>
                                            <p className="font-medium text-gray-900">{booking.numOfTravelers}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Price</p>
                                            <p className="font-medium text-gray-900">₱{booking.totalPrice.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <p className="font-medium text-gray-900">{booking.paymentMethod}</p>
                                        </div>
                                        {booking.payment?.paymentDate && (
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Date</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(booking.payment.paymentDate).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-4">
                                        {(!booking.payment || booking.payment.paymentStatus === 'PENDING') && (
                                        <button
                                                onClick={() => handleEditBooking(booking)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                                Edit Booking
                                        </button>
                                        )}
                                        {(!booking.payment || booking.payment.paymentStatus === 'PENDING') && (
                                            <button
                                                onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                            >
                                                Complete Payment
                                            </button>
                                        )}
                                        {booking.bookingStatus === 'CONFIRMED' && (
                                            <button
                                                onClick={() => navigate(`/booking-receipt/${booking.id}`)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                View Booking Receipt
                                            </button>
                                        )}
                                        {booking.payment?.paymentStatus === 'PAID' && (
                                            <button
                                                onClick={() => navigate(`/payment-confirmation/${booking.id}`)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                            >
                                                View Payment Receipt
                                            </button>
                                        )}
                                        {booking.payment?.paymentStatus === 'PAID' && (
                                            <p className="text-sm text-gray-500">
                                                This booking cannot be edited as payment has been completed.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Booking Modal */}
            {showEditModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Booking</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Travel Date
                                </label>
                                <input
                                    type="date"
                                    name="travelDate"
                                    value={editFormData.travelDate}
                                    onChange={handleInputChange}
                                    min={new Date(selectedBooking.tourPackage.startDate).toISOString().split('T')[0]}
                                    max={new Date(selectedBooking.tourPackage.endDate).toISOString().split('T')[0]}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Travelers
                                </label>
                                <input
                                    type="number"
                                    name="numOfTravelers"
                                    value={editFormData.numOfTravelers}
                                    onChange={handleInputChange}
                                    min="1"
                                    max={selectedBooking.tourPackage.availableSlots + selectedBooking.numOfTravelers}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={editFormData.paymentMethod}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="GCASH">GCash</option>
                                    <option value="PAYMAYA">PayMaya</option>
                                </select>
                            </div>

                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyBookings;