import React from 'react';
import { Copy } from 'lucide-react';

function DuplicateEdges({ edges }) {
  if (!edges || edges.length === 0) return null;

  return (
    <div className="border border-amber-500/30 rounded-2xl bg-amber-950/10 backdrop-blur-xl p-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
          <Copy className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-amber-200">Duplicate Edges</h3>
          <p className="text-xs text-amber-400">Duplicate edges that were skipped (only the first occurrence was processed).</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {edges.map((edge, idx) => (
          <span 
            key={idx}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-sm shadow-inner"
          >
            {edge}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DuplicateEdges;
