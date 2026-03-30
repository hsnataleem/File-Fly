import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function HistoryItem({ file }) {
  const [timeLeft, setTimeLeft] = useState('--:--');

  useEffect(() => {
    if (!file?.expiresAt) return;
    
    // Initial check
    const checkTime = () => {
      const remaining = file.expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft('Expired');
        return false; // stop interval
      } else {
        const m = Math.floor(remaining / 60000).toString().padStart(2, '0');
        const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${m}:${s}`);
        return true; // continue interval
      }
    };
    
    checkTime();
    
    const interval = setInterval(() => {
      if (!checkTime()) clearInterval(interval);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [file]);

  const shareUrl = `http://${window.location.hostname}:${window.location.port}/file/${file.id}`;

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 overflow-hidden pr-2">
          <p className="text-xs font-bold text-slate-700 truncate" title={file.originalName}>{file.originalName}</p>
          <p className="text-[10px] text-slate-400 font-medium">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
        <div className="bg-white p-1 border border-teal-200 rounded shadow-sm flex-shrink-0">
          <QRCodeSVG value={shareUrl} size={48} fgColor="#0f172a" />
        </div>
      </div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded self-start ${timeLeft === 'Expired' ? 'text-slate-500 bg-slate-200' : 'text-red-500 bg-red-100'}`}>
        {timeLeft === 'Expired' ? 'Expired' : `Expires in ${timeLeft}`}
      </div>
    </div>
  );
}

export default function FileHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-xl border border-teal-100 p-4 w-72 md:absolute md:right-8 lg:right-16 md:top-32 hidden md:block max-h-[70vh] overflow-y-auto z-10">
      <h3 className="font-bold text-slate-800 mb-4 text-sm tracking-wide flex items-center gap-2">
         Recent Uploads
      </h3>
      <div className="space-y-4">
        {history.map((file) => (
          <HistoryItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
