// ========================================
// JATIN NAYAK — PORTFOLIO JAVASCRIPT
// Premium Interactions & Animations
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ===== Fallback for brand icons (Lucide removed them in newer versions) =====
  const brandIcons = {
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`
  };

  document.querySelectorAll('[data-lucide="linkedin"], [data-lucide="github"]').forEach(el => {
    const iconName = el.getAttribute('data-lucide');
    if (brandIcons[iconName]) {
      const width = el.style.width || '20px';
      const height = el.style.height || '20px';
      const wrapper = document.createElement('span');
      wrapper.innerHTML = brandIcons[iconName];
      const svg = wrapper.querySelector('svg');
      svg.style.width = width;
      svg.style.height = height;
      svg.style.display = 'inline-block';
      svg.style.verticalAlign = 'middle';
      el.replaceWith(svg);
    }
  });

  // ===== Loading Screen =====
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1200);
  });

  // Fallback: hide loader after 3s
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 3000);

  // ===== Particle System =====
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 255 : 200; // purple or cyan tint
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
        this.opacity = Math.min(this.opacity + 0.02, 0.8);
      }

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue === 255 ? '108, 92, 231' : '0, 206, 201'}, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Particle burst on click
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 15; i++) {
      const p = new Particle();
      p.x = e.clientX;
      p.y = e.clientY;
      p.speedX = (Math.random() - 0.5) * 5;
      p.speedY = (Math.random() - 0.5) * 5;
      p.size = Math.random() * 3 + 1;
      p.opacity = 1;
      particles.push(p);
      
      // Remove burst particles after a while to prevent array from growing indefinitely
      setTimeout(() => {
        particles.shift();
      }, 2000);
    }
  });

  // ===== Cursor Glow =====
  const cursorGlow = document.getElementById('cursor-glow');
  let glowX = 0, glowY = 0;
  let currentGlowX = 0, currentGlowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glowX = e.clientX;
    glowY = e.clientY;
  });

  function updateCursorGlow() {
    currentGlowX += (glowX - currentGlowX) * 0.08;
    currentGlowY += (glowY - currentGlowY) * 0.08;
    cursorGlow.style.left = currentGlowX + 'px';
    cursorGlow.style.top = currentGlowY + 'px';
    requestAnimationFrame(updateCursorGlow);
  }

  // Only enable cursor glow on non-touch devices
  if (!('ontouchstart' in window)) {
    updateCursorGlow();
  } else {
    cursorGlow.style.display = 'none';
  }

  // ===== Typing Animation =====
  const typingElement = document.getElementById('typing-text');
  const typingTexts = [
    'AI / ML Developer',
    'Python Enthusiast',
    'Full Stack Builder',
    'Problem Solver',
    'Open Source Contributor'
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeText() {
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTexts.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeText, typingSpeed);
  }

  typeText();

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('.section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ===== Mobile Menu =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close menu on link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll to top
  document.getElementById('scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Scroll Reveal Animations =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Counter Animation =====
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.getAttribute('data-count'));
        animateCounter(target, 0, count, 1500);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      element.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ===== Tilt Effect on Project Cards =====
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ===== Skill Tags Hover Ripple =====
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // ===== Contact Form Handling =====
  const contactForm = document.getElementById('contact-form');
  
  // Using native HTML form submission to allow FormSubmit.co to render its activation page.
  // The action attribute in index.html handles the routing.

  // ===== Magnetic Button Effect (for primary buttons) =====
  const magneticBtns = document.querySelectorAll('.btn-primary');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ===== Dynamic Year in Footer =====
  const yearSpans = document.querySelectorAll('.footer-copyright');
  yearSpans.forEach(span => {
    span.innerHTML = span.innerHTML.replace('2026', new Date().getFullYear());
  });

  // ===== Easter Egg: Konami Code =====
  let konamiSequence = [];
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    if (konamiSequence.length > konamiCode.length) {
      konamiSequence.shift();
    }

    if (JSON.stringify(konamiSequence) === JSON.stringify(konamiCode)) {
      // Activate rainbow mode
      document.body.style.transition = 'filter 1s ease';
      document.body.style.filter = 'hue-rotate(90deg)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 3000);
      konamiSequence = [];
    }
  });

  // ===== Card Spotlight Glow (follows mouse) =====
  const glowCards = document.querySelectorAll('.skill-category, .cert-card, .stat-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ===== Button Ripple Click Effect =====
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== Smooth Parallax on Sections =====
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        // Parallax floating elements
        document.querySelectorAll('.floating-element').forEach((el, i) => {
          const speed = 0.02 + (i * 0.01);
          el.style.transform = `translateY(${Math.sin(scrolled * speed) * 8}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== Text Reveal on Scroll (letter by letter for section titles) =====
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('title-revealed');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-title').forEach(title => {
    titleObserver.observe(title);
  });

  // ===== Preload images for smoother experience =====
  const imageUrls = [
    'bg.png',
    'boy.jpg',
    'assets/voice_assistant.png',
    'assets/sentiment_analysis.png',
    'assets/matrix_operations.png'
  ];

  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });

  // ===== Custom Animated Cursor =====
  const customCursor = document.getElementById('custom-cursor');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (customCursor && cursorRing && !('ontouchstart' in window)) {
    body.classList.add('custom-cursor-enabled');
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      customCursor.style.left = mouseX + 'px';
      customCursor.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverElements = document.querySelectorAll('a, button, input, textarea, .skill-tag, .project-card, .theme-toggle');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        customCursor.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });
  }

  // ===== Skill Progress Bar Animation =====
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  skillFills.forEach(fill => {
    skillObserver.observe(fill);
  });

  // ===== Interactive Fake Terminal =====
  const terminalBody = document.getElementById('hero-terminal');
  if (terminalBody) {
    const commands = [
      { cmd: "import jatin", out: "Module 'jatin' loaded successfully." },
      { cmd: "jatin.get_role()", out: "'AI/ML Developer & Python Expert'" },
      { cmd: "jatin.get_status()", out: "'Open to opportunities!'" }
    ];
    
    async function typeTerminal() {
      terminalBody.innerHTML = '';
      for (let i = 0; i < commands.length; i++) {
        // Create prompt line
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-prompt">>>></span> <span class="terminal-command"></span><span class="cursor-blink"></span>`;
        terminalBody.appendChild(line);
        
        const cmdSpan = line.querySelector('.terminal-command');
        const cursor = line.querySelector('.cursor-blink');
        
        // Type command
        const cmdText = commands[i].cmd;
        for (let j = 0; j < cmdText.length; j++) {
          cmdSpan.textContent += cmdText[j];
          await new Promise(r => setTimeout(r, 40 + Math.random() * 40));
        }
        
        // Wait before output
        await new Promise(r => setTimeout(r, 300));
        cursor.remove();
        
        // Output
        const outLine = document.createElement('div');
        outLine.className = 'terminal-line terminal-output';
        outLine.innerText = commands[i].out;
        terminalBody.appendChild(outLine);
        
        await new Promise(r => setTimeout(r, 600));
      }
      
      // Final prompt
      const finalLine = document.createElement('div');
      finalLine.className = 'terminal-line';
      finalLine.innerHTML = `<span class="terminal-prompt">>>></span> <span class="cursor-blink"></span>`;
      terminalBody.appendChild(finalLine);
      
      // Loop the animation every 10 seconds
      setTimeout(typeTerminal, 8000);
    }
    
    setTimeout(typeTerminal, 1500);
  }

  console.log('%c🚀 Jatin Nayak Portfolio', 'color: #6c5ce7; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with passion, creativity, and lots of coffee ☕', 'color: #a0a0b8; font-size: 12px;');
});
