import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import LoginPage from "@/react-app/pages/Login";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import DashboardPage from "@/react-app/pages/Dashboard";
import RekapSetoranPage from "@/react-app/pages/RekapSetoran";
import InputPembayaranPage from "@/react-app/pages/InputPembayaran";
import ImportSiswaPage from "@/react-app/pages/ImportSiswa";
import NotificationsPage from "@/react-app/pages/Notifications";
import { ThemeProvider } from "@/react-app/contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rekap-setoran" element={<RekapSetoranPage />} />
            <Route path="/input-pembayaran" element={<InputPembayaranPage />} />
            <Route path="/import-siswa" element={<ImportSiswaPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
