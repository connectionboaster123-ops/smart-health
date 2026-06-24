import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";

export function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: UserRole[] }) {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          Loading MediRescue...
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to={`/${profile.role === "ambulance_provider" ? "provider" : profile.role}`} replace />;
  }

  return children;
}
