import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, Trash2, ArrowRight } from 'lucide-react';

const highlightCode = (code: string) => {
  const strings: string[] = [];
  const maskedCode = code.replace(/"(.*?)"/g, (match) => {
    strings.push(match);
    return `__STR_${strings.length - 1}__`;
  });

  let highlighted = maskedCode
    // Numbers
    .replace(/\b(\d+)\b/g, '<span class="text-chart-5">$1</span>')
    // Keywords
    .replace(/\b(await|let|echo)\b/g, '<span class="text-chart-3 font-bold">$1</span>')
    // Objects/Modules
    .replace(/\b(DB|table|insert|where|get|delete)\b/g, '<span class="text-chart-2">$1</span>')
    // Symbols
    .replace(/(\{|\}|\(|\)|:|\.|%|\*|\[|\]|,)/g, '<span class="text-gray-400">$1</span>');

  // Unmask strings
  strings.forEach((str, i) => {
    highlighted = highlighted.replace(`__STR_${i}__`, `<span class="text-chart-1">${str}</span>`);
  });

  return highlighted;
};

const DatabaseShowcase = () => {
  const [phase, setPhase] = useState<'IDLE' | 'INSERT' | 'SELECT' | 'DELETE'>('IDLE');
  
  // Mock Data
  const initialUsers = [
    { id: 1, name: 'Alice Smith', role: 'user' },
    { id: 2, name: 'Bob Jones', role: 'user' },
  ];
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAnimation = async () => {
      // PHASE 1: INSERT
      setPhase('INSERT');
      await new Promise(r => setTimeout(r, 1000)); // Show Code
      
      // Execute Insert
      setUsers(prev => [...prev, { id: 3, name: 'Jane Doe', role: 'admin' }]);
      await new Promise(r => setTimeout(r, 2000)); // Pause to see result

      // PHASE 2: SELECT
      setPhase('SELECT');
      await new Promise(r => setTimeout(r, 1000)); // Show Code
      
      // Execute Select (Visual highlight)
      await new Promise(r => setTimeout(r, 2500)); // Pause

      // PHASE 3: DELETE
      setPhase('DELETE');
      await new Promise(r => setTimeout(r, 1000)); // Show Code
      
      // Execute Delete
      setUsers(prev => prev.filter(u => u.id !== 3));
      await new Promise(r => setTimeout(r, 2000)); // Pause

      // RESET
      setPhase('IDLE');
      setUsers(initialUsers);
      runAnimation(); 
    };

    // Initial Start
    timeout = setTimeout(runAnimation, 100);
    return () => clearTimeout(timeout);
  }, []);

  const getCodeSnippet = () => {
    switch (phase) {
      case 'INSERT':
        return `await DB.table("users").insert(%*{
  "name": "Jane Doe",
  "role": "admin"
})`;
      case 'SELECT':
        return `let users = await DB.table("users")
  .where("role", "admin")
  .get()`;
      case 'DELETE':
        return `await DB.table("users")
  .where("id", 3)
  .delete()`;
      default:
        // Idle showing the table default
        return `await DB.table("users").all()`; 
    }
  };

  const getPhaseColor = () => {
     switch (phase) {
         case 'INSERT': return 'bg-chart-4 text-white'; // Green
         case 'SELECT': return 'bg-chart-3 text-black'; // Yellow
         case 'DELETE': return 'bg-chart-1 text-white'; // Red/Orange
         default: return 'bg-main text-white';
     }
  };

  const getPhaseIcon = () => {
    switch (phase) {
        case 'INSERT': return <Plus className="w-5 h-5" />;
        case 'SELECT': return <Search className="w-5 h-5" />;
        case 'DELETE': return <Trash2 className="w-5 h-5" />;
        default: return <Database className="w-5 h-5" />;
    }
  };

  const getPhaseLabel = () => {
      switch (phase) {
          case 'INSERT': return 'Inserting Data...';
          case 'SELECT': return 'Selecting Admins...';
          case 'DELETE': return 'Deleting Record...';
          default: return 'Database Ready';
      }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center bg-secondary-background/50 p-8 rounded-base border-2 border-border shadow-shadow">
      {/* Left: Dynamic Code Snippet */}
      <div className="flex-1 w-full relative group">
         <div className="absolute -top-3 left-4 bg-chart-3 text-black px-3 py-1 rounded-base border-border border-2 text-xs font-bold shadow-sm z-10">
            DatabaseController.nim
        </div>
        <div className="bg-white dark:bg-black p-6 rounded-base border-2 border-border shadow-sm overflow-hidden h-full min-h-[300px] flex items-center justify-center">
             {/* We use a key to force re-render/animation on phase change */}
            <div key={phase} className="w-full animate-in fade-in slide-in-from-left-4 duration-300">
                 <pre className="font-mono text-sm leading-relaxed overflow-x-auto w-full">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(getCodeSnippet()) }} />
                </pre>
            </div>
        </div>
      </div>

      {/* Right: Visual Table */}
      <div className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-sm bg-background p-6 rounded-base border-2 border-border shadow-shadow relative overflow-hidden transition-all duration-500">
             
             {/* Header / Status Bar */}
             <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-base border-2 border-border bg-white flex items-center justify-center shadow-sm">
                        <Database className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="font-heading font-bold text-lg">users</span>
                </div>
                <div className={`px-3 py-1 rounded-base border-2 border-border text-xs font-bold shadow-sm flex items-center gap-2 transition-colors duration-300 ${getPhaseColor()}`}>
                   {getPhaseIcon()}
                   {getPhaseLabel()}
                </div>
             </div>

             {/* Table Visualization */}
             <div className="border-2 border-border rounded-base overflow-hidden bg-white dark:bg-black">
                <div className="grid grid-cols-3 bg-secondary-background border-b-2 border-border p-2 font-bold text-xs uppercase text-foreground/70">
                    <div>ID</div>
                    <div>Name</div>
                    <div>Role</div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {users.map((user) => {
                        const isNew = phase === 'INSERT' && user.id === 3;
                        const isSelected = phase === 'SELECT' && user.role === 'admin';
                        const isDeleting = phase === 'DELETE' && user.id === 3; // Though it's removed from state, we might want to animate removal. State update handles it instantly here. 
                        
                        // For Delete, visually it disappears instantly in this code structure.
                        // Ideally we'd fade it out, but instant removal works for "Delete".

                        let rowClass = "grid grid-cols-3 p-3 border-b border-border/50 text-sm font-mono transition-all duration-300";
                        if (isNew) rowClass += " bg-chart-4/20 animate-in fade-in slide-in-from-right-4";
                        if (isSelected) rowClass += " bg-chart-3/20 ring-inset ring-2 ring-chart-3";
                        if (phase === 'SELECT' && !isSelected) rowClass += " opacity-30 blur-[1px]";

                        return (
                            <div key={user.id} className={rowClass}>
                                <div>{user.id}</div>
                                <div>{user.name}</div>
                                <div>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${user.role === 'admin' ? 'bg-chart-5/10 text-chart-5 border-chart-5' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {users.length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-400 italic">No records found.</div>
                    )}
                </div>
             </div>
             
             <div className="mt-4 flex justify-between text-xs text-foreground/50 font-mono">
                <span>{users.length} records</span>
                <span>SQLite</span>
             </div>

        </div>
      </div>
    </div>
  );
};

export default DatabaseShowcase;
