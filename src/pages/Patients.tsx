import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Plus, UserPlus, Info, Calendar, Filter, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Patients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    bloodGroup: 'O+',
    medicalHistory: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const q = query(collection(db, 'patients'), orderBy('name'));
    const snap = await getDocs(q);
    setPatients(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'patients'), {
        ...newPatient,
        age: parseInt(newPatient.age),
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewPatient({ name: '', age: '', gender: 'Male', contact: '', bloodGroup: 'O+', medicalHistory: '' });
      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patients by name or contact..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 hover:text-blue-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
              <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Age / Gender</th>
              <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Blood Group</th>
              <th className="px-8 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {patient.name[0]}
                    </div>
                    <span className="font-bold text-slate-900">{patient.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-medium text-slate-600">{patient.age} / {patient.gender}</span>
                </td>
                <td className="px-8 py-6 text-slate-500 font-medium">
                  {patient.contact}
                </td>
                <td className="px-8 py-6 text-center md:text-left">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-black group-hover:bg-rose-100 transition-colors">
                    {patient.bloodGroup}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Users className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold">No patients found</p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white">
                <div>
                  <h3 className="text-2xl font-bold italic tracking-tight">New Patient Registration</h3>
                  <p className="text-blue-100 text-sm font-medium">Enter patient details to register</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">✕</button>
              </div>
              <form onSubmit={handleRegister} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                    <input 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Age</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      value={newPatient.age}
                      onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Gender</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      value={newPatient.gender}
                      onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Contact Number</label>
                    <input 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      value={newPatient.contact}
                      onChange={e => setNewPatient({...newPatient, contact: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Blood Group</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      value={newPatient.bloodGroup}
                      onChange={e => setNewPatient({...newPatient, bloodGroup: e.target.value})}
                    >
                      <option>O+</option>
                      <option>O-</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medical History</label>
                    <textarea 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold text-slate-900 h-32 resize-none"
                      value={newPatient.medicalHistory}
                      onChange={e => setNewPatient({...newPatient, medicalHistory: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Confirm Registration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
