import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookingForm({ tourPackage, onClose }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        travelDate: '',
        numOfTravelers: 1,
        paymentMethod: 'CASH',
        paymentStatus: 'PENDING',
        bookingStatus: 'PENDING'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotalPrice = () => {
        return tourPackage.price * formData.numOfTravelers;
    };

    const validateTravelDate = (date) => {
        const selectedDate = new Date(date);
        const startDate = new Date(tourPackage.startDate);
        const endDate = new Date(tourPackage.endDate);
        
        return selectedDate >= startDate && selectedDate <= endDate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate travel date
            if (!validateTravelDate(formData.travelDate)) {
                throw new Error('Travel date must be within the tour package dates');
            }

            // Validate number of travelers
            if (formData.numOfTravelers > tourPackage.availableSlots) {
                throw new Error('Number of travelers exceeds available slots');
            }

            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('You must be logged in to make a booking');
            }

            const bookingData = {
                ...formData,
                userId: parseInt(userId),
                tourPackageId: tourPackage.id,
                totalPrice: calculateTotalPrice()
            };

            // First update the tour package available slots
            const updatedTourPackage = {
                ...tourPackage,
                availableSlots: tourPackage.availableSlots - formData.numOfTravelers
            };

            await axios.put(`http://localhost:8080/tour-packages/update/${tourPackage.id}`, updatedTourPackage);

            // Then create the booking
            const response = await axios.post('http://localhost:8080/bookings', bookingData);
            
            // Create payment
            const paymentData = {
                paymentAmount: calculateTotalPrice(),
                paymentMethod: formData.paymentMethod,
                paymentStatus: formData.paymentStatus,
                bookingId: response.data.id
            };

            await axios.post('http://localhost:8080/payments', paymentData);
            
            // Navigate to booking confirmation page
            navigate(`/booking-confirmation/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Book {tourPackage.title}</h2>
                    <button
                        onClick={() => onClose(false)}
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Travel Date
                        </label>
                        <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleInputChange}
                            min={new Date(tourPackage.startDate).toISOString().split('T')[0]}
                            max={new Date(tourPackage.endDate).toISOString().split('T')[0]}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Tour dates: {new Date(tourPackage.startDate).toLocaleDateString()} - {new Date(tourPackage.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Travelers
                        </label>
                        <input
                            type="number"
                            name="numOfTravelers"
                            value={formData.numOfTravelers}
                            onChange={handleInputChange}
                            min="1"
                            max={tourPackage.availableSlots}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Available slots: {tourPackage.availableSlots}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                        </label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
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

                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price per person:</span>
                                <span className="font-medium">₱{tourPackage.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Number of travelers:</span>
                                <span className="font-medium">{formData.numOfTravelers}</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total Price:</span>
                                    <span className="font-bold text-indigo-600">
                                        ₱{calculateTotalPrice().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingForm; 