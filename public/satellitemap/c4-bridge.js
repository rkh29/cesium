// C4 Bridge - postMessage communication between parent (Frontend-new) and this iframe.
// Selection toggle is handled entirely in c4-constellation.js.
// This bridge only announces readiness so parent/iframe do not double-handle clicks.
(function () {
  'use strict';

  function notifyParent(type, payload) {
    try {
      window.parent.postMessage({ source: 'c4-bridge', type: type, payload: payload }, '*');
    } catch (e) {}
  }

  function patchGlobe(globe) {
    if (globe._c4BridgePatched) return;
    globe._c4BridgePatched = true;

    notifyParent('bridge-ready', {});
    console.log('[C4 Bridge] Globe patched');
  }

  var bridgeDone = false;
  var checkInterval = setInterval(function () {
    var candidates = ['globe', 'blueGlobe'];
    for (var i = 0; i < candidates.length; i++) {
      var v = window[candidates[i]];
      if (v && typeof v === 'object' && typeof v._calculateSatelliteOrbit === 'function') {
        clearInterval(checkInterval);
        bridgeDone = true;
        patchGlobe(v);
        return;
      }
    }
    try {
      var keys = Object.keys(window);
      for (var j = 0; j < keys.length; j++) {
        var w = window[keys[j]];
        if (w && typeof w === 'object' && typeof w._calculateSatelliteOrbit === 'function' && !w._c4BridgePatched) {
          clearInterval(checkInterval);
          bridgeDone = true;
          patchGlobe(w);
          return;
        }
      }
    } catch (e) {}
  }, 300);

  setTimeout(function () {
    clearInterval(checkInterval);
    if (!bridgeDone) {
      console.warn('[C4 Bridge] Globe not found after 30s');
    }
  }, 30000);

  function watchGlobeProperty(key) {
    var _val;
    try {
      Object.defineProperty(window, key, {
        configurable: true,
        enumerable: true,
        get: function () { return _val; },
        set: function (v) {
          _val = v;
          if (v && typeof v === 'object' && !bridgeDone) {
            setTimeout(function () { patchGlobe(v); }, 200);
          }
        }
      });
    } catch (e) {}
  }

  watchGlobeProperty('globe');
  watchGlobeProperty('blueGlobe');

  console.log('[C4 Bridge] Ready, waiting for globe...');
})();
