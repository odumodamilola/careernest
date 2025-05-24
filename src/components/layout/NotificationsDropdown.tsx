import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Notification } from '../../types';

// Sample notifications for demonstration
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'like',
    message: 'Sarah Johnson liked your post',
    read: false,
    entityId: '1',
    entityType: 'post',
    actorId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
  {
    id: '2',
    userId: '1',
    type: 'comment',
    message: 'Michael Chen commented on your post',
    read: false,
    entityId: '1',
    entityType: 'post',
    actorId: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '3',
    userId: '1',
    type: 'follow',
    message: 'TechCorp Innovations started following you',
    read: true,
    actorId: '4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    userId: '1',
    type: 'job',
    message: 'New job posting matching your skills: Frontend Developer at TechCorp',
    read: true,
    entityId: '4',
    entityType: 'job',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  
  // Fetch notifications (simulated)
  useEffect(() => {
    setNotifications(DEMO_NOTIFICATIONS);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative rounded-full p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-100 px-4 py-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start px-4 py-3 hover:bg-gray-50 ${
                    !notification.read ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0">
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDistance(new Date(notification.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-t border-gray-100 px-4 py-2">
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-sm text-primary-600 hover:text-primary-700"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}