import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentForm.jsx';

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
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="text-red-600 bg-white p-6 rounded-xl shadow-sm border border-red-100">
                    <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Error</span>
                    </div>
                    <p>{error || 'Booking not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 fixed inset-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-700 to-stone-800 px-6 py-8 text-center">
                        <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-2xl font-serif font-bold text-white">Booking Confirmed!</h1>
                        <p className="mt-1 text-amber-100">Please review your details and proceed to payment.</p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        <div className="space-y-6">
                            {/* Tour Package Info */}
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Tour Package Details</h2>
                                <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                                    <h3 className="text-lg font-medium text-stone-800">{tourPackage.title}</h3>
                                    <p className="text-stone-600 mt-2">{tourPackage.description}</p>
                                </div>
                            </div>

                            {/* Booking Info */}
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Booking Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                        <p className="text-sm text-stone-500">Booking ID</p>
                                        <p className="font-medium text-stone-800">{booking.id}</p>
                                    </div>
                                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                        <p className="text-sm text-stone-500">Travel Date</p>
                                        <p className="font-medium text-stone-800">
                                            {new Date(booking.travelDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                        <p className="text-sm text-stone-500">Number of Travelers</p>
                                        <p className="font-medium text-stone-800">{booking.numOfTravelers}</p>
                                    </div>
                                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                        <p className="text-sm text-stone-500">Total Price</p>
                                        <p className="font-medium text-amber-700">₱{booking.totalPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Payment Information</h2>
                                <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-stone-500">Payment Method</p>
                                            <p className="font-medium text-stone-800">{booking.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Payment Status</p>
                                            <div className="flex items-center">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                    payment && payment.paymentStatus === 'COMPLETED'
                                                        ? 'bg-green-500'
                                                        : 'bg-amber-500'
                                                }`}></span>
                                                <p className="font-medium text-stone-800">
                                                    {payment ? payment.paymentStatus : 'PENDING'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            {(!payment || payment.paymentStatus === 'PENDING') && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Complete Your Payment</h2>
                                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                                        <p className="text-stone-700 mb-4">
                                            To secure your booking, please complete the payment process.
                                        </p>
                                        <button
                                            onClick={() => setShowPaymentForm(true)}
                                            className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-sm font-medium"
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Next Steps */}
                            <div>
                                <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Next Steps</h2>
                                <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                                    <div className="space-y-5">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                                    1
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-stone-700">
                                                    <span className="font-medium">Complete Payment:</span> Proceed to payment to secure your booking.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                                    2
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-stone-700">
                                                    <span className="font-medium">Wait for Confirmation:</span> Our team will review and confirm your booking within 24 hours.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                                    3
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-stone-700">
                                                    <span className="font-medium">Prepare Documents:</span> Have your valid ID and other required documents ready for the trip.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                                    4
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-stone-700">
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
                                    className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-sm font-medium"
                                >
                                    View My Bookings
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-white text-stone-700 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-sm font-medium"
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