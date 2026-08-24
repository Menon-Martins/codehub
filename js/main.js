/* ============================================================
   CodeHub — Main JavaScript
   Theme toggle, mobile nav, copy buttons, TOC scroll-spy.
   No dependencies. Works without a build step.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme toggle (persisted) ---------- */
  var root = document.documentElement;
  var saved = localStorage.getItem("codehub-theme");
  if (saved) {
    root.setAttribute("data-theme", saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }

  function setTheme(theme) {
    if (theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("codehub-theme", theme);
    } else {
      root.removeAttribute("data-theme");
      localStorage.removeItem("codehub-theme");
    }
  }

  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    var sun = "☀️";
    var moon = "🌙";
    function updateIcon() {
      themeBtn.textContent = root.getAttribute("data-theme") === "dark" ? sun : moon;
      themeBtn.setAttribute(
        "aria-label",
        root.getAttribute("data-theme") === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
    updateIcon();
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      updateIcon();
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") navLinks.classList.remove("open");
    });
  }

  /* ---------- Copy buttons for code blocks ---------- */
  document.querySelectorAll(".codeblock").forEach(function (block) {
    var btn = block.querySelector(".copy-btn");
    var pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.addEventListener("click", function () {
      var text = pre.innerText;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- TOC scroll-spy ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length) {
    var sections = tocLinks
      .map(function (a) {
        var id = a.getAttribute("href");
        if (id && id.charAt(0) === "#") return document.querySelector(id);
        return null;
      })
      .filter(Boolean);

    function onScroll() {
      var pos = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.offsetTop <= pos) current = sec;
      });
      tocLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
/* ---------- Level Tabs ---------- */
  document.querySelectorAll('.level-tabs').forEach(function (tabs) {
    var tabButtons = tabs.querySelectorAll('.level-tab');
    var panels = tabs.parentElement.querySelectorAll('.level-panel');
    if (!tabButtons.length || !panels.length) return;

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var level = btn.getAttribute('data-level');
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        panels.forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-level') === level);
        });
      });
    });

    // Activate first by default
    if (tabButtons[0]) tabButtons[0].click();
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealEls.length) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      var d = el.getAttribute("data-reveal-delay");
      if (d) el.classList.add("reveal-delay-" + d);
    });
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Hero typewriter terminal ---------- */
  var typeTarget = document.getElementById("typeTarget");
  if (typeTarget && !reduce) {
    var snippet = [
      { t: "# Say hello to code", c: "cm" },
      { t: "def ", c: "kw" }, { t: "greet", c: "fn" }, { t: "(name):", c: "kw" },
      { t: "\n    ", c: "" }, { t: "return", c: "kw" }, { t: " ", c: "" },
      { t: '"Hello, "', c: "str" }, { t: " + name", c: "" },
      { t: "\n\n", c: "" }, { t: "print", c: "fn" }, { t: "(", c: "" },
      { t: "greet", c: "fn" }, { t: "(", c: "" }, { t: '"World"', c: "str" }, { t: "))", c: "" }
    ];
    // Flatten into chars with class
    var chars = [];
    snippet.forEach(function (part) {
      part.t.split("").forEach(function (ch) { chars.push({ ch: ch, c: part.c }); });
    });
    var currentLine = document.createElement("span");
    currentLine.className = "ht-line";
    typeTarget.appendChild(currentLine);
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    var i = 0;
    function tick() {
      if (i < chars.length) {
        var ch = chars[i].ch;
        if (ch === "\n") {
          var nl = document.createElement("span");
          nl.className = "ht-line";
          typeTarget.insertBefore(nl, cursor);
          currentLine = nl;
        } else {
          var span = document.createElement("span");
          if (chars[i].c) span.className = chars[i].c;
          span.textContent = ch;
          currentLine.appendChild(span);
        }
        i++;
        typeTarget.appendChild(cursor);
        setTimeout(tick, 38 + Math.random() * 55);
      } else {
        // loop: erase and retype
        setTimeout(function () {
          typeTarget.innerHTML = "";
          currentLine = document.createElement("span");
          currentLine.className = "ht-line";
          typeTarget.appendChild(currentLine);
          i = 0;
          tick();
        }, 3200);
      }
    }
    typeTarget.appendChild(cursor);
    setTimeout(tick, 600);
  } else if (typeTarget) {
    typeTarget.innerHTML = '<span class="ht-line"><span class="kw">def </span><span class="fn">greet</span><span class="kw">(name):</span>\n    <span class="kw">return</span> <span class="str">"Hello, "</span> + name\n\n<span class="fn">print</span>(<span class="fn">greet</span>(<span class="str">"World"</span>))</span>';
  }

  /* ---------- Floating hero particles ---------- */
  var pWrap = document.getElementById("heroParticles");
  if (pWrap && !reduce) {
    var tokens = ["</>", "{}", "fn()", "=>", "10+", "#", "[]", "&&", "++", "=>", "const", "λ", "0x1F", "✓"];
    var count = 14;
    for (var p = 0; p < count; p++) {
      var s = document.createElement("span");
      s.textContent = tokens[Math.floor(Math.random() * tokens.length)];
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = (9 + Math.random() * 12) + "s";
      s.style.animationDelay = (Math.random() * 12) + "s";
      s.style.fontSize = (0.7 + Math.random() * 0.7) + "rem";
      pWrap.appendChild(s);
    }
  }

  /* ---------- Careers: bars + count-up on reveal ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1100;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString("en-US") + suffix;
    }
    requestAnimationFrame(step);
  }
  function activateDataCard(card) {
    if (card.classList.contains("activated")) return;
    card.classList.add("activated");
    card.querySelectorAll(".bar-fill").forEach(function (b) {
      if (b.classList.contains("activated")) return;
      b.classList.add("activated");
      var w = b.getAttribute("data-w");
      if (w) b.style.width = w + "%";
    });
    card.querySelectorAll("[data-count]").forEach(function(el) {
      if (!el.classList.contains("activated")) {
         el.classList.add("activated");
         animateCount(el);
      }
    });
  }
  var dataBlocks = Array.prototype.slice.call(document.querySelectorAll(".career-card, .salary"));
  if (dataBlocks.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      dataBlocks.forEach(activateDataCard);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activateDataCard(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      dataBlocks.forEach(function (c) { cio.observe(c); });
    }
  }
  // Hero stats count-up (runs once on load)
  document.querySelectorAll(".hero-stats [data-count]").forEach(animateCount);
  // Home stats-strip count-up (runs once on load)
  document.querySelectorAll(".stats-strip [data-count]").forEach(animateCount);

  /* ---------- Country salary bars + count-up (career detail pages) ---------- */
  function activateCtryTable(section) {
    section.querySelectorAll(".ctry-bar").forEach(function(b) {
      var w = b.getAttribute("data-w");
      if (w) b.style.width = w + "%";
    });
    section.querySelectorAll(".ctry-sal [data-count]").forEach(animateCount);
  }
  var ctryBlocks = Array.prototype.slice.call(document.querySelectorAll(".ctry-table-wrap"));
  if (ctryBlocks.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      ctryBlocks.forEach(activateCtryTable);
    } else {
      var cio2 = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            activateCtryTable(entry.target);
            cio2.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      ctryBlocks.forEach(function(b) { cio2.observe(b); });
    }
  }

  /* ---------- Scroll Reveal (added for new animations) ---------- */
  var revealElements = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealElements.length && !reduce && ("IntersectionObserver" in window)) {
    var rvObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          rvObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(function(el) { rvObserver.observe(el); });
  } else {
    revealElements.forEach(function(el) { el.classList.add("revealed"); });
  }

})();

  /* ---------- Scroll Progress Bar ---------- */
  var progressBar = document.getElementById("scrollProgress");
  if (progressBar) {
    function updateProgress() {
      var scroll = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (scroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Quiz Logic ----------
     Accurate, current questions per language. Each entry: q=question,
     o=options array, a=index of correct option. All CSS variables
     referenced later are defined in :root (css/styles.css). */
  const quizDB = {
    python: [{q: 'Which function prints text to the console?', o: ['print()','echo()','console.log()'], a: 0}, {q: 'How do you create a list?', o: ['[1, 2]','{1, 2}','(1, 2)'], a: 0}, {q: 'Keyword for function?', o: ['fun','def','function'], a: 1}],
    javascript: [{q: 'Declare a block-scoped variable?', o: ['var','let','def'], a: 1}, {q: 'Method that returns a new array by transforming items?', o: ['.map()','.each()','.loop()'], a: 0}, {q: 'What does === compare?', o: ['Assigns a value','Value only','Value AND type'], a: 2}],
    java: [{q: 'Java source compiles to...', o: ['Machine code','Bytecode','Assembly'], a: 1}, {q: 'Keyword to inherit a class?', o: ['inherits','extends','implements'], a: 1}, {q: 'Standard main method signature?', o: ['void main','public static void main','main()'], a: 1}],
    'c#': [{q: 'Which company created C#?', o: ['Google','Microsoft','Apple'], a: 1}, {q: 'Primary framework ecosystem?', o: ['Django','.NET','Spring'], a: 1}, {q: 'Asynchronous code uses...', o: ['async only','await only','Both async and await'], a: 2}],
    'c++': [{q: 'Who created C++?', o: ['Dennis Ritchie','Bjarne Stroustrup','Linus Torvalds'], a: 1}, {q: 'How do you write to standard output?', o: ['cout <<','print()','echo'], a: 0}, {q: 'C++ gives you direct control over...', o: ['Garbage collection','Memory via pointers','npm packages'], a: 1}],
    sql: [{q: 'SQL stands for?', o: ['Structured Query Language','Simple Query Lang','Server Query List'], a: 0}, {q: 'Which statement reads rows?', o: ['GET','FETCH','SELECT'], a: 2}, {q: 'Which clause filters rows?', o: ['WHERE','FILTER','IF'], a: 0}],
    c: [{q: 'Who designed the C language?', o: ['Dennis Ritchie','Bjarne Stroustrup','Guido van Rossum'], a: 0}, {q: 'Standard function for console output?', o: ['printf()','print()','echo'], a: 0}, {q: 'C is widely used for...', o: ['Operating systems & embedded software','Web page styling','Spreadsheet math'], a: 0}],
    dart: [{q: 'Which company develops Dart?', o: ['Google','Microsoft','Oracle'], a: 0}, {q: 'The main UI toolkit built with Dart?', o: ['Flutter','React','Qt'], a: 0}, {q: 'For the web, Dart compiles to...', o: ['JavaScript','Only WebAssembly','Python'], a: 0}],
    go: [{q: 'Which company created Go (2009)?', o: ['Google','Sun Microsystems','Apple'], a: 0}, {q: 'Keyword to start a lightweight thread (goroutine)?', o: ['go','async','spawn'], a: 0}, {q: 'Go is best known for...', o: ['Built-in concurrency (goroutines)','Optional typing only','Being an interpreter'], a: 0}],
    'html-css': [{q: 'What does HTML stand for?', o: ['HyperText Markup Language','High-Level Machine Language','Home Tool Markup'], a: 0}, {q: 'Which CSS property sets text color?', o: ['color','font-color','text-color'], a: 0}, {q: 'Which CSS makes a flex row/column layout?', o: ['display: flex','position: static','z-index'], a: 0}],
    default: [{q: 'What does programming let you do?', o: ['Automate repetitive tasks','Nothing useful','Avoid computers'], a: 0}, {q: 'The most effective way to learn is to...', o: ['Build small real projects','Memorize every keyword','Skip practice'], a: 0}, {q: 'Why read the official docs?', o: ['They explain the real API','They waste time','They are fictional'], a: 0}]
  };
  quizDB.kotlin = [{q: 'Kotlin mainly runs on the...', o: ['JVM & Android','Browser only','CPU firmware only'], a: 0}, {q: 'Which company created Kotlin?', o: ['JetBrains','Google','Oracle'], a: 0}, {q: 'Since 2019, Google’s preferred language for Android is...', o: ['Kotlin','Java','Swift'], a: 0}];
  quizDB.php = [{q: 'PHP is most commonly used for...', o: ['Server-side web development','Mobile GPU code','Operating-system kernels'], a: 0}, {q: 'Which symbol starts a PHP variable?', o: ['$','@','#'], a: 0}, {q: 'Which famous platform is built with PHP?', o: ['WordPress','Adobe Photoshop','nginx'], a: 0}];
  quizDB.r = [{q: 'R is mainly used for...', o: ['Statistics & data analysis','3D game engines','OS kernels'], a: 0}, {q: 'Function that prints a value?', o: ['print()','console.log()','echo'], a: 0}, {q: 'Where are R packages published?', o: ['CRAN','npm','PyPI'], a: 0}];
  quizDB.ruby = [{q: 'Who created Ruby?', o: ['Yukihiro Matsumoto','Guido van Rossum','Larry Wall'], a: 0}, {q: 'Popular Ruby web framework?', o: ['Ruby on Rails','Django','Laravel'], a: 0}, {q: 'How do you define a method?', o: ['def ... end','func ...','function ...'], a: 0}];
  quizDB.rust = [{q: 'Rust guarantees memory safety without a GC via...', o: ['Ownership & borrow checker','A garbage collector','Manual pointers only'], a: 0}, {q: 'Rust’s build tool & package manager?', o: ['Cargo','npm','pip'], a: 0}, {q: 'Rust was originally developed at...', o: ['Mozilla','Google','Apple'], a: 0}];
  quizDB.scala = [{q: 'Scala runs primarily on the...', o: ['JVM','.NET CLR','Browser only'], a: 0}, {q: 'Scala combines which paradigms?', o: ['OOP and functional','Only procedural','Only assembly'], a: 0}, {q: 'Apache Spark is largely written in...', o: ['Scala','PHP','Ruby'], a: 0}];
  quizDB.scratch = [{q: 'Who created Scratch?', o: ['MIT','Google','Microsoft'], a: 0}, {q: 'How do you write programs in Scratch?', o: ['Drag-and-drop blocks','Typed commands','Punch cards'], a: 0}, {q: 'You start a Scratch project by clicking the...', o: ['Green flag','main() function','Run button'], a: 0}];
  quizDB.swift = [{q: 'Which company created Swift (2014)?', o: ['Apple','Google','Microsoft'], a: 0}, {q: 'Swift is mainly used for...', o: ['iOS & macOS apps','Windows drivers','Linux kernels only'], a: 0}, {q: 'Swift was introduced to succeed...', o: ['Objective-C','Java','C#'], a: 0}];
  quizDB.typescript = [{q: 'TypeScript is a superset of...', o: ['JavaScript','Python','C++'], a: 0}, {q: 'Its main addition to JavaScript is...', o: ['Static types','A garbage collector','A new runtime'], a: 0}, {q: 'Which company develops TypeScript?', o: ['Microsoft','Facebook','Oracle'], a: 0}];

  // Map the current page filename -> quiz topic (reliable, no guessing).
  const fileBase = (location.pathname.split('/').pop() || '').replace('.html', '').toLowerCase();
  const topicMap = {
    'c': 'c', 'cpp': 'c++', 'csharp': 'c#', 'dart': 'dart', 'go': 'go',
    'html-css': 'html-css', 'java': 'java', 'javascript': 'javascript', 'kotlin': 'kotlin',
    'php': 'php', 'python': 'python', 'r': 'r', 'ruby': 'ruby', 'rust': 'rust',
    'scala': 'scala', 'scratch': 'scratch', 'sql': 'sql', 'swift': 'swift', 'typescript': 'typescript'
  };
  let topic = topicMap[fileBase];
  if (!topic) {
    let t = (document.querySelector('h1')?.textContent || '').toLowerCase().replace(/[^a-z#\+]/g, '');
    topic = ['c++','c#','python','javascript','java','sql','dart','go','kotlin','php','r','ruby','rust','scala','scratch','swift','typescript','html-css'].find(k => t.includes(k)) || 'default';
  }

  const quizSec = document.querySelector('#quiz');
  if (quizSec) {
    const qs = quizDB[topic] || quizDB.default;
    let score = 0, current = 0;

    quizSec.innerHTML = `
      <h2>Knowledge Assessment</h2>
      <p class="qz-step">Step 1 of ${qs.length}</p>
      <div class="qz-progress"><div class="qz-bar"></div></div>
      <div class="quiz-container"></div>
    `;

    const qCont = quizSec.querySelector('.quiz-container');
    const pBar = quizSec.querySelector('.qz-bar');
    const pText = quizSec.querySelector('.qz-step');

    function renderQ(idx) {
        if (idx >= qs.length) {
            const msg = score === qs.length
              ? 'Perfect! Scored ' + score + ' of ' + qs.length + '. 🎉'
              : 'You scored ' + score + ' of ' + qs.length + '. Review the lesson and try again!';
            qCont.innerHTML = '<div class="qz-result"><h3>' + msg + '</h3>'
              + '<button class="quiz-retake" type="button">Retake quiz</button></div>';
            pBar.style.width = '100%';
            pText.textContent = 'Completed!';
            qCont.querySelector('.quiz-retake').addEventListener('click', () => { score = 0; current = 0; renderQ(0); });
            return;
        }
        const q = qs[idx];
        let h = '<div class="quiz-question"><h3>' + (idx+1) + '. ' + q.q + '</h3><div class="quiz-options">';
        q.o.forEach((opt, i) => h += '<button class="quiz-opt" type="button" data-idx="' + i + '">' + opt + '</button>');
        h += '</div><div class="quiz-feedback"></div></div>';
        qCont.innerHTML = h;
        pBar.style.width = (idx / qs.length * 100) + '%';
        pText.textContent = 'Step ' + (idx+1) + ' of ' + qs.length;

        qCont.querySelectorAll('.quiz-opt').forEach(btn => {
            btn.addEventListener('mouseenter', () => { if (!btn.disabled) btn.style.transform = 'translateX(5px)'; });
            btn.addEventListener('mouseleave', () => { if (!btn.disabled) btn.style.transform = 'none'; });
            btn.addEventListener('click', function () {
                if (this.disabled) return;
                const sel = parseInt(this.getAttribute('data-idx'), 10);
                const opts = qCont.querySelectorAll('.quiz-opt');
                opts.forEach(x => { x.disabled = true; });
                qCont.querySelector('.quiz-question').classList.add('answered');
                const fb = qCont.querySelector('.quiz-feedback');
                if (sel === q.a) {
                    this.classList.add('correct');
                    fb.textContent = '✔ Correct!';
                    fb.classList.add('show', 'success');
                    score++;
                } else {
                    this.classList.add('wrong');
                    opts[q.a].classList.add('correct');
                    fb.textContent = '✘ Incorrect — the highlighted answer is right.';
                    fb.classList.add('show', 'error');
                }
                setTimeout(() => { current++; renderQ(current); }, 1600);
            });
        });
    }
    renderQ(0);
  }
/* ---------- Advanced Interactions ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Create Floating Background Orbs
  

  // 2. Fix TOC clicking to activate Tabs properly
  document.querySelectorAll('.toc a').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target && target.classList.contains('level-panel')) {
          const tabBtn = document.querySelector('.level-tab[data-level="' + target.getAttribute('data-level') + '"]');
          if (tabBtn) {
            tabBtn.click(); // Activate tab
          }
        }
      }
    });
  });
});
