import React from 'react';
import { Network, HelpCircle, GitCommit, AlertTriangle } from 'lucide-react';

function HierarchyViewer({ hierarchies }) {
  if (!hierarchies || hierarchies.length === 0) return null;

  // Helper to render tree into string lines
  const renderTreeLines = (nodeId, nodeChildren, prefix = "") => {
    let lines = [];
    lines.push(prefix + nodeId);
    
    const childKeys = Object.keys(nodeChildren);
    childKeys.forEach((childId, index) => {
      const isLastChild = index === childKeys.length - 1;
      const childPrefix = prefix + (isLastChild ? "└── " : "├── ");
      const nextPrefix = prefix + (isLastChild ? "    " : "│   ");
      lines.push(...renderTreeHelper(childId, nodeChildren[childId], childPrefix, nextPrefix));
    });
    return lines;
  };

  const renderTreeHelper = (nodeId, nodeChildren, currentPrefix, nextPrefix) => {
    let lines = [];
    lines.push(currentPrefix + nodeId);
    
    const childKeys = Object.keys(nodeChildren);
    childKeys.forEach((childId, index) => {
      const isLastChild = index === childKeys.length - 1;
      const childPrefix = nextPrefix + (isLastChild ? "└── " : "├── ");
      const nextNextPrefix = nextPrefix + (isLastChild ? "    " : "│   ");
      lines.push(...renderTreeHelper(childId, nodeChildren[childId], childPrefix, nextNextPrefix));
    });
    return lines;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Network className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-200">Reconstructed Components</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {hierarchies.map((h, idx) => {
          const isCycle = h.has_cycle;
          
          return (
            <div 
              key={idx}
              className={`border rounded-2xl bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl shadow-black/25 overflow-hidden transition-all duration-300 ${
                isCycle 
                  ? 'border-rose-500/20 bg-rose-950/5' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-xs font-semibold ${
                    isCycle 
                      ? 'bg-rose-500/20 text-rose-400' 
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    Root: <span className="text-base font-bold ml-1">{h.root}</span>
                  </div>
                  
                  {isCycle ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Cycle Component
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                      Tree Component
                    </span>
                  )}
                </div>

                {!isCycle && (
                  <div className="text-sm font-medium text-slate-400">
                    Depth: <span className="text-indigo-400 font-bold text-base">{h.depth}</span>
                  </div>
                )}
              </div>

              {isCycle ? (
                <div className="flex flex-col gap-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-sm">
                  <p className="font-semibold flex items-center gap-1.5 text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    DFS Loop Detected!
                  </p>
                  <p className="text-xs text-rose-400">
                    This component contains cyclic dependencies, making hierarchical tree representation impossible.
                  </p>
                </div>
              ) : (
                <div className="relative p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 max-h-96 overflow-auto font-mono text-sm leading-relaxed text-slate-300 shadow-inner">
                  <pre className="whitespace-pre">
                    {renderTreeLines(h.root, h.tree[h.root]).join('\n')}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HierarchyViewer;
