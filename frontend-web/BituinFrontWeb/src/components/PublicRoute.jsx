import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (isLoggedIn) {
        // Redirect based on role
        if (userRole === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/home" replace />;
        }
    }

    return children;
}

export default PublicRoute; 