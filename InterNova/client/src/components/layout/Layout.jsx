import { Outlet } from 'react-router-dom';
import { useBootstrap } from '@/hooks';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  // Ensure Bootstrap JS is loaded
  useBootstrap();

  return (
    <div className="main-content">
      <Navbar />
      <div className="page-content">
        {children || <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
