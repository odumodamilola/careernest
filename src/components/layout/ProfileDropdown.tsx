import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function ProfileDropdown() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
            alt={user?.fullName}
            className="h-full w-full object-cover"
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="truncate text-sm text-gray-500">{user?.email}</p>
          </div>
          
          <Link
            to={`/profile/${user?.id}`}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="mr-3 h-4 w-4" />
            Your Profile
          </Link>
          
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Link>
          
          <Link
            to="/help"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HelpCircle className="mr-3 h-4 w-4" />
            Help Center
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}