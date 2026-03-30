import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock } from 'lucide-react';

export default function ActiveTransfers() {
  const [transfers] = useState(() => {
    const saved = localStorage.getItem('fileFly_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (transfers.length === 0) return;
    const fetchStatus = async () => {
      try {
        const ids = transfers.map(t => t.id);
        const API_URL = `http://${window.location.hostname}:3000/api/files/status`;
        const res = await axios.post(API_URL, { ids });
        setStatuses(res.data.statuses);
      } catch (err) {
        console.error("Failed to fetch status");
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [transfers]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F7FA] font-sans">
      <Navbar />
      <main className="container flex-1 mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <Clock size={48} className="text-teal-400 mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-extrabold text-slate-800">Active Transfers</h1>
          <p className="text-slate-500 max-w-lg text-center mt-2">Live tracking via secure polling.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {transfers.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-2xl shadow">
               <p className="text-slate-400">No active transfers tracked in this browser session.</p>
            </div>
          ) : (
            transfers.map((t) => {
              const liveData = statuses[t.id] || { status: 'loading...' };
              const isReceived = liveData.status === 'downloaded';
              const isExpired = liveData.status === 'expired';
              return (
                <div key={t.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 break-all">{t.originalName}</span>
                    <span className="text-xs text-slate-400">{(t.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-inner ${
                    isReceived ? 'bg-green-100 text-green-700' : 
                    isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600 animate-pulse'
                  }`}>
                    {isReceived ? 'Received ✓' : isExpired ? 'Expired / Deleted' : 'Pending Scan...'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
