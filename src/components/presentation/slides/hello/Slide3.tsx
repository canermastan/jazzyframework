import React from 'react';
import Slide from '../../Slide';
import { Star, Zap, Cpu, Code, Globe, Globe2 } from 'lucide-react';

const Slide3: React.FC = () => {
  return (
    <Slide className="bg-chart-3/5">
      <div className="flex flex-col space-y-12">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tight text-right">
          Dünya <span className="text-main">Açık Kaynakla</span> Dönüyor
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex flex-col items-center justify-center text-center space-y-4 -rotate-1">
            <div className="bg-main p-4 rounded-full border-2 border-border"><Cpu size={40} /></div>
            <h3 className="text-xl font-black italic">Meta (Llama)</h3>
            <p className="text-xs font-bold opacity-60">Açık Kaynaklı Yapay Zeka</p>
          </div>

          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex flex-col items-center justify-center text-center space-y-4 rotate-1">
            <div className="bg-chart-1 p-4 rounded-full border-2 border-border"><Globe2 size={40} /></div>
            <h3 className="text-xl font-black italic">Linux</h3>
            <p className="text-xs font-bold opacity-60">Dünyayı Yöneten İşletim Sistemi</p>
          </div>

          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex flex-col items-center justify-center text-center space-y-4 rotate-2">
            <div className="bg-chart-3 p-4 rounded-full border-2 border-border"><Star size={40} /></div>
            <h3 className="text-xl font-black italic">VS Code</h3>
            <p className="text-xs font-bold opacity-60">En Popüler Editör</p>
          </div>

          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex flex-col items-center justify-center text-center space-y-4 -rotate-2">
            <div className="bg-chart-4 p-4 rounded-full border-2 border-border"><Globe size={40} /></div>
            <h3 className="text-xl font-black italic">Chromium</h3>
            <p className="text-xs font-bold opacity-60">Tarayıcıların Kalbi</p>
          </div>
        </div>

        <p className="text-center text-2xl font-black font-heading tracking-wider opacity-40 uppercase pt-8">
          Bu projelerin hepsi topluluk desteğiyle büyüdü!
        </p>
      </div>
    </Slide>
  );
};

export default Slide3;
