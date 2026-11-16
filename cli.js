#!/usr/bin/env node

/**
 * Yoshi GitHub Telemetry CLI
 * Usage:
 *   ./yoshi --telemetry
 *   ./yoshi --telemetry --user <username>
 *   ./yoshi --svg telemetry.svg --user <username>
 *   ./yoshi --local
 *   ./yoshi --public
 */

const { getHybridTelemetry, YOSHI_PUBLIC_TELEMETRY, scanLocalDirectory, processCategorization, generateTelemetrySVG, fetchLiveUserTelemetry } = require('./server');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const isPublic = args.includes('--public');
const isSvg = args.includes('--svg');
const token = process.env.GITHUB_TOKEN || null;

// Resolve target user dynamically from CLI flags, environment, or Git remote
function resolveTargetUser() {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--user' || args[i] === '-u') {
      if (args[i + 1] && !args[i + 1].startsWith('-')) return args[i + 1];
    }
    if (args[i].startsWith('--user=')) {
      return args[i].split('=')[1];
    }
  }

  // Check positional args (e.g. ./yoshi --telemetry torvalds)
  const nonFlags = args.filter(a => !a.startsWith('-') && !a.endsWith('.svg'));
  if (nonFlags.length > 0) {
    return nonFlags[0];
  }

  // Environment variables automatically set in GitHub Actions runners
  if (process.env.GITHUB_USER) return process.env.GITHUB_USER;
  if (process.env.GITHUB_REPOSITORY_OWNER) return process.env.GITHUB_REPOSITORY_OWNER;
  if (process.env.GITHUB_ACTOR) return process.env.GITHUB_ACTOR;

  // Auto-detect owner from local git remote if available
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const match = remote.match(/github\.com[:\/]([^\/]+)/);
    if (match && match[1] && match[1].toLowerCase() !== 'github') {
      return match[1];
    }
  } catch (e) {}

  return 'Yoshi-404';
}

const targetUser = resolveTargetUser();

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
  const displayName = (data.username || targetUser).toLowerCase().replace(' (local)', '').replace(' (público)', '');

  console.log(`\n  ${CYAN}${BOLD}$ ${displayName} --telemetry${RESET}                     ${GREEN}●${RESET} ${GRAY}${BOLD}${modeBadge}${RESET}\n`);

  data.categories.forEach(cat => {
    const color = colorMap[cat.id] || cat.color || CYAN;
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

async function main() {
  if (isSvg) {
    let data;
    if (isPublic) {
      data = YOSHI_PUBLIC_TELEMETRY;
    } else if (targetUser.toLowerCase() === 'yoshi-404' && fs.existsSync(path.join(process.env.HOME, 'GitHub', 'KutsuLab'))) {
      data = getHybridTelemetry();
    } else {
      try {
        data = await fetchLiveUserTelemetry(targetUser, token);
      } catch (err) {
        console.error(`Warning: ${err.message}. Using fallback data.`);
        data = getHybridTelemetry();
      }
    }

    const svg = generateTelemetrySVG(data);
    let outIdx = args.indexOf('--svg') + 1;
    let outPath = 'telemetry.svg';
    if (args[outIdx] && !args[outIdx].startsWith('-')) {
      outPath = args[outIdx];
    }
    const resolvedPath = path.resolve(outPath);
    fs.writeFileSync(resolvedPath, svg, 'utf8');
    console.log(`\n  ${GREEN}✔${RESET} Generated README telemetry badge for ${CYAN}${data.username}${RESET} at: ${WHITE}${resolvedPath}${RESET}\n`);
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
      username: `${targetUser} (Local)`,
      totalRepos: repos.length,
      totalCommits,
      latestActiveRepo: repos[0] ? repos[0].name : targetUser,
      categories,
      languages
    });
    return;
  }

  if (isPublic) {
    printCard(YOSHI_PUBLIC_TELEMETRY);
    return;
  }

  // Live query for target user
  if (targetUser.toLowerCase() === 'yoshi-404' && fs.existsSync(path.join(process.env.HOME, 'GitHub', 'KutsuLab'))) {
    printCard(getHybridTelemetry());
  } else {
    try {
      const data = await fetchLiveUserTelemetry(targetUser, token);
      printCard(data);
    } catch (err) {
      console.error(`\nError: ${err.message}`);
      printCard(getHybridTelemetry());
    }
  }
}

main();
