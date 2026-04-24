import { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: typeof Users;
  trend: string;
  trendUp?: boolean;
  color: string;
}

function StatsCard({ label, value, icon: Icon, trend, trendUp, color }: StatsCardProps) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-4 rounded-2xl", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
  );
}

// Helper for cn (already in utils, but just in case we need it here)
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    revenue: 0,
    doctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const patientsSnap = await getDocs(collection(db, 'patients'));
      const appointmentsSnap = await getDocs(collection(db, 'appointments'));
      const doctorsSnap = await getDocs(collection(db, 'doctors'));
      const billsSnap = await getDocs(collection(db, 'billing'));
      
      const revenue = billsSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);

      setStats({
        patients: patientsSnap.size,
        appointments: appointmentsSnap.size,
        doctors: doctorsSnap.size,
        revenue: revenue
      });

      const q = query(collection(db, 'appointments'), orderBy('dateTime', 'desc'), limit(5));
      const recentSnap = await getDocs(q);
      setRecentAppointments(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          label="Total Patients" 
          value={stats.patients} 
          icon={Users} 
          trend="12% vs last month" 
          trendUp 
          color="bg-blue-600" 
        />
        <StatsCard 
          label="Appointments" 
          value={stats.appointments} 
          icon={Calendar} 
          trend="5% vs last week" 
          trendUp 
          color="bg-indigo-600" 
        />
        <StatsCard 
          label="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={CreditCard} 
          trend="8% vs last month" 
          trendUp 
          color="bg-violet-600" 
        />
        <StatsCard 
          label="Active Doctors" 
          value={stats.doctors} 
          icon={TrendingUp} 
          trend="Flat" 
          trendUp 
          color="bg-fuchsia-600" 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Recent Appointments</h3>
            <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">View All</button>
          </div>
          <div className="p-4 flex-1">
            {recentAppointments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                <Clock className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">No recent appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {apt.patientName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{apt.patientName}</p>
                        <p className="text-sm text-slate-500 font-medium">{apt.doctorName} • {apt.dateTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                        apt.status === 'scheduled' ? "bg-amber-50 text-amber-600" : 
                        apt.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {apt.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / AI Insight Alternative */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Patient Care Insight</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              You have 12 appointments scheduled for today. Most patients are visiting for general checkups. Ensure all medical history files are updated before sessions.
            </p>
          </div>
          
          <div className="pt-10">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Daily Goal</p>
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-black">72%</span>
                <span className="text-sm font-bold text-slate-500 italic">5/8 Appointments</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[72%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
