// Real-Time GitHub Telemetry Client
let currentEventSource = null;

// DOM Elements
const sourceSelect = document.getElementById('sourceSelect');
const scanBtn = document.getElementById('scanBtn');
const scanIcon = document.getElementById('scanIcon');
const scanLabel = document.getElementById('scanLabel');
const scanStrip = document.getElementById('scanStrip');
const promptUserText = document.getElementById('promptUserText');
const apiStatusText = document.getElementById('apiStatusText');
const statusDot = document.getElementById('statusDot');
const terminalLog = document.getElementById('terminalLog');
const whyBtn = document.getElementById('whyBtn');
const explanationModal = document.getElementById('explanationModal');
const closeModalBtn = document.getElementById('closeModalBtn');

const repoCountText = document.getElementById('repoCountText');
const commitCountText = document.getElementById('commitCountText');
const activeRepoText = document.getElementById('activeRepoText');

function appendLog(msg, type = 'info') {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  
  const time = new Date().toLocaleTimeString('pt-BR');
  let prefix = `<span class="t-dim">[${time}]</span> `;
  
  if (type === 'cyan') {
    line.innerHTML = `${prefix}<span class="t-cyan">●</span> ${escapeHtml(msg)}`;
  } else if (type === 'green') {
    line.innerHTML = `${prefix}<span class="t-green">✔</span> ${escapeHtml(msg)}`;
  } else {
    line.innerHTML = `${prefix}<span class="t-dim">›</span> ${escapeHtml(msg)}`;
  }

  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function animateNumber(element, start, end, suffix = '', duration = 600, decimals = 1) {
  if (isNaN(end)) return;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * ease;
    
    element.textContent = decimals > 0 ? `${current.toFixed(decimals)}${suffix}` : `${Math.round(current)}${suffix}`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = decimals > 0 ? `${end.toFixed(decimals)}${suffix}` : `${Math.round(end)}${suffix}`;
    }
  }
  requestAnimationFrame(update);
}

function updatePresetMetrics(categories) {
  if (!categories || !Array.isArray(categories)) return;

  const mapping = {
    python: { val: 'val-python', fill: 'fill-python', pb: 'pb-python' },
    web: { val: 'val-web', fill: 'fill-web', pb: 'pb-web' },
    frontend: { val: 'val-frontend', fill: 'fill-frontend', pb: 'pb-frontend' },
    systems: { val: 'val-systems', fill: 'fill-systems', pb: 'pb-systems' }
  };

  categories.forEach(cat => {
    const elIds = mapping[cat.id];
    if (!elIds) return;

    const valEl = document.getElementById(elIds.val);
    const fillEl = document.getElementById(elIds.fill);
    const pbEl = document.getElementById(elIds.pb);

    if (valEl && fillEl) {
      const currentVal = parseFloat(valEl.textContent) || 0;
      animateNumber(valEl, currentVal, cat.percentage, '%', 500, 1);
      fillEl.style.width = `${Math.min(cat.percentage, 100)}%`;
      if (pbEl) {
        pbEl.setAttribute('aria-valuenow', cat.percentage);
      }
    }
  });
}

function startTelemetryScan() {
  const source = sourceSelect.value || 'hybrid';

  scanStrip.classList.add('active');
  scanIcon.textContent = '⏳';
  scanLabel.textContent = 'Varrendo...';
  apiStatusText.textContent = source === 'local' ? 'LOCAL GIT' : 'LIVE GITHUB API';
  statusDot.style.backgroundColor = '#38bdf8';
  statusDot.style.boxShadow = '0 0 10px #38bdf8';

  if (currentEventSource) {
    currentEventSource.close();
  }

  appendLog(`Iniciando telemetria em modo [${source.toUpperCase()}]...`, 'cyan');

  const streamUrl = `/api/stream?source=${encodeURIComponent(source)}`;
  currentEventSource = new EventSource(streamUrl);

  currentEventSource.addEventListener('log', (e) => {
    const data = JSON.parse(e.data);
    appendLog(data.message, 'info');
  });

  currentEventSource.addEventListener('progress', (e) => {
    const data = JSON.parse(e.data);
    repoCountText.textContent = `${data.processedRepos} Repos`;
    commitCountText.textContent = `${data.totalCommits} Commits`;
    activeRepoText.textContent = data.currentRepo || data.latestActiveRepo;

    updatePresetMetrics(data.categories);
  });

  currentEventSource.addEventListener('complete', (e) => {
    const data = JSON.parse(e.data);
    const currRepos = parseInt(repoCountText.textContent) || 0;
    const currCommits = parseInt(commitCountText.textContent) || 0;
    
    animateNumber(repoCountText, currRepos, data.totalRepos, ' Repos', 400, 0);
    animateNumber(commitCountText, currCommits, data.totalCommits, ' Commits', 400, 0);
    activeRepoText.textContent = data.latestActiveRepo;

    updatePresetMetrics(data.categories);

    scanStrip.classList.remove('active');
    scanIcon.textContent = '⚡';
    scanLabel.textContent = 'Scan';
    apiStatusText.textContent = source === 'local' ? 'LOCAL GIT SYNCED' : 'LIVE GITHUB API';
    statusDot.style.backgroundColor = '#22c55e';
    statusDot.style.boxShadow = '0 0 8px #22c55e';

    appendLog(`Telemetria pronta! ${data.totalRepos} repositórios, ${data.totalCommits} commits/contribuições calculados.`, 'green');

    currentEventSource.close();
    currentEventSource = null;
  });

  currentEventSource.addEventListener('error', () => {
    scanStrip.classList.remove('active');
    scanIcon.textContent = '⚡';
    scanLabel.textContent = 'Scan';
    statusDot.style.backgroundColor = '#22c55e';
    if (currentEventSource) {
      currentEventSource.close();
      currentEventSource = null;
    }
  });
}

// Event Listeners
scanBtn.addEventListener('click', startTelemetryScan);
sourceSelect.addEventListener('change', startTelemetryScan);

whyBtn.addEventListener('click', () => {
  explanationModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  explanationModal.style.display = 'none';
});

explanationModal.addEventListener('click', (e) => {
  if (e.target === explanationModal) {
    explanationModal.style.display = 'none';
  }
});

// Auto-start on load
window.addEventListener('DOMContentLoaded', () => {
  startTelemetryScan();
});
