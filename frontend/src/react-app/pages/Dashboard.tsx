import { useAuth } from '@getmocha/users-service/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Moon, Sun, Receipt, Wallet, Clock, CheckCircle, Menu, Bell } from 'lucide-react';
import { useTheme } from '@/react-app/contexts/ThemeContext';
import FinancialChart from '@/react-app/components/FinancialChart';
import NotificationCenter from '@/react-app/components/NotificationCenter';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-180">
      {/* Header */}
      <header className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors">
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <h1 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                SetoranPro
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-600" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-dark-border">
                <img
                  src={user.google_user_data.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Selamat datang, {user.google_user_data.given_name || user.email}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-body">
            Ringkasan keuangan SPP untuk periode bulan ini
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Tagihan Bulan Ini"
            value="Rp 45,280,000"
            change="+12.5%"
            icon={Receipt}
            color="sky"
          />
          <KPICard
            title="Terkumpul Bulan Ini"
            value="Rp 38,640,000"
            change="+8.2%"
            icon={Wallet}
            color="emerald"
          />
          <KPICard
            title="Tunggakan Aktif"
            value="Rp 6,640,000"
            change="-5.1%"
            icon={Clock}
            color="amber"
          />
          <KPICard
            title="Rasio Pelunasan"
            value="85.3%"
            change="+3.2%"
            icon={CheckCircle}
            color="indigo"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <FinancialChart />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Aksi Cepat
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-brand hover:shadow-lg hover:shadow-sky-500/25 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-180 hover:-translate-y-0.5">
                  Generate Tagihan
                </button>
                <button 
                  onClick={() => navigate('/rekap-setoran')}
                  className="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all duration-180"
                >
                  Rekap Setoran SPP
                </button>
                <button 
                  onClick={() => navigate('/input-pembayaran')}
                  className="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all duration-180"
                >
                  Input Pembayaran
                </button>
                <button 
                  onClick={() => navigate('/import-siswa')}
                  className="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all duration-180"
                >
                  Impor Data Siswa
                </button>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Aktivitas Terbaru
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Pembayaran Ahmad Fauzi diterima</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Tagihan Februari telah digenerate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">3 siswa memiliki tunggakan baru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'sky' | 'emerald' | 'amber' | 'indigo';
}

function KPICard({ title, value, change, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    sky: 'from-sky-50 to-indigo-50 text-sky-600',
    emerald: 'from-emerald-50 to-green-50 text-emerald-600',
    amber: 'from-amber-50 to-orange-50 text-amber-600',
    indigo: 'from-indigo-50 to-purple-50 text-indigo-600',
  };

  const changeColor = change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';

  return (
    <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-all duration-180">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-sm px-2 py-1 rounded-full ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1 font-heading">
        {value}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 font-body">
        {title}
      </p>
    </div>
  );
}
