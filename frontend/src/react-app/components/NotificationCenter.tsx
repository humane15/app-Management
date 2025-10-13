import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  Receipt,
  Users
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Sample notifications data
const generateNotifications = (): Notification[] => [
  {
    id: '1',
    type: 'success',
    title: 'Pembayaran Diterima',
    message: 'Ahmad Fauzi - Kelas Tgk Ibnu telah melunasi SPP bulan Desember sebesar Rp 250.000',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    action: {
      label: 'Lihat Detail',
      onClick: () => console.log('View payment details')
    }
  },
  {
    id: '2',
    type: 'warning',
    title: 'Tunggakan Meningkat',
    message: '15 santri memiliki tunggakan SPP lebih dari 2 bulan. Segera lakukan tindak lanjut.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    action: {
      label: 'Lihat Daftar',
      onClick: () => console.log('View overdue list')
    }
  },
  {
    id: '3',
    type: 'info',
    title: 'Tagihan Bulan Baru',
    message: 'Tagihan SPP untuk bulan Januari 2025 telah berhasil digenerate untuk 150 santri.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Gagal Import Data',
    message: 'Import data siswa dari file CSV gagal. Format file tidak sesuai template.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    action: {
      label: 'Download Template',
      onClick: () => console.log('Download CSV template')
    }
  },
  {
    id: '5',
    type: 'success',
    title: 'Target Tercapai',
    message: 'Rasio pelunasan bulan ini mencapai 85.3%, melebihi target 80%.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true
  },
  {
    id: '6',
    type: 'warning',
    title: 'Deadline Mendekati',
    message: 'Batas waktu pelunasan SPP untuk 25 santri akan berakhir dalam 3 hari.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    read: false
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setNotifications(generateNotifications());
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
      return `${hours} jam yang lalu`;
    } else {
      return `${days} hari yang lalu`;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-l border-slate-200 dark:border-dark-border shadow-2xl z-50 transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
                Pemberitahuan
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {unreadCount} belum dibaca
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-dark-border">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-dark-border rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-180 ${
                filter === 'all'
                  ? 'bg-white dark:bg-dark-surface shadow-sm text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-180 ${
                filter === 'unread'
                  ? 'bg-white dark:bg-dark-surface shadow-sm text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Belum Dibaca {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
            >
              Tandai Semua
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="font-heading text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                {filter === 'unread' ? 'Tidak ada notifikasi baru' : 'Tidak ada notifikasi'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {filter === 'unread' 
                  ? 'Semua notifikasi sudah dibaca'
                  : 'Notifikasi akan muncul di sini'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-dark-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-sky-50/50 dark:bg-sky-950/20 border-l-4 border-l-brand-600' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium text-slate-900 dark:text-slate-100 ${
                          !notification.read ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center space-x-2 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                        
                        {notification.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action!.onClick();
                            }}
                            className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-slate-200 dark:border-dark-border p-4">
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => window.location.href = '/notifications'}
              className="flex items-center justify-center space-x-2 p-3 bg-gradient-brand text-white rounded-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-180 hover:-translate-y-0.5"
            >
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Lihat Semua Notifikasi</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 p-3 bg-slate-100 dark:bg-dark-border rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Receipt className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tagihan</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-3 bg-slate-100 dark:bg-dark-border rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tunggakan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { generateNotifications };
