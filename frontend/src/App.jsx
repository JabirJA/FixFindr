import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import './style/style.css'
// Public pages
import HomePage from './components/Home/Homepage';
import LoginPage from './components/Login/Loginpage';
import RegisterPage from './components/Register/Registerpage';
import About from './pages/About';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Checkout from './components/Checkout/checkout';
import HIW from './pages/HIW';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SafetyGuidelines from './pages/SafetyGuidelines';
import ContactSupport from './pages/ContactSupport';
import TermsPage from './pages/TermsPage';
import ContractorsListPage from './components/ServiceListing/ContractorsListPage';
import ContractorProfilePage from './components/Contractorprofile/ContractorProfilePage';
import { ThemeProvider } from "./pages/ThemeProvider";

// User-side pages
import UserDashboard from './components/Dashboard/User/UserDashboard';
import UserProfile from './components/Dashboard/User/UserProfile';
import BookingConfirmation from './components/Dashboard/User/BookingConfirmation';
import Chat from './components/Dashboard/User/Chat';
import Security from './components/Dashboard/User/Security';
import AppPreferences from './components/Dashboard/AppPreferences';
import HelpFeedback from './components/Dashboard/User/HelpFeedback';

// Contractor Dashboard
import ContractorDashboardPage from './components/Dashboard/Contractor/ContractorDashboard';
import DashboardHome from './components/Dashboard/Contractor/DashboardHome';
import JobHistoryPage from './components/Dashboard/Contractor/JobHistory';
import MessagesPage from './components/Dashboard/Contractor/Messages';
import CAnalytics from './components/Dashboard/Contractor/CAnalytics';
import AvailabilityPage from './components/Dashboard/Contractor/AvailabilityPage';


// Admin Dashboard (import your new AdminDashboard and AdminMessages)
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';  // New main container for admin
import ContractorManagementPage from './components/Dashboard/Admin/ContractorManagement';
import BookingManagementPage from './components/Dashboard/Admin/BookingManagement';
import AnalyticsPage from './components/Dashboard/Admin/Analytics';
import AdminMessages from './components/Dashboard/Admin/AdminMessages';  // Admin messages for support/disputes
import ContractorIntro from './pages/ContractorIntro';


function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideFooterOn = [
    '/login',
    '/register',
    '/contractor-profile',
    '/user/profile',
    '/user/booking-confirmation',
    '/user/chat',
    '/user/dispute',
    '/contractor/dashboard',
    '/contractor/kyc',
    '/contractor/job-history',
    '/contractor/messages',
    '/admin',
    '/admin/contractors',
    '/admin/bookings',
    '/admin/analytics',
    '/admin/messages',
    '/dashboard',
    '/checkout'
  ];

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/how-it-works" element={<HIW />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/terms/:role" element={<TermsPage />} />
          <Route path="/find-contractors/:serviceType" element={<ContractorsListPage />} />
          <Route path="/find-contractors" element={<ContractorsListPage />} />

          <Route path="/contractor/:name" element={<ContractorProfilePage />} />
          <Route path="/contractor-info" element={<ContractorIntro />} />

         
        {/* Main user dashboard shell */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/preferences" element={<AppPreferences />} />
        <Route path="/dashboard/help-feedback" element={<HelpFeedback />} />

        {/* Sub-pages within dashboard (optional: render inside dashboard as tabs) */}
        <Route path="/dashboard/profile" element={<UserProfile />} />
        <Route path="/dashboard/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/dashboard/chat" element={<Chat />} />
        <Route path="/dashboard/security" element={<Security />} />

        {/* Redirect fallback */}
        <Route path="*" element={<UserDashboard />} />

          {/* Contractor dashboard */}
          <Route path="/contractor/dashboard" element={<ContractorDashboardPage />} />
          <Route path="/contractor/job-history" element={<JobHistoryPage />} />
          <Route path="/contractor/messages" element={<MessagesPage />} />
          <Route path="/contractor/analytics" element={<CAnalytics />} />
          <Route path="/contractor/availability" element={<AvailabilityPage />} />

          {/* Admin dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/contractors" element={<ContractorManagementPage />} />
          <Route path="/admin/bookings" element={<BookingManagementPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
        </Routes>
      </div>
      {!hideFooterOn.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
    <Router>
        <AppWrapper />
    </Router>
    </ThemeProvider>
  );
}

export default App;
