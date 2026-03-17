// app/components/StepInput.tsx
'use client';

import { useState } from 'react';
import { Step, Depth, Lang } from '@/types';
import SettingsModal from '@/app/components/SettingsModal';

interface StepInputProps {
  topic: string;
  setTopic: (v: string) => void;
  depth: Depth;
  setDepth: (v: Depth) => void;
  lang: Lang;
  setLang: (v: Lang) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  settings: {
    anthropicKey: string;
    openaiKey: string;
    geminiKey: string;
    maxSessions: number;
    expiryDate: string;
  };
  setSettings: (v: any) => void;
  navigateTo: (target: Step) => void;
  showToast: (msg: string) => void;
  history: Step[];
  onNewSession: () => void;
  onStartDebate: () => void;
  onDemoSkip?: () => void; // TO_BE_REMOVED
}

// Template ideas shown as quick-fill buttons
const TEMPLATES = {
  en: ['SaaS Dashboard Tool', 'AI Coding Assistant', 'Marketplace Platform'],
  he: ['לוח SaaS', 'עוזר AI לקוד', 'פלטפורמת מרקטפלייס'],
};

export default function StepInput({
  topic, setTopic,
  depth, setDepth,
  lang, setLang,
  darkMode, setDarkMode,
  showSettings, setShowSettings,
  settings, setSettings,
  navigateTo,
  showToast,
  onNewSession,
  onStartDebate,
  onDemoSkip, // TO_BE_REMOVED
}: StepInputProps) {

  const isHe = lang === 'he';

  // Start the debate — reset state and navigate
  function handleStart() {
    if (!topic.trim()) return;
    onStartDebate();
  }

  // Fill the topic input with a template
  function handleTemplate(t: string) {
    setTopic(t);
  }

  const dm = darkMode;
  const card = dm
    ? 'bg-slate-900 border-slate-700'
    : 'bg-white border-slate-200';
  const input = dm
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400';
  const subtle = dm ? 'text-slate-400' : 'text-slate-500';

  return (
    <div dir={isHe ? 'rtl' : 'ltr'}>

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        setSettings={setSettings}
        darkMode={dm}
        lang={lang}
        showToast={showToast}
      />

      {/* ---- Top Nav ---- */}
      <nav className={`sticky top-0 z-40 border-b ${dm ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <button onClick={onNewSession} className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">A</span>
            </div>
            <span className="font-bold text-sm tracking-tight">ArchAI</span>
            <span className={`hidden sm:block text-xs ml-1 ${subtle}`}>
              {isHe ? 'סיעור מוחות ארכיטקטורה עם AI' : 'AI Architecture Brainstorming'}
            </span>
          </button>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(isHe ? 'en' : 'he')}
              className={`text-xs px-3 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >
              {isHe ? 'EN' : 'עב'}
            </button>
            <button
              onClick={() => setDarkMode(!dm)}
              className={`text-xs px-3 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >
              {dm ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`text-xs px-3 py-1.5 rounded-md border ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >⚙️ Settings</button>
          </div>
        </div>
      </nav>

      {/* ---- Step breadcrumb ---- */}
      <div className={`border-b ${dm ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center gap-2 text-xs font-medium">
          {(['Configure', 'Discussion', 'Choose Design', 'Refine']).map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className={`px-3 py-1 rounded-full ${
                i === 0
                  ? 'bg-indigo-600 text-white'
                  : dm ? 'border border-slate-600 text-slate-500' : 'border border-slate-300 text-slate-400'
              }`}>
                {i + 1} {label}
              </span>
              {i < 3 && <span className={subtle}>›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Main content ---- */}
      <main className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">
            {isHe ? 'מה תרצה לבנות?' : "What do you want to build?"}
          </h1>
          <p className={`text-sm ${subtle}`}>
            {isHe
              ? 'תאר את הרעיון שלך — 8 מהנדסי AI ינתחו אותו'
              : 'Describe your idea — 8 AI engineers will analyze it'}
          </p>
        </div>

        {/* Template buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {TEMPLATES[lang].map(t => (
            <button
              key={t}
              onClick={() => handleTemplate(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                dm
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-400'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-500'
              }`}
            >{t}</button>
          ))}
        </div>

        {/* Topic textarea */}
        {(() => {
          const maxChars = isHe ? 150 : 300;
          const remaining = maxChars - topic.length;
          const pct = topic.length / maxChars;
          const counterColor = pct >= 1
            ? 'text-red-500'
            : pct >= 0.85
              ? 'text-amber-500'
              : subtle;
          return (
            <>
              <textarea
                value={topic}
                onChange={e => { if (e.target.value.length <= maxChars) setTopic(e.target.value); }}
                placeholder={isHe ? 'תאר את רעיון התוכנה שלך בפירוט...' : 'Describe your software idea in detail...'}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none ${input}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleStart();
                }}
              />
              <div className={`flex justify-between text-xs mt-1 mb-6 ${counterColor}`}>
                <span className={subtle}>
                  {isHe ? '⌘↵ להתחלה' : '⌘↵ to start'}
                </span>
                <span>
                  {isHe
                    ? `${remaining} תווים נותרו מתוך ${maxChars}`
                    : `${remaining} / ${maxChars} characters remaining`}
                </span>
              </div>
            </>
          );
        })()}

        {/* Depth selector */}
        {(() => {
          const DEPTH_META: Record<Depth, { label: string; labelHe: string; tokens: string; cost: string; }> = {
            mini:  { label: 'Mini',  labelHe: 'מיני',  tokens: '~14K tokens', cost: '~$0.15' },
            quick: { label: 'Quick', labelHe: 'מהיר', tokens: '~25K tokens', cost: '~$0.30' },
            full:  { label: 'Full',  labelHe: 'מלא',  tokens: '~45K tokens', cost: '~$0.40' },
          };
          const DEPTH_SUB: Record<Depth, { sub: string; subHe: string; }> = {
            mini:  { sub: 'Haiku only · 2 designs', subHe: 'Haiku בלבד · 2 עיצובים' },
            quick: { sub: '4 agents · 3 designs',   subHe: '4 סוכנים · 3 עיצובים'  },
            full:  { sub: '8 agents · 3 designs',   subHe: '8 סוכנים · 3 עיצובים'  },
          };
          return (
            <div className="mb-8">
              <p className={`text-xs font-medium mb-2 ${subtle}`}>
                {isHe ? 'עומק הדיון' : 'Discussion depth'}
              </p>
              <div className="flex gap-2">
                {(['mini', 'quick', 'full'] as Depth[]).map(d => {
                  const active = depth === d;
                  const meta = DEPTH_META[d];
                  const sub = DEPTH_SUB[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setDepth(d)}
                      className={`flex-1 py-2.5 px-2 rounded-xl border transition-all flex flex-col items-center gap-0.5 ${
                        active
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : dm
                            ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs leading-tight">
                        <span className="font-semibold">{isHe ? meta.labelHe : meta.label}</span>
                        <span className={`font-normal ${active ? 'text-indigo-200' : subtle}`}> · {isHe ? sub.subHe : sub.sub}</span>
                      </span>
                      <span className={`text-[10px] font-mono ${active ? 'text-indigo-200' : dm ? 'text-slate-500' : 'text-slate-400'}`}>
                        {meta.cost} · {meta.tokens}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!topic.trim()}
          className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base transition-all shadow-lg shadow-indigo-500/20"
        >
          {isHe ? 'התחל דיון ←' : 'Start Discussion →'}
        </button>

        {/* TO_BE_REMOVED: Demo button — replays full retro games debate then loads pre-built prototypes */}
        {onDemoSkip && ( // TO_BE_REMOVED
          <div className={`mt-4 pt-4 border-t text-center ${dm ? 'border-slate-800' : 'border-slate-100'}`}> {/* TO_BE_REMOVED */}
            <p className={`text-xs mb-2 ${subtle}`}> {/* TO_BE_REMOVED */}
              No API key? Watch a full live demo: {/* TO_BE_REMOVED */}
            </p> {/* TO_BE_REMOVED */}
            <button // TO_BE_REMOVED
              onClick={onDemoSkip} // TO_BE_REMOVED
              className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl border font-medium transition-colors ${dm ? 'border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' : 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-600'}`} // TO_BE_REMOVED
            > {/* TO_BE_REMOVED */}
              ⚡ Watch Demo — Retro Games Site {/* TO_BE_REMOVED */}
            </button> {/* TO_BE_REMOVED */}
            <p className={`text-xs mt-2 ${subtle}`}>Replays the full 8-agent debate, then shows 3 ready-made prototypes</p> {/* TO_BE_REMOVED */}
          </div> // TO_BE_REMOVED
        )} {/* TO_BE_REMOVED */}

        {/* Powered by */}
        <p className={`text-center text-xs mt-6 ${subtle}`}>
          Powered by Claude Opus 4.6 · Sonnet 4.6 · Haiku 4.5 · GPT-5.4 · Gemini 2.5 Pro
        </p>
      </main>
    </div>
  );
}