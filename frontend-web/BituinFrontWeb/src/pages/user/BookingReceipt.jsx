import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingReceipt() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [tourPackage, setTourPackage] = useState(null);
    const [payment, setPayment] = useState(null);
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                // Fetch booking details
                const bookingResponse = await axios.get(`https://it342-bituindestinations-qrwd.onrender.com/bookings/${bookingId}`);
                setBooking(bookingResponse.data);

                // Fetch tour package details
                const packageResponse = await axios.get(`https://it342-bituindestinations-qrwd.onrender.com/tour-packages/getById/${bookingResponse.data.tourPackage.id}`);
                setTourPackage(packageResponse.data);

                // Fetch destination details
                const destinationResponse = await axios.get(`https://it342-bituindestinations-qrwd.onrender.com/destination/getById/${packageResponse.data.destinationId}`);
                setDestination(destinationResponse.data);

                // Fetch payment details
                const paymentResponse = await axios.get(`https://it342-bituindestinations-qrwd.onrender.com/payments/booking/${bookingId}`);
                setPayment(paymentResponse.data);

                setLoading(false);
            } catch (error) {
                setError('Failed to load booking details');
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-stone-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            </div>
        );
    }

    if (error || !booking || !tourPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-stone-100">
                <div className="text-red-500">{error || 'Booking not found'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 fixed inset-0 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-amber-700 to-stone-800 px-8 py-10 text-center">
                        <div className="bg-white/10 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="mt-6 text-3xl font-serif font-bold text-white">Booking Receipt</h1>
                        <p className="mt-2 text-amber-100">Reference: #{booking.id}</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Booking Status */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Booking Status</h2>
                            <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                            booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500' :
                                            booking.bookingStatus === 'PENDING' ? 'bg-amber-500' :
                                            'bg-red-500'
                                        }`}></span>
                                        <p className="font-medium text-stone-800">{booking.bookingStatus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tour Package Details */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Tour Package Details</h2>
                            <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-medium text-stone-800">{tourPackage.title}</h3>
                                        <p className="text-stone-600 mt-2">{tourPackage.description}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-stone-500">Destination</p>
                                                <p className="font-medium text-stone-800">{tourPackage.destinationName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Location</p>
                                                <p className="font-medium text-stone-800">{destination?.destinationLocation || 'Location not specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Duration</p>
                                                <p className="font-medium text-stone-800">{tourPackage.duration} days</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-stone-500">Travel Date</p>
                                                <p className="font-medium text-stone-800">
                                                    {new Date(booking.travelDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Number of Travelers</p>
                                                <p className="font-medium text-stone-800">{booking.numOfTravelers}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-stone-500">Total Price</p>
                                                <p className="font-medium text-amber-700">
                                                    ₱{booking.totalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        {payment && (
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
                                                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
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
                                                <p className="text-sm text-stone-500">Transaction ID</p>
                                                <p className="font-medium text-stone-800">{payment.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Itinerary Section */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Tour Itinerary</h2>
                            <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                                <div className="prose prose-stone max-w-none">
                                    <pre className="whitespace-pre-wrap text-stone-600 bg-white p-6 rounded-xl border border-stone-100">
                                        {tourPackage.agenda}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div>
                            <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">Important Information</h2>
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <svg className="h-6 w-6 text-amber-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-stone-800">Check-in Information</p>
                                            <p className="text-stone-600 mt-1">Please arrive at the meeting point 30 minutes before the scheduled departure time.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <svg className="h-6 w-6 text-amber-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-stone-800">What to Bring</p>
                                            <p className="text-stone-600 mt-1">Valid ID, comfortable clothing, water bottle, and any necessary medications.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <svg className="h-6 w-6 text-amber-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-stone-800">Contact Information</p>
                                            <p className="text-stone-600 mt-1">For any questions or concerns, please contact our support team at support@bituindestinations.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enjoy Your Trip Section */}
                        <div className="text-center py-8">
                            <h2 className="text-2xl font-serif font-bold text-amber-700 mb-4">Enjoy Your Trip!</h2>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                We're excited to be part of your journey! Have a wonderful time exploring and creating unforgettable memories.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-base font-medium rounded-xl text-stone-700 bg-white hover:bg-stone-50 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingReceipt; 