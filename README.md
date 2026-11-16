# GitHub Telemetry Widget

[Português](README.pt-BR.md) | English

<div align="center">
  <img src="telemetry.svg" alt="GitHub Telemetry Widget" width="600" />
</div>

<br>

A dynamic SVG telemetry card for GitHub profile and repository READMEs. It visualizes public and private activity metrics, including repository counts, commit history, and programming language distributions, using pure vector graphics and native CSS animations.

---

## Features

- **Automated Updates**: Scheduled via GitHub Actions. No third-party servers, databases, or external hosting services required.
- **Pure SVG Rendering**: Emits an optimized ~6 KB vector graphic with embedded CSS animations (pulsing status indicator and terminal cursor).
- **Language Stack Aggregation**: Computes byte shares across repositories and groups them into domain categories.
- **Local Git & API Support**: Includes a local inspection server and CLI tool for immediate terminal execution.

---

## Usage in GitHub README

### 1. Direct Embed

To display your own badge, replace `Yoshi-404` with your GitHub username:

```markdown
<div align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/readme-widgets/main/telemetry.svg" alt="GitHub Telemetry" width="600" />
</div>
```

### 2. Standalone Automation via GitHub Actions

The automation is completely dynamic and multi-user ready. When you fork or copy this repository to your own account:

1. The workflow automatically resolves your username via `${{ github.repository_owner }}`.
2. It queries your repositories, counts your commits, computes your language volume, and renders your username into the terminal prompt.
3. No code changes or hardcoded configurations are needed.

Reference the local file in your `README.md`:

```markdown
<div align="center">
  <img src="telemetry.svg" alt="GitHub Telemetry" width="600" />
</div>
```

The workflow runs on a 6-hour cron schedule and on push events to `main`. It regenerates `telemetry.svg` and commits changes back to the repository automatically.

---

## Metric Mapping

Languages are computed from source code byte volume and categorized as follows:

| Category | Primary Languages | Focus |
| :--- | :--- | :--- |
| **Python** | Python, Jupyter Notebook | Graphics, simulation, algorithms |
| **JS & TypeScript** | JavaScript, TypeScript | Web applications, full-stack |
| **HTML / CSS / UI** | HTML, CSS, SCSS, Sass, Vue | Interface markup, styles, design |
| **C / C++ & Shell** | C, C++, Shell scripts, PowerShell, Dockerfile | Systems, low-level tooling |

---

## Local Development & CLI

### Terminal CLI

Run the telemetry directly in your terminal with ANSI color rendering:

```bash
# Execute default profile telemetry
./yoshi --telemetry

# Inspect local Git repositories on the machine
./yoshi --telemetry --local

# Restrict to public unauthenticated GitHub API data
./yoshi --telemetry --public

# Export telemetry directly to an SVG file
./yoshi --svg ./telemetry.svg
```

### Web Interface

A real-time web dashboard is provided for live scanning using Server-Sent Events (SSE):

```bash
npm start
```

Access `http://localhost:3030` to view real-time repository parsing and percentage calculations.

---

## Repository Structure

```
.
├── .github/workflows/
│   └── update-telemetry.yml   # Scheduled automation workflow
├── api/
│   └── index.js               # Serverless handler definition
├── public/
│   ├── app.js                 # Frontend streaming client
│   ├── index.html             # Dashboard markup
│   └── style.css              # Terminal layout styles
├── cli.js                     # Terminal execution script
├── server.js                  # Local HTTP & SSE stream server
├── telemetry.svg              # Rendered SVG widget
└── yoshi                      # Executable CLI wrapper
```

---

## License

MIT
