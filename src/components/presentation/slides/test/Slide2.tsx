import React from 'react';
import Slide from '../../Slide';
import { Shield, Database, Zap, Rocket } from 'lucide-react';

const Slide2: React.FC = () => {
  return (
    <Slide className="bg-chart-2/5">
      <div className="space-y-12 h-full flex flex-col justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black font-heading">Why Jazzy?</h2>
          <div className="h-2 w-32 bg-chart-1 mx-auto border-2 border-border"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border-4 border-border shadow-shadow bg-chart-4/10 rounded-base flex gap-4">
             <div className="bg-chart-4 text-white p-3 rounded-base h-fit border-2 border-border shadow-sm">
               <Shield size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black mb-2">Built-in Auth</h3>
               <p className="font-bold opacity-70 italic text-lg">JWT registration and login ready in seconds.</p>
             </div>
          </div>

          <div className="p-6 border-4 border-border shadow-shadow bg-chart-1/10 rounded-base flex gap-4">
             <div className="bg-chart-1 text-white p-3 rounded-base h-fit border-2 border-border shadow-sm">
               <Database size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black mb-2">Integrated SQLite</h3>
               <p className="font-bold opacity-70 italic text-lg">Zero configuration query builder and migration tools.</p>
             </div>
          </div>

          <div className="p-6 border-4 border-border shadow-shadow bg-chart-5/10 rounded-base flex gap-4">
             <div className="bg-chart-5 text-white p-3 rounded-base h-fit border-2 border-border shadow-sm">
               <Zap size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black mb-2">Async Performance</h3>
               <p className="font-bold opacity-70 italic text-lg">Powered by Mummy for native Nim speed.</p>
             </div>
          </div>

          <div className="p-6 border-4 border-border shadow-shadow bg-chart-2/10 rounded-base flex gap-4">
             <div className="bg-chart-2 text-white p-3 rounded-base h-fit border-2 border-border shadow-sm">
               <Rocket size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black mb-2">Scaffolding CLI</h3>
               <p className="font-bold opacity-70 italic text-lg">Generate controllers and models with `jazzy make`.</p>
             </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide2;
