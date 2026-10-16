/**
 * Cyrolabz Website Application Logic
 * 1. Theme Management (Auto, Light, Dark)
 * 2. Web Audio Sound FX Engine Hooks
 * 3. Navigation & ScrollSpy
 * 4. 3D System Core (Orbital Interactive Showcase via Three.js / Canvas 3D)
 * 5. 7-Part Service Page Template Drawer & Registry
 * 6. Work / Case Studies Category Filtering
 * 7. Technical Insights Briefings Modal Reader
 * 8. Interactive Scope Estimator & Audit Calculator
 * 9. Contact Form Particle Convergence Canvas & Form Dispatch
 * 10. Privacy Policy & Terms Modal
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var root = document.documentElement;

  /* -------------------------------------------------------------
   * 1. THEME MANAGEMENT (Auto, Light, Dark)
   * ------------------------------------------------------------- */
  var themeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-theme-set]'));

  function currentThemeMode() {
    var t = root.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : 'auto';
  }

  function syncThemeUI() {
    var mode = currentThemeMode();
    themeBtns.forEach(function (btn) {
      var isPressed = btn.getAttribute('data-theme-set') === mode;
      btn.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
    });
  }

  try {
    var savedTheme = localStorage.getItem('cyrolabz-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      root.setAttribute('data-theme', savedTheme);
    }
  } catch (e) {}

  themeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-theme-set');
      if (target === 'auto') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', target);
      }
      try {
        localStorage.setItem('cyrolabz-theme', target);
      } catch (e) {}
      syncThemeUI();
      if (window.CyroAudio) window.CyroAudio.tick();
    });
  });

  syncThemeUI();

  /* -------------------------------------------------------------
   * 2. PROCEDURAL SOUND FX TOGGLE
   * ------------------------------------------------------------- */
  var soundBtn = document.getElementById('soundToggle');
  var soundIcoOn = document.getElementById('soundIcoOn');
  var soundIcoOff = document.getElementById('soundIcoOff');

  function syncSoundUI() {
    if (!window.CyroAudio) return;
    var muted = window.CyroAudio.isMuted();
    if (soundBtn) {
      soundBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
      soundBtn.title = muted ? 'Enable Sound FX' : 'Mute Sound FX';
    }
    if (soundIcoOn) soundIcoOn.hidden = muted;
    if (soundIcoOff) soundIcoOff.hidden = !muted;
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      if (window.CyroAudio) {
        window.CyroAudio.toggleMute();
        syncSoundUI();
      }
    });
    syncSoundUI();
  }

  /* -------------------------------------------------------------
   * 3. NAVIGATION, STICKY HEADER & MOBILE DRAWER
   * ------------------------------------------------------------- */
  var navHeader = document.querySelector('.site-nav');
  var mobileToggle = document.getElementById('mobileNavToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link, .mobile-nav-link'));

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      if (navHeader) navHeader.classList.add('is-scrolled');
    } else {
      if (navHeader) navHeader.classList.remove('is-scrolled');
    }
    updateScrollSpy();
  }, { passive: true });

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-locked', isOpen);
      if (window.CyroAudio) window.CyroAudio.tick();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          if (mobileMenu && mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-locked');
          }
          var navHeight = navHeader ? navHeader.offsetHeight : 76;
          var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          if (window.CyroAudio) window.CyroAudio.tick();
        }
      }
    });
  });

  var sectionIds = ['story', 'services', 'about', 'process', 'system-core', 'work', 'insights', 'calculator', 'contact'];
  function updateScrollSpy() {
    var scrollPos = window.scrollY + 180;
    var currentSection = '';

    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        var top = el.offsetTop;
        var height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = id;
        }
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  /* -------------------------------------------------------------
   * 4. 3D SYSTEM CORE (Orbital Interactive Showcase via Three.js)
   * ------------------------------------------------------------- */
  (function init3DSystemCore() {
    var canvas = document.getElementById('core3dCanvas');
    var container = document.getElementById('coreCanvasContainer');
    var hudFps = document.getElementById('hudFps');
    var btnSpeedNormal = document.getElementById('btnCoreSpeedNormal');
    var btnSpeedFast = document.getElementById('btnCoreSpeedFast');
    var btnFreeze = document.getElementById('btnCoreFreeze');
    var btnModeWire = document.getElementById('btnCoreModeWire');
    var btnModeSolid = document.getElementById('btnCoreModeSolid');
    var btnPulse = document.getElementById('btnCorePulse');

    if (!canvas || !container) return;

    var speedMultiplier = 1.0;
    var isWireframe = true;
    var pulseScale = 1.0;

    if (typeof THREE !== 'undefined') {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 5, 22);

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);

      // Orbital Group
      var coreGroup = new THREE.Group();
      scene.add(coreGroup);

      // Central Orb (Core)
      var coreGeo = new THREE.IcosahedronGeometry(3.2, 3);
      var coreMat = new THREE.MeshBasicMaterial({
        color: 0x2F6BFF,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      var coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(coreMesh);

      // Inner Core Glow
      var innerGeo = new THREE.SphereGeometry(2.2, 16, 16);
      var innerMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      var innerMesh = new THREE.Mesh(innerGeo, innerMat);
      coreGroup.add(innerMesh);

      // Orbital Rings
      var rings = [];
      var ringRadii = [5.5, 7.8, 10.2];
      var ringIncs = [0.25, -0.4, 0.6];

      ringRadii.forEach(function (radius, idx) {
        var ringGeo = new THREE.RingGeometry(radius - 0.04, radius + 0.04, 64);
        var ringMat = new THREE.MeshBasicMaterial({
          color: idx === 1 ? 0x2F6BFF : 0x4B5563,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        var ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + ringIncs[idx];
        ringMesh.rotation.y = ringIncs[idx] * 0.5;
        coreGroup.add(ringMesh);
        rings.push(ringMesh);
      });

      // Orbiting Satellites
      var satellites = [];
      var satGeo = new THREE.SphereGeometry(0.24, 8, 8);
      var satMat = new THREE.MeshBasicMaterial({ color: 0x6C97FF });

      for (var s = 0; s < 12; s++) {
        var sat = new THREE.Mesh(satGeo, satMat);
        var ringIdx = s % 3;
        sat.userData = {
          radius: ringRadii[ringIdx],
          angle: (s / 12) * Math.PI * 2,
          speed: (0.015 + (s % 3) * 0.008),
          tilt: ringIncs[ringIdx]
        };
        coreGroup.add(sat);
        satellites.push(sat);
      }

      // Pointer Interactivity
      var mouseX = 0, mouseY = 0, targetRotationX = 0, targetRotationY = 0;
      var isDragging = false, prevMouseX = 0, prevMouseY = 0;

      container.addEventListener('mousedown', function (e) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });

      window.addEventListener('mouseup', function () { isDragging = false; });

      container.addEventListener('mousemove', function (e) {
        var rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

        if (isDragging) {
          var deltaX = e.clientX - prevMouseX;
          var deltaY = e.clientY - prevMouseY;
          coreGroup.rotation.y += deltaX * 0.005;
          coreGroup.rotation.x += deltaY * 0.005;
          prevMouseX = e.clientX;
          prevMouseY = e.clientY;
        }
      });

      // Resize
      window.addEventListener('resize', function () {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });

      // Controls Binding
      if (btnSpeedNormal) {
        btnSpeedNormal.addEventListener('click', function () {
          speedMultiplier = 1.0;
          setActiveSpeedBtn(btnSpeedNormal);
          if (window.CyroAudio) window.CyroAudio.tick();
        });
      }
      if (btnSpeedFast) {
        btnSpeedFast.addEventListener('click', function () {
          speedMultiplier = 2.5;
          setActiveSpeedBtn(btnSpeedFast);
          if (window.CyroAudio) window.CyroAudio.tick();
        });
      }
      if (btnFreeze) {
        btnFreeze.addEventListener('click', function () {
          speedMultiplier = 0.0;
          setActiveSpeedBtn(btnFreeze);
          if (window.CyroAudio) window.CyroAudio.tick();
        });
      }

      function setActiveSpeedBtn(activeBtn) {
        [btnSpeedNormal, btnSpeedFast, btnFreeze].forEach(function (btn) {
          if (btn) btn.classList.toggle('is-active', btn === activeBtn);
        });
      }

      if (btnModeWire) {
        btnModeWire.addEventListener('click', function () {
          coreMat.wireframe = true;
          btnModeWire.classList.add('is-active');
          if (btnModeSolid) btnModeSolid.classList.remove('is-active');
          if (window.CyroAudio) window.CyroAudio.tick();
        });
      }
      if (btnModeSolid) {
        btnModeSolid.addEventListener('click', function () {
          coreMat.wireframe = false;
          btnModeSolid.classList.add('is-active');
          if (btnModeWire) btnModeWire.classList.remove('is-active');
          if (window.CyroAudio) window.CyroAudio.tick();
        });
      }
      if (btnPulse) {
        btnPulse.addEventListener('click', function () {
          pulseScale = 1.45;
          if (window.CyroAudio) window.CyroAudio.signalChime();
        });
      }

      // Render Loop
      var lastTime = performance.now();
      var frames = 0, fpsTimer = 0;

      function animate(now) {
        requestAnimationFrame(animate);
        var delta = (now - lastTime) / 1000;
        lastTime = now;

        // FPS meter
        frames++;
        fpsTimer += delta;
        if (fpsTimer >= 0.5) {
          if (hudFps) hudFps.textContent = (frames / fpsTimer).toFixed(1);
          frames = 0;
          fpsTimer = 0;
        }

        // Pulse decay
        if (pulseScale > 1.0) {
          pulseScale -= (pulseScale - 1.0) * 0.08;
        }
        coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

        // Core rotation
        if (speedMultiplier > 0) {
          coreGroup.rotation.y += 0.008 * speedMultiplier;
          coreMesh.rotation.x += 0.005 * speedMultiplier;
          innerMesh.rotation.y -= 0.01 * speedMultiplier;
        }

        // Satellite orbits
        satellites.forEach(function (sat) {
          if (speedMultiplier > 0) {
            sat.userData.angle += sat.userData.speed * speedMultiplier;
          }
          var a = sat.userData.angle;
          var r = sat.userData.radius;
          var tilt = sat.userData.tilt;
          sat.position.x = Math.cos(a) * r;
          sat.position.z = Math.sin(a) * r;
          sat.position.y = Math.sin(a) * r * Math.tan(tilt);
        });

        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);

    } else {
      // Graceful Canvas 2D procedural fallback
      var ctx2d = canvas.getContext('2d');
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      var rot = 0;

      function render2d() {
        requestAnimationFrame(render2d);
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        var cx = canvas.width / 2, cy = canvas.height / 2;
        rot += 0.02 * speedMultiplier;

        ctx2d.strokeStyle = '#2F6BFF';
        ctx2d.lineWidth = 1.5;

        // Draw orbital rings
        [80, 140, 200].forEach(function (r, i) {
          ctx2d.beginPath();
          ctx2d.ellipse(cx, cy, r, r * 0.35, rot * (i % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
          ctx2d.stroke();
        });

        // Center orb
        ctx2d.beginPath();
        ctx2d.arc(cx, cy, 32 * pulseScale, 0, Math.PI * 2);
        ctx2d.fillStyle = 'rgba(47, 107, 255, 0.4)';
        ctx2d.fill();
        ctx2d.stroke();
      }
      render2d();
    }
  })();

  /* -------------------------------------------------------------
   * 5. 7-PART SERVICE PAGE TEMPLATE DRAWER & REGISTRY
   * ------------------------------------------------------------- */
  var SERVICE_REGISTRY = {
    'consulting': {
      chapter: '01 Foundation',
      headline: 'AI Consulting & Systems Architecture',
      artwork: 'Pixel Skyline',
      outcome: 'We assess enterprise data moats, compliance boundaries, and infrastructure feasibility to deliver an actionable transformation roadmap, eliminating speculative spending before writing code.',
      deliverables: [
        'Comprehensive Data Moat & Proprietary Asset Assessment',
        'Foundation Model Selection, Fine-Tuning & Quantization Strategy',
        'Private Cloud & Air-Gapped Zero-Trust Governance Framework',
        'Cost-Benefit Financial ROI Model & Executive Board Blueprint'
      ],
      steps: [
        { name: 'Discover', desc: 'Forensic audit of existing datasets, spreadsheets, internal APIs, and organizational bottlenecks.' },
        { name: 'Design', desc: 'Drafting data pipeline topologies, inference latency SLAs, and compliance boundaries.' },
        { name: 'Audit & Launch', desc: 'Pre-flight stress testing, safety benchmark evaluation, and executive signoff.' }
      ],
      proof: 'How We Work: Discover &rarr; Design &rarr; Build &rarr; Audit & Launch &rarr; Evolve.',
      related: ['audits'],
      ctaService: 'Consulting & AI Architecture'
    },
    'audits': {
      chapter: '01 Foundation',
      headline: 'Forensic Technical & Security Audits',
      artwork: 'Pixel Skyline',
      outcome: 'Exposes structural codebase bottlenecks, dependency rot, AI safety compliance liabilities, and security vulnerabilities with a zero-trust executive scorecard and prioritized remediation matrix.',
      deliverables: [
        'Static AST Code Analysis & Architectural Bottleneck Profiling',
        'OWASP API Top 10 & Zero-Trust Perimeter Vulnerability Audit',
        'AI Safety, Training Data Provenance & Leakage Assessment',
        'Board-Ready Risk Scorecard with Fixed-Timeline Remediation Plan'
      ],
      steps: [
        { name: 'Discover', desc: 'Automated deep-scan of repository trees, secret storage, and permission policies.' },
        { name: 'Audit & Launch', desc: 'Adversarial prompt injection simulations and load-concurrency stress testing.' },
        { name: 'Evolve', desc: 'Continuous compliance tracking and regression verification monitors.' }
      ],
      proof: 'Case Study: Pre-acquisition forensic audit executed in 14 days with zero downtime.',
      related: ['consulting'],
      ctaService: 'Forensic Technical Audits'
    },
    'website': {
      chapter: '02 Connect',
      headline: 'Website Development & Platform Experiences',
      artwork: 'Circuit Network',
      outcome: 'Transforms sluggish marketing templates into high-performance, precision-engineered digital platforms with Swiss typography, sub-second response times, and 90+ Core Web Vitals.',
      deliverables: [
        'Semantic HTML5 & Vanilla CSS Architecture (Zero Layout Shifts)',
        'Full Light/Dark Dual-Theme Persistence with Contrast Accessibility',
        'Technical SEO Schema Graph & Programmatic Meta Pipeline',
        'High-Conversion Interaction Funnels & Responsive Mobile Framework'
      ],
      steps: [
        { name: 'Discover', desc: 'Information architecture audit, audience journey mapping, and brand geometry review.' },
        { name: 'Design', desc: 'Swiss typography scales, corner mark framing, and micro-animation systems.' },
        { name: 'Build', desc: 'Ultra-lightweight engineering, zero bloat, and sub-second asset delivery.' }
      ],
      proof: 'Tested 99.8% Core Web Vitals score on mobile and desktop runtimes.',
      related: ['3d-design', 'software'],
      ctaService: 'Website Development'
    },
    '3d-design': {
      chapter: '02 Connect',
      headline: '3D Interactive & Spatial Design',
      artwork: 'Circuit Network',
      outcome: 'Makes complex digital infrastructure, abstract algorithms, and spatial kinematics tangible through 60 FPS WebGL, Three.js shaders, and interactive point-cloud simulations.',
      deliverables: [
        'Custom 11,000-Point Canvas Particle Simulation & Morphing Engines',
        'Interactive Three.js Spatial Shaders with Cursor Gravitational Pull',
        'Mobile-Optimized GPU Render Pipelines with Fallback States',
        'Procedural Web Audio Haptic & Sound Synchronization Layer'
      ],
      steps: [
        { name: 'Design', desc: 'Spatial coordinate mapping, lighting topologies, and particle physics rules.' },
        { name: 'Build', desc: 'High-performance WebGL buffers, shader compiling, and touch gesture handling.' },
        { name: 'Audit & Launch', desc: 'Cross-browser frame rate profiling and reduced-motion compliance verification.' }
      ],
      proof: 'Case Study: Robotics spatial digital twin maintaining 60 FPS on iOS and Android.',
      related: ['website', 'software'],
      ctaService: '3D Interactive & Spatial Design'
    },
    'software': {
      chapter: '02 Connect',
      headline: 'Custom Software & Distributed Systems',
      artwork: 'Circuit Network',
      outcome: 'Eliminates brittle operational spreadsheets and legacy software silos by engineering high-concurrency cloud backends, resilient event streams, and unified microservices.',
      deliverables: [
        'Distributed Event-Driven Microservices (Go / Rust / Node.js)',
        'Unified GraphQL & RESTful API Gateway Integration',
        'Zero-Downtime Data Migration & Event Bus Topology',
        'Cloud-Native Containerization & Multi-Region Kubernetes Orchestration'
      ],
      steps: [
        { name: 'Discover', desc: 'Schema reverse-engineering, throughput profiling, and database bottleneck mapping.' },
        { name: 'Design', desc: 'Event stream architecture, consistency models, and resilient failover logic.' },
        { name: 'Build', desc: 'High-concurrency systems build with automated CI/CD and stress verification.' }
      ],
      proof: 'Case Study: Logistics telemetry platform handling sub-10ms events across 42 hubs.',
      related: ['website', '3d-design'],
      ctaService: 'Custom Software Development'
    },
    'ai-enablement': {
      chapter: '03 Intelligence',
      headline: 'AI Enablement & Autonomous Workflows',
      artwork: 'Dissolving Face',
      outcome: 'Deploys grounded enterprise copilots, hybrid vector retrieval engines, and autonomous multi-agent task routing with deterministic guardrails and zero hallucination risk.',
      deliverables: [
        'Hybrid Vector + Lexical RAG with Exact Citation Verification',
        'Multi-Agent Autonomous Orchestration & Dynamic Tool Calling Mesh',
        'Low-Latency Semantic Caching & Adversarial Prompt Firewalls',
        'Continuous Model Drift Telemetry & Automated Evaluation Benchmark Loops'
      ],
      steps: [
        { name: 'Discover', desc: 'Unstructured document analysis, domain taxonomy creation, and moat extraction.' },
        { name: 'Design', desc: 'Agent state machine architecture, fallback routes, and deterministic guardrails.' },
        { name: 'Build', desc: 'Air-gapped deployment of private embedding models and orchestration pipelines.' }
      ],
      proof: 'Case Study: Regulatory research turnaround slashed from 3.5 days to under 4 seconds.',
      related: ['consulting', 'software'],
      ctaService: 'AI Enablement & Implementation'
    }
  };

  var drawerOverlay = document.getElementById('serviceDrawerOverlay');
  var drawerCloseBtn = document.getElementById('sdCloseBtn');
  var sdChapterTag = document.getElementById('sdChapterTag');
  var sdBody = document.getElementById('sdBody');

  function openServiceDrawer(serviceKey) {
    var data = SERVICE_REGISTRY[serviceKey];
    if (!data || !drawerOverlay || !sdBody) return;

    if (sdChapterTag) sdChapterTag.textContent = data.chapter + ' · ' + data.artwork;

    var stepsHtml = data.steps.map(function (step) {
      return '<div class="sd-step-box">' +
        '<h5>' + step.name + '</h5>' +
        '<p>' + step.desc + '</p>' +
      '</div>';
    }).join('');

    var delivHtml = data.deliverables.map(function (d) {
      return '<li>' + d + '</li>';
    }).join('');

    var relatedHtml = data.related.map(function (relKey) {
      var relData = SERVICE_REGISTRY[relKey];
      return relData ? '<button type="button" class="btn-secondary sd-switch-service" data-switch="' + relKey + '" style="font-size: 0.625rem; padding: 6px 12px;">' + relData.headline + '</button>' : '';
    }).join(' ');

    sdBody.innerHTML =
      '<div>' +
        '<h2 style="font-size: 1.8rem; margin: 0 0 14px; letter-spacing: -0.02em;">' + data.headline + '</h2>' +
        '<div class="sd-section-title">02 · Enterprise Outcome</div>' +
        '<p style="color: var(--ink); font-size: 1.05rem; line-height: 1.6; margin: 0;">' + data.outcome + '</p>' +
      '</div>' +

      '<div>' +
        '<div class="sd-section-title">03 · Verified Deliverables</div>' +
        '<ul class="sd-deliverables-list">' + delivHtml + '</ul>' +
      '</div>' +

      '<div>' +
        '<div class="sd-section-title">04 · How It Works (Methodology Steps)</div>' +
        '<div class="sd-steps-grid">' + stepsHtml + '</div>' +
      '</div>' +

      '<div style="padding: 16px; border: 1px dashed var(--line); border-radius: var(--radius-sm); background: var(--bg-card);">' +
        '<div class="sd-section-title">05 · Engineering Proof</div>' +
        '<p style="margin: 0; font-size: 0.9rem; color: var(--muted);">' + data.proof + '</p>' +
      '</div>' +

      '<div>' +
        '<div class="sd-section-title">06 · Related Chapter Capabilities</div>' +
        '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' + relatedHtml + '</div>' +
      '</div>' +

      '<div style="padding-top: 20px; border-top: 1px solid var(--line); display: flex; gap: 12px; flex-wrap: wrap;">' +
        '<button type="button" class="btn-primary sd-book-btn" data-preset-service="' + data.ctaService + '" style="flex: 1; justify-content: center; padding: 14px 20px;">' +
          'Book a Free Consultation' +
        '</button>' +
        '<button type="button" class="btn-secondary sd-book-btn" data-preset-service="' + data.ctaService + '" style="justify-content: center; padding: 14px 20px;">' +
          'Start a Project' +
        '</button>' +
      '</div>';

    drawerOverlay.classList.add('is-open');
    drawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-locked');

    // Attach switch triggers
    var switchBtns = Array.prototype.slice.call(sdBody.querySelectorAll('.sd-switch-service'));
    switchBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var sk = b.getAttribute('data-switch');
        openServiceDrawer(sk);
        if (window.CyroAudio) window.CyroAudio.tick();
      });
    });

    // Attach booking triggers inside drawer
    var bookBtns = Array.prototype.slice.call(sdBody.querySelectorAll('.sd-book-btn'));
    bookBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var servicePreset = b.getAttribute('data-preset-service');
        closeServiceDrawer();
        var bookingServiceSelect = document.getElementById('bookingService');
        if (bookingServiceSelect && servicePreset) {
          bookingServiceSelect.value = servicePreset;
        }
        var contactEl = document.getElementById('contact');
        if (contactEl) {
          var navHeight = navHeader ? navHeader.offsetHeight : 76;
          window.scrollTo({
            top: contactEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10,
            behavior: 'smooth'
          });
        }
        if (window.CyroAudio) window.CyroAudio.signalChime();
      });
    });

    if (window.CyroAudio) window.CyroAudio.tick();
  }

  function closeServiceDrawer() {
    if (!drawerOverlay) return;
    drawerOverlay.classList.remove('is-open');
    drawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-locked');
    if (window.CyroAudio) window.CyroAudio.tick();
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeServiceDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', function (e) {
      if (e.target === drawerOverlay) closeServiceDrawer();
    });
  }

  // Trigger buttons across page
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open-service]');
    if (trigger) {
      var sKey = trigger.getAttribute('data-open-service');
      openServiceDrawer(sKey);
    }
  });

  /* -------------------------------------------------------------
   * 6. WORK & CASE STUDIES FILTERING
   * ------------------------------------------------------------- */
  var workTabs = Array.prototype.slice.call(document.querySelectorAll('.work-tab'));
  var caseCards = Array.prototype.slice.call(document.querySelectorAll('.case-card'));

  workTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      workTabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var filter = tab.getAttribute('data-filter');

      caseCards.forEach(function (card) {
        var cat = card.getAttribute('data-case-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      if (window.CyroAudio) window.CyroAudio.tick();
    });
  });

  /* -------------------------------------------------------------
   * 7. TECHNICAL INSIGHTS MODAL READER
   * ------------------------------------------------------------- */
  var INSIGHT_ARTICLES = {
    'article-1': {
      chapter: '01 Foundation',
      title: 'De-risking Enterprise LLMs: The Pre-Deployment Audit Protocol',
      meta: 'Author: Systems Audit Practice · Published October 2026',
      content:
        '<h4>1. The Anatomy of Enterprise AI POC Failure</h4>' +
        '<p>Over 80% of enterprise generative AI pilots stall before reaching broad production rollout. The breakdown rarely stems from foundational model reasoning capabilities; rather, it originates in the failure to enforce deterministic governance, provenance tracking, and data leak boundaries prior to deployment.</p>' +
        '<h4>2. The Three-Tier Audit Checklist</h4>' +
        '<p>Before exposing any internal data moat to fine-tuning or retrieval augmented pipelines, our forensic audit practice enforces three non-negotiable gates:</p>' +
        '<ul>' +
          '<li><strong>Provenance & Data Sanitization:</strong> Strict PII scrubbing and intellectual property entitlement verification to prevent training data contamination.</li>' +
          '<li><strong>Adversarial Injection Benchmarking:</strong> Simulating indirect prompt injection, extraction attacks, and perimeter bypasses.</li>' +
          '<li><strong>Deterministic Verification Ensembles:</strong> Pairing non-deterministic LLM generation with static validation filters that guarantee exact factual grounding.</li>' +
        '</ul>' +
        '<h4>3. Executive Recommendation</h4>' +
        '<p>Never deploy applied AI without an independent, partner-level technical audit. A 14-day pre-deployment inspection saves an average of $380,000 in remediation and protects critical organizational reputation.</p>'
    },
    'article-2': {
      chapter: '02 Connect',
      title: 'Beyond Wrappers: Engineering Resilient API Nervous Systems',
      meta: 'Author: Software Engineering Practice · Published September 2026',
      content:
        '<h4>1. The Trap of Superficial SaaS Glue</h4>' +
        '<p>In modern enterprises, departments rapidly acquire dozens of point solutions, connecting them via fragile webhook scripts and no-code connectors. When schema definitions drift or third-party rate limits fire, the operational nervous system experiences silent data blackouts.</p>' +
        '<h4>2. Designing an Event-Driven Core</h4>' +
        '<p>Cyrolabz engineers replace ad-hoc wiring with an unified, immutable event bus. Disparate ERPs, CRM databases, and proprietary models publish strongly-typed events to a high-concurrency message mesh built in Go or Rust. Every state mutation is logged, traceable, and replayable.</p>' +
        '<h4>3. Quantified Outcomes</h4>' +
        '<p>By adopting decoupled event streams, enterprises reduce integration maintenance overhead by 46% while unlocking sub-second data synchronization across distributed global endpoints.</p>'
    },
    'article-3': {
      chapter: '03 Intelligence',
      title: 'Autonomous Multi-Agent Orchestration with Deterministic Guardrails',
      meta: 'Author: Applied AI Practice · Published August 2026',
      content:
        '<h4>1. Multi-Agent Systems in Regulated Industries</h4>' +
        '<p>Deploying autonomous agents to execute financial transactions, regulatory compliance filings, or medical workflows demands zero room for hallucinations. Traditional probabilistic agent loops quickly derail when allowed unbounded tool invocation.</p>' +
        '<h4>2. The Finite-State Guardrail Mesh</h4>' +
        '<p>Our engineering methodology encloses agent reasoning inside strict finite-state transition machines. Agents propose actions, but execution is gated by deterministic verification rules. If an action breaches policy or exceeds confidence thresholds, execution falls back immediately to human-in-the-loop oversight.</p>' +
        '<h4>3. The Future of Engineered Intelligence</h4>' +
        '<p>The future of enterprise software is not a chat box; it is an invisible, autonomous nervous system operating within verified parameters, turning static enterprise records into decisive organizational momentum.</p>'
    }
  };

  var insightModal = document.getElementById('insightModal');
  var imTitle = document.getElementById('imTitle');
  var imChapterTag = document.getElementById('imChapterTag');
  var imMeta = document.getElementById('imMeta');
  var imContent = document.getElementById('imContent');
  var imCloseBtn = document.getElementById('imCloseBtn');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-open-insight]');
    if (btn) {
      var artKey = btn.getAttribute('data-open-insight');
      var art = INSIGHT_ARTICLES[artKey];
      if (art && insightModal) {
        imTitle.textContent = art.title;
        imChapterTag.textContent = art.chapter;
        imMeta.textContent = art.meta;
        imContent.innerHTML = art.content;
        insightModal.classList.add('is-active');
        insightModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('nav-locked');
        if (window.CyroAudio) window.CyroAudio.tick();
      }
    }
  });

  if (imCloseBtn && insightModal) {
    imCloseBtn.addEventListener('click', function () {
      insightModal.classList.remove('is-active');
      insightModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-locked');
      if (window.CyroAudio) window.CyroAudio.tick();
    });
  }

  /* -------------------------------------------------------------
   * 8. INTERACTIVE SCOPE ESTIMATOR & AUDIT CALCULATOR
   * ------------------------------------------------------------- */
  var calcMaturity = document.getElementById('calcMaturity');
  var calcDataScale = document.getElementById('calcDataScale');
  var calcObjective = document.getElementById('calcObjective');
  var calcTimeline = document.getElementById('calcTimeline');
  var calcOutMultiplier = document.getElementById('calcOutMultiplier');
  var calcOutHoursSaved = document.getElementById('calcOutHoursSaved');
  var calcOutDays = document.getElementById('calcOutDays');
  var calcOutTier = document.getElementById('calcOutTier');
  var calcApplyBtn = document.getElementById('calcApplyBtn');

  function calculateAuditEstimates() {
    if (!calcMaturity || !calcDataScale || !calcObjective || !calcTimeline) return;

    var maturity = calcMaturity.value;
    var scale = calcDataScale.value;
    var objective = calcObjective.value;
    var timeline = calcTimeline.value;

    var mult = 2.4;
    var hours = 80;
    var days = 21;
    var tier = 'Enterprise Modernization & AI Tier';

    if (maturity === 'legacy') { mult += 1.4; hours += 60; days += 7; }
    else if (maturity === 'hybrid') { mult += 0.8; hours += 40; days += 3; }
    else { mult += 0.4; hours += 20; }

    if (scale === 'enterprise') { mult += 0.9; hours += 80; days += 10; }
    else if (scale === 'large') { mult += 0.5; hours += 40; days += 5; }

    if (timeline === 'sprint') { days = Math.max(7, Math.round(days * 0.55)); }

    if (objective === 'ai-enable') {
      tier = 'Autonomous AI & Copilot Infrastructure Tier';
    } else if (objective === 'custom-sw') {
      tier = 'Unified Custom Platform & API Mesh Tier';
    } else if (objective === 'audit') {
      tier = 'Forensic Technical & AI Safety Audit Tier';
    } else if (objective === '3d-spatial') {
      tier = 'Interactive 3D WebGL & Spatial Experience Tier';
    }

    if (calcOutMultiplier) calcOutMultiplier.textContent = mult.toFixed(1) + 'x';
    if (calcOutHoursSaved) calcOutHoursSaved.textContent = hours + '+ hrs/mo';
    if (calcOutDays) calcOutDays.textContent = days + ' Days';
    if (calcOutTier) calcOutTier.textContent = tier;
  }

  [calcMaturity, calcDataScale, calcObjective, calcTimeline].forEach(function (input) {
    if (input) {
      input.addEventListener('change', function () {
        calculateAuditEstimates();
        if (window.CyroAudio) window.CyroAudio.tick();
      });
    }
  });

  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', function () {
      var contactEl = document.getElementById('contact');
      var bookingNotes = document.getElementById('bookingNotes');
      var bookingService = document.getElementById('bookingService');

      if (bookingNotes) {
        var summary = 'Scope Telemetry: Projected ' +
          (calcOutMultiplier ? calcOutMultiplier.textContent : '3.8x') + ' gain, ' +
          (calcOutHoursSaved ? calcOutHoursSaved.textContent : '140+ hrs/mo') + ', ' +
          (calcOutDays ? calcOutDays.textContent : '21 Days') + ' velocity. ' +
          'Tier: ' + (calcOutTier ? calcOutTier.textContent : 'Enterprise Tier') + '.';
        bookingNotes.value = summary + '\n\n' + bookingNotes.value;
      }

      if (bookingService && calcObjective) {
        if (calcObjective.value === 'ai-enable') bookingService.value = 'AI Enablement & Implementation';
        else if (calcObjective.value === 'custom-sw') bookingService.value = 'Custom Software Development';
        else if (calcObjective.value === 'audit') bookingService.value = 'Forensic Technical Audits';
        else if (calcObjective.value === '3d-spatial') bookingService.value = '3D Interactive & Spatial Design';
      }

      if (contactEl) {
        var navHeight = navHeader ? navHeader.offsetHeight : 76;
        window.scrollTo({
          top: contactEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10,
          behavior: 'smooth'
        });
      }

      if (window.CyroAudio) window.CyroAudio.signalChime();
    });
  }

  calculateAuditEstimates();

  /* -------------------------------------------------------------
   * 9. CONTACT FORM PARTICLES & SUBMISSION MODAL
   * ------------------------------------------------------------- */
  (function initContactParticles() {
    var cCv = document.getElementById('contactCv');
    if (!cCv) return;
    var ctx = cCv.getContext('2d');
    var pW = cCv.clientWidth || 400, pH = cCv.clientHeight || 500;
    cCv.width = pW; cCv.height = pH;

    var numP = 80;
    var parts = [];
    for (var i = 0; i < numP; i++) {
      parts.push({
        x: Math.random() * pW,
        y: Math.random() * pH,
        tx: pW / 2 + (Math.random() - 0.5) * 120,
        ty: pH / 2 + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        sz: 1.5 + Math.random() * 2
      });
    }

    function renderContact() {
      requestAnimationFrame(renderContact);
      ctx.clearRect(0, 0, pW, pH);
      var cs = getComputedStyle(root);
      var accentColor = cs.getPropertyValue('--accent').trim() || '#2F6BFF';
      ctx.fillStyle = accentColor;

      parts.forEach(function (p) {
        p.x += p.vx + (p.tx - p.x) * 0.005;
        p.y += p.vy + (p.ty - p.y) * 0.005;
        if (Math.abs(p.tx - p.x) < 2) p.tx = pW / 2 + (Math.random() - 0.5) * 160;
        if (Math.abs(p.ty - p.y) < 2) p.ty = pH / 2 + (Math.random() - 0.5) * 160;

        ctx.fillRect(p.x, p.y, p.sz, p.sz);
      });
    }
    renderContact();
  })();

  var bookingForm = document.getElementById('auditBookingForm');
  var confirmationModal = document.getElementById('bookingConfirmationModal');
  var modalRefCode = document.getElementById('modalRefCode');
  var modalCloseBtn = document.getElementById('modalCloseBtn');
  var btnStartProject = document.getElementById('btnStartProject');

  if (btnStartProject) {
    btnStartProject.addEventListener('click', function () {
      if (bookingForm) {
        bookingForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('bookingName');
      var emailInput = document.getElementById('bookingEmail');
      var companyInput = document.getElementById('bookingCompany');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !companyInput.value.trim()) {
        alert('Please complete your name, company, and work email.');
        return;
      }

      var code = 'CYRO-' + Math.floor(100000 + Math.random() * 900000);
      if (modalRefCode) modalRefCode.textContent = code;

      if (confirmationModal) {
        confirmationModal.classList.add('is-active');
        confirmationModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('nav-locked');
      }

      if (window.CyroAudio) window.CyroAudio.signalChime();
      bookingForm.reset();
    });
  }

  if (modalCloseBtn && confirmationModal) {
    modalCloseBtn.addEventListener('click', function () {
      confirmationModal.classList.remove('is-active');
      confirmationModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-locked');
      if (window.CyroAudio) window.CyroAudio.tick();
    });
  }

  /* -------------------------------------------------------------
   * 10. LEGAL MODAL (Privacy Policy & Terms)
   * ------------------------------------------------------------- */
  var legalModal = document.getElementById('legalModal');
  var legalTitle = document.getElementById('legalTitle');
  var legalContent = document.getElementById('legalContent');
  var legalCloseBtn = document.getElementById('legalCloseBtn');
  var footerPrivacy = document.getElementById('footerPrivacyLink');
  var footerTerms = document.getElementById('footerTermsLink');

  var LEGAL_DATA = {
    privacy: {
      title: 'Cyrolabz Mutual Privacy & Data Governance Protocol',
      content:
        '<h4>1. Zero-Data-Retention Commitment</h4>' +
        '<p>Cyrolabz adheres to strict air-gapped data retention practices. Client codebases, proprietary API payloads, and internal documentation analyzed during advisory, engineering, or audit engagements are never stored in third-party model training datasets or persistent shared storage.</p>' +
        '<h4>2. Confidentiality & Mutual NDA</h4>' +
        '<p>Prior to code analysis, technical telemetry review, or architectural inspection, Cyrolabz executes mutual non-disclosure agreements with enterprise partners, guaranteeing legal protection across international jurisdictions.</p>' +
        '<h4>3. Regulatory Standards</h4>' +
        '<p>Our architectures comply with SOC 2 Type II controls, ISO/IEC 42001 AI governance standards, and the NIST AI Risk Management Framework (RMF 1.0).</p>'
    },
    terms: {
      title: 'Cyrolabz Enterprise Engagement Terms of Service',
      content:
        '<h4>1. Scope of Advisory & Engineering Services</h4>' +
        '<p>All client deliverables—including custom software repositories, neural retrieval topologies, and forensic audit scorecards—are executed by senior partners and multidisciplinary engineers under strict milestone definitions.</p>' +
        '<h4>2. Intellectual Property Ownership</h4>' +
        '<p>Upon project completion and milestone fulfillment, all custom software, bespoke weights, and infrastructure automation scripts engineered for the client become 100% the exclusive intellectual property of the client.</p>' +
        '<h4>3. Forensic Audit Disclaimers</h4>' +
        '<p>Audit reports represent a point-in-time forensic inspection conducted against industry security standards (OWASP, NIST, ISO) and do not constitute an insurance policy against zero-day vulnerabilities outside the stated inspection scope.</p>'
    }
  };

  function openLegal(key) {
    var item = LEGAL_DATA[key];
    if (!item || !legalModal) return;
    legalTitle.textContent = item.title;
    legalContent.innerHTML = item.content;
    legalModal.classList.add('is-active');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-locked');
    if (window.CyroAudio) window.CyroAudio.tick();
  }

  if (footerPrivacy) footerPrivacy.addEventListener('click', function () { openLegal('privacy'); });
  if (footerTerms) footerTerms.addEventListener('click', function () { openLegal('terms'); });
  if (legalCloseBtn && legalModal) {
    legalCloseBtn.addEventListener('click', function () {
      legalModal.classList.remove('is-active');
      legalModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-locked');
      if (window.CyroAudio) window.CyroAudio.tick();
    });
  }

});
