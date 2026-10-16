/**
 * Cyrolabz Audio Engine - Synthesized Web Audio Micro-Interactions
 * Zero external audio files; pure procedural sound synthesis.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CyroAudio = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ctx = null;
  var isMuted = true; // default muted to respect user and autoplay policies

  function getContext() {
    if (!ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  // Load user preference
  try {
    var stored = localStorage.getItem('cyrolabz-sound');
    if (stored === 'on') {
      isMuted = false;
    }
  } catch (e) {}

  function playTone(freq, type, duration, gainVal, slideFreq) {
    if (isMuted) return;
    var ac = getContext();
    if (!ac) return;

    try {
      var now = ac.currentTime;
      var osc = ac.createOscillator();
      var gain = ac.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      if (slideFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, slideFreq), now + duration);
      }

      gain.gain.setValueAtTime(gainVal || 0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (err) {}
  }

  var AudioAPI = {
    toggleMute: function () {
      isMuted = !isMuted;
      try {
        localStorage.setItem('cyrolabz-sound', isMuted ? 'off' : 'on');
      } catch (e) {}
      if (!isMuted) {
        getContext();
        AudioAPI.chime();
      }
      return !isMuted;
    },
    isMuted: function () {
      return isMuted;
    },
    setMuted: function (m) {
      isMuted = !!m;
      try {
        localStorage.setItem('cyrolabz-sound', isMuted ? 'off' : 'on');
      } catch (e) {}
    },
    // Gentle digital tick for clicks/steps
    tick: function () {
      playTone(1200, 'sine', 0.04, 0.03, 600);
    },
    // Soft hover indicator
    hover: function () {
      playTone(850, 'sine', 0.03, 0.015, 950);
    },
    // High-tech chord for chapter transition
    sceneTransition: function (sceneIndex) {
      if (isMuted) return;
      var ac = getContext();
      if (!ac) return;

      var baseFreqs = [
        [329.63, 493.88, 659.25], // E4, B4, E5 (Scene 1: Foundation)
        [392.00, 587.33, 783.99], // G4, D5, G5 (Scene 2: Connect)
        [440.00, 659.25, 880.00], // A4, E5, A5 (Scene 3: Intelligence)
        [523.25, 659.25, 1046.50] // C5, E5, C6 (Scene 4: Cyrolabz)
      ];
      var chord = baseFreqs[sceneIndex % 4] || baseFreqs[0];

      chord.forEach(function (f, idx) {
        setTimeout(function () {
          playTone(f, 'sine', 0.45, 0.025, f * 1.05);
        }, idx * 45);
      });
    },
    // Milestone/Audit trigger chime
    chime: function () {
      playTone(523.25, 'triangle', 0.15, 0.04, 1046.5);
    }
  };

  return AudioAPI;
});
