import React from 'react';
import Slide from '../Slide';
import CodeShowcase from '../../landing/CodeShowcase';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

const Slide3: React.FC = () => {
  return (
    <Slide className="bg-chart-5/5">
       <div className="flex flex-col lg:flex-row items-center gap-12 h-full">
         <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-black font-heading leading-tight">
              Developer <br/>
              <span className="text-chart-2 bg-chart-2/10 px-2 rounded-base">Experience</span> <br/>
              Matters.
            </h2>
            <p className="text-xl font-bold opacity-80">
               Intuitive routing, clean controller syntax, and automatic request validation.
            </p>
            <Button size="lg" className="h-14 text-xl">
               Start Building <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
         </div>
         <div className="flex-1 w-full max-w-xl">
            <CodeShowcase />
         </div>
       </div>
    </Slide>
  );
};

export default Slide3;
