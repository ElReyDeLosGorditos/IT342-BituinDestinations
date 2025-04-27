import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminBookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/bookings');
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
            const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${bookingId}`);
            const payment = paymentResponse.data;

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

    const filteredBookings = bookings.filter(booking => {
        const statusMatch = selectedStatus === 'ALL' || booking.bookingStatus === selectedStatus;
        const paymentMatch = selectedPaymentStatus === 'ALL' || 
            (booking.payment?.paymentStatus === selectedPaymentStatus) ||
            (selectedPaymentStatus === 'NO_PAYMENT' && !booking.payment);
        return statusMatch && paymentMatch;
    });

    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-stone-600">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white">Booking Management</h2>
                        <p className="text-amber-100 mt-1">View and manage all bookings across tour packages</p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            <p className="text-amber-100 text-sm">Confirmed</p>
                            <p className="text-white font-bold text-xl">
                                {bookings.filter(b => b.bookingStatus === 'CONFIRMED').length}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            <p className="text-amber-100 text-sm">Paid</p>
                            <p className="text-white font-bold text-xl">
                                {bookings.filter(b => b.payment?.paymentStatus === 'PAID').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <label htmlFor="status-filter" className="block text-sm font-medium text-stone-700 mb-1">
                            Booking Status
                        </label>
                        <select
                            id="status-filter"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                        >
                            <option value="ALL">All Bookings</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <label htmlFor="payment-filter" className="block text-sm font-medium text-stone-700 mb-1">
                            Payment Status
                        </label>
                        <select
                            id="payment-filter"
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                        >
                            <option value="ALL">All Payments</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_PAYMENT">No Payment</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 p-4 rounded-lg shadow-sm">
                    <p className="font-medium">{successMessage}</p>
                </div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Bookings List */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-stone-900 mb-1">No Bookings Found</h3>
                        <p className="text-stone-500">Try adjusting your filter criteria</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-stone-200">
                        {filteredBookings.map((booking) => (
                            <li key={booking.id} className="p-6 hover:bg-stone-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium text-stone-900">
                                                {booking.tourPackage.title}
                                            </h3>
                                            <div className="flex items-center space-x-2">
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
                                                    {booking.payment?.paymentStatus || 'NO PAYMENT'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-stone-500">User</p>
                                                <p className="text-sm font-medium text-stone-900">
                                                    {booking.user.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Travel Date</p>
                                                <p className="text-sm font-medium text-stone-900">
                                                    {new Date(booking.travelDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Number of Travelers</p>
                                                <p className="text-sm font-medium text-stone-900">
                                                    {booking.numOfTravelers}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Total Price</p>
                                                <p className="text-sm font-medium text-stone-900">
                                                    ₱{booking.totalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Payment Method</p>
                                                <p className="text-sm font-medium text-stone-900">
                                                    {booking.paymentMethod}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Payment Date</p>
                                                <p className="text-sm font-medium text-stone-900">
                                                    {booking.payment?.paymentDate 
                                                        ? new Date(booking.payment.paymentDate).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-4">
                                    <select
                                        value={booking.bookingStatus}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        className="block w-40 pl-3 pr-10 py-2 text-base border-0 bg-stone-50 focus:ring-2 focus:ring-amber-300 rounded-lg transition-all"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                    {booking.payment && (
                                        <select
                                            value={booking.payment.paymentStatus}
                                            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                                            className="block w-40 pl-3 pr-10 py-2 text-base border-0 bg-stone-50 focus:ring-2 focus:ring-amber-300 rounded-lg transition-all"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PAID">Paid</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Booking count */}
            <div className="text-stone-500 text-sm">
                Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
        </div>
    );
}

export default AdminBookingManagement; 