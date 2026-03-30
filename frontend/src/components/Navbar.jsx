import React, { useState } from 'react';
import { User, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm relative z-50">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src="/logoi-transparent.png" alt="File Fly Logo" className="h-16 md:h-24 w-auto object-contain cursor-pointer transform hover:scale-105 transition-all drop-shadow-sm" />
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 relative">
        <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700">Home</Link>
        <Link to="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
        <Link to="/active-transfers" className="hover:text-blue-600 transition-colors">Active Transfers</Link>
        
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors relative" 
          onClick={() => setShowAccountPopup(!showAccountPopup)}
        >
          <span>Account</span>
          <div className="p-1.5 bg-slate-100 rounded-full">
            <User size={16} />
          </div>

          {showAccountPopup && (
            <div className="absolute top-12 right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
              <div className="flex gap-3 mb-2">
                <Info size={20} className="text-teal-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Anonymous Mode</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Account settings aren't required yet! File Fly V1 operates completely securely on your local network without accounts or passwords.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
