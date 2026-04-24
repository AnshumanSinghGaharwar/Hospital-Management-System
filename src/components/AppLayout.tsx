import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  Calendar, 
  CreditCard, 
  LogOut,
  PlusCircle,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarItemProps {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
  key?: string;
}

function SidebarItem({ to, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link to={to}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
          : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
      )}>
        <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-blue-600")} />
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { logout, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: Users, label: 'Patients' },
    { to: '/doctors', icon: UserRound, label: 'Doctors' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/billing', icon: CreditCard, label: 'Billing' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">VitalPulse</h1>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Hospital MS</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-slate-500 hover:text-red-600 transition-colors py-1 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-bottom border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {menuItems.find(i => i.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
              <PlusCircle className="w-4 h-4" />
              <span>Quick Action</span>
            </button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
