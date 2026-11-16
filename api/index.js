const { processCategorization, YOSHI_VERIFIED_TELEMETRY, GITHUB_LANG_COLORS } = require('../server');

function generateTelemetrySVG(data) {
  const width = 600;
  const height = 352;
  const trackWidth = 544;

  let rows = '';
  const startY = 78;
  const rowHeight = 46;

  data.categories.forEach((cat, i) => {
    const y = startY + (i * rowHeight);
    const barY = y + 10;
    const fillWidth = Math.max(8, Math.min(trackWidth, (cat.percentage / 100) * trackWidth));
    const thumbX = 28 + fillWidth;
    const thumbY = barY + 3.5;

    rows += `
      <!-- ${cat.name} -->
      <g>
        <text x="28" y="${y}" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="13.5" font-weight="700" fill="#f8fafc">
          ${cat.name} <tspan font-weight="400" fill="#8492a6" font-size="12">${cat.subtitle}</tspan>
        </text>
        <text x="572" y="${y}" text-anchor="end" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="14.5" font-weight="700" fill="${cat.color}">
          ${cat.percentage.toFixed(1)}%
        </text>
        <rect x="28" y="${barY}" width="${trackWidth}" height="7" rx="3.5" fill="#111726" />
        <rect x="28" y="${barY}" width="${fillWidth}" height="7" rx="3.5" fill="url(#grad-${cat.id})" />
        <circle cx="${thumbX}" cy="${thumbY}" r="4.5" fill="${cat.thumbColor || '#ffffff'}" filter="url(#glow-${cat.id})" />
      </g>
    `;
  });

  const username = (data.username || 'yoshi').toLowerCase().replace(' (local)', '').replace(' (público)', '');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-python" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#38bdf8" flood-opacity="0.9"/>
    </filter>
    <filter id="glow-web" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#818cf8" flood-opacity="0.9"/>
    </filter>
    <filter id="glow-frontend" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#fb7185" flood-opacity="0.9"/>
    </filter>
    <filter id="glow-systems" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#34d399" flood-opacity="0.9"/>
    </filter>
    <linearGradient id="grad-python" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <linearGradient id="grad-web" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <linearGradient id="grad-frontend" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#fb7185" />
    </linearGradient>
    <linearGradient id="grad-systems" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.35; transform: scale(0.85); }
      }
      .pulse-dot {
        transform-origin: 472px 33px;
        animation: pulse 2s infinite ease-in-out;
      }
    </style>
  </defs>

  <!-- Card Background -->
  <rect x="0.5" y="0.5" width="599" height="351" rx="16" fill="#0b0f19" stroke="#1a2234"/>

  <!-- Header -->
  <text x="28" y="38" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="14.5" font-weight="700" fill="#38bdf8">
    $ <tspan fill="#38bdf8">${username}</tspan> --telemetry<tspan class="cursor" fill="#38bdf8">_</tspan>
  </text>

  <g>
    <circle cx="472" cy="33" r="3.5" fill="#22c55e" class="pulse-dot" />
    <text x="484" y="37" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="0.08em" fill="#8da2be">LIVE GITHUB API</text>
  </g>

  <!-- Rows -->
  ${rows}

  <!-- Bottom Cards -->
  <rect x="28" y="272" width="264" height="54" rx="10" fill="#0e1422" stroke="#1a2234" />
  <text x="42" y="291" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.08em" fill="#64748b">ACTIVITY &amp; REPOSITORIES</text>
  <text x="42" y="312" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="14" font-weight="700" fill="#cbd5e1">
    ${data.totalRepos} Repos <tspan fill="#64748b">•</tspan> ${data.totalCommits} Commits
  </text>

  <rect x="308" y="272" width="264" height="54" rx="10" fill="#0e1422" stroke="#1a2234" />
  <text x="322" y="291" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.08em" fill="#64748b">LATEST ACTIVE REPO</text>
  <text x="322" y="312" font-family="'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace" font-size="14" font-weight="700" fill="#38bdf8">
    ${data.latestActiveRepo}
  </text>
</svg>`;
}

async function fetchTelemetry(targetUsername, token) {
  const headers = {
    'User-Agent': 'Yoshi-Telemetry-Widget/1.0',
    Accept: 'application/vnd.github.v3+json'
  };
  const effectiveToken = token || process.env.GITHUB_TOKEN;
  if (effectiveToken) headers['Authorization'] = `token ${effectiveToken}`;

  const userRes = await fetch(`https://api.github.com/users/${targetUsername}`, { headers });
  if (!userRes.ok) throw new Error('User not found');
  const user = await userRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${targetUsername}/repos?per_page=100&sort=pushed`, { headers });
  if (!reposRes.ok) throw new Error('Could not fetch repos');
  const repos = await reposRes.json();

  let langBytes = {};
  let totalCommits = 0;
  const latestActiveRepo = repos.length > 0 ? repos[0].name : targetUsername;

  for (const r of repos.slice(0, 30)) {
    try {
      const lRes = await fetch(`https://api.github.com/repos/${targetUsername}/${r.name}/languages`, { headers });
      const lData = await lRes.json();
      for (const [lang, b] of Object.entries(lData)) {
        langBytes[lang] = (langBytes[lang] || 0) + b;
      }
    } catch (e) {}

    try {
      const cRes = await fetch(`https://api.github.com/repos/${targetUsername}/${r.name}/commits?author=${targetUsername}&per_page=1`, { headers });
      const link = cRes.headers.get('link');
      if (link) {
        const m = link.match(/page=(\d+)>; rel="last"/);
        if (m) totalCommits += parseInt(m[1], 10);
      } else {
        const cData = await cRes.json();
        if (Array.isArray(cData)) totalCommits += cData.length;
      }
    } catch (e) {}
  }

  const { totalBytes, categories, languages } = processCategorization(langBytes);

  return {
    username: targetUsername,
    name: user.name || user.login,
    totalRepos: repos.length,
    totalCommits,
    latestActiveRepo,
    totalBytes,
    categories,
    languages
  };
}

module.exports = async (req, res) => {
  const { username = 'Yoshi-404', token } = req.query;

  let telemetryData;
  try {
    telemetryData = await fetchTelemetry(username, token);
  } catch (err) {
    telemetryData = YOSHI_VERIFIED_TELEMETRY;
  }

  const svg = generateTelemetrySVG(telemetryData);

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');
  res.status(200).send(svg);
};
