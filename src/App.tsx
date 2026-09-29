import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScenarioBanner } from './components/ScenarioBanner';
import { SmartQA } from './components/SmartQA';
import { ConceptSimplifier } from './components/ConceptSimplifier';
import { QuizMaster } from './components/QuizMaster';
import { LearningPath } from './components/LearningPath';
import { Summarizer } from './components/Summarizer';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AcademicLevel } from './types';
import { Sparkles, Cpu, BookOpen, Layers, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'qa' | 'simplify' | 'quiz' | 'path' | 'summarize'>('qa');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('High School');
  const [isArchOpen, setIsArchOpen] = useState(false);

  // Cross-component initial props
  const [qaQuery, setQaQuery] = useState('Which is the largest ocean?');
  const [quizTopic, setQuizTopic] = useState('The Pythagoras Theorem');
  const [pathTopic, setPathTopic] = useState('SQL (Structured Query Language)');
  const [simplifyConcept, setSimplifyConcept] = useState('Quantum Superposition');

  // Trigger Scenario 1: A student wants to know about oceans and rivers uses EduGenie to ask “Which is the largest ocean?”
  const handleTriggerScenario1 = () => {
    setQaQuery('Which is the largest ocean?');
    setActiveTab('qa');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // Trigger Scenario 2: A student wants to know the level of her understanding of “The Pythagoras Theorem” and clicks “Generate Quiz.”
  const handleTriggerScenario2 = () => {
    setQuizTopic('The Pythagoras Theorem');
    setActiveTab('quiz');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // Trigger Scenario 3: A learner exploring SQL requests a learning path which is a structured plan with beginner to advanced topics, timelines, and suggestions.
  const handleTriggerScenario3 = () => {
    setPathTopic('SQL (Structured Query Language)');
    setActiveTab('path');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleNavigateToQuiz = (topic: string) => {
    setQuizTopic(topic);
    setActiveTab('quiz');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleNavigateToPath = (topic: string) => {
    setPathTopic(topic);
    setActiveTab('path');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleNavigateToSimplify = (concept: string) => {
    setSimplifyConcept(concept);
    setActiveTab('simplify');
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Application Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        academicLevel={academicLevel}
        setAcademicLevel={setAcademicLevel}
        onOpenArchitecture={() => setIsArchOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Scenario Banner with instant 1-click test buttons */}
        <ScenarioBanner
          onTriggerScenario1={handleTriggerScenario1}
          onTriggerScenario2={handleTriggerScenario2}
          onTriggerScenario3={handleTriggerScenario3}
        />

        {/* Dynamic Tab Content */}
        <div className="transition-all duration-200">
          {activeTab === 'qa' && (
            <SmartQA
              key={`qa-${qaQuery}`}
              academicLevel={academicLevel}
              initialQuestion={qaQuery}
              onNavigateToQuiz={handleNavigateToQuiz}
              onNavigateToPath={handleNavigateToPath}
            />
          )}

          {activeTab === 'simplify' && (
            <ConceptSimplifier
              key={`sim-${simplifyConcept}`}
              initialConcept={simplifyConcept}
              onNavigateToQuiz={handleNavigateToQuiz}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizMaster
              key={`quiz-${quizTopic}`}
              academicLevel={academicLevel}
              initialTopic={quizTopic}
              onNavigateToSimplify={handleNavigateToSimplify}
              onNavigateToPath={handleNavigateToPath}
            />
          )}

          {activeTab === 'path' && (
            <LearningPath
              key={`path-${pathTopic}`}
              initialTopic={pathTopic}
              onNavigateToQuiz={handleNavigateToQuiz}
            />
          )}

          {activeTab === 'summarize' && (
            <Summarizer
              academicLevel={academicLevel}
              onNavigateToQuiz={handleNavigateToQuiz}
            />
          )}
        </div>
      </main>

      {/* System Specs & Architecture Modal */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 text-slate-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">EduGenie</span>
            <span className="text-slate-400">|</span>
            <span>Lightweight AI Educational Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsArchOpen(true)}
              className="hover:text-indigo-600 font-medium cursor-pointer"
            >
              System Requirements (M1 / 4GB RAM)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsArchOpen(true)}
              className="hover:text-indigo-600 font-medium cursor-pointer"
            >
              7 Epics & 10 Tasks
            </button>
            <span>•</span>
            <span className="text-slate-400">Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
