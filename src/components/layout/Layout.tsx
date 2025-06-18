import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartModal from '../cart/CartModal';
import { useCart } from '../../contexts/CartContext';

const Layout: React.FC = () => {
  const { isCartOpen } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default Layout;