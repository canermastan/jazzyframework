import React from 'react';
import Slide from '../../Slide';
import { Layout, Boxes, MousePointer2, Smartphone } from 'lucide-react';

const Slide5: React.FC = () => {
  return (
    <Slide className="bg-main/5">
      <div className="flex flex-col items-center space-y-12">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tighter text-center">
          Neden Bu <span className="text-main">Frameworkleri</span> Kullanıyoruz?
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-64 p-8 bg-white border-4 border-border shadow-shadow rounded-base text-center space-y-4">
            <div className="bg-chart-1 p-3 inline-block rounded-full border-2 border-border shadow-sm"><Layout size={48} /></div>
            <h3 className="text-2xl font-black italic">Hızlı Prototipleme</h3>
            <p className="font-bold opacity-60">Sıfırdan yazmak yerine hazır yapıları kullanın.</p>
          </div>
          
          <div className="w-64 p-8 bg-white border-4 border-border shadow-shadow rounded-base text-center space-y-4 -rotate-2">
            <div className="bg-chart-2 p-3 inline-block rounded-full border-2 border-border shadow-sm"><Boxes size={48} /></div>
            <h3 className="text-2xl font-black italic">Standardizasyon</h3>
            <p className="font-bold opacity-60">Ekip çalışmasında ortak bir dil oluşturun.</p>
          </div>
          
          <div className="w-64 p-8 bg-white border-4 border-border shadow-shadow rounded-base text-center space-y-4 rotate-2">
            <div className="bg-chart-3 p-3 inline-block rounded-full border-2 border-border shadow-sm"><MousePointer2 size={48} /></div>
            <h3 className="text-2xl font-black italic">Modern Web</h3>
            <p className="font-bold opacity-60">Güvenli ve ölçeklenebilir uygulamalar geliştirin.</p>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-4 px-12 py-6 bg-white border-4 border-border shadow-shadow rounded-base mt-8 -rotate-1">
          <Smartphone size={32} className="text-main" />
          <p className="text-3xl font-black italic">Web artık sadece HTML değil, devasa bir ekosistem!</p>
        </div>
      </div>
    </Slide>
  );
};

export default Slide5;
