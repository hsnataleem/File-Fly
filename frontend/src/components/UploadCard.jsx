import React, { useCallback, useState } from 'react';
import { Send, FileText, Type } from 'lucide-react';

export default function UploadCard({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState('file'); // 'file' or 'note'
  const [noteContent, setNoteContent] = useState('');

  const handleDrag = useCallback((e) => {
    if (mode === 'note') return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, [mode]);

  const handleDrop = useCallback((e) => {
    if (mode === 'note') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [mode, onUpload]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleNoteSubmit = () => {
    if (!noteContent.trim()) return;
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const file = new File([blob], 'Secure_Note.txt', { type: 'text/plain' });
    onUpload(file);
  };

  return (
    <div 
      className={`w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl transition-all duration-300 border-2 overflow-hidden ${isDragging ? 'border-blue-400 scale-105' : 'border-transparent'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex w-full border-b border-slate-100 mb-6 bg-slate-50">
        <button 
          onClick={() => setMode('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${mode === 'file' ? 'bg-white text-teal-500 border-b-2 border-teal-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText size={18} /> Shared File
        </button>
        <button 
          onClick={() => setMode('note')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${mode === 'note' ? 'bg-white text-teal-500 border-b-2 border-teal-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Type size={18} /> Shared Note
        </button>
      </div>

      <div className="p-8 pt-2">
        {mode === 'file' ? (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="text-teal-400">
              <Send size={64} className="transform -rotate-45 mb-2 drop-shadow-md text-blue-500" />
            </div>
            
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Upload Files</h2>
              <p className="text-slate-500 mt-2 font-medium">Seamless File Sharing.<br/>Just drag & drop or click to upload.</p>
            </div>

            <label className="cursor-pointer group">
              <input type="file" className="hidden" onChange={handleChange} />
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform group-hover:scale-105 active:scale-95">
                UPLOAD NOW
              </div>
            </label>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight text-center mb-2">Secure Notepad</h2>
            <textarea
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-700"
              placeholder="Paste any temporary text, links, or notes here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <button
              onClick={handleNoteSubmit}
              disabled={!noteContent.trim()}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 self-center"
            >
              SHARE SECURE NOTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
