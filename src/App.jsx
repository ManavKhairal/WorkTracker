// import React, { useState, useEffect, useMemo } from 'react';
// import { Layout, Send, Table, Trash2, Download, PlusCircle, CheckCircle2, Clock, Settings, X, Plus, Edit3, Save, BarChart3, AlertCircle, Share2, Link, Lock } from 'lucide-react';

// // --- CONFIGURATION CONSTANTS ---
// const SYSTEM_NAMES = [
//   "Amazon Prime", "Appsmith", "Aprecomm VWE", "Aprecomm VCS", "Asset Insider", "Auth0", 
//   "Automations", "Cashfree", "CoreHR", "Darwinbox", "Disney Hotstar", "Excitel Heroes", 
//   "Genesys", "Google Firebase", "Height8", "Infobip", "Joget", "Kissflow", 
//   "Location Tracker", "Maintenance", "MDM", "MSG91", "My Excitel", "N8N", "NetBox", 
//   "NetSense", "New Release", "OTTPlay", "Outline", "Partner Management", "Paytm", 
//   "Payu", "Plan Information Request", "Procare", "Razorpay", "Slack", "Software Demo", 
//   "Telspiel", "Tata Kaleyra", "Test Notes", "TextLocal", "Vilpower", "Workforce", 
//   "Zendesk", "Others", "SmartPing"
// ];

// const DEFAULT_CATEGORIES = ["Email Sent", "Follow-up", "Review / QA", "Call / Sync", "Jira / Ticket Creation"];
// const DEFAULT_FIELDS = [
//   { id: 'sys_name', name: 'system_name', label: 'System Name', type: 'select', options: SYSTEM_NAMES.join(', '), required: true },
//   { id: 'activity', name: 'activity', label: 'What did you do?', type: 'textarea', placeholder: 'Describe your task...', options: '', required: true },
//   { id: 'reference', name: 'reference', label: 'Reference (Jira / Person)', type: 'text', placeholder: 'e.g. JIRA-123', options: '', required: false },
//   { id: 'mins', name: 'mins', label: 'Minutes', type: 'number', placeholder: '15', options: '', required: false }
// ];

// export default function App() {
//   const [logs, setLogs] = useState([]);
//   const [view, setView] = useState('form'); 
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
  
//   const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
//   const [fields, setFields] = useState(DEFAULT_FIELDS);
//   const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  
//   const [tempCategories, setTempCategories] = useState([]);
//   const [tempFields, setTempFields] = useState([]);
//   const [tempSheetUrl, setTempSheetUrl] = useState('');
//   const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false);

//   const [formData, setFormData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const savedLogs = localStorage.getItem('work_tracker_logs');
//     const savedSettings = localStorage.getItem('work_tracker_settings');

//     if (savedLogs) setLogs(JSON.parse(savedLogs));
    
//     if (savedSettings) {
//       const config = JSON.parse(savedSettings);
//       setCategories(config.categories || DEFAULT_CATEGORIES);
//       setFields(config.fields || DEFAULT_FIELDS);
//       setGoogleSheetUrl(config.googleSheetUrl || '');
//       setTempCategories(config.categories || DEFAULT_CATEGORIES);
//       setTempFields(config.fields || DEFAULT_FIELDS);
//       setTempSheetUrl(config.googleSheetUrl || '');
//     } else {
//       setTempCategories(DEFAULT_CATEGORIES);
//       setTempFields(DEFAULT_FIELDS);
//     }
//   }, []);

//   const stats = useMemo(() => {
//     const totalMins = logs.reduce((acc, curr) => acc + (parseFloat(curr.mins) || 0), 0);
//     const systemCounts = {};
//     logs.forEach(log => {
//       const sys = log.system_name || 'N/A';
//       systemCounts[sys] = (systemCounts[sys] || 0) + 1;
//     });
//     const topSystem = Object.entries(systemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
//     return { count: logs.length, hours: (totalMins / 60).toFixed(1), topSystem };
//   }, [logs]);

//   useEffect(() => {
//     if (categories.length > 0 && !formData.category) {
//       setFormData(prev => ({ ...prev, category: categories[0] }));
//     }
//   }, [categories]);

//   const handleLogSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.category || !googleSheetUrl) return;
//     setIsSubmitting(true);
    
//     const logId = Date.now().toString();
//     const currentTimestamp = new Date().toLocaleString();
    
//     const sheetPayload = {
//       "Log ID": logId,
//       "Date": currentTimestamp,
//       "Category": formData.category,
//       "Status": "ACTIVE"
//     };
    
//     fields.forEach(field => {
//       sheetPayload[field.label] = formData[field.name] || "";
//     });

//     const newLog = {
//       ...formData,
//       id: logId,
//       dateString: currentTimestamp,
//     };

//     try {
//       const updatedLogs = [newLog, ...logs];
//       setLogs(updatedLogs);
//       localStorage.setItem('work_tracker_logs', JSON.stringify(updatedLogs));

//       if (googleSheetUrl && googleSheetUrl.trim() !== '') {
//         fetch(googleSheetUrl, {
//           method: 'POST',
//           mode: 'no-cors',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(sheetPayload)
//         });
//       }

//       const resetData = { category: formData.category, system_name: formData.system_name };
//       fields.forEach(f => { if (f.name !== 'system_name') resetData[f.name] = ''; });
//       setFormData(resetData);
//       setView('sheet');
//     } catch (err) { console.error(err); }
//     finally { setIsSubmitting(false); }
//   };

//   const pushSettings = () => {
//     setIsSubmitting(true);
//     const config = { 
//       categories: tempCategories, 
//       fields: tempFields,
//       googleSheetUrl: tempSheetUrl
//     };
//     setCategories(tempCategories);
//     setFields(tempFields);
//     setGoogleSheetUrl(tempSheetUrl);
//     localStorage.setItem('work_tracker_settings', JSON.stringify(config));
//     setHasUnsavedSettings(false);
//     setIsSubmitting(false);
//     setView('form');
//   };

//   const confirmDelete = async () => {
//     const logToDelete = logs.find(l => l.id === deleteConfirm);
//     const deletionTime = new Date().toLocaleString();
    
//     if (googleSheetUrl && googleSheetUrl.trim() !== '' && logToDelete) {
//       const deletePayload = {
//         "ACTION": "MARK_DELETED",
//         "Log ID": logToDelete.id,
//         "Status": "DELETED",
//         "Date": deletionTime
//       };

//       try {
//         fetch(googleSheetUrl, {
//           method: 'POST',
//           mode: 'no-cors',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(deletePayload)
//         });
//       } catch (err) { console.error("Sync delete failed", err); }
//     }

//     const updatedLogs = logs.filter(l => l.id !== deleteConfirm);
//     setLogs(updatedLogs);
//     localStorage.setItem('work_tracker_logs', JSON.stringify(updatedLogs));
//     setDeleteConfirm(null);
//   };

//   const exportCSV = () => {
//     if (logs.length === 0) return;
//     const headers = ["When", "Category", ...fields.map(f => f.label)];
//     const rows = logs.map(log => [
//       log.dateString, log.category, 
//       ...fields.map(f => (log[f.name] || "").toString().replace(/,/g, ';'))
//     ]);
//     const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
//     const link = document.createElement("a");
//     link.href = encodeURI(csvContent);
//     link.download = `work_log_${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   };

//   const isFormLocked = !googleSheetUrl || googleSheetUrl.trim() === '';

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
//       <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="bg-indigo-600 p-2 rounded-lg"><Layout className="text-white w-5 h-5" /></div>
//             <span className="font-bold text-lg hidden sm:block">WorkTracker Core</span>
//           </div>
//           <div className="flex bg-slate-100 p-1 rounded-xl">
//             {[ {v:'form', i:PlusCircle, l:'Add'}, {v:'sheet', i:Table, l:'Sheet'}, {v:'settings', i:Settings, l:'Setup'} ].map(btn => (
//               <button key={btn.v} onClick={() => setView(btn.v)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 relative ${view === btn.v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
//                 <btn.i size={16}/> <span className="hidden xs:inline">{btn.l}</span>
//                 {btn.v === 'settings' && hasUnsavedSettings && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white pulse"></span>}
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-5xl mx-auto p-4 md:p-8">
//         {view === 'form' && (
//           <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
//             <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
//               {isFormLocked && (
//                 <div className="absolute inset-x-0 top-[180px] bottom-0 bg-white/10 backdrop-blur-[1px] z-10 cursor-not-allowed flex items-center justify-center p-8 text-center">
//                   <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
//                     <Lock className="mx-auto text-red-500 mb-3" size={32} />
//                     <p className="text-sm font-bold text-slate-800">Form Locked</p>
//                     <p className="text-xs text-slate-500">Provide a Sheet URL in <strong>Setup</strong> to unlock.</p>
//                   </div>
//                 </div>
//               )}
//               <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
//                 <h2 className="text-2xl font-black text-indigo-900">New Log</h2>
//                 {googleSheetUrl ? (
//                   <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
//                     <Link size={12} /> SYNCED TO GOOGLE SHEETS
//                   </div>
//                 ) : (
//                   <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg w-fit">
//                     <AlertCircle size={12} /> NOT SYNCED - LOCKED
//                   </div>
//                 )}
//               </div>
//               <form onSubmit={handleLogSubmit} className="p-8 space-y-6">
//                 <div>
//                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Category</label>
//                   <select disabled={isFormLocked} value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium">
//                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </div>
//                 {fields.map(field => (
//                   <div key={field.id}>
//                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">{field.label}</label>
//                     {field.type === 'textarea' ? (
//                       <textarea disabled={isFormLocked} required={field.required} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} placeholder={field.placeholder} className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none min-h-[120px]" />
//                     ) : field.type === 'select' ? (
//                       <select disabled={isFormLocked} required={field.required} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none">
//                         <option value="">-- Select {field.label} --</option>
//                         {(field.options || "").split(',').map(opt => <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>)}
//                       </select>
//                     ) : (
//                       <input type={field.type} disabled={isFormLocked} required={field.required} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} placeholder={field.placeholder} className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none" />
//                     )}
//                   </div>
//                 ))}
//                 <button type="submit" disabled={isSubmitting || isFormLocked} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-5 rounded-2xl shadow-xl transition-all">
//                   {isSubmitting ? 'Syncing...' : 'Submit Entry'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {view === 'sheet' && (
//           <div className="animate-in fade-in">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Logs</p>
//                 <div className="text-4xl font-black">{stats.count}</div>
//               </div>
//               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Hours</p>
//                 <div className="text-4xl font-black text-slate-800">{stats.hours} <span className="text-lg text-slate-400 font-medium">h</span></div>
//               </div>
//               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Top System</p>
//                 <div className="text-xl font-black text-indigo-600 truncate">{stats.topSystem}</div>
//               </div>
//             </div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-black tracking-tight">History</h2>
//               <button onClick={exportCSV} className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50"><Download size={16}/> CSV Backup</button>
//             </div>
//             <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="bg-slate-50 border-b border-slate-200">
//                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">When</th>
//                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
//                       {fields.map(f => <th key={f.id} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</th>)}
//                       <th className="px-6 py-5"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {logs.length === 0 ? (
//                       <tr><td colSpan={fields.length + 3} className="px-6 py-24 text-center text-slate-400 italic font-medium">No logs found.</td></tr>
//                     ) : (
//                       logs.map(log => (
//                         <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
//                           <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold text-slate-600">{log.dateString}</td>
//                           <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">{log.category}</span></td>
//                           {fields.map(f => <td key={f.id} className="px-6 py-4 text-xs text-slate-600 min-w-[120px]">{log[f.name] || '-'}</td>)}
//                           <td className="px-6 py-4 text-right"><button onClick={() => setDeleteConfirm(log.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button></td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {view === 'settings' && (
//           <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 pb-20">
//             <div className="flex justify-between items-end mb-8">
//               <div><h2 className="text-3xl font-black tracking-tight">Setup</h2><p className="text-slate-500 text-sm mt-1">Configure your tracker and sync URL.</p></div>
//               <button onClick={pushSettings} disabled={!hasUnsavedSettings || isSubmitting} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all ${hasUnsavedSettings ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}><Save size={18}/> {isSubmitting ? 'Saving...' : 'Save All'}</button>
//             </div>
//             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-6 border-l-8 border-l-green-500">
//               <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-700"><Share2 size={20}/> Google Sheet URL</h3>
//               <input type="text" value={tempSheetUrl} onChange={e => { setTempSheetUrl(e.target.value); setHasUnsavedSettings(true); }} placeholder="https://script.google.com/macros/s/.../exec" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-mono text-xs" />
//             </div>
//             {/* Category and Field management UI same as before */}
//           </div>
//         )}
//       </main>

//       {deleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
//             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto"><AlertCircle className="text-red-500 w-8 h-8" /></div>
//             <h3 className="text-xl font-black text-slate-800 text-center mb-2">Delete Entry?</h3>
//             <p className="text-slate-500 text-center text-sm mb-8">Row in Google Sheet will turn red and mark as DELETED with the current time.</p>
//             <div className="grid grid-cols-2 gap-3">
//               <button onClick={() => setDeleteConfirm(null)} className="py-3 px-4 bg-slate-100 font-bold rounded-2xl">Cancel</button>
//               <button onClick={confirmDelete} className="py-3 px-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-100">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Send, Table, Trash2, Download, PlusCircle, CheckCircle2, Clock, Settings, X, Plus, Edit3, Save, BarChart3, AlertCircle, Share2, Link, Lock } from 'lucide-react';

// --- CONFIGURATION CONSTANTS ---
const SYSTEM_NAMES = [
  "Amazon Prime", "Appsmith", "Aprecomm VWE", "Aprecomm VCS", "Asset Insider", "Auth0", 
  "Automations", "Cashfree", "CoreHR", "Darwinbox", "Disney Hotstar", "Excitel Heroes", 
  "Genesys", "Google Firebase", "Height8", "Infobip", "Joget", "Kissflow", 
  "Location Tracker", "Maintenance", "MDM", "MSG91", "My Excitel", "N8N", "NetBox", 
  "NetSense", "New Release", "OTTPlay", "Outline", "Partner Management", "Paytm", 
  "Payu", "Plan Information Request", "Procare", "Razorpay", "Slack", "Software Demo", 
  "Telspiel", "Tata Kaleyra", "Test Notes", "TextLocal", "Vilpower", "Workforce", 
  "Zendesk", "Others", "SmartPing"
];

const DEFAULT_CATEGORIES = ["Email Sent", "Follow-up", "Review / QA", "Call / Sync", "Jira / Ticket Creation"];
const DEFAULT_FIELDS = [
  { id: 'sys_name', name: 'system_name', label: 'System Name', type: 'select', options: SYSTEM_NAMES.join(', '), required: true },
  { id: 'activity', name: 'activity', label: 'What did you do?', type: 'textarea', placeholder: 'Describe your task...', options: '', required: true },
  { id: 'reference', name: 'reference', label: 'Reference (Jira / Person)', type: 'text', placeholder: 'e.g. JIRA-123', options: '', required: false },
  { id: 'mins', name: 'mins', label: 'Minutes', type: 'number', placeholder: '15', options: '', required: false }
];

export default function App() {
  const [logs, setLogs] = useState([]);
  const [view, setView] = useState('form'); 
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  
  const [tempCategories, setTempCategories] = useState([]);
  const [tempFields, setTempFields] = useState([]);
  const [tempSheetUrl, setTempSheetUrl] = useState('');
  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(false);

  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from Browser LocalStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('work_tracker_logs');
    const savedSettings = localStorage.getItem('work_tracker_settings');

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    
    if (savedSettings) {
      const config = JSON.parse(savedSettings);
      setCategories(config.categories || DEFAULT_CATEGORIES);
      setFields(config.fields || DEFAULT_FIELDS);
      setGoogleSheetUrl(config.googleSheetUrl || '');
      setTempCategories(config.categories || DEFAULT_CATEGORIES);
      setTempFields(config.fields || DEFAULT_FIELDS);
      setTempSheetUrl(config.googleSheetUrl || '');
    } else {
      setTempCategories(DEFAULT_CATEGORIES);
      setTempFields(DEFAULT_FIELDS);
    }
  }, []);

  const stats = useMemo(() => {
    const totalMins = logs.reduce((acc, curr) => acc + (parseFloat(curr.mins) || 0), 0);
    const systemCounts = {};
    logs.forEach(log => {
      const sys = log.system_name || 'N/A';
      systemCounts[sys] = (systemCounts[sys] || 0) + 1;
    });
    const topSystem = Object.entries(systemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    return { count: logs.length, hours: (totalMins / 60).toFixed(1), topSystem };
  }, [logs]);

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories]);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !googleSheetUrl || googleSheetUrl.trim() === '') return;
    setIsSubmitting(true);
    
    const logId = Date.now().toString();
    const currentTimestamp = new Date().toLocaleString(); // Full Date and Time
    
    const sheetPayload = {
      "Log ID": logId,
      "Date": currentTimestamp,
      "Category": formData.category,
      "Status": "ACTIVE"
    };
    
    fields.forEach(field => {
      sheetPayload[field.label] = formData[field.name] || "";
    });

    const newLog = {
      ...formData,
      id: logId,
      dateString: currentTimestamp,
    };

    try {
      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      localStorage.setItem('work_tracker_logs', JSON.stringify(updatedLogs));

      if (googleSheetUrl) {
        fetch(googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload)
        });
      }

      const resetData = { category: formData.category, system_name: formData.system_name };
      fields.forEach(f => { if (f.name !== 'system_name') resetData[f.name] = ''; });
      setFormData(resetData);
      setView('sheet');
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const pushSettings = () => {
    setIsSubmitting(true);
    const config = { 
      categories: tempCategories, 
      fields: tempFields,
      googleSheetUrl: tempSheetUrl
    };
    setCategories(tempCategories);
    setFields(tempFields);
    setGoogleSheetUrl(tempSheetUrl);
    localStorage.setItem('work_tracker_settings', JSON.stringify(config));
    
    setHasUnsavedSettings(false);
    setIsSubmitting(false);
    setView('form');
  };

  const confirmDelete = async () => {
    const logToDelete = logs.find(l => l.id === deleteConfirm);
    const deletionTime = new Date().toLocaleString();
    
    if (googleSheetUrl && googleSheetUrl.trim() !== '' && logToDelete) {
      const deletePayload = {
        "ACTION": "MARK_DELETED",
        "Log ID": logToDelete.id,
        "Status": "DELETED",
        "Date": deletionTime
      };

      try {
        fetch(googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deletePayload)
        });
      } catch (err) {
        console.error("Sheet sync delete failed", err);
      }
    }

    const updatedLogs = logs.filter(l => l.id !== deleteConfirm);
    setLogs(updatedLogs);
    localStorage.setItem('work_tracker_logs', JSON.stringify(updatedLogs));
    setDeleteConfirm(null);
  };

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["When", "Category", ...fields.map(f => f.label)];
    const rows = logs.map(log => [
      log.dateString, log.category, 
      ...fields.map(f => (log[f.name] || "").toString().replace(/,/g, ';'))
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `work_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const isFormLocked = !googleSheetUrl || googleSheetUrl.trim() === '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg"><Layout className="text-white w-5 h-5" /></div>
            <span className="font-bold text-lg hidden sm:block">WorkTracker <span className="text-indigo-600 italic">Core</span></span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[ {v:'form', i:PlusCircle, l:'Add'}, {v:'sheet', i:Table, l:'Sheet'}, {v:'settings', i:Settings, l:'Setup'} ].map(btn => (
              <button key={btn.v} onClick={() => setView(btn.v)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 relative ${view === btn.v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                <btn.i size={16}/> <span className="hidden xs:inline">{btn.l}</span>
                {btn.v === 'settings' && hasUnsavedSettings && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white pulse"></span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {view === 'form' && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
              {isFormLocked && (
                <div className="absolute inset-x-0 top-[180px] bottom-0 bg-white/10 backdrop-blur-[1px] z-10 cursor-not-allowed flex items-center justify-center p-8 text-center">
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-xs">
                    <Lock className="mx-auto text-red-500 mb-3" size={32} />
                    <p className="text-sm font-bold text-slate-800">Form Locked</p>
                    <p className="text-xs text-slate-500 mt-1">Provide a Sheet URL in <strong>Setup</strong> to unlock logging.</p>
                  </div>
                </div>
              )}
              <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
                <h2 className="text-2xl font-black text-indigo-900">New Entry</h2>
                {googleSheetUrl ? (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                    <Link size={12} /> SYNCED TO GOOGLE SHEETS
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg w-fit">
                    <AlertCircle size={12} /> NOT SYNCED - FORM LOCKED
                  </div>
                )}
              </div>
              <form onSubmit={handleLogSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Main Category</label>
                  <select disabled={isFormLocked} value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none transition-all font-medium ${isFormLocked ? 'bg-slate-50 cursor-not-allowed opacity-50' : 'focus:border-indigo-500 bg-white'}`}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea disabled={isFormLocked} required={field.required} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} placeholder={field.placeholder} className={`w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none min-h-[120px] transition-all ${isFormLocked ? 'bg-slate-50 cursor-not-allowed opacity-50' : 'focus:border-indigo-500 bg-white'}`} />
                    ) : field.type === 'select' ? (
                      <select disabled={isFormLocked} required={field.required} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} className={`w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none transition-all font-medium ${isFormLocked ? 'bg-slate-50 cursor-not-allowed opacity-50' : 'focus:border-indigo-500 bg-white'}`}>
                        <option value="">-- Choose {field.label} --</option>
                        {(field.options || "").split(',').map(opt => <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>)}
                      </select>
                    ) : (
                      <input type={field.type} disabled={isFormLocked} required={field.required} value={formData[field.name] || ''} onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} placeholder={field.placeholder} className={`w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none transition-all ${isFormLocked ? 'bg-slate-50 cursor-not-allowed opacity-50' : 'focus:border-indigo-500 bg-white'}`} />
                    )}
                  </div>
                ))}
                <button type="submit" disabled={isSubmitting || isFormLocked} className={`w-full font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all text-lg ${isFormLocked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 active:scale-[0.98]'}`}>
                  {isSubmitting ? 'Saving...' : <><Send size={20}/> Submit Entry</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'sheet' && (
          <div className="animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100"><p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Logs</p><div className="text-4xl font-black">{stats.count}</div></div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Hours</p><div className="text-4xl font-black text-slate-800">{stats.hours} <span className="text-lg text-slate-400 font-medium">h</span></div></div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Top System</p><div className="text-xl font-black text-indigo-600 truncate">{stats.topSystem}</div></div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black tracking-tight">History</h2>
              <button onClick={exportCSV} className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50"><Download size={16}/> CSV Backup</button>
            </div>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">When</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      {fields.map(f => <th key={f.id} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</th>)}
                      <th className="px-6 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.length === 0 ? (
                      <tr><td colSpan={fields.length + 3} className="px-6 py-24 text-center text-slate-400 italic font-medium">No work entries found.</td></tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold text-slate-600 leading-tight">{log.dateString}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">{log.category}</span></td>
                          {fields.map(f => <td key={f.id} className="px-6 py-4 text-xs text-slate-600 min-w-[120px]">{log[f.name] || '-'}</td>)}
                          <td className="px-6 py-4 text-right"><button onClick={() => setDeleteConfirm(log.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 pb-20">
            <div className="flex justify-between items-end mb-8">
              <div><h2 className="text-3xl font-black tracking-tight">Setup</h2><p className="text-slate-500 text-sm mt-1 font-medium">Configure categories, fields, and sync.</p></div>
              <button onClick={pushSettings} disabled={!hasUnsavedSettings || isSubmitting} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all ${hasUnsavedSettings ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                <Save size={18}/> {isSubmitting ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-6 border-l-8 border-l-green-500">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-700"><Share2 size={20}/> Google Sheet URL</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Paste your Google Apps Script Web App URL below.</p>
              <input type="text" value={tempSheetUrl} onChange={e => { setTempSheetUrl(e.target.value); setHasUnsavedSettings(true); }} placeholder="https://script.google.com/macros/s/.../exec" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-mono text-xs focus:border-green-500 transition-all" />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-900"><CheckCircle2 size={20}/> 1. Main Categories</h3>
              <div className="space-y-3">
                {tempCategories.map((cat, i) => (
                  <div key={i} className="flex gap-2 group">
                    <input type="text" value={cat} onChange={e => { const n = [...tempCategories]; n[i] = e.target.value; setTempCategories(n); setHasUnsavedSettings(true); }} className="flex-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium" />
                    <button onClick={() => { setTempCategories(tempCategories.filter((_, idx) => idx !== i)); setHasUnsavedSettings(true); }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={18}/></button>
                  </div>
                ))}
                <button onClick={() => { setTempCategories([...tempCategories, 'New Category']); setHasUnsavedSettings(true); }} className="mt-2 text-sm font-bold text-indigo-600 flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all w-fit"><Plus size={16}/> Add Category</button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-900"><Edit3 size={20}/> 2. Work Data Fields</h3>
              <div className="space-y-8">
                {tempFields.map((field, i) => (
                  <div key={field.id} className="p-6 bg-slate-50/50 rounded-2xl border-2 border-slate-100 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Display Label</label><input value={field.label} onChange={e => { const n = [...tempFields]; n[i].label = e.target.value; setTempFields(n); setHasUnsavedSettings(true); }} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold focus:border-indigo-500 outline-none" /></div>
                      <div><label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Field Type</label><select value={field.type} onChange={e => { const n = [...tempFields]; n[i].type = e.target.value; setTempFields(n); setHasUnsavedSettings(true); }} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none"><option value="text">Short Text</option><option value="textarea">Long Text</option><option value="number">Number</option><option value="select">Dropdown</option></select></div>
                      {field.type === 'select' && <div className="md:col-span-2"><label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Options (Comma separated)</label><textarea value={field.options || ''} rows="3" onChange={e => { const n = [...tempFields]; n[i].options = e.target.value; setTempFields(n); setHasUnsavedSettings(true); }} className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-medium outline-none" /></div>}
                      <div className="md:col-span-2 flex justify-between items-center"><div className="text-[10px] text-slate-400 font-mono">Key: {field.name}</div><button onClick={() => { setTempFields(tempFields.filter(f => f.id !== field.id)); setHasUnsavedSettings(true); }} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"><Trash2 size={12}/> Remove</button></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => { const id = 'f_' + Date.now(); setTempFields([...tempFields, { id, name: id, label: 'New Label', type: 'text', placeholder: '', options: '', required: false }]); setHasUnsavedSettings(true); }} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all font-black flex items-center justify-center gap-2"><Plus size={20}/> ADD CUSTOM FIELD</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto"><AlertCircle className="text-red-500 w-8 h-8" /></div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2">Delete Entry?</h3>
            <p className="text-slate-500 text-center text-sm mb-8">This marks the row as <strong>DELETED</strong> in your Google Sheet and highlights it in red with the current time.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="py-3 px-4 bg-slate-100 font-bold rounded-2xl hover:bg-slate-200 transition-all text-slate-600">Cancel</button>
              <button onClick={confirmDelete} className="py-3 px-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}