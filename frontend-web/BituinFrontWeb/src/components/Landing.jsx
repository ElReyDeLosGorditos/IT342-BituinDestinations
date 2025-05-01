import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="pt-16 bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-bottom h-screen relative"
        style={{ backgroundImage: 'url(/images/landingPage.jpg)' }}

      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div> {/* Darker Overlay */}
        
        <div className="max-w-7xl mx-auto px-8 py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-7xl font-bold text-white mb-8 animate__animated animate__fadeIn animate__delay-1s">
              Welcome to Bituin Destinations
            </h1>
            <p className="text-2xl text-white mb-16 max-w-4xl mx-auto animate__animated animate__fadeIn animate__delay-2s">
              Discover amazing tour packages and create unforgettable memories with our curated selection of destinations.
            </p>
            <div className="space-x-8">
              <Link
                to="/login"
                className="landing-btn text-blue-600 hover:bg-gray-100 transition-colors text-xl px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="landing-btn bg-blue-600 text-white hover:bg-white transition-colors text-xl px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

            {/* Destinations Section */}
            <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Explore Amazing Philippine Destinations
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Discover beautiful destinations in the Philippines. Click "Read More" to explore more about each place!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {/* Destination 1 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <img
                src="https://i.natgeofe.com/n/f2662f5e-fa1f-4fa7-a7db-00c8765cecaa/willys-rock-sunset-boracay-island-philippines.jpg"
                alt="Boracay"
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out transform hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Boracay</h3>
                <p className="text-gray-600 mb-4">
                  Famous for its white sandy beaches and vibrant nightlife, Boracay is a top destination in the Philippines.
                </p>
                <Link
                  to="https://www.boracay.com"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-semibold underline transform transition-all duration-300 hover:scale-105"
                >
                  Read More
                </Link>
              </div>
            </div>
            
            {/* Destination 2 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <img
                src="https://www.journeyera.com/wp-content/uploads/2024/01/el-nido-island-hopping-palawan-04365.jpg"
                alt="Palawan"
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out transform hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Palawan</h3>
                <p className="text-gray-600 mb-4">
                  Known for its stunning limestone cliffs, crystal-clear waters, and pristine beaches, Palawan is a nature lover's paradise.
                </p>
                <Link
                  to="https://www.palawan.com"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-semibold underline transform transition-all duration-300 hover:scale-105"
                >
                  Read More
                </Link>
              </div>
            </div>
            
            {/* Destination 3 */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <img
                src="https://sitecore-cd.shangri-la.com/-/media/Shangri-La/cebu_mactanresort/local-guide/exploring-cebu/MAC_Shopping.jpg"
                alt="Cebu"
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out transform hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Cebu</h3>
                <p className="text-gray-600 mb-4">
                  A blend of urban life and rich history, Cebu offers beautiful beaches, great food, and historical landmarks.
                </p>
                <Link
                  to="https://www.cebucitytourism.com"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-semibold underline transform transition-all duration-300 hover:scale-105"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Landing;

