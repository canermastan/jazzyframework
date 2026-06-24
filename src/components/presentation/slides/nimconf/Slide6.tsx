import React from 'react';
import Slide from '../../Slide';
import DatabaseShowcase from '../../../landing/DatabaseShowcase';

const Slide6: React.FC = () => {
  return (
    <Slide className="bg-secondary-background/20">
      <div className="flex flex-col h-full justify-center space-y-12">
        <div className="text-center">
          <h2 className="text-5xl lg:text-6xl font-black font-heading">
            Fluent Database Access
          </h2>
          <p className="text-xl opacity-90 mt-4">
            Zero setup SQLite integration with type-safe query builders.
          </p>
        </div>
        <div className="w-full max-w-6xl mx-auto">
          <DatabaseShowcase />
        </div>
      </div>
    </Slide>
  );
};

export default Slide6;
