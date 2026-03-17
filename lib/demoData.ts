// lib/demoData.ts
// TO_BE_REMOVED: This entire file is hardcoded demo data for testing without spending API credits.
// TO_BE_REMOVED: Delete this file before shipping to production.

import { Message, ConceptData } from '@/types';

// TO_BE_REMOVED: Pre-filled topic for the retro games demo
export const DEMO_TOPIC = 'I want to build a site with old games like Dave, I want to have the option to download the game to .exe file for running it in offline mode.'; // TO_BE_REMOVED

// TO_BE_REMOVED: Hardcoded concepts extracted from the demo debate
export const DEMO_CONCEPTS: Record<string, ConceptData> = { // TO_BE_REMOVED
  A: { // TO_BE_REMOVED
    id: 'A', // TO_BE_REMOVED
    title: 'Arcade Vault', // TO_BE_REMOVED
    description: 'A premium curated library of classic DOS and early Windows games. Users browse by era, genre, or nostalgia factor. Each game page has screenshots, historical context, and one-click browser play or .exe download with a built-in launcher.', // TO_BE_REMOVED
    ux: 'Netflix-style browsing with a game card grid, hover-to-preview, instant-play overlay, and a My Library section for saved games and cloud progress.', // TO_BE_REMOVED
    visual: 'Dark gaming aesthetic with neon green accents, large game art thumbnails, retro-inspired typography for game titles but clean modern UI for navigation.', // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  B: { // TO_BE_REMOVED
    id: 'B', // TO_BE_REMOVED
    title: 'RetroLauncher', // TO_BE_REMOVED
    description: 'A desktop-first game manager that mimics modern launchers (Steam/Epic) but for retro titles. The website is primarily a download portal for the Windows client app, which manages game installations, updates, and .exe creation.', // TO_BE_REMOVED
    ux: 'Sidebar navigation between Library, Store, and Community. Game cards show install status. One-click install creates a proper .exe shortcut on the desktop.', // TO_BE_REMOVED
    visual: 'Deep navy and purple color scheme inspired by modern gaming platforms. Game covers as large tiles, status badges (Installed, Update Available, New), minimal chrome.', // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  C: { // TO_BE_REMOVED
    id: 'C', // TO_BE_REMOVED
    title: 'DOS Nostalgia Hub', // TO_BE_REMOVED
    description: 'A community-first platform where retro gaming fans share tips, speedruns, and memories. Games are free to play in-browser via DOSBox WASM. The social layer is the main differentiator with forums, achievement badges, and user-created guides.', // TO_BE_REMOVED
    ux: 'Forum-meets-game-library layout. Each game page has tabbed interface: Play, Forum, Guides, Leaderboard. User profiles display retro achievement badges.', // TO_BE_REMOVED
    visual: 'CRT-inspired aesthetic with phosphor-green text on dark backgrounds for terminal/forum sections, contrasted with clean cards for game info.', // TO_BE_REMOVED
  }, // TO_BE_REMOVED
}; // TO_BE_REMOVED

// TO_BE_REMOVED: Hardcoded debate messages for the retro games concept
export const DEMO_MESSAGES: Message[] = [ // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 101, name: 'Maya Levi', role: 'Orchestrator', model: 'Claude Opus 4.6', // TO_BE_REMOVED
    initials: 'ML', avatarBg: '#4338ca', threadColor: '#6366f1', // TO_BE_REMOVED
    text: "Welcome, team. Today we're analyzing a retro gaming platform — a site hosting classic DOS/Windows games like Dave, with .exe download support for offline play. This touches legal/licensing complexity, frontend emulation tech, and serious UX decisions around a nostalgia-driven audience. Let's hear all angles.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 102, name: 'David Park', role: 'Backend Lead', model: 'Claude Sonnet 4.6', // TO_BE_REMOVED
    initials: 'DP', avatarBg: '#6d28d9', threadColor: '#8b5cf6', // TO_BE_REMOVED
    text: "For backend, the core challenge is game file storage and delivery. I'd recommend S3-compatible object storage (Cloudflare R2 for zero egress costs) for .exe packages and ROM files. The download service needs rate limiting and user auth to prevent abuse. For browser play, DOSBox compiled to WASM runs client-side — no server CPU needed. Stack: Next.js API routes + Supabase for user data + Cloudflare R2. Redis for session/download quotas.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 103, name: 'Priya Shah', role: 'Frontend Lead', model: 'Claude Sonnet 4.6', // TO_BE_REMOVED
    initials: 'PS', avatarBg: '#0369a1', threadColor: '#0ea5e9', // TO_BE_REMOVED
    text: "UX-wise, the game library needs two modes: browser play and download. For browser play, I'd embed js-dos (DOSBox WASM) in an iframe with gamepad support. The .exe download flow should be a proper installer — not just a raw binary. Electron.js wrapper or NSIS installer script that bundles DOSBox with the game pre-configured. For the site itself: React + Next.js App Router, Tailwind, Framer Motion for transitions. Game search should be instant using Algolia or local Fuse.js.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 104, name: 'Alex Chen', role: 'Product Strategy', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'AC', avatarBg: '#065f46', threadColor: '#10b981', // TO_BE_REMOVED
    text: "Three viable product directions: (1) Curated premium library — 500 licensed games, subscription model, cloud saves — compete on quality and legality; (2) Open community platform — focus on abandonware + freeware, strong forum/social layer, free with donations; (3) Desktop launcher app — Steam for retro games, website is just a landing page for the app download. I recommend direction 1 or 3. Direction 2 has legal risk but fastest to MVP.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 105, name: 'Jordan Kim', role: 'Business & Monetization', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'JK', avatarBg: '#92400e', threadColor: '#f59e0b', // TO_BE_REMOVED
    text: "Monetization options: (1) Freemium — free browser play, $4.99/month for unlimited downloads and cloud saves; (2) Pay-per-game — $1-3 per .exe download, works for nostalgia buys; (3) Ad-supported — display ads around the game player, not ideal for UX but no friction. Target audience is 30-45 year olds with disposable income and strong nostalgia. Subscription makes most sense. Comparable: GOG.com proves this market exists.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 106, name: 'Sarah Moore', role: 'Security & Compliance', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'SM', avatarBg: '#881337', threadColor: '#f43f5e', // TO_BE_REMOVED
    text: "Legal is the biggest risk here. Most classic games have copyright holders. 'Abandonware' is not a legal category — it's just unenforced copyright. Options: (1) Only host games with verified freeware/open-source licenses (Quake, Doom with source ports — safe); (2) License from publishers directly (costly but clean); (3) Accept the risk for truly abandoned titles. For .exe downloads, users must agree to ToS that they own the original. DMCA takedown compliance is mandatory. I'd strongly recommend starting only with legally clear titles.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 107, name: 'Marcus Johnson', role: 'Infrastructure & DevOps', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'MJ', avatarBg: '#1e40af', threadColor: '#3b82f6', // TO_BE_REMOVED
    text: "Infrastructure: Vercel for Next.js (free tier handles decent traffic), Cloudflare R2 for game files (free egress), Supabase free tier for auth+DB to start. CDN is critical — game files are 1-50MB each, must be cached at edge. For the .exe bundler, a GitHub Actions pipeline that takes a game + DOSBox config, runs NSIS, and uploads the installer to R2. This can be automated per-game. Estimated cost at 1000 users: ~$20/month.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 108, name: 'Elena Vasquez', role: 'Data & Analytics', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'EV', avatarBg: '#065f46', threadColor: '#10b981', // TO_BE_REMOVED
    text: "Data strategy: Track play sessions (game_id, duration, completion_rate), download conversions (browser_play to .exe download), and search queries to discover catalog gaps. Use PostHog (open-source, self-hosted) for analytics — free and privacy-compliant. Key metrics: DAU, average session length, top games by play time vs download count, and churn on the subscription. A/B test the 'Play in Browser vs Download' CTA placement — this is the key conversion point.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 109, name: 'Maya Levi', role: 'Orchestrator — Final Synthesis', model: 'Claude Opus 4.6', // TO_BE_REMOVED
    initials: 'ML', avatarBg: '#4338ca', threadColor: '#6366f1', // TO_BE_REMOVED
    text: "Synthesis: The team has outlined three viable product directions. For a lean MVP, I recommend starting with a curated browser-play library of legally clear games (Freeware, GPL-licensed titles like Quake/Doom), adding .exe download via a DOSBox-bundled NSIS installer. Tech stack: Next.js + Supabase + Cloudflare R2. Monetize via freemium subscription at launch. The community/social layer can be layered on top once you have user traction. Legal risk is manageable if you start with clear-license titles and build DMCA compliance from day one. This is a real market — GOG.com proves it works at scale.", // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
]; // TO_BE_REMOVED

// TO_BE_REMOVED: Hardcoded HTML prototypes generated for the retro games concept
export const DEMO_PROTOTYPES: Record<string, string> = { // TO_BE_REMOVED
  A: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Arcade Vault</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh;">
<nav style="background:#0d0d1a;border-bottom:1px solid #1e1e3a;padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;">
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="width:38px;height:38px;background:linear-gradient(135deg,#00ff88,#00cc6a);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#000;">A</div>
    <span style="font-weight:800;font-size:20px;color:#fff;letter-spacing:-0.5px;">Arcade Vault</span>
  </div>
  <div style="display:flex;align-items:center;gap:24px;">
    <a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">Library</a>
    <a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">New Arrivals</a>
    <a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">Collections</a>
    <button style="background:#00ff88;color:#000;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;">Sign In Free</button>
  </div>
</nav>
<section style="padding:90px 32px 70px;text-align:center;background:radial-gradient(ellipse 80% 50% at 50% -5%,#00ff8812,transparent);">
  <div style="display:inline-flex;align-items:center;gap:8px;background:#00ff8815;border:1px solid #00ff8830;border-radius:20px;padding:6px 16px;font-size:12px;color:#00ff88;margin-bottom:24px;font-weight:600;">10,000+ Classic Games — Instant Play or .EXE Download</div>
  <h1 style="font-size:54px;font-weight:900;margin:0 0 18px;line-height:1.08;color:#fff;max-width:680px;margin-left:auto;margin-right:auto;">The Ultimate <span style="color:#00ff88;">Retro Gaming</span> Library</h1>
  <p style="font-size:16px;color:#94a3b8;max-width:480px;margin:0 auto 40px;line-height:1.75;">Play Dave, Prince of Persia, Wolfenstein 3D and thousands more. Stream in your browser or download a native .exe installer for offline play.</p>
  <div style="display:flex;gap:14px;justify-content:center;">
    <button style="background:#00ff88;color:#000;border:none;border-radius:12px;padding:16px 36px;font-size:15px;font-weight:800;cursor:pointer;">Browse Games</button>
    <button style="background:transparent;color:#e2e8f0;border:2px solid #2d2d4a;border-radius:12px;padding:16px 36px;font-size:15px;font-weight:700;cursor:pointer;">Watch Demo</button>
  </div>
  <p style="margin-top:18px;font-size:12px;color:#475569;">Free to play · No install required · Windows .exe available</p>
</section>
<section style="padding:60px 32px;max-width:1200px;margin:0 auto;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
    <h2 style="font-size:20px;font-weight:700;color:#fff;margin:0;">Featured Classics</h2>
    <a href="#" style="color:#00ff88;text-decoration:none;font-size:13px;font-weight:600;">View all 10,000+ →</a>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;">
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#0d2b0d,#051505);display:flex;align-items:center;justify-content:center;font-size:38px;">🕹️</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">Dave</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1990 · Platform · DOS</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">Free Play</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#2b1a0d,#150d05);display:flex;align-items:center;justify-content:center;font-size:38px;">🗡️</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">Prince of Persia</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1989 · Action · DOS</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">Free Play</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#2b0d0d,#150505);display:flex;align-items:center;justify-content:center;font-size:38px;">🔫</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">Doom</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1993 · FPS · DOS</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">Free Play</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#0d0d2b,#050515);display:flex;align-items:center;justify-content:center;font-size:38px;">👾</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">Pac-Man</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1980 · Arcade · Classic</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">Free Play</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
  </div>
</section>
<section style="padding:70px 32px;background:#0d0d1a;border-top:1px solid #1e1e3a;border-bottom:1px solid #1e1e3a;margin-top:20px;">
  <div style="max-width:1050px;margin:0 auto;">
    <h2 style="text-align:center;font-size:28px;font-weight:800;color:#fff;margin:0 0 10px;">Why Arcade Vault?</h2>
    <p style="text-align:center;color:#64748b;font-size:15px;max-width:440px;margin:0 auto 48px;">Everything you need to play the classics, exactly how you want.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#0a0a0f;border:1px solid #1e1e3a;border-radius:18px;padding:28px;"><div style="font-size:30px;margin-bottom:14px;">⬇️</div><h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 10px;">Native .EXE Download</h3><p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">Every game packaged as a Windows installer with DOSBox pre-configured. Works offline, forever.</p></div>
      <div style="background:#0a0a0f;border:1px solid #1e1e3a;border-radius:18px;padding:28px;"><div style="font-size:30px;margin-bottom:14px;">☁️</div><h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 10px;">Cloud Save Sync</h3><p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">Save states sync across devices. Your progress in Dave on one PC continues on any other.</p></div>
      <div style="background:#0a0a0f;border:1px solid #1e1e3a;border-radius:18px;padding:28px;"><div style="font-size:30px;margin-bottom:14px;">🌐</div><h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 10px;">Instant Browser Play</h3><p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">No install needed. Play directly in any browser via WebAssembly emulation at full speed.</p></div>
    </div>
  </div>
</section>
<section style="padding:80px 32px;text-align:center;">
  <h2 style="font-size:30px;font-weight:800;color:#fff;margin:0 0 12px;">Start Playing Today</h2>
  <p style="color:#64748b;font-size:15px;max-width:380px;margin:0 auto 36px;line-height:1.7;">Free tier includes 50 games. Unlock everything with Pro at $4.99/month.</p>
  <div style="display:flex;gap:14px;justify-content:center;">
    <button style="background:#00ff88;color:#000;border:none;border-radius:12px;padding:16px 40px;font-size:15px;font-weight:800;cursor:pointer;">Play Free Now</button>
    <button style="background:transparent;color:#e2e8f0;border:2px solid #2d2d4a;border-radius:12px;padding:16px 40px;font-size:15px;font-weight:700;cursor:pointer;">Get Pro — $4.99/mo</button>
  </div>
</section>
<footer style="border-top:1px solid #1e1e3a;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-weight:700;color:#fff;font-size:14px;">Arcade Vault</span>
  <span style="color:#475569;font-size:12px;">© 2024 Arcade Vault · <a href="#" style="color:#00ff88;text-decoration:none;">Privacy</a> · <a href="#" style="color:#00ff88;text-decoration:none;">Terms</a> · DMCA Compliant</span>
</footer>
</body></html>`,
  B: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>RetroLauncher</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:#0f0f23;color:#cdd6f4;min-height:100vh;">
<nav style="background:#181825;border-bottom:1px solid #313244;padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;">
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="width:38px;height:38px;background:linear-gradient(135deg,#cba6f7,#89b4fa);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#0f0f23;">R</div>
    <span style="font-weight:700;font-size:18px;">RetroLauncher</span>
  </div>
  <div style="display:flex;align-items:center;gap:20px;">
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">Store</a>
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">Library</a>
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">Community</a>
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">Updates</a>
    <button style="background:#cba6f7;color:#0f0f23;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;">Download App</button>
  </div>
</nav>
<section style="padding:90px 32px 70px;max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:72px;">
  <div style="flex:1;">
    <div style="display:inline-flex;align-items:center;gap:6px;background:#cba6f718;border:1px solid #cba6f735;border-radius:6px;padding:5px 12px;font-size:11px;color:#cba6f7;margin-bottom:20px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">v2.4.0 Now Available</div>
    <h1 style="font-size:46px;font-weight:700;margin:0 0 18px;line-height:1.15;">The Game Manager<br>for <span style="color:#cba6f7;">Retro Classics</span></h1>
    <p style="font-size:15px;color:#a6adc8;line-height:1.75;margin:0 0 36px;max-width:440px;">Install, manage and launch your entire retro game collection from one app. Each game gets a proper .exe installer and lives in your Windows library forever.</p>
    <div style="display:flex;gap:12px;margin-bottom:28px;">
      <button style="background:#cba6f7;color:#0f0f23;border:none;border-radius:10px;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;">⬇ Download for Windows</button>
      <button style="background:transparent;color:#cdd6f4;border:2px solid #313244;border-radius:10px;padding:14px 32px;font-size:14px;font-weight:600;cursor:pointer;">Browse Games Online</button>
    </div>
    <div style="display:flex;gap:28px;">
      <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#cba6f7;">8,400+</div><div style="font-size:11px;color:#6c7086;">Games</div></div>
      <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#89b4fa;">Free</div><div style="font-size:11px;color:#6c7086;">Core App</div></div>
      <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#a6e3a1;">100%</div><div style="font-size:11px;color:#6c7086;">Offline Play</div></div>
    </div>
  </div>
  <div style="width:360px;background:#181825;border:1px solid #313244;border-radius:16px;overflow:hidden;flex-shrink:0;">
    <div style="background:#1e1e2e;padding:12px 16px;border-bottom:1px solid #313244;display:flex;align-items:center;gap:8px;">
      <div style="width:12px;height:12px;border-radius:50%;background:#f38ba8;"></div>
      <div style="width:12px;height:12px;border-radius:50%;background:#f9e2af;"></div>
      <div style="width:12px;height:12px;border-radius:50%;background:#a6e3a1;"></div>
      <span style="font-size:12px;color:#6c7086;margin-left:8px;">RetroLauncher — Library</span>
    </div>
    <div style="padding:16px;">
      <div style="display:flex;gap:8px;margin-bottom:12px;border-bottom:1px solid #313244;padding-bottom:12px;">
        <button style="background:#cba6f718;color:#cba6f7;border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;">Library</button>
        <button style="background:transparent;color:#6c7086;border:none;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">Store</button>
        <button style="background:transparent;color:#6c7086;border:none;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">Updates</button>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#1e1e2e;border-radius:8px;margin-bottom:6px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#1a3a1a,#0d2b0d);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;">🕹️</div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">Dave</div><div style="font-size:11px;color:#6c7086;">Platform · 1990</div></div>
        <span style="background:#a6e3a118;color:#a6e3a1;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;">Installed</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#1e1e2e;border-radius:8px;margin-bottom:6px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#3a1a0d,#2a0d00);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;">🗡️</div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">Prince of Persia</div><div style="font-size:11px;color:#6c7086;">Action · 1989</div></div>
        <span style="background:#f9e2af18;color:#f9e2af;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;">Update</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#1e1e2e;border-radius:8px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#1a1a3a,#0d0d2b);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;">👾</div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">Space Invaders</div><div style="font-size:11px;color:#6c7086;">Arcade · 1978</div></div>
        <span style="background:#cba6f718;color:#cba6f7;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;">Install</span>
      </div>
    </div>
  </div>
</section>
<section style="padding:70px 32px;background:#13131f;border-top:1px solid #313244;border-bottom:1px solid #313244;">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 style="text-align:center;font-size:26px;font-weight:700;margin:0 0 48px;">How RetroLauncher Works</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#cba6f718;border:1px solid #cba6f730;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;">1</div>
        <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">Browse the Store</h3>
        <p style="font-size:13px;color:#6c7086;line-height:1.7;margin:0;">Find your favorite classic from 8,400+ titles spanning 1978–2005.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#89b4fa18;border:1px solid #89b4fa30;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;">2</div>
        <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">One-Click Install</h3>
        <p style="font-size:13px;color:#6c7086;line-height:1.7;margin:0;">RetroLauncher downloads, configures DOSBox, and creates a .exe shortcut on your desktop automatically.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#a6e3a118;border:1px solid #a6e3a130;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;">3</div>
        <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">Play Offline Forever</h3>
        <p style="font-size:13px;color:#6c7086;line-height:1.7;margin:0;">Games are yours forever. Play with no internet, no DRM checks, no servers needed.</p>
      </div>
    </div>
  </div>
</section>
<section style="padding:80px 32px;text-align:center;">
  <h2 style="font-size:28px;font-weight:700;margin:0 0 12px;">Free to Download, Free to Play</h2>
  <p style="color:#6c7086;font-size:15px;max-width:400px;margin:0 auto 36px;line-height:1.7;">RetroLauncher is free. All freeware and open-source titles included. Premium titles available for $0.99–$2.99.</p>
  <button style="background:#cba6f7;color:#0f0f23;border:none;border-radius:12px;padding:16px 40px;font-size:15px;font-weight:700;cursor:pointer;">⬇ Download RetroLauncher — Free</button>
  <p style="margin-top:14px;font-size:12px;color:#4c4f69;">Windows 10/11 · 24MB · No registration required</p>
</section>
<footer style="background:#181825;border-top:1px solid #313244;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-weight:700;font-size:14px;">RetroLauncher</span>
  <span style="color:#4c4f69;font-size:12px;">© 2024 RetroLauncher · <a href="#" style="color:#cba6f7;text-decoration:none;">Privacy</a> · <a href="#" style="color:#cba6f7;text-decoration:none;">Terms</a></span>
</footer>
</body></html>`,
  C: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>DOS Nostalgia Hub</title>
<link href="https://fonts.googleapis.com/css2?family=VT323&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#000;color:#00ff00;min-height:100vh;">
<header style="background:#000;border-bottom:2px solid #00ff00;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;">
  <div style="display:flex;align-items:center;gap:16px;">
    <span style="font-family:'VT323',monospace;font-size:26px;letter-spacing:2px;">DOS NOSTALGIA HUB</span>
    <span style="font-size:11px;color:#00ff0055;font-family:'VT323',monospace;">v1.0 // EST. 2024</span>
  </div>
  <div style="display:flex;align-items:center;gap:16px;font-family:'VT323',monospace;font-size:18px;">
    <a href="#" style="color:#00ff00;text-decoration:none;">[GAMES]</a>
    <a href="#" style="color:#00ff0070;text-decoration:none;">[FORUM]</a>
    <a href="#" style="color:#00ff0070;text-decoration:none;">[GUIDES]</a>
    <a href="#" style="color:#00ff0070;text-decoration:none;">[BOARD]</a>
    <span style="color:#00ff0030;">|</span>
    <a href="#" style="color:#00ff00;text-decoration:none;border:1px solid #00ff00;padding:4px 12px;">[LOGIN]</a>
  </div>
</header>
<div style="max-width:1100px;margin:0 auto;padding:40px 24px;display:grid;grid-template-columns:2fr 1fr;gap:32px;">
  <div>
    <div style="border:1px solid #00ff0035;padding:24px;margin-bottom:24px;background:#001100;">
      <p style="font-family:'VT323',monospace;font-size:14px;color:#00ff0060;margin:0 0 8px;">C:\DOSNOSTALGIAHUB\&gt; WELCOME.EXE</p>
      <h1 style="font-family:'VT323',monospace;font-size:42px;color:#00ff00;margin:0 0 12px;line-height:1.1;">WELCOME TO THE HUB</h1>
      <p style="font-family:'Inter',sans-serif;font-size:14px;color:#00cc00;line-height:1.7;margin:0 0 20px;">The community for fans of classic DOS and early Windows games. Play in your browser, download .exe installers, share walkthroughs, and connect with 50,000+ retrogamers.</p>
      <div style="display:flex;gap:10px;">
        <button style="background:#00ff00;color:#000;border:none;padding:10px 24px;font-family:'VT323',monospace;font-size:18px;cursor:pointer;letter-spacing:1px;">PLAY NOW</button>
        <button style="background:transparent;color:#00ff00;border:1px solid #00ff00;padding:10px 24px;font-family:'VT323',monospace;font-size:18px;cursor:pointer;letter-spacing:1px;">JOIN COMMUNITY</button>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;margin-bottom:24px;">
      <div style="background:#001100;padding:12px 16px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:20px;">&#9658; FEATURED GAMES</span>
      </div>
      <div style="padding:16px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">DAVE</div>
          <div style="font-family:'Inter',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">Platform · 1990 · DOS · Freeware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[PLAY]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
        </div>
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">PRINCE OF PERSIA</div>
          <div style="font-family:'Inter',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">Action · 1989 · DOS · Freeware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[PLAY]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div>
        </div>
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">DOOM</div>
          <div style="font-family:'Inter',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">FPS · 1993 · DOS · Shareware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[PLAY]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
        </div>
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">COMMANDER KEEN</div>
          <div style="font-family:'Inter',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">Platform · 1990 · DOS · Shareware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[PLAY]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div>
        </div>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;">
      <div style="background:#001100;padding:12px 16px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:20px;">&#9658; RECENT FORUM POSTS</span>
      </div>
      <div style="padding:0;">
        <div style="padding:14px 16px;border-bottom:1px solid #00ff0015;display:flex;align-items:start;gap:12px;">
          <div style="width:32px;height:32px;background:#001a00;border:1px solid #00ff0035;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'VT323',monospace;font-size:14px;flex-shrink:0;">DK</div>
          <div><div style="font-family:'VT323',monospace;font-size:16px;margin-bottom:2px;">Best speedrun strats for Dave level 4?</div><div style="font-size:11px;color:#00ff0055;font-family:'Inter',sans-serif;">DaveKing99 · 2h ago · 14 replies</div></div>
        </div>
        <div style="padding:14px 16px;border-bottom:1px solid #00ff0015;display:flex;align-items:start;gap:12px;">
          <div style="width:32px;height:32px;background:#001a00;border:1px solid #00ff0035;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'VT323',monospace;font-size:14px;flex-shrink:0;">RG</div>
          <div><div style="font-family:'VT323',monospace;font-size:16px;margin-bottom:2px;">Which DOSBox fork is best for 2024?</div><div style="font-size:11px;color:#00ff0055;font-family:'Inter',sans-serif;">RetroGuru · 5h ago · 31 replies</div></div>
        </div>
        <div style="padding:14px 16px;display:flex;align-items:start;gap:12px;">
          <div style="width:32px;height:32px;background:#001a00;border:1px solid #00ff0035;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'VT323',monospace;font-size:14px;flex-shrink:0;">PX</div>
          <div><div style="font-family:'VT323',monospace;font-size:16px;margin-bottom:2px;">Prince of Persia — full guide, all levels no damage</div><div style="font-size:11px;color:#00ff0055;font-family:'Inter',sans-serif;">PixelPro · 1d ago · 8 replies</div></div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div style="border:1px solid #00ff0035;margin-bottom:20px;">
      <div style="background:#001100;padding:10px 14px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:18px;">&#9658; COMMUNITY STATS</span>
      </div>
      <div style="padding:14px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">50K</div><div style="font-size:10px;color:#00ff0060;font-family:'Inter',sans-serif;">Members</div></div>
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">3.2K</div><div style="font-size:10px;color:#00ff0060;font-family:'Inter',sans-serif;">Games</div></div>
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">18K</div><div style="font-size:10px;color:#00ff0060;font-family:'Inter',sans-serif;">Guides</div></div>
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">247</div><div style="font-size:10px;color:#00ff0060;font-family:'Inter',sans-serif;">Online Now</div></div>
        </div>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;margin-bottom:20px;">
      <div style="background:#001100;padding:10px 14px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:18px;">&#9658; TOP THIS WEEK</span>
      </div>
      <div style="padding:14px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">#1</span><div><div style="font-family:'VT323',monospace;font-size:16px;">DAVE</div><div style="font-size:10px;color:#00ff0055;font-family:'Inter',sans-serif;">12.4K plays this week</div></div></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">#2</span><div><div style="font-family:'VT323',monospace;font-size:16px;">DOOM</div><div style="font-size:10px;color:#00ff0055;font-family:'Inter',sans-serif;">9.1K plays this week</div></div></div>
        <div style="display:flex;align-items:center;gap:10px;"><span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">#3</span><div><div style="font-family:'VT323',monospace;font-size:16px;">PRINCE OF PERSIA</div><div style="font-size:10px;color:#00ff0055;font-family:'Inter',sans-serif;">7.8K plays this week</div></div></div>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;">
      <div style="background:#001100;padding:10px 14px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:18px;">&#9658; JOIN THE HUB</span>
      </div>
      <div style="padding:16px;">
        <p style="font-family:'Inter',sans-serif;font-size:12px;color:#00cc00;line-height:1.6;margin:0 0 14px;">Free membership. No ads. Just retro gaming love.</p>
        <input type="text" placeholder="Your username..." style="width:100%;background:#001100;border:1px solid #00ff0035;color:#00ff00;padding:8px 12px;font-family:'VT323',monospace;font-size:16px;box-sizing:border-box;margin-bottom:8px;outline:none;">
        <button style="width:100%;background:#00ff00;color:#000;border:none;padding:10px;font-family:'VT323',monospace;font-size:18px;cursor:pointer;letter-spacing:1px;">REGISTER FREE</button>
      </div>
    </div>
  </div>
</div>
<footer style="border-top:1px solid #00ff0025;padding:20px 24px;text-align:center;">
  <span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">DOS NOSTALGIA HUB &copy; 2024 // <a href="#" style="color:#00ff00;text-decoration:none;">DMCA</a> // <a href="#" style="color:#00ff00;text-decoration:none;">PRIVACY</a> // FREEWARE TITLES ONLY</span>
</footer>
</body></html>`,
}; // TO_BE_REMOVED

// ─────────────────────────────────────────────────────────────────────────────
// TO_BE_REMOVED: Hebrew demo data
// ─────────────────────────────────────────────────────────────────────────────

// TO_BE_REMOVED: Hebrew topic
export const DEMO_TOPIC_HE = 'אני רוצה לבנות אתר עם משחקים ישנים כמו דייב, אני רוצה שתהיה אפשרות להוריד את המשחק כקובץ .exe להפעלה במצב אופליין.'; // TO_BE_REMOVED

// TO_BE_REMOVED: Hebrew concepts
export const DEMO_CONCEPTS_HE: Record<string, ConceptData> = { // TO_BE_REMOVED
  A: { // TO_BE_REMOVED
    id: 'A', // TO_BE_REMOVED
    title: 'מחסן הארקייד', // TO_BE_REMOVED
    description: 'ספרייה פרמיום מאוצרת של משחקי DOS וחלונות קלאסיים. המשתמשים מדפדפים לפי עידן, ז\'אנר, או גורם נוסטלגיה. בכל עמוד משחק יש צילומי מסך, הקשר היסטורי, ומשחק בדפדפן בלחיצה אחת או הורדת .exe עם לאנצ\'ר מובנה.', // TO_BE_REMOVED
    ux: 'דפדוף בסגנון נטפליקס עם רשת כרטיסי משחק, תצוגה מקדימה בריחוף, שכבת-על למשחק מיידי, וקטע "הספרייה שלי" לשמירת משחקים ועדכוני ענן.', // TO_BE_REMOVED
    visual: 'עיצוב גיימינג כהה עם הדגשות ירוק ניאון, תמונות ממוזערות גדולות של משחקים, טיפוגרפיה בהשראת רטרו לכותרי משחקים אך ממשק מודרני נקי לניווט.', // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  B: { // TO_BE_REMOVED
    id: 'B', // TO_BE_REMOVED
    title: 'לאנצ\'ר הרטרו', // TO_BE_REMOVED
    description: 'מנהל משחקים לשולחן עבודה שמחקה לאנצ\'רים מודרניים (Steam/Epic) אך לכותרים רטרו. האתר הוא בעיקר פורטל הורדה לאפליקציית הלקוח של Windows, המנהלת התקנות משחקים, עדכונים ויצירת .exe.', // TO_BE_REMOVED
    ux: 'ניווט סרגל-צד בין ספרייה, חנות וקהילה. כרטיסי משחק מציגים סטטוס התקנה. התקנה בלחיצה אחת יוצרת קיצור דרך .exe מתאים על שולחן העבודה.', // TO_BE_REMOVED
    visual: 'ערכת צבעים כחול עמוק וסגול בהשראת פלטפורמות גיימינג מודרניות. עטיפות משחקים כאריחים גדולים, תגי סטטוס (מותקן, עדכון זמין, חדש), ממשק מינימלי.', // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  C: { // TO_BE_REMOVED
    id: 'C', // TO_BE_REMOVED
    title: 'מרכז הנוסטלגיה DOS', // TO_BE_REMOVED
    description: 'פלטפורמה שמשמת קהילה בראש ובראשונה שבה אוהדי משחקים רטרו משתפים טיפים, ריצות מהירות וזיכרונות. המשחקים חינמיים לשחק בדפדפן דרך DOSBox WASM. שכבת הרשת החברתית היא גורם ההבדלה העיקרי עם פורומים, תגי הישגים ומדריכים שנוצרו על ידי משתמשים.', // TO_BE_REMOVED
    ux: 'פריסת פורום-ספריית-משחקים. לכל עמוד משחק ממשק כרטיסיות: שחק, פורום, מדריכים, לוח תוצאות. פרופילי משתמשים מציגים תגי הישגים רטרו.', // TO_BE_REMOVED
    visual: 'אסתטיקה בהשראת CRT עם טקסט ירוק-זרחן על רקע כהה לחלקי הטרמינל/פורום, בניגוד לכרטיסים נקיים למידע על משחקים.', // TO_BE_REMOVED
  }, // TO_BE_REMOVED
}; // TO_BE_REMOVED

// TO_BE_REMOVED: Hebrew debate messages
export const DEMO_MESSAGES_HE: Message[] = [ // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 201, name: 'מאיה לוי', role: 'מתאמת', model: 'Claude Opus 4.6', // TO_BE_REMOVED
    initials: 'ML', avatarBg: '#4338ca', threadColor: '#6366f1', // TO_BE_REMOVED
    text: 'ברוכים הבאים, צוות. היום אנו מנתחים פלטפורמת משחקים רטרו — אתר המארח משחקי DOS קלאסיים כמו דייב, עם תמיכה בהורדת .exe למשחק אופליין. הנושא נוגע במורכבות משפטית ורישוי, טכנולוגיית אמולציה בצד לקוח, והחלטות UX קריטיות לקהל מונע נוסטלגיה. בואו נשמע את כל הזוויות.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 202, name: 'דוד פארק', role: 'ארכיטקט מערכות', model: 'Claude Sonnet 4.6', // TO_BE_REMOVED
    initials: 'DP', avatarBg: '#6d28d9', threadColor: '#8b5cf6', // TO_BE_REMOVED
    text: 'מבחינת ה-backend, האתגר המרכזי הוא אחסון ומסירת קבצי משחקים. אני ממליץ על אחסון אובייקטים תואם S3 (Cloudflare R2 עם אפס עלויות יציאה) לחבילות .exe ולקבצי ROM. שירות ההורדה זקוק להגבלת קצב ואימות משתמשים למניעת ניצול. למשחק בדפדפן, DOSBox מקומפל ל-WASM רץ בצד לקוח — ללא צורך ב-CPU של שרת. Stack: Next.js API routes + Supabase לנתוני משתמשים + Cloudflare R2. Redis לניהול מכסות הורדה.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 203, name: 'פריה שארמה', role: 'ארכיטקטית Frontend', model: 'Claude Sonnet 4.6', // TO_BE_REMOVED
    initials: 'PS', avatarBg: '#0369a1', threadColor: '#0ea5e9', // TO_BE_REMOVED
    text: 'מבחינת UX, ספריית המשחקים צריכה שני מצבים: משחק בדפדפן והורדה. למשחק בדפדפן, הייתי מטמיעה js-dos ב-iframe עם תמיכה בגיימפד. תהליך הורדת ה-.exe צריך להיות מתקין מלא — לא רק קובץ בינארי. סקריפט NSIS המאגד את DOSBox עם המשחק מוגדר מראש. לאתר: React + Next.js App Router, Tailwind, Framer Motion למעברים. חיפוש משחקים מיידי עם Fuse.js.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 204, name: 'אלכס צ\'ן', role: 'מהנדס AI', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'AC', avatarBg: '#065f46', threadColor: '#10b981', // TO_BE_REMOVED
    text: 'שלושה כיווני מוצר אפשריים: (1) ספרייה פרמיום מאוצרת — 500 משחקים מורשים, מודל מנוי, שמירת ענן — תחרות על איכות וחוקיות; (2) פלטפורמת קהילה פתוחה — התמקדות ב-abandonware ו-freeware, שכבה חברתית/פורום חזקה, חינמי עם תרומות; (3) אפליקציית לאנצ\'ר לשולחן עבודה. אני ממליץ על כיוון 1 או 3. לכיוון 2 יש סיכון משפטי אבל הוא המהיר ביותר ל-MVP.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 205, name: 'ג\'ורדן קים', role: 'מהנדס עלויות', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'JK', avatarBg: '#92400e', threadColor: '#f59e0b', // TO_BE_REMOVED
    text: 'אפשרויות מונטיזציה: (1) Freemium — משחק חינמי בדפדפן, 4.99 דולר/חודש להורדות בלתי מוגבלות ושמירת ענן; (2) תשלום למשחק — 1-3 דולר להורדת .exe, עובד לרכישות נוסטלגיה; (3) ממומן בפרסומות. קהל היעד הוא בני 30-45 עם הכנסה פנויה ונוסטלגיה חזקה. מנוי הכי הגיוני. השוואה: GOG.com מוכיח שהשוק הזה קיים.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 206, name: 'שרה מולר', role: 'מהנדסת אבטחה', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'SM', avatarBg: '#881337', threadColor: '#f43f5e', // TO_BE_REMOVED
    text: 'חוקי הוא הסיכון הגדול ביותר. לרוב המשחקים הקלאסיים יש בעלי זכויות יוצרים. "Abandonware" אינה קטגוריה משפטית. אפשרויות: (1) אחסון רק משחקים עם רישיונות freeware/open-source מאומתים (Quake, Doom — בטוח); (2) רישוי מהמפרסמים ישירות; (3) קבלת הסיכון לכותרים שנזנחו. להורדות .exe, המשתמשים חייבים לאשר בתנאי שירות שהם הבעלים של המקור. עמידה ב-DMCA היא חובה.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 207, name: 'מרקוס ג\'ונסון', role: 'מנהל מוצר', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'MJ', avatarBg: '#1e40af', threadColor: '#3b82f6', // TO_BE_REMOVED
    text: 'תשתית: Vercel ל-Next.js (תוכנית חינמית מטפלת בתנועה סבירה), Cloudflare R2 לקבצי משחקים (יציאה חינמית), Supabase תוכנית חינמית ל-auth ו-DB. CDN קריטי — קבצי משחקים הם 1-50MB כל אחד, חייבים להיות במטמון ב-edge. לבונה .exe, תהליך GitHub Actions שמריץ NSIS ומעלה ל-R2. עלות משוערת ב-1000 משתמשים: כ-20 דולר/חודש.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 208, name: 'אלנה ואסקז', role: 'יועצת סטארטאפ', model: 'Claude Haiku 4.5', // TO_BE_REMOVED
    initials: 'EV', avatarBg: '#065f46', threadColor: '#10b981', // TO_BE_REMOVED
    text: 'אסטרטגיית נתונים: מעקב אחר סשנים (game_id, duration, completion_rate), המרות הורדה (משחק בדפדפן → הורדת .exe), ושאילתות חיפוש לגילוי פערים בקטלוג. שימוש ב-PostHog (open-source, self-hosted) — חינמי ותואם פרטיות. מדדים מרכזיים: DAU, אורך סשן ממוצע, משחקים מובילים לפי זמן משחק מול ספירת הורדות, ונטישה במנוי. A/B test על מיקום ה-CTA — זוהי נקודת ההמרה המרכזית.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
  { // TO_BE_REMOVED
    id: 209, name: 'מאיה לוי', role: 'מתאמת — סינתזה סופית', model: 'Claude Opus 4.6', // TO_BE_REMOVED
    initials: 'ML', avatarBg: '#4338ca', threadColor: '#6366f1', // TO_BE_REMOVED
    text: 'סינתזה: הצוות תיאר שלושה כיווני מוצר אפשריים. ל-MVP רזה, אני ממליצה להתחיל עם ספריית משחקים בדפדפן של כותרים בעלי רישיון ברור (כותרים מורשי Freeware ו-GPL כמו Quake ו-Doom), להוסיף הורדת .exe דרך מתקין NSIS עם DOSBox. Stack טכנולוגי: Next.js + Supabase + Cloudflare R2. מונטיזציה דרך מנוי freemium בהשקה. שכבת הקהילה יכולה להתווסף לאחר שיש לך מספיק משתמשים. הסיכון המשפטי ניתן לניהול אם מתחילים עם כותרים בעלי רישיון ברור ובונים תאימות DMCA מהיום הראשון. זה שוק אמיתי — GOG.com מוכיח שזה עובד.', // TO_BE_REMOVED
    streaming: false, visible: true, isConclusion: false, // TO_BE_REMOVED
  }, // TO_BE_REMOVED
]; // TO_BE_REMOVED

// TO_BE_REMOVED: Hebrew HTML prototypes
export const DEMO_PROTOTYPES_HE: Record<string, string> = { // TO_BE_REMOVED
  A: `<!DOCTYPE html>
<html lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>מחסן הארקייד</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;900&display=swap" rel="stylesheet">
</head>
<body dir="rtl" style="margin:0;padding:0;font-family:'Heebo',sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh;">
<nav style="background:#0d0d1a;border-bottom:1px solid #1e1e3a;padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;">
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="width:38px;height:38px;background:linear-gradient(135deg,#00ff88,#00cc6a);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#000;">מ</div>
    <span style="font-weight:800;font-size:20px;color:#fff;">מחסן הארקייד</span>
  </div>
  <div style="display:flex;align-items:center;gap:24px;">
    <a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">הספרייה</a>
    <a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">חדשות</a>
    <a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">אוספים</a>
    <button style="background:#00ff88;color:#000;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;">הרשמה חינמית</button>
  </div>
</nav>
<section style="padding:90px 32px 70px;text-align:center;background:radial-gradient(ellipse 80% 50% at 50% -5%,#00ff8812,transparent);">
  <div style="display:inline-flex;align-items:center;gap:8px;background:#00ff8815;border:1px solid #00ff8830;border-radius:20px;padding:6px 16px;font-size:12px;color:#00ff88;margin-bottom:24px;font-weight:600;">10,000+ משחקים קלאסיים — שחק מיידי או הורד .EXE</div>
  <h1 style="font-size:52px;font-weight:900;margin:0 0 18px;line-height:1.1;color:#fff;max-width:680px;margin-right:auto;margin-left:auto;">הספרייה האולטימטיבית<br>ל<span style="color:#00ff88;">גיימינג רטרו</span></h1>
  <p style="font-size:16px;color:#94a3b8;max-width:480px;margin:0 auto 40px;line-height:1.75;">שחק בדייב, נסיך פרס, וולפנשטיין 3D ואלפי משחקים נוספים. שחק בדפדפן או הורד מתקין .exe לשחקנייה ללא אינטרנט.</p>
  <div style="display:flex;gap:14px;justify-content:center;">
    <button style="background:#00ff88;color:#000;border:none;border-radius:12px;padding:16px 36px;font-size:15px;font-weight:800;cursor:pointer;">עיין במשחקים</button>
    <button style="background:transparent;color:#e2e8f0;border:2px solid #2d2d4a;border-radius:12px;padding:16px 36px;font-size:15px;font-weight:700;cursor:pointer;">צפה בדמו</button>
  </div>
  <p style="margin-top:18px;font-size:12px;color:#475569;">משחק חינמי · ללא התקנה · הורדת .exe זמינה</p>
</section>
<section style="padding:60px 32px;max-width:1200px;margin:0 auto;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
    <h2 style="font-size:20px;font-weight:700;color:#fff;margin:0;">משחקים מומלצים</h2>
    <a href="#" style="color:#00ff88;text-decoration:none;font-size:13px;font-weight:600;">← צפה ב-10,000+ משחקים</a>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;">
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#0d2b0d,#051505);display:flex;align-items:center;justify-content:center;font-size:38px;">🕹️</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">דייב</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1990 · פלטפורמה · DOS</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">שחק חינם</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#2b1a0d,#150d05);display:flex;align-items:center;justify-content:center;font-size:38px;">🗡️</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">נסיך פרס</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1989 · פעולה · DOS</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">שחק חינם</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#2b0d0d,#150505);display:flex;align-items:center;justify-content:center;font-size:38px;">🔫</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">דום</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1993 · יריות · DOS</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">שחק חינם</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
    <div style="background:#0d0d1a;border:1px solid #1e1e3a;border-radius:14px;overflow:hidden;cursor:pointer;">
      <div style="height:110px;background:linear-gradient(135deg,#0d0d2b,#050515);display:flex;align-items:center;justify-content:center;font-size:38px;">👾</div>
      <div style="padding:14px;"><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">פאק-מן</div><div style="font-size:11px;color:#64748b;margin-bottom:10px;">1980 · ארקייד · קלאסי</div><div style="display:flex;gap:6px;"><span style="background:#00ff8818;color:#00ff88;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;">שחק חינם</span><span style="background:#1e1e3a;color:#94a3b8;border-radius:6px;padding:3px 10px;font-size:11px;">⬇ .exe</span></div></div>
    </div>
  </div>
</section>
<section style="padding:70px 32px;background:#0d0d1a;border-top:1px solid #1e1e3a;border-bottom:1px solid #1e1e3a;margin-top:20px;">
  <div style="max-width:1050px;margin:0 auto;">
    <h2 style="text-align:center;font-size:28px;font-weight:800;color:#fff;margin:0 0 10px;">למה מחסן הארקייד?</h2>
    <p style="text-align:center;color:#64748b;font-size:15px;max-width:440px;margin:0 auto 48px;">כל מה שצריך לשחק בקלאסיקות, בדיוק כפי שרוצים.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#0a0a0f;border:1px solid #1e1e3a;border-radius:18px;padding:28px;text-align:right;"><div style="font-size:30px;margin-bottom:14px;">⬇️</div><h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 10px;">הורדת .EXE מקורית</h3><p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">כל משחק ארוז כמתקין Windows עם DOSBox מוגדר מראש. עובד אופליין, לנצח.</p></div>
      <div style="background:#0a0a0f;border:1px solid #1e1e3a;border-radius:18px;padding:28px;text-align:right;"><div style="font-size:30px;margin-bottom:14px;">☁️</div><h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 10px;">סנכרון שמירות בענן</h3><p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">מצבי השמירה מסתנכרנים בין מכשירים. ההתקדמות שלך בדייב מחכה לך בכל מחשב.</p></div>
      <div style="background:#0a0a0f;border:1px solid #1e1e3a;border-radius:18px;padding:28px;text-align:right;"><div style="font-size:30px;margin-bottom:14px;">🌐</div><h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 10px;">משחק מיידי בדפדפן</h3><p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">ללא התקנה. שחק ישירות בכל דפדפן דרך אמולציה WebAssembly — במהירות מלאה.</p></div>
    </div>
  </div>
</section>
<section style="padding:80px 32px;text-align:center;">
  <h2 style="font-size:30px;font-weight:800;color:#fff;margin:0 0 12px;">התחל לשחק היום</h2>
  <p style="color:#64748b;font-size:15px;max-width:380px;margin:0 auto 36px;line-height:1.7;">גרסה חינמית כוללת 50 משחקים. פתח הכל עם Pro ב-4.99 דולר/חודש.</p>
  <div style="display:flex;gap:14px;justify-content:center;">
    <button style="background:#00ff88;color:#000;border:none;border-radius:12px;padding:16px 40px;font-size:15px;font-weight:800;cursor:pointer;">שחק חינם עכשיו</button>
    <button style="background:transparent;color:#e2e8f0;border:2px solid #2d2d4a;border-radius:12px;padding:16px 40px;font-size:15px;font-weight:700;cursor:pointer;">Pro — 4.99 דולר/חודש</button>
  </div>
</section>
<footer style="border-top:1px solid #1e1e3a;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-weight:700;color:#fff;font-size:14px;">מחסן הארקייד</span>
  <span style="color:#475569;font-size:12px;">© 2024 מחסן הארקייד · <a href="#" style="color:#00ff88;text-decoration:none;">פרטיות</a> · <a href="#" style="color:#00ff88;text-decoration:none;">תנאים</a> · תואם DMCA</span>
</footer>
</body></html>`,
  B: `<!DOCTYPE html>
<html lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>לאנצ'ר הרטרו</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body dir="rtl" style="margin:0;padding:0;font-family:'Heebo',sans-serif;background:#0f0f23;color:#cdd6f4;min-height:100vh;">
<nav style="background:#181825;border-bottom:1px solid #313244;padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;">
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="width:38px;height:38px;background:linear-gradient(135deg,#cba6f7,#89b4fa);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#0f0f23;">ר</div>
    <span style="font-weight:700;font-size:18px;">לאנצ'ר הרטרו</span>
  </div>
  <div style="display:flex;align-items:center;gap:20px;">
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">חנות</a>
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">הספרייה</a>
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">קהילה</a>
    <a href="#" style="color:#a6adc8;text-decoration:none;font-size:14px;font-weight:500;">עדכונים</a>
    <button style="background:#cba6f7;color:#0f0f23;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;">הורד את האפליקציה</button>
  </div>
</nav>
<section style="padding:90px 32px 70px;max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:72px;">
  <div style="flex:1;">
    <div style="display:inline-flex;align-items:center;gap:6px;background:#cba6f718;border:1px solid #cba6f735;border-radius:6px;padding:5px 12px;font-size:11px;color:#cba6f7;margin-bottom:20px;font-weight:600;letter-spacing:0.3px;">גרסה 2.4.0 זמינה</div>
    <h1 style="font-size:46px;font-weight:700;margin:0 0 18px;line-height:1.15;">מנהל המשחקים<br>ל<span style="color:#cba6f7;">קלאסיקות רטרו</span></h1>
    <p style="font-size:15px;color:#a6adc8;line-height:1.75;margin:0 0 36px;max-width:440px;">התקן, נהל והפעל את כל אוסף משחקי הרטרו שלך מאפליקציה אחת. כל משחק מקבל מתקין .exe תקני ונשאר בספריית Windows שלך לנצח.</p>
    <div style="display:flex;gap:12px;margin-bottom:28px;">
      <button style="background:#cba6f7;color:#0f0f23;border:none;border-radius:10px;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;">⬇ הורד ל-Windows</button>
      <button style="background:transparent;color:#cdd6f4;border:2px solid #313244;border-radius:10px;padding:14px 32px;font-size:14px;font-weight:600;cursor:pointer;">עיין במשחקים באתר</button>
    </div>
    <div style="display:flex;gap:28px;">
      <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#cba6f7;">8,400+</div><div style="font-size:11px;color:#6c7086;">משחקים</div></div>
      <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#89b4fa;">חינמי</div><div style="font-size:11px;color:#6c7086;">האפליקציה</div></div>
      <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#a6e3a1;">100%</div><div style="font-size:11px;color:#6c7086;">משחק אופליין</div></div>
    </div>
  </div>
  <div style="width:360px;background:#181825;border:1px solid #313244;border-radius:16px;overflow:hidden;flex-shrink:0;">
    <div style="background:#1e1e2e;padding:12px 16px;border-bottom:1px solid #313244;display:flex;align-items:center;gap:8px;">
      <div style="width:12px;height:12px;border-radius:50%;background:#f38ba8;"></div>
      <div style="width:12px;height:12px;border-radius:50%;background:#f9e2af;"></div>
      <div style="width:12px;height:12px;border-radius:50%;background:#a6e3a1;"></div>
      <span style="font-size:12px;color:#6c7086;margin-right:8px;">לאנצ'ר הרטרו — הספרייה</span>
    </div>
    <div style="padding:16px;">
      <div style="display:flex;gap:8px;margin-bottom:12px;border-bottom:1px solid #313244;padding-bottom:12px;">
        <button style="background:#cba6f718;color:#cba6f7;border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;">ספרייה</button>
        <button style="background:transparent;color:#6c7086;border:none;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">חנות</button>
        <button style="background:transparent;color:#6c7086;border:none;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">עדכונים</button>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#1e1e2e;border-radius:8px;margin-bottom:6px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#1a3a1a,#0d2b0d);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;">🕹️</div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">דייב</div><div style="font-size:11px;color:#6c7086;">פלטפורמה · 1990</div></div>
        <span style="background:#a6e3a118;color:#a6e3a1;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;">מותקן</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#1e1e2e;border-radius:8px;margin-bottom:6px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#3a1a0d,#2a0d00);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;">🗡️</div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">נסיך פרס</div><div style="font-size:11px;color:#6c7086;">פעולה · 1989</div></div>
        <span style="background:#f9e2af18;color:#f9e2af;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;">עדכון</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#1e1e2e;border-radius:8px;">
        <div style="width:40px;height:40px;background:linear-gradient(135deg,#1a1a3a,#0d0d2b);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;">👾</div>
        <div style="flex:1;"><div style="font-size:13px;font-weight:600;">פולשים מהחלל</div><div style="font-size:11px;color:#6c7086;">ארקייד · 1978</div></div>
        <span style="background:#cba6f718;color:#cba6f7;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600;">התקן</span>
      </div>
    </div>
  </div>
</section>
<section style="padding:70px 32px;background:#13131f;border-top:1px solid #313244;border-bottom:1px solid #313244;">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 style="text-align:center;font-size:26px;font-weight:700;margin:0 0 48px;">איך לאנצ'ר הרטרו עובד</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#cba6f718;border:1px solid #cba6f730;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;">1</div>
        <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">עיין בחנות</h3>
        <p style="font-size:13px;color:#6c7086;line-height:1.7;margin:0;">מצא את הקלאסיקה האהובה עליך מ-8,400+ כותרים שמשנת 1978 עד 2005.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#89b4fa18;border:1px solid #89b4fa30;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;">2</div>
        <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">התקנה בלחיצה אחת</h3>
        <p style="font-size:13px;color:#6c7086;line-height:1.7;margin:0;">לאנצ'ר הרטרו מוריד, מגדיר את DOSBox, ויוצר קיצור דרך .exe על שולחן העבודה אוטומטית.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#a6e3a118;border:1px solid #a6e3a130;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 16px;">3</div>
        <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">שחק אופליין לנצח</h3>
        <p style="font-size:13px;color:#6c7086;line-height:1.7;margin:0;">המשחקים שלך לנצח. שחק ללא אינטרנט, ללא בדיקות DRM, ללא שרתים.</p>
      </div>
    </div>
  </div>
</section>
<section style="padding:80px 32px;text-align:center;">
  <h2 style="font-size:28px;font-weight:700;margin:0 0 12px;">חינמי להורדה, חינמי לשחק</h2>
  <p style="color:#6c7086;font-size:15px;max-width:400px;margin:0 auto 36px;line-height:1.7;">לאנצ'ר הרטרו חינמי. כל כותרי ה-freeware ו-open-source כלולים. כותרים פרמיום זמינים ב-0.99–2.99 דולר.</p>
  <button style="background:#cba6f7;color:#0f0f23;border:none;border-radius:12px;padding:16px 40px;font-size:15px;font-weight:700;cursor:pointer;">⬇ הורד לאנצ'ר הרטרו — חינמי</button>
  <p style="margin-top:14px;font-size:12px;color:#4c4f69;">Windows 10/11 · 24MB · ללא רישום</p>
</section>
<footer style="background:#181825;border-top:1px solid #313244;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-weight:700;font-size:14px;">לאנצ'ר הרטרו</span>
  <span style="color:#4c4f69;font-size:12px;">© 2024 לאנצ'ר הרטרו · <a href="#" style="color:#cba6f7;text-decoration:none;">פרטיות</a> · <a href="#" style="color:#cba6f7;text-decoration:none;">תנאים</a></span>
</footer>
</body></html>`,
  C: `<!DOCTYPE html>
<html lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>מרכז הנוסטלגיה DOS</title>
<link href="https://fonts.googleapis.com/css2?family=VT323&family=Heebo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body dir="rtl" style="margin:0;padding:0;background:#000;color:#00ff00;min-height:100vh;">
<header style="background:#000;border-bottom:2px solid #00ff00;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;">
  <div style="display:flex;align-items:center;gap:16px;">
    <span style="font-family:'VT323',monospace;font-size:26px;letter-spacing:2px;">מרכז הנוסטלגיה DOS</span>
    <span style="font-size:11px;color:#00ff0055;font-family:'VT323',monospace;">v1.0 // נוסד 2024</span>
  </div>
  <div style="display:flex;align-items:center;gap:16px;font-family:'VT323',monospace;font-size:18px;">
    <a href="#" style="color:#00ff00;text-decoration:none;">[משחקים]</a>
    <a href="#" style="color:#00ff0070;text-decoration:none;">[פורום]</a>
    <a href="#" style="color:#00ff0070;text-decoration:none;">[מדריכים]</a>
    <a href="#" style="color:#00ff0070;text-decoration:none;">[לוח]</a>
    <span style="color:#00ff0030;">|</span>
    <a href="#" style="color:#00ff00;text-decoration:none;border:1px solid #00ff00;padding:4px 12px;">[כניסה]</a>
  </div>
</header>
<div style="max-width:1100px;margin:0 auto;padding:40px 24px;display:grid;grid-template-columns:2fr 1fr;gap:32px;">
  <div>
    <div style="border:1px solid #00ff0035;padding:24px;margin-bottom:24px;background:#001100;">
      <p style="font-family:'VT323',monospace;font-size:14px;color:#00ff0060;margin:0 0 8px;">C:\NOSTALGIA-HUB\&gt; ברוך-הבא.EXE</p>
      <h1 style="font-family:'VT323',monospace;font-size:40px;color:#00ff00;margin:0 0 12px;line-height:1.1;">ברוכים הבאים למרכז</h1>
      <p style="font-family:'Heebo',sans-serif;font-size:14px;color:#00cc00;line-height:1.7;margin:0 0 20px;">הקהילה לאוהדי משחקי DOS ו-Windows קלאסיים. שחק בדפדפן, הורד מתקיני .exe, שתף מדריכים, והתחבר עם 50,000+ גיימרי רטרו.</p>
      <div style="display:flex;gap:10px;">
        <button style="background:#00ff00;color:#000;border:none;padding:10px 24px;font-family:'VT323',monospace;font-size:18px;cursor:pointer;letter-spacing:1px;">שחק עכשיו</button>
        <button style="background:transparent;color:#00ff00;border:1px solid #00ff00;padding:10px 24px;font-family:'VT323',monospace;font-size:18px;cursor:pointer;letter-spacing:1px;">הצטרף לקהילה</button>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;margin-bottom:24px;">
      <div style="background:#001100;padding:12px 16px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:20px;">&#9658; משחקים מומלצים</span>
      </div>
      <div style="padding:16px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">דייב</div>
          <div style="font-family:'Heebo',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">פלטפורמה · 1990 · DOS · Freeware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[שחק]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
        </div>
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">נסיך פרס</div>
          <div style="font-family:'Heebo',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">פעולה · 1989 · DOS · Freeware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[שחק]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div>
        </div>
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">דום</div>
          <div style="font-family:'Heebo',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">יריות · 1993 · DOS · Shareware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[שחק]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
        </div>
        <div style="border:1px solid #00ff0025;padding:14px;background:#001100;cursor:pointer;">
          <div style="font-family:'VT323',monospace;font-size:22px;margin-bottom:4px;">קומנדר קין</div>
          <div style="font-family:'Heebo',sans-serif;font-size:11px;color:#00ff0060;margin-bottom:10px;">פלטפורמה · 1990 · DOS · Shareware</div>
          <div style="display:flex;gap:6px;"><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0015;color:#00ff00;padding:2px 8px;">[שחק]</span><span style="font-family:'VT323',monospace;font-size:14px;background:#00ff0008;color:#00ff0070;padding:2px 8px;">[.EXE]</span><span style="font-family:'VT323',monospace;font-size:14px;color:#00ff0055;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div>
        </div>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;">
      <div style="background:#001100;padding:12px 16px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:20px;">&#9658; פוסטים אחרונים בפורום</span>
      </div>
      <div>
        <div style="padding:14px 16px;border-bottom:1px solid #00ff0015;display:flex;align-items:start;gap:12px;">
          <div style="width:32px;height:32px;background:#001a00;border:1px solid #00ff0035;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'VT323',monospace;font-size:14px;flex-shrink:0;">DK</div>
          <div><div style="font-family:'VT323',monospace;font-size:16px;margin-bottom:2px;">מה האסטרטגיות הטובות ביותר לשלב 4 בדייב?</div><div style="font-size:11px;color:#00ff0055;font-family:'Heebo',sans-serif;">DaveKing99 · לפני 2 שעות · 14 תגובות</div></div>
        </div>
        <div style="padding:14px 16px;border-bottom:1px solid #00ff0015;display:flex;align-items:start;gap:12px;">
          <div style="width:32px;height:32px;background:#001a00;border:1px solid #00ff0035;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'VT323',monospace;font-size:14px;flex-shrink:0;">RG</div>
          <div><div style="font-family:'VT323',monospace;font-size:16px;margin-bottom:2px;">איזה fork של DOSBox הכי טוב ב-2024?</div><div style="font-size:11px;color:#00ff0055;font-family:'Heebo',sans-serif;">RetroGuru · לפני 5 שעות · 31 תגובות</div></div>
        </div>
        <div style="padding:14px 16px;display:flex;align-items:start;gap:12px;">
          <div style="width:32px;height:32px;background:#001a00;border:1px solid #00ff0035;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'VT323',monospace;font-size:14px;flex-shrink:0;">PX</div>
          <div><div style="font-family:'VT323',monospace;font-size:16px;margin-bottom:2px;">נסיך פרס — מדריך מלא, כל השלבים ללא נזק</div><div style="font-size:11px;color:#00ff0055;font-family:'Heebo',sans-serif;">PixelPro · לפני יום · 8 תגובות</div></div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div style="border:1px solid #00ff0035;margin-bottom:20px;">
      <div style="background:#001100;padding:10px 14px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:18px;">&#9658; סטטיסטיקות קהילה</span>
      </div>
      <div style="padding:14px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">50K</div><div style="font-size:10px;color:#00ff0060;font-family:'Heebo',sans-serif;">חברים</div></div>
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">3.2K</div><div style="font-size:10px;color:#00ff0060;font-family:'Heebo',sans-serif;">משחקים</div></div>
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">18K</div><div style="font-size:10px;color:#00ff0060;font-family:'Heebo',sans-serif;">מדריכים</div></div>
          <div style="text-align:center;padding:12px;background:#001100;border:1px solid #00ff0018;"><div style="font-family:'VT323',monospace;font-size:28px;">247</div><div style="font-size:10px;color:#00ff0060;font-family:'Heebo',sans-serif;">מחוברים עכשיו</div></div>
        </div>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;margin-bottom:20px;">
      <div style="background:#001100;padding:10px 14px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:18px;">&#9658; פופולרי השבוע</span>
      </div>
      <div style="padding:14px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">#1</span><div><div style="font-family:'VT323',monospace;font-size:16px;">דייב</div><div style="font-size:10px;color:#00ff0055;font-family:'Heebo',sans-serif;">12,400 משחקים השבוע</div></div></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">#2</span><div><div style="font-family:'VT323',monospace;font-size:16px;">דום</div><div style="font-size:10px;color:#00ff0055;font-family:'Heebo',sans-serif;">9,100 משחקים השבוע</div></div></div>
        <div style="display:flex;align-items:center;gap:10px;"><span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">#3</span><div><div style="font-family:'VT323',monospace;font-size:16px;">נסיך פרס</div><div style="font-size:10px;color:#00ff0055;font-family:'Heebo',sans-serif;">7,800 משחקים השבוע</div></div></div>
      </div>
    </div>
    <div style="border:1px solid #00ff0035;">
      <div style="background:#001100;padding:10px 14px;border-bottom:1px solid #00ff0035;">
        <span style="font-family:'VT323',monospace;font-size:18px;">&#9658; הצטרף למרכז</span>
      </div>
      <div style="padding:16px;">
        <p style="font-family:'Heebo',sans-serif;font-size:12px;color:#00cc00;line-height:1.6;margin:0 0 14px;">חברות חינמית. ללא פרסומות. רק אהבת גיימינג רטרו.</p>
        <input type="text" placeholder="שם משתמש..." style="width:100%;background:#001100;border:1px solid #00ff0035;color:#00ff00;padding:8px 12px;font-family:'VT323',monospace;font-size:16px;box-sizing:border-box;margin-bottom:8px;outline:none;text-align:right;">
        <button style="width:100%;background:#00ff00;color:#000;border:none;padding:10px;font-family:'VT323',monospace;font-size:18px;cursor:pointer;letter-spacing:1px;">הרשמה חינמית</button>
      </div>
    </div>
  </div>
</div>
<footer style="border-top:1px solid #00ff0025;padding:20px 24px;text-align:center;">
  <span style="font-family:'VT323',monospace;font-size:16px;color:#00ff0055;">מרכז הנוסטלגיה DOS &copy; 2024 // <a href="#" style="color:#00ff00;text-decoration:none;">DMCA</a> // <a href="#" style="color:#00ff00;text-decoration:none;">פרטיות</a> // כותרי FREEWARE בלבד</span>
</footer>
</body></html>`,
}; // TO_BE_REMOVED

// TO_BE_REMOVED: Helper that returns the right demo data set based on language
export function getDemoData(lang: string) { // TO_BE_REMOVED
  if (lang === 'he') { // TO_BE_REMOVED
    return { // TO_BE_REMOVED
      topic:      DEMO_TOPIC_HE, // TO_BE_REMOVED
      messages:   DEMO_MESSAGES_HE, // TO_BE_REMOVED
      concepts:   DEMO_CONCEPTS_HE, // TO_BE_REMOVED
      prototypes: DEMO_PROTOTYPES_HE, // TO_BE_REMOVED
    }; // TO_BE_REMOVED
  } // TO_BE_REMOVED
  return { // TO_BE_REMOVED
    topic:      DEMO_TOPIC, // TO_BE_REMOVED
    messages:   DEMO_MESSAGES, // TO_BE_REMOVED
    concepts:   DEMO_CONCEPTS, // TO_BE_REMOVED
    prototypes: DEMO_PROTOTYPES, // TO_BE_REMOVED
  }; // TO_BE_REMOVED
} // TO_BE_REMOVED
