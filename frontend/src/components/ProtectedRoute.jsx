import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const userRole = user.role?.toLowerCase()?.trim();
        const normalizedAllowedRoles = allowedRoles.map(r => r?.toLowerCase()?.trim());

        // Handle common typos automatically
        let hasAccess = normalizedAllowedRoles.includes(userRole);
        if (!hasAccess && userRole === 'inventory_managerr' && normalizedAllowedRoles.includes('inventory_manager')) {
            hasAccess = true;
        }

        if (!hasAccess) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
