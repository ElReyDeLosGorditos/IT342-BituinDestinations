import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminBookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/bookings');
            // Fetch payment details for each booking
            const bookingsWithPayments = await Promise.all(
                response.data.map(async (booking) => {
                    try {
                        const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${booking.id}`);
                        if (paymentResponse.data) {
                            return { ...booking, payment: paymentResponse.data };
                        }
                        return { ...booking, payment: null };
                    } catch (error) {
                        console.error(`Error fetching payment for booking ${booking.id}:`, error);
                        // Don't set payment to null, just return the booking as is
                        return booking;
                    }
                })
            );
            setBookings(bookingsWithPayments);
        } catch (error) {
            setError('Failed to fetch bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:8080/bookings/${bookingId}/status`, null, {
                params: { status: newStatus }
            });
            
            if (response.status === 200) {
                setSuccessMessage('Booking status updated successfully');
                setBookings(bookings.map(booking => 
                    booking.id === bookingId 
                        ? { ...booking, bookingStatus: newStatus }
                        : booking
                ));

                // If booking is confirmed, show a message about receipt
                if (newStatus === 'CONFIRMED') {
                    const booking = bookings.find(b => b.id === bookingId);
                    if (booking) {
                        setSuccessMessage(`Booking confirmed! The user can now view their receipt for booking #${bookingId}`);
                    }
                }
            }
        } catch (error) {
            setError('Failed to update booking status');
            console.error('Error updating booking status:', error);
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 3000);
        }
    };

    const handlePaymentStatusChange = async (bookingId, newStatus) => {
        try {
            // First, get the payment for this booking
            const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${bookingId}`);
            const payment = paymentResponse.data;

            // Update the payment status
            const updateResponse = await axios.put(`http://localhost:8080/payments/${payment.id}`, {
                paymentStatus: newStatus,
                paymentAmount: payment.paymentAmount,
                paymentMethod: payment.paymentMethod,
                bookingId: payment.booking.id
            });
            
            if (updateResponse.status === 200) {
                setSuccessMessage('Payment status updated successfully');
                setBookings(bookings.map(booking => 
                    booking.id === bookingId 
                        ? { ...booking, payment: { ...booking.payment, paymentStatus: newStatus } }
                        : booking
                ));
            }
        } catch (error) {
            setError('Failed to update payment status');
            console.error('Error updating payment status:', error);
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 3000);
        }
    };

    const filteredBookings = selectedStatus === 'ALL' 
        ? bookings 
        : bookings.filter(booking => booking.bookingStatus === selectedStatus);

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                            Filter by Status:
                        </label>
                        <select
                            id="status-filter"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="ALL">All Bookings</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Success and Error Messages */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredBookings.map((booking) => (
                            <li key={booking.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-medium text-indigo-600 truncate">
                                                {booking.tourPackage.title}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    booking.bookingStatus === 'CONFIRMED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.bookingStatus === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {booking.bookingStatus}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    booking.payment?.paymentStatus === 'PAID' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.payment?.paymentStatus === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {booking.payment?.paymentStatus || 'NO PAYMENT'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">User</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {booking.user.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Travel Date</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(booking.travelDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Number of Travelers</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {booking.numOfTravelers}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Price</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ₱{booking.totalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Method</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {booking.paymentMethod}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Date</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {booking.payment?.paymentDate 
                                                        ? new Date(booking.payment.paymentDate).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end space-x-4">
                                    <select
                                        value={booking.bookingStatus}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                    {booking.payment && (
                                        <select
                                            value={booking.payment.paymentStatus}
                                            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                                            className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="PENDING">Payment Pending</option>
                                            <option value="PAID">Payment Received</option>
                                            <option value="FAILED">Payment Failed</option>
                                        </select>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminBookingManagement; 