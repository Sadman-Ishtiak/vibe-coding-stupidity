import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import ChatbotWidget from '../components/shared/ChatbotWidget';

const RootLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <ChatbotWidget />
      <Footer />
    </div>
  );
};

export default RootLayout;
