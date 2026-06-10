import React, { useState } from 'react';
import GraphInput from './components/GraphInput';
import SummaryCards from './components/SummaryCards';
import HierarchyViewer from './components/HierarchyViewer';
import InvalidEntries from './components/InvalidEntries';
import DuplicateEdges from './components/DuplicateEdges';
import LoadingSpinner from './components/LoadingSpinner';
import { Network, AlertCircle, RefreshCw, User } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend endpoint from environment variables or default to localhost in dev / relative path in prod
  const API_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:3000/api/graph' : '/api/graph');

  const handleGraphSubmit = async (edges) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ edges }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to connect to the backend server. Please verify it is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] bg-radial-at-t from-[#111827] via-[#070b13] to-[#030712] py-8 px-4 sm:px-6 lg:px-8 text-slate-100 flex flex-col justify-between">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Network className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-400">
              SIT Graph Visualizer
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Full Stack Graph Processing & Hierarchy Reconstruction
            </p>
          </div>
        </div>

        {/* Identity Badge */}
        {data && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/25 shadow-inner">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Processed By</div>
              <div className="text-xs font-semibold text-slate-200">{data.user_id}</div>
              <div className="text-[10px] text-slate-400 font-mono">{data.enrollment_number} | {data.email_id}</div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Input & Settings */}
          <div className="lg:col-span-5 space-y-6">
            <GraphInput onSubmit={handleGraphSubmit} isLoading={isLoading} />
            
            {error && (
              <div className="border border-rose-500/30 rounded-2xl bg-rose-950/15 backdrop-blur-xl p-5 shadow-lg shadow-black/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-200 text-sm">Server Communication Error</h4>
                  <p className="text-xs text-rose-400 mt-1 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Output & Visualizations */}
          <div className="lg:col-span-7 space-y-8">
            {isLoading ? (
              <div className="border border-slate-900 rounded-2xl bg-slate-900/10 backdrop-blur-xl p-12">
                <LoadingSpinner />
              </div>
            ) : data ? (
              <>
                {/* Summary Section */}
                <SummaryCards summary={data.summary} />

                {/* Tree Visualizer */}
                <HierarchyViewer hierarchies={data.hierarchies} />

                {/* Warnings / skipped records */}
                {(data.invalid_entries?.length > 0 || data.duplicate_edges?.length > 0) && (
                  <div className="grid grid-cols-1 gap-6 pt-2">
                    <InvalidEntries entries={data.invalid_entries} />
                    <DuplicateEdges edges={data.duplicate_edges} />
                  </div>
                )}
              </>
            ) : (
              <div className="border border-slate-900 border-dashed rounded-3xl bg-slate-900/10 p-16 flex flex-col items-center justify-center text-center shadow-inner">
                <div className="p-4 rounded-full bg-slate-950/30 text-slate-600 mb-4 border border-white/5">
                  <Network className="w-12 h-12 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-300">Awaiting Graph Input</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
                  Provide edge definitions in the left panel and click analyze to compute cycles, components, and render hierarchy structures.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full mt-12 pt-6 border-t border-slate-950 text-center text-xs text-slate-600 font-medium">
        <p>© 2026 SIT Full Stack Engineering Challenge. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
