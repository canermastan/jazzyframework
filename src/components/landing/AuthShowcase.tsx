import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Loader2, CheckCircle } from 'lucide-react';

const highlightCode = (code: string) => {
  // Simple masking strategy to avoid HTML corruption during highlighting
  const strings: string[] = [];
  const maskedCode = code.replace(/"(.*?)"/g, (match) => {
    strings.push(match);
    return `__STR_${strings.length - 1}__`;
  });

  let highlighted = maskedCode
    // Keywords
    .replace(/\b(proc|let|await|if|return|async)\b/g, '<span class="text-chart-3 font-bold">$1</span>')
    // Types
    .replace(/\b(Context|LoginCredentials)\b/g, '<span class="text-chart-4">$1</span>')
    // Functions/Methods
    .replace(/\b(login|body|attempt|json|status|generateToken)\b/g, '<span class="text-chart-2">$1</span>')
    // Comments
    .replace(/(#.*)/g, '<span class="text-gray-500 italic">$1</span>')
    // Symbols
    .replace(/(\{|\}|\(|\)|:|\.|%|\*)/g, '<span class="text-gray-400">$1</span>');

  // Unmask strings
  strings.forEach((str, i) => {
    highlighted = highlighted.replace(`__STR_${i}__`, `<span class="text-chart-1">$1</span>`);
  });

  return highlighted;
};

const AuthShowcase = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Filling, 2: Loading, 3: Success
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const codeSnippet = `proc login(ctx: Context) {.async.} =
  let body = await ctx.body(LoginCredentials)

  # Built-in Auth Helper
  if await ctx.auth.attempt(body.email, body.password):
    return await ctx.json(%*{
      "token": ctx.auth.generateToken(),
      "status": "Authenticated"
    })

  await ctx.status(401).json(%*{"error": "Invalid credentials"})`;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAnimation = async () => {
      // Step 1: Filling
      setStep(1);
      const targetEmail = "developer@jazzy.dev";
      const targetPass ="password123";
      
      for (let i = 0; i <= targetEmail.length; i++) {
        await new Promise(r => setTimeout(r, 50));
        setEmail(targetEmail.slice(0, i));
      }
      for (let i = 0; i <= targetPass.length; i++) {
        await new Promise(r => setTimeout(r, 50));
        setPassword(targetPass.slice(0, i));
      }

      // Step 2: Loading
      timeout = setTimeout(() => {
        setStep(2);
        
        // Step 3: Success
        timeout = setTimeout(() => {
            setStep(3);

            // Step 4: Reset loop
            timeout = setTimeout(() => {
                setStep(0);
                setEmail('');
                setPassword('');
                runAnimation();
            }, 4000);

        }, 1500);
      }, 500);
    };

    // Initial delay
    timeout = setTimeout(runAnimation, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center bg-secondary-background/50 p-8 rounded-base border-2 border-border shadow-shadow">
      {/* Left: Code Snippet */}
      <div className="flex-1 w-full relative group">
        <div className="absolute -top-3 left-4 bg-chart-2 text-white px-3 py-1 rounded-base border-border border-2 text-xs font-bold shadow-sm z-10">
            AuthController.nim
        </div>
        <div className="bg-white dark:bg-black p-6 rounded-base border-2 border-border shadow-sm overflow-hidden h-full min-h-[300px] flex items-center">
            <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                <code dangerouslySetInnerHTML={{ __html: highlightCode(codeSnippet) }} />
            </pre>
        </div>
      </div>

      {/* Right: Visual Animation */}
      <div className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-sm bg-background p-6 rounded-base border-2 border-border shadow-shadow relative overflow-hidden transition-all duration-500">
            {step === 3 ? (
                // Success State
                <div className="flex flex-col items-center justify-center py-10 gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-chart-4 rounded-full border-2 border-border flex items-center justify-center shadow-sm">
                        <Unlock className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-heading font-black">Authenticated</h3>
                        <div className="bg-secondary-background p-3 rounded-base border-2 border-border text-xs font-mono text-left w-full overflow-hidden">
                            <span className="text-chart-2">token:</span> "eyJhbGciOiJIUzI1..."
                        </div>
                    </div>
                </div>
            ) : (
                // Login Form State
                <div className="space-y-6">
                    <div className="text-center">
                         <div className="mx-auto w-12 h-12 bg-chart-3 rounded-full border-2 border-border flex items-center justify-center mb-2 shadow-sm">
                            <Lock className="w-6 h-6 text-black" />
                         </div>
                         <h3 className="text-xl font-heading font-bold">Member Login</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-xs font-bold uppercase text-foreground/70">Email</div>
                            <div className="h-10 w-full rounded-base border-2 border-border bg-white dark:bg-secondary-background px-3 py-2 text-sm flex items-center">
                                {email}<span className={(step === 1 && email.length < 17) ? "animate-pulse border-r-2 border-black h-4 ml-0.5" : "hidden"}></span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-bold uppercase text-foreground/70">Password</div>
                             <div className="h-10 w-full rounded-base border-2 border-border bg-white dark:bg-secondary-background px-3 py-2 text-sm flex items-center">
                                {password.replace(/./g, '•')}<span className={(step === 1 && email.length >= 17) ? "animate-pulse border-r-2 border-black h-4 ml-0.5" : "hidden"}></span>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled 
                        className="h-10 w-full bg-main text-white font-bold rounded-base border-2 border-border shadow-sm flex items-center justify-center gap-2 transition-transform active:translate-y-1"
                    >
                        {step === 2 ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;
