import React from 'react';
import Slide from '../../Slide';
import { Star, Rocket, HeartHandshake } from 'lucide-react';

const Slide9: React.FC = () => {
  return (
    <Slide className="bg-chart-2/5">
      <div className="flex flex-col space-y-12 items-center">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tighter text-center">
          Siz de <span className="text-main">Katkıda</span> Bulunabilirsiniz!
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl items-center">
          {/* STAR SECTION - BALANCED */}
          <div className="p-8 bg-white border-4 border-main shadow-shadow rounded-base flex flex-col items-center text-center space-y-6 rotate-1 relative">
            <div className="absolute -top-4 bg-main text-black px-3 py-1 font-black text-sm border-2 border-border -rotate-2">
              EN DEĞERLİ KATKI!
            </div>
            <div className="bg-yellow-400 p-6 rounded-full border-4 border-border shadow-sm animate-pulse">
               <Star size={64} fill="currentColor" />
            </div>
            <h3 className="text-4xl font-black italic underline decoration-main">Yıldız Atın!</h3>
            <p className="text-xl font-bold leading-tight opacity-80">
               GitHub reposuna yıldız atmanız, projenin tanınması için en kritik desteğimizdir.
            </p>
          </div>
          
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex flex-col items-center text-center space-y-6 -rotate-1">
            <div className="bg-chart-3 p-6 rounded-full border-4 border-border shadow-sm">
               <Rocket size={64} fill="currentColor" />
            </div>
            <h3 className="text-4xl font-black italic">Proje Geliştirin</h3>
            <p className="text-xl font-bold opacity-80">
               Jazzy ile bir proje yapıp topluluğa örnek olabilirsiniz.
            </p>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-4 px-8 py-3 bg-white border-4 border-border shadow-shadow rounded-base mt-8 -rotate-1">
          <HeartHandshake size={32} className="text-main" />
          <p className="text-2xl font-black">Toplulukla beraber büyüyoruz.</p>
        </div>
      </div>
    </Slide>
  );
};

export default Slide9;
