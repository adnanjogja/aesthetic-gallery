'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, Type, Save, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [config, setConfig] = useState({
    headerY: 10, footerY: 90,
    fontSizeHead: 24, fontSizeSub: 12,
    showFileName: true,
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('galleryConfig');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  const handleSave = () => {
    localStorage.setItem('galleryConfig', JSON.stringify(config));
    alert('Pengaturan Berhasil Disimpan!');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-light tracking-widest">DASHBOARD ADMIN</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm text-gray-400">
            <LogOut className="w-4 h-4" /> Kembali
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-lg text-sm font-bold">
            <Save className="w-4 h-4" /> SIMPAN
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="flex items-center gap-2 text-sm uppercase text-gray-400 mb-6">
            <Type className="w-4 h-4" /> Pengaturan Tata Letak
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Posisi Header : {config.headerY}%</label>
              <input type="range" min="0" max="100" value={config.headerY} onChange={e => setConfig({...config, headerY: Number(e.target.value)})} className="w-full accent-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Posisi Footer : {config.footerY}%</label>
              <input type="range" min="0" max="100" value={config.footerY} onChange={e => setConfig({...config, footerY: Number(e.target.value)})} className="w-full accent-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Ukuran Font : {config.fontSizeHead}px</label>
              <input type="range" min="16" max="48" value={config.fontSizeHead} onChange={e => setConfig({...config, fontSizeHead: Number(e.target.value)})} className="w-full accent-white" />
            </div>
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="flex items-center gap-2 text-sm uppercase text-gray-400 mb-6">
            <Sliders className="w-4 h-4" /> Pengaturan Galeri
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Tampilkan Nama File</span>
            <button 
              onClick={() => setConfig({...config, showFileName: !config.showFileName})}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.showFileName ? 'bg-white' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform duration-300 ${config.showFileName ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}