"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* IntersectionObserver polyfill 
 * 
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
!function () {
  "use strict";

  if ("object" == (typeof window === "undefined" ? "undefined" : _typeof(window))) if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) "isIntersecting" in window.IntersectionObserverEntry.prototype || Object.defineProperty(window.IntersectionObserverEntry.prototype, "isIntersecting", {
    get: function get() {
      return 0 < this.intersectionRatio;
    }
  });else {
    var g = window.document,
        e = [];
    t.prototype.THROTTLE_TIMEOUT = 100, t.prototype.POLL_INTERVAL = null, t.prototype.USE_MUTATION_OBSERVER = !0, t.prototype.observe = function (e) {
      if (!this._observationTargets.some(function (t) {
        return t.element == e;
      })) {
        if (!e || 1 != e.nodeType) throw new Error("target must be an Element");
        this._registerInstance(), this._observationTargets.push({
          element: e,
          entry: null
        }), this._monitorIntersections(), this._checkForIntersections();
      }
    }, t.prototype.unobserve = function (e) {
      this._observationTargets = this._observationTargets.filter(function (t) {
        return t.element != e;
      }), this._observationTargets.length || (this._unmonitorIntersections(), this._unregisterInstance());
    }, t.prototype.disconnect = function () {
      this._observationTargets = [], this._unmonitorIntersections(), this._unregisterInstance();
    }, t.prototype.takeRecords = function () {
      var t = this._queuedEntries.slice();

      return this._queuedEntries = [], t;
    }, t.prototype._initThresholds = function (t) {
      var e = t || [0];
      return Array.isArray(e) || (e = [e]), e.sort().filter(function (t, e, n) {
        if ("number" != typeof t || isNaN(t) || t < 0 || 1 < t) throw new Error("threshold must be a number between 0 and 1 inclusively");
        return t !== n[e - 1];
      });
    }, t.prototype._parseRootMargin = function (t) {
      var e = (t || "0px").split(/\s+/).map(function (t) {
        var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
        if (!e) throw new Error("rootMargin must be specified in pixels or percent");
        return {
          value: parseFloat(e[1]),
          unit: e[2]
        };
      });
      return e[1] = e[1] || e[0], e[2] = e[2] || e[0], e[3] = e[3] || e[1], e;
    }, t.prototype._monitorIntersections = function () {
      this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL) : (n(window, "resize", this._checkForIntersections, !0), n(g, "scroll", this._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in window && (this._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(g, {
        attributes: !0,
        childList: !0,
        characterData: !0,
        subtree: !0
      }))));
    }, t.prototype._unmonitorIntersections = function () {
      this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this._monitoringInterval), this._monitoringInterval = null, o(window, "resize", this._checkForIntersections, !0), o(g, "scroll", this._checkForIntersections, !0), this._domObserver && (this._domObserver.disconnect(), this._domObserver = null));
    }, t.prototype._checkForIntersections = function () {
      var h = this._rootIsInDom(),
          c = h ? this._getRootRect() : r();

      this._observationTargets.forEach(function (t) {
        var e = t.element,
            n = _(e),
            o = this._rootContainsTarget(e),
            i = t.entry,
            r = h && o && this._computeTargetAndRootIntersection(e, c),
            s = t.entry = new a({
          time: window.performance && performance.now && performance.now(),
          target: e,
          boundingClientRect: n,
          rootBounds: c,
          intersectionRect: r
        });

        i ? h && o ? this._hasCrossedThreshold(i, s) && this._queuedEntries.push(s) : i && i.isIntersecting && this._queuedEntries.push(s) : this._queuedEntries.push(s);
      }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this);
    }, t.prototype._computeTargetAndRootIntersection = function (t, e) {
      if ("none" != window.getComputedStyle(t).display) {
        for (var n, o, i, r, s, h, c, a, u = _(t), l = m(t), d = !1; !d;) {
          var p = null,
              f = 1 == l.nodeType ? window.getComputedStyle(l) : {};
          if ("none" == f.display) return;
          if (l == this.root || l == g ? (d = !0, p = e) : l != g.body && l != g.documentElement && "visible" != f.overflow && (p = _(l)), p && (n = p, o = u, void 0, i = Math.max(n.top, o.top), r = Math.min(n.bottom, o.bottom), s = Math.max(n.left, o.left), h = Math.min(n.right, o.right), a = r - i, !(u = 0 <= (c = h - s) && 0 <= a && {
            top: i,
            bottom: r,
            left: s,
            right: h,
            width: c,
            height: a
          }))) break;
          l = m(l);
        }

        return u;
      }
    }, t.prototype._getRootRect = function () {
      var t;
      if (this.root) t = _(this.root);else {
        var e = g.documentElement,
            n = g.body;
        t = {
          top: 0,
          left: 0,
          right: e.clientWidth || n.clientWidth,
          width: e.clientWidth || n.clientWidth,
          bottom: e.clientHeight || n.clientHeight,
          height: e.clientHeight || n.clientHeight
        };
      }
      return this._expandRectByRootMargin(t);
    }, t.prototype._expandRectByRootMargin = function (n) {
      var t = this._rootMarginValues.map(function (t, e) {
        return "px" == t.unit ? t.value : t.value * (e % 2 ? n.width : n.height) / 100;
      }),
          e = {
        top: n.top - t[0],
        right: n.right + t[1],
        bottom: n.bottom + t[2],
        left: n.left - t[3]
      };

      return e.width = e.right - e.left, e.height = e.bottom - e.top, e;
    }, t.prototype._hasCrossedThreshold = function (t, e) {
      var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
          o = e.isIntersecting ? e.intersectionRatio || 0 : -1;
      if (n !== o) for (var i = 0; i < this.thresholds.length; i++) {
        var r = this.thresholds[i];
        if (r == n || r == o || r < n != r < o) return !0;
      }
    }, t.prototype._rootIsInDom = function () {
      return !this.root || i(g, this.root);
    }, t.prototype._rootContainsTarget = function (t) {
      return i(this.root || g, t);
    }, t.prototype._registerInstance = function () {
      e.indexOf(this) < 0 && e.push(this);
    }, t.prototype._unregisterInstance = function () {
      var t = e.indexOf(this);
      -1 != t && e.splice(t, 1);
    }, window.IntersectionObserver = t, window.IntersectionObserverEntry = a;
  }

  function a(t) {
    this.time = t.time, this.target = t.target, this.rootBounds = t.rootBounds, this.boundingClientRect = t.boundingClientRect, this.intersectionRect = t.intersectionRect || r(), this.isIntersecting = !!t.intersectionRect;
    var e = this.boundingClientRect,
        n = e.width * e.height,
        o = this.intersectionRect,
        i = o.width * o.height;
    this.intersectionRatio = n ? Number((i / n).toFixed(4)) : this.isIntersecting ? 1 : 0;
  }

  function t(t, e) {
    var n,
        o,
        i,
        r = e || {};
    if ("function" != typeof t) throw new Error("callback must be a function");
    if (r.root && 1 != r.root.nodeType) throw new Error("root must be an Element");
    this._checkForIntersections = (n = this._checkForIntersections.bind(this), o = this.THROTTLE_TIMEOUT, i = null, function () {
      i = i || setTimeout(function () {
        n(), i = null;
      }, o);
    }), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(r.rootMargin), this.thresholds = this._initThresholds(r.threshold), this.root = r.root || null, this.rootMargin = this._rootMarginValues.map(function (t) {
      return t.value + t.unit;
    }).join(" ");
  }

  function n(t, e, n, o) {
    "function" == typeof t.addEventListener ? t.addEventListener(e, n, o || !1) : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n);
  }

  function o(t, e, n, o) {
    "function" == typeof t.removeEventListener ? t.removeEventListener(e, n, o || !1) : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, n);
  }

  function _(t) {
    var e;

    try {
      e = t.getBoundingClientRect();
    } catch (t) {}

    return e ? (e.width && e.height || (e = {
      top: e.top,
      right: e.right,
      bottom: e.bottom,
      left: e.left,
      width: e.right - e.left,
      height: e.bottom - e.top
    }), e) : r();
  }

  function r() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }

  function i(t, e) {
    for (var n = e; n;) {
      if (n == t) return !0;
      n = m(n);
    }

    return !1;
  }

  function m(t) {
    var e = t.parentNode;
    return e && 11 == e.nodeType && e.host ? e.host : e && e.assignedSlot ? e.assignedSlot.parentNode : e;
  }
}();