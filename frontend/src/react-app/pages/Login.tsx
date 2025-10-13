import { useAuth } from '@getmocha/users-service/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Moon, Sun, Shield, Zap, Users } from 'lucide-react';
import { useTheme } from '@/react-app/contexts/ThemeContext';

export default function Login() {
  const { user, redirectToLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await redirectToLogin();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-bg transition-colors duration-180">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-10 p-3 rounded-xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border border-slate-200 dark:border-dark-border hover:bg-white dark:hover:bg-dark-surface transition-all duration-180 shadow-sm hover:shadow-md"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-600" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Desktop: Split Layout */}
      <div className="hidden lg:flex w-full">
        {/* Hero Panel */}
        <div className="flex-1 relative overflow-hidden bg-gradient-brand flex items-center justify-center p-12">
          <div className="relative z-10 max-w-lg text-white">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="font-heading text-4xl font-bold tracking-tight">SetoranPro</h1>
              <p className="text-sky-100 mt-2 text-lg">Platform Manajemen Keuangan SPP Profesional</p>
            </div>

            {/* Value Props */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">Keamanan Terjamin</h3>
                  <p className="text-sky-100">Data finansial terlindungi dengan enkripsi tingkat bank</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">Proses Cepat</h3>
                  <p className="text-sky-100">Generate tagihan dan rekap pembayaran dalam hitungan detik</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">Multi-Tenant</h3>
                  <p className="text-sky-100">Kelola multiple yayasan dan pesantren dalam satu platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Abstract background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 backdrop-blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/10 backdrop-blur-3xl"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="lg:hidden w-full">
        {/* Mobile Hero */}
        <div className="bg-gradient-brand text-white p-8 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">SetoranPro</h1>
          <p className="text-sky-100">Platform Manajemen Keuangan SPP</p>
        </div>

        {/* Mobile Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-dark-border shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Masuk ke SetoranPro
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-body">
          Kelola keuangan SPP dengan mudah dan aman
        </p>
      </div>

      {/* Google Login Button */}
      <button
        onClick={onLogin}
        className="w-full flex items-center justify-center space-x-3 bg-gradient-brand hover:shadow-lg hover:shadow-sky-500/25 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-180 hover:-translate-y-0.5 active:translate-y-0"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Masuk dengan Google</span>
      </button>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Dengan masuk, Anda menyetujui Syarat & Ketentuan kami
      </div>
    </div>
  );
}
