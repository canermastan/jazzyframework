import React from 'react';
import Slide from '../../Slide';
import { Flag, Rocket, ShieldCheck } from 'lucide-react';

const Slide6: React.FC = () => {
  return (
    <Slide className="bg-chart-4/10">
      <div className="flex flex-col items-center space-y-12">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-red-500 text-white border-4 border-border shadow-shadow rounded-base -rotate-2">
            <Flag size={32} fill="currentColor" />
            <h2 className="text-4xl lg:text-6xl font-black font-heading tracking-tight uppercase">Yerli Güç!</h2>
          </div>
          <p className="text-2xl font-black italic bg-main/10 px-6 py-2 border-2 border-border shadow-sm rotate-1">
            Bu Frameworkler Türk Yapımı! 🇹🇷
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl pt-8">
          <div className="p-10 bg-white border-4 border-border shadow-shadow rounded-base flex flex-col items-center text-center space-y-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-chart-1 border-l-4 border-b-4 border-border font-black">CRYSTAL</div>
            <div className="bg-chart-3 p-6 rounded-full border-4 border-border shadow-sm"><ShieldCheck size={56} /></div>
            <h3 className="text-4xl font-black italic">Kemal Framework</h3>
            <p className="text-xl font-bold opacity-70">Crystal tabanlı, Sinatra'dan esinlenen hızlı ve şık bir yapı.</p>
          </div>
          
          <div className="p-10 bg-main/20 border-4 border-border shadow-shadow rounded-base flex flex-col items-center text-center space-y-6 relative overflow-hidden scale-105 rotate-1">
            <div className="absolute top-0 right-0 p-4 bg-main border-l-4 border-b-4 border-border font-black">NİM</div>
            <div className="bg-white p-6 rounded-full border-4 border-border shadow-sm"><Rocket size={56} className="text-main" /></div>
            <h3 className="text-4xl font-black italic">Jazzy Framework</h3>
            <p className="text-xl font-bold">Nim tabanlı, yüksek performanslı ve modern web framework'ü.</p>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide6;
