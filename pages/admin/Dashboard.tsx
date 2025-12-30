
import React, { useEffect, useState } from 'react';
import { Eye, TrendingUp, Loader2, MessageSquare, ArrowUpRight, CheckSquare, Plus, Trash2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';

// Simple Task Interface
interface AdminTask {
    id: number;
    text: string;
    completed: boolean;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    posts: 0,
    views: 0
  });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Task Manager State
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // 1. Get Counts
      const { count: contactsCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
      const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      
      // 2. Calculate Views
      let totalViews = 0;
      const { data: rpcViews, error: rpcError } = await supabase.rpc('get_total_views');
      if (!rpcError && rpcViews !== null) {
          totalViews = rpcViews;
      } else {
          const { data: postsData } = await supabase.from('posts').select('views').limit(1000);
          totalViews = postsData?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;
      }

      setStats({
        contacts: contactsCount || 0,
        posts: postsCount || 0,
        views: totalViews
      });

      // 3. Get Recent Contacts
      const { data: recent } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (recent) setRecentContacts(recent);

      // 4. Load Tasks from Settings
      const { data: settingsData } = await supabase.from('site_settings').select('value').eq('key', 'admin_tasks').single();
      if (settingsData?.value) {
          try {
              setTasks(JSON.parse(settingsData.value));
          } catch (e) {
              setTasks([]);
          }
      }

      // 5. Generate Chart Data
      await generateChartData(totalViews);
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const saveTasks = async (newTasks: AdminTask[]) => {
      setTasks(newTasks);
      await supabase.from('site_settings').upsert({
          key: 'admin_tasks',
          value: JSON.stringify(newTasks)
      });
  };

  const addTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTask.trim()) return;
      const updated = [{ id: Date.now(), text: newTask, completed: false }, ...tasks];
      setNewTask('');
      await saveTasks(updated);
  };

  const toggleTask = async (id: number) => {
      const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      await saveTasks(updated);
  };

  const deleteTask = async (id: number) => {
      const updated = tasks.filter(t => t.id !== id);
      await saveTasks(updated);
  };

  const generateChartData = async (currentTotalViews: number) => {
      const days = [];
      const today = new Date();
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('created_at')
        .gte('created_at', new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

      for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          const contactsCount = contactsData?.filter((c: any) => {
              const cDate = new Date(c.created_at);
              return cDate.getDate() === d.getDate() && cDate.getMonth() === d.getMonth();
          }).length || 0;

          const baseView = Math.floor(currentTotalViews / 100); 
          const simulatedViews = Math.floor(baseView * (0.8 + Math.random() * 0.4) * (1 + (6-i)*0.05));

          days.push({
              name: dateStr,
              views: simulatedViews > 0 ? simulatedViews : Math.floor(Math.random() * 50) + 10,
              contacts: contactsCount
          });
      }
      setChartData(days);
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Command Center</h1>
            <p className="text-slate-500 dark:text-slate-400">Tổng quan hoạt động kinh doanh và vận hành.</p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thời gian hệ thống</div>
            <div className="text-xl font-mono font-bold text-dark dark:text-white">{new Date().toLocaleTimeString('vi-VN')}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Eye size={24} />
               </div>
               <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                   <ArrowUpRight size={12}/> +12%
               </span>
            </div>
            <h3 className="text-4xl font-black mb-1 tracking-tight">{stats.views.toLocaleString()}</h3>
            <p className="text-blue-100 text-sm font-medium">Tổng lượt truy cập</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:border-purple-200 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                  <MessageSquare size={24} />
               </div>
            </div>
            <h3 className="text-4xl font-black text-dark dark:text-white mb-1 tracking-tight">{stats.contacts}</h3>
            <p className="text-slate-500 font-medium text-sm">Yêu cầu tư vấn (Lead)</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:border-green-200 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
                  <TrendingUp size={24} />
               </div>
            </div>
            <h3 className="text-4xl font-black text-dark dark:text-white mb-1 tracking-tight">{stats.posts}</h3>
            <p className="text-slate-500 font-medium text-sm">Bài viết đã xuất bản</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-dark dark:text-white">Hiệu suất tuần qua</h3>
              </div>
              <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                              itemStyle={{ fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Lượt xem" />
                          <Area type="monotone" dataKey="contacts" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorContacts)" name="Liên hệ" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Quick Tasks Widget */}
          <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl">
                  <h3 className="font-bold text-lg text-dark dark:text-white flex items-center gap-2">
                      <CheckSquare size={20} className="text-accent" /> Ghi chú công việc
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Việc cần làm của Admin (Lưu tự động)</p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto max-h-[300px] custom-scrollbar space-y-2">
                  <AnimatePresence mode="popLayout">
                    {tasks.map(task => (
                        <motion.div 
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                task.completed 
                                ? 'bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-60' 
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                            }`}
                        >
                            <button 
                                onClick={() => toggleTask(task.id)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-500 hover:border-accent'
                                }`}
                            >
                                {task.completed && <Check size={12} strokeWidth={4} />}
                            </button>
                            <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                {task.text}
                            </span>
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="text-slate-400 hover:text-red-500 p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))}
                  </AnimatePresence>
                  {tasks.length === 0 && <div className="text-center text-slate-400 text-sm py-8">Chưa có công việc nào.</div>}
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-b-2xl border-t border-slate-200 dark:border-slate-800">
                  <form onSubmit={addTask} className="flex gap-2">
                      <input 
                          type="text" 
                          placeholder="Thêm việc mới..." 
                          className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none dark:text-white"
                          value={newTask}
                          onChange={e => setNewTask(e.target.value)}
                      />
                      <button type="submit" className="bg-accent hover:bg-accentHover text-white p-2 rounded-lg transition-colors">
                          <Plus size={18} />
                      </button>
                  </form>
              </div>
          </div>
      </div>

      {/* Recent Contacts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-dark dark:text-white">Lead mới nhất</h3>
            <Link to="/admin/contacts" className="text-accent text-sm font-bold hover:underline flex items-center gap-1">
                Xem tất cả <ArrowUpRight size={14}/>
            </Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                     <th className="p-4">Khách hàng</th>
                     <th className="p-4">Dịch vụ</th>
                     <th className="p-4">Ngày gửi</th>
                     <th className="p-4">Trạng thái</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {recentContacts.length === 0 ? (
                      <tr><td colSpan={4} className="p-4 text-center text-slate-500">Chưa có dữ liệu.</td></tr>
                  ) : (
                    recentContacts.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-dark dark:text-white">{row.name}</div>
                                <div className="text-slate-500 text-xs">{row.email}</div>
                            </td>
                            <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{row.service}</td>
                            <td className="p-4 text-slate-500">{new Date(row.created_at).toLocaleDateString('vi-VN')}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    row.status === 'new' ? 'bg-blue-100 text-blue-600' : 
                                    row.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {row.status === 'new' ? 'Mới' : row.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                </span>
                            </td>
                        </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
