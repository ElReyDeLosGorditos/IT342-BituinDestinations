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
    const [destinations, setDestinations] = useState({});
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
                        const destinationResponse = await axios.get(`http://localhost:8080/destination/getById/${tourPackageResponse.data.destinationId}`);
                        
                        return {
                            ...booking,
                            payment: paymentResponse.data,
                            tourPackage: tourPackageResponse.data,
                            destination: destinationResponse.data
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
            // Calculate the difference in number of travelers
            const travelerDiff = editFormData.numOfTravelers - selectedBooking.numOfTravelers;
            
            // Update the tour package's available slots
            const updatedTourPackage = {
                ...selectedBooking.tourPackage,
                availableSlots: selectedBooking.tourPackage.availableSlots - travelerDiff
            };

            // First update the tour package
            await axios.put(`http://localhost:8080/tour-packages/update/${selectedBooking.tourPackage.id}`, updatedTourPackage);

            // Then update the booking
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

    const handleDeleteBooking = async (bookingId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/bookings/${bookingId}`);
            if (response.status === 204) {
                setNotification('Booking deleted successfully');
                setTimeout(() => setNotification(''), 5000);
                fetchBookings(); // Refresh the bookings list
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setError('Cannot delete booking: Payment has already been completed.');
            } else {
                setError('Failed to delete booking');
            }
            console.error('Error deleting booking:', error);
        }
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
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                        My Bookings
                    </h1>
                    <p className="text-stone-600 text-lg max-w-3xl mx-auto">
                        Manage your tour bookings and view your booking history
                    </p>
                </div>

                {notification && (
                    <div className="mb-8 p-4 bg-amber-100 text-amber-800 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {notification}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200">
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
                        <div className="max-w-md mx-auto">
                            <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="text-xl font-semibold text-stone-800 mb-2">No Bookings Yet</h3>
                            <p className="text-stone-500 mb-6">Start your journey by exploring our amazing tour packages.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
                            >
                                Browse Tour Packages
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <h2 className="text-2xl font-semibold text-stone-900">
                                                    {booking.tourPackage.title}
                                                </h2>
                                                <div className="flex gap-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        booking.bookingStatus === 'CONFIRMED'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : booking.bookingStatus === 'PENDING'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {booking.bookingStatus}
                                                    </span>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        booking.payment?.paymentStatus === 'PAID'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : booking.payment?.paymentStatus === 'PENDING'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {booking.payment ? `Payment: ${booking.payment.paymentStatus}` : 'Payment: PENDING'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-stone-500">Destination</p>
                                                        <p className="font-medium text-stone-900">{booking.tourPackage.destinationName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-stone-500">Location</p>
                                                        <p className="font-medium text-stone-900">{booking.destination?.destinationLocation || 'Location not specified'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-stone-500">Travel Date</p>
                                                        <p className="font-medium text-stone-900">{new Date(booking.travelDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-stone-500">Number of Travelers</p>
                                                        <p className="font-medium text-stone-900">{booking.numOfTravelers}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-stone-500">Total Price</p>
                                                        <p className="font-medium text-amber-700">₱{booking.totalPrice.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-stone-500">Payment Method</p>
                                                        <p className="font-medium text-stone-900">{booking.paymentMethod}</p>
                                                    </div>
                                                    {booking.payment?.paymentDate && (
                                                        <div>
                                                            <p className="text-sm text-stone-500">Payment Date</p>
                                                            <p className="font-medium text-stone-900">
                                                                {new Date(booking.payment.paymentDate).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-stone-200">
                                        <div className="flex flex-wrap gap-4 justify-end">
                                            {(!booking.payment || booking.payment.paymentStatus === 'PENDING') && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditBooking(booking)}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit Booking
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete Booking
                                                    </button>
                                                </>
                                            )}
                                                    {(!booking.payment || booking.payment.paymentStatus === 'PENDING') && (
                                                        <button
                                                            onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                            </svg>
                                                            Complete Payment
                                                        </button>
                                                    )}
                                                    {booking.bookingStatus === 'CONFIRMED' && (
                                                        <button
                                                            onClick={() => navigate(`/booking-receipt/${booking.id}`)}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-stone-600 hover:bg-stone-700 transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            View Booking Receipt
                                                        </button>
                                                    )}
                                                    {booking.payment?.paymentStatus === 'PAID' && (
                                                        <button
                                                            onClick={() => navigate(`/payment-confirmation/${booking.id}`)}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-stone-600 hover:bg-stone-700 transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            View Payment Receipt
                                                        </button>
                                                    )}
                                        </div>
                                        {booking.payment?.paymentStatus === 'PAID' && (
                                            <p className="mt-4 text-sm text-stone-500 text-right">
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
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-stone-900">Edit Booking</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-stone-500 hover:text-stone-700 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
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
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all bg-stone-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
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
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all bg-stone-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={editFormData.paymentMethod}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all bg-stone-50"
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="GCASH">GCash</option>
                                    <option value="PAYMAYA">PayMaya</option>
                                </select>
                            </div>

                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
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