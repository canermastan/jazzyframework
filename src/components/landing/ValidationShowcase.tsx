import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Send, Loader2 } from 'lucide-react';

const highlightCode = (code: string) => {
  // Simple masking strategy to avoid HTML corruption during highlighting
  const strings: string[] = [];
  const maskedCode = code.replace(/"(.*?)"/g, (match) => {
    strings.push(match);
    return `__STR_${strings.length - 1}__`;
  });

  let highlighted = maskedCode
    // Keywords
    .replace(/\b(proc|let|echo|async)\b/g, '<span class="text-chart-3 font-bold">$1</span>')
    // Types
    .replace(/\b(Context)\b/g, '<span class="text-chart-4">$1</span>')
    // Functions/Methods
    .replace(/\b(createPost|validate|getStr)\b/g, '<span class="text-chart-2">$1</span>')
    // Special - validation rules
    .replace(/__STR_[0-9]+__/g, (match) => {
        // We will unmask later, but here we can check if it's the rule string
        // This is a bit hacky but works for this specific visual
        return match;
    })
    // Comments
    .replace(/(#.*)/g, '<span class="text-gray-500 italic">$1</span>')
    // Symbols
    .replace(/(\{|\}|\(|\)|:|\.|%|\*|\[|\])/g, '<span class="text-gray-400">$1</span>');

  // Unmask strings
  strings.forEach((str, i) => {
    let finalStr = str;
    // Highlight validation rules specifically
    if (str.includes("required|min:3") || str.includes("in:draft,published")) {
        finalStr = `<span class="text-chart-1 font-bold">${str.replace(/"/g, '')}</span>`;
        finalStr = `"${finalStr}"`; // Re-wrap quotes
    }
    
    // Default string color for others
    if (!finalStr.includes("span")) {
         finalStr = `<span class="text-chart-1">${str.replace(/"/g, '')}</span>`;
         finalStr = `"${finalStr}"`;
    }

    highlighted = highlighted.replace(`__STR_${i}__`, finalStr);
  });

  return highlighted;
};

const ValidationShowcase = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Typing Invalid, 2: Submitting Invalid, 3: Error, 4: Typing Valid, 5: Submitting Valid, 6: Success
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const part1 = `proc createPost(ctx: Context) {.async.} =
`;
  const part2 = `  let data = ctx.validate(%*{
    "title": "required|min:3",
    "status": "in:draft,published"
  })`;
  const part3 = `
  
  # Logic...
  echo data["title"].getStr`;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAnimation = async () => {
      // Phases
      // 1. Type "Hi" (Invalid)
      setStep(1);
      const invalidInput = "Hi";
      for (let i = 0; i <= invalidInput.length; i++) {
        await new Promise(r => setTimeout(r, 100));
        setTitle(invalidInput.slice(0, i));
      }

      await new Promise(r => setTimeout(r, 400));
      
      // 2. Submit -> Error
      setStep(2); // Loading
      timeout = setTimeout(() => {
         setStep(3); // Error state
         setError("Field 'title' must be at least 3 characters.");
         
         // Wait before correcting
         timeout = setTimeout(async () => {
            setError(null);
            setStep(4);
            // Backspace interaction simulation could go here, but let's just clear and retype for speed
            setTitle(''); 
            
            const validInput = "Hello World";
            for (let i = 0; i <= validInput.length; i++) {
                await new Promise(r => setTimeout(r, 60));
                setTitle(validInput.slice(0, i));
            }
            
            // 3. Submit -> Success
            setStep(5); // Loading
            timeout = setTimeout(() => {
                setStep(6); // Success
                
                // Reset
                timeout = setTimeout(() => {
                    setStep(0);
                    setTitle('');
                    setError(null);
                    runAnimation();
                }, 4000);
            }, 800);

         }, 2000);

      }, 600);
    };

    timeout = setTimeout(runAnimation, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-8 items-center bg-secondary-background/50 p-8 rounded-base border-2 border-border shadow-shadow">
      {/* Left: Code Snippet */}
      <div className="flex-1 w-full relative group">
         <div className="absolute -top-3 left-4 bg-chart-4 text-white px-3 py-1 rounded-base border-border border-2 text-xs font-bold shadow-sm z-10">
            PostController.nim
        </div>
        <div className="bg-white dark:bg-black p-6 rounded-base border-2 border-border shadow-sm overflow-hidden h-full min-h-[300px] flex items-center">
            <pre className="font-mono text-sm leading-relaxed overflow-x-auto w-full">
                <code dangerouslySetInnerHTML={{ __html: highlightCode(part1) }} className="opacity-40 block" />
                <code dangerouslySetInnerHTML={{ __html: highlightCode(part2) }} className="block bg-chart-4/5 -mx-4 px-4 py-1 rounded-sm transition-all duration-300 relative" />
                <code dangerouslySetInnerHTML={{ __html: highlightCode(part3) }} className="opacity-40 block" />
            </pre>
        </div>
      </div>

      {/* Right: Visual Animation */}
      <div className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-sm bg-background p-6 rounded-base border-2 border-border shadow-shadow relative overflow-hidden transition-all duration-500">
             <div className="space-y-6">
                <div className="text-center">
                        <div className={`mx-auto w-12 h-12 rounded-full border-2 border-border flex items-center justify-center mb-2 shadow-sm transition-colors duration-300 ${step === 6 ? 'bg-chart-4' : 'bg-chart-1'}`}>
                        {step === 6 ? <CheckCircle2 className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />}
                        </div>
                        <h3 className="text-xl font-heading font-bold">New Post</h3>
                </div>
                
                {step === 6 ? (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-secondary-background p-4 rounded-base border-2 border-border">
                        <div className="text-xs font-bold text-chart-4 uppercase mb-2">Validated Data Payload</div>
                        <pre className="text-xs font-mono text-foreground/80 overflow-x-auto">
{`{
  "title": "Hello World",
  "status": "draft"
}`}
                        </pre>
                     </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="text-xs font-bold uppercase text-foreground/70">Title</div>
                                <div className="text-xs text-chart-1 font-bold animate-pulse">{part2.match(/required\|min:3/)?.[0]}</div>
                            </div>
                            <div className={`h-10 w-full rounded-base border-2 bg-white dark:bg-secondary-background px-3 py-2 text-sm flex items-center transition-all ${
                                error ? 'border-chart-1 bg-red-50 dark:bg-red-900/10 shake' : 'border-border'
                            }`}>
                                {title}<span className={(step === 1 || step === 4) ? "animate-pulse border-r-2 border-black h-4 ml-0.5" : "hidden"}></span>
                            </div>
                            {error && (
                                <div className="text-xs text-chart-1 font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <AlertCircle className="w-3 h-3" /> {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button 
                    disabled 
                    className={`h-10 w-full font-bold rounded-base border-2 border-border shadow-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                        step === 6 ? 'bg-chart-4 text-white' : 'bg-main text-white'
                    }`}
                >
                    {(step === 2 || step === 5) ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Validating...
                        </>
                    ) : step === 6 ? (
                        "Created!"
                    ) : (
                        <>
                            Submit Post <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationShowcase;
