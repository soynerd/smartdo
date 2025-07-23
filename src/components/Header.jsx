import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authStatus from "../api/authStatus";
import logout from "../api/logout";

// --- NEW: A dedicated, animated hamburger icon component for better UX and cleaner code ---
const HamburgerIcon = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
    aria-controls="mobile-menu"
    aria-expanded={isOpen}
  >
    <span className="sr-only">Open main menu</span>
    <div className="space-y-1.5">
      <span
        className={`block h-0.5 w-6 bg-current transform transition-transform duration-300 ease-in-out ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      ></span>
      <span
        className={`block h-0.5 w-6 bg-current transform transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-0" : ""
        }`}
      ></span>
      <span
        className={`block h-0.5 w-6 bg-current transform transition-transform duration-300 ease-in-out ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      ></span>
    </div>
  </button>
);

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  // --- FIX: Corrected useEffect to prevent infinite loops. Runs only once on mount. ---
  useEffect(() => {
    authStatus().then(setStatus);
  }, []); // Empty dependency array ensures this runs only once.

  // --- FIX: Corrected logout logic and added menu closing ---
  const handleLogout = () => {
    logout().then(() => {
      setStatus(false); // Update status AFTER logout completes
      setIsMobileMenuOpen(false); // Close mobile menu if open
      navigate("/"); // Navigate after successful logout
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // --- UX Improvement: Closes mobile menu after a link is clicked ---
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ` +
    `hover:bg-blue-100 dark:hover:bg-gray-700 ` +
    `${
      isActive
        ? "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-gray-700"
        : "text-gray-700 dark:text-gray-300"
    }`;

  // --- UI Improvement: Added a more distinct active link style (bottom border) ---
  const getDesktopNavLinkClasses = ({ isActive }) =>
    `relative px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ` +
    `hover:text-blue-600 dark:hover:text-blue-300 ` +
    `${
      isActive
        ? "text-blue-600 dark:text-blue-300"
        : "text-gray-600 dark:text-gray-300"
    }` +
    // The after pseudo-element creates the underline effect for the active link
    ` after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300` +
    ` ${isActive ? "after:w-full" : ""}`;

  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              SmartDo
            </NavLink>
          </div>

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
            {!status ? (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
              >
                Login
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                Logout
              </button>
            )}
          </nav>

          <div className="flex md:hidden">
            <HamburgerIcon
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* --- UI Improvement: Added transition classes for a smooth slide-down effect --- */}
      <div
        className={`md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full absolute"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/"
            className={getNavLinkClasses}
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/manual"
            className={getNavLinkClasses}
            onClick={closeMobileMenu}
          >
            Plan My Do
          </NavLink>
          <NavLink
            to="/previous"
            className={getNavLinkClasses}
            onClick={closeMobileMenu}
          >
            Previous Tasks
          </NavLink>
          <div className="pt-2">
            {!status ? (
              <NavLink
                to="/login"
                className={getNavLinkClasses}
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className={`${getNavLinkClasses({
                  isActive: false,
                })} w-full text-left text-red-500`}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
