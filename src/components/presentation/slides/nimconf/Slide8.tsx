import React from 'react';
import Slide from '../../Slide';
import { Blocks, Layers } from 'lucide-react';

const Slide8: React.FC = () => {
  return (
    <Slide className="bg-secondary-background/30">
      <div className="flex flex-col items-center justify-center text-center space-y-12 h-full">
        <div className="flex gap-6 mb-4">
          <div className="bg-main text-white p-4 rounded-base border-4 border-border shadow-sm transform -rotate-6">
             <Blocks size={64} />
          </div>
          <div className="bg-chart-1 text-white p-4 rounded-base border-4 border-border shadow-sm transform rotate-6">
             <Layers size={64} />
          </div>
        </div>
        
        <h2 className="text-5xl lg:text-7xl font-black font-heading">
          Scale with Confidence
        </h2>
        
        <p className="text-2xl lg:text-3xl font-bold max-w-4xl opacity-90 leading-relaxed mt-8">
          Jazzy isn't just for small scripts. By enforcing a standard architecture and keeping everything in one box, it empowers you to build <strong className="text-black bg-chart-3 px-3 py-1 rounded-base border-2 border-border inline-block shadow-sm transform -rotate-1">large, scalable applications</strong> without the usual growing pains.
        </p>
        
        <div className="mt-12 bg-secondary-background/50 p-6 rounded-base border-2 border-dashed border-border/50 max-w-2xl">
           <p className="text-2xl font-black text-chart-4">
             Focus on your business logic,<br/> let Jazzy handle the rest.
           </p>
        </div>
      </div>
    </Slide>
  );
};

export default Slide8;
