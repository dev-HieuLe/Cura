import { useState } from "react";
import { Home as HomeIcon, User, Settings, Menu, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ onGoHome }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center mt-5 z-50 relative">
      <div className="bg-white shadow-xl rounded-full px-6 py-3 flex items-center justify-between w-auto min-w-[300px] max-w-md">
        {/* Website Name */}
        <button
          onClick={onGoHome}
          className="flex items-center space-x-2 font-bold text-lg text-gray-800"
        >
          <Heart className="text-red-500" size={20} />
          <span>Cura</span>
        </button>

        {/* Menu Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onGoHome} // <-- Home icon also goes to step 1
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <HomeIcon size={20} />
          </button>

          <Link
            to="/profile"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <User size={20} />
          </Link>
          <Link
            to="/settings"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Settings size={20} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition md:hidden"
            onClick={() => setOpen(!open)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mt-2 bg-white shadow-xl rounded-full px-4 py-2 flex flex-col items-center space-y-2 max-w-md">
          <button
            onClick={onGoHome}
            className="hover:bg-gray-100 rounded-full w-full text-center py-2"
          >
            Home
          </button>
          <Link
            to="/profile"
            className="hover:bg-gray-100 rounded-full w-full text-center py-2"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="hover:bg-gray-100 rounded-full w-full text-center py-2"
          >
            Settings
          </Link>
        </div>
      )}
    </div>
  );
}
