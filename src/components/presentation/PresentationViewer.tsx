import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Keyboard, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { PRESENTATIONS, type PresentationId } from './registry';

export interface PresentationViewerProps {
  id?: string;
  children?: React.ReactNode;
}

export default function PresentationViewer({ id = "test" }: PresentationViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDE_COMPONENTS = useMemo(() => {
    return PRESENTATIONS[id as PresentationId] || [];
  }, [id]);

  const totalSlides = SLIDE_COMPONENTS.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1 < totalSlides ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Debug log
  useEffect(() => {
    console.log("PresentationViewer loaded with ID:", id, "Total Slides:", totalSlides);
  }, [id, totalSlides]);

  if (totalSlides === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background p-8">
        <div className="max-w-md w-full border-4 border-border shadow-shadow bg-white p-12 rounded-base text-center space-y-6">
          <div className="flex justify-center text-chart-1">
            <AlertCircle size={64} />
          </div>
          <h2 className="text-3xl font-black font-heading">Presentation Not Found</h2>
          <p className="font-bold opacity-70">
            The presentation ID <code className="bg-main/20 px-2 rounded-base">"{id}"</code> is not in the registry.
          </p>
          <a href="/jazzyframework/">
            <Button variant="neutral" className="mt-4">Back to Home</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {SLIDE_COMPONENTS.map((SlideComp, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 transform ${index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            style={{
              visibility: index === currentSlide || Math.abs(index - currentSlide) <= 1 ? 'visible' : 'hidden',
              pointerEvents: index === currentSlide ? 'auto' : 'none'
            }}
          >
            <SlideComp />
          </div>
        ))}
      </div>

      {/* Navigation Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-12 z-50 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <Button
            variant="neutral"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="rounded-full shadow-shadow"
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center px-6 py-2 bg-white border-2 border-border shadow-shadow rounded-base text-sm font-bold">
            {currentSlide + 1} / {totalSlides}
          </div>
          <Button
            variant="neutral"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="rounded-full shadow-shadow"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="neutral"
            size="sm"
            onClick={toggleFullscreen}
            className="hidden md:flex gap-2 shadow-shadow"
          >
            <Maximize size={16} /> Fullscreen
          </Button>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-chart-3/20 border-2 border-border rounded-base text-xs font-medium opacity-60">
            <Keyboard size={14} /> Arrow Keys or Space
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-2 bg-main transition-all duration-300 z-50 border-t-2 border-border"
        style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }} />
    </div>
  );
}
