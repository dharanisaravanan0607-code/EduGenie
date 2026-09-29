import React, { useState } from 'react';
import {
  X,
  Cpu,
  Server,
  Layers,
  CheckCircle2,
  HardDrive,
  Wifi,
  Volume2,
  Code,
  Terminal,
  FileCode,
  Laptop,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'epics' | 'requirements' | 'fastapi' | 'skills'>('epics');

  if (!isOpen) return null;

  const epics = [
    {
      id: 'EPIC-1',
      name: 'Smart Concise Q&A',
      status: 'Implemented',
      desc: 'Ask questions and receive direct, accurate answers with everyday analogies, key statistics, and curious follow-ups.',
      tasks: ['Scenario 1: Oceans & Rivers query engine', 'Contextual multi-level response formatting', 'Direct answer extraction'],
    },
    {
      id: 'EPIC-2',
      name: 'Multi-Level Concept Simplifier',
      status: 'Implemented',
      desc: 'Scaffolded deconstruction of complex STEM and humanities concepts across 5 comprehension tiers.',
      tasks: ['ELI5 to undergrad scaffolding', 'Vivid real-world metaphor generation', 'Common misconceptions vs reality debunking'],
    },
    {
      id: 'EPIC-3',
      name: 'Interactive Quiz Engine',
      status: 'Implemented',
      desc: 'Dynamic MCQ diagnostic test engine with real-time feedback, hints, and mastery review.',
      tasks: ['Scenario 2: Pythagoras Theorem Quiz', 'Real-time option validation & explanations', 'Scorecard and mastery badge calculation'],
    },
    {
      id: 'EPIC-4',
      name: 'Personalized Learning Roadmap',
      status: 'Implemented',
      desc: 'Structured curriculum paths with timelines, topic milestones, and hands-on project briefs.',
      tasks: ['Scenario 3: SQL learning path generation', 'Interactive subtopic completion tracking', 'Markdown export & printable syllabus'],
    },
    {
      id: 'EPIC-5',
      name: 'Passage Summarizer & Flashcards',
      status: 'Implemented',
      desc: 'Educational text compression, definitions glossary, and 3D interactive flashcards.',
      tasks: ['Reading time calculation & word compression', 'Glossary extraction', 'Flip card study mode with mastery tracking'],
    },
    {
      id: 'EPIC-6',
      name: 'Audio-Visual Accessibility & Speech',
      status: 'Implemented',
      desc: 'Voice read-aloud support powered by Gemini TTS with fallback to browser SpeechSynthesis.',
      tasks: ['Gemini TTS voice synthesis API integration', 'Browser Web Speech API fallback', 'Audio study player controls'],
    },
    {
      id: 'EPIC-7',
      name: 'Lightweight Edge & Cloud Runtime',
      status: 'Implemented',
      desc: 'Sub-second response latency optimized for 4GB RAM systems, Apple M1, and standard Intel i5 processors.',
      tasks: ['Full-stack Express/FastAPI proxy architecture', 'Local memory efficiency footprint', 'Responsive multi-device viewport design'],
    },
  ];

  const requirements = [
    {
      title: 'Processor',
      val: 'Intel i5 or equivalent (minimum) / Apple M1 Silicon',
      icon: Cpu,
      detail: 'Ultra-low overhead frontend and backend execution designed for smooth client performance.',
    },
    {
      title: 'RAM',
      val: '4 GB RAM minimum',
      icon: HardDrive,
      detail: 'Lightweight footprint with stream handling and minimal client-side memory footprint.',
    },
    {
      title: 'Storage',
      val: '128 GB SSD or 128 GB HDD',
      icon: HardDrive,
      detail: 'Zero bulky model weights needed on-disk; powered by cloud-accelerated Gemini 3.8 Flash.',
    },
    {
      title: 'Internet Connectivity',
      val: 'High-speed broadband (minimum 10 Mbps)',
      icon: Wifi,
      detail: 'Ensures snappy API responses and instantaneous streaming TTS audio generation.',
    },
    {
      title: 'Audio-Visual Setup',
      val: 'Microphone & Speakers / Headphones',
      icon: Volume2,
      detail: 'Supports interactive speech read-aloud sessions and voice-enabled learning.',
    },
    {
      title: 'Web Browsers',
      val: 'Google Chrome, Microsoft Edge, Firefox, or Safari',
      icon: Laptop,
      detail: 'Modern browser support with HTML5 Audio, LocalStorage, and CSS Flex/Grid standards.',
    },
  ];

  const fastapiCode = `# EduGenie - FastAPI Backend Architecture
# Equivalent Python / FastAPI Implementation for EduGenie
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from google import genai
from google.genai import types

app = FastAPI(title="EduGenie API", version="1.0.0")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class QuestionRequest(BaseModel):
    question: str
    academic_level: str = "High School"
    subject: str = "General"

@app.post("/api/ask")
async def ask_question(req: QuestionRequest):
    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=f"EduGenie Tutor for level {req.academic_level}. Question: {req.question}",
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    return response.text

@app.post("/api/quiz")
async def generate_quiz(topic: str, count: int = 5):
    # Generates structured diagnostic quiz
    ...
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/50 border border-indigo-400/30">
              <Cpu className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">EduGenie System Architecture & Specs</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  7 Epics • 10 Tasks
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Lightweight AI Architecture, Hardware Standards & FastAPI/Cloud Parity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-2 overflow-x-auto">
          {[
            { id: 'epics', label: '7 Project Epics', icon: Layers },
            { id: 'requirements', label: 'System Requirements', icon: HardDrive },
            { id: 'fastapi', label: 'FastAPI / Python Architecture', icon: Code },
            { id: 'skills', label: 'Skills & Stack', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === 'epics' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                EduGenie project breakdown structured across 7 functional epics and 10 production deliverables:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {epics.map((epic) => (
                  <div key={epic.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {epic.id}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {epic.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{epic.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{epic.desc}</p>
                    <div className="pt-1.5 border-t border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Subtasks:
                      </span>
                      <ul className="space-y-0.5 text-[11px] text-slate-600">
                        {epic.tasks.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Official EduGenie Hardware & Runtime Specification for student and developer workstations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {requirements.map((req, idx) => {
                  const Icon = req.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{req.title}</h4>
                      </div>
                      <p className="text-xs font-semibold text-indigo-900">{req.val}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{req.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'fastapi' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                <pre>{fastapiCode}</pre>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <h5 className="font-bold text-slate-900">Full-Stack Parity:</h5>
                <p>
                  EduGenie runs with standard RESTful JSON contracts. It can be hosted with FastAPI in Python environments, or with Express + TypeScript in Node/Vite environments, maintaining 100% interoperability with the same frontend UI.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Technical competencies and frameworks utilized across EduGenie:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gemini 3.8 Flash',
                  'FastAPI & Python',
                  'Express & TypeScript',
                  'Generative AI Prompt Engineering',
                  'HTML5 & Modern CSS',
                  'Tailwind CSS',
                  'Streamlit / Gradio Paradigms',
                  'MySQL / Relational Database Design',
                  'Web Speech API / TTS',
                  'REST API Architecture',
                ].map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200/80 font-medium text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
};
