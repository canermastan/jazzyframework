import React from 'react';
import Slide from '../../Slide';
import { Users, Globe2, Lightbulb, Heart } from 'lucide-react';

const Slide2: React.FC = () => {
  return (
    <Slide className="bg-chart-2/10">
      <div className="flex flex-col space-y-12">
        <h2 className="text-5xl lg:text-7xl font-black font-heading tracking-tight border-b-8 border-main pb-4 inline-block">
          Neden <span className="text-main">Açık Kaynak?</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="flex items-start gap-4 p-6 bg-white border-4 border-border shadow-shadow rounded-base">
            <div className="bg-chart-3 p-3 rounded-full border-2 border-border">
              <Globe2 size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Küresel İşbirliği</h3>
              <p className="font-bold opacity-70">Dünyanın her yerinden binlerce geliştirici projeye katkı sağlar.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-white border-4 border-border shadow-shadow rounded-base">
            <div className="bg-chart-1 p-3 rounded-full border-2 border-border">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Öğrenme Fırsatı</h3>
              <p className="font-bold opacity-70">Gerçek projelerde tecrübe edinirsiniz, mentorluk alırsınız.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-white border-4 border-border shadow-shadow rounded-base">
            <div className="bg-main/50 p-3 rounded-full border-2 border-border">
              <Lightbulb size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Sürekli Gelişim</h3>
              <p className="font-bold opacity-70">Topluluk desteğiyle projeler hızla evrilir ve iyileşir.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-white border-4 border-border shadow-shadow rounded-base rotate-1">
            <div className="bg-chart-4 p-3 rounded-full border-2 border-border">
              <Heart size={32} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Topluluğun Gücü</h3>
              <p className="font-bold opacity-70">Herkesin sesi duyulur, proje herkes için daha iyi hale gelir.</p>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default Slide2;
