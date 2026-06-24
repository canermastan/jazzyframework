import React from 'react';
import Slide from '../../Slide';
import { PackageCheck, Heart } from 'lucide-react';

const Slide3: React.FC = () => {
  return (
    <Slide className="bg-chart-2/10">
      <div className="flex flex-col items-center justify-center text-center space-y-12 h-full">
        <h2 className="text-6xl lg:text-7xl font-black font-heading leading-tight">
          Batteries <br/>
          <span className="bg-chart-2 text-white px-6 py-2 rounded-base border-4 border-border transform rotate-2 inline-block shadow-shadow mt-4">
            Included
          </span>
        </h2>
        
        <p className="text-2xl lg:text-3xl font-bold max-w-4xl opacity-90 leading-relaxed mt-8">
          Jazzy is designed for <strong className="font-black text-chart-1">developer joy</strong>. 
          When you start a project, you shouldn't have to look for other libraries. 
          <span className="block mt-4 text-main">Everything you need is right there in the box.</span>
        </p>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="flex items-center gap-4 bg-white px-6 py-4 border-4 border-border rounded-base shadow-shadow font-black text-2xl transform -rotate-1 hover:rotate-0 transition-transform">
            <PackageCheck size={36} className="text-chart-4" /> Ready to Use
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-4 border-4 border-border rounded-base shadow-shadow font-black text-2xl transform rotate-1 hover:rotate-0 transition-transform">
            <Heart size={36} className="text-chart-1" /> No Configuration
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide3;
