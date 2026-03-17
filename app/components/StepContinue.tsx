// app/components/StepContinue.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Step, Depth, Lang, ProtoId, Message, ConceptData } from '@/types';
import SettingsModal from '@/app/components/SettingsModal';

interface StepContinueProps {
  topic: string;
  depth: Depth;
  lang: Lang;
  darkMode: boolean;
  navigateTo: (target: Step) => void;
  goBack: () => void;
  history: Step[];
  selectedProto: ProtoId;
  showToast: (msg: string) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  settings: { anthropicKey: string; openaiKey: string; geminiKey: string; maxSessions: number; expiryDate: string; };
  setSettings: (v: any) => void;
  generatedConcepts: Record<string, ConceptData>;
  // Original debate messages (read-only, shown as context)
  messages: Message[];
  // Continue-round messages (separate array)
  continueMessages: Message[];
  setContinueMessages: (v: Message[] | ((prev: Message[]) => Message[])) => void;
  onNewSession: () => void;
}

// Avatar and thread colors — same as StepDebate
const AVATAR_COLORS: Record<string, string> = {
  ML: '#4338ca', DP: '#6d28d9', PS: '#0369a1',
  AC: '#065f46', JK: '#92400e', SM: '#881337',
  MJ: '#1e40af', EV: '#065f46',
};

const THREAD_COLORS: Record<string, string> = {
  ML: '#6366f1', DP: '#8b5cf6', PS: '#0ea5e9',
  AC: '#10b981', JK: '#f59e0b', SM: '#f43f5e',
  MJ: '#3b82f6', EV: '#10b981',
};

const PROTO_NAMES: Record<string, string> = {
  A: 'Minimal Chat UI',
  B: 'Structured Builder',
  C: 'Dashboard View',
};

let msgIdCounter = 1000;
function newMsgId() { return ++msgIdCounter; }

export default function StepContinue({
  topic, depth, lang, darkMode,
  navigateTo, goBack, history,
  selectedProto, showToast,
  showSettings, setShowSettings,
  settings, setSettings,
  generatedConcepts,
  messages,
  continueMessages, setContinueMessages,
  onNewSession,
}: StepContinueProps) {

  const isHe = lang === 'he';
  const dm = darkMode;
  const subtle = dm ? 'text-slate-400' : 'text-slate-500';

  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');
  const [wasStopped, setWasStopped] = useState(false);
  const roundStartIdxRef = useRef(0);

  const [refinedHtml, setRefinedHtml] = useState('');
  const [isGeneratingHtml, setIsGeneratingHtml] = useState(false);

  // Stop flag — ref so it works inside async loops
  const stoppedRef = useRef(false);

  // Bottom anchor for auto-scroll
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [continueMessages]);

  const protoName = selectedProto
    ? (generatedConcepts[selectedProto]?.title || PROTO_NAMES[selectedProto] || selectedProto)
    : 'your selected prototype';

  async function generateRefinedHtml() {
    if (!selectedProto || !generatedConcepts[selectedProto]) return;
    setIsGeneratingHtml(true);
    setRefinedHtml('');
    try {
      const response = await fetch('/api/generate-refined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          lang,
          apiKey: settings.anthropicKey || undefined,
          concept: generatedConcepts[selectedProto],
          refinementMessages: continueMessages
            .filter(m => !m.isConclusion && m.text.trim())
            .map(m => ({ name: m.name, role: m.role, text: m.text })),
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setRefinedHtml(data.html);
    } catch (err) {
      showToast(`Generation failed: ${String(err)}`);
    } finally {
      setIsGeneratingHtml(false);
    }
  }

  function handlePreviewRefined() {
    if (!refinedHtml) return;
    const blob = new Blob([refinedHtml], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  function handleDownloadRefined() {
    if (!refinedHtml) return;
    const blob = new Blob([refinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archai-refined-${selectedProto}-${topic.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Refined HTML downloaded!');
  }

  async function resumeLastQuestion() {
    // Drop the partial messages from the stopped round, then re-run
    setContinueMessages(prev => prev.slice(0, roundStartIdxRef.current));
    setWasStopped(false);
    await runQuestion(lastQuestion);
  }

  async function handleContinue() {
    if (!input.trim() || isRunning) return;
    const question = input.trim();
    setInput('');
    setWasStopped(false);
    await runQuestion(question);
  }

  async function runQuestion(question: string) {
    setLastQuestion(question);
    roundStartIdxRef.current = continueMessages.length;
    setIsRunning(true);
    stoppedRef.current = false;
    setRound(prev => prev + 1);

    try {
      const response = await fetch('/api/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          question,
          lang,
          depth,
          protoName,
          apiKey: settings.anthropicKey || undefined,
          // Send the last 6 messages as context to keep the request lean
          previousMessages: [...messages, ...continueMessages]
            .filter(m => !m.isConclusion)
            .slice(-6)
            .map(m => ({ name: m.name, role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = '';

      while (true) {
        const { done, value } = await reader.read();
        if (stoppedRef.current) break;

        if (value) buffer += decoder.decode(value, { stream: !done });

        const blocks = buffer.split('\n\n');
        buffer = done ? '' : (blocks.pop() || '');

        for (const block of blocks) {
          const eventMatch = block.match(/^event: (\w+)/);
          const dataMatch  = block.match(/\ndata: (.+)/s);
          if (!eventMatch || !dataMatch) continue;

          const event = eventMatch[1];
          let data: any;
          try { data = JSON.parse(dataMatch[1]); } catch { continue; }

          handleSSEEvent(event, data);
        }

        if (done) break;
      }

    } catch (err) {
      showToast(`Error: ${String(err)}`);
    } finally {
      setIsRunning(false);
      if (stoppedRef.current) setWasStopped(true);
    }
  }

  function handleSSEEvent(event: string, data: any) {
    switch (event) {

      case 'agent_start': {
        setContinueMessages(prev => [...prev, {
          id:           newMsgId(),
          name:         data.name,
          role:         data.role,
          model:        data.model,
          initials:     data.initials,
          avatarBg:     data.avatarBg ?? AVATAR_COLORS[data.initials] ?? '#6366f1',
          threadColor:  THREAD_COLORS[data.initials] ?? '#6366f1',
          text:         '',
          streaming:    true,
          visible:      true,
          isConclusion: false,
        }]);
        break;
      }

      case 'token': {
        setContinueMessages(prev => prev.map(m =>
          m.streaming && m.initials === data.initials
            ? { ...m, text: m.text + data.token }
            : m
        ));
        break;
      }

      case 'agent_done': {
        setContinueMessages(prev => prev.map(m =>
          m.streaming ? { ...m, streaming: false } : m
        ));
        break;
      }

      case 'synthesis_start': {
        setContinueMessages(prev => [...prev, {
          id:           newMsgId(),
          name:         'Maya Levi',
          role:         `Orchestrator — Round ${round + 1} Conclusion`,
          model:        'Claude Opus 4.6',
          initials:     'ML',
          avatarBg:     AVATAR_COLORS['ML'],
          threadColor:  THREAD_COLORS['ML'],
          text:         '',
          streaming:    true,
          visible:      true,
          isConclusion: true,
          conclusionTitle: `🎯 Round ${round + 1} Conclusion`,
        }]);
        break;
      }

      case 'synthesis_token': {
        setContinueMessages(prev => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          return [...prev.slice(0, -1), { ...last, text: last.text + data.token }];
        });
        break;
      }

      case 'done': {
        setContinueMessages(prev => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          return [...prev.slice(0, -1), { ...last, streaming: false }];
        });
        setIsRunning(false);
        break;
      }

      case 'error': {
        showToast(`Error: ${data.message}`);
        setIsRunning(false);
        break;
      }
    }
  }

  function renderMessage(msg: Message) {
    if (msg.isConclusion) {
      return (
        <div key={msg.id} className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono text-white"
            style={{ backgroundColor: msg.avatarBg }}
          >
            {msg.initials}
          </div>
          <div className={`flex-1 rounded-xl p-4 ${
            dm
              ? 'bg-indigo-950/40 border border-indigo-500/30'
              : 'bg-indigo-50 border border-indigo-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-sm text-indigo-500">
                {msg.conclusionTitle ?? '🎯 Conclusion'}
              </span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                dm ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>
                Claude Opus 4.6
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              dm ? 'text-slate-300' : 'text-slate-700'
            } ${msg.streaming ? 'after:content-["│"] after:animate-pulse after:text-indigo-500' : ''}`}>
              {msg.text}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id} className="flex gap-3">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono text-white"
          style={{ backgroundColor: msg.avatarBg }}
        >
          {msg.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm">{msg.name}</span>
            <span className={`text-xs ${subtle}`}>{msg.role}</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded ${
              dm ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {msg.model}
            </span>
            {msg.streaming && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                dm ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {isHe ? 'חושב...' : 'thinking...'}
              </span>
            )}
          </div>
          <p className={`text-sm leading-relaxed ${
            dm ? 'text-slate-300' : 'text-slate-700'
          } ${msg.streaming ? 'after:content-["│"] after:animate-pulse after:text-indigo-500' : ''}`}>
            {msg.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir={isHe ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
      <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} settings={settings} setSettings={setSettings} darkMode={dm} lang={lang} showToast={showToast} />

      {/* ---- Top Nav ---- */}
      <nav className={`sticky top-0 z-40 border-b ${dm ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={goBack}
                className={`text-xs px-2.5 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
              >← Back</button>
            )}
            <button onClick={onNewSession} className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold font-mono">A</span>
              </div>
              <span className="font-bold text-sm">ArchAI</span>
            </button>
          </div>

          {/* Center: progress pills */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium">
            {(['Configure', 'Discussion', 'Choose Design', 'Refine']).map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={`px-3 py-1 rounded-full ${
                  i < 3   ? 'bg-emerald-500 text-white' :
                  i === 3  ? 'bg-indigo-600 text-white' :
                  dm ? 'border border-slate-600 text-slate-500' : 'border border-slate-300 text-slate-400'
                }`}>
                  {i + 1} {label}
                </span>
                {i < 3 && <span className={subtle}>›</span>}
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {isRunning && (
              <button
                onClick={() => { stoppedRef.current = true; setIsRunning(false); }}
                className="text-xs px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
              >⏹ Stop</button>
            )}
            <button
              onClick={onNewSession}
              className={`text-xs px-3 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >+ New Session</button>
            <button
              onClick={() => setShowSettings(true)}
              className={`text-xs px-3 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >⚙️</button>
          </div>
        </div>
      </nav>

      {/* ---- Selected prototype badge ---- */}
      {selectedProto && (
        <div className={`border-b px-4 py-2 ${dm ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <span className={`text-xs ${subtle}`}>Selected prototype:</span>
            <span className="text-xs font-semibold text-indigo-500">
              {selectedProto} — {protoName}
            </span>
            <button
              onClick={() => navigateTo('prototypes')}
              className={`text-xs ml-auto ${subtle} hover:text-indigo-500`}
            >Change →</button>
          </div>
        </div>
      )}

      {/* ---- Chat thread ---- */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-1">
            {isHe ? 'המשך את הדיון' : 'Continue the Discussion'}
          </h2>
          <p className={`text-sm ${subtle}`}>
            {isHe
              ? `על בסיס הניתוח של ${topic}`
              : `Based on the analysis of ${topic}`}
          </p>
        </div>

        {/* Continue messages */}
        <div className="space-y-6">
          {continueMessages.length === 0 && (
            <p className={`text-sm ${subtle} text-center py-8`}>
              {isHe
                ? 'שאל שאלת המשך למטה כדי להמשיך את הדיון'
                : 'Ask a follow-up question below to continue the discussion'}
            </p>
          )}

          {continueMessages.map(msg => renderMessage(msg))}

          {wasStopped && lastQuestion && (
            <div className={`flex items-center gap-3 py-3 px-4 rounded-xl border ${dm ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
              <span className={`text-xs flex-1 truncate ${subtle}`}>
                {isHe ? 'הופסק באמצע:' : 'Stopped mid-way:'} <span className={`font-medium ${dm ? 'text-slate-300' : 'text-slate-700'}`}>"{lastQuestion}"</span>
              </span>
              <button
                onClick={resumeLastQuestion}
                className="flex-shrink-0 text-xs px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
              >
                {isHe ? '▶ המשך מכאן' : '▶ Resume'}
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ---- Generate refined HTML panel ---- */}
      {continueMessages.length > 0 && !isRunning && (
        <div className={`border-t px-4 py-3 ${dm ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-100'}`}>
          <div className="max-w-3xl mx-auto">
            {refinedHtml ? (
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${dm ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                <span className="text-emerald-500 text-sm font-semibold flex-1">
                  {isHe ? '✓ HTML חדש מוכן' : '✓ Refined HTML ready'}
                </span>
                <button
                  onClick={handlePreviewRefined}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${dm ? 'border-slate-600 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
                >
                  {isHe ? 'פתח תצוגה' : 'Preview'}
                </button>
                <button
                  onClick={handleDownloadRefined}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${dm ? 'border-slate-600 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
                >
                  ⬇ HTML
                </button>
                <button
                  onClick={() => { setRefinedHtml(''); }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${dm ? 'border-slate-600 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
                >
                  {isHe ? 'צור מחדש' : 'Regenerate'}
                </button>
              </div>
            ) : (
              <button
                onClick={generateRefinedHtml}
                disabled={isGeneratingHtml}
                className={`w-full py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  isGeneratingHtml
                    ? (dm ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 cursor-wait' : 'border-indigo-200 bg-indigo-50 text-indigo-400 cursor-wait')
                    : 'bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                {isGeneratingHtml ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                    {isHe ? 'בונה HTML מעודכן...' : 'Building refined HTML...'}
                  </>
                ) : (
                  isHe ? '⚡ צור HTML מעודכן על בסיס הדיון' : '⚡ Generate Refined HTML from this discussion'
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---- Input bar — sticky at bottom ---- */}
      <div className={`sticky bottom-0 border-t ${dm ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isHe
                ? 'מה תרצה לחקור עוד? (לדוגמה: "איך לטפל בauth flow?")'
                : 'What would you like to explore? (e.g. "How do I handle the auth flow?")'}
              rows={2}
              disabled={isRunning}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none disabled:opacity-50 ${
                dm
                  ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400'
              }`}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleContinue();
              }}
            />
            <button
              onClick={handleContinue}
              disabled={!input.trim() || isRunning}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all self-end"
            >
              {isRunning
                ? '...'
                : isHe ? 'המשך ←' : 'Continue →'}
            </button>
          </div>
          <p className={`text-xs mt-2 ${subtle}`}>
            {isHe ? 'Cmd+Enter לשליחה' : 'Cmd+Enter to send'}
          </p>
        </div>
      </div>
    </div>
  );
}