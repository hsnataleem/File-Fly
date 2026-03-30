import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F7FA] font-sans">
      <Navbar />
      <main className="container flex-1 mx-auto px-4 py-16 text-center text-slate-700">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-8">How File Fly Works</h1>
        <div className="max-w-3xl mx-auto space-y-6 text-lg text-left bg-white p-8 rounded-2xl shadow-lg">
           <p><strong>1. Upload your file:</strong> Drag and drop any file up to 50MB into the main screen.</p>
           <p><strong>2. Get a QR Code:</strong> Our local server instantly generates a secure, temporary link and a QR code.</p>
           <p><strong>3. Scan & Download:</strong> Scan the QR code with another device on the same Wi-Fi network and instantly hit the download page. It's direct, so it does not upload to random cloud servers on the internet!</p>
           <p className="text-sm pt-4 border-t border-slate-100 text-slate-500">Note: All links strictly expire after 10 minutes to protect your privacy.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
