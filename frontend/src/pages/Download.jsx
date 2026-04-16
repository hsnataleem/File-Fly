import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download as DownloadIcon, File, AlertCircle, Type, Copy, Check } from 'lucide-react';

export default function Download() {
  const { id } = useParams();
  const [fileDetails, setFileDetails] = useState(null);
  const [noteContent, setNoteContent] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;
        const API_URL = `${BASE_URL}/api/file/${id}`;
        const res = await axios.get(API_URL);
        const metadata = res.data.file;
        setFileDetails(metadata);
        
        if (metadata.originalName === 'Secure_Note.txt') {
           const contentRes = await axios.get(`${BASE_URL}/api/content/${id}`);
           setNoteContent(contentRes.data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [id]);

  const handleDownload = () => {
    const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;
    const downloadUrl = `${BASE_URL}/api/download/${id}`;
    window.open(downloadUrl, '_blank');
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(noteContent).catch(console.error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F7FA] flex items-center justify-center">
        <div className="animate-spin text-teal-500"><File size={48} /></div>
      </div>
    );
  }

  if (error || !fileDetails) {
    return (
      <div className="min-h-screen bg-[#F0F7FA] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm border-t-4 border-red-400">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">File Not Found</h2>
          <p className="text-slate-500 mt-2">This file either never existed or its 10-minute validity has expired.</p>
        </div>
      </div>
    );
  }

  const sizeMB = (fileDetails.size / (1024 * 1024)).toFixed(2);
  const isNote = fileDetails.originalName === 'Secure_Note.txt';

  return (
    <div className="min-h-screen bg-[#F0F7FA] flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-teal-100 flex flex-col items-center">
        <img src="/logoi-transparent.png" alt="File Fly Logo" className="h-24 mx-auto mb-8 object-contain drop-shadow" />
        
        {isNote ? (
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200 text-left shadow-inner w-full max-h-72 overflow-y-auto w-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <span className="text-teal-600 font-bold flex items-center gap-2"><Type size={18} /> Secure Note Received</span>
            </div>
            <p className="whitespace-pre-wrap text-slate-700 font-mono text-sm leading-relaxed">{String(noteContent)}</p>
          </div>
        ) : (
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 inline-block shadow-inner w-full">
            <File size={64} className="text-teal-400 mx-auto mb-4 drop-shadow-sm" />
            <h2 className="text-2xl font-extrabold text-slate-800 break-all">{fileDetails.originalName}</h2>
            <p className="text-slate-500 mt-2 font-medium">{sizeMB} MB • Ready to download</p>
          </div>
        )}

        {isNote ? (
          <button 
            onClick={handleCopyNote}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 shadow-lg transform transition-transform active:scale-95 text-lg"
          >
            {copied ? <><Check size={24} /> COPIED TO CLIPBOARD</> : <><Copy size={24} /> COPY NOTE TEXT</>}
          </button>
        ) : (
          <button 
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-400 hover:from-blue-700 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 shadow-lg transform transition-transform active:scale-95 text-lg"
          >
            DOWNLOAD NOW <DownloadIcon size={24} />
          </button>
        )}
        
        <p className="text-xs text-slate-400 mt-6 font-medium bg-slate-100 py-2 px-4 rounded-full inline-block">
          Engineered & Developed by hstekz • Link expires soon
        </p>
      </div>
    </div>
  );
}
