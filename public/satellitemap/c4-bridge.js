// C4 Bridge — postMessage communication between parent (Frontend-new) and this iframe
// - Listens for satellite click events from the globe and notifies the parent
// - Listens for messages from parent to update satellite data
(function () {
  'use strict';

  var selectedOrbitSatId = null;

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function notifyParent(type, payload) {
    try {
      window.parent.postMessage({ source: 'c4-bridge', type: type, payload: payload }, '*');
    } catch (e) {}
  }

  // ─── Intercept satellite clicks ──────────────────────────────────────────────
  // The globe calls _calculateSatelliteOrbit when a user clicks a satellite.
  // We wrap it to (a) show the orbit as usual and (b) notify the parent window.

  function patchGlobe(globe) {
    if (globe._c4BridgePatched) return;
    globe._c4BridgePatched = true;

    // Wrap _calculateSatelliteOrbit to intercept clicks
    if (typeof globe._calculateSatelliteOrbit === 'function') {
      var origCalc = globe._calculateSatelliteOrbit.bind(globe);
      globe._calculateSatelliteOrbit = function (sat) {
        var result = origCalc(sat);
        if (sat && sat.norad_id) {
          selectedOrbitSatId = sat.norad_id;
          notifyParent('satellite-clicked', {
            norad_id: sat.norad_id,
            name: sat.name || (sat.metadata && sat.metadata.sat_name) || String(sat.norad_id)
          });
        }
        return result;
      };
    }

    // Also wrap _clearAllOrbits to notify parent of deselect
    if (typeof globe._clearAllOrbits === 'function') {
      var origClear = globe._clearAllOrbits.bind(globe);
      globe._clearAllOrbits = function () {
        selectedOrbitSatId = null;
        notifyParent('satellite-deselected', {});
        return origClear();
      };
    }

    notifyParent('bridge-ready', {});
    console.log('[C4 Bridge] Globe patched successfully');
  }

  // ─── Wait for globe object ───────────────────────────────────────────────────

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
    // Also scan all window keys
    try {
      var keys = Object.keys(window);
      for (var j = 0; j < keys.length; j++) {
        var w = window[keys[j]];
        if (w && typeof w === 'object' && typeof w._calculateSatelliteOrbit === 'function' &&
            !w._c4BridgePatched) {
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

  // Also intercept defineProperty assignments to globe/blueGlobe
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
            // Wait a tick for c4-constellation.js to also patch it first
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
