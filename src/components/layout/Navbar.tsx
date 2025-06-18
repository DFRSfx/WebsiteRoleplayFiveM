import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Users, Building2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, cartItems } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-md' : 'bg-transparent'
      }`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-red-600">ENIGMA</span> RP
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link text-white hover:text-red-400 transition-colors ${isActive ? 'active' : ''}`
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/loja"
              className={({ isActive }) =>
                `nav-link text-white hover:text-red-400 transition-colors ${isActive ? 'active' : ''}`
              }
            >
              Loja
            </NavLink>
            <NavLink
              to="/organizacoes"
              className={({ isActive }) =>
                `nav-link text-white hover:text-red-400 transition-colors ${isActive ? 'active' : ''}`
              }
            >
              Organizações
            </NavLink>
            <NavLink
              to="/candidaturas-staff"
              className={({ isActive }) =>
                `nav-link text-white hover:text-red-400 transition-colors ${isActive ? 'active' : ''}`
              }
            >
              Juntar-se à Staff
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/gestao-candidaturas"
                  className={({ isActive }) =>
                    `nav-link text-white hover:text-red-400 transition-colors ${isActive ? 'active' : ''}`
                  }
                >
                  Gerir Candidaturas
                </NavLink>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link text-white hover:text-red-400 transition-colors ${isActive ? 'active' : ''}`
                  }
                >
                  Admin
                </NavLink>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:text-red-400 transition-colors"
              aria-label="Carrinho de Compras"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <Link
              to="/entrar"
              className="hidden sm:flex btn btn-primary"
            >
              {isLoggedIn ? 'Painel' : 'Entrar'}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-white"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <NavLink
              to="/"
              className="text-white hover:text-red-400 py-2 transition-colors"
            >
              Início
            </NavLink>
            <NavLink
              to="/loja"
              className="text-white hover:text-red-400 py-2 transition-colors"
            >
              Loja
            </NavLink>
            <NavLink
              to="/organizacoes"
              className="text-white hover:text-red-400 py-2 transition-colors"
            >
              Organizações
            </NavLink>
            <NavLink
              to="/candidaturas-staff"
              className="text-white hover:text-red-400 py-2 transition-colors"
            >
              Juntar-se à Staff
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/gestao-candidaturas"
                  className="text-white hover:text-red-400 py-2 transition-colors"
                >
                  Gerir Candidaturas
                </NavLink>
                <NavLink
                  to="/admin"
                  className="text-white hover:text-red-400 py-2 transition-colors"
                >
                  Admin
                </NavLink>
              </>
            )}

            <Link
              to="/entrar"
              className="btn btn-primary w-full text-center"
            >
              {isLoggedIn ? 'Painel' : 'Entrar'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;