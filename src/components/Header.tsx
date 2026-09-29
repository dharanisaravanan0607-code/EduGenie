import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  BrainCircuit,
  Compass,
  FileText,
  Volume2,
  VolumeX,
  Cpu,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { AcademicLevel } from '../types';
import { audioPlayer } from '../services/tts';

interface HeaderProps {
  activeTab: 'qa' | 'simplify' | 'quiz' | 'path' | 'summarize';
  setActiveTab: (tab: 'qa' | 'simplify' | 'quiz' | 'path' | 'summarize') => void;
  academicLevel: AcademicLevel;
  setAcademicLevel: (level: AcademicLevel) => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  academicLevel,
  setAcademicLevel,
  onOpenArchitecture,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const tabs = [
    { id: 'qa', label: 'Smart Q&A', icon: HelpCircle, badge: 'Scenario 1' },
    { id: 'simplify', label: 'Concept Simplifier', icon: BrainCircuit, badge: 'ELI5' },
    { id: 'quiz', label: 'Quiz Master', icon: BookOpen, badge: 'Scenario 2' },
    { id: 'path', label: 'Learning Path', icon: Compass, badge: 'Scenario 3' },
    { id: 'summarize', label: 'Summarizer & Cards', icon: FileText, badge: 'Study' },
  ] as const;

  const academicLevels: AcademicLevel[] = [
    'Elementary',
    'Middle School',
    'High School',
    'Undergraduate',
    'Professional / Lifelong',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-800 via-indigo-900 to-sky-700 bg-clip-text text-transparent">
                  EduGenie
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                  AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Lightweight AI Educational Companion
              </p>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Academic Level Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600 hidden sm:block" />
              <label htmlFor="academic-level-select" className="sr-only">Academic Level</label>
              <select
                id="academic-level-select"
                aria-label="Select Academic Level"
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="bg-transparent font-medium text-slate-700 text-xs focus:outline-hidden cursor-pointer"
              >
                {academicLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Speaking Status / Stop Audio */}
            {isSpeaking && (
              <button
                onClick={() => audioPlayer.stop()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium animate-pulse cursor-pointer hover:bg-amber-100"
                title="Stop Audio Readout"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            {/* Architecture / Specs Button */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-medium transition-colors cursor-pointer"
              title="System Specs, Epics & Architecture"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Specs & Epics</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono hidden sm:inline">
                M1 / 4GB
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-1 py-2 border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
