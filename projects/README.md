# CodeHub

Repositório de projetos e materiais complementares do site **CodeHub** — uma plataforma
educacional gratuita para aprender programação do zero.

> Esta pasta é destinada a receber projetos, exemplos e exercícios que você quiser
> versionar aqui no GitHub. O conteúdo abaixo descreve o que é o CodeHub e como foi
> construído.

---

## O que é

O **CodeHub** é um site estático de ensino de programação. Ele reúne tutoriais de
dezenas de linguagens e guias de carreira em tecnologia, tudo explicado do absoluto
zero, sem instalações e sem cadastros.

## O que é capaz de fazer

- **Tutoriais de linguagens** — Python, JavaScript, Java, C++, C#, Go, Rust, PHP,
  Ruby, SQL, HTML & CSS, TypeScript, Kotlin, Swift, Dart, R, Scala, Scratch e mais.
  Cada linguagem tem níveis de dificuldade e exemplos de código.
- **Guias de carreira** — 26 áreas de tecnologia (front-end, back-end, full-stack,
  dados, DevOps, segurança, UX/UI, etc.) com o que fazem e faixas de remuneração.
- **Quiz interativo** — em cada página de linguagem há um quiz validado para fixar
  o conteúdo.
- **Modo claro/escuro** — alternável e persistido no navegador, com respeito a
  `prefers-reduced-motion`.
- **Acessibilidade** — navegação por teclado, skip-link, contraste e leitura por
  leitor de tela.
- **100% grátis e aberto** — sem paywall, sem anúncios bloqueando a lição.

## Como foi feito

O site é **estático**, sem framework e sem etapa de build:

- **HTML** semanal/puro para a estrutura de cada página.
- **CSS** puro (`styles.css` como base dark/glassmorphism + `neon.css` como camada
  de brilho e background animado de "aurora"). O background animado usa camadas
  fixas com `@keyframes` e `transform`/`opacity` (acelerado por GPU), e respeita
  `prefers-reduced-motion`.
- **JavaScript** puro (`main.js`) para: toggle de tema persistido, menu mobile,
  botões de copiar código, scroll-spy do sumário, revelação ao rolar e a lógica
  dos quizzes (banco `quizDB` por linguagem, índice da resposta correta validado).
- **Hospedagem** via GitHub Pages a partir do branch `main`.
- **Sem dependências externas** — nada de npm, bundlers ou CDNs obrigatórias.

## Como testar

Abra o site publicado:

**https://menon-martins.github.io/codehub/**

Ou, para rodar localmente:

```bash
# na raiz do repositório
python -m http.server 8090
# depois abra http://localhost:8090/ no navegador
```

## Esta pasta `projects/`

Use este diretório para subir seus próprios projetos, exercícios resolvidos e
experimentos. Ele não afeta o funcionamento do site — é apenas um espaço para
versionar código junto com o repositório.
