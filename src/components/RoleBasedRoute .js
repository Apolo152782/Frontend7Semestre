// RoleBasedRoute.js
import { Navigate, Outlet } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userRole = userData?.rol; // Ej: "ADMIN" o "USER"

    return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/HomePage" />;
};

export default RoleBasedRoute;