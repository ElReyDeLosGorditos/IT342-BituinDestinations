import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  const [navbarColor, setNavbarColor] = useState('bg-black');
  const [navbarOpacity, setNavbarOpacity] = useState('bg-opacity-100');

  useEffect(() => {
    if (location.pathname === '/signup') {
      setNavbarColor('bg-white');
      setNavbarOpacity('bg-opacity-30');
    } else if (location.pathname === '/login') {
      setNavbarColor('bg-black');
      setNavbarOpacity('bg-opacity-25');
    } else if (location.pathname === '/') {
      setNavbarColor('bg-black');
      setNavbarOpacity('bg-opacity-40');
    } else if (location.pathname === '/home') {
      setNavbarColor('bg-black');
      setNavbarOpacity('bg-opacity-90');
    } else {
      setNavbarColor('bg-black');
      setNavbarOpacity('bg-opacity-80');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <nav className={`${navbarColor} ${navbarOpacity} shadow-lg fixed w-full z-50 backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link 
              to={isLoggedIn ? (isAdmin ? '/admin' : '/home') : '/'}
              className="text-2xl font-bold text-white hover:text-amber-400 transition-colors duration-300"
            >
              Bituin Destinations
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <div className="hidden md:flex items-center space-x-4">
                    <Link
                      to="/wishlist"
                      className="text-white hover:text-amber-400 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="text-white hover:text-amber-400 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      My Bookings
                    </Link>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-white hover:text-amber-400 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-amber-400 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-amber-600 hover:bg-amber-700 text-white hover:text-amber-100 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
