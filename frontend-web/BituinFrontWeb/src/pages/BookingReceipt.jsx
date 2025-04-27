import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookingReceipt() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [tourPackage, setTourPackage] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                // Fetch booking details
                const bookingResponse = await axios.get(`http://localhost:8080/bookings/${bookingId}`);
                setBooking(bookingResponse.data);

                // Fetch tour package details
                const packageResponse = await axios.get(`http://localhost:8080/tour-packages/getById/${bookingResponse.data.tourPackage.id}`);
                setTourPackage(packageResponse.data);

                // Fetch payment details
                const paymentResponse = await axios.get(`http://localhost:8080/payments/booking/${bookingId}`);
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !booking || !tourPackage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error || 'Booking not found'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Receipt</h1>
                        <p className="mt-2 text-gray-600">
                            Booking Reference: #{booking.id}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Tour Package Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tour Package Details</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Package Name</p>
                                        <p className="font-medium text-gray-900">{tourPackage.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Destination</p>
                                        <p className="font-medium text-gray-900">{tourPackage.destinationName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Travel Date</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(booking.travelDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Number of Travelers</p>
                                        <p className="font-medium text-gray-900">{booking.numOfTravelers}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Price</p>
                                        <p className="font-medium text-gray-900">
                                            ₱{booking.totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Booking Status</p>
                                        <p className={`font-medium ${
                                            booking.bookingStatus === 'CONFIRMED' ? 'text-green-600' :
                                            booking.bookingStatus === 'PENDING' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                            {booking.bookingStatus}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        {payment && (
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
                                            <p className={`font-medium ${
                                                payment.paymentStatus === 'PAID' ? 'text-green-600' :
                                                payment.paymentStatus === 'PENDING' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                                {payment.paymentStatus}
                                            </p>
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
                                        <div>
                                            <p className="text-sm text-gray-500">Transaction ID</p>
                                            <p className="font-medium text-gray-900">{payment.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Package Description */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Description</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-600">{tourPackage.description}</p>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>Please arrive at least 30 minutes before the scheduled departure time</li>
                                    <li>Bring valid identification for all travelers</li>
                                    <li>Check the weather forecast and pack accordingly</li>
                                    <li>Contact our customer service for any special requirements</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingReceipt; 