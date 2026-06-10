import React, { useState } from 'react';
import { Play, FileText, AlertCircle } from 'lucide-react';

function GraphInput({ onSubmit, isLoading }) {
  const [inputText, setInputText] = useState(`A->B\nA->C\nB->D`);
  const [error, setError] = useState(null);

  const handleExample = () => {
    setInputText(`A->B\nA->C\nB->D\nB->E\nC->F\n// Try some duplicates or invalid ones:\nA->B\nhello\n1->2\nG->G\n// Disconnected tree:\nX->Y\n// Multi-parent (will be ignored):\nZ->B`);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    let edges = [];
    const trimmedInput = inputText.trim();

    if (!trimmedInput) {
      setError("Input cannot be empty");
      return;
    }

    try {
      // 1. Try to parse as JSON if it looks like a JSON array
      if (trimmedInput.startsWith('[') && trimmedInput.endsWith(']')) {
        const parsed = JSON.parse(trimmedInput);
        if (Array.isArray(parsed)) {
          edges = parsed.map(item => String(item));
        } else {
          throw new Error("JSON is not an array");
        }
      } else {
        // 2. Otherwise parse line-by-line
        edges = trimmedInput
          .split('\n')
          .map(line => line.trim())
          // Ignore comment lines starting with // or #
          .filter(line => line && !line.startsWith('//') && !line.startsWith('#'));
      }

      if (edges.length === 0) {
        setError("No edges found in the input");
        return;
      }

      onSubmit(edges);
    } catch (err) {
      setError("Invalid JSON format. Check your input or write one edge per line.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-slate-800 rounded-2xl bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl shadow-black/30">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-200">Input Graph Edges</h3>
          <p className="text-xs text-slate-400">Enter edges like 'A-&gt;B' (one per line, or as a JSON array).</p>
        </div>
        <button
          type="button"
          onClick={handleExample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 active:scale-95 transition-all duration-200"
        >
          <FileText className="w-3.5 h-3.5" />
          Load Example
        </button>
      </div>

      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="A->B&#10;A->C&#10;B->D"
          rows="8"
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 resize-y placeholder-slate-700"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-xs text-rose-400 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
      >
        <Play className="w-4 h-4 fill-current" />
        Analyze and Visualize
      </button>
    </form>
  );
}

export default GraphInput;
