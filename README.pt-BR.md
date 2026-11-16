# Widget de Telemetria para o GitHub

Português | [English](README.md)

<div align="center">
  <img src="./telemetry.svg" alt="Widget de Telemetria do GitHub" width="600" />
</div>

<br>

Cartão de telemetria vetorial dinâmico em SVG para perfis e repositórios do GitHub. Apresenta métricas de atividade pública e privada, incluindo contagem de repositórios, histórico de commits e distribuição proporcional de linguagens de programação, utilizando computação vetorial pura e animações nativas em CSS.

---

## Características

- **Atualização Automatizada**: Agendada via GitHub Actions. Não requer servidores dedicados, bancos de dados ou serviços de hospedagem externos.
- **Renderização em SVG Puro**: Gera um arquivo vetorial otimizado de aproximadamente 6 KB com animações CSS embutidas (indicador de status pulsante e cursor de terminal).
- **Agrupamento de Tecnologias**: Calcula o volume de bytes de código-fonte entre os repositórios e organiza em categorias de desenvolvimento.
- **Suporte Local e Remoto**: Inclui servidor de visualização local e utilitário CLI para execução direta via terminal.

---

## Como Utilizar no README do GitHub

### 1. Inclusão Direta

Para exibir o cartão em seu perfil do GitHub (`usuario/usuario`) ou no README de qualquer repositório, faça referência direta ao SVG hospedado:

```markdown
<div align="center">
  <img src="https://raw.githubusercontent.com/Yoshi-404/readme-widgets/main/telemetry.svg" alt="Telemetria do GitHub" width="600" />
</div>
```

### 2. Automação Própria via GitHub Actions

Caso deseje manter o processo de atualização de forma isolada em seu próprio repositório:

1. Copie o arquivo de workflow [update-telemetry.yml](.github/workflows/update-telemetry.yml) para o diretório `.github/workflows/`.
2. Insira a referência ao arquivo local no seu `README.md`:

```markdown
<div align="center">
  <img src="./telemetry.svg" alt="Telemetria do GitHub" width="600" />
</div>
```

O workflow é executado a cada 6 horas via cron e a cada evento de push no branch `main`, regerando o arquivo `telemetry.svg` e aplicando o commit automaticamente.

---

## Mapeamento de Métricas

As linguagens são calculadas com base no volume de bytes de código-fonte e categorizadas da seguinte forma:

| Categoria | Linguagens Principais | Foco |
| :--- | :--- | :--- |
| **Python** | Python, Jupyter Notebook | Computação gráfica, simulações, algoritmos |
| **JS & TypeScript** | JavaScript, TypeScript | Aplicações web, full-stack |
| **HTML / CSS / UI** | HTML, CSS, SCSS, Sass, Vue | Estruturação de interface, estilos, design |
| **C / C++ & Shell** | C, C++, Shell scripts, PowerShell, Dockerfile | Sistemas, ferramentas de baixo nível |

---

## Execução Local e CLI

### Linha de Comando (CLI)

Execute a telemetria diretamente no terminal com formatação em cores ANSI:

```bash
# Executa a telemetria do perfil padrão
./yoshi --telemetry

# Inspeciona os repositórios Git locais da máquina
./yoshi --telemetry --local

# Restringe a consulta aos dados públicos da API sem autenticação
./yoshi --telemetry --public

# Exporta a telemetria diretamente para um arquivo SVG
./yoshi --svg ./telemetry.svg
```

### Interface Web

Um painel web está disponível para acompanhamento de varredura em tempo real via Server-Sent Events (SSE):

```bash
npm start
```

Acesse `http://localhost:3030` para visualizar o processamento e o cálculo proporcional das métricas.

---

## Estrutura do Repositório

```
.
├── .github/workflows/
│   └── update-telemetry.yml   # Workflow de atualização agendada
├── api/
│   └── index.js               # Handler serverless
├── public/
│   ├── app.js                 # Cliente de streaming web
│   ├── index.html             # Marcação do painel
│   └── style.css              # Folha de estilos
├── cli.js                     # Script de execução no terminal
├── server.js                  # Servidor HTTP e streaming SSE
├── telemetry.svg              # Widget SVG gerado
└── yoshi                      # Executável CLI
```

---

## Licença

MIT
