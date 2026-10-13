'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Gallery3D({ images, showFileName }: { images: any[], showFileName: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return <div className="text-white text-center text-sm tracking-widest">LOADING GALLERY...</div>;

  return (
    <div className="relative w-[80%] aspect-[2/3] mx-auto perspective-1000 flex items-center justify-center">
      {images.map((img, index) => {
        let position = 'hidden';
        let zIndex = 0;
        let scale = 0;
        let x = '0%';

        if (index === currentIndex) {
          position = 'active'; zIndex = 50; scale = 1; x = '0%';
        } else if (index === (currentIndex + 1) % images.length) {
          position = 'next'; zIndex = 40; scale = 0.8; x = '-60%';
        } else if (index === (currentIndex - 1 + images.length) % images.length) {
          position = 'prev'; zIndex = 40; scale = 0.8; x = '60%';
        }

        if (position === 'hidden') return null;

        return (
          <motion.div
            key={img.id}
            initial={false}
            animate={{ x, scale, zIndex, opacity: position === 'active' ? 1 : 0.5 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className={`absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-900 ${
              position !== 'active' && 'pointer-events-none blur-[2px]'
            }`}
          >
            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            {showFileName && position === 'active' && (
              <div className="absolute top-4 left-0 w-full text-center">
                <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                  {img.name}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}