import React from 'react';
import Slide from '../../Slide';
import ValidationShowcase from '../../../landing/ValidationShowcase';

const Slide5: React.FC = () => {
  return (
    <Slide>
      <div className="flex flex-col h-full justify-center space-y-12">
        <div className="text-center">
          <h2 className="text-5xl lg:text-6xl font-black font-heading">
            Expressive Validation
          </h2>
          <p className="text-xl opacity-90 mt-4">
            See how clean and modern request validation can be.
          </p>
        </div>
        <div className="w-full max-w-6xl mx-auto">
          <ValidationShowcase />
        </div>
      </div>
    </Slide>
  );
};

export default Slide5;
