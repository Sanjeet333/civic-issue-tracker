import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./Navbar";
import CitizenDashboard from "./CitizenDashboard";
import ReportIssueForm from "./ReportIssueForm";
import AdminPanel from "./AdminPanel";

const CommunityHeroApp = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex justify-center p-10 text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-300">
      
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {user.role === "admin" ? (
          <AdminPanel />
        ) : (
          <Routes>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/report" element={<ReportIssueForm />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </main>
      
    </div>
  );
};

export default CommunityHeroApp;