import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  FileCode,
  Download,
  Printer,
  BookOpen,
  ArrowRight,
  Loader2,
  Check,
  ExternalLink,
  Target,
} from 'lucide-react';
import { LearningPathResult, LearningPhase } from '../types';
import { generateLearningPath } from '../services/api';

interface LearningPathProps {
  initialTopic?: string;
  onNavigateToQuiz?: (topic: string) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  initialTopic = '',
  onNavigateToQuiz,
}) => {
  const [topic, setTopic] = useState(initialTopic || 'SQL (Structured Query Language)');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [targetGoal, setTargetGoal] = useState('Master relational databases, write complex joins & subqueries, and build real-world analytics');
  const [timeCommitment, setTimeCommitment] = useState('5 hours per week');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LearningPathResult | null>(null);

  // Subtopic completion tracking in localStorage
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('edugenie_learning_progress');
      if (saved) {
        setCompletedTopics(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTopicCompleted = (topicKey: string) => {
    const updated = {
      ...completedTopics,
      [topicKey]: !completedTopics[topicKey],
    };
    setCompletedTopics(updated);
    try {
      localStorage.setItem('edugenie_learning_progress', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const presets = [
    {
      topic: 'SQL (Structured Query Language)',
      level: 'Beginner',
      goal: 'Master queries, table joins, indexes & practical database projects (Scenario 3)',
      hours: '5 hours per week',
      weeks: 4,
    },
    {
      topic: 'Python for Data Analysis & AI',
      level: 'Beginner',
      goal: 'Pandas, NumPy, Matplotlib & building prediction models',
      hours: '6 hours per week',
      weeks: 6,
    },
    {
      topic: 'Calculus I & Derivatives',
      level: 'Intermediate',
      goal: 'Master limits, derivatives, chain rule, and optimization problems',
      hours: '4 hours per week',
      weeks: 4,
    },
  ];

  const handleGenerate = async (presetTopic?: string) => {
    const t = presetTopic || topic;
    if (!t.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateLearningPath(
        t.trim(),
        currentLevel,
        targetGoal,
        timeCommitment,
        durationWeeks
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create learning path.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!result) return { completed: 0, total: 0, percentage: 0 };
    let total = 0;
    let completed = 0;
    result.phases.forEach((phase) => {
      phase.topicsToMaster.forEach((t) => {
        total++;
        const key = `${result.title}_${phase.phaseNumber}_${t}`;
        if (completedTopics[key]) {
          completed++;
        }
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const progress = calculateProgress();

  const handleExportMarkdown = () => {
    if (!result) return;
    let md = `# ${result.title}\n\n`;
    md += `**Topic:** ${result.topic}\n`;
    md += `**Target Profile:** ${result.targetAudience}\n`;
    md += `**Estimated Total Study Time:** ${result.totalEstimatedHours}\n\n`;
    md += `## Prerequisites\n${result.prerequisites.map((p) => `- ${p}`).join('\n')}\n\n`;
    md += `## Roadmap Phases\n\n`;

    result.phases.forEach((p) => {
      md += `### Phase ${p.phaseNumber}: ${p.phaseTitle} (${p.estimatedTimeline})\n`;
      md += `*Focus:* ${p.focusDescription}\n\n`;
      md += `**Topics to Master:**\n`;
      p.topicsToMaster.forEach((t) => {
        md += `- [ ] ${t}\n`;
      });
      md += `\n**Hands-on Project:** ${p.handsOnProject}\n`;
      md += `**Milestone Check:** ${p.keyMilestoneCheck}\n\n`;
    });

    md += `## Pro Tips & Best Practices\n${result.bestPracticesAndTips.map((t) => `- ${t}`).join('\n')}\n\n`;
    md += `## Recommended Free Resources\n${result.recommendedFreeResources.map((r) => `- ${r}`).join('\n')}\n`;

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Config Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Personalized Learning Path Recommendations
            </h2>
            <p className="text-xs text-slate-500">
              Structured step-by-step curriculum with timelines, milestone checklists, and hands-on projects.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Learning Subject / Topic:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. SQL, Data Structures, Modern Physics"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-emerald-600 focus:border-emerald-600 bg-white"
              />
            </div>

            <div>
              <label htmlFor="learning-level-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Your Current Starting Level:
              </label>
              <select
                id="learning-level-select"
                aria-label="Your Current Starting Level"
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white font-medium"
              >
                <option value="Beginner">Beginner (Starting from scratch)</option>
                <option value="Intermediate">Intermediate (Know basics, need structure)</option>
                <option value="Advanced">Advanced (Deep mastery & optimization)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Outcome / Goal:
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="What do you want to be able to build or achieve?"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label htmlFor="learning-commitment-select" className="block text-xs font-semibold text-slate-600 mb-1">
                Weekly Time Commitment
              </label>
              <select
                id="learning-commitment-select"
                aria-label="Weekly Time Commitment"
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white font-medium"
              >
                <option value="3 hours per week">3 hours / week (Casual)</option>
                <option value="5 hours per week">5 hours / week (Consistent)</option>
                <option value="10 hours per week">10 hours / week (Accelerated)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Curated Tracks:
              </span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(p.topic);
                    setCurrentLevel(p.level);
                    setTargetGoal(p.goal);
                    setTimeCommitment(p.hours);
                    setDurationWeeks(p.weeks);
                    handleGenerate(p.topic);
                  }}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {p.topic}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Path...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Roadmap Output */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Header Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Personalized Roadmap
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {result.targetAudience}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{result.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Est. Study: {result.totalEstimatedHours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {result.phases.length} Structured Phases
                  </span>
                </div>
              </div>

              {/* Actions & Progress */}
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportMarkdown}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                    title="Copy Roadmap as Markdown"
                  >
                    {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedMarkdown ? 'Copied' : 'Export MD'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                    title="Print Roadmap"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print</span>
                  </button>
                </div>

                {/* Checklist Progress */}
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{progress.completed}</span> of{' '}
                  <span className="font-semibold text-slate-900">{progress.total}</span> topics mastered ({progress.percentage}%)
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {result.prerequisites.length > 0 && (
              <div className="mt-4 pt-3 border-t border-emerald-100/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Prerequisites:
                </span>
                {result.prerequisites.map((req, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                  >
                    {req}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Phase By Phase Timeline */}
          <div className="p-5 sm:p-6 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curriculum Progression & Milestones
            </h4>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {result.phases.map((phase) => (
                <div key={phase.phaseNumber} className="relative pl-10">
                  {/* Phase number bullet */}
                  <div className="absolute left-1.5 top-1 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {phase.phaseNumber}
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h5 className="text-base font-bold text-slate-900">
                        Phase {phase.phaseNumber}: {phase.phaseTitle}
                      </h5>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                        {phase.estimatedTimeline}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {phase.focusDescription}
                    </p>

                    {/* Subtopics interactive checklist */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Topics To Master (Click to Check Off):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phase.topicsToMaster.map((topicItem, tIdx) => {
                          const topicKey = `${result.title}_${phase.phaseNumber}_${topicItem}`;
                          const isDone = !!completedTopics[topicKey];
                          return (
                            <button
                              key={tIdx}
                              type="button"
                              onClick={() => toggleTopicCompleted(topicKey)}
                              className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                              )}
                              <span className={`text-xs ${isDone ? 'line-through text-emerald-800' : ''}`}>
                                {topicItem}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hands-on project card */}
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        <Target className="w-3.5 h-3.5" />
                        <span>Hands-On Phase Project:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium">
                        {phase.handsOnProject}
                      </p>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-1">
                        <span className="font-semibold text-slate-600">Milestone:</span>
                        <span>{phase.keyMilestoneCheck}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips & Resources */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/60">
            {/* Tips */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pro Study Habits & Strategy
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.bestPracticesAndTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Free Resources */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Resources & Sandboxes
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.recommendedFreeResources.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quiz generator link */}
          {onNavigateToQuiz && (
            <div className="p-4 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Want to test your current knowledge of {result.topic}?</span>
              <button
                onClick={() => onNavigateToQuiz(result.topic)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Quiz Me on {result.topic}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
