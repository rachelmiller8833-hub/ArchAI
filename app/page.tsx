// app/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { Step, Depth, Lang, ProtoId, Message, ConceptData } from '../types/index';
import StepInput      from '@/app/components/StepInput';
import StepDebate     from '@/app/components/StepDebate';
import StepPrototypes from '@/app/components/StepPrototypes';
import StepContinue   from '@/app/components/StepContinue';
import { getDemoData } from '@/lib/demoData'; 

// pre-fill topic for testing. Delete this line before shipping.
const DEV_PREFILL_TOPIC = 'Logo builder SaaS — AI-powered logo creation tool';

export default function Home() {
  // ---- Navigation state ----
  const [step, setStep] = useState<Step>('input');
  const [history, setHistory] = useState<Step[]>([]);

  // ---- Session state ----
  const [topic, setTopic] = useState(DEV_PREFILL_TOPIC);
  const [depth, setDepth] = useState<Depth>('full');
  const [lang, setLang] = useState<Lang>('en');
  const [darkMode, setDarkMode] = useState(false);

  // ---- Debate state ----
  const [messages, setMessages] = useState<Message[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [debateComplete, setDebateComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // ---- Prototype ----
  const [generatedConcepts, setGeneratedConcepts] = useState<Record<string, ConceptData>>({});
  const [generatedPrototypes, setGeneratedPrototypes] = useState<Record<string, string>>({});

  // ---- Continue (round 2+) state ----
  const [continueMessages, setContinueMessages] = useState<Message[]>([]);

  const [demoReplayMessages, setDemoReplayMessages] = useState<Message[]>([]); 

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

  // Reset everything and go to the home/input screen
  const onNewSession = useCallback(() => {
    setTopic('');
    setMessages([]);
    setCompletedCount(0);
    setDebateComplete(false);
    setIsStreaming(false);
    setGeneratedConcepts({});
    setGeneratedPrototypes({});
    setSelectedProto(null);
    setContinueMessages([]);
    setDemoReplayMessages([]); 
    setHistory([]);
    setStep('input');
  }, []);

  // Reset debate state and navigate to debate (called when starting a new debate from input)
  const onStartDebate = useCallback(() => {
    setMessages([]);
    setCompletedCount(0);
    setDebateComplete(false);
    setIsStreaming(false);
    setGeneratedConcepts({});
    setGeneratedPrototypes({});
    setSelectedProto(null);
    setContinueMessages([]);
    setDemoReplayMessages([]); // DEMO
    setHistory(prev => [...prev, step]);
    setStep('debate');
  }, [step]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // DEMO: Demo mode — pre-fills topic, navigates to debate, and replays messages without API
  const onDemoSkip = useCallback(() => { // DEMO
    const demo = getDemoData(lang); // DEMO — picks Hebrew or English data based on current lang
    setTopic(demo.topic); // DEMO
    setMessages([]); // DEMO
    setCompletedCount(0); // DEMO
    setDebateComplete(false); // DEMO
    setIsStreaming(false); // DEMO
    setGeneratedConcepts(demo.concepts); // DEMO — pre-load so prototypes page skips API
    setGeneratedPrototypes(demo.prototypes); // DEMO — pre-load so prototypes page skips API
    setSelectedProto(null); // DEMO
    setContinueMessages([]); // DEMO
    setDemoReplayMessages(demo.messages); // DEMO — triggers animated replay in StepDebate
    setHistory(['input']); // DEMO
    setStep('debate'); // DEMO — go to debate page for animated replay
  }, [lang]); // DEMO

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
    generatedConcepts, setGeneratedConcepts,
    generatedPrototypes, setGeneratedPrototypes,
    onNewSession,
  };

  const debateProps = {
    messages, setMessages,
    completedCount, setCompletedCount,
    debateComplete, setDebateComplete,
    isStreaming, setIsStreaming,
    demoReplayMessages, // DEMO
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
        <StepInput {...sharedProps} onStartDebate={onStartDebate} onDemoSkip={onDemoSkip} /* DEMO: onDemoSkip */ />
      )}
      {step === 'debate' && (
        <StepDebate {...sharedProps} {...debateProps} />
      )}
      {step === 'prototypes' && (
        <StepPrototypes {...sharedProps} messages={messages} />
      )}
      {step === 'continue' && (
        <StepContinue {...sharedProps} {...debateProps} {...continueProps} />
      )}
    </div>
  );
}