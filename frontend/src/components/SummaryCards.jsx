import React from 'react';
import { Network, RotateCw, GitFork } from 'lucide-react';

function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      title: "Total Trees",
      value: summary.total_trees,
      description: "Cycle-free hierarchies",
      icon: GitFork,
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
    },
    {
      title: "Total Cycles",
      value: summary.total_cycles,
      description: "Looping components",
      icon: RotateCw,
      color: summary.total_cycles > 0 
        ? "from-amber-500/20 to-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse" 
        : "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Largest Root",
      value: summary.largest_tree_root || "N/A",
      description: "Deepest valid tree",
      icon: Network,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`border rounded-2xl bg-slate-900/60 backdrop-blur-xl p-6 bg-gradient-to-br ${card.color} shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold mt-2 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-medium">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;
