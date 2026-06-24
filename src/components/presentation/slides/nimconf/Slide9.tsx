import React from 'react';
import Slide from '../../Slide';
import { Code2 } from 'lucide-react';

const Slide9: React.FC = () => {
  return (
    <Slide className="bg-main text-main-foreground">
      <div className="flex flex-col items-center justify-center text-center space-y-12 h-full min-h-[400px]">
        <div className="p-8 bg-white text-main rounded-full border-8 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          <Code2 size={100} />
        </div>
        <h1 className="text-7xl lg:text-9xl font-black font-heading leading-none">
          Enough Talk.
        </h1>
        <p className="text-4xl font-bold opacity-90">
           Let's see it in action.
        </p>
      </div>
    </Slide>
  );
};

export default Slide9;
