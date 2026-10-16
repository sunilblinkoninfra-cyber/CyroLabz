/**
 * Cyrolabz Transformation Story Engine
 * 11,000-point morphing particle simulation across 4 chapters.
 */
(function (root) {
  'use strict';

  function initStory() {
    var cv = document.getElementById('storyCv');
    var stage = document.getElementById('storyStage');
    var view = document.getElementById('storyView');
    var copy = document.getElementById('storyCopy');
    var readout = document.getElementById('storyReadout');
    var playBtn = document.getElementById('storyPlay');
    var icoPause = document.getElementById('storyIcoPause');
    var icoPlay = document.getElementById('storyIcoPlay');
    var fsBtn = document.getElementById('storyFsBtn');
    var replayBtn = document.getElementById('storyReplay');
    var chapEls = Array.prototype.slice.call(document.querySelectorAll('.story-chap'));
    var segEls = Array.prototype.slice.call(document.querySelectorAll('.story-seg'));

    if (!cv || !stage || !view || !copy) return;

    var ctx = cv.getContext('2d');
    var rootEl = document.documentElement;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wideMQ = window.matchMedia ? window.matchMedia('(min-width: 860px)') : { matches: true };

    var META = window.CYRO_STORY_META || { aspect: [1.2251, 1.1588, 0.8959, 1.0767], M: 11000 };
    var DATA = window.CYRO_STORY_DATA || [];
    var M = META.M;

    // Detect device performance capability
    var isSmall = (window.innerWidth < 768) || ((navigator.hardwareConcurrency || 8) <= 4);
    var N = isSmall ? 6500 : M;

    var READ = [
      'Scene 01 / 04 · Legacy systems',
      'Scene 02 / 04 · Connected platform',
      'Scene 03 / 04 · Applied intelligence',
      'Scene 04 / 04 · Cyrolabz'
    ];
    var SIDES = [1, -1, 1, -1];
    var SEG = 3;   // 3 transitions between 4 scenes
    var SEC = 7.5; // seconds per scene hold & transition

    function decode(b64) {
      var bin = atob(b64), u8 = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      return {
        u: new Uint16Array(u8.buffer, 0, M),
        v: new Uint16Array(u8.buffer, 2 * M, M),
        t: new Uint8Array(u8.buffer, 4 * M, M)
      };
    }

    if (!DATA.length) {
      console.warn('Cyrolabz Story: DATA point cloud not loaded yet.');
      return;
    }

    var scenes = DATA.map(decode);
    var tone = scenes.map(function (sc) {
      var a = new Float32Array(N);
      for (var i = 0; i < N; i++) a[i] = sc.t[i] / 255;
      return a;
    });

    var tx = [], ty = [];
    for (var k = 0; k < 4; k++) {
      tx.push(new Float32Array(N));
      ty.push(new Float32Array(N));
    }

    var seed = 20261014;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    var delay = new Float32Array(N), ax = new Float32Array(N), ay = new Float32Array(N);
    var dep = new Float32Array(N), ph = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      delay[i] = rnd() * 0.35;
      ax[i] = rnd() * 2 - 1;
      ay[i] = rnd() * 2 - 1;
      dep[i] = 0.5 + rnd();
      ph[i] = rnd() * 6.2832;
    }

    var accStep = 23;
    var accX = new Float32Array(Math.ceil(N / accStep) + 1);
    var accY = new Float32Array(accX.length);
    var accA = new Float32Array(accX.length);

    var W = 1, H = 1, dpr = 1, wide = true, cy = 0, cxs = [0, 0, 0, 0], fit = [];
    var ink = '#0B0C0E', accent = '#2F6BFF', bgc = '#F4F5F7';
    var dirty = true;

    // Artwork images & sharp reveals
    var markImg = new Image(), markReady = false, mk = document.createElement('canvas');
    var faceImg = new Image(), faceReady = false, fk = document.createElement('canvas');
    var sk = document.createElement('canvas'), skReady = false;
    var nk = document.createElement('canvas'), nkReady = false;

    function rgb(c) {
      c = (c || '').trim();
      if (c.charAt(0) === '#') {
        if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
        return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)];
      }
      var m = c.match(/\d+(\.\d+)?/g);
      return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0];
    }

    function tintMark() {
      if (!markReady) return;
      mk.width = markImg.naturalWidth;
      mk.height = markImg.naturalHeight;
      var c = mk.getContext('2d');
      c.globalCompositeOperation = 'source-over';
      c.clearRect(0, 0, mk.width, mk.height);
      c.drawImage(markImg, 0, 0);
      c.globalCompositeOperation = 'source-in';
      c.fillStyle = ink;
      c.fillRect(0, 0, mk.width, mk.height);
    }

    function tintFace() {
      if (!faceReady) return;
      var w = faceImg.naturalWidth, h = faceImg.naturalHeight;
      fk.width = w;
      fk.height = h;
      var c = fk.getContext('2d');
      c.clearRect(0, 0, w, h);
      c.drawImage(faceImg, 0, 0);
      var id = c.getImageData(0, 0, w, h), d = id.data, I = rgb(ink), B = rgb(bgc);
      for (var p = 0; p < d.length; p += 4) {
        var t = (d[p] - 8) * 1.5;
        t = t < 0 ? 0 : t > 255 ? 1 : t / 255;
        d[p] = I[0] + (B[0] - I[0]) * t;
        d[p + 1] = I[1] + (B[1] - I[1]) * t;
        d[p + 2] = I[2] + (B[2] - I[2]) * t;
      }
      c.putImageData(id, 0, 0);
    }

    function tintSkyline() {
      if (!scenes[0]) return;
      var w = 800, h = Math.round(800 / META.aspect[0]);
      sk.width = w; sk.height = h;
      var c = sk.getContext('2d');
      c.clearRect(0, 0, w, h);
      c.fillStyle = ink;
      var sc = scenes[0];
      for (var i = 0; i < N; i += 2) {
        var x = (sc.u[i] / 65535) * w;
        var y = (sc.v[i] / 65535) * h;
        var t = sc.t[i] / 255;
        c.globalAlpha = 0.35 + 0.65 * t;
        c.fillRect(x - 1, y - 1, 2.5, 2.5);
      }
      skReady = true;
    }

    function tintNetwork() {
      if (!scenes[1]) return;
      var w = 800, h = Math.round(800 / META.aspect[1]);
      nk.width = w; nk.height = h;
      var c = nk.getContext('2d');
      c.clearRect(0, 0, w, h);
      c.fillStyle = ink;
      c.strokeStyle = ink;
      var sc = scenes[1];
      c.lineWidth = 0.8;
      c.globalAlpha = 0.3;
      for (var i = 0; i < Math.min(N, 600); i += 6) {
        var x1 = (sc.u[i] / 65535) * w;
        var y1 = (sc.v[i] / 65535) * h;
        var next = (i + 12) % N;
        var x2 = (sc.u[next] / 65535) * w;
        var y2 = (sc.v[next] / 65535) * h;
        if (Math.hypot(x2 - x1, y2 - y1) < 110) {
          c.beginPath();
          c.moveTo(x1, y1);
          c.lineTo(x2, y2);
          c.stroke();
        }
      }
      for (var j = 0; j < N; j += 3) {
        var nx = (sc.u[j] / 65535) * w;
        var ny = (sc.v[j] / 65535) * h;
        c.globalAlpha = 0.45 + 0.55 * (sc.t[j] / 255);
        c.fillRect(nx - 1.2, ny - 1.2, 2.4, 2.4);
      }
      nkReady = true;
    }

    markImg.onload = function () { markReady = true; tintMark(); dirty = true; };
    faceImg.onload = function () { faceReady = true; tintFace(); dirty = true; };
    markImg.src = 'assets/mark.png';
    faceImg.src = 'assets/face.webp';

    function readTokens() {
      var cs = getComputedStyle(rootEl);
      ink = cs.getPropertyValue('--ink').trim() || ink;
      accent = cs.getPropertyValue('--accent').trim() || accent;
      bgc = cs.getPropertyValue('--bg').trim() || bgc;
      tintMark();
      tintFace();
      tintSkyline();
      tintNetwork();
      dirty = true;
    }

    function layout() {
      var r = view.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      wide = wideMQ.matches;
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cy = H * 0.46;

      for (var k = 0; k < 4; k++) {
        var ar = META.aspect[k];
        var fw = wide ? Math.min(W * 0.5, H * 0.78 * ar) : Math.min(W * 0.9, H * 0.78 * ar);
        var fh = fw / ar;
        var cx = wide ? W * (0.5 + 0.2 * SIDES[k]) : W / 2;
        cxs[k] = cx;
        fit[k] = { fw: fw, fh: fh };
        var sc = scenes[k], X = tx[k], Y = ty[k];
        for (var i = 0; i < N; i++) {
          X[i] = cx + (sc.u[i] / 65535 - 0.5) * fw;
          Y[i] = cy + (sc.v[i] / 65535 - 0.5) * fh;
        }
      }
      if (!wide) {
        copy.style.removeProperty('--rx');
        copy.style.removeProperty('--ry');
      }
    }

    var s = 0, playing = !reduce, tween = null, time = 0, last = performance.now();
    var ptTX = -9999, ptTY = -9999, ptx = -9999, pty = -9999, pw = 0, inside = false, pxn = 0, pyn = 0;

    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function smooth(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
    function easeIO(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function ended() { return s >= SEG - 1e-3; }

    function render() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var a = Math.min(SEG - 1, Math.floor(s));
      var m = smooth((s - a - 0.3) / 0.5);
      var skyRv = smooth((0.18 - s) / 0.14);
      var netRv = smooth((s - 0.78) / 0.16) * (1 - smooth((s - 1.22) / 0.1));
      var ramp = smooth((s - 2.78) / 0.22);
      var faceRv = smooth((s - 1.74) / 0.16) * (1 - smooth((s - 2.2) / 0.1));
      var fade = (1 - 0.72 * faceRv) * (1 - 0.92 * ramp);
      var A = tx[a], Ay = ty[a], B = tx[a + 1], By = ty[a + 1], tA = tone[a], tB = tone[a + 1];
      var cxA = cxs[a], cxB = cxs[a + 1];
      var live = reduce ? 0 : 1;
      var R = 70, R2 = R * R, push = 26 * pw;
      var offX = reduce ? 0 : pxn * 16, offY = reduce ? 0 : pyn * 11;
      var nAcc = 0;

      ctx.fillStyle = ink;
      for (var i = 0; i < N; i++) {
        var q = (m - delay[i]) * 1.5385;
        var e = q <= 0 ? 0 : q >= 1 ? 1 : q * q * (3 - 2 * q);
        var x = A[i] + (B[i] - A[i]) * e, y = Ay[i] + (By[i] - Ay[i]) * e;
        var arc = Math.sin(3.14159265 * e);
        if (arc > 0.001) {
          if (a === 0) {
            x += ax[i] * 0.09 * W * arc;
            y += (0.16 + 0.24 * Math.abs(ay[i])) * H * arc;
          } else if (a === 1) {
            var k2 = 0.35 + 0.35 * Math.abs(ax[i]);
            x += (A[i] - cxA) * k2 * arc;
            y += (Ay[i] - cy) * k2 * arc;
          } else {
            var cxt = cxA + (cxB - cxA) * e;
            var th = arc * (0.9 + 0.9 * ax[i]) * (ay[i] < 0 ? -1 : 1);
            var dx0 = x - cxt, dy0 = y - cy, cs = Math.cos(th), sn = Math.sin(th);
            x = cxt + dx0 * cs - dy0 * sn;
            y = cy + dx0 * sn + dy0 * cs;
          }
        }
        var calm = live * (1 - 0.7 * arc);
        x += Math.sin(time * 0.8 + ph[i]) * 0.9 * calm;
        y += Math.cos(time * 0.7 + ph[i] * 1.3) * 0.9 * calm;
        var z = dep[i];
        x += offX * z;
        y += offY * z;

        if (push > 0.05) {
          var ddx = x - ptx, ddy = y - pty, d2 = ddx * ddx + ddy * ddy;
          if (d2 < R2 && d2 > 0.01) {
            var d = Math.sqrt(d2), f = 1 - d / R;
            x += ddx / d * f * f * push;
            y += ddy / d * f * f * push;
          }
        }

        var t = tA[i] + (tB[i] - tA[i]) * e;
        if (i % accStep === 0) {
          accX[nAcc] = x;
          accY[nAcc] = y;
          accA[nAcc] = (0.55 + 0.45 * Math.sin(time * 2.1 + ph[i] * 3)) * fade;
          nAcc++;
          continue;
        }

        var sz = 1.2 + t * 1.1;
        ctx.globalAlpha = (0.28 + 0.72 * t) * fade;
        ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }

      ctx.fillStyle = accent;
      for (var j = 0; j < nAcc; j++) {
        ctx.globalAlpha = accA[j];
        ctx.fillRect(accX[j] - 1.5, accY[j] - 1.5, 3, 3);
      }

      if (skyRv > 0 && skReady && fit[0]) {
        ctx.globalAlpha = skyRv * 0.75;
        ctx.drawImage(sk, cxs[0] - fit[0].fw / 2, cy - fit[0].fh / 2, fit[0].fw, fit[0].fh);
      }

      if (netRv > 0 && nkReady && fit[1]) {
        ctx.globalAlpha = netRv * 0.75;
        ctx.drawImage(nk, cxs[1] - fit[1].fw / 2, cy - fit[1].fh / 2, fit[1].fw, fit[1].fh);
      }

      if (faceRv > 0 && faceReady && fit[2]) {
        ctx.globalAlpha = faceRv;
        ctx.drawImage(fk, cxs[2] - fit[2].fw / 2, cy - fit[2].fh / 2, fit[2].fw, fit[2].fh);
      }

      if (ramp > 0 && markReady && fit[3]) {
        ctx.globalAlpha = ramp;
        ctx.drawImage(mk, cxs[3] - fit[3].fw / 2, cy - fit[3].fh / 2, fit[3].fw, fit[3].fh);
      }

      ctx.globalAlpha = 1;
    }

    var cur = -1;
    function ui() {
      var c = Math.round(s);
      if (c !== cur) {
        cur = c;
        chapEls.forEach(function (el, i) {
          var on = i === c;
          el.setAttribute('data-active', on ? 'true' : 'false');
          el.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
        segEls.forEach(function (el, i) {
          if (i === c) {
            el.setAttribute('aria-current', 'step');
          } else {
            el.removeAttribute('aria-current');
          }
        });
        if (readout) readout.textContent = READ[c];
        stage.setAttribute('data-art', SIDES[c] === 1 ? 'right' : 'left');

        // Play subtle procedural sound if audio enabled
        if (window.CyroAudio) {
          window.CyroAudio.sceneTransition(c);
        }
      }

      for (var k = 0; k < segEls.length; k++) {
        var lo = Math.max(0, k - 0.5), hi = Math.min(SEG, k + 0.5);
        var fillVal = clamp01((s - lo) / (hi - lo)).toFixed(3);
        var barFill = segEls[k].querySelector('.story-bar i');
        if (barFill) {
          barFill.style.transform = 'scaleX(' + fillVal + ')';
        }
      }
    }

    var lastPlayLabel = '';
    function syncPlay() {
      var p = playing && !ended();
      var label = p ? 'Pause story' : (ended() ? 'Replay story' : 'Play story');
      if (label !== lastPlayLabel) {
        lastPlayLabel = label;
        if (playBtn) playBtn.setAttribute('aria-label', label);
        if (icoPause) icoPause.hidden = !p;
        if (icoPlay) icoPlay.hidden = p;
      }
    }

    function go(k) {
      var wasEnded = ended();
      if (window.CyroAudio) window.CyroAudio.tick();
      if (reduce) {
        s = k;
        tween = null;
        dirty = true;
      } else {
        var d = Math.abs(k - s);
        if (d < 1e-3) return;
        tween = { from: s, to: k, t0: performance.now(), dur: Math.min(2600, 900 + 700 * d) };
      }
      if (wasEnded && k < SEG) playing = true;
      syncPlay();
    }

    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) time += dt;

      if (tween) {
        var kk = Math.min(1, (now - tween.t0) / tween.dur);
        s = tween.from + (tween.to - tween.from) * easeIO(kk);
        if (kk >= 1) {
          s = tween.to;
          tween = null;
        }
        dirty = true;
      } else if (playing && !ended()) {
        s = Math.min(SEG, s + dt / SEC);
        dirty = true;
      }

      if (!reduce) {
        pw += ((inside ? 1 : 0) - pw) * 0.12;
        if (inside) {
          ptx += (ptTX - ptx) * 0.22;
          pty += (ptTY - pty) * 0.22;
        }
        pxn += ((inside ? ptTX / W - 0.5 : 0) - pxn) * 0.06;
        pyn += ((inside ? ptTY / H - 0.5 : 0) - pyn) * 0.06;
        if (wide) {
          copy.style.setProperty('--ry', (pxn * 7).toFixed(2) + 'deg');
          copy.style.setProperty('--rx', (-pyn * 5).toFixed(2) + 'deg');
          copy.style.setProperty('--sx', (0.5 + pxn * 2.2).toFixed(2));
          copy.style.setProperty('--sy', (0.9 + pyn * 2.2).toFixed(2));
        }
        dirty = true;
      }

      if (dirty) {
        render();
        dirty = false;
      }
      ui();
      syncPlay();
      requestAnimationFrame(frame);
    }

    // Pointer events on stage
    stage.addEventListener('pointermove', function (e) {
      var r = view.getBoundingClientRect();
      ptTX = e.clientX - r.left;
      ptTY = e.clientY - r.top;
      if (!inside) {
        ptx = ptTX;
        pty = ptTY;
      }
      inside = true;
    });
    stage.addEventListener('pointerleave', function () {
      inside = false;
    });

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (ended()) {
          go(0);
          playing = true;
        } else {
          playing = !playing;
        }
        if (window.CyroAudio) window.CyroAudio.tick();
        syncPlay();
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', function () {
        go(0);
        playing = true;
        syncPlay();
      });
    }

    segEls.forEach(function (el) {
      el.addEventListener('click', function () {
        var targetIdx = parseInt(el.getAttribute('data-go'), 10);
        if (!isNaN(targetIdx)) {
          go(targetIdx);
        }
      });
      el.addEventListener('mouseenter', function () {
        if (window.CyroAudio) window.CyroAudio.hover();
      });
    });

    // Fullscreen Mode Handler
    var isFs = false;
    function toggleFullscreen() {
      isFs = !isFs;
      stage.classList.toggle('is-fullscreen', isFs);
      document.body.classList.toggle('story-fs-active', isFs);
      if (fsBtn) {
        fsBtn.setAttribute('aria-pressed', isFs ? 'true' : 'false');
        fsBtn.title = isFs ? 'Exit Fullscreen' : 'Enter Fullscreen';
      }
      setTimeout(function () {
        layout();
        dirty = true;
      }, 50);
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', toggleFullscreen);
    }

    document.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'ArrowRight') {
        go(Math.min(SEG, Math.round(s) + 1));
      } else if (e.key === 'ArrowLeft') {
        go(Math.max(0, Math.round(s) - 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        playing = !playing;
        syncPlay();
      } else if (e.key === 'Escape' && isFs) {
        toggleFullscreen();
      }
    });

    if (reduce && playBtn) playBtn.hidden = true;

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        layout();
        dirty = true;
        render();
      }).observe(view);
    } else {
      window.addEventListener('resize', function () {
        layout();
        dirty = true;
      });
    }

    if (window.matchMedia) {
      matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readTokens);
    }
    new MutationObserver(function () {
      readTokens();
    }).observe(rootEl, { attributes: true, attributeFilter: ['data-theme'] });

    layout();
    readTokens();
    render();
    ui();
    syncPlay();
    requestAnimationFrame(function (t) {
      last = t;
      requestAnimationFrame(frame);
    });

    // Global API
    root.CyroStory = {
      go: go,
      play: function () { playing = true; syncPlay(); },
      pause: function () { playing = false; syncPlay(); },
      togglePlay: function () { playing = !playing; syncPlay(); },
      getScene: function () { return Math.round(s); },
      toggleFullscreen: toggleFullscreen
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStory);
  } else {
    initStory();
  }
})(typeof window !== 'undefined' ? window : this);
