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

            await axios.put(`https://it342-bituindestinations-qrwd.onrender.com/tour-packages/update/${tourPackage.id}`, updatedTourPackage);

            // Then create the booking
            const response = await axios.post('https://it342-bituindestinations-qrwd.onrender.com/bookings', bookingData);

            // Create payment
            const paymentData = {
                paymentAmount: calculateTotalPrice(),
                paymentMethod: formData.paymentMethod,
                paymentStatus: formData.paymentStatus,
                bookingId: response.data.id
            };

            await axios.post('https://it342-bituindestinations-qrwd.onrender.com/payments', paymentData);

            // Navigate to booking confirmation page
            navigate(`/booking-confirmation/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Book {tourPackage.title}</h2>
                    <button
                        onClick={() => onClose(false)}
                        className="text-stone-500 hover:text-stone-700 transition-colors"
                        aria-label="Close booking form"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
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
                            className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                        />
                        <p className="text-sm text-stone-500 mt-1.5">
                            Tour dates: {new Date(tourPackage.startDate).toLocaleDateString()} - {new Date(tourPackage.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
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
                            className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                        />
                        <p className="text-sm text-stone-500 mt-1.5">
                            Available slots: {tourPackage.availableSlots}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Payment Method
                        </label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2378716c' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        >
                            <option value="CASH">Cash</option>
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="GCASH">GCash</option>
                            <option value="PAYMAYA">PayMaya</option>
                        </select>
                    </div>

                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                        <h3 className="text-lg font-medium text-stone-800 mb-3">Booking Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-stone-600">Price per person:</span>
                                <span className="font-medium text-stone-800">₱{tourPackage.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-600">Number of travelers:</span>
                                <span className="font-medium text-stone-800">{formData.numOfTravelers}</span>
                            </div>
                            <div className="border-t border-amber-200 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="font-medium text-stone-700">Total Price:</span>
                                    <span className="font-bold text-amber-700">
                                        ₱{calculateTotalPrice().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;