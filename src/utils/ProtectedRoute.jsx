import { useLocation, Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const location = useLocation();
  const userData = localStorage.getItem("userdata");

  return (
    userData !== null && userData !== undefined
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}

export default ProtectedRoute;
