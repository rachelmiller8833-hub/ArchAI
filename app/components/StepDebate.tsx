// app/components/StepDebate.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Step, Depth, Lang, Message } from '@/types';

interface StepDebateProps {
  // Session
  topic: string;
  depth: Depth;
  lang: Lang;
  darkMode: boolean;
  // Navigation
  navigateTo: (target: Step) => void;
  goBack: () => void;
  history: Step[];
  // Debate state — lives in page.tsx, passed down
  messages: Message[];
  setMessages: (v: Message[] | ((prev: Message[]) => Message[])) => void;
  completedCount: number;
  setCompletedCount: (v: number | ((prev: number) => number)) => void;
  debateComplete: boolean;
  setDebateComplete: (v: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
  // Toast
  showToast: (msg: string) => void;
  // Settings
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  // New session
  onNewSession: () => void;
  // DEMO: pre-loaded messages for demo replay (skip API)
  demoReplayMessages?: Message[]; // DEMO
}

// Avatar colors — one per agent initials
const AVATAR_COLORS: Record<string, string> = {
  ML: '#4338ca',
  DP: '#6d28d9',
  PS: '#0369a1',
  AC: '#065f46',
  JK: '#92400e',
  SM: '#881337',
  MJ: '#1e40af',
  EV: '#065f46',
};

// Thread line colors (the vertical connector between messages)
const THREAD_COLORS: Record<string, string> = {
  ML: '#6366f1',
  DP: '#8b5cf6',
  PS: '#0ea5e9',
  AC: '#10b981',
  JK: '#f59e0b',
  SM: '#f43f5e',
  MJ: '#3b82f6',
  EV: '#10b981',
};

let msgIdCounter = 0;
function newMsgId() { return ++msgIdCounter; }

export default function StepDebate({
  topic, depth, lang, darkMode,
  navigateTo, goBack, history,
  messages, setMessages,
  completedCount, setCompletedCount,
  debateComplete, setDebateComplete,
  isStreaming, setIsStreaming,
  showToast,
  showSettings, setShowSettings,
  onNewSession,
  demoReplayMessages, // DEMO
}: StepDebateProps) {

  const isHe = lang === 'he';
  const dm = darkMode;
  const subtle = dm ? 'text-slate-400' : 'text-slate-500';

  // Controls whether the stop button actually cancels the stream
  const stoppedRef = useRef(false);

  // Guards against React StrictMode double-invoking the effect
  const debateStartedRef = useRef(false);

  // Typing indicator state
  const [typingVisible, setTypingVisible] = useState(false);
  const [typingInitials, setTypingInitials] = useState('ML');
  const [typingAvatar, setTypingAvatar] = useState('#4338ca');

  // Invalid topic state
  const [invalidTopic, setInvalidTopic] = useState(false);

  // Bottom anchor for auto-scroll
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // Auto-scroll whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingVisible]);

  // Start streaming as soon as this component mounts,
  // but only if the debate hasn't already run (messages is empty)
  useEffect(() => {
    if (!debateStartedRef.current && messages.length === 0 && !debateComplete) {
      debateStartedRef.current = true;
      if (demoReplayMessages && demoReplayMessages.length > 0) { // DEMO
        replayDemoMessages(); // DEMO
      } else { // DEMO
        startDebate();
      } // DEMO
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // DEMO: Animate pre-loaded demo messages one by one without calling the API
  async function replayDemoMessages() { // DEMO
    if (!demoReplayMessages?.length) return; // DEMO
    stoppedRef.current = false; // DEMO
    setIsStreaming(true); // DEMO
    setMessages([]); // DEMO
    setCompletedCount(0); // DEMO
    setDebateComplete(false); // DEMO

    for (let i = 0; i < demoReplayMessages.length; i++) { // DEMO
      const msg = demoReplayMessages[i]; // DEMO
      if (stoppedRef.current) break; // DEMO

      const isSynthesis = msg.role.toLowerCase().includes('synthesis'); // DEMO

      // Show typing indicator for this agent // DEMO
      setTypingVisible(true); // DEMO
      setTypingInitials(msg.initials); // DEMO
      setTypingAvatar(msg.avatarBg); // DEMO

      await new Promise<void>(r => setTimeout(r, isSynthesis ? 1200 : 700)); // DEMO
      if (stoppedRef.current) break; // DEMO

      // Reveal the full message instantly // DEMO
      setTypingVisible(false); // DEMO
      setMessages(prev => [...prev, { ...msg, streaming: false }]); // DEMO
      if (!isSynthesis) setCompletedCount(prev => prev + 1); // DEMO

      // Brief pause between messages // DEMO
      if (i < demoReplayMessages.length - 1) { // DEMO
        await new Promise<void>(r => setTimeout(r, 350)); // DEMO
      } // DEMO
    } // DEMO

    if (!stoppedRef.current) { // DEMO
      setTypingVisible(false); // DEMO
      setDebateComplete(true); // DEMO
    } // DEMO
    setIsStreaming(false); // DEMO
  } // DEMO

  async function startDebate() {
    stoppedRef.current = false;
    setIsStreaming(true);
    setMessages([]);
    setCompletedCount(0);
    setDebateComplete(false);

    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, depth, lang }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (stoppedRef.current) break;

        if (value) buffer += decoder.decode(value, { stream: !done });

        // SSE events are separated by double newlines
        const blocks = buffer.split('\n\n');
        buffer = done ? '' : (blocks.pop() || '');

        for (const block of blocks) {
          const eventMatch = block.match(/^event: (\w+)/);
          const dataMatch  = block.match(/\ndata: (.+)/s);
          if (!eventMatch || !dataMatch) continue;

          const event = eventMatch[1];
          const data  = JSON.parse(dataMatch[1]);

          handleSSEEvent(event, data);
        }

        if (done) break;
      }

    } catch (err) {
      showToast(`Error: ${String(err)}`);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSSEEvent(event: string, data: any) {
    switch (event) {

      case 'agent_start': {
        // Hide typing indicator and add a new empty message for this agent
        setTypingVisible(false);
        setMessages(prev => [...prev, {
          id:          newMsgId(),
          name:        data.name,
          role:        data.role,
          model:       data.model,
          initials:    data.initials,
          avatarBg:    data.avatarBg ?? AVATAR_COLORS[data.initials] ?? '#6366f1',
          threadColor: THREAD_COLORS[data.initials] ?? '#6366f1',
          text:        '',
          streaming:   true,
          visible:     true,
          isConclusion: false,
        }]);
        break;
      }

      case 'token': {
        setMessages(prev => prev.map(m =>
          m.streaming && m.initials === data.initials
            ? { ...m, text: m.text + data.token }
            : m
        ));
        break;
      }

      case 'agent_done': {
        // Mark the message as done and increment the progress counter
        setMessages(prev => prev.map(m =>
          m.streaming ? { ...m, streaming: false } : m
        ));
        setCompletedCount(prev => prev + 1);

        // Show typing indicator for the next agent
        setTypingVisible(true);
        break;
      }

      case 'synthesis_start': {
        // Hide typing indicator and add Maya's synthesis message
        setTypingVisible(false);
        setMessages(prev => [...prev, {
          id:          newMsgId(),
          name:        'Maya Levi',
          role:        'Orchestrator — Final Synthesis',
          model:       'Claude Opus 4.6',
          initials:    'ML',
          avatarBg:    AVATAR_COLORS['ML'],
          threadColor: THREAD_COLORS['ML'],
          text:        '',
          streaming:   true,
          visible:     true,
          isConclusion: false,
        }]);
        break;
      }

      case 'synthesis_token': {
        // Append token to Maya's synthesis message
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          return [...prev.slice(0, -1), { ...last, text: last.text + data.token }];
        });
        break;
      }

      case 'done': {
        // Mark the last message (synthesis) as done
        setTypingVisible(false);
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (!last) return prev;
          return [...prev.slice(0, -1), { ...last, streaming: false }];
        });
        setDebateComplete(true);
        setIsStreaming(false);
        break;
      }

      case 'invalid_topic': {
        // Maya rejected the topic — show her message then let the user go back
        setIsStreaming(false);
        setMessages([{
          id:          newMsgId(),
          name:        'Maya Levi',
          role:        'Orchestrator',
          model:       'Claude Haiku 4.5',
          initials:    'ML',
          avatarBg:    AVATAR_COLORS['ML'],
          threadColor: THREAD_COLORS['ML'],
          text:        data.message,
          streaming:   false,
          visible:     true,
          isConclusion: false,
        }]);
        setInvalidTopic(true);
        break;
      }

      case 'error': {
        showToast(`Agent error: ${data.message}`);
        setIsStreaming(false);
        break;
      }
    }
  }

  function stopStreaming() {
    stoppedRef.current = true;
    setIsStreaming(false);
    // debateComplete intentionally NOT set — stopped debates cannot proceed to prototypes
    setTypingVisible(false);
  }

  function exportMd() {
    const lines = [
      `# ArchAI — Architecture Analysis\n`,
      `**Topic:** ${topic}\n`,
      `**Generated:** ${new Date().toISOString()}\n`,
      `---\n`,
      `## Debate Transcript\n`,
    ];
    for (const msg of messages) {
      if (!msg.isConclusion) {
        lines.push(`### ${msg.name} (${msg.role} · ${msg.model})\n`);
        lines.push(`${msg.text}\n`);
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `archai-${topic.replace(/\s+/g, '-').toLowerCase().slice(0, 40)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export downloaded!');
  }

  const agentCount = depth === 'quick' ? 4 : 8;

  return (
    <div dir={isHe ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">

      {/* ---- Top Nav ---- */}
      <nav className={`sticky top-0 z-40 border-b ${dm ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Left: back + logo */}
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
                  i < 1  ? 'bg-emerald-500 text-white' :
                  i === 1 ? 'bg-indigo-600 text-white' :
                  dm ? 'border border-slate-600 text-slate-500' : 'border border-slate-300 text-slate-400'
                }`}>
                  {i + 1} {label}
                </span>
                {i < 3 && <span className={subtle}>›</span>}
              </div>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {isStreaming && (
              <button
                onClick={stopStreaming}
                className="text-xs px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
              >⏹ Stop</button>
            )}
            <button
              onClick={exportMd}
              disabled={messages.length === 0}
              className={`text-xs px-3 py-1.5 rounded-md border disabled:opacity-40 ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >⬇ Export</button>
            <button
              onClick={() => setShowSettings(true)}
              className={`text-xs px-3 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >⚙️</button>
          </div>
        </div>
      </nav>

      {/* ---- Progress bar ---- */}
      <div className={`border-b px-4 py-2 ${dm ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className={`text-xs font-mono ${subtle}`}>
            {completedCount}/{agentCount} engineers
          </span>
          <div className={`flex-1 h-1.5 rounded-full ${dm ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(completedCount / agentCount) * 100}%` }}
            />
          </div>
          {isStreaming && (
            <span className="text-xs text-indigo-400 font-mono animate-pulse">
              thinking...
            </span>
          )}
        </div>
      </div>

      {/* ---- Chat thread ---- */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div id="chat-container" className="space-y-6">

          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className="flex gap-3"
              style={{ opacity: msg.visible ? 1 : 0, transition: 'opacity 0.3s' }}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono text-white"
                style={{ backgroundColor: msg.avatarBg }}
              >
                {msg.initials}
              </div>

              {/* Message body */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{msg.name}</span>
                  <span className={`text-xs ${subtle}`}>{msg.role}</span>
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${dm ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    {msg.model}
                  </span>
                  {msg.streaming && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${dm ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                      {isHe ? 'חושב...' : 'thinking...'}
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${dm ? 'text-slate-300' : 'text-slate-700'} ${msg.streaming ? 'after:content-["│"] after:animate-pulse after:text-indigo-500' : ''}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typingVisible && (
            <div className="flex gap-3">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono text-white"
                style={{ backgroundColor: typingAvatar }}
              >
                {typingInitials}
              </div>
              <div className="flex items-end gap-1 pb-2 pt-3">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className={`w-2 h-2 rounded-full ${dm ? 'bg-slate-500' : 'bg-slate-400'}`}
                    style={{ animation: `bounce 1s infinite ${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invalid topic — Maya rejected the prompt */}
          {invalidTopic && (
            <div className="text-center pt-4 pb-2 space-y-3">
              <p className={`text-xs ${subtle}`}>
                {isHe ? 'חזור ותאר רעיון תוכנה ברור יותר' : 'Go back and describe a clearer software idea'}
              </p>
              <button
                onClick={goBack}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isHe ? '← חזור לדף הבית' : '← Back to Home'}
              </button>
            </div>
          )}

          {/* Stopped early — block prototypes, offer restart */}
          {!isStreaming && !debateComplete && !invalidTopic && messages.length > 0 && (
            <div className="text-center pt-4 pb-2 space-y-2">
              <p className={`text-xs ${subtle}`}>
                {isHe ? 'הדיון הופסק — הפעל מחדש כדי ליצור אב-טיפוסים' : 'Debate stopped — restart to generate prototypes'}
              </p>
              <button
                onClick={() => {
                  if (demoReplayMessages && demoReplayMessages.length > 0) { // DEMO
                    onNewSession(); // DEMO — demo: go home instead of hitting the API
                  } else { // DEMO
                    debateStartedRef.current = false;
                    setMessages([]);
                    setCompletedCount(0);
                    debateStartedRef.current = true;
                    startDebate();
                  } // DEMO
                }}
                className={`text-xs px-4 py-2 rounded-lg border transition-colors ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
              >
                {isHe ? '↺ התחל מחדש' : '↺ Restart Debate'}
              </button>
            </div>
          )}

          {/* View Prototypes button — shown only when debate ran to completion */}
          {debateComplete && !invalidTopic && (
            <div className="text-center pt-4 pb-2">
              <button
                onClick={() => navigateTo('prototypes')}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isHe ? 'צפה באב-טיפוסים ←' : 'View Prototypes →'}
              </button>
            </div>
          )}

          {/* Bottom anchor for auto-scroll */}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Bounce animation for typing dots */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}