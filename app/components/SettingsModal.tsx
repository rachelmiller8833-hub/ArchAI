// app/components/SettingsModal.tsx
'use client';

import { useState } from 'react';
import { Lang } from '@/types';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  onSave?: () => void;
  settings: {
    anthropicKey: string;
    openaiKey: string;
    geminiKey: string;
    maxSessions: number;
    expiryDate: string;
  };
  setSettings: (v: any) => void;
  darkMode: boolean;
  lang: Lang;
  showToast: (msg: string) => void;
}

export default function SettingsModal({
  show, onClose, onSave, settings, setSettings, darkMode, lang, showToast,
}: SettingsModalProps) {
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const dm = darkMode;
  const isHe = lang === 'he';
  const subtle = dm ? 'text-slate-400' : 'text-slate-500';
  const card = dm ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const input = dm
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400';

  if (!show) return null;

  function save() {
    onClose();
    showToast(isHe ? 'ההגדרות נשמרו' : 'Settings saved');
    onSave?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden border ${card}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dm ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="font-bold text-base">API Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-lg ${dm ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto">

          <div>
            <h3 className="text-sm font-semibold mb-3">API Keys</h3>
            <div className="space-y-3">

              {/* Anthropic */}
              <div>
                <label className={`text-xs font-medium mb-1 block ${subtle}`}>
                  Anthropic API Key <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type={showAnthropicKey ? 'text' : 'password'}
                    value={settings.anthropicKey}
                    onChange={e => setSettings({ ...settings, anthropicKey: e.target.value })}
                    placeholder="sk-ant-..."
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${input}`}
                  />
                  <button
                    onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                    className={`px-3 py-2 rounded-lg border text-xs ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
                  >
                    {showAnthropicKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className={`text-xs mt-1 ${subtle}`}>Required. Get yours at console.anthropic.com</p>
              </div>

              {/* OpenAI */}
              <div>
                <label className={`text-xs font-medium mb-1 block ${subtle}`}>OpenAI API Key <span className={subtle}>(optional)</span></label>
                <input
                  type="password"
                  value={settings.openaiKey}
                  onChange={e => setSettings({ ...settings, openaiKey: e.target.value })}
                  placeholder="sk-..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${input}`}
                />
              </div>

              {/* Gemini */}
              <div>
                <label className={`text-xs font-medium mb-1 block ${subtle}`}>Gemini API Key <span className={subtle}>(optional)</span></label>
                <input
                  type="password"
                  value={settings.geminiKey}
                  onChange={e => setSettings({ ...settings, geminiKey: e.target.value })}
                  placeholder="AIza..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${input}`}
                />
              </div>
            </div>
          </div>

          <hr className={dm ? 'border-slate-700' : 'border-slate-200'} />

          {/* Usage limits */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Usage Limits</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-xs font-medium mb-1 block ${subtle}`}>Max Sessions</label>
                <input
                  type="number"
                  value={settings.maxSessions}
                  onChange={e => setSettings({ ...settings, maxSessions: Number(e.target.value) })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${input}`}
                />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1 block ${subtle}`}>Expiry Date</label>
                <input
                  type="date"
                  value={settings.expiryDate}
                  onChange={e => setSettings({ ...settings, expiryDate: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${input}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-2 px-6 py-4 border-t ${dm ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border text-sm ${dm ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
          >Cancel</button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
          >Save Settings</button>
        </div>
      </div>
    </div>
  );
}
