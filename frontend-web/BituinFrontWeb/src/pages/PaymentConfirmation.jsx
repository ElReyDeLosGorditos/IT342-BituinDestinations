import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPaymentAndBookingDetails = async () => {
            try {
                // Fetch payment details
                const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${bookingId}`);
                setPayment(paymentResponse.data);

                // Fetch booking details
                const bookingResponse = await axios.get(`http://localhost:8080/bookings/${bookingId}`);
                setBooking(bookingResponse.data);

                setLoading(false);
            } catch (error) {
                setError('Failed to load payment details');
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchPaymentAndBookingDetails();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !payment || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error || 'Payment not found'}</div>
            </div>
        );
    }

    const isBookingConfirmed = booking.bookingStatus === 'CONFIRMED';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center mb-8">
                        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isBookingConfirmed ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            {isBookingConfirmed ? (
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ) : (
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            {isBookingConfirmed ? 'Booking Confirmed!' : 'Booking in Process'}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Payment Reference: #{payment.id}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Payment Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-medium text-gray-900">{payment.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Status</p>
                                        <p className="font-medium text-green-600">{payment.paymentStatus}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Date</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(payment.paymentDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Amount</p>
                                        <p className="font-medium text-gray-900">
                                            ₱{payment.paymentAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Details</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Transaction ID</p>
                                        <p className="font-medium text-gray-900">{payment.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Booking Reference</p>
                                        <p className="font-medium text-gray-900">#{payment.booking.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
                            <div className={`rounded-lg p-4 ${isBookingConfirmed ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {isBookingConfirmed ? (
                                            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                <p className="text-gray-600">
                                            {isBookingConfirmed ? (
                                                <>
                                                    Your booking has been confirmed! You can now view your booking details and prepare for your trip.
                                                    <br />
                                                    <br />
                                                    Please check your email for the complete booking confirmation and important information about your tour.
                                                </>
                                            ) : (
                                                <>
                                                    Your payment has been processed successfully. Your booking is now being reviewed by our team.
                                                    <br />
                                                    <br />
                                                    You will receive a notification once your booking is confirmed.
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {isBookingConfirmed ? (
                                        <button
                                            onClick={() => navigate(`/booking-receipt/${bookingId}`)}
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            View Booking Receipt
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/my-bookings')}
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            View My Bookings
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentConfirmation; 