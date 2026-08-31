import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import RoomsPage from "@/pages/Rooms";
import RoomDetailPage from "@/pages/RoomDetail";
import ComparePage from "@/pages/Compare";
import GalleryPage from "@/pages/Gallery";
import OffersPage from "@/pages/Offers";
import ExperiencesPage from "@/pages/Experiences";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import AvailabilityPage from "@/pages/Availability";
import BookingCheckoutPage from "@/pages/BookingCheckout";
import BookingConfirmationPage from "@/pages/BookingConfirmation";
import MyBookingsPage from "@/pages/customer/MyBookings";
import NotFound from "@/pages/NotFound";

import AdminOverview from "@/pages/admin/AdminOverview";
import AdminHotelSettings from "@/pages/admin/AdminHotelSettings";
import AdminRoomTypes from "@/pages/admin/AdminRoomTypes";
import AdminInventory from "@/pages/admin/AdminInventory";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminOffers from "@/pages/admin/AdminOffers";
import AdminExperiences from "@/pages/admin/AdminExperiences";
import AdminReviews from "@/pages/admin/AdminReviews";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/compare" element={<ComparePage />} />
            <Route path="/rooms/:slug" element={<RoomDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/book/:slug" element={<BookingCheckoutPage />} />

            <Route
              path="/booking-confirmation/:id"
              element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute role="customer">
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hotel"
              element={
                <ProtectedRoute role="admin">
                  <AdminHotelSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/room-types"
              element={
                <ProtectedRoute role="admin">
                  <AdminRoomTypes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute role="admin">
                  <AdminInventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute role="admin">
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/offers"
              element={
                <ProtectedRoute role="admin">
                  <AdminOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/experiences"
              element={
                <ProtectedRoute role="admin">
                  <AdminExperiences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute role="admin">
                  <AdminReviews />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
