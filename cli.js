#!/usr/bin/env node

/**
 * Yoshi GitHub Telemetry CLI
 * Usage:
 *   ./yoshi --telemetry
 *   ./yoshi --telemetry --local
 *   ./yoshi --telemetry --public
 */

const { getHybridTelemetry, YOSHI_PUBLIC_TELEMETRY, scanLocalDirectory, processCategorization } = require('./server');
const path = require('path');

const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const isPublic = args.includes('--public');
const isSvg = args.includes('--svg');

const fs = require('fs');
const { generateTelemetrySVG } = require('./server');

// ANSI Colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[38;2;56;189;248m';
const INDIGO = '\x1b[38;2;129;140;248m';
const PINK = '\x1b[38;2;251;113;133m';
const EMERALD = '\x1b[38;2;52;211;153m';
const GREEN = '\x1b[38;2;34;197;94m';
const GRAY = '\x1b[38;2;148;163;184m';
const DARK_GRAY = '\x1b[38;2;71;85;105m';
const WHITE = '\x1b[38;2;248;250;252m';

function renderBar(percentage, color, width = 44) {
  const filledChars = Math.max(1, Math.round((percentage / 100) * width));
  const emptyChars = Math.max(0, width - filledChars);

  let bar = color;
  if (filledChars > 1) {
    bar += '━'.repeat(filledChars - 1) + '●';
  } else {
    bar += '●';
  }
  bar += DARK_GRAY + '─'.repeat(emptyChars) + RESET;
  return bar;
}

function printCard(data) {
  const colorMap = { python: CYAN, web: INDIGO, frontend: PINK, systems: EMERALD };

  const modeBadge = isLocal ? 'LOCAL GIT' : (isPublic ? 'PUBLIC API' : 'LIVE GITHUB API');
  console.log(`\n  ${CYAN}${BOLD}$ yoshi --telemetry${RESET}                     ${GREEN}●${RESET} ${GRAY}${BOLD}${modeBadge}${RESET}\n`);

  data.categories.forEach(cat => {
    const color = colorMap[cat.id] || CYAN;
    const leftText = `${WHITE}${BOLD}${cat.name}${RESET} ${GRAY}${cat.subtitle}${RESET}`;
    const pctText = `${color}${BOLD}${cat.percentage.toFixed(1)}%${RESET}`;
    
    const rawLeft = `${cat.name} ${cat.subtitle}`;
    const rawPct = `${cat.percentage.toFixed(1)}%`;
    const spacePadding = Math.max(2, 45 - rawLeft.length - rawPct.length);

    console.log(`  ${leftText}${' '.repeat(spacePadding)}${pctText}`);
    console.log(`  ${renderBar(cat.percentage, color, 46)}\n`);
  });

  console.log(`  ${DARK_GRAY}┌─────────────────────────────┐  ┌─────────────────────────────┐${RESET}`);
  console.log(`  ${DARK_GRAY}│${RESET} ${GRAY}ACTIVITY & REPOSITORIES     ${DARK_GRAY}│  │${RESET} ${GRAY}LATEST ACTIVE REPO          ${DARK_GRAY}│${RESET}`);
  
  const actText = `${data.totalRepos} Repos • ${data.totalCommits} Commits`;
  const actPad = Math.max(0, 27 - actText.length);
  const repoPad = Math.max(0, 27 - data.latestActiveRepo.length);

  console.log(`  ${DARK_GRAY}│${RESET} ${WHITE}${BOLD}${actText}${RESET}${' '.repeat(actPad)}${DARK_GRAY}│  │${RESET} ${CYAN}${BOLD}${data.latestActiveRepo}${RESET}${' '.repeat(repoPad)}${DARK_GRAY}│${RESET}`);
  console.log(`  ${DARK_GRAY}└─────────────────────────────┘  └─────────────────────────────┘${RESET}\n`);
}

if (isSvg) {
  const data = isPublic ? YOSHI_PUBLIC_TELEMETRY : getHybridTelemetry();
  const svg = generateTelemetrySVG(data);
  const outPath = path.resolve(args[args.indexOf('--svg') + 1] || 'telemetry.svg');
  fs.writeFileSync(outPath, svg, 'utf8');
  console.log(`\n  ${GREEN}✔${RESET} Generated README telemetry badge at: ${CYAN}${outPath}${RESET}\n`);
  process.exit(0);
}

if (isLocal) {
  const repos = scanLocalDirectory(path.join(process.env.HOME, 'GitHub'));
  let totalCommits = 0;
  let langBytes = {};
  repos.forEach(r => {
    totalCommits += r.commits;
    for (const [l, b] of Object.entries(r.languages)) langBytes[l] = (langBytes[l] || 0) + b;
  });
  const { categories, languages } = processCategorization(langBytes);
  printCard({
    totalRepos: repos.length,
    totalCommits,
    latestActiveRepo: 'KutsuLab',
    categories,
    languages
  });
} else if (isPublic) {
  printCard(YOSHI_PUBLIC_TELEMETRY);
} else {
  // Hybrid full
  printCard(getHybridTelemetry());
}
