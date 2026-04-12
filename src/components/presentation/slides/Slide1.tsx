import React from 'react';
import Slide from '../Slide';
import { Terminal, Zap } from 'lucide-react';

const Slide1: React.FC = () => {
  return (
    <Slide className="bg-main/5">
      <div className="flex flex-col items-center text-center space-y-8 py-12">
        <div className="bg-main text-main-foreground p-4 rounded-full border-4 border-border shadow-shadow animate-bounce">
          <Terminal size={48} />
        </div>
        <h1 className="text-6xl lg:text-8xl font-black font-heading leading-none tracking-tighter">
          Welcome to <span className="text-main">JAZZY</span>
        </h1>
        <p className="text-2xl lg:text-3xl font-bold opacity-80 max-w-3xl">
           The Productive Web Framework for Nim. Write less code, build more features.
        </p>
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-chart-3 border-2 border-border font-black rounded-base shadow-sm -rotate-2">
           <Zap size={24} fill="currentColor" />
           v0.3.0 is out!
        </div>
      </div>
    </Slide>
  );
};

export default Slide1;
