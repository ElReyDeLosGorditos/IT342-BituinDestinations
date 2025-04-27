import { useState, useEffect } from 'react';
import axios from 'axios';

function DestinationManagement() {
    const [destinations, setDestinations] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        destinationName: '',
        destinationDescription: '',
        destinationType: 'BEACH',
        region: 'NCR',
        destinationImage: '',
        destinationLocation: ''
    });
    const [currentDestination, setCurrentDestination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');

    const destinationTypes = ['BEACH', 'MOUNTAIN', 'HISTORICAL', 'CULTURAL', 'NATURE', 'URBAN'];
    const regions = [
        'NCR', 'CAR', 'REGION_1', 'REGION_2', 'REGION_3', 'REGION_4A',
        'REGION_4B', 'REGION_5', 'REGION_6', 'REGION_7', 'REGION_8',
        'REGION_9', 'REGION_10', 'REGION_11', 'REGION_12', 'REGION_13'
    ];

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/destination/getAll');
            setDestinations(response.data);
        } catch (error) {
            setMessage({ text: 'Failed to load destinations', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, destinationImage: file }));
    };

    const resetForm = () => {
        setFormData({
            destinationName: '',
            destinationDescription: '',
            destinationType: 'BEACH',
            region: 'NCR',
            destinationImage: '',
            destinationLocation: ''
        });
        setCurrentDestination(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('destinationName', formData.destinationName);
            formDataToSend.append('destinationDescription', formData.destinationDescription);
            formDataToSend.append('destinationType', formData.destinationType);
            formDataToSend.append('region', formData.region);
            formDataToSend.append('destinationLocation', formData.destinationLocation);

            if (formData.destinationImage instanceof File) {
                formDataToSend.append('destinationImage', formData.destinationImage);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            let response;
            if (formMode === 'add') {
                response = await axios.post('http://localhost:8080/destination/save', formDataToSend, config);
            } else {
                response = await axios.put(`http://localhost:8080/destination/update/${currentDestination.id}`, formDataToSend, config);
            }

            setMessage({ text: `Destination ${formMode === 'add' ? 'created' : 'updated'} successfully!`, type: 'success' });
            fetchDestinations();
            setTimeout(closeModal, 1500);
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage({
                text: error.response?.data?.message || `Error ${formMode === 'add' ? 'creating' : 'updating'} destination`,
                type: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        setDestinationToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!destinationToDelete) return;

        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/destination/delete/${destinationToDelete}`);
            setDestinations(prev => prev.filter(d => d.id !== destinationToDelete));
            setMessage({ text: 'Destination deleted successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error deleting destination', type: 'error' });
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            setDestinationToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDestinationToDelete(null);
    };

    const openAddModal = () => {
        resetForm();
        setFormMode('add');
        setModalOpen(true);
    };

    const openEditModal = (destination) => {
        setFormData({
            destinationName: destination.destinationName,
            destinationDescription: destination.destinationDescription,
            destinationType: destination.destinationType,
            region: destination.region,
            destinationImage: '',
            destinationLocation: destination.destinationLocation
        });
        setCurrentDestination(destination);
        setFormMode('edit');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
        setMessage({ text: '', type: '' });
    };

    const filteredDestinations = destinations
        .filter(dest => dest.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.destinationDescription.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(dest => filterType ? dest.destinationType === filterType : true);

    const getRegionDisplayName = (regionCode) => {
        const regionMap = {
            'NCR': 'National Capital Region',
            'CAR': 'Cordillera Administrative Region',
            'REGION_1': 'Ilocos Region',
            'REGION_2': 'Cagayan Valley',
            'REGION_3': 'Central Luzon',
            'REGION_4A': 'CALABARZON',
            'REGION_4B': 'MIMAROPA',
            'REGION_5': 'Bicol Region',
            'REGION_6': 'Western Visayas',
            'REGION_7': 'Central Visayas',
            'REGION_8': 'Eastern Visayas',
            'REGION_9': 'Zamboanga Peninsula',
            'REGION_10': 'Northern Mindanao',
            'REGION_11': 'Davao Region',
            'REGION_12': 'SOCCSKSARGEN',
            'REGION_13': 'Caraga'
        };
        return regionMap[regionCode] || regionCode;
    };

    const getDestinationTypeIcon = (type) => {
        const icons = {
            'BEACH': '🏖️',
            'MOUNTAIN': '🏔️',
            'HISTORICAL': '🏛️',
            'CULTURAL': '🎭',
            'NATURE': '🌿',
            'URBAN': '🏙️'
        };
        return icons[type] || '✨';
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-white">Destination Management</h2>
                <p className="text-amber-100 mt-1">Manage and organize your travel destinations</p>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                            />
                            <div className="absolute left-3 top-3 text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-4">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                        >
                            <option value="">All Types</option>
                            {destinationTypes.map(type => (
                                <option key={type} value={type}>{getDestinationTypeIcon(type)} {type}</option>
                            ))}
                        </select>
                        <button
                            onClick={openAddModal}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg shadow-sm transition duration-200 ease-in-out flex items-center justify-center"
                            disabled={loading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Destination
                        </button>
                    </div>
                </div>
            </div>

            {/* Message Display */}
            {message.text && (
                <div className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
                    message.type === 'error' ? 'bg-red-100 text-red-700 border-l-4 border-red-500' :
                        'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                }`}>
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-10">
                    <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                    <p className="mt-3 text-stone-600">Loading destinations...</p>
                </div>
            )}

            {/* Destinations Grid */}
            {!loading && (
                <>
                    <p className="text-stone-600">
                        Showing {filteredDestinations.length} destinations
                    </p>

                    {filteredDestinations.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-stone-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-stone-900">No destinations found</h3>
                            <p className="mt-1 text-stone-500">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDestinations.map(destination => (
                                <div key={destination.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="relative h-60">
                                        <img
                                            src={destination.destinationImage ? `http://localhost:8080/files/${destination.destinationImage}` : '/placeholder-image.jpg'}
                                            alt={destination.destinationName}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-sm">
                                            <span className="text-sm font-medium flex items-center">
                                                {getDestinationTypeIcon(destination.destinationType)} {destination.destinationType}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-serif font-semibold text-stone-900">{destination.destinationName}</h3>
                                        </div>
                                        <p className="text-stone-500 text-sm mb-4">{getRegionDisplayName(destination.region)}</p>
                                        <p className="text-stone-600 mb-6 line-clamp-3">{destination.destinationDescription}</p>
                                        <div className="flex items-center text-sm text-stone-500 mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{destination.destinationLocation}</span>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openEditModal(destination)}
                                                className="px-4 py-2 border border-amber-500 text-amber-500 hover:bg-amber-50 rounded-lg transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(destination.id)}
                                                className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-serif font-bold text-stone-900">
                                    {formMode === 'add' ? 'Add a Breathtaking Destination' : 'Update Destination Details'}
                                </h3>
                                <button onClick={closeModal} className="text-stone-400 hover:text-stone-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-3 rounded-lg ${
                                    message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Destination Name</label>
                                        <input
                                            type="text"
                                            name="destinationName"
                                            value={formData.destinationName}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            required
                                            placeholder="e.g. Boracay Island"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                        <textarea
                                            name="destinationDescription"
                                            value={formData.destinationDescription}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            rows="4"
                                            required
                                            placeholder="Share what makes this destination special..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                                            <select
                                                name="destinationType"
                                                value={formData.destinationType}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            >
                                                {destinationTypes.map(type => (
                                                    <option key={type} value={type}>{getDestinationTypeIcon(type)} {type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Region</label>
                                            <select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            >
                                                {regions.map(region => (
                                                    <option key={region} value={region}>{getRegionDisplayName(region)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
                                        <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-stone-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-stone-500 mb-2">Drag and drop image here, or</p>
                                            <input
                                                type="file"
                                                id="destinationImage"
                                                name="destinationImage"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <label
                                                htmlFor="destinationImage"
                                                className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                                            >
                                                Browse Files
                                            </label>
                                            {formData.destinationImage && (
                                                <p className="mt-2 text-sm text-stone-500">
                                                    Selected: {typeof formData.destinationImage === 'string' ? formData.destinationImage : formData.destinationImage.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="destinationLocation"
                                            value={formData.destinationLocation}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            required
                                            placeholder="e.g. Aklan, Western Visayas"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-sm transition"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : formMode === 'add' ? 'Create Destination' : 'Update Destination'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Confirm Deletion</h3>
                            <p className="text-stone-600">
                                Are you sure you want to remove this destination? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={cancelDelete}
                                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Yes, Delete It'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DestinationManagement;