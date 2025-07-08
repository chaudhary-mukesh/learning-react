import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Dummy default fallback user
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-6 py-4 sticky top-0 z-50">
      <div className="logo">
        <a href="https://www.gatwickforklifts.co.uk/">
          <img src="./assets/logo3.png" alt="Company Logo" className="h-10" />
        </a>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={toggleDropdown}
          className="cursor-pointer flex items-center space-x-2 "
        >
          <img src="/assets/images/icon.svg" alt="User Icon" className="w-[45px]" />
          <span className="font-medium">{user.name}</span>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40">
            {/* <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a> */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
