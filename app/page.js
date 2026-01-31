"use client";

import { LandingPage } from "@/components/home/Landing";
import { LoginView } from "@/components/auth/LoginView";
import { RegisterView } from "@/components/auth/RegisterView";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { FarmerDashboard } from "@/components/dashboard/FarmerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function App() {
  const [currentView, setCurrentView] = useState("landing"); // landing, login, register, buyer-dashboard, farmer-dashboard, admin-dashboard
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Location state
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Check for existing session
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      const role = JSON.parse(savedUser).role;
      if (role === "buyer") setCurrentView("buyer-dashboard");
      else if (role === "farmer") setCurrentView("farmer-dashboard");
      else if (role === "admin") setCurrentView("admin-dashboard");
    }
  }, []);

  // Request location for buyers
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          setLocationError(null);
          toast.success("Location detected successfully");
        },
        (error) => {
          setLocationError("Unable to get location. Please enable GPS.");
          toast.error("Location access denied");
        },
      );
    } else {
      setLocationError("Geolocation not supported");
      toast.error("Geolocation not supported");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setCurrentView("landing");
    setLocation(null);
    toast.success("Logged out successfully");
  };

  return (
    <>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      {currentView === "landing" && (
        <LandingPage setCurrentView={setCurrentView} />
      )}
      {currentView === "login" && (
        <LoginView
          setCurrentView={setCurrentView}
          loading={loading}
          setLoading={setLoading}
          setUser={setUser}
          setToken={setToken}
        />
      )}
      {currentView === "register" && (
        <RegisterView
          setCurrentView={setCurrentView}
          loading={loading}
          setLoading={setLoading}
          requestLocation={requestLocation}
          location={location}
          setToken={setToken}
          setUser={setUser}
        />
      )}
      {currentView === "buyer-dashboard" && (
        <BuyerDashboard
          user={user}
          logout={logout}
          loading={loading}
          setLoading={setLoading}
          requestLocation={requestLocation}
          token={token}
          location={location}
        />
      )}
      {currentView === "farmer-dashboard" && (
        <FarmerDashboard
          user={user}
          loading={loading}
          setLoading={setLoading}
          logout={logout}
          token={token}
        />
      )}
      {currentView === "admin-dashboard" && (
        <AdminDashboard user={user} token={token} logout={logout} />
      )}
    </>
  );
}
