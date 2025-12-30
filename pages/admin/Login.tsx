import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, AlertCircle, Loader2, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!email || !password) {
        setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        setIsLoading(false);
        return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Đăng nhập thất bại.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-accent/30">
                <Lock size={32} />
            </div>
            <h1 className="font-display font-bold text-3xl text-dark dark:text-white mb-2">Admin Portal</h1>
            <p className="text-slate-500 text-sm">Đăng nhập để truy cập hệ thống quản trị Grifow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-dark dark:text-white placeholder:text-slate-400"
                placeholder="admin@grifow.com"
                autoFocus
                disabled={isLoading}
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mật khẩu</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-dark dark:text-white placeholder:text-slate-400"
                placeholder="••••••••"
                disabled={isLoading}
                />
            </div>
             {error && (
                <div className="flex items-start gap-2 text-red-500 text-xs mt-3 font-medium animate-pulse bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /> 
                    <span>{error}</span>
                </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-dark dark:bg-white text-white dark:text-dark font-bold rounded-xl shadow-lg hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <Loader2 size={18} className="animate-spin" />
            ) : (
               <>Đăng nhập <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <a href="/" className="text-xs font-bold text-slate-400 hover:text-dark dark:hover:text-white transition-colors">
                ← Quay lại trang chủ
            </a>
        </div>
      </div>
    </div>
  );
};

export default Login;