import React from 'react';
import { cn } from '@/lib/utils';

interface SlideProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

const Slide: React.FC<SlideProps> = ({ 
  children, 
  className = "", 
  bgColor = "bg-secondary-background" 
}) => {
  return (
    <div className={cn(
      "slide w-full h-screen flex flex-col items-center justify-center p-8 transition-opacity duration-300",
      bgColor,
      className
    )}>
      <div className="max-w-6xl w-full border-4 border-border shadow-shadow rounded-base p-12 bg-white relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Slide;
