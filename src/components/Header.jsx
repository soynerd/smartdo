import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authStatus from "../api/authStatus";
import logout from "../api/logout";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    authStatus().then(setStatus);
  }, [status]);

  const handleLogout = () => {
    logout().then(setStatus(false));
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ` + // Changed text-base to text-lg
    `hover:bg-blue-100 dark:hover:bg-blue-800 ` +
    `${
      isActive
        ? "text-blue-700 bg-blue-50 dark:text-blue-200 dark:bg-blue-900"
        : "text-gray-700 dark:text-gray-300"
    }`;

  const getDesktopNavLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ` + // Changed text-sm to text-base
    `hover:text-blue-700 dark:hover:text-blue-200 ` +
    `${
      isActive
        ? "text-blue-700 dark:text-blue-200 font-semibold"
        : "text-gray-700 dark:text-gray-300"
    }`;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              SmartDo
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            <NavLink to="/" className={getDesktopNavLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/manual" className={getDesktopNavLinkClasses}>
              Plan My Do
            </NavLink>
            <NavLink to="/previous" className={getDesktopNavLinkClasses}>
              Previous Tasks
            </NavLink>
            {!status && (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900"
              >
                Login
              </NavLink>
            )}
            {status && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu button (Hamburger Icon) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={getNavLinkClasses}
              onClick={toggleMobileMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/previous"
              className={getNavLinkClasses}
              onClick={toggleMobileMenu}
            >
              Previous Tasks
            </NavLink>
            {!status && (
              <NavLink
                to="/login"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900"
              >
                Login
              </NavLink>
            )}
            {status && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
