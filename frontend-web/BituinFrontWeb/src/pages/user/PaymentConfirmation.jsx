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
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 pt-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-amber-700 to-stone-800 px-6 py-10 text-center">
                        <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            {isBookingConfirmed ? (
                                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <h1 className="mt-6 text-3xl font-serif font-bold text-white">
                            {isBookingConfirmed ? 'Booking Confirmed!' : 'Booking in Process'}
                        </h1>
                        <p className="mt-2 text-amber-100">
                            Payment Reference: #{payment.id}
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Payment Information */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Payment Details</h2>
                            <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-stone-500">Payment Method</p>
                                            <p className="font-medium text-stone-800">{payment.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Payment Status</p>
                                            <div className="flex items-center">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                    payment.paymentStatus === 'PAID' ? 'bg-emerald-500' :
                                                    payment.paymentStatus === 'PENDING' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}></span>
                                                <p className="font-medium text-stone-800">{payment.paymentStatus}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-stone-500">Payment Date</p>
                                            <p className="font-medium text-stone-800">
                                                {new Date(payment.paymentDate).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-stone-500">Payment Amount</p>
                                            <p className="font-medium text-stone-800">
                                                ₱{payment.paymentAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Transaction Details</h2>
                            <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-stone-500">Transaction ID</p>
                                        <p className="font-medium text-stone-800">{payment.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-stone-500">Booking Reference</p>
                                        <p className="font-medium text-stone-800">#{payment.booking.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Next Steps</h2>
                            <div className={`rounded-xl p-6 border ${
                                isBookingConfirmed 
                                    ? 'bg-emerald-50 border-emerald-100' 
                                    : 'bg-amber-50 border-amber-100'
                            }`}>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        {isBookingConfirmed ? (
                                            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {isBookingConfirmed ? (
                                            <>
                                                <p className="text-stone-700">
                                                    Your booking has been confirmed! You can now view your booking details and prepare for your trip.
                                                </p>
                                                <p className="text-stone-600 text-sm">
                                                    Please check your email for the complete booking confirmation and important information about your tour.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-stone-700">
                                                    Your payment has been processed successfully. Your booking is now being reviewed by our team.
                                                </p>
                                                <p className="text-stone-600 text-sm">
                                                    You will receive a notification once your booking is confirmed.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {isBookingConfirmed ? (
                                        <button
                                            onClick={() => navigate(`/booking-receipt/${bookingId}`)}
                                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            View Booking Receipt
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/my-bookings')}
                                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
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