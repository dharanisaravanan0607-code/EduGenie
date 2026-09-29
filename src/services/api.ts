import {
  QAResult,
  SimplifierResult,
  QuizResult,
  LearningPathResult,
  SummaryResult,
  ArchitectureData,
  AcademicLevel,
} from '../types';

export async function askQuestion(
  question: string,
  academicLevel: AcademicLevel = 'High School',
  subject = 'General'
): Promise<QAResult> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, academicLevel, subject }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: Failed to get answer`);
  }
  return res.json();
}

export async function simplifyConcept(
  concept: string,
  targetLevel = '5-Year-Old',
  context = ''
): Promise<SimplifierResult> {
  const res = await fetch('/api/simplify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, targetLevel, context }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: Failed to simplify concept`);
  }
  return res.json();
}

export async function generateQuiz(
  topicOrText: string,
  numQuestions = 5,
  difficulty = 'Medium',
  academicLevel: AcademicLevel = 'High School'
): Promise<QuizResult> {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topicOrText, numQuestions, difficulty, academicLevel }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: Failed to generate quiz`);
  }
  return res.json();
}

export async function generateLearningPath(
  topic: string,
  currentLevel = 'Beginner',
  targetGoal = 'Master core concepts & build real projects',
  timeCommitment = '5 hours per week',
  durationWeeks = 4
): Promise<LearningPathResult> {
  const res = await fetch('/api/learning-path', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      currentLevel,
      targetGoal,
      timeCommitment,
      durationWeeks,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: Failed to generate learning path`);
  }
  return res.json();
}

export async function summarizePassage(
  passage: string,
  format = 'structured',
  academicLevel: AcademicLevel = 'High School'
): Promise<SummaryResult> {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passage, format, academicLevel }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: Failed to summarize passage`);
  }
  return res.json();
}

export async function getArchitecture(): Promise<ArchitectureData> {
  const res = await fetch('/api/architecture');
  if (!res.ok) {
    throw new Error('Failed to load architecture specs');
  }
  return res.json();
}

export async function synthesizeSpeech(text: string, voice = 'Kore'): Promise<string | null> {
  try {
    const res = await fetch('/api/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.audio || null;
  } catch {
    return null;
  }
}
