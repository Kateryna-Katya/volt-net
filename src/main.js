document.addEventListener("DOMContentLoaded", () => {

  // ==============================================
  // 1. ИНИЦИАЛИЗАЦИЯ
  // ==============================================
  lucide.createIcons();
  gsap.registerPlugin(ScrollTrigger);

  console.log("Volt-Net: System v2.0 Online");

  // ==============================================
  // 2. SMOOTH SCROLL (LENIS)
  // ==============================================
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      touchMultiplier: 2,
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ==============================================
  // 3. HERO ANIMATION
  // ==============================================
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".line-mask span", {
      y: 150, skewY: 7, duration: 1.5, stagger: 0.1, delay: 0.2
  })
  .from(".hero__status", { opacity: 0, x: -20, duration: 1 }, "-=1")
  .from(".hero__desc", { opacity: 0, y: 20, duration: 1 }, "-=0.8")
  .from(".marquee-wrapper", { scaleX: 0, duration: 1, ease: "expo.out" }, "-=1")
  .from(".circle-btn", { scale: 0, rotation: 180, duration: 1 }, "-=0.5");

  // ==============================================
  // 4. MOBILE MENU
  // ==============================================
  const burger = document.querySelector('.burger-btn');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-link');

  if (burger && menu) {
      burger.addEventListener('click', () => {
          burger.classList.toggle('active');
          menu.classList.toggle('active');

          if (menu.classList.contains('active')) {
              lenis.stop();
          } else {
              lenis.start();
          }
      });

      links.forEach(link => {
          link.addEventListener('click', () => {
              burger.classList.remove('active');
              menu.classList.remove('active');
              lenis.start();
          });
      });
  }

  // ==============================================
  // 5. ОСНОВНЫЕ СЕКЦИИ (BENTO, BENEFITS, METRICS)
  // ==============================================

  // --- A. Bento Grid ---
  const bentoCards = document.querySelectorAll('.bento-card');
  if (bentoCards.length > 0) {
      gsap.set(bentoCards, { y: 50, opacity: 0 });

      ScrollTrigger.batch(bentoCards, {
          start: "top 85%",
          onEnter: batch => gsap.to(batch, {
              opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out", overwrite: true
          })
      });
  }

  // --- B. Benefits List ---
  const benefitItems = document.querySelectorAll('.benefit-item');
  if (benefitItems.length > 0) {
      benefitItems.forEach(item => {
          gsap.from(item, {
              scrollTrigger: { trigger: item, start: "top 90%" },
              x: -30, opacity: 0, duration: 0.6, ease: "power2.out"
          });
      });
  }

  // --- C. Metrics Counter ---
  const metrics = document.querySelectorAll('.metric-val');
  metrics.forEach(metric => {
      const target = +metric.getAttribute('data-target');

      ScrollTrigger.create({
          trigger: metric,
          start: "top 85%",
          once: true,
          onEnter: () => {
              gsap.to(metric, {
                  innerText: target,
                  duration: 2,
                  snap: { innerText: 1 },
                  ease: "power2.out",
                  onUpdate: function() {
                      this.targets()[0].innerHTML = Math.ceil(this.targets()[0].innerText);
                  }
              });
          }
      });
  });

  // ==============================================
  // 6. SYSTEM LEVELS (ROADMAP)
  // ==============================================
  const levels = document.querySelectorAll('.level-item');

  // 1. Анимация появления
  if (levels.length > 0) {
      gsap.from(levels, {
          scrollTrigger: {
              trigger: ".levels-wrapper",
              start: "top 80%",
          },
          y: 30, opacity: 0, stagger: 0.2, duration: 0.8, ease: "power2.out"
      });

      // 2. Логика Аккордеона (Hover)
      levels.forEach(level => {
          level.addEventListener('mouseenter', () => {
              levels.forEach(l => l.classList.remove('active'));
              level.classList.add('active');
          });
      });
  }

  // ==============================================
  // 7. DATA STREAM (BLOG)
  // ==============================================
  const streamItems = document.querySelectorAll('.stream-item');

  if (streamItems.length > 0) {
      gsap.from(streamItems, {
          scrollTrigger: {
              trigger: ".stream-list",
              start: "top 85%",
          },
          x: -30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out"
      });
  }

  // ==============================================
  // 8. TERMINAL FORM (CONTACT)
  // ==============================================
  const termForm = document.getElementById('leadForm'); // Используем ID из HTML
  const msgBox = document.getElementById('form-message');

  if (termForm) {
      termForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const btn = termForm.querySelector('.term-btn');
          const originalText = btn.innerHTML; // Сохраняем текст "[ EXECUTE ]"

          // 1. Processing state
          btn.innerHTML = "[ PROCESSING... ]";
          btn.style.opacity = "0.7";
          btn.disabled = true;

          // 2. Simulate Delay
          setTimeout(() => {
              // Success state
              btn.innerHTML = "[ ACCESS GRANTED ]";
              btn.style.background = "#CCFF00"; // Цвет лайма
              btn.style.color = "#000";
              btn.style.borderColor = "#CCFF00";

              termForm.reset(); // Очистить поля

              // 3. Reset to default
              setTimeout(() => {
                  btn.innerHTML = originalText;
                  btn.style.background = "transparent";
                  btn.style.color = "#CCFF00"; // Вернуть цвет текста
                  btn.style.opacity = "1";
                  btn.disabled = false;
              }, 3000);
          }, 1500);
      });
  }
// --- ROADMAP REVEAL ---
const roadmapSteps = document.querySelectorAll('.roadmap-step');

if (roadmapSteps.length > 0) {
    gsap.from(roadmapSteps, {
        scrollTrigger: {
            trigger: ".roadmap-wrapper",
            start: "top 80%",
        },
        opacity: 0,
        x: -20, // Легкий сдвиг слева
        duration: 0.8,
        stagger: 0.2, // Появляются по очереди
        ease: "power2.out"
    });
}



});
