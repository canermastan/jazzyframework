import React from 'react';
import Slide from '../../Slide';
import { Brain, Wand2, Lightbulb } from 'lucide-react';

const Slide10: React.FC = () => {
  return (
    <Slide className="bg-chart-3/5">
      <div className="flex flex-col items-center space-y-12">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tight text-center uppercase">
          "AMA BEN <span className="text-main italic underline">NİM</span> BİLMİYORUM?"
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base space-y-4 -rotate-1">
            <div className="bg-chart-1 p-3 inline-block rounded-full border-2 border-border shadow-sm"><Lightbulb size={32} /></div>
            <h3 className="text-3xl font-black italic">Nim Çok Kolay!</h3>
            <p className="text-xl font-bold opacity-70 leading-relaxed">Python'ın okunabilirliği ile C'nin hızını birleştiren bir dil. Öğrenmesi saatlerinizi alacak!</p>
          </div>
          
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base space-y-4 rotate-1">
            <div className="bg-chart-4 p-3 inline-block rounded-full border-2 border-border shadow-sm text-white"><Wand2 size={32} /></div>
            <h3 className="text-3xl font-black italic">Yapay Zeka Yanınızda!</h3>
            <p className="text-xl font-bold opacity-70 leading-relaxed">LLM'ler (ChatGPT, Claude, Gemini) Nim dilini çok iyi biliyor. Hızlıca kod üretebilir ve adapte olabilirsiniz.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 p-8 bg-main/20 border-4 border-border shadow-shadow rounded-base mt-8 scale-105">
           <Brain size={64} className="text-main animate-pulse" />
           <p className="text-3xl font-black italic">Öğrenmek için hiçbir engeliniz yok!</p>
        </div>
      </div>
    </Slide>
  );
};

export default Slide10;
