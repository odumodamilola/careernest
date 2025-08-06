import { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  Home, Briefcase, BookOpen, Users, MessageSquare, Bell, Search,
  Menu, X, Brain
} from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationsDropdown } from './NotificationsDropdown';
import { CreditUsageWidget } from '../dashboard/CreditUsageWidget';
import { useAuthStore } from '../../stores/authStore';

export function Layout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Feed', path: '/', icon: Home },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Mentorship', path: '/mentorship', icon: Users },
    { name: 'AI Mentor', path: '/ai-mentorship', icon: Brain },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button 
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              <Link to="/" className="flex items-center space-x-2">
                <img src="https://i.ibb.co/35dJPQYC/69b30072-b992-4df8-93fe-f1590f420033.png" alt="CareerNest" className="h-8 w-auto" />
                <span className="hidden text-xl font-bold text-primary-900 md:block">
                  CareerNest
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <item.icon className="mr-1 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search CareerNest..."
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <NotificationsDropdown />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex h-full w-[80%] max-w-xs flex-col overflow-y-auto bg-white pb-12 pt-5 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src="https://i.ibb.co/35dJPQYC/69b30072-b992-4df8-93fe-f1590f420033.png" alt="CareerNest" className="h-8 w-auto" />
                <span className="text-xl font-bold text-primary-900">CareerNest</span>
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-6 px-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search CareerNest..."
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="px-4 py-2 font-medium text-gray-500">Menu</div>
              <nav className="flex flex-col">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-base font-medium ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="mt-6 border-t border-gray-200 px-4 py-4">
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center space-x-3"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150'}
                    alt={user?.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.headline}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}