import { Navigate, useLocation } from "react-router-dom";
import { clearAdminToken, isAdminAuthenticated } from "@/lib/adminAuth";

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  if (!isAdminAuthenticated()) {
    clearAdminToken();
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/admin/login" state={{ from }} replace />;
  }
  return children;
};

export default RequireAdmin;
