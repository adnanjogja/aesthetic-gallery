'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Gallery3D({ slideDuration, imageScale }: { slideDuration: number, imageScale: number }) {
  const [images, setImages] = useState<{id: string, url: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/drive')
      .then(res => res.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          setImages(data.files);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, slideDuration);
    return () => clearInterval(timer);
  }, [images.length, currentIndex, slideDuration]);

  const handleDragEnd = (e: any, { offset }: any) => {
    const swipeThreshold = 50;
    if (offset.x > swipeThreshold) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); // Geser Kanan
    } else if (offset.x < -swipeThreshold) {
      setCurrentIndex((prev) => (prev + 1) % images.length); // Geser Kiri
    }
  };

  if (loading) return <div className="text-gray-500 animate-pulse tracking-widest text-sm">MEMUAT GALERI...</div>;
  if (images.length === 0) return <div className="text-gray-600 text-sm italic">Tidak ada foto ditemukan</div>;

  return (
    <div className="relative w-full h-[60%] perspective-[1000px] flex items-center justify-center">
        {images.map((img, index) => {
          const diff = (index - currentIndex + images.length) % images.length;
          let position = 0;
          
          // Logika baru: 0 (Tengah), 1 (Kanan), -1 (Kiri), 2 (Bersembunyi di belakang)
          if (diff === 0) position = 0;
          else if (diff === 1 || diff === -(images.length - 1)) position = 1;
          else if (diff === images.length - 1 || diff === -1) position = -1;
          else position = 2; // Tetap di-render di DOM, tapi disembunyikan agar tidak perlu diload ulang

          const isVisible = position !== 2;

          return (
            <motion.div
              key={img.id}
              drag={isVisible ? "x" : false} // Hanya yang terlihat yang bisa di-drag
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={false}
              animate={{
                opacity: position === 0 ? 1 : (position === 2 ? 0 : 0.4),
                x: position === 2 ? 0 : position * 150,
                scale: position === 2 ? 0.5 : (position === 0 ? 1 : 0.85) * (imageScale / 100),
                zIndex: position === 0 ? 10 : (position === 2 ? -1 : 1),
                rotateY: position === 2 ? 0 : position * -25,
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute w-[75%] max-w-[320px] aspect-[4/5] rounded-2xl shadow-2xl overflow-hidden"
              style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
            >
              <img
                src={img.url}
                alt="Galeri"
                loading="lazy" // Fitur Lazy Load dari HTML5 agar website enteng
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-700" 
                   style={{ opacity: position === 0 ? 0 : 0.5 }} />
            </motion.div>
          );
        })}
    </div>
  );
}