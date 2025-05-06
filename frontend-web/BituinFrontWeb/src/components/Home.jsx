import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const destinationTypes = ['ALL', 'BEACH', 'MOUNTAIN', 'HISTORICAL', 'CULTURAL', 'NATURE', 'URBAN'];
  const regions = [
    'ALL', 'NCR', 'CAR', 'REGION_1', 'REGION_2', 'REGION_3', 'REGION_4A',
    'REGION_4B', 'REGION_5', 'REGION_6', 'REGION_7', 'REGION_8',
    'REGION_9', 'REGION_10', 'REGION_11', 'REGION_12', 'REGION_13'
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://it342-bituindestinations-qrwd.onrender.com/getAll');
      setDestinations(response.data);
    } catch (err) {
      setError('Failed to load destinations');
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(destination => {
    if (selectedType !== 'ALL' && destination.destinationType !== selectedType) return false;
    if (selectedRegion !== 'ALL' && destination.region !== selectedRegion) return false;
    return true;
  });

  if (loading) {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-2xl text-gray-600">Loading destinations...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Popular Destinations</h1>

          {error && (
              <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {destinationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(destination => (
                <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                  <img
                      src={destination.destinationImage ? `https://it342-bituindestinations-qrwd.onrender.com/files/${destination.destinationImage}` : '/images/placeholder.jpg'}
                      alt={destination.destinationName}
                      className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {destination.destinationName}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {destination.destinationType}
                  </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {destination.region}
                  </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {destination.destinationDescription}
                    </p>
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {destination.destinationLocation}
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No destinations found matching your filters.
                </p>
              </div>
          )}
        </div>
      </div>
  );
}

export default Home;