import React from 'react';
import Slide from '../../Slide';
import { Shield, CheckCircle2, Database } from 'lucide-react';

const Slide4: React.FC = () => {
  return (
    <Slide>
      <div className="flex flex-col h-full justify-center">
        <h2 className="text-5xl lg:text-6xl font-black font-heading mb-16 text-center">
          Everything you need to ship it.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-chart-1 p-8 rounded-base border-4 border-border shadow-shadow text-white transform hover:-translate-y-2 hover:rotate-1 transition-transform">
            <Shield size={64} className="mb-8" />
            <h3 className="text-3xl font-black mb-4">Built-in Auth</h3>
            <p className="text-xl font-bold opacity-90 leading-relaxed">
              Registration, login, and secure session-less JWT management ready out-of-the-box.
            </p>
          </div>
          
          <div className="bg-chart-4 p-8 rounded-base border-4 border-border shadow-shadow text-white transform hover:-translate-y-2 hover:-rotate-1 transition-transform delay-75">
            <CheckCircle2 size={64} className="mb-8" />
            <h3 className="text-3xl font-black mb-4">Data Validation</h3>
            <p className="text-xl font-bold opacity-90 leading-relaxed">
              Validate JSON requests seamlessly with an expressive and modern syntax.
            </p>
          </div>
          
          <div className="bg-chart-3 p-8 rounded-base border-4 border-border shadow-shadow text-black transform hover:-translate-y-2 hover:rotate-1 transition-transform delay-150">
            <Database size={64} className="mb-8" />
            <h3 className="text-3xl font-black mb-4">Integrated SQLite</h3>
            <p className="text-xl font-bold opacity-90 leading-relaxed">
              Zero-setup database support with fluent query builders. Focus on data, not config.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide4;
