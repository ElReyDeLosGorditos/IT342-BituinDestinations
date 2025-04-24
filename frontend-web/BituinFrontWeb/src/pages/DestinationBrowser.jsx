import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TourPackagesList from './TourPackagesList';

function DestinationBrowser() {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        type: 'ALL',
        region: 'ALL',
        search: ''
    });
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [tourPackages, setTourPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(false);

    const destinationTypes = ['ALL', 'BEACH', 'MOUNTAIN', 'HISTORICAL', 'CULTURAL', 'NATURE', 'URBAN'];
    const regions = [
        'ALL', 'NCR', 'CAR', 'REGION_1', 'REGION_2', 'REGION_3', 'REGION_4A',
        'REGION_4B', 'REGION_5', 'REGION_6', 'REGION_7', 'REGION_8',
        'REGION_9', 'REGION_10', 'REGION_11', 'REGION_12', 'REGION_13'
    ];

    const navigateToPackageDetails = (packageId) => {
        navigate(`/tour-package/${packageId}`);
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    useEffect(() => {
        filterDestinations();
    }, [filters, destinations]);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/destination/getAll');
            setDestinations(response.data);
        } catch (error) {
            setError('Failed to load destinations');
            console.error('Error fetching destinations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDestinations = () => {
        let filtered = [...destinations];

        if (filters.type !== 'ALL') {
            filtered = filtered.filter(dest => dest.destinationType === filters.type);
        }

        if (filters.region !== 'ALL') {
            filtered = filtered.filter(dest => dest.region === filters.region);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(dest =>
                dest.destinationName.toLowerCase().includes(searchTerm) ||
                dest.destinationDescription.toLowerCase().includes(searchTerm) ||
                dest.destinationLocation.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredDestinations(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openDetailModal = async (destination) => {
        setSelectedDestination(destination);
        setShowDetailModal(true);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Fetch tour packages for the selected destination
        try {
            setLoadingPackages(true);
            const response = await axios.get(`http://localhost:8080/tour-packages/getByDestination/${destination.id}`);
            setTourPackages(response.data);
        } catch (error) {
            console.error('Error fetching tour packages:', error);
            setTourPackages([]);
        } finally {
            setLoadingPackages(false);
        }
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedDestination(null);
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    };

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
            'REGION_13': 'Caraga',
            'ALL': 'All Regions'
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
            'URBAN': '🏙️',
            'ALL': '✨'
        };
        return icons[type] || '✨';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-900 mb-4">
                        Discover Extraordinary Destinations
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Explore our handpicked collection of breathtaking locations across the Philippines
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-10">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Refine Your Search</h2>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-6">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search destinations..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                                />
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="relative">
                                <label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
                                    Destination Type
                                </label>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 appearance-none bg-white"
                                >
                                    {destinationTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type === 'ALL' ? 'All Types' : `${getDestinationTypeIcon(type)} ${type}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="relative">
                                <label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
                                    Region
                                </label>
                                <select
                                    name="region"
                                    value={filters.region}
                                    onChange={handleFilterChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 appearance-none bg-white"
                                >
                                    {regions.map(region => (
                                        <option key={region} value={region}>
                                            {getRegionDisplayName(region)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <button
                                onClick={() => setFilters({type: 'ALL', region: 'ALL', search: ''})}
                                className="w-full h-full flex items-center justify-center text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading amazing destinations...</p>
                    </div>
                ) : (
                    <>
                        {/* Results counter */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-medium">{filteredDestinations.length}</span> destinations
                            </p>
                            {filteredDestinations.length > 0 && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                    </svg>
                                    Scroll to explore
                                </div>
                            )}
                        </div>

                        {/* Destinations Grid */}
                        {filteredDestinations.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No destinations found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or try a different search term</p>
                                <button
                                    onClick={() => setFilters({type: 'ALL', region: 'ALL', search: ''})}
                                    className="inline-flex items-center px-4 py-2 border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 rounded-lg transition"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {filteredDestinations.map(destination => (
                                    <div
                                        key={destination.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                        onClick={() => openDetailModal(destination)}
                                    >
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={destination.destinationImage ?
                                                    `http://localhost:8080/files/${destination.destinationImage}` :
                                                    '/placeholder-image.jpg'}
                                                alt={destination.destinationName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-indigo-800 mb-2 shadow-sm">
                                                    {getDestinationTypeIcon(destination.destinationType)} {destination.destinationType}
                                                </div>
                                                <h3 className="text-xl font-serif font-semibold text-white drop-shadow-sm">{destination.destinationName}</h3>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {destination.destinationLocation}
                                            </div>
                                            <p className="text-gray-600 line-clamp-3 mb-4">{destination.destinationDescription}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full">
                                                    {getRegionDisplayName(destination.region)}
                                                </span>
                                                <span className="text-indigo-600 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                                                    View Packages
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Destination Detail Modal */}
            {showDetailModal && selectedDestination && (
                <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDetailModal}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                            <div className="h-72 bg-gray-200">
                                <img
                                    src={selectedDestination.destinationImage ?
                                        `http://localhost:8080/files/${selectedDestination.destinationImage}` :
                                        '/placeholder-image.jpg'}
                                    alt={selectedDestination.destinationName}
                                    className="w-full h-full object-cover rounded-t-2xl"
                                    loading="lazy"
                                />
                            </div>
                            <button
                                onClick={closeDetailModal}
                                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-800 shadow-md">
                                    {getDestinationTypeIcon(selectedDestination.destinationType)} {selectedDestination.destinationType}
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                                <h3 className="text-3xl font-serif font-bold text-gray-900">{selectedDestination.destinationName}</h3>
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full inline-flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                    </svg>
                                    {getRegionDisplayName(selectedDestination.region)}
                                </span>
                            </div>

                            <div className="flex items-center text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{selectedDestination.destinationLocation}</span>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    About this destination
                                </h4>
                                <div className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {selectedDestination.destinationDescription}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loadingPackages ? (
                                    <div className="col-span-full flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : tourPackages.length === 0 ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No tour packages available for this destination.
                                    </div>
                                ) : (
                                    tourPackages.map(pkg => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => navigateToPackageDetails(pkg.id)}
                                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl aspect-square group"
                                    >
                                            <div className="relative h-full">
                                                {/* Background image with gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
                                                <img
                                                    src={selectedDestination.destinationImage ? 
                                                        `http://localhost:8080/files/${selectedDestination.destinationImage}` : 
                                                        '/placeholder-image.jpg'}
                                                    alt={pkg.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                
                                                {/* Content overlay */}
                                                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                                    {/* Top section */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                                                            {pkg.duration}
                                                        </div>
                                                        <div className="bg-indigo-600 text-white rounded-full px-3 py-1 text-sm font-medium">
                                                            ₱{pkg.price.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Bottom section */}
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                                                            {pkg.title}
                                                        </h3>
                                                        <p className="text-sm text-white/80 line-clamp-2">
                                                            {pkg.description}
                                                        </p>
                                                        <div className="flex items-center justify-between pt-2">
                                                            <div className="flex items-center text-white/90">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-sm">{pkg.destinationName}</span>
                                                            </div>
                                                            <div className="flex items-center text-white/90">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-sm">{new Date(pkg.startDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                            </div>
                                        </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={closeDetailModal}
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg inline-flex items-center transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                    </svg>
                                    Back to destinations
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DestinationBrowser;