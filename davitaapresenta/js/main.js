document.addEventListener("DOMContentLoaded", () => {
    
    // --- Particles Initialization (Principa Style) ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "window",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { grab: { distance: 200, line_linked: { opacity: 0.8 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    }

    // 1. Lenis Smooth Scroll Configuration
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integração Lenis + ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // 2. Custom Cursor Premium Logic
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // LERP dinâmico para suavidade
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.4;
        cursorY += (mouseY - cursorY) * 0.4;
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Interação Hover Elements
    const interactiveElements = document.querySelectorAll('a, button, .cursor-hover');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });


    const tlIntro = gsap.timeline({ delay: 0.2 });

    // 1. Fade IN inicial automático com Glow Cinematográfico (Sem precisar de scroll)
    tlIntro.from(['#main-logo', '.fade-up:not(.scroll-indicator)'], {
        opacity: 0,
        y: 40,
        filter: "blur(15px) drop-shadow(0px 0px 30px rgba(255,255,255,0.8))",
        stagger: 0.12,
        duration: 2.2,
        ease: "power3.out"
    })
    // 2. O Scroll Indicator aparece depois para convidar ao scroll
    .from('.scroll-indicator', {
        opacity: 0,
        y: -15,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1.0");


    // 3. Efeito opcional de dissipar (Fade OUT com Blur) se o usuário scrolar a página para baixo
    gsap.to('#hero-content', {
        yPercent: -20,
        opacity: 0,
        filter: "blur(12px)",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "60% top",
            scrub: 1
        }
    });

    // Canvas Hero — 75 JPEGs (9.9 MB, q=96%) — scrubbing frame-a-frame sem artefatos de vídeo
    const heroCanvas = document.getElementById('hero-canvas');

    if (heroCanvas) {
        const context = heroCanvas.getContext('2d');

        const frameCount = 75;
        const currentFrame = { index: 0 };
        const images = [];

        // Pré-carrega todos os 75 frames JPEG na memória
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const frameId = i.toString().padStart(2, '0');
            img.src = `assets/RAW/Video%20Hero%20JPG/Timeline%201_000900${frameId}.jpg`;
            images.push(img);
        }

        // Render: transfere o frame atual para o canvas
        const render = () => {
            const frameIndex = Math.floor(currentFrame.index);
            const img = images[frameIndex];
            if (img && img.complete) {
                context.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
                context.drawImage(img, 0, 0, heroCanvas.width, heroCanvas.height);
            }
        };

        // Mostra o primeiro frame assim que carrega
        images[0].onload = render;

        // ScrollTrigger: desliza entre os 75 frames durante o scroll
        gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-content",
                start: "top top",
                end: "+=200%",
                scrub: 1.5,
                onUpdate: () => requestAnimationFrame(render)
            }
        })
        .to(currentFrame, { index: frameCount - 1, ease: "none" }, 0)
        .fromTo(heroCanvas,
            { scale: 1.0, yPercent: 0 },
            { scale: 1.15, yPercent: 5, ease: "none" },
            0
        );
    }

    // --- DOBRA 3 CANVAS SCRUB — 177 JPEGs (40MB, q=96%) — scrubbing frame-a-frame perfeito ---
    const dobra3Canvas = document.getElementById('dobra3-canvas');
    if (dobra3Canvas) {
        const ctxDobra3 = dobra3Canvas.getContext('2d');

        const startIndex = 75;
        const endIndex = 251;
        const totalFramesDobra3 = endIndex - startIndex + 1; // 177 frames
        const currentFrameDobra3 = { index: 0 };
        const imagesDobra3 = [];

        // Pré-carrega todos os 177 frames JPEG na memória
        for (let i = startIndex; i <= endIndex; i++) {
            const img = new Image();
            const frameId = i.toString().padStart(3, '0');
            img.src = `assets/RAW/Video%20Dobra%203%20JPG/Timeline%201_00090${frameId}.jpg`;
            imagesDobra3.push(img);
        }

        const renderDobra3 = () => {
            const frameIdx = Math.floor(currentFrameDobra3.index);
            const img = imagesDobra3[frameIdx];
            if (img && img.complete) {
                ctxDobra3.clearRect(0, 0, dobra3Canvas.width, dobra3Canvas.height);
                ctxDobra3.drawImage(img, 0, 0, dobra3Canvas.width, dobra3Canvas.height);
            }
        };

        // Mostra o primeiro frame assim que carrega
        if (imagesDobra3[0]) imagesDobra3[0].onload = renderDobra3;

        // ScrollTrigger: desliza entre os 177 frames durante o scroll
        gsap.timeline({
            scrollTrigger: {
                trigger: "#dobra3-canvas-container",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
                onUpdate: () => requestAnimationFrame(renderDobra3)
            }
        })
        .to(currentFrameDobra3, { index: totalFramesDobra3 - 1, ease: "none" }, 0)
        .fromTo(dobra3Canvas,
            { scale: 1.0, yPercent: 0 },
            { scale: 1.15, yPercent: 5, ease: "none" },
            0
        );
    }

    // --- SEGUNDA DOBRA ANIMATIONS ---
    
    // Parallax Glow na Frente da cor sólida - Surge iluminando a superfície do fundo da dobra 2
    gsap.fromTo('#fold-glow-parallax', 
        { y: -60, opacity: 0, scale: 0.9 },
        {
            y: 60, // brilho desce um pouco enquanto a dobra sobe, dando o parallax perfeito
            opacity: 1,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: "#second-fold",
                start: "top 95%",
                end: "top 10%",
                scrub: 1
            }
        }
    );

    // Título Fade In (Scroll trigger simples)
    gsap.from(".fold-title-anim", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#second-fold",
            start: "top 80%",
            toggleActions: "play reverse play reverse"
        }
    });

    // Cartão de Textos em Glassmorphism
    gsap.from("#design-system-card", {
        y: 120,
        opacity: 0,
        filter: "blur(20px)",
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#second-fold",
            start: "top 65%",
            toggleActions: "play none none reverse"
        }
    });

    // Linhas internas da tipografia
    gsap.from(".row-anim", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#design-system-card",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // --- TERCEIRA DOBRA ANIMATIONS ---
    
    const thirdFoldElements = gsap.utils.toArray('.fade-up-3');
    thirdFoldElements.forEach(el => {
        gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%", // fade suave mais centralizado na tela
                toggleActions: "play none none reverse"
            }
        });
    });

    // Parallax Scrub Suave para as Imagens Editoriais da Terceira Dobra
    const thirdFoldImages = gsap.utils.toArray('.fade-up-img');
    thirdFoldImages.forEach(img => {
        gsap.fromTo(img, 
            { y: 60, opacity: 0, scale: 0.95 },
            { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top 95%",
                    end: "bottom 30%", // EXTREMAMENTE SUAVE: opacidade só chega em 1.0 quando a imagem subir bem no topo
                    scrub: 1.5
                }
            });
    });

    // Atualiza o gatilho da cor da UI (Cursor) baseada na extensão clara
    ScrollTrigger.create({
        trigger: "#second-fold-wrapper",
        start: "top 45%",
        endTrigger: "#third-fold",
        end: "bottom top",
        onEnter: () => document.body.classList.add('second-fold-active'),
        onLeaveBack: () => document.body.classList.remove('second-fold-active')
    });

    // --- DOBRA 5: CINEMATIC VIDEO STACKING ANIMATIONS ---
    const vidSection = document.getElementById('fifth-fold-videos');
    if (vidSection) {
        const vidCards = gsap.utils.toArray('.vid-card');
        const videos = vidCards.map(c => c.querySelector('video'));
        const titles = vidCards.map(c => c.querySelector('.vid-title'));

        let tlVids = gsap.timeline({
            scrollTrigger: {
                trigger: vidSection,
                start: "top top",
                end: "+=900%", // 9 fases: 4 transições de cards + 5 pausas/respiros (1 por vídeo)
                scrub: true,
                pin: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    let activeIdx = 0;
                    // Dividindo 1.0 por 9 fases (0.111 cada)
                    if (p < 0.111) activeIdx = 0; // Fase 0: Respiro Vid 1
                    else if (p < 0.333) activeIdx = 1; // Fase 1 & 2: Transição e Respiro Vid 2
                    else if (p < 0.555) activeIdx = 2; // Fase 3 & 4: Transição e Respiro Vid 3
                    else if (p < 0.777) activeIdx = 3; // Fase 5 & 6: Transição e Respiro Vid 4
                    else activeIdx = 4; // Fases finais focam no Vid 5
                    
                    videos.forEach((vid, i) => {
                        // O vídeo ATIVO sendo o corpo majoritário (80% visível ou 100%)
                        if (i === activeIdx) {
                            if(vid.paused) {
                                let playPromise = vid.play();
                                if (playPromise !== undefined) {
                                    playPromise.catch(error => { console.log('Autoplay prevent:', error); });
                                }
                            }
                            titles[i].style.opacity = '1';
                            titles[i].style.transform = 'scale(1)';
                        } else {
                            // Todo o resto é pausado imediatamente (economia de CPU/GPU e narrativa coreta)
                            if(!vid.paused) vid.pause();
                            
                            // A carta "Header" (a imediatamente anterior que recuou e se mostra em 20%)
                            if(i === activeIdx - 1) {
                                titles[i].style.opacity = '0.5';
                                titles[i].style.transform = 'scale(0.95)';
                            } else {
                                titles[i].style.opacity = '0';
                            }
                        }
                    });
                }
            }
        });

        // FASE 0: Respiro Vídeo 1 (Tela inteira original)
        tlVids.to({}, { duration: 1 }, "f0");

        // FASE 1: Transição Card 2 sobe
        tlVids.to(vidCards[1], { yPercent: -80, ease: "none", duration: 1 }, "f1"); 

        // FASE 2: Respiro Vídeo 2
        tlVids.to({}, { duration: 1 }, "f2");

        // FASE 3: Transição Card 3
        tlVids.add("f3")
              .to(vidCards[0], { yPercent: -20, ease: "none", duration: 1 }, "f3")
              .to(vidCards[1], { yPercent: -100, ease: "none", duration: 1 }, "f3")
              .to(vidCards[2], { yPercent: -80, ease: "none", duration: 1 }, "f3");

        // FASE 4: Respiro Vídeo 3
        tlVids.to({}, { duration: 1 }, "f4");

        // FASE 5: Transição Card 4
        tlVids.add("f5")
              .to(vidCards[1], { yPercent: -120, ease: "none", duration: 1 }, "f5")
              .to(vidCards[2], { yPercent: -100, ease: "none", duration: 1 }, "f5")
              .to(vidCards[3], { yPercent: -80, ease: "none", duration: 1 }, "f5");

        // FASE 6: Respiro Vídeo 4
        tlVids.to({}, { duration: 1 }, "f6");

        // FASE 7: Transição Card 5
        tlVids.add("f7")
              .to(vidCards[2], { yPercent: -120, ease: "none", duration: 1 }, "f7")
              .to(vidCards[3], { yPercent: -100, ease: "none", duration: 1 }, "f7")
              .to(vidCards[4], { yPercent: -80, ease: "none", duration: 1 }, "f7");

        // FASE 8: Respiro Vídeo 5 estendido no final
        tlVids.to({}, { duration: 1 }, "f8");
    }

    // --- DOBRA 7: Parceria Scroll Tracker & Stop/Scroll ---
    const partnershipSection = document.getElementById('seventh-fold-partnership');
    const partnershipDot = document.getElementById('parceria-dot');
    const textCol = partnershipSection?.querySelector('.partnership-text-col');

    if (partnershipSection && textCol && window.innerWidth >= 1024) {
        let tlPartnership = gsap.timeline({
            scrollTrigger: {
                trigger: partnershipSection,
                start: "top top",
                end: () => `+=${textCol.scrollHeight - window.innerHeight + (window.innerHeight * 0.2)}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Move a coluna de texto para cima criando o efeito parallax
        tlPartnership.to(textCol, {
            y: () => -(textCol.scrollHeight - window.innerHeight + (window.innerHeight * 0.2)),
            ease: "none"
        }, 0);

        // Move a bolinha amarela sincronizada
        if (partnershipDot) {
            tlPartnership.to(partnershipDot, {
                top: "100%",
                y: "-100%",
                ease: "none"
            }, 0);
        }
    } else if (partnershipSection && partnershipDot && window.innerWidth < 1024) {
        // Fallback Mobile
        gsap.to(partnershipDot, {
            top: "100%",
            y: "-100%",
            ease: "none",
            scrollTrigger: {
                trigger: partnershipSection,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.15
            }
        });
    }

    // --- DOBRA 8: Closure Video Parallax Scrub ---
    const closureSection = document.getElementById('eighth-fold-closure');
    const closureVideo = document.getElementById('parceria-closure-video');
    
    if (closureSection && closureVideo) {
        gsap.to(closureVideo, {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
                trigger: closureSection,
                start: "top bottom", // Inicia ao entrar na tela por baixo
                end: "top top", // Termina quando chega no topo exato
                scrub: true
            }
        });
    }

    // --- MAGIC CURSOR SYSTEM ---
    const magicCursor = document.createElement('div');
    magicCursor.id = 'magic-cursor';
    document.body.appendChild(magicCursor);

    let mcX = window.innerWidth / 2;
    let mcY = window.innerHeight / 2;
    let mcTargetX = mcX;
    let mcTargetY = mcY;
    let mcState = 'default';
    magicCursor.className = 'mc-default';

    const mcStyle = document.createElement('style');
    mcStyle.innerHTML = `
        @media (pointer: fine) {
            body, a, button, input {
                cursor: none !important;
            }
        }
        #magic-cursor {
            pointer-events: none;
            position: fixed;
            top: 0; left: 0;
            border-radius: 50%;
            z-index: 99999;
            transform-origin: center center;
            transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1), height 0.4s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.4s, backdrop-filter 0.4s, mix-blend-mode 0.4s;
            will-change: width, height, transform;
            display: none;
        }
        @media (pointer: fine) {
            #magic-cursor {
                display: block;
            }
        }
        .mc-default {
            width: 10px;
            height: 10px;
            background-color: white;
            mix-blend-mode: difference;
        }
        .mc-text {
            width: 5px;
            height: 5px;
            background-color: white;
            mix-blend-mode: difference;
        }
        .mc-lens {
            width: 36px;
            height: 36px;
            background-color: rgba(255,255,255,0.02);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.15);
            mix-blend-mode: normal;
        }
    `;
    document.head.appendChild(mcStyle);

    gsap.ticker.add(() => {
        mcX += (mcTargetX - mcX) * 0.15;
        mcY += (mcTargetY - mcY) * 0.15;
        magicCursor.style.transform = `translate(calc(-50% + ${mcX}px), calc(-50% + ${mcY}px))`;
    });

    document.addEventListener('mousemove', (e) => {
        mcTargetX = e.clientX;
        mcTargetY = e.clientY;

        const target = e.target;
        const tagName = target.tagName.toUpperCase();
        
        const textTags = ['H1','H2','H3','H4','H5','H6','P','SPAN','A','BUTTON','LI'];
        let nextState = 'default';

        if (textTags.includes(tagName) && target.innerText.trim() !== '') {
            nextState = 'text';
        } else if (target.closest('img, video, canvas, [data-cursor="lens"]')) {
            nextState = 'lens';
        }

        if (mcState !== nextState) {
            mcState = nextState;
            magicCursor.className = 'mc-' + nextState;
            
            const oldFollower = document.getElementById('cursor-follower');
            if (oldFollower) {
                oldFollower.style.opacity = nextState === 'default' ? '1' : '0';
            }
        }
    });

    // ────────────────────────────────────────────────────────────
    //  DOBRA 4 — BARRA DE PROGRESSO DE SCROLL
    // ────────────────────────────────────────────────────────────
    const fold4El   = document.getElementById('fold4-progress');
    const fold4Fill = document.getElementById('fold4-fill');

    if (fold4El && fold4Fill) {
        ScrollTrigger.create({
            trigger: '#fifth-fold-videos', // APENAS NO BLOCO DOS VIDEOS
            start: 'top top',              // Começa assim que o vídeo "A leveza" fixa na tela
            end: '+=900%',                 // Termina junto com a animação dos 5 vídeos (900% do height)
            onEnter:     () => fold4El.classList.add('visible'),
            onLeave:     () => fold4El.classList.remove('visible'),
            onEnterBack: () => fold4El.classList.add('visible'),
            onLeaveBack: () => fold4El.classList.remove('visible'),
            onUpdate: (self) => {
                fold4Fill.style.height = (self.progress * 100) + '%';
            }
        });
    }

});
