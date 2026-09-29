import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Volume2,
  VolumeX,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SimplifierResult } from '../types';
import { simplifyConcept } from '../services/api';
import { audioPlayer } from '../services/tts';

interface ConceptSimplifierProps {
  initialConcept?: string;
  onNavigateToQuiz?: (topic: string) => void;
}

export const ConceptSimplifier: React.FC<ConceptSimplifierProps> = ({
  initialConcept = '',
  onNavigateToQuiz,
}) => {
  const [concept, setConcept] = useState(initialConcept || 'Quantum Superposition');
  const [targetLevel, setTargetLevel] = useState('5-Year-Old');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifierResult | null>(null);
  const [showCheckAnswer, setShowCheckAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const levels = [
    { id: '5-Year-Old', label: 'Like I’m 5 (ELI5)', emoji: '👶' },
    { id: 'Middle Schooler', label: 'Middle School', emoji: '🎒' },
    { id: 'High Schooler', label: 'High School', emoji: '🎓' },
    { id: 'Undergrad Student', label: 'College / Undergrad', emoji: '🏛️' },
    { id: 'Plain English', label: 'Plain English (Everyday)', emoji: '💼' },
  ];

  const presets = [
    'Quantum Superposition',
    'The Pythagoras Theorem',
    'Blockchain & Bitcoin',
    'CRISPR Gene Editing',
    'Photosynthesis',
    'Inflation & Interest Rates',
  ];

  const handleSimplify = async (conceptOverride?: string, levelOverride?: string) => {
    const c = conceptOverride || concept;
    const l = levelOverride || targetLevel;
    if (!c.trim()) return;

    setLoading(true);
    setError(null);
    setShowCheckAnswer(false);
    try {
      const data = await simplifyConcept(c.trim(), l, context);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to simplify concept.');
    } finally {
      setLoading(false);
    }
  };

  const handleListen = () => {
    if (!result) return;
    if (isSpeaking) {
      audioPlayer.stop();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = `${result.title}. In simple terms: ${result.elevatorPitch}. Think of it like this: ${result.metaphorAnalogy}`;
    setIsSpeaking(true);
    audioPlayer.speak(textToSpeak).finally(() => setIsSpeaking(false));
  };

  return (
    <div className="space-y-6">
      {/* Input & Config Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Understand Complex Concepts Through Simplified Explanations
            </h2>
            <p className="text-xs text-slate-500">
              Deconstruct difficult ideas into crystal-clear mental models, relatable metaphors, and step-by-step logic.
            </p>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Target Explanation Level:
          </label>
          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setTargetLevel(lvl.id);
                  if (result) {
                    handleSimplify(concept, lvl.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  targetLevel === lvl.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/70'
                }`}
              >
                <span>{lvl.emoji}</span>
                <span>{lvl.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Concept Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimplify();
          }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Enter any complex concept (e.g. Quantum Superposition, The Doppler Effect)"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-purple-600 focus:border-purple-600 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !concept.trim()}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Simplifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simplify Concept</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Popular Concepts:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setConcept(p);
                  handleSimplify(p);
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Header Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900">
                  {targetLevel} Explanation
                </span>
                <span className="text-xs text-slate-500">EduGenie Concept Breakdown</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{result.title}</h3>
            </div>
            <button
              onClick={handleListen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-purple-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>
          </div>

          {/* Elevator Pitch */}
          <div className="p-5 sm:p-6 bg-purple-50/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1.5">
              The 10-Second Summary
            </h4>
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {result.elevatorPitch}
            </p>
          </div>

          {/* Metaphor & Analogy Card */}
          <div className="p-5 sm:p-6">
            <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/70">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span>The Vivid Metaphor</span>
              </div>
              <p className="text-sm sm:text-base text-amber-950 leading-relaxed">
                {result.metaphorAnalogy}
              </p>
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          <div className="p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Step-by-Step How It Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {result.stepByStepBreakdown.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h5 className="font-semibold text-xs sm:text-sm text-slate-900">
                      {step.title}
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Misconceptions (Myth vs Truth) */}
          {result.commonMisconceptions.length > 0 && (
            <div className="p-5 sm:p-6 space-y-3 bg-slate-50/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Common Misconceptions Debunked
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {result.commonMisconceptions.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">Myth:</span>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium">{item.myth}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Reality:</span>
                        <p className="text-xs sm:text-sm text-slate-700">{item.truth}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real World Applications & Quick Knowledge Check */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Applications */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Where It’s Used In The Real World
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.realWorldApplications.map((app, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Check */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Quick Self-Check</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheckAnswer(!showCheckAnswer)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                >
                  {showCheckAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showCheckAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-900">
                {result.quickKnowledgeCheck.question}
              </p>
              {showCheckAnswer && (
                <div className="p-2.5 rounded-lg bg-white border border-indigo-200 text-xs text-indigo-950 font-medium animate-fadeIn">
                  💡 {result.quickKnowledgeCheck.answer}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Footer */}
          {onNavigateToQuiz && (
            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Ready to test what you just learned?</span>
              <button
                onClick={() => onNavigateToQuiz(result.title)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Generate Quiz on {result.title}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
