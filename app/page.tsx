'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Gallery3D from '@/components/Gallery3D';
import { Lock } from 'lucide-react';

export default function PublicGallery() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [secretPass, setSecretPass] = useState('');
  
  const [config, setConfig] = useState({
    headerY: 10, footerY: 90,
    fontSizeHead: 24, fontSizeSub: 12,
    showFileName: true,
  });

  useEffect(() => {
    fetch('/api/drive').then(res => res.json()).then(data => setImages(data.files || []));
    const savedConfig = localStorage.getItem('galleryConfig');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  const handleSecretLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretPass === 'admin123') { 
      router.push('/admin');
    } else {
      alert('Password Salah!');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center font-sans">
      <main className="w-full max-w-[400px] aspect-[9/16] relative bg-[#000000] overflow-hidden shadow-2xl mx-auto border border-white/5">
        
        <header className="absolute w-full flex flex-col items-center justify-center z-20" style={{ top: `${config.headerY}%` }}>
          <h3 className="text-gray-400 uppercase tracking-[0.3em] text-[10px] mb-1">Portfolio</h3>
          <h1 className="text-white font-light tracking-widest" style={{ fontSize: `${config.fontSizeHead}px` }}>ADNAN VISUALS</h1>
          <h2 className="text-gray-500 font-light mt-1" style={{ fontSize: `${config.fontSizeSub}px` }}>Estetika dalam Lensa</h2>
        </header>

        <section className="absolute inset-0 flex items-center justify-center z-10 mt-10">
          <Gallery3D images={images} showFileName={config.showFileName} />
        </section>

        <footer className="absolute w-full flex flex-col items-center text-center z-20" style={{ top: `${config.footerY}%` }}>
          <p className="text-gray-300 text-sm tracking-wider mb-2">SUBSCRIBE TO NEWSLETTER</p>
          <p onClick={() => setShowLoginModal(true)} className="text-gray-600 text-[10px] tracking-widest uppercase cursor-pointer">
            © 2026 Hak Cipta Dilindungi
          </p>
        </footer>

        {showLoginModal && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <form onSubmit={handleSecretLogin} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full text-center relative">
              <button type="button" onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-500">✕</button>
              <Lock className="w-8 h-8 text-white mx-auto mb-4 opacity-50" />
              <input 
                type="password" placeholder="Password Rahasia" 
                className="w-full bg-black text-center text-white p-3 rounded-lg border border-gray-700 outline-none mb-4"
                value={secretPass} onChange={(e) => setSecretPass(e.target.value)} autoFocus
              />
              <button type="submit" className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase">Masuk Panel</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}