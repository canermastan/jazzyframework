import React from 'react';
import Slide from '../../Slide';
import { Layers, Zap, Coffee, Code2 } from 'lucide-react';

const Slide4: React.FC = () => {
  return (
    <Slide className="bg-chart-1/10">
      <div className="flex flex-col space-y-12">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tight">
          Web Dünyasının <span className="text-main">Temelleri</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-8 pt-4">
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex items-center gap-6 -rotate-1">
            <div className="bg-green-500 p-4 rounded-full border-2 border-border text-white"><Layers size={40} /></div>
            <div>
              <h3 className="text-3xl font-black italic">Django / Flask</h3>
              <p className="font-bold opacity-60">Python'ın Dev Gücü</p>
            </div>
          </div>
          
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex items-center gap-6 rotate-1">
            <div className="bg-red-500 p-4 rounded-full border-2 border-border text-white"><Zap size={40} /></div>
            <div>
              <h3 className="text-3xl font-black italic">Laravel</h3>
              <p className="font-bold opacity-60">PHP'nin Modern Yüzü</p>
            </div>
          </div>
          
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex items-center gap-6 rotate-1">
            <div className="bg-orange-500 p-4 rounded-full border-2 border-border text-white"><Coffee size={40} /></div>
            <div>
              <h3 className="text-3xl font-black italic">Spring Boot</h3>
              <p className="font-bold opacity-60">Java'nın Kurumsal Standardı</p>
            </div>
          </div>
          
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base flex items-center gap-6 -rotate-1">
            <div className="bg-blue-500 p-4 rounded-full border-2 border-border text-white"><Code2 size={40} /></div>
            <div>
              <h3 className="text-3xl font-black italic">Express.js</h3>
              <p className="font-bold opacity-60">Node.js'in Hızlı Çözümü</p>
            </div>
          </div>
        </div>
        
        <p className="text-2xl font-bold text-center italic opacity-70 border-t-4 border-border pt-8">
          Milyarlarca dolarlık projeler bu temeller üzerine inşa ediliyor.
        </p>
      </div>
    </Slide>
  );
};

export default Slide4;
