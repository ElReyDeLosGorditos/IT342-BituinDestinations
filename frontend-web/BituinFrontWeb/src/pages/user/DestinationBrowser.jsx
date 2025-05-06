import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TourPackagesList from './TourPackagesList.jsx';

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
            const response = await axios.get('https://it342-bituindestinations-qrwd.onrender.com/destination/getAll');
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
            const response = await axios.get(`https://it342-bituindestinations-qrwd.onrender.com/tour-packages/getByDestination/${destination.id}`);
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
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                        Discover the Philippines
                    </h1>
                    <p className="text-stone-600 text-lg max-w-3xl mx-auto">
                        Explore breathtaking destinations across the 7,641 islands of the Philippine archipelago
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-stone-800">Find Your Perfect Destination</h2>
                        <button
                            onClick={() => setFilters({type: 'ALL', region: 'ALL', search: ''})}
                            className="text-sm text-stone-500 hover:text-stone-700 flex items-center transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search destinations..."
                                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-olive-300 focus:border-olive-300 transition-all bg-stone-50"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-stone-500">
                                Destination Type
                            </label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-olive-300 focus:border-olive-300 appearance-none bg-stone-50"
                            >
                                {destinationTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'ALL' ? 'All Types' : `${getDestinationTypeIcon(type)} ${type}`}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 text-stone-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-stone-500">
                                Region
                            </label>
                            <select
                                name="region"
                                value={filters.region}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-olive-300 focus:border-olive-300 appearance-none bg-stone-50"
                            >
                                {regions.map(region => (
                                    <option key={region} value={region}>
                                        {getRegionDisplayName(region)}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 text-stone-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
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
                        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-stone-600 text-lg">Discovering amazing destinations...</p>
                    </div>
                ) : (
                    <>
                        {/* Results counter */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-stone-600">
                                <span className="font-medium text-stone-900">{filteredDestinations.length}</span> destinations found
                            </p>
                            {filteredDestinations.length > 0 && (
                                <div className="flex items-center text-sm text-stone-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    Scroll to explore
                                </div>
                            )}
                        </div>

                        {/* Destinations Grid */}
                        {filteredDestinations.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <h3 className="text-xl font-medium text-stone-900 mb-2">No destinations found</h3>
                                <p className="text-stone-500 mb-6">Try adjusting your filters or try a different search term</p>
                                <button
                                    onClick={() => setFilters({type: 'ALL', region: 'ALL', search: ''})}
                                    className="inline-flex items-center px-4 py-2 border border-olive-600 text-olive-700 bg-white hover:bg-olive-50 rounded-lg transition"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {filteredDestinations.map(destination => (
                                    <div
                                        key={destination.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                        onClick={() => openDetailModal(destination)}
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={destination.destinationImage ?
                                                    `https://it342-bituindestinations-qrwd.onrender.com/files/${destination.destinationImage || "/placeholder.svg"}` :
                                                    '/placeholder-image.jpg'}
                                                alt={destination.destinationName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-stone-800 mb-2 shadow-sm">
                                                    {getDestinationTypeIcon(destination.destinationType)} {destination.destinationType}
                                                </div>
                                                <h3 className="text-xl font-serif font-semibold text-white drop-shadow-sm">{destination.destinationName}</h3>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center text-sm text-stone-500 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {destination.destinationLocation}
                                            </div>
                                            <p className="text-stone-600 line-clamp-3 mb-4 text-sm">{destination.destinationDescription}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full">
                                                    {getRegionDisplayName(destination.region)}
                                                </span>
                                                <span className="text-olive-700 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
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
                            <div className="h-80 bg-stone-200">
                                <img
                                    src={selectedDestination.destinationImage ?
                                        `https://it342-bituindestinations-qrwd.onrender.com/files/${selectedDestination.destinationImage || "/placeholder.svg"}` :
                                        '/placeholder-image.jpg'}
                                    alt={selectedDestination.destinationName}
                                    className="w-full h-full object-cover rounded-t-2xl"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
                            </div>
                            <button
                                onClick={closeDetailModal}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-olive-300"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-stone-800 shadow-md">
                                    {getDestinationTypeIcon(selectedDestination.destinationType)} {selectedDestination.destinationType}
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                                <h3 className="text-3xl font-serif font-bold text-stone-900">{selectedDestination.destinationName}</h3>
                                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-sm font-medium rounded-full inline-flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                    </svg>
                                    {getRegionDisplayName(selectedDestination.region)}
                                </span>
                            </div>

                            <div className="flex items-center text-stone-600 mb-6 bg-stone-50 p-3 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{selectedDestination.destinationLocation}</span>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-stone-900 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    About this destination
                                </h4>
                                <div className="text-stone-600 leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    {selectedDestination.destinationDescription}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    Available Tour Packages
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loadingPackages ? (
                                    <div className="col-span-full flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
                                    </div>
                                ) : tourPackages.length === 0 ? (
                                    <div className="col-span-full bg-stone-50 rounded-xl p-8 text-center text-stone-500 border border-stone-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p>No tour packages available for this destination yet.</p>
                                        <p className="text-sm mt-2">Check back soon for exciting new offers!</p>
                                    </div>
                                ) : (
                                    tourPackages.map(pkg => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => navigateToPackageDetails(pkg.id)}
                                            className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-lg group"
                                        >
                                            <div className="relative h-40">
                                                {/* Background image with gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70"></div>
                                                <img
                                                    src={selectedDestination.destinationImage ?
                                                        `https://it342-bituindestinations-qrwd.onrender.com/files/${selectedDestination.destinationImage}` :
                                                        '/placeholder-image.jpg'}
                                                    alt={pkg.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />

                                                {/* Content overlay */}
                                                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                                    {/* Top section */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                                                            {pkg.duration}
                                                        </div>
                                                        <div className="bg-olive-700 text-white rounded-full px-3 py-1 text-xs font-medium">
                                                            ₱{pkg.price.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Bottom section */}
                                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-100 transition-colors line-clamp-1">
                                                        {pkg.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-stone-600 line-clamp-2 mb-3">
                                                    {pkg.description}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-stone-500">
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{new Date(pkg.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        <span>{pkg.destinationName}</span>
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
                                    className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg inline-flex items-center transition-colors"
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