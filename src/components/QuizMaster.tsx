import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lightbulb,
  FileQuestion,
  GraduationCap,
  Trophy,
} from 'lucide-react';
import { AcademicLevel, QuizQuestion, QuizResult } from '../types';
import { generateQuiz } from '../services/api';

interface QuizMasterProps {
  academicLevel: AcademicLevel;
  initialTopic?: string;
  onNavigateToSimplify?: (concept: string) => void;
  onNavigateToPath?: (topic: string) => void;
}

export const QuizMaster: React.FC<QuizMasterProps> = ({
  academicLevel,
  initialTopic = '',
  onNavigateToSimplify,
  onNavigateToPath,
}) => {
  const [topicOrText, setTopicOrText] = useState(initialTopic || 'The Pythagoras Theorem');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizResult | null>(null);

  // Active quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const presets = [
    { label: 'The Pythagoras Theorem', desc: 'Scenario 2: Right-triangle geometry' },
    { label: 'World Oceans & Rivers', desc: 'Marine topography & currents' },
    { label: 'SQL & Database Basics', desc: 'Queries, keys, and joins' },
    { label: 'Cell Biology & Mitosis', desc: 'Cellular division & genetics' },
  ];

  const handleGenerate = async (topicOverride?: string) => {
    const t = topicOverride || topicOrText;
    if (!t.trim()) return;

    setLoading(true);
    setError(null);
    setQuiz(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowHints({});
    setIsFinished(false);

    try {
      const data = await generateQuiz(t.trim(), numQuestions, difficulty, academicLevel);
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    // Only allow selecting if not already answered
    if (selectedAnswers[questionId] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const toggleHint = (questionId: number) => {
    setShowHints((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const total = quiz.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  const scoreInfo = calculateScore();
  const currentQ = quiz?.questions[currentIndex];

  const getBadge = (pct: number) => {
    if (pct === 100) return { title: 'Flawless Mastery!', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (pct >= 80) return { title: 'Excellence Achieved!', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (pct >= 60) return { title: 'Solid Foundation!', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    return { title: 'Keep Practicing!', color: 'text-purple-600 bg-purple-50 border-purple-200' };
  };

  return (
    <div className="space-y-6">
      {/* Generator Configuration Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Interactive Quiz Engine & Knowledge Diagnostic
            </h2>
            <p className="text-xs text-slate-500">
              Generate self-grading quizzes on any topic or text passage • Immediate explanations & targeted hints
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="space-y-4"
        >
          {/* Topic or text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Topic or Source Text:
            </label>
            <input
              type="text"
              value={topicOrText}
              onChange={(e) => setTopicOrText(e.target.value)}
              placeholder="e.g. The Pythagoras Theorem (Scenario 2), Photosynthesis, European History"
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-amber-600 focus:border-amber-600 bg-white"
            />
          </div>

          {/* Settings row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="quiz-questions-select" className="block text-xs font-semibold text-slate-600 mb-1">
                Number of Questions
              </label>
              <select
                id="quiz-questions-select"
                aria-label="Number of Questions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
              >
                <option value={3}>3 Questions (Quick Check)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={8}>8 Questions (In-Depth)</option>
                <option value={10}>10 Questions (Mastery Exam)</option>
              </select>
            </div>

            <div>
              <label htmlFor="quiz-difficulty-select" className="block text-xs font-semibold text-slate-600 mb-1">
                Difficulty Level
              </label>
              <select
                id="quiz-difficulty-select"
                aria-label="Difficulty Level"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
              >
                <option value="Easy">Easy (Conceptual Basics)</option>
                <option value="Medium">Medium (Application & Problem Solving)</option>
                <option value="Hard">Hard (Advanced Reasoning)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !topicOrText.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Crafting Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Sample Quizzes:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopicOrText(p.label);
                  handleGenerate(p.label);
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="font-medium">{p.label}</span>
                <span className="text-[10px] text-slate-400">({p.desc})</span>
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Active Quiz Runner */}
      {quiz && !isFinished && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Header Progress */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/60 to-slate-50 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {quiz.topic}
                </span>
                <span className="text-xs text-slate-500">
                  Question {currentIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{quiz.quizTitle}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-600 block">
                Answered: {Object.keys(selectedAnswers).length}/{quiz.questions.length}
              </span>
              <button
                onClick={() => setIsFinished(true)}
                className="text-xs font-medium text-amber-700 hover:text-amber-900 underline cursor-pointer mt-0.5"
              >
                Finish & View Results
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5">
            <div
              className="bg-amber-500 h-1.5 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Box */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                <span className="text-amber-600 mr-2">Q{currentIndex + 1}.</span>
                {currentQ.questionText}
              </p>
              {currentQ.hint && (
                <button
                  onClick={() => toggleHint(currentQ.id)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer shrink-0"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showHints[currentQ.id] ? 'Hide Hint' : 'Hint'}</span>
                </button>
              )}
            </div>

            {/* Hint Box */}
            {showHints[currentQ.id] && (
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                💡 <span className="font-semibold">Hint:</span> {currentQ.hint}
              </div>
            )}

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                const hasAnswered = selectedAnswers[currentQ.id] !== undefined;
                const isCorrect = idx === currentQ.correctIndex;

                let stateClass =
                  'border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 text-slate-800 bg-white';
                if (hasAnswered) {
                  if (isCorrect) {
                    stateClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                  } else if (isSelected) {
                    stateClass = 'border-red-500 bg-red-50 text-red-950 font-medium';
                  } else {
                    stateClass = 'border-slate-200 text-slate-400 bg-slate-50 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${stateClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          hasAnswered && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : hasAnswered && isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm">{opt}</span>
                    </div>

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation revealed when answered */}
            {selectedAnswers[currentQ.id] !== undefined && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm mt-3 ${
                  selectedAnswers[currentQ.id] === currentQ.correctIndex
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span>
                    {selectedAnswers[currentQ.id] === currentQ.correctIndex
                      ? '✓ Great Job!'
                      : 'ℹ️ Learning Opportunity:'}
                  </span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1))}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsFinished(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Complete Quiz</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Quiz Scorecard */}
      {quiz && isFinished && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="p-6 text-center space-y-3 bg-gradient-to-b from-amber-50/50 to-white">
            <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-700 mb-1">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Quiz Completed!</h3>
            <p className="text-xs text-slate-500">{quiz.quizTitle}</p>

            {/* Big Score Display */}
            <div className="flex items-center justify-center gap-2 my-2">
              <span className="text-4xl font-black text-slate-900">{scoreInfo.percentage}%</span>
              <span className="text-sm text-slate-500 font-medium">
                ({scoreInfo.correct} of {scoreInfo.total} correct)
              </span>
            </div>

            {/* Badge */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                  getBadge(scoreInfo.percentage).color
                }`}
              >
                {getBadge(scoreInfo.percentage).title}
              </span>
            </div>

            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setShowHints({});
                  setCurrentIndex(0);
                  setIsFinished(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              {onNavigateToSimplify && (
                <button
                  onClick={() => onNavigateToSimplify(quiz.topic)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>Simplify {quiz.topic}</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detailed Question Review
            </h4>
            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {idx + 1}. {q.questionText}
                      </p>
                      {isCorrect ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          Correct
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 shrink-0">
                          Incorrect
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs space-y-1">
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-500">Your Answer:</span>{' '}
                        {userAns !== undefined ? q.options[userAns] : 'Not Answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-700 font-medium">
                          <span className="font-semibold">Correct Answer:</span> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-slate-600 pt-1 border-t border-slate-200/60 leading-relaxed">
                        <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
