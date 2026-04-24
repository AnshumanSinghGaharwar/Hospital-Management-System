import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, User, UserPlus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    doctorId: '',
    dateTime: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apptsSnap = await getDocs(query(collection(db, 'appointments'), orderBy('dateTime', 'desc')));
    const patientsSnap = await getDocs(collection(db, 'patients'));
    const doctorsSnap = await getDocs(collection(db, 'doctors'));

    setAppointments(apptsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setPatients(patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setDoctors(doctorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newAppt.patientId);
    const doctor = doctors.find(d => d.id === newAppt.doctorId);

    if (!patient || !doctor) return;

    try {
      await addDoc(collection(db, 'appointments'), {
        ...newAppt,
        patientName: patient.name,
        doctorName: doctor.name,
        createdAt: Timestamp.now()
      });
      setIsModalOpen(false);
      setNewAppt({ patientId: '', doctorId: '', dateTime: '', notes: '', status: 'scheduled' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Appointments</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Schedule & Manage Consultations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule New</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Patient</th>
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 font-bold text-slate-900">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {apt.dateTime ? format(new Date(apt.dateTime), 'MMM dd, hh:mm a') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black">
                        {apt.patientName?.[0]}
                      </div>
                      <span className="font-bold text-slate-700">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-medium text-slate-600 italic">Dr. {apt.doctorName}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      apt.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                      apt.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {apt.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Calendar className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-sm">No scheduled appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Schedule Consultation</h3>
                <p className="text-slate-400 font-medium">Link a patient with a doctor</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">✕</button>
            </div>
            <form onSubmit={handleBook} className="p-10 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 italic">Select Patient</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  value={newAppt.patientId}
                  onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                >
                  <option value="">Choose a patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 italic">Assign Doctor</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  value={newAppt.doctorId}
                  onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})}
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 italic">Date & Time</label>
                <input 
                  type="datetime-local"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  value={newAppt.dateTime}
                  onChange={e => setNewAppt({...newAppt, dateTime: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100"
              >
                Confirm Appointment
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
