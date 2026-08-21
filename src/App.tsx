/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CMSProvider, useCMS } from './context/CMSContext';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Features from './components/Features';
import HowToOrder from './components/HowToOrder';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SalesNotifications from './components/SalesNotifications';
import DevAdminIcon from './components/DevAdminIcon';

import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminSettings from './admin/AdminSettings';
import AdminProducts from './admin/AdminProducts';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminSecurity from './admin/AdminSecurity';

function FrontendLayout() {
  const { loading } = useCMS();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-green-800">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-semibold text-gray-700">Loading TNA Catfish...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth selection:bg-green-200 selection:text-green-900">
      <Header />
      <main>
        <Hero />
        <About />
        <Products />
        <Features />
        <HowToOrder />
        <Testimonials />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <SalesNotifications />
      <DevAdminIcon />
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Frontend */}
          <Route path="/" element={<FrontendLayout />} />
          
          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Protected Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="security" element={<AdminSecurity />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CMSProvider>
  );
}

