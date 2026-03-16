// app/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { Step, Depth, Lang, ProtoId, Message } from '../types/index';
import StepInput      from '@/app/components/StepInput';
import StepDebate     from '@/app/components/StepDebate';
import StepPrototypes from '@/app/components/StepPrototypes';
import StepContinue   from '@/app/components/StepContinue';

// The four steps of the ArchAI flow
export type Step = 'input' | 'debate' | 'prototypes' | 'continue';
export type Depth = 'quick' | 'full';
export type Lang = 'en' | 'he';

// A single chat message from an agent
export interface Message {
  id: number;
  name: string;
  role: string;
  model: string;
  initials: string;
  avatarBg: string;
  threadColor: string;
  text: string;
  streaming: boolean;
  visible: boolean;
  isConclusion: boolean;
  conclusionTitle?: string;
}

// The selected prototype (A, B, or C)
export type ProtoId = 'A' | 'B' | 'C' | null;

export default function Home() {
  // ---- Navigation state ----
  const [step, setStep] = useState<Step>('input');
  const [history, setHistory] = useState<Step[]>([]);

  // ---- Session state ----
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState<Depth>('full');
  const [lang, setLang] = useState<Lang>('en');
  const [darkMode, setDarkMode] = useState(false);

  // ---- Debate state ----
  const [messages, setMessages] = useState<Message[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [debateComplete, setDebateComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // ---- Continue (round 2+) state ----
  const [continueMessages, setContinueMessages] = useState<Message[]>([]);

  // ---- Prototype selection ----
  const [selectedProto, setSelectedProto] = useState<ProtoId>(null);

  // ---- Settings ----
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    anthropicKey: '',
    openaiKey: '',
    geminiKey: '',
    maxSessions: 50,
    expiryDate: '',
  });

  // ---- Toast notifications ----
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // ---- Navigation helpers ----
  const navigateTo = useCallback((target: Step) => {
    setHistory(prev => [...prev, step]);
    setStep(target);
  }, [step]);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop()!;
      setStep(last);
      return newHistory;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // ---- Shared props passed down to every step ----
  const sharedProps = {
    topic, setTopic,
    depth, setDepth,
    lang, setLang,
    darkMode, setDarkMode,
    showSettings, setShowSettings,
    settings, setSettings,
    toastMsg, toastVisible, showToast,
    history, navigateTo, goBack,
    selectedProto, setSelectedProto,
  };

  const debateProps = {
    messages, setMessages,
    completedCount, setCompletedCount,
    debateComplete, setDebateComplete,
    isStreaming, setIsStreaming,
  };

  const continueProps = {
    continueMessages, setContinueMessages,
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toastMsg}
        </div>
      )}

      {/* Step routing */}
      {step === 'input' && (
        <StepInput {...sharedProps} />
      )}
      {step === 'debate' && (
        <StepDebate {...sharedProps} {...debateProps} />
      )}
      {step === 'prototypes' && (
        <StepPrototypes {...sharedProps} />
      )}
      {step === 'continue' && (
        <StepContinue {...sharedProps} {...debateProps} {...continueProps} />
      )}
    </div>
  );
}