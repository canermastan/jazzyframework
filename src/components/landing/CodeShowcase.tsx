import { useState, useEffect } from "react"
import { Play, Check, Loader2, RefreshCw } from "lucide-react"

const codeSnippet = `
proc get*(ctx: Context) {.async.} = 
  let id = ctx.request.params["id"].parseInt
  let user = user_service.getUser(id)
  if user.isSome:
    ctx.status(200).json(%*(user.get))
  else:
    ctx.status(404).json(%*{"error": "User not found"})
`.trim()

const shortCodeSnippet = `
proc get*(ctx: Context) {.async.} = 
  let id = ctx.request.params["id"].parseInt
  let user = user_service.getUser(id)
  if user.isSome:
    ctx.status(200).json(%*(user.get))
`.trim()

const requestBody = {
  method: "GET",
  url: "/api/users/123",
  headers: {
    "Content-Type": "application/json"
  }
}

const responseBody = {
  status: 200,
  data: {
    id: "123",
    name: "Nim Lang Lover",
    role: "admin",
    status: "legend"
  }
}

const highlightCode = (code: string) => {
  // 1. Mask strings to prevent regex collisions
  const strings: string[] = []
  const masked = code.replace(/"(.*?)"/g, (_, match) => {
    strings.push(match)
    return `__STR_${strings.length - 1}__`
  })

  // 2. Apply highlighting to valid tokens/keywords
  // Order matters! Highlight numbers first to avoid matching numbers in generated HTML classes (e.g. text-chart-5)
  let highlighted = masked
    .replace(/\b(\d+)\b/g, (_, num) => {
       return `<span class="text-chart-3 font-bold">${num}</span>` 
    })
    .replace(/\b(proc|let|if|else)\b/g, '<span class="text-chart-5 font-bold">$1</span>')
    .replace(/\.async\./g, '<span class="text-chart-2 font-bold">.async.</span>')
    .replace(/\b(ctx|parseInt|isSome)\b/g, '<span class="text-chart-4">$1</span>')
    .replace(/\b(Context)\b/g, '<span class="text-chart-3 font-bold">$1</span>')
    .replace(/%\*/g, '<span class="text-chart-1 font-bold">%*</span>')

  // 3. Unmask strings and apply string color
  return highlighted.replace(/__STR_(\d+)__/g, (_, index) => {
     return `<span class="text-chart-3">"${strings[parseInt(index)]}"</span>`
  })
}

export default function CodeShowcase() {
  const [phase, setPhase] = useState<"typing" | "formatted" | "executing" | "result">("typing")
  const [typedCode, setTypedCode] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex >= codeSnippet.length) {
        clearInterval(interval)
        setTimeout(() => setPhase("formatted"), 500)
        return
      }
      setTypedCode(codeSnippet.slice(0, currentIndex + 1))
      currentIndex++
    }, 30) // Typing speed

    return () => clearInterval(interval)
  }, [phase])

  // Auto-execute after formatting
  useEffect(() => {
    if (phase === "formatted") {
      const timeout = setTimeout(() => {
        setPhase("executing")
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [phase])

  // Mock execution delay
  useEffect(() => {
    if (phase === "executing") {
      const timeout = setTimeout(() => {
        setPhase("result")
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [phase])

  const handleReload = () => {
    setPhase("typing")
    setTypedCode("")
  }

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-sm">
      {/* Window Controls */}
      <div className="flex items-center gap-2 p-3 border-2 border-b-0 border-border bg-main rounded-t-base">
        <div className="w-3 h-3 rounded-full bg-white border border-border" />
        <div className="w-3 h-3 rounded-full bg-white border border-border" />
        <div className="w-3 h-3 rounded-full bg-white border border-border" />
        <div className="ml-auto flex items-center gap-3">
          <span className="text-main-foreground font-bold text-xs uppercase tracking-widest">
            {phase === "result" ? "REST Client" : "user_controller.nim"}
          </span>
          <button 
            onClick={handleReload}
            className="text-main-foreground hover:rotate-180 transition-transform duration-500 focus:outline-none"
            title="Restart Animation"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative border-2 border-border bg-secondary-background p-6 rounded-b-base shadow-shadow min-h-[400px] flex flex-col">
        
        {/* Editor View */}
        {(phase === "typing" || phase === "formatted") && (
          <div className="flex-1 relative">
             <pre className="text-foreground whitespace-pre-wrap font-mono">
              <code dangerouslySetInnerHTML={{ 
                __html: highlightCode(typedCode)
               }} />
              {phase === "typing" && showCursor && <span className="border-r-2 border-chart-4 ml-1 animate-pulse">|</span>}
            </pre>
            
            {phase === "formatted" && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
                 <div className="bg-main text-main-foreground px-4 py-2 rounded-base border-2 border-border flex items-center gap-2 animate-bounce cursor-default">
                    Compiling Nim...
                 </div>
              </div>
            )}
          </div>
        )}

        {/* Execution/Result View */}
        {(phase === "executing" || phase === "result") && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Request Block */}
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs font-bold text-foreground/60 uppercase">
                  <span>Incoming Request</span>
                  <div className="h-px bg-border flex-1"></div>
               </div>
               <div className="bg-background border-2 border-border p-3 rounded-base">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-chart-4 text-white px-2 py-0.5 rounded text-xs font-bold border border-border">GET</span>
                     <span className="text-foreground">{requestBody.url}</span>
                  </div>
                  <pre className="text-xs text-foreground/70">{JSON.stringify(requestBody.headers, null, 2)}</pre>
               </div>
            </div>

             {/* Result Block */}
             <div className="space-y-2 flex-1">
               <div className="flex items-center gap-2 text-xs font-bold text-foreground/60 uppercase">
                  <span>Server Response</span>
                  <div className="h-px bg-border flex-1"></div>
               </div>
               
               {phase === "executing" ? (
                 <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-main" />
                 </div>
               ) : (
                 <div className="bg-background border-2 border-border p-3 rounded-base h-full relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-chart-4 text-xs font-bold">
                      <Check className="w-4 h-4" />
                      200 OK
                    </div>
                    <pre className="text-sm text-foreground">
                      <code dangerouslySetInnerHTML={{
                        __html: JSON.stringify(responseBody.data, null, 2)
                          .replace(/"key":/g, '<span class="text-chart-5">"key":</span>')
                          .replace(/"(.*?)":/g, '<span class="text-chart-1">"$1":</span>')
                          .replace(/: "(.*?)"/g, ': <span class="text-chart-3">"$1"</span>')
                      }} />
                    </pre>
                 </div>
               )}
            </div>

          </div>
        )}
        {/* Code PiP View */}
        {phase === "result" && (
           <div className="absolute bottom-4 right-4 w-74 h-auto max-h-32 bg-background border-2 border-border shadow-shadow p-3 rounded-base transition-all duration-300 hover:scale-[1.1] hover:origin-bottom-right hover:z-50 cursor-default group z-20 overflow-hidden hover:max-h-40">
              <div className="flex items-center justify-between mb-2 border-b-2 border-border/50 pb-1">
                 <span className="text-[10px] font-bold uppercase text-main-foreground">Executed Code</span>
                 <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                    <div className="w-2 h-2 rounded-full bg-chart-4"></div>
                 </div>
              </div>
              <pre className="text-[10px] leading-relaxed font-mono text-foreground whitespace-pre overflow-hidden group-hover:overflow-auto h-full pb-4 scrollbar-hide">
                 <code dangerouslySetInnerHTML={{ __html: highlightCode(shortCodeSnippet) }} />
              </pre>
           </div>
        )}
      </div>
    </div>
  )
}
