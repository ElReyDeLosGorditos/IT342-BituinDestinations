import { useState, useEffect } from 'react';
import axios from 'axios';

function TourPackagesList({ destinationId }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/tour-packages/getByDestination/${destinationId}`);
                setPackages(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load tour packages');
                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        if (destinationId) {
            fetchPackages();
        }
    }, [destinationId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading packages...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
            </div>
        );
    }

    if (packages.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">No tour packages available for this destination.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {packages.map((pkg) => (
                <div key={pkg.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">{pkg.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{pkg.duration}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-indigo-600">₱{pkg.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{pkg.availableSlots} slots left</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>

                    <div className="bg-white rounded p-3 mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Itinerary:</h5>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{pkg.agenda}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">
                            {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                            Book Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TourPackagesList;