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

  // =================================================================
    // 6. ТЕРМИНАЛ КОНТАКТОВ (ЛОГИКА + КАПЧА)
    // =================================================================
    
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha-input');
    const submitBtn = document.querySelector('.terminal-submit');

    if (contactForm && captchaQuestion && captchaInput) {
        // 1. Генерируем задачу: (A + B)
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaQuestion.textContent = `${num1} + ${num2}`;
        const correctAnswer = num1 + num2;

        // 2. Обработка отправки
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Проверка ответа
            if (parseInt(captchaInput.value) !== correctAnswer) {
                alert("ACCESS DENIED: Неверное решение примера.");
                captchaInput.value = '';
                captchaInput.focus();
                captchaInput.style.borderBottom = "1px solid red";
                return;
            }

            // Имитация отправки (Loading)
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '[ SENDING... ]';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                // Прячем форму, показываем терминальное сообщение
                contactForm.style.display = 'none';
                successMessage.classList.add('visible');
                
                // Сохраняем факт отправки (опционально)
                localStorage.setItem('formSubmitted', 'true');
            }, 1500);
        });

        // Убираем красную рамку при вводе
        captchaInput.addEventListener('input', () => {
             captchaInput.style.borderBottom = '1px solid transparent';
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
// --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // 1. Закрываем все остальные (аккордеонный режим)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // 2. Если не был открыт — открываем текущий
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
// ==============================================
    // CYBER-HUD COOKIE LOGIC
    // ==============================================
    
    const hud = document.getElementById('cookie-hud');
    const hudAccept = document.getElementById('hud-accept');
    const hudDecline = document.getElementById('hud-decline');

    // Функция показа (через 2 секунды)
    if (hud && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            hud.classList.add('active');
        }, 2000);
    }

    // Принять
    if (hudAccept) {
        hudAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            // Эффект выключения: сначала прозрачность, потом удаление
            hud.style.opacity = '0';
            hud.style.transform = 'translateY(10px)';
            setTimeout(() => {
                hud.classList.remove('active');
            }, 500);
        });
    }

    // Отклонить
    if (hudDecline) {
        hudDecline.addEventListener('click', () => {
            hud.classList.remove('active');
        });
    }

});
