import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo3 from '../assets/logo3.png';
import svgIcon from '../assets/icon.svg';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const hoverTimeout = useRef(null);

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // short delay to prevent flicker
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  return (
    <header className="bg-[#000101de] text-white shadow-md flex items-center justify-between px-6 py-5 sticky top-0 z-50">
      <div className="logo w-[200px]">
        <a href="https://www.gatwickforklifts.co.uk/">
          <img src={logo3} alt="Company Logo" />
        </a>
      </div>

      {/* Hover wrapper including both icon and dropdown */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cursor-pointer flex items-center space-x-2">
          <img src={svgIcon} alt="User Icon" className="w-[45px]" />
          <span className="font-medium">{user.name}</span>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-[#ff9925] text-black"
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
