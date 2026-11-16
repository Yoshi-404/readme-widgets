# ⚡ Yoshi GitHub Telemetry Widget

<div align="center">

  <!-- LIVE WIDGET PREVIEW -->
  <a href="https://github.com/Yoshi-404">
    <img src="./telemetry.svg" alt="Yoshi Live GitHub Telemetry" width="600" />
  </a>

  <p>
    <b>Widget de telemetria em tempo real para README do GitHub</b><br>
    Inspirado no visual cyberpunk de terminais escuros com barras de progresso neon pulsantes.
  </p>

  <p>
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYoshi-404%2Fgit-idea"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
  </p>

</div>

---

## 🎯 Como Usar no seu README do GitHub

Você pode usar este widget no seu perfil (`username/username`) ou no README de qualquer repositório de **duas formas simples**:

### Método 1: GitHub Actions (Sem Servidor • 100% Grátis)

Este método não precisa de servidor nem de deploy. O GitHub roda o script a cada 6 horas e mantém a imagem atualizada no seu repositório:

1. Copie o arquivo [.github/workflows/update-telemetry.yml](.github/workflows/update-telemetry.yml) para o seu repositório.
2. Adicione a imagem no seu `README.md`:
```markdown
<div align="center">
  <img src="./telemetry.svg" alt="GitHub Telemetry" width="600" />
</div>
```
3. Pronto! O GitHub atualizará as métricas e o arquivo `telemetry.svg` automaticamente.

---

### Método 2: Vercel Serverless (Qualquer Usuário via URL)

Se você fizer o deploy na Vercel (1 clique no botão acima), qualquer pessoa poderá colocar a tag direta no Markdown:

```markdown
![Minha Telemetria](https://seu-app.vercel.app/api?username=SEU_USUARIO)
```

**Parâmetros suportados na URL:**
- `username`: Seu nome de usuário no GitHub (Ex: `?username=Yoshi-404`).
- `token`: (Opcional) Token do GitHub para ler repositórios privados e evitar limites de taxa.

---

### Método 3: Gerar Manualmente via Terminal

Gera o arquivo `telemetry.svg` instantaneamente no seu Mac:

```bash
./yoshi --svg
# ou apontando para outro caminho:
./yoshi --svg ./assets/telemetry.svg
```

---

## 💻 Interface Web Interativa & CLI Local

Além do widget para README, este projeto inclui:

1. **Interface Web em Tempo Real:**
   ```bash
   npm start
   # Acesse: http://localhost:3030
   ```
   Acompanhe em tempo real a varredura repositório por repositório com Server-Sent Events (SSE), barras animadas e logs de eventos.

2. **Comando no Terminal (CLI):**
   ```bash
   ./yoshi --telemetry
   ```
   Exibe o card completo renderizado diretamente no terminal com cores ANSI truecolor.

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
