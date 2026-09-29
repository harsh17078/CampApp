import { useLocation, Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Splash from "../components/Splash";

function ProtectedRoute() {
  const location = useLocation();
  const { user, token, loading } = useAuth();

  if (loading) {
    return <Splash />;
  }

  const isAuth = Boolean(user || token || localStorage.getItem("token") || localStorage.getItem("userdata"));

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}

export default ProtectedRoute;

