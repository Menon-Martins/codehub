# CodeHub Website

🔗 **Teste agora:** https://menon-martins.github.io/codehub/

---

## O que é

O **CodeHub** é um site educacional gratuito para aprender programação do zero.
Reúne tutoriais de dezenas de linguagens e guias de carreira em tecnologia, tudo
explicado do absoluto início, sem instalações e sem cadastros.

## O que é capaz de fazer

- **Tutoriais de linguagens** — Python, JavaScript, Java, C++, C#, Go, Rust, PHP,
  Ruby, SQL, HTML & CSS, TypeScript, Kotlin, Swift, Dart, R, Scala, Scratch e mais.
  Cada linguagem traz níveis de dificuldade e exemplos de código.
- **Guias de carreira** — 26 áreas de tecnologia (front-end, back-end, full-stack,
  dados, DevOps, segurança, UX/UI etc.) com o que fazem e faixas de remuneração.
- **Quiz interativo** — em cada página de linguagem há um quiz para fixar o conteúdo.
- **Modo claro/escuro** — alternável e lembrado pelo navegador, respeitando
  `prefers-reduced-motion`.
- **Acessibilidade** — navegação por teclado, skip-link, contraste e leitura por
  leitor de tela.
- **100% grátis e aberto** — sem paywall e sem anúncios bloqueando a lição.

## Como foi feito

O site é **estático**, sem framework e sem etapa de build:

- **HTML** puro para a estrutura de cada página.
- **CSS** puro — `styles.css` (base dark/glassmorphism) + `neon.css` (camada de
  brilho e background animado de "aurora"). O background animado usa camadas fixas
  com `@keyframes` e `transform`/`opacity` (acelerado por GPU) e respeita
  `prefers-reduced-motion`.
- **JavaScript** puro (`main.js`) para: toggle de tema persistido, menu mobile,
  botões de copiar código, scroll-spy do sumário, revelação ao rolar e a lógica dos
  quizzes (banco `quizDB` por linguagem, com o índice da resposta correta validado).
- **Hospedagem** via GitHub Pages a partir do branch `main`.
- **Sem dependências externas** — nada de npm, bundlers ou CDNs obrigatórias.

## Como rodar localmente

```bash
# na raiz do repositório
python -m http.server 8090
# abra http://localhost:8090/ no navegador
```

## Sobre esta pasta `projects/`

Esta pasta `projects/` serve para subir seus próprios projetos, exercícios resolvidos
e experimentos. Ela não afeta o funcionamento do site — é apenas um espaço para
versionar código junto com o repositório.

🔗 **Link para testar o site:** https://menon-martins.github.io/codehub/
