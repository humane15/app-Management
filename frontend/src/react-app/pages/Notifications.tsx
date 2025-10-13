import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Bell, 
  Settings, 
  Filter,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  MoreVertical,
  Trash2,
  Check
} from 'lucide-react';
import { Notification, generateNotifications } from '@/react-app/components/NotificationCenter';

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'warning' | 'error' | 'info'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setNotifications(generateNotifications());
    }
  }, [user, navigate]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
    setSelectedNotifications(prev => prev.filter(nId => nId !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => 
      prev.filter(n => !selectedNotifications.includes(n.id))
    );
    setSelectedNotifications([]);
  };

  const markSelectedAsRead = () => {
    setNotifications(prev => 
      prev.map(n => 
        selectedNotifications.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelectedNotifications([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
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
    } else if (days === 1) {
      return 'Kemarin';
    } else if (days < 7) {
      return `${days} hari yang lalu`;
    } else {
      return timestamp.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getFilterCount = (filterType: typeof filter) => {
    if (filterType === 'all') return notifications.length;
    if (filterType === 'unread') return unreadCount;
    return notifications.filter(n => n.type === filterType).length;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
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
                  <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Pemberitahuan
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {filteredNotifications.length} notifikasi
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {selectedNotifications.length > 0 && (
                <>
                  <button
                    onClick={markSelectedAsRead}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Tandai Dibaca</span>
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus ({selectedNotifications.length})</span>
                  </button>
                </>
              )}
              
              {unreadCount > 0 && selectedNotifications.length === 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Tandai Semua</span>
                </button>
              )}

              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors">
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            
            {[
              { key: 'all', label: 'Semua', count: getFilterCount('all') },
              { key: 'unread', label: 'Belum Dibaca', count: getFilterCount('unread') },
              { key: 'success', label: 'Berhasil', count: getFilterCount('success') },
              { key: 'warning', label: 'Peringatan', count: getFilterCount('warning') },
              { key: 'error', label: 'Error', count: getFilterCount('error') },
              { key: 'info', label: 'Info', count: getFilterCount('info') }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as typeof filter)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-180 whitespace-nowrap ${
                  filter === filterOption.key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span>{filterOption.label}</span>
                {filterOption.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    filter === filterOption.key
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {filterOption.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
              Tidak ada notifikasi
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {filter === 'unread' 
                ? 'Semua notifikasi sudah dibaca'
                : filter === 'all'
                ? 'Belum ada notifikasi masuk'
                : `Tidak ada notifikasi dengan kategori ${filter}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-all duration-180 ${
                  !notification.read ? 'ring-2 ring-brand-100 dark:ring-brand-900/30' : ''
                } ${
                  selectedNotifications.includes(notification.id) ? 'ring-2 ring-brand-600' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelection(notification.id)}
                    className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-heading text-lg font-medium text-slate-900 dark:text-slate-100 ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 font-body leading-relaxed mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          {notification.action && (
                            <button
                              onClick={notification.action.onClick}
                              className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            title="Tandai sebagai dibaca"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Hapus notifikasi"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
