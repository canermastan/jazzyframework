import React from 'react';
import Slide from '../../Slide';
import { Terminal, Zap } from 'lucide-react';

const Slide1: React.FC = () => {
  return (
    <Slide className="bg-main/5">
      <div className="flex flex-col items-center justify-center text-center space-y-8 h-full">
        <div className="bg-main text-main-foreground p-6 rounded-full border-4 border-border shadow-shadow animate-bounce">
          <Terminal size={64} />
        </div>
        <h1 className="text-6xl lg:text-8xl font-black font-heading leading-none tracking-tighter">
          Meet <span className="text-main">JAZZY</span>
        </h1>
        <p className="text-2xl lg:text-3xl font-bold opacity-80 max-w-3xl">
           The Productive Web Framework for Nim.
        </p>
        <div className="inline-flex items-center gap-3 px-6 py-3 mt-8 bg-chart-1 text-white border-4 border-border font-black text-xl rounded-base shadow-sm -rotate-2 transform hover:rotate-0 transition-transform">
           <Zap size={28} fill="currentColor" />
           Write less code, build more features.
        </div>
      </div>
    </Slide>
  );
};

export default Slide1;
