import React from 'react';
import Slide from '../../Slide';
import { Linkedin, Instagram, Heart, Terminal, Github } from 'lucide-react';
import { Button } from '../../../ui/button';

const Slide12: React.FC = () => {
   return (
      <Slide className="bg-main/10">
         <div className="flex flex-col items-center text-center space-y-8 lg:space-y-10 w-full max-w-4xl mx-auto">
            <div className="bg-main p-4 rounded-full border-4 border-border shadow-shadow animate-pulse text-main-foreground">
               <Terminal size={48} />
            </div>

            <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tight leading-none">
               Teşekkürler!
            </h2>

            <p className="text-xl lg:text-2xl font-black italic opacity-80 max-w-2xl px-4">
               Jazzy ile proje geliştirmeyi düşünen veya soruları olan herkesi bekliyorum.
            </p>

            <div className="w-full space-y-6">
               {/* GitHub - Clickable CTA */}
               <a
                  href="https://github.com/canermastan/jazzy-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-6 bg-main text-black border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-base flex items-center justify-center gap-6 group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden"
               >
                  {/* Click Badge */}
                  <div className="absolute top-0 right-0 p-2 bg-black text-white font-black text-xs border-l-4 border-b-4 border-border group-hover:bg-red-500 transition-colors">
                     TIKLA!
                  </div>

                  <Github size={40} />
                  <div className="text-left">
                     <p className="text-xs font-black opacity-60 uppercase tracking-widest">GitHub Repository</p>
                     <p className="text-2xl lg:text-3xl font-black italic">github.com/canermastan/jazzy-framework</p>
                  </div>
               </a>

               {/* Social Info - Non-clickable Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white border-4 border-border shadow-shadow rounded-base flex items-center gap-4">
                     <div className="bg-[#0077b5] p-3 rounded-full text-white border-2 border-border"><Linkedin size={28} /></div>
                     <div className="text-left">
                        <p className="text-[10px] font-black opacity-40 uppercase">LinkedIn</p>
                        <p className="text-xl font-black leading-tight">caner-mastan</p>
                     </div>
                  </div>

                  <div className="p-5 bg-white border-4 border-border shadow-shadow rounded-base flex items-center gap-4">
                     <div className="bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-3 rounded-full text-white border-2 border-border"><Instagram size={28} /></div>
                     <div className="text-left">
                        <p className="text-[10px] font-black opacity-40 uppercase">Instagram</p>
                        <p className="text-xl font-black leading-tight">canermastan</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-4 flex flex-col items-center gap-4 w-full">
               <a href="https://canermastan.github.io/jazzyframework/" className="w-full max-w-xs">
                  <Button variant="neutral" size="lg" className="w-full text-xl h-14 border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase tracking-tighter">
                     Jazzy Anasayfa
                  </Button>
               </a>
               <div className="flex items-center gap-2 text-sm font-black opacity-50 uppercase tracking-widest italic">
                  Made with <Heart size={16} fill="currentColor" className="text-red-500" /> in Turkey
               </div>
            </div>
         </div>
      </Slide>
   );
};

export default Slide12;
