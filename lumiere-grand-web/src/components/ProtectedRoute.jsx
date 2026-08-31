import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({ children, role }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/my-bookings"} replace />;
  }
  return children;
}
