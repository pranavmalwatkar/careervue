import React, { useState } from "react";
import { Menu, X, Briefcase, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate("home");
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Jobs", id: "jobs", hasDropdown: true },
    { name: "CV Creator", id: "cv-creator" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  const jobsDropdownItems = [
    { name: "Companies", id: "companies" },
    { name: "Government", id: "government" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <img
              src="/logo.png"
              alt="Careervue Logo"
              className="h-8 w-8 transition-transform duration-200 hover:scale-125"
            />
            <span className="text-2xl font-bold text-gray-900">Careervue</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsJobsDropdownOpen(true)}
                    onMouseLeave={() => setIsJobsDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                        ["jobs", "companies", "government"].includes(
                          currentPage
                        )
                          ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isJobsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                        {jobsDropdownItems.map((dropdownItem) => (
                          <button
                            key={dropdownItem.id}
                            onClick={() => {
                              onNavigate(dropdownItem.id);
                              setIsJobsDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                              currentPage === dropdownItem.id
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-700"
                            }`}
                          >
                            {dropdownItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      currentPage === item.id
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate("login")}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate("register")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.hasDropdown ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                        {item.name}
                      </div>
                      {jobsDropdownItems.map((dropdownItem) => (
                        <button
                          key={dropdownItem.id}
                          onClick={() => {
                            onNavigate(dropdownItem.id);
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-6 py-2 text-sm font-medium transition-colors ${
                            currentPage === dropdownItem.id
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-blue-600"
                          }`}
                        >
                          {dropdownItem.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                        currentPage === item.id
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <button
                    onClick={() => {
                      onNavigate("dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors px-3 py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <button
                    onClick={() => {
                      onNavigate("login");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("register");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
