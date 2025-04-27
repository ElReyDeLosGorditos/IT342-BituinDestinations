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
      <nav className={`${navbarColor} ${navbarOpacity} shadow-lg fixed w-full z-50`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link 
                to={isLoggedIn ? (isAdmin ? '/admin' : '/home') : '/'} 
                className="text-2xl font-bold text-white"
              >
                Bituin Destinations
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              {isLoggedIn ? (
                  <>
                    {isAdmin ? (
                        <Link
                            to="/admin"
                            className="navbar-btn text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                        >
                            Admin Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/wishlist"
                                className="navbar-btn text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                            >
                                Wishlist
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="navbar-btn text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                            >
                                My Bookings
                            </Link>
                        </>
                    )}
                    <Link
                        to="/profile"
                        className="navbar-btn text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="navbar-btn text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                  </>
              ) : (
                  <>
                    <Link
                        to="/login"
                        className="navbar-btn text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="navbar-btn bg-transparent text-white px-6 py-2 rounded-xl font-medium hover:bg-transparent hover:text-white transition-colors"
                    >
                        Sign Up
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
