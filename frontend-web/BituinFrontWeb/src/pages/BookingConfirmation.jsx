import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from '../components/PaymentForm';

function BookingConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [tourPackage, setTourPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const fetchBookingAndPayment = async () => {
            try {
                setLoading(true);
                const bookingResponse = await axios.get(`http://localhost:8080/bookings/${bookingId}`);
                setBooking(bookingResponse.data);

                // Fetch tour package details
                const packageResponse = await axios.get(`http://localhost:8080/tour-packages/getById/${bookingResponse.data.tourPackage.id}`);
                setTourPackage(packageResponse.data);

                // Fetch payment details
                const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${bookingId}`);
                setPayment(paymentResponse.data);
            } catch (error) {
                setError('Failed to load booking details');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingAndPayment();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-red-500">{error || 'Booking not found'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 px-6 py-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="mt-4 text-2xl font-bold text-white">Your booking has been successfully created!</h1>
                        <p className="mt-2 text-indigo-100">Please review and Proceed to payment.</p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8">
                        <div className="space-y-6">
                            {/* Tour Package Info */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tour Package Details</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900">{tourPackage.title}</h3>
                                    <p className="text-gray-600 mt-1">{tourPackage.description}</p>
                                </div>
                            </div>

                            {/* Booking Info */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Booking ID</p>
                                        <p className="font-medium text-gray-900">{booking.id}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Travel Date</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(booking.travelDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Number of Travelers</p>
                                        <p className="font-medium text-gray-900">{booking.numOfTravelers}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Total Price</p>
                                        <p className="font-medium text-gray-900">₱{booking.totalPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <p className="font-medium text-gray-900">{booking.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Status</p>
                                            <p className="font-medium text-gray-900">
                                                {payment ? payment.paymentStatus : 'PENDING'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            {(!payment || payment.paymentStatus === 'PENDING') && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Payment</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-600 mb-4">
                                            To secure your booking, please complete the payment process.
                                        </p>
                                        <button
                                            onClick={() => setShowPaymentForm(true)}
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Next Steps */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
                                <div className="bg-indigo-50 rounded-lg p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                                                    <span className="text-indigo-600 font-semibold">1</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Complete Payment:</span> Proceed to payment to secure your booking.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                                                    <span className="text-indigo-600 font-semibold">2</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Wait for Confirmation:</span> Our team will review and confirm your booking within 24 hours.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                                                    <span className="text-indigo-600 font-semibold">3</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Prepare Documents:</span> Have your valid ID and other required documents ready for the trip.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                                                    <span className="text-indigo-600 font-semibold">4</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Check Notifications:</span> Monitor your email and account for booking updates and important information.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/my-bookings')}
                                    className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                >
                                    View My Bookings
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-white text-indigo-600 py-3 px-4 rounded-lg border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Form Modal */}
            {showPaymentForm && (
                <PaymentForm
                    booking={booking}
                    onClose={() => setShowPaymentForm(false)}
                />
            )}
        </div>
    );
}

export default BookingConfirmation; 