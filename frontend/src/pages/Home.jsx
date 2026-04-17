import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import UploadCard from '../components/UploadCard';
import ShareCard from '../components/ShareCard';
import FileHistory from '../components/FileHistory';
import Footer from '../components/Footer';
import { getBaseUrl } from '../config';
import { Share2, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [fileData, setFileData] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('fileFly_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isUploading, setIsUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showLocalhostWarning, setShowLocalhostWarning] = useState(false);

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setShowLocalhostWarning(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fileFly_history', JSON.stringify(history));
  }, [history]);

  const handleUpload = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Logic for cloud deployment vs local network
      const BASE_URL = getBaseUrl();
      const API_URL = `${BASE_URL}/api/upload`;
      
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        const data = response.data.file;
        setFileData(data);
        
        // Ensure UI generates correct URL (current location + file path)
        const generatedUrl = `${window.location.origin}/file/${data.id}`;
        setShareUrl(generatedUrl);

        // Add to history
        setHistory(prev => [data, ...prev].slice(0, 5)); // Keep last 5
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console for details.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F7FA] font-sans relative">
      <Navbar />
      
      <main className="container flex-1 mx-auto px-4 py-16 relative">
        <div className="flex flex-col items-center">
          {showLocalhostWarning && !fileData && (
            <div className="mb-8 w-full max-w-xl bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Accessing via localhost</h4>
                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                  Scanning QR codes won't work on other devices if you use "localhost". 
                  Try using your computer's IP address instead for mobile sharing.
                </p>
              </div>
            </div>
          )}

          {isUploading ? (
            <div className="animate-pulse bg-white p-8 rounded-2xl shadow-xl border-2 border-teal-200 w-full max-w-xl text-center">
              <h2 className="text-2xl font-bold text-slate-800">Uploading File...</h2>
              <div className="w-full bg-slate-200 mt-4 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-ping"></div>
              </div>
            </div>
          ) : (
            <>
              <UploadCard onUpload={handleUpload} />
              {fileData && <ShareCard fileData={fileData} shareUrl={shareUrl} />}
            </>
          )}
        </div>

        <FileHistory history={history} />
      </main>
      
      {/* Decorative scattered elements mimicking the design */}
      <div className="absolute top-1/3 left-10 md:left-24 -z-10 opacity-20">
        <svg width="200" height="200" viewBox="0 0 100 100">
           <path d="M10,50 Q40,10 90,50 T90,90 Z" fill="none" stroke="#2dd4bf" strokeWidth="2" />
        </svg>
      </div>

      <Footer />
    </div>
  );
}
