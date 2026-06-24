import React from 'react';
import Slide from '../../Slide';
import { PackageX, Search } from 'lucide-react';

const Slide2: React.FC = () => {
  return (
    <Slide>
      <div className="flex flex-col h-full justify-center space-y-16">
        <h2 className="text-5xl lg:text-6xl font-black font-heading text-center">
          The "Library Hunting" Problem
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-chart-4 p-8 border-4 border-border shadow-shadow rounded-base transform -rotate-2">
            <div className="flex items-center gap-4 mb-6">
              <Search size={40} className="text-white" />
              <h3 className="text-3xl font-black text-white">Starting a project:</h3>
            </div>
            <ul className="space-y-6 text-2xl font-bold text-white/90">
              <li className="flex items-center gap-2"><span>❓</span> Which Auth library?</li>
              <li className="flex items-center gap-2"><span>❓</span> How to validate JSON?</li>
              <li className="flex items-center gap-2"><span>❓</span> Which ORM is active?</li>
              <li className="flex items-center gap-2"><span>❓</span> Folder structure?</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center items-center text-center space-y-8 bg-secondary-background/50 p-8 rounded-base border-4 border-dashed border-border/50">
             <PackageX size={100} className="text-chart-1 animate-pulse" />
             <p className="text-3xl font-black leading-tight">
               We spend more time <span className="text-chart-1 bg-chart-1/10 px-2 rounded">configuring</span> than <span className="text-main bg-main/10 px-2 rounded">building</span>.
             </p>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide2;
