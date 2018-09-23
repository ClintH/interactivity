!(function(e) {
  if ('object' == typeof exports && 'undefined' != typeof module)
    module.exports = e();
  else if ('function' == typeof define && define.amd) define([], e);
  else {
    var r;
    (r =
      'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
            ? self
            : this),
    (r.charming = e());
  }
})(function() {
  return (function e(r, n, t) {
    function o(f, a) {
      if (!n[f]) {
        if (!r[f]) {
          var u = 'function' == typeof require && require;
          if (!a && u) return u(f, !0);
          if (i) return i(f, !0);
          var l = new Error('Cannot find module \'' + f + '\'');
          throw ((l.code = 'MODULE_NOT_FOUND'), l);
        }
        var d = (n[f] = { exports: {} });
        r[f][0].call(
          d.exports,
          function(e) {
            var n = r[f][1][e];
            return o(n ? n : e);
          },
          d,
          d.exports,
          e,
          r,
          n,
          t
        );
      }
      return n[f].exports;
    }
    for (
      var i = 'function' == typeof require && require, f = 0;
      f < t.length;
      f++
    )
      o(t[f]);
    return o;
  })(
    {
      1: [
        function(e, r, n) {
          r.exports = function(e, r) {
            function n(e) {
              for (
                var r = e.parentNode,
                  n = e.nodeValue,
                  a = t ? n.split(t) : n,
                  u = a.length,
                  l = -1;
                ++l < u;

              ) {
                var d = document.createElement(o);
                i && ((d.className = i + f), f++),
                d.appendChild(document.createTextNode(a[l])),
                d.setAttribute('aria-hidden', 'true'),
                r.insertBefore(d, e);
              }
              '' !== n.trim() && r.setAttribute('aria-label', n),
              r.removeChild(e);
            }
            (r = r || {}), e.normalize();
            var t = r.splitRegex,
              o = r.tagName || 'span',
              i = null != r.classPrefix ? r.classPrefix : 'char',
              f = 1;
            !(function e(r) {
              if (3 === r.nodeType) return n(r);
              var t = Array.prototype.slice.call(r.childNodes),
                o = t.length;
              if (1 === o && 3 === t[0].nodeType) return n(t[0]);
              for (var i = -1; ++i < o; ) e(t[i]);
            })(e);
          };
        },
        {}
      ]
    },
    {},
    [1]
  )(1);
});
