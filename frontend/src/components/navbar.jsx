import { useState } from "react";
import { Home as HomeIcon, Heart, Info, HelpCircle, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ onGoHome }) {
  const [open, setOpen] = useState(false);
  const location = useLocation(); // to highlight current page

  const navItems = [
    { name: "Home", to: "/", icon: <HomeIcon size={20} /> },
    { name: "About", to: "/about", icon: <Info size={20} /> },
    { name: "FAQ", to: "/faq", icon: <HelpCircle size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex justify-center mt-5 z-50 relative">
      <div className="bg-white shadow-xl rounded-full px-6 py-3 flex items-center justify-between w-auto min-w-[300px] max-w-md">
        {/* Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center space-x-2 font-bold text-lg text-gray-800"
        >
          <Heart className="text-red-500" size={20} />
          <span>Cura</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center p-2 rounded-full transition ${
                isActive(item.to) ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mt-2 bg-white shadow-xl rounded-xl px-4 py-2 flex flex-col items-center space-y-2 max-w-md absolute">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center justify-center w-full gap-2 p-2 rounded-full transition ${
                isActive(item.to)
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setOpen(false)} // close menu after click
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
