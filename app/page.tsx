'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Gallery3D from '@/components/Gallery3D';
import { Lock, Settings, Image as ImageIcon, Type, LayoutTemplate, X, Save, KeyRound, LogOut } from 'lucide-react';

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  const [credentials, setCredentials] = useState({ user: 'admin', pass: 'tester123' });
  const [settings, setSettings] = useState({
    headerHeight: 25,
    headerBgImage: '',
    headerBgOpacity: 30,
    headerGradientTop: 80,
    headerGradientBottom: 80,
    headerBgPositionY: 50,
    headerText1: 'P O R T F O L I O',
    headerText2: 'ADNAN VISUALS',
    headerText3: 'Estetika dalam Lensa',
    headerFontSize1: 12,
    headerFontSize2: 26,
    headerFontSize3: 14,
    headerTextPositionY: 50,
    footerText1: 'SUBSCRIBE TO NEWSLETTER',
    footerText2: '© 2026 HAK CIPTA DILINDUNGI',
    footerFontSize1: 12,
    footerFontSize2: 10,
    footerTextPositionY: 50,
    slideDuration: 4000,
    imageScale: 100,
  });

  // MENGAMBIL DATA DARI SERVER GLOBAL (VERCEL KV) SAAT WEB DIBUKA
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
        if (data.creds) setCredentials(data.creds);
      })
      .catch(console.error);
  }, []);

  // MENYIMPAN DATA KE SERVER GLOBAL
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      alert('Pengaturan berhasil disinkronisasi ke seluruh dunia!');
    } catch (e) {
      alert('Gagal menyimpan ke server.');
    }
    setIsSaving(false);
  };

  const handleSaveCreds = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creds: credentials })
      });
      alert('Password baru berhasil disimpan di server!');
      setShowPassModal(false);
    } catch (e) {
      alert('Gagal memperbarui password.');
    }
  };

  // UPLOAD BACKGROUND (Ubah ke Format Base64 agar muat di Server)
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800000) { // Limit ~800KB
        alert("Ukuran gambar terlalu besar! Harap kompres foto latar belakang di bawah 800KB agar database cloud tidak crash.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, headerBgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginForm.user === credentials.user && loginForm.pass === credentials.pass) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginForm({ user: '', pass: '' });
    } else {
      alert('Username atau Password salah!');
    }
  };

  // --- KOMPONEN TAMPILAN FRONT END ---
  const FrontEndView = () => (
    <div className="relative bg-[#050505] text-white w-full h-full flex flex-col items-center justify-between overflow-hidden shadow-2xl font-sans"
         style={{ aspectRatio: '9/16' }}>
      
      <motion.header 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full flex flex-col items-center justify-center z-10"
        style={{ height: `${settings.headerHeight}%` }}>
        
        {settings.headerBgImage && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img src={settings.headerBgImage} alt="Header bg" 
                 className="absolute inset-0 w-full h-full object-cover"
                 style={{ objectPosition: `50% ${settings.headerBgPositionY}%`, opacity: settings.headerBgOpacity / 100 }} />
            <div className="absolute inset-0" 
                 style={{ background: `linear-gradient(to bottom, rgba(5,5,5,${settings.headerGradientTop / 100}) 0%, transparent 50%, rgba(5,5,5,${settings.headerGradientBottom / 100}) 100%)` }} />
          </div>
        )}

        <div className="relative z-20 flex flex-col items-center text-center w-full"
             style={{ transform: `translateY(${settings.headerTextPositionY - 50}px)` }}>
          <h3 className="tracking-[0.3em] font-light text-gray-400 mb-2" style={{ fontSize: `${settings.headerFontSize1}px` }}>{settings.headerText1}</h3>
          <h1 className="font-serif tracking-wide text-white mb-2" style={{ fontSize: `${settings.headerFontSize2}px` }}>{settings.headerText2}</h1>
          <p className="font-light text-gray-400 italic" style={{ fontSize: `${settings.headerFontSize3}px` }}>{settings.headerText3}</p>
        </div>
      </motion.header>

      <main className="flex-1 w-full relative z-0 flex items-center justify-center">
        <Gallery3D imageScale={settings.imageScale} slideDuration={settings.slideDuration}/>
      </main>

      <motion.footer 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full py-8 flex flex-col items-center justify-center z-10 bg-gradient-to-t from-[#050505] to-transparent">
        <div className="flex flex-col items-center" style={{ transform: `translateY(${settings.footerTextPositionY - 50}px)` }}>
          <button className="tracking-widest border-b border-gray-600 pb-1 mb-4 hover:text-gray-300 transition-colors"
                  style={{ fontSize: `${settings.footerFontSize1}px` }}>
            {settings.footerText1}
          </button>
          <p className="tracking-widest text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" 
             onClick={() => !isAdmin && setShowLogin(true)}
             style={{ fontSize: `${settings.footerFontSize2}px` }}>
            {settings.footerText2}
          </p>
        </div>
      </motion.footer>
    </div>
  );

  // --- HALAMAN PUBLIC ---
  if (!isAdmin) {
    return (
      <div className="bg-black min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-[450px] h-[100svh] aspect-[9/16] relative">
          <FrontEndView/>
        </div>
        <AnimatePresence>
          {showLogin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.form initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                onSubmit={handleLogin} className="bg-white/10 p-8 rounded-2xl border border-white/20 text-white w-full max-w-sm relative">
                <button type="button" onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                <div className="flex justify-center mb-6"><Lock className="text-gray-300" size={40}/></div>
                <h2 className="text-xl text-center font-serif mb-6 tracking-wide">Akses Terbatas</h2>
                <input type="text" placeholder="Username" required value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                <input type="password" placeholder="Password" required value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 mb-6 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                <button type="submit" className="w-full bg-white text-black py-3 rounded-lg font-semibold tracking-wide hover:bg-gray-200 transition-colors">LOGIN</button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- HALAMAN ADMIN (SPLIT SCREEN) ---
  return (
    <div className="flex h-screen bg-[#f3f4f6] text-gray-800 font-sans overflow-hidden">
      <div className="w-1/2 h-full hidden lg:flex items-center justify-center bg-gray-200 shadow-inner relative z-0 p-8">
        <div className="relative h-full aspect-[9/16] bg-black rounded-[3rem] border-[14px] border-gray-900 shadow-2xl overflow-hidden ring-4 ring-white">
          <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 w-32 mx-auto rounded-b-3xl z-50"></div>
          <FrontEndView/>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] relative z-10 p-8 lg:p-12">
        <div className="flex justify-between items-center border-b pb-6 mb-8 sticky top-0 bg-white/90 backdrop-blur z-20">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="text-blue-600"/> Dashboard Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Ubah tampilan front-end secara real-time</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsAdmin(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors">
              <LogOut size={16}/> Kembali
            </button>
            <button onClick={() => setShowPassModal(true)} className="px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-2 transition-colors">
              <KeyRound size={16}/> Password
            </button>
            <button onClick={handleSaveSettings} disabled={isSaving} className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-md flex items-center gap-2 transition-colors">
              <Save size={16}/> {isSaving ? 'Menyimpan...' : 'Simpan Cloud'}
            </button>
          </div>
        </div>

        <div className="space-y-10 max-w-2xl mx-auto pb-20">
          {/* SECTION HEADER */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><LayoutTemplate size={20}/> 1. Pengaturan Header</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold block mb-2">Tinggi Header Area (%)</label>
                <input type="range" min="15" max="40" value={settings.headerHeight} onChange={e => setSettings({...settings, headerHeight: Number(e.target.value)})} className="w-full accent-blue-600" />
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2"><ImageIcon size={16}/> Latar Belakang Gambar</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                {settings.headerBgImage && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Transparansi Gambar</label>
                      <input type="range" min="0" max="100" value={settings.headerBgOpacity} onChange={e => setSettings({...settings, headerBgOpacity: Number(e.target.value)})} className="w-full accent-blue-600" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Posisi Vertikal Gambar</label>
                      <input type="range" min="0" max="100" value={settings.headerBgPositionY} onChange={e => setSettings({...settings, headerBgPositionY: Number(e.target.value)})} className="w-full accent-blue-600" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Gradient Gelap Atas</label>
                      <input type="range" min="0" max="100" value={settings.headerGradientTop} onChange={e => setSettings({...settings, headerGradientTop: Number(e.target.value)})} className="w-full accent-blue-600" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Gradient Gelap Bawah</label>
                      <input type="range" min="0" max="100" value={settings.headerGradientBottom} onChange={e => setSettings({...settings, headerGradientBottom: Number(e.target.value)})} className="w-full accent-blue-600" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                <label className="text-sm font-semibold flex items-center gap-2"><Type size={16}/> Teks Header</label>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Posisi Vertikal Grup Teks</label>
                  <input type="range" min="0" max="100" value={settings.headerTextPositionY} onChange={e => setSettings({...settings, headerTextPositionY: Number(e.target.value)})} className="w-full accent-blue-600" />
                </div>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex gap-3 items-center">
                    <input type="text" value={(settings as any)[`headerText${num}`]} onChange={e => setSettings({...settings, [`headerText${num}`]: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
                    <div className="w-24">
                      <label className="text-[10px] text-gray-400 block mb-1">Ukuran</label>
                      <input type="range" min="8" max="50" value={(settings as any)[`headerFontSize${num}`]} onChange={e => setSettings({...settings, [`headerFontSize${num}`]: Number(e.target.value)})} className="w-full accent-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION GALLERY */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><ImageIcon size={20}/> 2. Pengaturan Galeri Slide</h2>
            <div className="space-y-6">
               <div>
                <label className="text-sm font-semibold block mb-2">Durasi Tampil (Steady): {settings.slideDuration / 1000} detik</label>
                <input type="range" min="1000" max="10000" step="500" value={settings.slideDuration} onChange={e => setSettings({...settings, slideDuration: Number(e.target.value)})} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Skala / Ukuran Foto: {settings.imageScale}%</label>
                <input type="range" min="50" max="150" value={settings.imageScale} onChange={e => setSettings({...settings, imageScale: Number(e.target.value)})} className="w-full accent-blue-600" />
              </div>
            </div>
          </section>

          {/* SECTION FOOTER */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Type size={20}/> 3. Pengaturan Footer</h2>
            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Posisi Vertikal Grup Teks Footer</label>
                  <input type="range" min="0" max="100" value={settings.footerTextPositionY} onChange={e => setSettings({...settings, footerTextPositionY: Number(e.target.value)})} className="w-full accent-blue-600" />
                </div>
                {[1, 2].map((num) => (
                  <div key={num} className="flex gap-3 items-center">
                    <input type="text" value={(settings as any)[`footerText${num}`]} onChange={e => setSettings({...settings, [`footerText${num}`]: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"/>
                    <div className="w-24">
                      <label className="text-[10px] text-gray-400 block mb-1">Ukuran</label>
                      <input type="range" min="8" max="30" value={(settings as any)[`footerFontSize${num}`]} onChange={e => setSettings({...settings, [`footerFontSize${num}`]: Number(e.target.value)})} className="w-full accent-blue-600" />
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showPassModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative">
              <button onClick={() => setShowPassModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><KeyRound/> Ubah Akses Login</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Username Baru</label>
                  <input type="text" value={credentials.user} onChange={e => setCredentials({...credentials, user: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Password Baru</label>
                  <input type="text" value={credentials.pass} onChange={e => setCredentials({...credentials, pass: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <button onClick={handleSaveCreds} className="w-full bg-black text-white rounded-lg py-3 mt-4 font-semibold hover:bg-gray-800 transition-colors">Simpan Kredensial (Global)</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}