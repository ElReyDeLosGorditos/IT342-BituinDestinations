// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Wrong role
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;