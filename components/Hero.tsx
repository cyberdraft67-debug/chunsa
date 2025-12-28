
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <div id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video Container */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000&auto=format&fit=crop"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-man-harvesting-fresh-mangoes-from-a-tree-41132-large.mp4" 
            type="video/mp4" 
          />
        </video>
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30"></div>
      </div>

      {/* Hero Content with Framer Motion */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            className="text-7xl md:text-9xl font-black mb-8 leading-[0.9] text-white tracking-tighter"
          >
            The Golden <br />
            <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">Chaunsa</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl md:text-2xl mb-12 text-gray-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
          >
            Savor the royalty of orchards. Directly from nature's lap to your door, the finest honey-sweet harvest of the season.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            <button 
              onClick={onExplore}
              className="relative px-16 py-6 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-2xl transition-all transform hover:scale-105 shadow-[0_0_60px_rgba(245,158,11,0.5)] active:scale-95 group flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Order Your Harvest
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-amber-400/50"></div>
              <p className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs">
                Limited Peak-Season Availability
              </p>
              <div className="h-px w-8 bg-amber-400/50"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Explore Selection</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1.5">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;