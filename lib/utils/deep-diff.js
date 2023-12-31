!(function (e, t) {
  var n = (function (e) {
    var l = ["N", "E", "A", "D"];
    function t(e, t) {
      (e.super_ = t),
        (e.prototype = Object.create(t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        }));
    }
    function n(e, t) {
      Object.defineProperty(this, "kind", { value: e, enumerable: !0 }),
        t &&
          t.length &&
          Object.defineProperty(this, "path", { value: t, enumerable: !0 });
    }
    function D(e, t, n) {
      D.super_.call(this, "E", e),
        Object.defineProperty(this, "lhs", { value: t, enumerable: !0 }),
        Object.defineProperty(this, "rhs", { value: n, enumerable: !0 });
    }
    function k(e, t) {
      k.super_.call(this, "N", e),
        Object.defineProperty(this, "rhs", { value: t, enumerable: !0 });
    }
    function j(e, t) {
      j.super_.call(this, "D", e),
        Object.defineProperty(this, "lhs", { value: t, enumerable: !0 });
    }
    function O(e, t, n) {
      O.super_.call(this, "A", e),
        Object.defineProperty(this, "index", { value: t, enumerable: !0 }),
        Object.defineProperty(this, "item", { value: n, enumerable: !0 });
    }
    function f(e, t, n) {
      var r = e.slice((n || t) + 1 || e.length);
      return (e.length = t < 0 ? e.length + t : t), e.push.apply(e, r), e;
    }
    function w(e) {
      var t = typeof e;
      return "object" !== t
        ? t
        : e === Math
        ? "math"
        : null === e
        ? "null"
        : Array.isArray(e)
        ? "array"
        : "[object Date]" === Object.prototype.toString.call(e)
        ? "date"
        : "function" == typeof e.toString && /^\/.*\//.test(e.toString())
        ? "regexp"
        : "object";
    }
    function u(e) {
      var t = 0;
      if (0 === e.length) return t;
      for (var n = 0; n < e.length; n++) {
        var r = e.charCodeAt(n);
        (t = (t << 5) - t + r), (t &= t);
      }
      return t;
    }
    function x(e) {
      var t = 0,
        n = w(e);
      if ("array" === n) {
        e.forEach(function (e) {
          t += x(e);
        });
        var r = "[type: array, hash: " + t + "]";
        return t + u(r);
      }
      if ("object" === n) {
        for (var a in e)
          if (e.hasOwnProperty(a)) {
            var i =
              "[ type: object, key: " + a + ", value hash: " + x(e[a]) + "]";
            t += u(i);
          }
        return t;
      }
      var l = "[ type: " + n + " ; value: " + e + "]";
      return t + u(l);
    }
    function A(e, t, n, r, a, i, l, f) {
      (n = n || []), (l = l || []);
      var u = (a = a || []).slice(0);
      if (null != i) {
        if (r) {
          if ("function" == typeof r && r(u, i)) return;
          if ("object" == typeof r) {
            if (r.prefilter && r.prefilter(u, i)) return;
            if (r.normalize) {
              var o = r.normalize(u, i, e, t);
              o && ((e = o[0]), (t = o[1]));
            }
          }
        }
        u.push(i);
      }
      "regexp" === w(e) &&
        "regexp" === w(t) &&
        ((e = e.toString()), (t = t.toString()));
      var h,
        s,
        p,
        c,
        d = typeof e,
        v = typeof t,
        b =
          "undefined" !== d ||
          (l &&
            0 < l.length &&
            l[l.length - 1].lhs &&
            Object.getOwnPropertyDescriptor(l[l.length - 1].lhs, i)),
        g =
          "undefined" !== v ||
          (l &&
            0 < l.length &&
            l[l.length - 1].rhs &&
            Object.getOwnPropertyDescriptor(l[l.length - 1].rhs, i));
      if (!b && g) n.push(new k(u, t));
      else if (!g && b) n.push(new j(u, e));
      else if (w(e) !== w(t)) n.push(new D(u, e, t));
      else if ("date" === w(e) && e - t != 0) n.push(new D(u, e, t));
      else if ("object" === d && null !== e && null !== t) {
        for (h = l.length - 1; -1 < h; --h)
          if (l[h].lhs === e) {
            c = !0;
            break;
          }
        if (c) e !== t && n.push(new D(u, e, t));
        else {
          if ((l.push({ lhs: e, rhs: t }), Array.isArray(e))) {
            for (
              f &&
                (e.sort(function (e, t) {
                  return x(e) - x(t);
                }),
                t.sort(function (e, t) {
                  return x(e) - x(t);
                })),
                h = t.length - 1,
                s = e.length - 1;
              s < h;

            )
              n.push(new O(u, h, new k(void 0, t[h--])));
            for (; h < s; ) n.push(new O(u, s, new j(void 0, e[s--])));
            for (; 0 <= h; --h) A(e[h], t[h], n, r, u, h, l, f);
          } else {
            var y = Object.keys(e),
              m = Object.keys(t);
            for (h = 0; h < y.length; ++h)
              (p = y[h]),
                0 <= (c = m.indexOf(p))
                  ? (A(e[p], t[p], n, r, u, p, l, f), (m[c] = null))
                  : A(e[p], void 0, n, r, u, p, l, f);
            for (h = 0; h < m.length; ++h)
              (p = m[h]) && A(void 0, t[p], n, r, u, p, l, f);
          }
          l.length = l.length - 1;
        }
      } else
        e !== t &&
          (("number" === d && isNaN(e) && isNaN(t)) || n.push(new D(u, e, t)));
    }
    function o(e, t, n, r, a) {
      var i = [];
      if ((A(e, t, i, r, null, null, null, a), n))
        for (var l = 0; l < i.length; ++l) n(i[l]);
      return i;
    }
    function r(e, t, n, r) {
      var a = r
          ? function (e) {
              e && r.push(e);
            }
          : void 0,
        i = o(e, t, a, n);
      return r || (i.length ? i : void 0);
    }
    function a(e, t, n) {
      if (
        (void 0 === n && t && ~l.indexOf(t.kind) && (n = t), e && n && n.kind)
      ) {
        for (var r = e, a = -1, i = n.path ? n.path.length - 1 : 0; ++a < i; )
          void 0 === r[n.path[a]] &&
            (r[n.path[a]] =
              void 0 !== n.path[a + 1] && "number" == typeof n.path[a + 1]
                ? []
                : {}),
            (r = r[n.path[a]]);
        switch (n.kind) {
          case "A":
            n.path && void 0 === r[n.path[a]] && (r[n.path[a]] = []),
              (function e(t, n, r) {
                if (r.path && r.path.length) {
                  var a,
                    i = t[n],
                    l = r.path.length - 1;
                  for (a = 0; a < l; a++) i = i[r.path[a]];
                  switch (r.kind) {
                    case "A":
                      e(i[r.path[a]], r.index, r.item);
                      break;
                    case "D":
                      delete i[r.path[a]];
                      break;
                    case "E":
                    case "N":
                      i[r.path[a]] = r.rhs;
                  }
                } else
                  switch (r.kind) {
                    case "A":
                      e(t[n], r.index, r.item);
                      break;
                    case "D":
                      t = f(t, n);
                      break;
                    case "E":
                    case "N":
                      t[n] = r.rhs;
                  }
                return t;
              })(n.path ? r[n.path[a]] : r, n.index, n.item);
            break;
          case "D":
            delete r[n.path[a]];
            break;
          case "E":
          case "N":
            r[n.path[a]] = n.rhs;
        }
      }
    }
    t(D, n),
      t(k, n),
      t(j, n),
      t(O, n),
      Object.defineProperties(r, {
        diff: { value: r, enumerable: !0 },
        orderIndependentDiff: {
          value: function (e, t, n, r) {
            var a = r
                ? function (e) {
                    e && r.push(e);
                  }
                : void 0,
              i = o(e, t, a, n, !0);
            return r || (i.length ? i : void 0);
          },
          enumerable: !0,
        },
        observableDiff: { value: o, enumerable: !0 },
        orderIndependentObservableDiff: {
          value: function (e, t, n, r, a, i, l) {
            return A(e, t, n, r, a, i, l, !0);
          },
          enumerable: !0,
        },
        orderIndepHash: { value: x, enumerable: !0 },
        applyDiff: {
          value: function (t, n, r) {
            t &&
              n &&
              o(t, n, function (e) {
                (r && !r(t, n, e)) || a(t, n, e);
              });
          },
          enumerable: !0,
        },
        applyChange: { value: a, enumerable: !0 },
        revertChange: {
          value: function (e, t, n) {
            if (e && t && n && n.kind) {
              var r,
                a,
                i = e;
              for (a = n.path.length - 1, r = 0; r < a; r++)
                void 0 === i[n.path[r]] && (i[n.path[r]] = {}),
                  (i = i[n.path[r]]);
              switch (n.kind) {
                case "A":
                  !(function e(t, n, r) {
                    if (r.path && r.path.length) {
                      var a,
                        i = t[n],
                        l = r.path.length - 1;
                      for (a = 0; a < l; a++) i = i[r.path[a]];
                      switch (r.kind) {
                        case "A":
                          e(i[r.path[a]], r.index, r.item);
                          break;
                        case "D":
                        case "E":
                          i[r.path[a]] = r.lhs;
                          break;
                        case "N":
                          delete i[r.path[a]];
                      }
                    } else
                      switch (r.kind) {
                        case "A":
                          e(t[n], r.index, r.item);
                          break;
                        case "D":
                        case "E":
                          t[n] = r.lhs;
                          break;
                        case "N":
                          t = f(t, n);
                      }
                    return t;
                  })(i[n.path[r]], n.index, n.item);
                  break;
                case "D":
                case "E":
                  i[n.path[r]] = n.lhs;
                  break;
                case "N":
                  delete i[n.path[r]];
              }
            }
          },
          enumerable: !0,
        },
        isConflict: {
          value: function () {
            return "undefined" != typeof $conflict;
          },
          enumerable: !0,
        },
      }),
      (r.DeepDiff = r),
      e && (e.DeepDiff = r);
    return r;
  })(e);
  if ("function" == typeof define && define.amd)
    define("DeepDiff", function () {
      return n;
    });
  else if (
    "object" == typeof exports ||
    ("object" == typeof navigator && navigator.product.match(/ReactNative/i))
  )
    module.exports = n;
  else {
    var r = e.DeepDiff;
    (n.noConflict = function () {
      return e.DeepDiff === n && (e.DeepDiff = r), n;
    }),
      (e.DeepDiff = n);
  }
})(this);
