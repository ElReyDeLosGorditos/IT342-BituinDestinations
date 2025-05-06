import { useState, useEffect } from 'react';
import axios from 'axios';

function TourPackageManagement() {
    const [tourPackages, setTourPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [currentPackage, setCurrentPackage] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        agenda: '',
        price: '',
        duration: '',
        availableSlots: '',
        startDate: '',
        endDate: '',
        destinationId: ''
    });

    useEffect(() => {
        fetchDestinations();
        fetchTourPackages();
    }, []);

    useEffect(() => {
        filterPackages();
    }, [searchTerm, selectedDestination, tourPackages]);

    const fetchDestinations = async () => {
        try {
            const response = await axios.get('https://it342-bituindestinations-qrwd.onrender.com/destination/getAll');
            if (Array.isArray(response.data)) {
                setDestinations(response.data);
            } else {
                setDestinations([]);
                setMessage({ text: 'Invalid response format from destinations API', type: 'error' });
            }
        } catch (error) {
            setDestinations([]);
            setMessage({ text: 'Failed to load destinations', type: 'error' });
        }
    };

    const fetchTourPackages = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://it342-bituindestinations-qrwd.onrender.com/tour-packages/getAll');
            setTourPackages(response.data);
            setFilteredPackages(response.data);
        } catch (error) {
            setMessage({ text: 'Failed to load tour packages', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filterPackages = () => {
        let filtered = [...tourPackages];
        if (selectedDestination !== 'ALL') {
            filtered = filtered.filter(pkg => pkg.destinationId === parseInt(selectedDestination));
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(pkg =>
                pkg.title.toLowerCase().includes(term) ||
                pkg.description.toLowerCase().includes(term)
            );
        }
        setFilteredPackages(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            agenda: '',
            price: '',
            duration: '',
            availableSlots: '',
            startDate: '',
            endDate: '',
            destinationId: ''
        });
        setCurrentPackage(null);
    };

    const openAddModal = () => {
        resetForm();
        setFormMode('add');
        setModalOpen(true);
    };

    const openEditModal = (pkg) => {
        setFormData({
            title: pkg.title,
            description: pkg.description,
            agenda: pkg.agenda,
            price: pkg.price,
            duration: pkg.duration,
            availableSlots: pkg.availableSlots,
            startDate: pkg.startDate.split('T')[0],
            endDate: pkg.endDate.split('T')[0],
            destinationId: pkg.destinationId
        });
        setCurrentPackage(pkg);
        setFormMode('edit');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
        setMessage({ text: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const packageData = {
                ...formData,
                price: parseFloat(formData.price),
                availableSlots: parseInt(formData.availableSlots)
            };

            if (formMode === 'add') {
                await axios.post('https://it342-bituindestinations-qrwd.onrender.com/tour-packages/save', packageData);
                setMessage({ text: 'Tour package created successfully!', type: 'success' });
            } else {
                await axios.put(`https://it342-bituindestinations-qrwd.onrender.com/tour-packages/update/${currentPackage.id}`, packageData);
                setMessage({ text: 'Tour package updated successfully!', type: 'success' });
            }

            fetchTourPackages();
            setTimeout(closeModal, 1500);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Error saving tour package',
                type: 'error'
            });
        }
    };

    const handleDelete = (id) => {
        setPackageToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!packageToDelete) return;
        try {
            await axios.delete(`https://it342-bituindestinations-qrwd.onrender.com/tour-packages/delete/${packageToDelete}`);
            setTourPackages(prev => prev.filter(pkg => pkg.id !== packageToDelete));
            setMessage({ text: 'Tour package deleted successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Error deleting tour package', type: 'error' });
        } finally {
            setShowDeleteConfirm(false);
            setPackageToDelete(null);
        }
    };

    const getDestinationName = (pkg) => {
        return pkg.destinationName || 'Unknown Destination';
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-white">Tour Package Management</h2>
                <p className="text-amber-100 mt-1">Manage and organize your tour packages</p>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search packages..."
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
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            className="px-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                        >
                            <option value="ALL">All Destinations</option>
                            {destinations.map(dest => (
                                <option key={dest.id} value={dest.id}>{dest.destinationName}</option>
                            ))}
                        </select>
                        <button
                            onClick={openAddModal}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg shadow-sm transition duration-200 ease-in-out flex items-center justify-center"
                            disabled={loading}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Package
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
                    <p className="mt-3 text-stone-600">Loading tour packages...</p>
                </div>
            )}

            {/* Tour Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map(pkg => (
                    <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{pkg.title}</h3>
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center text-stone-600">
                                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {getDestinationName(pkg)}
                                </p>
                                <p className="flex items-center text-stone-600">
                                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {pkg.duration}
                                </p>
                                <p className="flex items-center text-stone-600">
                                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    ₱{pkg.price.toLocaleString()}
                                </p>
                                <p className="flex items-center text-stone-600">
                                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {pkg.availableSlots} slots available
                                </p>
                                <p className="flex items-center text-stone-600">
                                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mt-4 bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-medium text-stone-800 mb-2">Agenda:</h4>
                                <p className="text-sm text-stone-700 whitespace-pre-line">{pkg.agenda}</p>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => openEditModal(pkg)}
                                    className="text-amber-600 hover:text-amber-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(pkg.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Package count */}
            <div className="text-stone-500 text-sm">
                Showing {filteredPackages.length} of {tourPackages.length} packages
            </div>

            {/* Modal for Add/Edit Package */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-stone-200">
                            <h3 className="text-xl font-serif font-bold text-stone-900">
                                {formMode === 'add' ? 'Add New Tour Package' : 'Edit Tour Package'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                {message.text && (
                                    <div className={`p-4 rounded-lg ${
                                        message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Destination</label>
                                        <select
                                            name="destinationId"
                                            value={formData.destinationId}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            <option value="">Select Destination</option>
                                            {destinations.map(dest => (
                                                <option key={dest.id} value={dest.id}>
                                                    {dest.destinationName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Agenda</label>
                                    <textarea
                                        name="agenda"
                                        value={formData.agenda}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                        placeholder="Day-by-day itinerary..."
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Price (PHP)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Duration</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. 3 days, 2 nights"
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Available Slots</label>
                                    <input
                                        type="number"
                                        name="availableSlots"
                                        value={formData.availableSlots}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-sm transition"
                                >
                                    {formMode === 'add' ? 'Create Package' : 'Update Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Confirm Deletion</h3>
                            <p className="text-stone-600">
                                Are you sure you want to delete this tour package? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TourPackageManagement;
