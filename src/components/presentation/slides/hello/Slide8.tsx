import React from 'react';
import Slide from '../../Slide';
import { Sparkles } from 'lucide-react';

const Slide8: React.FC = () => {
  return (
    <Slide className="bg-main/5">
      <div className="flex flex-col space-y-8 w-full max-w-4xl">
        <h2 className="text-4xl lg:text-6xl font-black font-heading tracking-tight">
          Sadece <span className="text-main italic underline">Birkaç Satır</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1e1e1e] p-8 rounded-base border-4 border-border shadow-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 bg-main text-black font-black text-xs border-l-4 border-b-4 border-border">
              JAZZY API
            </div>
            <pre className="text-lg lg:text-xl font-mono leading-relaxed">
              <code className="block text-white">
                <span className="text-[#c586c0]">proc</span> <span className="text-[#dcdcaa]">getProfile*</span>(<span className="text-[#9cdcfe]">ctx</span>: <span className="text-[#4ec9b0]">Context</span>) =<br />
                &nbsp;&nbsp;<span className="text-[#c586c0]">let</span> <span className="text-[#9cdcfe]">id</span> = <span className="text-[#9cdcfe]">ctx</span>.<span className="text-[#dcdcaa]">param</span>(<span className="text-[#ce9178]">"id"</span>)<br />
                &nbsp;&nbsp;<span className="text-[#c586c0]">let</span> <span className="text-[#9cdcfe]">user</span> = <span className="text-[#4ec9b0]">DB</span>.<span className="text-[#dcdcaa]">table</span>(<span className="text-[#ce9178]">"users"</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span className="text-[#dcdcaa]">where</span>(<span className="text-[#ce9178]">"id"</span>, <span className="text-[#9cdcfe]">id</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span className="text-[#dcdcaa]">first</span>()<br /><br />
                &nbsp;&nbsp;<span className="text-[#9cdcfe]">ctx</span>.<span className="text-[#dcdcaa]">json</span>(<span className="text-[#9cdcfe]">user</span>)
              </code>
            </pre>
          </div>

          <div className="bg-[#1e1e1e] p-6 rounded-base border-4 border-border shadow-shadow relative rotate-1 flex flex-col">
            <div className="absolute top-0 left-0 p-2 bg-chart-1 text-black font-black text-[10px] border-r-2 border-b-2 border-border">
              OUTPUT (JSON)
            </div>
            <pre className="mt-4 text-sm font-mono text-[#4ec9b0] leading-tight">
              <code>
                {`{
  "id": 1,
  "first_name": "Jazzy",
  "last_name": "Framework"
}`}
              </code>
            </pre>
            <div className="mt-auto pt-4 border-t border-white/10 italic text-[10px] text-white/40">
              HTTP 200 OK
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 self-center animate-bounce mt-4">
          <Sparkles className="text-chart-3" size={40} />
          <p className="text-3xl font-black italic">İşte bu kadar basit!</p>
        </div>
      </div>
    </Slide>
  );
};

export default Slide8;
