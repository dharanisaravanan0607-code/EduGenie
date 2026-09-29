import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Compass,
  Lightbulb,
  Info,
  Loader2,
} from 'lucide-react';
import { AcademicLevel, QAResult } from '../types';
import { askQuestion } from '../services/api';
import { audioPlayer } from '../services/tts';

interface SmartQAProps {
  academicLevel: AcademicLevel;
  initialQuestion?: string;
  onNavigateToQuiz?: (topic: string) => void;
  onNavigateToPath?: (topic: string) => void;
}

export const SmartQA: React.FC<SmartQAProps> = ({
  academicLevel,
  initialQuestion = '',
  onNavigateToQuiz,
  onNavigateToPath,
}) => {
  const [question, setQuestion] = useState(initialQuestion || 'Which is the largest ocean?');
  const [subject, setSubject] = useState('Geography & Oceans');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QAResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const presets = [
    { q: 'Which is the largest ocean?', subject: 'Geography & Oceans' },
    { q: 'What is the longest river in the world and why is there a dispute?', subject: 'Earth Science' },
    { q: 'How do plants create oxygen through photosynthesis?', subject: 'Biology' },
    { q: 'Why is the sky blue during the day and red at sunset?', subject: 'Physics' },
    { q: 'What causes earthquakes along tectonic fault lines?', subject: 'Geology' },
  ];

  const handleAsk = async (queryToAsk?: string, subjectToAsk?: string) => {
    const q = queryToAsk || question;
    const sub = subjectToAsk || subject;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await askQuestion(q.trim(), academicLevel, sub);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer. Please check network connection.');
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
    const textToSpeak = `${result.directAnswer}. Here are the details: ${result.detailedExplanation}. An analogy to think about: ${result.realWorldAnalogy}`;
    setIsSpeaking(true);
    audioPlayer.speak(textToSpeak).finally(() => setIsSpeaking(false));
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `EduGenie Q&A Answer:\n\nQuestion: ${question}\n\nDirect Answer: ${result.directAnswer}\n\nExplanation: ${result.detailedExplanation}\n\nKey Facts:\n${result.keyFacts.map((f) => `• ${f}`).join('\n')}\n\nAnalogy: ${result.realWorldAnalogy}\n\nDid You Know: ${result.didYouKnow}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Intro Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Ask Questions & Receive Smart, Concise Answers
              </h2>
              <p className="text-xs text-slate-500">
                Tailored for <span className="font-semibold text-indigo-700">{academicLevel}</span> level • Real-world analogies & verified facts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Geography, Physics"
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Question Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="relative"
        >
          <div className="flex items-center rounded-xl border-2 border-indigo-100 hover:border-indigo-300 focus-within:border-indigo-600 transition-colors bg-white shadow-xs overflow-hidden">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything (e.g. Which is the largest ocean? How do black holes work?)"
              className="w-full px-3 py-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="mr-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Genie</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Quick Prompts:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuestion(p.q);
                setSubject(p.subject);
                handleAsk(p.q, p.subject);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200/80 transition-all cursor-pointer"
            >
              {p.q}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Answer Output */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                Direct Answer
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Academic Level: {academicLevel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleListen}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
                title="Listen to Answer with Voice"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Copy Answer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Direct Answer Box */}
          <div className="p-5 sm:p-6 bg-indigo-50/40">
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {result.directAnswer}
            </p>
          </div>

          {/* Detailed Explanation */}
          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detailed Explanation
            </h3>
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {result.detailedExplanation}
            </div>
          </div>

          {/* Key Facts & Analogy Grid */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/60">
            {/* Key Facts */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Facts & Figures
                </h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.keyFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Analogy & Did You Know */}
            <div className="space-y-4">
              {/* Analogy */}
              <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-amber-800 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Everyday Analogy
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {result.realWorldAnalogy}
                </p>
              </div>

              {/* Did you know */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Did You Know?
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                  {result.didYouKnow}
                </p>
              </div>
            </div>
          </div>

          {/* Follow-up Questions & Next Actions */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Curious Next Steps • Click to Ask
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.suggestedFollowUps.map((fu, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestion(fu);
                      handleAsk(fu);
                    }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 border border-slate-200 transition-colors cursor-pointer group"
                  >
                    <span>{fu}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cross-tool action buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-medium">Continue studying this topic:</span>
              <div className="flex items-center gap-2">
                {onNavigateToQuiz && (
                  <button
                    onClick={() => onNavigateToQuiz(question)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Generate Quiz for this Topic</span>
                  </button>
                )}
                {onNavigateToPath && (
                  <button
                    onClick={() => onNavigateToPath(question)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Create Learning Roadmap</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
