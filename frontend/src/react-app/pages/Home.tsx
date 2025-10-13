import { useAuth } from '@getmocha/users-service/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-bg">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-brand-600" />
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400 font-body">Memuat SetoranPro...</p>
      </div>
    );
  }

  return null;
}
