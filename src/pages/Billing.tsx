import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Receipt, Plus, Search, DollarSign, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export function Billing() {
  const [bills, setBills] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBill, setNewBill] = useState({
    patientId: '',
    amount: '',
    description: '',
    status: 'unpaid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const billsSnap = await getDocs(query(collection(db, 'billing'), orderBy('createdAt', 'desc')));
    const patientsSnap = await getDocs(collection(db, 'patients'));
    setBills(billsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setPatients(patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newBill.patientId);
    if (!patient) return;

    try {
      await addDoc(collection(db, 'billing'), {
        ...newBill,
        amount: parseFloat(newBill.amount),
        patientName: patient.name,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewBill({ patientId: '', amount: '', description: '', status: 'unpaid' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBills = bills.filter(b => 
    b.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Billing & Invoices</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Manage Patient Payments & Receipts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <Receipt className="w-5 h-5" />
          <span>Generate Bill</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</th>
              <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
              <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 text-sm font-bold text-slate-500 italic">
                  {bill.createdAt ? format(bill.createdAt.toDate(), 'MMM dd, yyyy') : 'Pending'}
                </td>
                <td className="px-8 py-6">
                  <span className="font-bold text-slate-900">{bill.patientName}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-lg font-black text-slate-900">${bill.amount?.toLocaleString()}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    bill.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {bill.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><Printer className="w-5 h-5" /></button>
                  <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Download className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBills.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <DollarSign className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-sm">No billing records found</p>
          </div>
        )}
      </div>

      {/* Bill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 bg-slate-900 text-white">
                <h3 className="text-2xl font-bold tracking-tight">Create Invoice</h3>
                <p className="text-slate-400 font-medium text-sm">Select patient and enter treatment details</p>
              </div>
              <form onSubmit={handleCreateBill} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Select Patient</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900"
                    value={newBill.patientId}
                    onChange={e => setNewBill({...newBill, patientId: e.target.value})}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Amount ($)</label>
                    <input 
                      type="number"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900"
                      value={newBill.amount}
                      onChange={e => setNewBill({...newBill, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Status</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900"
                      value={newBill.status}
                      onChange={e => setNewBill({...newBill, status: e.target.value})}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Description</label>
                  <textarea 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 h-24 resize-none"
                    value={newBill.description}
                    onChange={e => setNewBill({...newBill, description: e.target.value})}
                    placeholder="e.g. General consultation and laboratory tests"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 shadow-xl shadow-slate-100 active:scale-95 transition-all"
                >
                  Generate Invoice
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
