import React from 'react';
import Slide from '../../Slide';
import { ShieldAlert, Gift } from 'lucide-react';

const Slide11: React.FC = () => {
  return (
    <Slide className="bg-red-500/5">
      <div className="flex flex-col space-y-8">
        <h2 className="text-4xl lg:text-6xl font-black font-heading tracking-tight text-center">
          "Ben Siber <span className="text-red-500 italic underline">Güvenlikçiyim</span>, Ben Nasıl Katkıda Bulunabilirim?"
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="p-8 bg-white border-4 border-border shadow-shadow rounded-base space-y-4 relative">
            <div className="flex items-center gap-4 border-b-4 border-red-500 pb-2 mb-4">
               <ShieldAlert className="text-red-500" size={40} />
               <h3 className="text-3xl font-black">Güvenlik Raporlaması</h3>
            </div>
            <p className="text-xl font-bold opacity-70 leading-relaxed">Jazzy daha yeni bir framework. İllaki güvenlik açıkları olacaktır. Bunları bulup raporlayarak büyük bir katkı sağlayabilirsiniz!</p>
          </div>
          
          <div className="p-8 bg-chart-1/20 border-4 border-border shadow-shadow rounded-base space-y-4 rotate-1 relative overflow-hidden">
            <div className="bg-red-500 text-white font-black text-xs uppercase px-3 py-1 inline-block border-2 border-border mb-2">GERÇEK HİKAYE</div>
            <div className="flex items-center gap-4 border-b-4 border-border pb-2 mb-4">
               <Gift className="text-chart-1" size={40} />
               <h3 className="text-3xl font-black text-2xl lg:text-3xl">Bug Bounty Hatırası!</h3>
            </div>
            <p className="text-lg font-bold">
               Kemal Framework'te bulduğum açık sayesinde (RAM ve Diski sömürerek DoS saldırısı yapma imkanı) yapımcılar evime özel bir hatıra hediyesi gönderdi. 
            </p>
            <div className="bg-white/50 p-3 rounded-base border-2 border-border text-xs font-mono">
               Unbounded chunked request body (DoS)
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border-4 border-border shadow-shadow rounded-base mt-8 -rotate-1 text-center">
          <p className="text-3xl font-black italic">
            Bir frameworkte <span className="text-red-500 underline">güvenlik açığı</span> bulmak istemez misiniz?
          </p>
        </div>
      </div>
    </Slide>
  );
};

export default Slide11;
