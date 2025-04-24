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
            const response = await axios.get('http://localhost:8080/destination/getAll');
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
            const response = await axios.get('http://localhost:8080/tour-packages/getAll');
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
                await axios.post('http://localhost:8080/tour-packages/save', packageData);
                setMessage({ text: 'Tour package created successfully!', type: 'success' });
            } else {
                await axios.put(`http://localhost:8080/tour-packages/update/${currentPackage.id}`, packageData);
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
            await axios.delete(`http://localhost:8080/tour-packages/delete/${packageToDelete}`);
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
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Tour Package Management</h2>
                <button
                    onClick={openAddModal}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    Add New Package
                </button>
            </div>

            {message.text && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                />
                <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="ALL">All Destinations</option>
                    {destinations.map(dest => (
                        <option key={dest.id} value={dest.id}>{dest.destinationName}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                            <p className="text-sm text-gray-500 mb-1">
                                <strong>Destination:</strong> {getDestinationName(pkg)}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                <strong>Duration:</strong> {pkg.duration}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                <strong>Price:</strong> ${pkg.price}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                <strong>Available Slots:</strong> {pkg.availableSlots}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                <strong>Dates:</strong> {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                            </p>

                            <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                                <h4 className="font-medium mb-1 text-gray-800">Agenda:</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{pkg.agenda}</p>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => openEditModal(pkg)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(pkg.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                        <h3 className="text-xl font-bold mb-4">
                            {formMode === 'add' ? 'Add New Tour Package' : 'Edit Tour Package'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Destination</label>
                                    <select
                                        name="destinationId"
                                        value={formData.destinationId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded"
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
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Agenda</label>
                                <textarea
                                    name="agenda"
                                    value={formData.agenda}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                    placeholder="Day-by-day itinerary..."
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (PHP)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 3 days, 2 nights"
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Available Slots</label>
                                <input
                                    type="number"
                                    name="availableSlots"
                                    value={formData.availableSlots}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    {formMode === 'add' ? 'Create Package' : 'Update Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this tour package?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded"
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
