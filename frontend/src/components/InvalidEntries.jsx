import React from 'react';
import { AlertCircle } from 'lucide-react';

function InvalidEntries({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="border border-rose-500/30 rounded-2xl bg-rose-950/10 backdrop-blur-xl p-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-rose-200">Invalid Entries</h3>
          <p className="text-xs text-rose-400">Lines that did not match the uppercase 'X-&gt;Y' pattern or were self-loops.</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, idx) => (
          <span 
            key={idx}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-sm shadow-inner"
          >
            {entry}
          </span>
        ))}
      </div>
    </div>
  );
}

export default InvalidEntries;
