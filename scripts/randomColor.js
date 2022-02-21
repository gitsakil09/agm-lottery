!(function (r, e) {
  var n;
  "object" == typeof exports
    ? ((n = e()),
      "object" == typeof module &&
        module &&
        module.exports &&
        (exports = module.exports = n),
      (exports.randomColor = n))
    : "function" == typeof define && define.amd
    ? define([], e)
    : (r.randomColor = e());
})(this, function () {
  var o = null,
    s = {};
  r("monochrome", null, [
    [0, 0],
    [100, 0],
  ]),
    r(
      "red",
      [-26, 18],
      [
        [20, 100],
        [30, 92],
        [40, 89],
        [50, 85],
        [60, 78],
        [70, 70],
        [80, 60],
        [90, 55],
        [100, 50],
      ]
    ),
    r(
      "orange",
      [18, 46],
      [
        [20, 100],
        [30, 93],
        [40, 88],
        [50, 86],
        [60, 85],
        [70, 70],
        [100, 70],
      ]
    ),
    r(
      "yellow",
      [46, 62],
      [
        [25, 100],
        [40, 94],
        [50, 89],
        [60, 86],
        [70, 84],
        [80, 82],
        [90, 80],
        [100, 75],
      ]
    ),
    r(
      "green",
      [62, 178],
      [
        [30, 100],
        [40, 90],
        [50, 85],
        [60, 81],
        [70, 74],
        [80, 64],
        [90, 50],
        [100, 40],
      ]
    ),
    r(
      "blue",
      [178, 257],
      [
        [20, 100],
        [30, 86],
        [40, 80],
        [50, 74],
        [60, 60],
        [70, 52],
        [80, 44],
        [90, 39],
        [100, 35],
      ]
    ),
    r(
      "purple",
      [257, 282],
      [
        [20, 100],
        [30, 87],
        [40, 79],
        [50, 70],
        [60, 65],
        [70, 59],
        [80, 52],
        [90, 45],
        [100, 42],
      ]
    ),
    r(
      "pink",
      [282, 334],
      [
        [20, 100],
        [30, 90],
        [40, 86],
        [60, 84],
        [80, 80],
        [90, 75],
        [100, 73],
      ]
    );
  var i = [],
    f = function (r) {
      if (
        void 0 !== (r = r || {}).seed &&
        null !== r.seed &&
        r.seed === parseInt(r.seed, 10)
      )
        o = r.seed;
      else if ("string" == typeof r.seed)
        o = (function (r) {
          for (
            var e = 0, n = 0;
            n !== r.length && !(e >= Number.MAX_SAFE_INTEGER);
            n++
          )
            e += r.charCodeAt(n);
          return e;
        })(r.seed);
      else {
        if (void 0 !== r.seed && null !== r.seed)
          throw new TypeError("The seed value must be an integer or string");
        o = null;
      }
      var e, n;
      if (null === r.count || void 0 === r.count)
        return (function (r, e) {
          switch (e.format) {
            case "hsvArray":
              return r;
            case "hslArray":
              return d(r);
            case "hsl":
              var n = d(r);
              return "hsl(" + n[0] + ", " + n[1] + "%, " + n[2] + "%)";
            case "hsla":
              var t = d(r),
                a = e.alpha || Math.random();
              return (
                "hsla(" + t[0] + ", " + t[1] + "%, " + t[2] + "%, " + a + ")"
              );
            case "rgbArray":
              return h(r);
            case "rgb":
              return "rgb(" + h(r).join(", ") + ")";
            case "rgba":
              var u = h(r),
                a = e.alpha || Math.random();
              return "rgba(" + u.join(", ") + ", " + a + ")";
            default:
              return (function (r) {
                var e = h(r);
                function n(r) {
                  var e = r.toString(16);
                  return 1 == e.length ? "0" + e : e;
                }
                return "#" + n(e[0]) + n(e[1]) + n(e[2]);
              })(r);
          }
        })(
          [
            (e = (function (r) {
              {
                if (0 < i.length) {
                  var e = c(
                      (o = (function (r) {
                        if (isNaN(r)) {
                          if ("string" == typeof r)
                            if (s[r]) {
                              var e = s[r];
                              if (e.hueRange) return e.hueRange;
                            } else if (
                              r.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)
                            ) {
                              return l(g(r)[0]).hueRange;
                            }
                        } else {
                          var n = parseInt(r);
                          if (n < 360 && 0 < n) return l(r).hueRange;
                        }
                        return [0, 360];
                      })(r.hue))
                    ),
                    n = (o[1] - o[0]) / i.length,
                    t = parseInt((e - o[0]) / n);
                  !0 === i[t] ? (t = (t + 2) % i.length) : (i[t] = !0);
                  var a = (o[0] + t * n) % 359,
                    u = (o[0] + (t + 1) * n) % 359;
                  return (e = c((o = [a, u]))) < 0 && (e = 360 + e), e;
                }
                var o = (function (r) {
                  if ("number" == typeof parseInt(r)) {
                    var e = parseInt(r);
                    if (e < 360 && 0 < e) return [e, e];
                  }
                  if ("string" == typeof r)
                    if (s[r]) {
                      var n = s[r];
                      if (n.hueRange) return n.hueRange;
                    } else if (r.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
                      var t = g(r)[0];
                      return [t, t];
                    }
                  return [0, 360];
                })(r.hue);
                return (e = c(o)) < 0 && (e = 360 + e), e;
              }
            })(r)),
            (n = (function (r, e) {
              if ("monochrome" === e.hue) return 0;
              if ("random" === e.luminosity) return c([0, 100]);
              var n = (function (r) {
                  return l(r).saturationRange;
                })(r),
                t = n[0],
                a = n[1];
              switch (e.luminosity) {
                case "bright":
                  t = 55;
                  break;
                case "dark":
                  t = a - 10;
                  break;
                case "light":
                  a = 55;
              }
              return c([t, a]);
            })(e, r)),
            (function (r, e, n) {
              var t = (function (r, e) {
                  for (var n = l(r).lowerBounds, t = 0; t < n.length - 1; t++) {
                    var a = n[t][0],
                      u = n[t][1],
                      o = n[t + 1][0],
                      s = n[t + 1][1];
                    if (a <= e && e <= o) {
                      var i = (s - u) / (o - a);
                      return i * e + (u - i * a);
                    }
                  }
                  return 0;
                })(r, e),
                a = 100;
              switch (n.luminosity) {
                case "dark":
                  a = t + 20;
                  break;
                case "light":
                  t = (a + t) / 2;
                  break;
                case "random":
                  (t = 0), (a = 100);
              }
              return c([t, a]);
            })(e, n, r),
          ],
          r
        );
      for (var t = r.count, a = [], u = 0; u < r.count; u++) i.push(!1);
      for (r.count = null; t > a.length; )
        o && r.seed && (r.seed += 1), a.push(f(r));
      return (r.count = t), a;
    };
  function l(r) {
    for (var e in (334 <= r && r <= 360 && (r -= 360), s)) {
      var n = s[e];
      if (n.hueRange && r >= n.hueRange[0] && r <= n.hueRange[1]) return s[e];
    }
    return "Color not found";
  }
  function c(r) {
    if (null === o) {
      var e = Math.random();
      return (
        (e += 0.618033988749895),
        (e %= 1),
        Math.floor(r[0] + e * (r[1] + 1 - r[0]))
      );
    }
    var n = r[1] || 1,
      t = r[0] || 0,
      a = (o = (9301 * o + 49297) % 233280) / 233280;
    return Math.floor(t + a * (n - t));
  }
  function r(r, e, n) {
    var t = n[0][0],
      a = n[n.length - 1][0],
      u = n[n.length - 1][1],
      o = n[0][1];
    s[r] = {
      hueRange: e,
      lowerBounds: n,
      saturationRange: [t, a],
      brightnessRange: [u, o],
    };
  }
  function h(r) {
    var e = r[0];
    0 === e && (e = 1), 360 === e && (e = 359), (e /= 360);
    var n = r[1] / 100,
      t = r[2] / 100,
      a = Math.floor(6 * e),
      u = 6 * e - a,
      o = t * (1 - n),
      s = t * (1 - u * n),
      i = t * (1 - (1 - u) * n),
      f = 256,
      l = 256,
      c = 256;
    switch (a) {
      case 0:
        (f = t), (l = i), (c = o);
        break;
      case 1:
        (f = s), (l = t), (c = o);
        break;
      case 2:
        (f = o), (l = t), (c = i);
        break;
      case 3:
        (f = o), (l = s), (c = t);
        break;
      case 4:
        (f = i), (l = o), (c = t);
        break;
      case 5:
        (f = t), (l = o), (c = s);
    }
    return [Math.floor(255 * f), Math.floor(255 * l), Math.floor(255 * c)];
  }
  function g(r) {
    r = 3 === (r = r.replace(/^#/, "")).length ? r.replace(/(.)/g, "$1$1") : r;
    var e = parseInt(r.substr(0, 2), 16) / 255,
      n = parseInt(r.substr(2, 2), 16) / 255,
      t = parseInt(r.substr(4, 2), 16) / 255,
      a = Math.max(e, n, t),
      u = a - Math.min(e, n, t),
      o = a ? u / a : 0;
    switch (a) {
      case e:
        return [(((n - t) / u) % 6) * 60 || 0, o, a];
      case n:
        return [60 * ((t - e) / u + 2) || 0, o, a];
      case t:
        return [60 * ((e - n) / u + 4) || 0, o, a];
    }
  }
  function d(r) {
    var e = r[0],
      n = r[1] / 100,
      t = r[2] / 100,
      a = (2 - n) * t;
    return [
      e,
      Math.round(((n * t) / (a < 1 ? a : 2 - a)) * 1e4) / 100,
      (a / 2) * 100,
    ];
  }
  return f;
});
