# ⚡ Yoshi GitHub Telemetry Widget

<div align="center">

  <!-- LIVE WIDGET PREVIEW -->
  <a href="https://github.com/Yoshi-404">
    <img src="./telemetry.svg" alt="Yoshi Live GitHub Telemetry" width="600" />
  </a>

  <p>
    <b>Widget de telemetria em tempo real para o README do GitHub</b><br>
    Alimentado 100% por <b>GitHub Actions</b> (sem necessidade de servidores externos como Vercel ou Heroku).
  </p>

</div>

---

## 🎯 Como Funciona com GitHub Actions (100% Grátis)

Tudo roda dentro da infraestrutura do próprio GitHub:
- O workflow agendado ([.github/workflows/update-telemetry.yml](.github/workflows/update-telemetry.yml)) roda a cada 6 horas (ou sempre que você fizer push).
- Ele recalcula repositórios, commits e distribuição de linguagens.
- Gera o arquivo vetorial `telemetry.svg` (apenas 6 KB) e atualiza o repositório sozinho.
- Suas cotas na Vercel continuam **100% livres e reservadas para o KutsuLab**!

---

## 📌 Como Usar no seu Perfil (`Yoshi-404`) ou em Qualquer Repositório

### Método 1: Referência Direta (Recomendado)
Se você quer exibir este widget no seu perfil ou em outro projeto, basta adicionar esta tag no seu `README.md`:

```markdown
<div align="center">
  <img src="https://raw.githubusercontent.com/Yoshi-404/readme-widgets/main/telemetry.svg" alt="Live GitHub Telemetry" width="600" />
</div>
```

---

### Método 2: Rodar o Workflow no Próprio Repositório de Destino
Se você ou outra pessoa quiser que o script gere o arquivo localmente dentro do próprio repositório:
1. Copie o arquivo [.github/workflows/update-telemetry.yml](.github/workflows/update-telemetry.yml).
2. No `README.md`, referencie o arquivo local:
```markdown
<div align="center">
  <img src="./telemetry.svg" alt="Live GitHub Telemetry" width="600" />
</div>
```

---

## ⚙️ Disparo Manual e Atualização na Hora

Além do cron automático a cada 6 horas:
- Você pode ir na aba **Actions** do repositório no GitHub, selecionar **Update README Telemetry** e clicar em **Run workflow**.
- Ou no seu Mac, gerar e commitar instantaneamente:
```bash
./yoshi --svg
git commit -am "chore: update telemetry" && git push
```

---

## 💻 Interface Web e CLI Local (Opcional)

Se você quiser ver o streaming em tempo real acontecendo com os contadores subindo na tela do seu computador:

```bash
# Iniciar a UI Web no Mac:
npm start
# Acesse: http://localhost:3030

# Ou consultar no terminal com cores ANSI:
./yoshi --telemetry
```

---

## 📊 Como as Métricas São Calculadas

| Categoria | Descrição / Mapeamento |
| :--- | :--- |
| **Python** | Python, Jupyter Notebook *(OpenGL / 3D / AI)* |
| **JS & TypeScript** | JavaScript, TypeScript *(Next.js / Web)* |
| **HTML / CSS / UI** | HTML, CSS, SCSS, Sass, Vue *(Frontend & Design)* |
| **C / C++ & Shell** | C, C++, Shell, PowerShell, Dockerfile *(Systems / Embedded)* |

- **Repositórios & Commits:** Contabilizados com precisão a partir de cada repositório.
- **Linguagens:** Proporção calculada em bytes reais de código fonte.
