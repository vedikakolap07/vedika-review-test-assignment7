import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './nav.css';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const initials = user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo" onClick={() => navigate('/')}>
          <span className="logo-text">MedScript</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {user ? (
            <>
              {user.role === 'patient' ? (
                <>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/patient/dashboard');
                    }}
                    className={`nav-link ${isActive('/patient/dashboard') ? 'active' : ''}`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/patient/prescriptions');
                    }}
                    className={`nav-link ${isActive('/patient/prescriptions') ? 'active' : ''}`}
                  >
                    Prescriptions
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/doctor/profile');
                    }}
                    className={`nav-link ${isActive('/doctor/profile') ? 'active' : ''}`}
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/doctor/prescriptions');
                    }}
                    className={`nav-link ${isActive('/doctor/prescriptions') ? 'active' : ''}`}
                  >
                    Consultations
                  </a>
                </>
              )}
            </>
          ) : (
            <>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/patient/signin');
                }}
                className="nav-link"
              >
                Patient Login
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/doctor/signin');
                }}
                className="nav-link"
              >
                Doctor Login
              </a>
            </>
          )}
        </nav>

        {/* User Menu / Auth Buttons */}
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} />
                ) : (
                  <span className="avatar-initials">{initials}</span>
                )}
              </div>
              <span className="user-name">{user.name}</span>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => navigate('/patient/signin')}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          {user ? (
            <>
              {user.role === 'patient' ? (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/patient/dashboard'); setMobileMenuOpen(false); }}>
                    Dashboard
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/patient/prescriptions'); setMobileMenuOpen(false); }}>
                    Prescriptions
                  </a>
                </>
              ) : (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/doctor/profile'); setMobileMenuOpen(false); }}>
                    Profile
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/doctor/prescriptions'); setMobileMenuOpen(false); }}>
                    Consultations
                  </a>
                </>
              )}
              <button className="btn btn-primary btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/patient/signin'); setMobileMenuOpen(false); }}>
                Patient Login
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/doctor/signin'); setMobileMenuOpen(false); }}>
                Doctor Login
              </a>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;