import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FileText, Copy, QrCode } from 'lucide-react';

export default function ShareCard({ fileData, shareUrl }) {
  const [timeLeft, setTimeLeft] = useState('--:--');

  useEffect(() => {
    if (!fileData?.expiresAt) return;
    const interval = setInterval(() => {
      const remaining = fileData.expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft('00:00');
        clearInterval(interval);
      } else {
        const m = Math.floor(remaining / 60000).toString().padStart(2, '0');
        const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${m}:${s}`);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [fileData]);

  if (!fileData) return null;

  const copyLink = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy link. Please select and copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  // Convert size to MB
  const sizeMB = (fileData.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-teal-200 p-6 mt-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-0 right-0 h-32 bg-gradient-to-r from-teal-50 to-blue-50 bg-opacity-50 blur-xl -z-10 transform -translate-y-1/2"></div>
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-400 p-3 rounded-xl text-white">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg truncate max-w-xs">{fileData.originalName}</h3>
            <p className="text-sm text-slate-400 font-medium">{sizeMB}MB</p>
          </div>
        </div>
        <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm font-bold shadow-inner">
          Expires in {timeLeft}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-slate-700 mb-3">1. Link</h4>
          <div className="flex items-center gap-2 border shadow-inner border-slate-200 rounded-lg px-3 py-2 bg-slate-50 mb-4">
            <span className="text-sm text-slate-600 truncate flex-1 font-mono">{shareUrl}</span>
          </div>
          <button 
            onClick={copyLink}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            COPY LINK <QrCode size={18} className="opacity-75" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-0 md:pl-6">
          <h4 className="font-bold text-slate-700 mb-3 self-start md:self-auto">2. QR Code</h4>
          <div className="p-3 bg-white border border-teal-300 shadow-md rounded-xl">
            <QRCodeSVG value={shareUrl} size={120} fgColor="#0f172a" />
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Scan to Download</p>
        </div>
      </div>
    </div>
  );
}
