import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AmbulanceProviderDashboard } from "./pages/AmbulanceProviderDashboard";
import { AmbulanceRequestPage } from "./pages/AmbulanceRequestPage";
import { AuthPage } from "./pages/AuthPage";
import { BookDoctorPage } from "./pages/BookDoctorPage";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { DoctorsPage } from "./pages/DoctorsPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PatientDashboard } from "./pages/PatientDashboard";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/book-doctor" element={<BookDoctorPage />} />
        <Route path="/ambulance" element={<AmbulanceRequestPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={["doctor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={["ambulance_provider"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/provider" element={<AmbulanceProviderDashboard />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/patient" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
