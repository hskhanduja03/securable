"use client";

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CreditCard, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationsPopoverProps {
  children: React.ReactNode;
}

const notifications = [
  {
    id: 1,
    title: 'Payment Received',
    message: 'You received $954.00 from Alessandro VN',
    time: '2 minutes ago',
    type: 'success',
    icon: CheckCircle,
    unread: true
  },
  {
    id: 2,
    title: 'Card Payment',
    message: 'Netflix subscription charged $15.99',
    time: '1 hour ago',
    type: 'info',
    icon: CreditCard,
    unread: true
  },
  {
    id: 3,
    title: 'Monthly Report',
    message: 'Your November financial report is ready',
    time: '3 hours ago',
    type: 'info',
    icon: TrendingUp,
    unread: false
  },
  {
    id: 4,
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows',
    time: '1 day ago',
    type: 'warning',
    icon: AlertCircle,
    unread: false
  }
];

export function NotificationsPopover({ children }: NotificationsPopoverProps) {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">{unreadCount}</span>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm" className="text-orange-600">
              Mark all read
            </Button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notification.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <notification.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full" size="sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}