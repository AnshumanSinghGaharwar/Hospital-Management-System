import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserRound, Mail, Calendar, MapPin, Plus, UserSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    schedule: 'Mon-Fri, 9AM-5PM',
    experience: '',
    email: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const q = query(collection(db, 'doctors'), orderBy('name'));
    const snap = await getDocs(q);
    setDoctors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'doctors'), newDoctor);
      setIsModalOpen(false);
      setNewDoctor({ name: '', specialization: '', schedule: 'Mon-Fri, 9AM-5PM', experience: '', email: '' });
      fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Our Medical experts</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Specialized Doctors & Medical Staff</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Doctor Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <motion.div 
            layout
            key={doctor.id}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col"
          >
            <div className="absolute top-8 right-8">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider">
                {doctor.specialization}
              </span>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                {doctor.name[0]}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{doctor.name}</h4>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{doctor.experience || 'Senior Specialist'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-500 font-medium">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm">{doctor.schedule}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-medium">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-sm">{doctor.email || 'N/A'}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group-hover:shadow-lg">
              View Full Schedule
            </button>
          </motion.div>
        ))}

        {doctors.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <UserSearch className="w-20 h-20 mb-4 text-slate-200" />
            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No doctors found</p>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Add Doctor Profile</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">Close</button>
              </div>
              <form onSubmit={handleAddDoctor} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Doctor Name</label>
                  <input 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all font-bold"
                    value={newDoctor.name}
                    onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Specialization</label>
                  <input 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all font-bold"
                    value={newDoctor.specialization}
                    onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})}
                    placeholder="e.g. Cardiology, Neurology"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Experience</label>
                    <input 
                      placeholder="e.g. 10 years"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all font-bold"
                      value={newDoctor.experience}
                      onChange={e => setNewDoctor({...newDoctor, experience: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all font-bold"
                      value={newDoctor.email}
                      onChange={e => setNewDoctor({...newDoctor, email: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95"
                >
                  Create Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
