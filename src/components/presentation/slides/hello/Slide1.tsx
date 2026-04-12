import React from 'react';
import Slide from '../../Slide';
import { Terminal, Code2, Globe } from 'lucide-react';

const Slide1: React.FC = () => {
  return (
    <Slide className="bg-main/5">
      <div className="flex flex-col items-center text-center space-y-8 py-12">
        <div className="bg-main text-main-foreground p-6 rounded-full border-4 border-border shadow-shadow animate-bounce">
          <Terminal size={64} />
        </div>
        <h1 className="text-6xl lg:text-9xl font-black font-heading leading-none tracking-tighter">
          <span className="text-main">JAZZY</span><br/>FRAMEWORK
        </h1>
        <p className="text-2xl lg:text-3xl font-bold opacity-80 max-w-3xl">
           Açık Kaynak Dünyası & Web Geliştirmenin Geleceği
        </p>
        <div className="flex gap-4">
           <div className="px-6 py-2 bg-chart-3 border-2 border-border font-black rounded-base shadow-sm -rotate-2">
              #OpenSource
           </div>
           <div className="px-6 py-2 bg-chart-1 border-2 border-border font-black rounded-base shadow-sm rotate-2">
              #JazzyFramework
           </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide1;
