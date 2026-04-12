import React from 'react';

// Import slides for 'test' presentation from the specific folder
import TestSlide1 from './slides/test/Slide1';
import TestSlide2 from './slides/test/Slide2';
import TestSlide3 from './slides/test/Slide3';

// Import slides for 'hello' presentation
import HelloSlide1 from './slides/hello/Slide1';
import HelloSlide2 from './slides/hello/Slide2';
import HelloSlide3 from './slides/hello/Slide3';
import HelloSlide4 from './slides/hello/Slide4';
import HelloSlide5 from './slides/hello/Slide5';
import HelloSlide6 from './slides/hello/Slide6';
import HelloSlide7 from './slides/hello/Slide7';
import HelloSlide8 from './slides/hello/Slide8';
import HelloSlide9 from './slides/hello/Slide9';
import HelloSlide10 from './slides/hello/Slide10';
import HelloSlide11 from './slides/hello/Slide11';
import HelloSlide12 from './slides/hello/Slide12';

export const PRESENTATIONS: Record<string, React.ComponentType[]> = {
  test: [TestSlide1, TestSlide2, TestSlide3],
  hello: [
    HelloSlide1, 
    HelloSlide2, 
    HelloSlide3, 
    HelloSlide4, 
    HelloSlide5, 
    HelloSlide6,
    HelloSlide7,
    HelloSlide8,
    HelloSlide9,
    HelloSlide10,
    HelloSlide11,
    HelloSlide12
  ],
};

export type PresentationId = keyof typeof PRESENTATIONS;
