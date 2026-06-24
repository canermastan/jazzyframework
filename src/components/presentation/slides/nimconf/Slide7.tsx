import React from 'react';
import Slide from '../../Slide';
import { TerminalSquare, Sparkles } from 'lucide-react';

const Slide7: React.FC = () => {
  return (
    <Slide>
      <div className="flex flex-col md:flex-row gap-16 items-center h-full">
        <div className="flex-1 space-y-8">
          <h2 className="text-5xl lg:text-6xl font-black font-heading leading-tight">
            Your Coding Assistant
          </h2>
          <p className="text-2xl font-bold opacity-90">
            Start your next big idea in seconds with the Jazzy CLI.
          </p>
          
          <div className="bg-[#1e1e1e] text-[#4af626] p-8 rounded-base border-4 border-border font-mono text-2xl shadow-shadow transform -rotate-1 hover:rotate-0 transition-transform mt-8">
            <div className="flex items-center gap-4 mb-4 text-white/50">
              <TerminalSquare size={24} />
              <span className="text-sm">bash</span>
            </div>
            $ jazzy new my_project
            <br/><br/>
            <span className="text-[#a0a0a0] text-xl block">✓ Created project structure</span>
            <span className="text-[#a0a0a0] text-xl block">✓ Configured dependencies</span>
            <span className="text-[#a0a0a0] text-xl block">✓ Ready to build!</span>
          </div>
        </div>
        
        <div className="flex-1 bg-chart-5 text-white p-12 rounded-base border-4 border-border shadow-shadow transform rotate-1">
          <div className="flex items-center gap-4 mb-8">
             <Sparkles size={48} className="animate-pulse text-chart-2" />
             <h3 className="text-4xl font-black">Coming Soon...</h3>
          </div>
          <ul className="space-y-6 text-2xl font-bold">
            <li className="flex items-start gap-4">
              <span className="text-chart-2">✦</span>
              Scaffolding commands (controllers, models, etc.)
            </li>
            <li className="flex items-start gap-4">
              <span className="text-chart-2">✦</span>
              Built-in powerful templating system
            </li>
            <li className="flex items-start gap-4">
              <span className="text-chart-2">✦</span>
              Even more developer productivity tools
            </li>
          </ul>
        </div>
      </div>
    </Slide>
  );
};

export default Slide7;
