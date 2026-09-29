import React from 'react';
import { HelpCircle, BookOpen, Compass, ArrowRight, Sparkles } from 'lucide-react';

interface ScenarioBannerProps {
  onTriggerScenario1: () => void;
  onTriggerScenario2: () => void;
  onTriggerScenario3: () => void;
}

export const ScenarioBanner: React.FC<ScenarioBannerProps> = ({
  onTriggerScenario1,
  onTriggerScenario2,
  onTriggerScenario3,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white rounded-2xl p-5 sm:p-6 mb-8 shadow-lg shadow-indigo-950/15 border border-indigo-700/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-700/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-400/20 text-sky-200 border border-sky-400/30">
              <Sparkles className="w-3 h-3" /> Core Scenarios
            </span>
            <span className="text-xs text-indigo-200/80">Try instant real-world demos</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Welcome to EduGenie Interactive Studio
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 max-w-2xl mt-0.5">
            Test EduGenie’s generative AI intelligence across three foundational student learning workflows:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {/* Scenario 1 */}
        <button
          onClick={onTriggerScenario1}
          className="group text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-sky-300/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-200">
                Scenario 1 • Q&A
              </span>
              <HelpCircle className="w-4 h-4 text-sky-300" />
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-sky-200 transition-colors">
              “Which is the largest ocean?”
            </p>
            <p className="text-xs text-indigo-200/80 mt-1 line-clamp-2">
              Oceans & Rivers inquiry: direct answer, marine facts, depth comparison, and follow-ups.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-sky-300 group-hover:text-sky-200 mt-3">
            <span>Run Ask Engine</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        {/* Scenario 2 */}
        <button
          onClick={onTriggerScenario2}
          className="group text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-amber-300/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                Scenario 2 • Quiz
              </span>
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
              The Pythagoras Theorem Quiz
            </p>
            <p className="text-xs text-indigo-200/80 mt-1 line-clamp-2">
              Instant 5-question test of right-triangle geometry with instant scoring & hints.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-300 group-hover:text-amber-200 mt-3">
            <span>Generate Quiz</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        {/* Scenario 3 */}
        <button
          onClick={onTriggerScenario3}
          className="group text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-300/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                Scenario 3 • Roadmap
              </span>
              <Compass className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">
              Structured SQL Learning Path
            </p>
            <p className="text-xs text-indigo-200/80 mt-1 line-clamp-2">
              Beginner to advanced topics, timelines, weekly milestones, and practical projects.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-300 group-hover:text-emerald-200 mt-3">
            <span>Generate Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      </div>
    </div>
  );
};
