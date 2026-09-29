import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  CheckCircle,
  RotateCw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { AcademicLevel, SummaryResult, Flashcard } from '../types';
import { summarizePassage } from '../services/api';
import { audioPlayer } from '../services/tts';

interface SummarizerProps {
  academicLevel: AcademicLevel;
  onNavigateToQuiz?: (topic: string) => void;
}

export const Summarizer: React.FC<SummarizerProps> = ({
  academicLevel,
  onNavigateToQuiz,
}) => {
  const [passage, setPassage] = useState('');
  const [format, setFormat] = useState('structured');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Flashcard study mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});

  const samplePassages = [
    {
      title: 'Ocean Ecosystems & Marine Life (Scenario 1 Related)',
      text: `Oceans cover over 70 percent of the Earth's surface and hold roughly 97 percent of the planet's water. The largest of these is the Pacific Ocean, which alone spans more area than all the Earth's landmasses combined, encompassing the Mariana Trench—the deepest point on Earth. Marine ecosystems are divided into distinct zones based on depth and light penetration, including the sunlit photic zone where microscopic phytoplankton produce up to 50 percent of the world's oxygen via photosynthesis. Below lies the twilight mesopelagic zone, the midnight bathypelagic zone, and the abyssal depths, where organisms rely on chemosynthesis near hydrothermal vents rather than solar energy. Ocean currents, such as the Gulf Stream and the Antarctic Circumpolar Current, act as global conveyor belts transporting heat, regulating global climates, and driving weather patterns. Threats including microplastic pollution, ocean acidification caused by elevated atmospheric CO2 absorption, and rising temperatures endanger coral reef ecosystems, which support a quarter of all marine species despite occupying less than one percent of the ocean floor.`,
    },
    {
      title: 'The Pythagoras Theorem & Euclidean Geometry (Scenario 2 Related)',
      text: `In Euclidean geometry, the Pythagoras Theorem is a fundamental relation among the three sides of a right triangle. It states that the area of the square whose side is the hypotenuse (the side opposite the right angle) is equal to the sum of the areas of the squares on the other two sides. In algebraic terms, this is conventionally expressed as a² + b² = c², where c represents the length of the hypotenuse and a and b denote the lengths of the legs. The theorem has over 370 documented geometric and algebraic proofs, ranging from rearrangements constructed by ancient Chinese mathematicians (the Zhoubi Suanjing) to algebraic proofs attributed to James A. Garfield. Beyond basic plane trigonometry, the Pythagorean theorem forms the bedrock of Cartesian distance formulas in two- and three-dimensional coordinate spaces, vector norms in linear algebra, and Einstein's metric tensor formulation in special relativity. Triples of positive integers that satisfy the equation, such as (3, 4, 5) and (5, 12, 13), are known as Pythagorean triples.`,
    },
    {
      title: 'Relational Database Architecture & SQL (Scenario 3 Related)',
      text: `Relational database management systems (RDBMS) are built upon the relational model proposed by E.F. Codd in 1970. In an RDBMS, data is organized into tables—formally called relations—consisting of rows (tuples) and columns (attributes). Structured Query Language (SQL) serves as the standardized domain-specific language for interacting with these systems. SQL commands are categorized into Data Query Language (DQL, e.g., SELECT), Data Manipulation Language (DML, e.g., INSERT, UPDATE, DELETE), Data Definition Language (DDL, e.g., CREATE, ALTER, DROP), and Data Control Language (DCL, e.g., GRANT, REVOKE). Integrity is enforced via primary keys (uniquely identifying tuples) and foreign keys (establishing relationships across tables). Furthermore, transactional durability and consistency are guaranteed through ACID properties: Atomicity (all-or-nothing execution), Consistency (invariants preserved), Isolation (concurrent transactions execute independently), and Durability (committed changes persist through crashes). Query optimization engines translate high-level declarative SQL into relational algebra trees and generate cost-based execution plans utilizing B-tree and hash indexes.`,
    },
  ];

  const handleSummarize = async () => {
    if (!passage.trim() || passage.trim().length < 20) {
      setError('Please provide a passage of at least 20 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await summarizePassage(passage.trim(), format, academicLevel);
      setResult(data);
      setFlashcardIndex(0);
      setIsFlipped(false);
      setMasteredCards({});
    } catch (err: any) {
      setError(err.message || 'Failed to summarize passage.');
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
    const textToSpeak = `Summary of ${result.documentTitle}. Executive Summary: ${result.executiveSummary}. Key Takeaways: ${result.criticalTakeaways.join('. ')}`;
    setIsSpeaking(true);
    audioPlayer.speak(textToSpeak).finally(() => setIsSpeaking(false));
  };

  const handleCopy = () => {
    if (!result) return;
    let text = `# ${result.documentTitle}\n\n`;
    text += `## Executive Summary\n${result.executiveSummary}\n\n`;
    text += `## Key Concepts\n${result.keyConcepts.map((k) => `• ${k.term}: ${k.definition}`).join('\n')}\n\n`;
    text += `## Structured Notes\n`;
    result.structuredSections.forEach((s) => {
      text += `### ${s.heading}\n${s.contentBullets.map((b) => `- ${b}`).join('\n')}\n\n`;
    });
    text += `## Critical Takeaways\n${result.criticalTakeaways.map((t) => `• ${t}`).join('\n')}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCard = result?.studyFlashcards?.[flashcardIndex];

  return (
    <div className="space-y-6">
      {/* Passage Input Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Summarize Large Educational Passages & Study Cards
            </h2>
            <p className="text-xs text-slate-500">
              Transform textbook chapters, research excerpts, and lecture notes into concise summaries, key definitions, and flashcards.
            </p>
          </div>
        </div>

        {/* Preset Sample Passages */}
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Load Sample Passage:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePassages.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPassage(p.text)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <textarea
            rows={6}
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            placeholder="Paste your educational text, article, or lecture notes here (minimum 20 characters)..."
            className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-teal-600 focus:border-teal-600 bg-white leading-relaxed resize-y font-normal"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{passage.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>•</span>
              <label htmlFor="summarizer-format-select" className="sr-only">Format</label>
              <select
                id="summarizer-format-select"
                aria-label="Summarizer Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="structured">Structured Study Guide + Cards</option>
                <option value="bullet_takeaways">Quick Bullet Highlights</option>
                <option value="executive">High-Level Executive Summary</option>
              </select>
            </div>

            <button
              onClick={handleSummarize}
              disabled={loading || passage.trim().length < 20}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Condensing Knowledge...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Summary & Flashcards</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Summary Output */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Header Stats Bar */}
          <div className="p-5 bg-gradient-to-r from-teal-50/70 via-slate-50 to-indigo-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                  Study Digest
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{result.documentTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleListen}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-teal-100/70 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Original Length
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {result.originalWordCount} words
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Summary Length
                </span>
                <span className="font-bold text-teal-700 text-sm">
                  {result.summaryWordCount} words
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Compression
                </span>
                <span className="font-bold text-emerald-700 text-sm">
                  {result.originalWordCount > 0
                    ? Math.round(
                        ((result.originalWordCount - result.summaryWordCount) /
                          result.originalWordCount) *
                          100
                      )
                    : 50}
                  % reduced
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                  Reading Time Saved
                </span>
                <span className="font-bold text-indigo-700 text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~{result.readingTimeMinutes} mins
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-5 sm:p-6 bg-teal-50/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-1.5">
              Core Executive Summary
            </h4>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
              {result.executiveSummary}
            </p>
          </div>

          {/* Key Concepts Definitions */}
          {result.keyConcepts.length > 0 && (
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Concepts & Terminology
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.keyConcepts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1 hover:border-teal-300 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-teal-900 block">
                      {item.term}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structured Sections */}
          <div className="p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Structured Section Breakdowns
            </h4>
            <div className="space-y-4">
              {result.structuredSections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    {sec.heading}
                  </h5>
                  <ul className="space-y-1.5 pl-4 text-xs sm:text-sm text-slate-700">
                    {sec.contentBullets.map((b, bIdx) => (
                      <li key={bIdx} className="list-disc">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Takeaways */}
          <div className="p-5 sm:p-6 bg-slate-50/60 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Critical Takeaways to Remember
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.criticalTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Flashcard Study Mode */}
          {result.studyFlashcards && result.studyFlashcards.length > 0 && currentCard && (
            <div className="p-5 sm:p-6 bg-gradient-to-b from-white to-teal-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Interactive Study Flashcards
                  </h4>
                  <p className="text-xs text-slate-500">
                    Card {flashcardIndex + 1} of {result.studyFlashcards.length} • Click card to flip
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {Object.keys(masteredCards).length} of {result.studyFlashcards.length} Mastered
                </span>
              </div>

              {/* The Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[160px] sm:min-h-[180px] p-6 rounded-2xl bg-white border-2 border-teal-300 hover:border-teal-500 shadow-md flex flex-col justify-between cursor-pointer transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-teal-700">
                    {isFlipped ? 'Answer side' : 'Question side'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-teal-600 group-hover:text-teal-800">
                    <RotateCw className="w-3 h-3" />
                    <span>Click to flip</span>
                  </span>
                </div>

                <div className="my-auto py-2 text-center">
                  <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </p>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  {isFlipped ? 'Tap to see question again' : 'Tap to reveal answer'}
                </div>
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex((prev) => Math.max(prev - 1, 0));
                  }}
                  disabled={flashcardIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    setMasteredCards((prev) => ({
                      ...prev,
                      [flashcardIndex]: !prev[flashcardIndex],
                    }));
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    masteredCards[flashcardIndex]
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {masteredCards[flashcardIndex] ? 'Mastered!' : 'Mark as Mastered'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex((prev) =>
                      Math.min(prev + 1, result.studyFlashcards.length - 1)
                    );
                  }}
                  disabled={flashcardIndex === result.studyFlashcards.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Footer */}
          {onNavigateToQuiz && (
            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Ready to test comprehension of this summary?</span>
              <button
                onClick={() => onNavigateToQuiz(result.documentTitle)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Generate Quiz for this Passage</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
