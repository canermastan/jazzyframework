import React from 'react';
import Slide from '../../Slide';
import { CheckCircle2, Zap, Shield, Database } from 'lucide-react';

const Slide7: React.FC = () => {
  return (
    <Slide className="bg-main/5">
      <div className="flex flex-col space-y-12">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tighter">
          Peki Nedir Bu <span className="text-main italic underline">JAZZY?</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <ul className="space-y-6">
            <li className="flex items-center gap-4 text-3xl font-black">
              <CheckCircle2 className="text-main shrink-0" size={40} />
              NİM Dilinin Gücü
            </li>
            <li className="flex items-center gap-4 text-3xl font-black">
              <CheckCircle2 className="text-main shrink-0" size={40} />
              Python Kadar Kolay
            </li>
            <li className="flex items-center gap-4 text-3xl font-black">
              <CheckCircle2 className="text-main shrink-0" size={40} />
              C Kadar Hızlı
            </li>
          </ul>
          
          <div className="bg-white border-4 border-border shadow-shadow rounded-base p-8 space-y-6 rotate-1">
            <h3 className="text-3xl font-black border-b-4 border-main pb-2 inline-block">Her Şey Dahil!</h3>
            <div className="grid grid-cols-3 gap-4">
               <div className="flex flex-col items-center gap-2 font-bold"><div className="bg-chart-1 p-3 rounded-base border-2 border-border"><Shield size={24} /></div>Auth</div>
               <div className="flex flex-col items-center gap-2 font-bold"><div className="bg-chart-2 p-3 rounded-base border-2 border-border"><Database size={24} /></div>DB</div>
               <div className="flex flex-col items-center gap-2 font-bold"><div className="bg-chart-3 p-3 rounded-base border-2 border-border"><Zap size={24} /></div>Validation</div>
            </div>
          </div>
        </div>
        
        <p className="text-2xl font-bold opacity-80 pt-8 text-center bg-chart-1/20 py-4 border-y-4 border-border -mx-12 uppercase tracking-tighter">
           Geleceğin web teknolojilerini Türkiye'den dünyaya taşıyoruz.
        </p>
      </div>
    </Slide>
  );
};

export default Slide7;
