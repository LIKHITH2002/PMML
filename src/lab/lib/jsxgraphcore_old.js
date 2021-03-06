/* Version 0.81 */
/*
    Copyright 2008-2010
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph.  If not, see <http://www.gnu.org/licenses/>.
*/
var JXG = {};
(function () {
    var a, b;
    JXG.countDrawings = 0;
    JXG.countTime = 0;
    JXG.require = function (c) {};
    JXG.rendererFiles = [];
    JXG.rendererFiles.svg = "SVGRenderer";
    JXG.rendererFiles.vml = "VMLRenderer";
    JXG.baseFiles = null;
    JXG.requirePath = "";
    for (a = 0; a < document.getElementsByTagName("script").length; a++) {
        b = document.getElementsByTagName("script")[a];
        if (b.src && b.src.match(/loadjsxgraphInOneFile\.js(\?.*)?$/)) {
            JXG.requirePath = b.src.replace(/loadjsxgraphInOneFile\.js(\?.*)?$/, "")
        }
    }
    JXG.serverBase = JXG.requirePath + "server/"
})();
JXG.Math = new Object();
JXG.Math.eps = 0.000001;
JXG.Math.Vector = function (b) {
    var a;
    this.length = 0;
    if ((typeof b != undefined) && (b != null)) {
        for (a = 0; a < b.length; a++) {
            this.push(b[a])
        }
    }
};
JXG.Math.Vector.prototype = new Array();
JXG.Math.Vector.prototype.n = function () {
    return this.length
};
JXG.Math.Vector.prototype.exchange = function (c, b) {
    var a = this[c];
    this[c] = this[b];
    this[b] = a
};
JXG.Math.Matrix = function (g) {
    var e = 0,
        f = false,
        d, c, a, b;
    this.length = 0;
    if ((typeof g != undefined) && (g != null)) {
        a = g.length;
        for (d = 0; d < a; d++) {
            b = g[d].length;
            this.push(new Array());
            if (f) {
                if (e != b) {
                    this.length = 0;
                    throw new JXG.DimensionMismatchException("Your array contains arrays with different lengths.")
                }
            }
            for (c = 0; c < b; c++) {
                this[d].push(g[d][c])
            }
            e = b;
            f = true
        }
    }
};
JXG.Math.Matrix.prototype = new Array();
JXG.Math.Matrix.prototype.m = function () {
    return this.length
};
JXG.Math.Matrix.prototype.n = function () {
    if (this.length > 0) {
        return this[0].length
    } else {
        return 0
    }
};
JXG.Math.Matrix.prototype.exchangeRows = function (c, b) {
    var a = this[c];
    this[c] = this[b];
    this[b] = a
};
JXG.DimensionMismatchException = function (a) {
    if ((typeof a != undefined) && (a != null)) {
        this.message = a
    } else {
        this.message = null
    }
};
JXG.DimensionMismatchException.prototype.what = function () {
    var a = "Matrix has incorrect dimensions";
    if (this.message != null) {
        return a + ": " + this.message + "."
    } else {
        return a + "."
    }
};
JXG.SingularMatrixException = function (a) {
    if ((typeof a != undefined) && (a != null)) {
        this.message = a
    } else {
        this.message = null
    }
};
JXG.SingularMatrixException.prototype.what = function () {
    var a = "Matrix is singular";
    if (this.message != null) {
        return a + ": " + this.message + "."
    } else {
        return a + "."
    }
};
JXG.Math.matVecMult = function (g, e) {
    var a = g.length,
        h = e.length,
        d = [],
        c, f, b;
    if (h == 3) {
        for (c = 0; c < a; c++) {
            d[c] = g[c][0] * e[0] + g[c][1] * e[1] + g[c][2] * e[2]
        }
    } else {
        for (c = 0; c < a; c++) {
            f = 0;
            for (b = 0; b < h; b++) {
                f += g[c][b] * e[b]
            }
            d[c] = f
        }
    }
    return d
};
JXG.Math.matMatMult = function (b, a) {
    var d = b.length,
        c = a[0].length,
        l = a.length,
        h = [],
        g, f, q, e;
    for (g = 0; g < d; g++) {
        h[g] = []
    }
    for (g = 0; g < d; g++) {
        for (f = 0; f < c; f++) {
            q = 0;
            for (e = 0; e < l; e++) {
                q += b[g][e] * a[e][f]
            }
            h[g][f] = q
        }
    }
    return h
};
JXG.Math.Matrix.transpose = function (f) {
    var c = [],
        d, b, a, e;
    a = f.length;
    e = (f.length > 0) ? f[0].length : 0;
    for (d = 0; d < e; d++) {
        c.push([]);
        for (b = 0; b < a; b++) {
            c[d].push(f[b][d])
        }
    }
    return c
};
JXG.Math.crossProduct = function (b, a) {
    return [b[1] * a[2] - b[2] * a[1], b[2] * a[0] - b[0] * a[2], b[0] * a[1] - b[1] * a[0]]
};
JXG.Math.innerProduct = function (d, c, g) {
    var e, f = 0;
    if (typeof g == "undefined") {
        g = d.length
    }
    for (e = 0; e < g; e++) {
        f += d[e] * c[e]
    }
    return f
};
JXG.memoizer = function (b) {
    var a, c;
    if (b.memo) {
        return b.memo
    }
    a = {};
    c = Array.prototype.join;
    return (b.memo = function () {
        var d = c.call(arguments);
        return (typeof a[d] != "undefined") ? a[d] : a[d] = b.apply(this, arguments)
    })
};
JXG.Math.factorial = JXG.memoizer(function (a) {
    if (a < 0) {
        return NaN
    }
    if (a == 0 || a == 1) {
        return 1
    }
    return a * arguments.callee(a - 1)
});
JXG.Math.binomial = JXG.memoizer(function (e, c) {
    var a, d;
    if (c > e || c < 0) {
        return 0
    }
    if (c == 0 || c == e) {
        return 1
    }
    a = 1;
    for (d = 0; d < c; d++) {
        a *= (e - d);
        a /= (d + 1)
    }
    return a
});
JXG.Math.round = function (a, d) {
    var c, b;
    c = a - Math.ceil(a);
    b = c.toString();
    if (c < 0) {
        b = b.substr(0, d + 3)
    } else {
        b = b.substr(0, d + 2)
    }
    c = parseFloat(b);
    t = parseInt(a.toString());
    return t + c
};
JXG.Math.cosh = function (a) {
    return (Math.exp(a) + Math.exp(-a)) * 0.5
};
JXG.Math.sinh = function (a) {
    return (Math.exp(a) - Math.exp(-a)) * 0.5
};
JXG.Math.Numerics = {};
JXG.Math.Numerics.INT_TRAPEZ = 1;
JXG.Math.Numerics.INT_SIMPSON = 2;
JXG.Math.Numerics.INT_MILNE = 3;
JXG.Math.Numerics.number_of_nodes = 28;
JXG.Math.Numerics.integration_type = JXG.INT_MILNE;
JXG.Math.Numerics.backwardSolve = function (g, d) {
    var c = d,
        a, h, f, e;
    if (g.m) {
        a = g.m();
        h = g.n()
    } else {
        a = g.length;
        h = (g.length > 0) ? g[0].length : 0
    }
    for (f = a - 1; f >= 0; f--) {
        for (e = h - 1; e > f; e--) {
            c[f] -= g[f][e] * c[e]
        }
        c[f] /= g[f][f]
    }
    return c
};
JXG.Math.Numerics.Gauss = function (a, l) {
    var q = JXG.Math.eps,
        c, f, e, d, g, m, h;
    if (a.n) {
        c = a.n()
    } else {
        c = (a.length > 0) ? a[0].length : 0
    }
    g = new JXG.Math.Vector();
    for (f = 0; f < c; f++) {
        g.push(f)
    }
    for (e = 0; e < c; e++) {
        for (f = c - 1; f > e; f--) {
            if (Math.abs(a[f][e]) > JXG.Math.eps) {
                if (Math.abs(a[e][e]) < JXG.Math.eps) {
                    a.exchangeRows(f, e);
                    l.exchange(f, e);
                    g.exchange(f, e)
                } else {
                    a[f][e] /= a[e][e];
                    l[f] -= a[f][e] * l[e];
                    for (d = e + 1; d < c; d++) {
                        a[f][d] -= a[f][e] * a[e][d]
                    }
                }
            }
            if (Math.abs(a[e][e]) < JXG.Math.eps) {
                throw new SingularMatrixException()
            }
        }
    }
    return JXG.Math.Numerics.backwardSolve(a, l)
};
JXG.Math.Numerics.Inverse = function (m) {
    var g, f, e, u, q, a, l, d = m.length,
        c = [],
        b = [],
        h = [];
    for (g = 0; g < d; g++) {
        c[g] = [];
        for (f = 0; f < d; f++) {
            c[g][f] = m[g][f]
        }
        b[g] = g
    }
    for (f = 0; f < d; f++) {
        q = Math.abs(c[f][f]);
        a = f;
        for (g = f + 1; g < d; g++) {
            if (Math.abs(c[g][f]) > q) {
                q = Math.abs(c[g][f]);
                a = g
            }
        }
        if (q <= JXG.Math.eps) {
            return false
        }
        if (a > f) {
            for (e = 0; e < d; e++) {
                l = c[f][e];
                c[f][e] = c[a][e];
                c[a][e] = l
            }
            l = b[f];
            b[f] = b[a];
            b[a] = l
        }
        u = 1 / c[f][f];
        for (g = 0; g < d; g++) {
            c[g][f] *= u
        }
        c[f][f] = u;
        for (e = 0; e < d; e++) {
            if (e != f) {
                for (g = 0; g < d; g++) {
                    if (g != f) {
                        c[g][e] -= c[g][f] * c[f][e]
                    }
                }
                c[f][e] = -u * c[f][e]
            }
        }
    }
    for (g = 0; g < d; g++) {
        for (e = 0; e < d; e++) {
            h[b[e]] = c[g][e]
        }
        for (e = 0; e < d; e++) {
            c[g][e] = h[e]
        }
    }
    return c
};
JXG.Math.Numerics.QR = function (c, a) {};
JXG.Math.Numerics.Jacobi = function (u) {
    var h, f, e, v, a, l, s, r, w = JXG.Math.eps,
        q = 0,
        m, g, c = u.length,
        d = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        b = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
    for (h = 0; h < c; h++) {
        for (f = 0; f < c; f++) {
            d[h][f] = 0;
            b[h][f] = u[h][f];
            q += Math.abs(b[h][f])
        }
        d[h][h] = 1
    }
    if (c == 1) {
        return [b, d]
    }
    if (q <= 0) {
        return [b, d]
    }
    q /= (c * c);
    do {
        m = 0;
        g = 0;
        for (f = 1; f < c; f++) {
            for (h = 0; h < f; h++) {
                a = Math.abs(b[h][f]);
                if (a > g) {
                    g = a
                }
                m += a;
                if (a < w) {
                    continue
                } else {
                    a = Math.atan2(2 * b[h][f], b[h][h] - b[f][f]) * 0.5;
                    l = Math.sin(a);
                    s = Math.cos(a);
                    for (e = 0; e < c; e++) {
                        r = b[e][h];
                        b[e][h] = s * r + l * b[e][f];
                        b[e][f] = -l * r + s * b[e][f];
                        r = d[e][h];
                        d[e][h] = s * r + l * d[e][f];
                        d[e][f] = -l * r + s * d[e][f]
                    }
                    b[h][h] = s * b[h][h] + l * b[f][h];
                    b[f][f] = -l * b[h][f] + s * b[f][f];
                    b[h][f] = 0;
                    for (e = 0; e < c; e++) {
                        b[h][e] = b[e][h];
                        b[f][e] = b[e][f]
                    }
                }
            }
        }
    } while (Math.abs(m) / q > w);
    return [b, d]
};
JXG.Math.Numerics.NewtonCotes = function (d, g) {
    var b = 0,
        a = (d[1] - d[0]) / this.number_of_nodes,
        h, e, c;
    switch (this.integration_type) {
    case JXG.INT_TRAPEZ:
        b = (g(d[0]) + g(d[1])) * 0.5;
        h = d[0];
        for (e = 0; e < this.number_of_nodes - 1; e++) {
            h += a;
            b += g(h)
        }
        b *= a;
        break;
    case JXG.INT_SIMPSON:
        if (this.number_of_nodes % 2 > 0) {
            throw new Error("JSXGraph:  INT_SIMPSON requires JXG.Math.Numerics.number_of_nodes dividable by 2.")
        }
        c = this.number_of_nodes / 2;
        b = g(d[0]) + g(d[1]);
        h = d[0];
        for (e = 0; e < c - 1; e++) {
            h += 2 * a;
            b += 2 * g(h)
        }
        h = d[0] - a;
        for (e = 0; e < c; e++) {
            h += 2 * a;
            b += 4 * g(h)
        }
        b *= a / 3;
        break;
    default:
        if (this.number_of_nodes % 4 > 0) {
            throw new Error("JSXGraph: Error in INT_MILNE: JXG.Math.Numerics.number_of_nodes must be a multiple of 4")
        }
        c = this.number_of_nodes * 0.25;
        b = 7 * (g(d[0]) + g(d[1]));
        h = d[0];
        for (e = 0; e < c - 1; e++) {
            h += 4 * a;
            b += 14 * g(h)
        }
        h = d[0] - 3 * a;
        for (e = 0; e < c; e++) {
            h += 4 * a;
            b += 32 * (g(h) + g(h + 2 * a))
        }
        h = d[0] - 2 * a;
        for (e = 0; e < c; e++) {
            h += 4 * a;
            b += 12 * g(h)
        }
        b *= 2 * a / 45
    }
    return b
};
JXG.Math.Numerics.splineDef = function (k, h) {
    var a = k.length,
        c, e, f, g, b, d = new Array(),
        r = [],
        m = [],
        q;
    if (k.length != h.length) {
        throw new Error("JSXGraph: Error in JXG.Math.Numerics.splineDef: Input vector dimensions do not match.")
    }
    for (e = 0; e < a; e++) {
        c = {
            X: k[e],
            Y: h[e]
        };
        d.push(c)
    }
    d.sort(function (n, l) {
        return n.X - l.X
    });
    for (e = 0; e < a; e++) {
        k[e] = d[e].X;
        h[e] = d[e].Y
    }
    for (e = 0; e < a - 1; e++) {
        r.push(k[e + 1] - k[e])
    }
    for (e = 0; e < a - 2; e++) {
        m.push(6 * (h[e + 2] - h[e + 1]) / (r[e + 1]) - 6 * (h[e + 1] - h[e]) / (r[e]))
    }
    f = new Array();
    g = new Array();
    f.push(2 * (r[0] + r[1]));
    g.push(m[0]);
    for (e = 0; e < a - 3; e++) {
        b = r[e + 1] / f[e];
        f.push(2 * (r[e + 1] + r[e + 2]) - b * r[e + 1]);
        g.push(m[e + 1] - b * g[e])
    }
    q = new Array();
    q[a - 3] = g[a - 3] / f[a - 3];
    for (e = a - 4; e >= 0; e--) {
        q[e] = (g[e] - (r[e + 1] * q[e + 1])) / f[e]
    }
    for (e = a - 3; e >= 0; e--) {
        q[e + 1] = q[e]
    }
    q[0] = 0;
    q[a - 1] = 0;
    return q
};
JXG.Math.Numerics.splineEval = function (f, z, v, B) {
    var g = z.length,
        k = 1,
        h = false,
        A, q, m, w, u, s, r, e;
    if (g != v.length) {
        throw new Error("JSXGraph: Error in JXG.Math.Numerics.splineEval: Defining vector dimensions do not match.")
    }
    if (JXG.isArray(f)) {
        k = f.length;
        h = true
    } else {
        f = [f]
    }
    A = new Array();
    for (q = 0; q < k; q++) {
        if ((f[q] < z[0]) || (z[q] > z[g - 1])) {
            return "NaN"
        }
        m;
        for (m = 1; m < g; m++) {
            if (f[q] <= z[m]) {
                break
            }
        }
        m--;
        w = v[m];
        u = (v[m + 1] - v[m]) / (z[m + 1] - z[m]) - (z[m + 1] - z[m]) / 6 * (B[m + 1] + 2 * B[m]);
        s = B[m] / 2;
        r = (B[m + 1] - B[m]) / (6 * (z[m + 1] - z[m]));
        e = f[q] - z[m];
        A.push(w + (u + (s + r * e) * e) * e)
    }
    if (h) {
        return A
    } else {
        return A[0]
    }
};
JXG.Math.Numerics.generatePolynomialTerm = function (a, f, b, c) {
    var e = "",
        d;
    for (d = f; d >= 0; d--) {
        e += "(" + a[d].toPrecision(c) + ")";
        if (d > 1) {
            e += "*" + b + "<sup>" + d + "</sup> + "
        } else {
            if (d == 1) {
                e += "*" + b + " + "
            }
        }
    }
    return e
};
JXG.Math.Numerics.lagrangePolynomial = function (d) {
    var a = [];
    var c = "";
    var b = function (q, e) {
            var g, f, m, n, r, h = 0,
                l = 0;
            m = d.length;
            if (!e) {
                for (g = 0; g < m; g++) {
                    a[g] = 1;
                    n = d[g].X();
                    for (f = 0; f < m; f++) {
                        if (f != g) {
                            a[g] *= (n - d[f].X())
                        }
                    }
                    a[g] = 1 / a[g]
                }
                M = [];
                for (j = 0; j < m; j++) {
                    M.push([1])
                }
            }
            for (g = 0; g < m; g++) {
                n = d[g].X();
                if (q == n) {
                    return d[g].Y()
                } else {
                    r = a[g] / (q - n);
                    l += r;
                    h += r * d[g].Y()
                }
            }
            return h / l
        };
    b.getTerm = function () {
        return c
    };
    return b
};
JXG.Math.Numerics.neville = function (d) {
    var a = [];
    var c = function (q, e) {
            var g, m, n, r, u = JXG.Math.binomial,
                l = d.length,
                f = l - 1,
                h = 0,
                k = 0;
            if (!e) {
                r = 1;
                for (g = 0; g < l; g++) {
                    a[g] = u(f, g) * r;
                    r *= (-1)
                }
            }
            m = q;
            for (g = 0; g < l; g++) {
                if (m == 0) {
                    return d[g].X()
                } else {
                    r = a[g] / m;
                    m--;
                    h += d[g].X() * r;
                    k += r
                }
            }
            return h / k
        };
    var b = function (q, e) {
            var g, m, n, r, u = JXG.Math.binomial,
                l = d.length,
                f = l - 1,
                h = 0,
                k = 0;
            if (!e) {
                r = 1;
                for (g = 0; g < l; g++) {
                    a[g] = u(f, g) * r;
                    r *= (-1)
                }
            }
            m = q;
            for (g = 0; g < l; g++) {
                if (m == 0) {
                    return d[g].Y()
                } else {
                    r = a[g] / m;
                    m--;
                    h += d[g].Y() * r;
                    k += r
                }
            }
            return h / k
        };
    return [c, b, 0, function () {
        return d.length - 1
    }]
};
JXG.Math.Numerics.regressionPolynomial = function (e, l, k) {
    var a = [],
        f = 0,
        b, h, g, c, d = "";
    if (JXG.isPoint(e) && typeof e.Value == "function") {
        b = function () {
            return e.Value()
        }
    } else {
        if (JXG.isFunction(e)) {
            b = e
        } else {
            if (JXG.isNumber(e)) {
                b = function () {
                    return e
                }
            } else {
                throw new Error("JSXGraph: Can't create regressionPolynomial from degree of type'" + (typeof e) + "'.")
            }
        }
    }
    if (arguments.length == 3 && JXG.isArray(l) && JXG.isArray(k)) {
        c = 0
    } else {
        if (arguments.length == 2 && JXG.isArray(l) && JXG.isPoint(l[0])) {
            c = 1
        } else {
            throw new Error("JSXGraph: Can't create regressionPolynomial. Wrong parameters.")
        }
    }
    var m = function (E, n) {
            var u, r, A, w, D, q, C, F, z, v = l.length;
            z = Math.floor(b());
            if (!n) {
                if (c == 1) {
                    h = [];
                    g = [];
                    for (u = 0; u < v; u++) {
                        h[u] = l[u].X();
                        g[u] = l[u].Y()
                    }
                }
                if (c == 0) {
                    h = [];
                    g = [];
                    for (u = 0; u < v; u++) {
                        if (JXG.isFunction(l[u])) {
                            h.push(l[u]())
                        } else {
                            h.push(l[u])
                        }
                        if (JXG.isFunction(k[u])) {
                            g.push(k[u]())
                        } else {
                            g.push(k[u])
                        }
                    }
                }
                A = [];
                for (r = 0; r < v; r++) {
                    A.push([1])
                }
                for (u = 1; u <= z; u++) {
                    for (r = 0; r < v; r++) {
                        A[r][u] = A[r][u - 1] * h[r]
                    }
                }
                D = g;
                w = JXG.Math.Matrix.transpose(A);
                q = JXG.Math.matMatMult(w, A);
                C = JXG.Math.matVecMult(w, D);
                a = JXG.Math.Numerics.Gauss(q, C);
                d = JXG.Math.Numerics.generatePolynomialTerm(a, z, "x", 3)
            }
            F = a[z];
            for (u = z - 1; u >= 0; u--) {
                F = (F * E + a[u])
            }
            return F
        };
    m.getTerm = function () {
        return d
    };
    return m
};
JXG.Math.Numerics.bezier = function (b) {
    var a = 0;
    return [function (d, c) {
        var g = Math.floor(d) * 3,
            f = d % 1,
            e = 1 - f;
        if (!c) {
            a = Math.floor(b.length / 3)
        }
        if (d < 0) {
            return b[0].X()
        }
        if (d >= a) {
            return b[b.length - 1].X()
        }
        if (isNaN(d)) {
            return NaN
        }
        return e * e * (e * b[g].X() + 3 * f * b[g + 1].X()) + (3 * e * b[g + 2].X() + f * b[g + 3].X()) * f * f
    }, function (d, c) {
        var g = Math.floor(d) * 3,
            f = d % 1,
            e = 1 - f;
        if (!c) {
            a = Math.floor(b.length / 3)
        }
        if (d < 0) {
            return b[0].Y()
        }
        if (d >= a) {
            return b[b.length - 1].Y()
        }
        if (isNaN(d)) {
            return NaN
        }
        return e * e * (e * b[g].Y() + 3 * f * b[g + 1].Y()) + (3 * e * b[g + 2].Y() + f * b[g + 3].Y()) * f * f
    }, 0, function () {
        return Math.floor(b.length / 3)
    }]
};
JXG.Math.Numerics.D = function (c, d) {
    var b = 0.00001,
        a = 1 / (b * 2);
    if (arguments.length == 1 || (arguments.length > 1 && typeof arguments[1] == "undefined")) {
        return function (e, f) {
            return (c(e + b, f) - c(e - b, f)) * a
        }
    } else {
        return function (e, f) {
            return (c.apply(d, [e + b, f]) - c.apply(d, [e - b, f])) * a
        }
    }
};
JXG.Math.Numerics.I = function (a, b) {
    return JXG.Math.Numerics.NewtonCotes(a, b)
};
JXG.Math.Numerics.newton = function (e, a, g) {
    var b = 0,
        c = 0.000001,
        d = e.apply(g, [a]),
        k;
    while (b < 50 && Math.abs(d) > c) {
        k = this.D(e, g)(a);
        if (Math.abs(k) > c) {
            a -= d / k
        } else {
            a += (Math.random() * 0.2 - 1)
        }
        d = e.apply(g, [a]);
        b++
    }
    return a
};
JXG.Math.Numerics.root = function (b, a, c) {
    return this.newton(b, a, c)
};
JXG.Math.Numerics.riemann = function (l, e, m, c, g) {
    var d, v, k, u, h, s, q, b, a, r;
    d = [];
    v = [];
    h = 0;
    s = c;
    e = Math.floor(e);
    d[h] = s;
    v[h] = 0;
    if (e > 0) {
        u = (g - c) / e;
        a = u * 0.01;
        for (k = 0; k < e; k++) {
            if (m == "right") {
                q = l(s + u)
            } else {
                if (m == "middle") {
                    q = l(s + u * 0.5)
                } else {
                    if ((m == "left") || (m == "trapezodial")) {
                        q = l(s)
                    } else {
                        if (m == "lower") {
                            q = l(s);
                            for (b = s + a; b <= s + u; b += a) {
                                r = l(b);
                                if (r < q) {
                                    q = r
                                }
                            }
                        } else {
                            q = l(s);
                            for (b = s + a; b <= s + u; b += a) {
                                r = l(b);
                                if (r > q) {
                                    q = r
                                }
                            }
                        }
                    }
                }
            }
            h++;
            d[h] = s;
            v[h] = q;
            h++;
            s += u;
            if (m == "trapezodial") {
                q = l(s)
            }
            d[h] = s;
            v[h] = q;
            h++;
            d[h] = s;
            v[h] = 0
        }
    }
    return [d, v]
};
JXG.Math.Numerics.riemannsum = function (h, d, l, c, e) {
    var k, g, s, r, m, b, a, q;
    k = 0;
    r = c;
    d = Math.floor(d);
    if (d > 0) {
        s = (e - c) / d;
        a = s * 0.01;
        for (g = 0; g < d; g++) {
            if (l == "right") {
                m = h(r + s)
            } else {
                if (l == "middle") {
                    m = h(r + s * 0.5)
                } else {
                    if (l == "trapezodial") {
                        m = 0.5 * (h(r + s) + h(r))
                    } else {
                        if (l == "left") {
                            m = h(r)
                        } else {
                            if (l == "lower") {
                                m = h(r);
                                for (b = r + a; b <= r + s; b += a) {
                                    q = h(b);
                                    if (q < m) {
                                        m = q
                                    }
                                }
                            } else {
                                m = h(r);
                                for (b = r + a; b <= r + s; b += a) {
                                    q = h(b);
                                    if (q > m) {
                                        m = q
                                    }
                                }
                            }
                        }
                    }
                }
            }
            k += s * m;
            r += s
        }
    }
    return k
};
JXG.Math.Numerics.Butcher = function () {
    this.s = 0;
    this.A = [];
    this.b = [];
    this.c = []
};
JXG.Math.Numerics.predefinedButcher = {};
JXG.Math.Numerics.predefinedButcher.RK4 = {
    s: 4,
    A: [
        [0, 0, 0, 0],
        [0.5, 0, 0, 0],
        [0, 0.5, 0, 0],
        [0, 0, 1, 0]
    ],
    b: [1 / 6, 1 / 3, 1 / 3, 1 / 6],
    c: [0, 0.5, 0.5, 1]
};
JXG.Math.Numerics.predefinedButcher.Heun = {
    s: 2,
    A: [
        [0, 0],
        [1, 0]
    ],
    b: [0.5, 0.5],
    c: [0, 1]
};
JXG.Math.Numerics.predefinedButcher.Euler = {
    s: 1,
    A: [
        [0]
    ],
    b: [1],
    c: [0]
};
JXG.Math.Numerics.rungeKutta = function (c, G, m, d, F) {
    var n = [],
        g = [],
        E = (m[1] - m[0]) / d,
        u = m[0],
        H, D, C, A, z, B = G.length,
        v = c.s,
        b = 1000,
        a = d / b,
        q = [],
        w = 0;
    for (H = 0; H < B; H++) {
        n[H] = G[H]
    }
    for (D = 0; D < d; D++) {
        q[w] = [];
        for (H = 0; H < B; H++) {
            q[w][H] = n[H]
        }
        w++;
        A = [];
        for (C = 0; C < v; C++) {
            for (H = 0; H < B; H++) {
                g[H] = 0
            }
            for (z = 0; z < C; z++) {
                for (H = 0; H < B; H++) {
                    g[H] += (c.A[C][z]) * E * A[z][H]
                }
            }
            for (H = 0; H < B; H++) {
                g[H] += n[H]
            }
            A.push(F(u + c.c[C] * E, g))
        }
        for (H = 0; H < B; H++) {
            g[H] = 0
        }
        for (z = 0; z < v; z++) {
            for (H = 0; H < B; H++) {
                g[H] += c.b[z] * A[z][H]
            }
        }
        for (H = 0; H < B; H++) {
            n[H] = n[H] + E * g[H]
        }
        u += E
    }
    return q
};
JXG.Math.Statistics = {};
JXG.Math.Statistics.sum = function (b) {
    var d, a, c = 0;
    for (d = 0, a = b.length; d < a; d++) {
        c += b[d]
    }
    return c
};
JXG.Math.Statistics.prod = function (b) {
    var d, a, c = 1;
    for (d = 0, a = b.length; d < a; d++) {
        c *= b[d]
    }
    return c
};
JXG.Math.Statistics.mean = function (a) {
    if (a.length > 0) {
        return this.sum(a) / a.length
    } else {
        return 0
    }
};
JXG.Math.Statistics.median = function (b) {
    var c, a;
    if (b.length > 0) {
        c = b.clone();
        c.sort(function (e, d) {
            return e - d
        });
        a = c.length;
        if (a % 2 == 1) {
            return c[parseInt(a * 0.5)]
        } else {
            return (c[a * 0.5 - 1] + c[a * 0.5]) * 0.5
        }
    } else {
        return 0
    }
};
JXG.Math.Statistics.variance = function (c) {
    var b, e, d, a;
    if (c.length > 1) {
        b = this.mean(c);
        e = 0;
        for (d = 0, a = c.length; d < a; d++) {
            e += (c[d] - b) * (c[d] - b)
        }
        return e / (c.length - 1)
    } else {
        return 0
    }
};
JXG.Math.Statistics.sd = function (a) {
    return Math.sqrt(this.variance(a))
};
JXG.Math.Statistics.weightedMean = function (a, b) {
    if (a.length != b.length) {
        return
    }
    if (a.length > 0) {
        return this.mean(this.multiply(a, b))
    } else {
        return 0
    }
};
JXG.Math.Statistics.max = function (b) {
    var d, c, a;
    if (b.length == 0) {
        return NaN
    }
    d = b[0];
    for (c = 1, a = b.length; c < a; c++) {
        d = (b[c] > d) ? (b[c]) : d
    }
    return d
};
JXG.Math.Statistics.min = function (b) {
    var d, c, a;
    if (b.length == 0) {
        return NaN
    }
    d = b[0];
    for (c = 1, a = b.length; c < a; c++) {
        d = (b[c] < d) ? (b[c]) : d
    }
    return d
};
JXG.Math.Statistics.range = function (a) {
    return [this.min(a), this.max(a)]
};
JXG.Math.Statistics.diff = function (a) {
    return a
};
JXG.Math.Statistics.min = function (b) {
    var d, c, a;
    if (b.length == 0) {
        return NaN
    }
    d = b[0];
    for (c = 1, a = b.length; c < a; c++) {
        d = (b[c] < d) ? (b[c]) : d
    }
    return d
};
JXG.Math.Statistics.abs = function (b) {
    var d, a, c = [];
    if (typeof JXG.isArray(arr1)) {
        for (d = 0, a = b.length; d < a; d++) {
            c[d] = Math.abs(b[d])
        }
    } else {
        if (typeof b == "number") {
            return Math.abs(b)
        } else {
            c = null
        }
    }
    return c
};
JXG.Math.Statistics.add = function (c, b) {
    var e, a, d = [];
    if (typeof JXG.isArray(c) && typeof b == "number") {
        for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
            d[e] = c[e] + b
        }
    } else {
        if (typeof c == "number" && typeof JXG.isArray(b)) {
            for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                d[e] = c + b[e]
            }
        } else {
            if (typeof JXG.isArray(c) && typeof JXG.isArray(b)) {
                for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                    d[e] = c[e] + b[e]
                }
            } else {
                if (typeof c == "number" && typeof b == "number") {
                    for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                        d[e] = c + b
                    }
                } else {
                    d = null
                }
            }
        }
    }
    return d
};
JXG.Math.Statistics.divide = function (c, b) {
    var e, a, d = [];
    if (typeof JXG.isArray(c) && typeof b == "number") {
        for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
            d[e] = c[e] / b
        }
    } else {
        if (typeof c == "number" && typeof JXG.isArray(b)) {
            for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                d[e] = c / b[e]
            }
        } else {
            if (typeof JXG.isArray(c) && typeof JXG.isArray(b)) {
                for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                    d[e] = c[e] / b[e]
                }
            } else {
                if (typeof c == "number" && typeof b == "number") {
                    for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                        d[e] = c / b
                    }
                } else {
                    d = null
                }
            }
        }
    }
    return d
};
JXG.Math.Statistics.mod = function (c, b) {
    var e, a, d = [];
    if (typeof JXG.isArray(c) && typeof b == "number") {
        for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
            d[e] = c[e] % b
        }
    } else {
        if (typeof c == "number" && typeof JXG.isArray(b)) {
            for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                d[e] = c % b[e]
            }
        } else {
            if (typeof JXG.isArray(c) && typeof JXG.isArray(b)) {
                for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                    d[e] = c[e] % b[e]
                }
            } else {
                if (typeof c == "number" && typeof b == "number") {
                    for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                        d[e] = c % b
                    }
                } else {
                    d = null
                }
            }
        }
    }
    return d
};
JXG.Math.Statistics.multiply = function (c, b) {
    var e, a, d = [];
    if (typeof JXG.isArray(c) && typeof b == "number") {
        for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
            d[e] = c[e] * b
        }
    } else {
        if (typeof c == "number" && typeof JXG.isArray(b)) {
            for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                d[e] = c * b[e]
            }
        } else {
            if (typeof JXG.isArray(c) && typeof JXG.isArray(b)) {
                for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                    d[e] = c[e] * b[e]
                }
            } else {
                if (typeof c == "number" && typeof b == "number") {
                    for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                        d[e] = c * b
                    }
                } else {
                    d = null
                }
            }
        }
    }
    return d
};
JXG.Math.Statistics.subtract = function (c, b) {
    var e, a, d = [];
    if (typeof JXG.isArray(c) && typeof b == "number") {
        for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
            d[e] = c[e] - b
        }
    } else {
        if (typeof c == "number" && typeof JXG.isArray(b)) {
            for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                d[e] = c - b[e]
            }
        } else {
            if (typeof JXG.isArray(c) && typeof JXG.isArray(b)) {
                for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                    d[e] = c[e] - b[e]
                }
            } else {
                if (typeof c == "number" && typeof b == "number") {
                    for (e = 0, a = Math.min(c.length, b.length); e < a; e++) {
                        d[e] = c - b
                    }
                } else {
                    d = null
                }
            }
        }
    }
    return d
};
JXG.Math.Symbolic = {};
JXG.Math.Symbolic.generateSymbolicCoordinatesPartial = function (l, e, d, b) {
    function a(k) {
        if (b == "underscore") {
            return "" + d + "_{" + k + "}"
        } else {
            if (b == "brace") {
                return "" + d + "[" + k + "]"
            } else {
                return "" + d + "" + k
            }
        }
    }
    var g = e.ancestors;
    var f = 0;
    var h;
    for (var m in g) {
        h = 0;
        if (JXG.isPoint(g[m])) {
            for (var c in g[m].ancestors) {
                h++
            }
            if (h == 0) {
                g[m].symbolic.x = g[m].coords.usrCoords[1];
                g[m].symbolic.y = g[m].coords.usrCoords[2]
            } else {
                f++;
                g[m].symbolic.x = a(f);
                f++;
                g[m].symbolic.y = a(f)
            }
        }
    }
    if (JXG.isPoint(e)) {
        e.symbolic.x = "x";
        e.symbolic.y = "y"
    }
    return f
};
JXG.Math.Symbolic.clearSymbolicCoordinates = function (b) {
    for (var a in b.objects) {
        if (JXG.isPoint(b.objects[a])) {
            b.objects[a].symbolic.x = "";
            b.objects[a].symbolic.y = ""
        }
    }
};
JXG.Math.Symbolic.generatePolynomials = function (g, c, d) {
    if (d) {
        this.generateSymbolicCoordinatesPartial(g, c, "u", "brace")
    }
    var f = c.ancestors,
        h, e = [],
        m = [],
        l, a, b;
    f[c.id] = c;
    for (l in f) {
        h = 0;
        e = [];
        if (JXG.isPoint(f[l])) {
            for (a in f[l].ancestors) {
                h++
            }
            if (h > 0) {
                e = f[l].generatePolynomial();
                for (b = 0; b < e.length; b++) {
                    m.push(e[b])
                }
            }
        }
    }
    if (d) {
        this.clearSymbolicCoordinates(g)
    }
    return m
};
JXG.Math.Symbolic.geometricLocusByGroebnerBase = function (e, g, k) {
    var f = this.generateSymbolicCoordinatesPartial(e, g, "u", "brace"),
        a = this.generatePolynomials(e, g);
    var c = a.join(","),
        b = new JXG.Coords(JXG.COORDS_BY_USR, [0, 0], e),
        d = new JXG.Coords(JXG.COORDS_BY_USR, [e.canvasWidth, e.canvasHeight], e),
        h;
    if (typeof JXG.Server.modules.geoloci == "undefined") {
        JXG.Server.loadModule("geoloci")
    }
    if (typeof JXG.Server.modules.geoloci == "undefined") {
        throw new Error("JSXGraph: Unable to load JXG.Server module 'geoloci.py'.")
    }
    this.cbp = function (l) {
        k(l.datax, l.datay, l.polynomial)
    };
    this.cb = JXG.bind(this.cbp, this);
    JXG.Server.modules.geoloci.lociCoCoA(b.usrCoords[1], d.usrCoords[1], d.usrCoords[2], b.usrCoords[2], f, c, this.cb);
    this.clearSymbolicCoordinates(e)
};
JXG.Complex = function (a, b) {
    this.isComplex = true;
    if (typeof a == "undefined") {
        a = 0
    }
    if (typeof b == "undefined") {
        b = 0
    }
    if (a.isComplex) {
        b = a.imaginary;
        a = a.real
    }
    this.real = a;
    this.imaginary = b;
    this.absval = 0;
    this.angle = 0
};
JXG.Complex.prototype.toString = function () {
    return "" + this.real + " + " + this.imaginary + "i"
};
JXG.Complex.prototype.add = function (a) {
    if (typeof a == "number") {
        this.real += a
    } else {
        this.real += a.real;
        this.imaginary += a.imaginary
    }
};
JXG.Complex.prototype.sub = function (a) {
    if (typeof a == "number") {
        this.real -= a
    } else {
        this.real -= a.real;
        this.imaginary -= a.imaginary
    }
};
JXG.Complex.prototype.mult = function (a) {
    if (typeof a == "number") {
        this.real *= a;
        this.imaginary *= a
    } else {
        this.real = this.real * a.real - this.imaginary * a.imaginary;
        this.imaginary = this.real * a.imaginary + this.imaginary * a.real
    }
};
JXG.Complex.prototype.div = function (b) {
    var a;
    if (typeof b == "number") {
        if (Math.abs(b) < Math.eps) {
            this.real = Infinity;
            this.imaginary = Infinity;
            return
        }
        this.real /= b;
        this.imaginary /= b
    } else {
        if ((Math.abs(b.real) < Math.eps) && (Math.abs(b.imaginary) < Math.eps)) {
            this.real = Infinity;
            this.imaginary = Infinity;
            return
        }
        a = b.real * b.real + b.imaginary * b.imaginary;
        this.real = (this.real * b.real + this.imaginary * b.imaginary) / a;
        this.imaginary = (this.imaginary * b.real - this.real * b.imaginary) / a
    }
};
JXG.C = {};
JXG.C.add = function (b, a) {
    var c = new JXG.Complex(b);
    c.add(a);
    return c
};
JXG.C.sub = function (b, a) {
    var c = new JXG.Complex(b);
    c.sub(a);
    return c
};
JXG.C.mult = function (b, a) {
    var c = new JXG.Complex(b);
    c.mult(a);
    return c
};
JXG.C.div = function (b, a) {
    var c = new JXG.Complex(b);
    c.div(a);
    return c
};
JXG.AbstractRenderer = function () {
    this.vOffsetText = 8;
    this.enhancedRendering = true
};
JXG.AbstractRenderer.prototype.drawPoint = function (a) {
    var b, c = a.visProp.face;
    if (c == "cross" || c == "x") {
        b = this.createPrim("path", a.id);
        this.appendChildPrim(b, a.layer);
        this.appendNodesToElement(a, "path")
    } else {
        if (c == "circle" || c == "o") {
            b = this.createPrim("circle", a.id);
            this.appendChildPrim(b, a.layer);
            this.appendNodesToElement(a, "circle")
        } else {
            if (c == "square" || c == "[]") {
                b = this.createPrim("rect", a.id);
                this.appendChildPrim(b, a.layer);
                this.appendNodesToElement(a, "rect")
            } else {
                if (c == "plus" || c == "+") {
                    b = this.createPrim("path", a.id);
                    this.appendChildPrim(b, a.layer);
                    this.appendNodesToElement(a, "path")
                } else {
                    if (c == "diamond" || c == "<>") {
                        b = this.createPrim("path", a.id);
                        this.appendChildPrim(b, a.layer);
                        this.appendNodesToElement(a, "path")
                    } else {
                        if (c == "triangleup" || c == "a" || c == "^") {
                            b = this.createPrim("path", a.id);
                            this.appendChildPrim(b, a.layer);
                            this.appendNodesToElement(a, "path")
                        } else {
                            if (c == "triangledown" || c == "v") {
                                b = this.createPrim("path", a.id);
                                this.appendChildPrim(b, a.layer);
                                this.appendNodesToElement(a, "path")
                            } else {
                                if (c == "triangleleft" || c == "<") {
                                    b = this.createPrim("path", a.id);
                                    this.appendChildPrim(b, a.layer);
                                    this.appendNodesToElement(a, "path")
                                } else {
                                    if (c == "triangleright" || c == ">") {
                                        b = this.createPrim("path", a.id);
                                        this.appendChildPrim(b, a.layer);
                                        this.appendNodesToElement(a, "path")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.setObjectStrokeWidth(a, a.visProp.strokeWidth);
    this.setObjectStrokeColor(a, a.visProp.strokeColor, a.visProp.strokeOpacity);
    this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillOpacity);
    this.updatePoint(a)
};
JXG.AbstractRenderer.prototype.updatePoint = function (b) {
    var a = b.visProp.size,
        c = b.visProp.face;
    if (isNaN(b.coords.scrCoords[2]) || isNaN(b.coords.scrCoords[1])) {
        return
    }
    if (this.enhancedRendering) {
        if (!b.visProp.draft) {
            this.setObjectStrokeWidth(b, b.visProp.strokeWidth);
            this.setObjectStrokeColor(b, b.visProp.strokeColor, b.visProp.strokeOpacity);
            this.setObjectFillColor(b, b.visProp.fillColor, b.visProp.fillOpacity)
        } else {
            this.setDraft(b)
        }
    }
    a *= ((!b.board || !b.board.options.point.zoom) ? 1 : Math.sqrt(b.board.zoomX * b.board.zoomY));
    if (c == "cross" || c == "x") {
        this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, "x"), b.board)
    } else {
        if (c == "circle" || c == "o") {
            this.updateCirclePrim(b.rendNode, b.coords.scrCoords[1], b.coords.scrCoords[2], a + 1)
        } else {
            if (c == "square" || c == "[]") {
                this.updateRectPrim(b.rendNode, b.coords.scrCoords[1] - a, b.coords.scrCoords[2] - a, a * 2, a * 2)
            } else {
                if (c == "plus" || c == "+") {
                    this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, "+"), b.board)
                } else {
                    if (c == "diamond" || c == "<>") {
                        this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, "diamond"), b.board)
                    } else {
                        if (c == "triangleup" || c == "a") {
                            this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, "A"), b.board)
                        } else {
                            if (c == "triangledown" || c == "v") {
                                this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, "v"), b.board)
                            } else {
                                if (c == "triangleleft" || c == "<") {
                                    this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, "<"), b.board)
                                } else {
                                    if (c == "triangleright" || c == ">") {
                                        this.updatePathPrim(b.rendNode, this.updatePathStringPoint(b, a, ">"), b.board)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.setShadow(b)
};
JXG.AbstractRenderer.prototype.changePointStyle = function (a) {
    var b = this.getElementById(a.id);
    if (b != null) {
        this.remove(b)
    }
    this.drawPoint(a);
    JXG.clearVisPropOld(a);
    if (!a.visProp.visible) {
        this.hide(a)
    }
    if (a.visProp.draft) {
        this.setDraft(a)
    }
};
JXG.AbstractRenderer.prototype.drawLine = function (a) {
    var b = this.createPrim("line", a.id);
    this.appendChildPrim(b, a.layer);
    this.appendNodesToElement(a, "lines");
    this.updateLine(a)
};
JXG.AbstractRenderer.prototype.updateLine = function (b) {
    var n = new JXG.Coords(JXG.COORDS_BY_USER, b.point1.coords.usrCoords, b.board),
        l = new JXG.Coords(JXG.COORDS_BY_USER, b.point2.coords.usrCoords, b.board),
        a, q, f, e, k, d, h, g, c;
    this.calcStraight(b, n, l);
    this.updateLinePrim(b.rendNode, n.scrCoords[1], n.scrCoords[2], l.scrCoords[1], l.scrCoords[2], b.board);
    if (b.image != null) {
        a = n.scrCoords[1];
        q = n.scrCoords[2];
        f = l.scrCoords[1];
        e = l.scrCoords[2];
        k = Math.atan2(e - q, f - a);
        h = 250;
        g = 256;
        c = [
            [1, 0, 0],
            [h * (1 - Math.cos(k)) + g * Math.sin(k), Math.cos(k), -Math.sin(k)],
            [g * (1 - Math.cos(k)) - h * Math.sin(k), Math.sin(k), Math.cos(k)]
        ];
        b.imageTransformMatrix = c
    }
    this.makeArrows(b);
    if (this.enhancedRendering) {
        if (!b.visProp.draft) {
            this.setObjectStrokeWidth(b, b.visProp.strokeWidth);
            this.setObjectStrokeColor(b, b.visProp.strokeColor, b.visProp.strokeOpacity);
            this.setDashStyle(b, b.visProp);
            this.setShadow(b)
        } else {
            this.setDraft(b)
        }
    }
};
JXG.AbstractRenderer.prototype.calcStraight = function (e, n, m) {
    var b, a, k, g, q, d, l, v, h, f, u, r;
    q = e.visProp.straightFirst;
    d = e.visProp.straightLast;
    if (Math.abs(n.scrCoords[0]) < JXG.Math.eps) {
        q = true
    }
    if (Math.abs(m.scrCoords[0]) < JXG.Math.eps) {
        d = true
    }
    if (!q && !d) {
        return
    }
    l = [];
    l[0] = e.stdform[0] - e.stdform[1] * e.board.origin.scrCoords[1] / e.board.stretchX + e.stdform[2] * e.board.origin.scrCoords[2] / e.board.stretchY;
    l[1] = e.stdform[1] / e.board.stretchX;
    l[2] = e.stdform[2] / (-e.board.stretchY);
    if (isNaN(l[0] + l[1] + l[2])) {
        return
    }
    v = [];
    v[0] = JXG.Math.crossProduct(l, [0, 0, 1]);
    v[1] = JXG.Math.crossProduct(l, [0, 1, 0]);
    v[2] = JXG.Math.crossProduct(l, [-e.board.canvasHeight, 0, 1]);
    v[3] = JXG.Math.crossProduct(l, [-e.board.canvasWidth, 1, 0]);
    for (h = 0; h < 4; h++) {
        if (Math.abs(v[h][0]) > JXG.Math.eps) {
            for (f = 2; f > 0; f--) {
                v[h][f] /= v[h][0]
            }
            v[h][0] = 1
        }
    }
    b = false;
    a = false;
    if (!q && n.scrCoords[1] >= 0 && n.scrCoords[1] <= e.board.canvasWidth && n.scrCoords[2] >= 0 && n.scrCoords[2] <= e.board.canvasHeight) {
        b = true
    }
    if (!d && m.scrCoords[1] >= 0 && m.scrCoords[1] <= e.board.canvasWidth && m.scrCoords[2] >= 0 && m.scrCoords[2] <= e.board.canvasHeight) {
        a = true
    }
    if (Math.abs(v[1][0]) < JXG.Math.eps) {
        k = v[0];
        g = v[2]
    } else {
        if (Math.abs(v[0][0]) < JXG.Math.eps) {
            k = v[1];
            g = v[3]
        } else {
            if (v[1][2] < 0) {
                k = v[0];
                if (v[3][2] > e.board.canvasHeight) {
                    g = v[2]
                } else {
                    g = v[3]
                }
            } else {
                if (v[1][2] > e.board.canvasHeight) {
                    k = v[2];
                    if (v[3][2] < 0) {
                        g = v[0]
                    } else {
                        g = v[3]
                    }
                } else {
                    k = v[1];
                    if (v[3][2] < 0) {
                        g = v[0]
                    } else {
                        if (v[3][2] > e.board.canvasHeight) {
                            g = v[2]
                        } else {
                            g = v[3]
                        }
                    }
                }
            }
        }
    }
    k = new JXG.Coords(JXG.COORDS_BY_SCREEN, k.slice(1), e.board);
    g = new JXG.Coords(JXG.COORDS_BY_SCREEN, g.slice(1), e.board);
    if (!b && !a) {
        if (!q && d && !this.isSameDirection(n, m, k) && !this.isSameDirection(n, m, g)) {
            return
        } else {
            if (q && !d && !this.isSameDirection(m, n, k) && !this.isSameDirection(m, n, g)) {
                return
            }
        }
    }
    if (!b) {
        if (!a) {
            if (this.isSameDirection(n, m, k)) {
                if (!this.isSameDirection(n, m, g)) {
                    r = k;
                    u = g
                } else {
                    if (e.board.algebra.affineDistance(m.usrCoords, k.usrCoords) < e.board.algebra.affineDistance(m.usrCoords, g.usrCoords)) {
                        u = k;
                        r = g
                    } else {
                        r = k;
                        u = g
                    }
                }
            } else {
                if (this.isSameDirection(n, m, g)) {
                    u = k;
                    r = g
                } else {
                    if (e.board.algebra.affineDistance(m.usrCoords, k.usrCoords) < e.board.algebra.affineDistance(m.usrCoords, g.usrCoords)) {
                        r = k;
                        u = g
                    } else {
                        u = k;
                        r = g
                    }
                }
            }
        } else {
            if (this.isSameDirection(m, n, k)) {
                u = k
            } else {
                u = g
            }
        }
    } else {
        if (!a) {
            if (this.isSameDirection(n, m, k)) {
                r = k
            } else {
                r = g
            }
        }
    }
    if (u) {
        n.setCoordinates(JXG.COORDS_BY_USER, u.usrCoords.slice(1))
    }
    if (r) {
        m.setCoordinates(JXG.COORDS_BY_USER, r.usrCoords.slice(1))
    }
};
JXG.AbstractRenderer.prototype.isSameDirection = function (g, d, c) {
    var b, a, f, e;
    b = d.usrCoords[1] - g.usrCoords[1];
    a = d.usrCoords[2] - g.usrCoords[2];
    f = c.usrCoords[1] - g.usrCoords[1];
    e = c.usrCoords[2] - g.usrCoords[2];
    if (Math.abs(b) < JXG.Math.eps) {
        b = 0
    }
    if (Math.abs(a) < JXG.Math.eps) {
        a = 0
    }
    if (Math.abs(f) < JXG.Math.eps) {
        f = 0
    }
    if (Math.abs(e) < JXG.Math.eps) {
        e = 0
    }
    if (b >= 0 && f >= 0) {
        if ((a >= 0 && e >= 0) || (a <= 0 && e <= 0)) {
            return true
        }
    } else {
        if (b <= 0 && f <= 0) {
            if ((a >= 0 && e >= 0) || (a <= 0 && e <= 0)) {
                return true
            }
        }
    }
    return false
};
JXG.AbstractRenderer.prototype.updateTicks = function (b, d, a, e, c) {};
JXG.AbstractRenderer.prototype.removeTicks = function (a) {
    var b = this.getElementById(a.id + "_ticks");
    this.remove(b)
};
JXG.AbstractRenderer.prototype.drawArrow = function (a) {
    var b = this.createPrim("line", a.id);
    this.setObjectStrokeWidth(a, a.visProp.strokeWidth);
    this.setObjectStrokeColor(a, a.visProp.strokeColor, a.visProp.strokeOpacity);
    this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillOpacity);
    this.setDashStyle(a, a.visProp);
    this.makeArrow(b, a);
    this.appendChildPrim(b, a.layer);
    this.appendNodesToElement(a, "lines");
    this.updateArrow(a)
};
JXG.AbstractRenderer.prototype.updateArrow = function (a) {
    if (this.enhancedRendering) {
        if (!a.visProp.draft) {
            this.setObjectStrokeWidth(a, a.visProp.strokeWidth);
            this.setObjectStrokeColor(a, a.visProp.strokeColor, a.visProp.strokeOpacity);
            this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillOpacity);
            this.setShadow(a);
            this.setDashStyle(a, a.visProp)
        } else {
            this.setDraft(a)
        }
    }
    this.updateLinePrim(a.rendNode, a.point1.coords.scrCoords[1], a.point1.coords.scrCoords[2], a.point2.coords.scrCoords[1], a.point2.coords.scrCoords[2], a.board)
};
JXG.AbstractRenderer.prototype.drawCurve = function (a) {
    var b = this.createPrim("path", a.id);
    this.appendChildPrim(b, a.layer);
    this.appendNodesToElement(a, "path");
    this.setObjectStrokeWidth(a, a.visProp.strokeWidth);
    this.setObjectStrokeColor(a, a.visProp.strokeColor, a.visProp.strokeOpacity);
    this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillOpacity);
    this.setDashStyle(a, a.visProp);
    this.updateCurve(a)
};
JXG.AbstractRenderer.prototype.updateCurve = function (a) {
    if (this.enhancedRendering) {
        if (!a.visProp.draft) {
            this.setObjectStrokeWidth(a, a.visProp.strokeWidth);
            this.setObjectStrokeColor(a, a.visProp.strokeColor, a.visProp.strokeOpacity);
            this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillOpacity);
            this.setDashStyle(a, a.visProp);
            this.setShadow(a)
        } else {
            this.setDraft(a)
        }
    }
    this.updatePathPrim(a.rendNode, this.updatePathStringPrim(a), a.board);
    this.makeArrows(a)
};
JXG.AbstractRenderer.prototype.drawCircle = function (a) {
    var b = this.createPrim("ellipse", a.id);
    this.appendChildPrim(b, a.layer);
    this.appendNodesToElement(a, "ellipse");
    this.updateCircle(a)
};
JXG.AbstractRenderer.prototype.updateCircle = function (b) {
    if (this.enhancedRendering) {
        if (!b.visProp.draft) {
            this.setObjectStrokeWidth(b, b.visProp.strokeWidth);
            this.setObjectStrokeColor(b, b.visProp.strokeColor, b.visProp.strokeOpacity);
            this.setObjectFillColor(b, b.visProp.fillColor, b.visProp.fillOpacity);
            this.setDashStyle(b, b.visProp);
            this.setShadow(b)
        } else {
            this.setDraft(b)
        }
    }
    var a = b.Radius();
    if (a > 0 && !isNaN(b.midpoint.coords.scrCoords[1] + b.midpoint.coords.scrCoords[2])) {
        this.updateEllipsePrim(b.rendNode, b.midpoint.coords.scrCoords[1], b.midpoint.coords.scrCoords[2], (a * b.board.stretchX), (a * b.board.stretchY))
    }
};
JXG.AbstractRenderer.prototype.drawPolygon = function (a) {
    var b = this.createPrim("polygon", a.id);
    a.visProp.fillOpacity = 0.3;
    this.appendChildPrim(b, a.layer);
    this.appendNodesToElement(a, "polygon");
    this.updatePolygon(a)
};
JXG.AbstractRenderer.prototype.updatePolygon = function (a) {
    if (this.enhancedRendering) {
        if (!a.visProp.draft) {
            this.setObjectStrokeWidth(a, a.visProp.strokeWidth);
            this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillOpacity);
            this.setShadow(a)
        } else {
            this.setDraft(a)
        }
    }
    this.updatePolygonePrim(a.rendNode, a)
};
JXG.AbstractRenderer.prototype.drawText = function (a) {
    var b;
    if (a.display == "html") {
        b = this.container.ownerDocument.createElement("div");
        b.style.position = "absolute";
        b.style.color = a.visProp.strokeColor;
        b.className = "JXGtext";
        b.style.zIndex = "10";
        this.container.appendChild(b);
        b.setAttribute("id", a.id)
    } else {
        b = this.drawInternalText(a)
    }
    b.style.fontSize = a.board.options.text.fontSize + "px";
    a.rendNode = b;
    a.htmlStr = "";
    this.updateText(a)
};
JXG.AbstractRenderer.prototype.drawInternalText = function (a) {};
JXG.AbstractRenderer.prototype.updateText = function (a) {
    if (a.visProp.visible == false) {
        return
    }
    if (isNaN(a.coords.scrCoords[1] + a.coords.scrCoords[2])) {
        return
    }
    this.updateTextStyle(a);
    if (a.display == "html") {
        a.rendNode.style.left = (a.coords.scrCoords[1]) + "px";
        a.rendNode.style.top = (a.coords.scrCoords[2] - this.vOffsetText) + "px";
        a.updateText();
        if (a.htmlStr != a.plaintextStr) {
            a.rendNode.innerHTML = a.plaintextStr;
            if (a.board.options.text.useASCIIMathML) {
                AMprocessNode(a.rendNode, false)
            }
            a.htmlStr = a.plaintextStr
        }
    } else {
        this.updateInternalText(a)
    }
};
JXG.AbstractRenderer.prototype.updateInternalText = function (a) {};
JXG.AbstractRenderer.prototype.updateTextStyle = function (b) {
    var a;
    if (b.visProp.fontSize) {
        if (typeof b.visProp.fontSize == "function") {
            a = b.visProp.fontSize();
            b.rendNode.style.fontSize = (a > 0 ? a : 0)
        } else {
            b.rendNode.style.fontSize = (b.visProp.fontSize)
        }
    }
};
JXG.AbstractRenderer.prototype.drawImage = function (a) {};
JXG.AbstractRenderer.prototype.updateImage = function (a) {
    this.updateRectPrim(a.rendNode, a.coords.scrCoords[1], a.coords.scrCoords[2] - a.size[1], a.size[0], a.size[1]);
    if (a.parent != null) {
        this.transformImageParent(a, a.parent.imageTransformMatrix)
    } else {
        this.transformImageParent(a)
    }
    this.transformImage(a, a.transformations)
};
JXG.AbstractRenderer.prototype.drawGrid = function (e) {
    var x = e.gridX,
        v = e.gridY,
        s = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, 0], e),
        f = new JXG.Coords(JXG.COORDS_BY_SCREEN, [e.canvasWidth, e.canvasHeight], e),
        y = Math.ceil(s.usrCoords[1]),
        u = 0,
        w, a, q, r, m, h, n, g, b, c, d;
    e.hasGrid = true;
    for (w = 0; w <= x + 1; w++) {
        if (y - w / x < s.usrCoords[1]) {
            u = w - 1;
            break
        }
    }
    y = Math.floor(f.usrCoords[1]);
    a = 0;
    for (w = 0; w <= x + 1; w++) {
        if (y + w / x > f.usrCoords[1]) {
            a = w - 1;
            break
        }
    }
    y = Math.ceil(f.usrCoords[2]);
    r = 0;
    for (w = 0; w <= v + 1; w++) {
        if (y - w / v < f.usrCoords[2]) {
            r = w - 1;
            break
        }
    }
    y = Math.floor(s.usrCoords[2]);
    q = 0;
    for (w = 0; w <= v + 1; w++) {
        if (y + w / v > s.usrCoords[2]) {
            q = w - 1;
            break
        }
    }
    m = Math.round((1 / x) * e.stretchX);
    h = Math.round((1 / v) * e.stretchY);
    n = new JXG.Coords(JXG.COORDS_BY_USER, [Math.ceil(s.usrCoords[1]) - u / x, Math.floor(s.usrCoords[2]) + q / v], e);
    g = new JXG.Coords(JXG.COORDS_BY_USER, [Math.floor(f.usrCoords[1]) + a / x, Math.ceil(f.usrCoords[2]) - r / v], e);
    b = this.drawVerticalGrid(n, g, m, e);
    this.appendChildPrim(b, e.options.layer.grid);
    if (!e.snapToGrid) {
        c = new Object();
        c.visProp = {};
        c.rendNode = b;
        c.elementClass = JXG.OBJECT_CLASS_LINE;
        c.id = "gridx";
        JXG.clearVisPropOld(c);
        this.setObjectStrokeColor(c, e.gridColor, e.gridOpacity)
    } else {
        c = new Object();
        c.visProp = {};
        c.rendNode = b;
        c.elementClass = JXG.OBJECT_CLASS_LINE;
        c.id = "gridx";
        JXG.clearVisPropOld(c);
        this.setObjectStrokeColor(c, "#FF8080", 0.5)
    }
    this.setPropertyPrim(b, "stroke-width", "0.4px");
    if (e.gridDash) {
        this.setGridDash("gridx")
    }
    b = this.drawHorizontalGrid(n, g, h, e);
    this.appendChildPrim(b, e.options.layer.grid);
    if (!e.snapToGrid) {
        c = new Object();
        c.visProp = {};
        c.rendNode = b;
        c.elementClass = JXG.OBJECT_CLASS_LINE;
        c.id = "gridy";
        JXG.clearVisPropOld(c);
        this.setObjectStrokeColor(c, e.gridColor, e.gridOpacity)
    } else {
        c = new Object();
        c.visProp = {};
        c.rendNode = b;
        c.elementClass = JXG.OBJECT_CLASS_LINE;
        c.id = "gridy";
        JXG.clearVisPropOld(c);
        this.setObjectStrokeColor(c, "#FF8080", 0.5)
    }
    this.setPropertyPrim(b, "stroke-width", "0.4px");
    if (e.gridDash) {
        this.setGridDash("gridy")
    }
};
JXG.AbstractRenderer.prototype.removeGrid = function (a) {
    var b = this.getElementById("gridx");
    this.remove(b);
    b = this.getElementById("gridy");
    this.remove(b);
    a.hasGrid = false
};
JXG.AbstractRenderer.prototype.hide = function (a) {};
JXG.AbstractRenderer.prototype.show = function (a) {};
JXG.AbstractRenderer.prototype.setObjectStrokeWidth = function (b, a) {};
JXG.AbstractRenderer.prototype.setObjectStrokeColor = function (c, a, b) {};
JXG.AbstractRenderer.prototype.setObjectFillColor = function (c, a, b) {};
JXG.AbstractRenderer.prototype.setDraft = function (b) {
    if (!b.visProp.draft) {
        return
    }
    var a = b.board.options.elements.draft.color,
        c = b.board.options.elements.draft.opacity;
    if (b.type == JXG.OBJECTT_TYPE_POLYGON) {
        this.setObjectFillColor(b, a, c)
    } else {
        if (b.elementClass == JXG.OBJECT_CLASS_POINT) {
            this.setObjectFillColor(b, a, c)
        } else {
            this.setObjectFillColor(b, "none", 0)
        }
        this.setObjectStrokeColor(b, a, c);
        this.setObjectStrokeWidth(b, b.board.options.elements.draft.strokeWidth)
    }
};
JXG.AbstractRenderer.prototype.removeDraft = function (a) {
    if (a.type == JXG.OBJECT_TYPE_POLYGON) {
        this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillColorOpacity)
    } else {
        if (a.type == JXG.OBJECT_CLASS_POINT) {
            this.setObjectFillColor(a, a.visProp.fillColor, a.visProp.fillColorOpacity)
        }
        this.setObjectStrokeColor(a, a.visProp.strokeColor, a.visProp.strokeColorOpacity);
        this.setObjectStrokeWidth(a, a.visProp.strokeWidth)
    }
};
JXG.AbstractRenderer.prototype.highlight = function (b) {
    var a;
    if (b.visProp.draft == false) {
        if (b.type == JXG.OBJECT_CLASS_POINT) {
            this.setObjectStrokeColor(b, b.visProp.highlightStrokeColor, b.visProp.highlightStrokeOpacity);
            this.setObjectFillColor(b, b.visProp.highlightStrokeColor, b.visProp.highlightStrokeOpacity)
        } else {
            if (b.type == JXG.OBJECT_TYPE_POLYGON) {
                this.setObjectFillColor(b, b.visProp.highlightFillColor, b.visProp.highlightFillOpacity);
                for (a = 0; a < b.borders.length; a++) {
                    this.setObjectStrokeColor(b.borders[a], b.borders[a].visProp.highlightStrokeColor, b.visProp.highlightStrokeOpacity)
                }
            } else {
                this.setObjectStrokeColor(b, b.visProp.highlightStrokeColor, b.visProp.highlightStrokeOpacity);
                this.setObjectFillColor(b, b.visProp.highlightFillColor, b.visProp.highlightFillOpacity)
            }
        }
        if (b.visProp.highlightStrokeWidth) {
            this.setObjectStrokeWidth(b, b.visProp.highlightStrokeWidth)
        }
    }
};
JXG.AbstractRenderer.prototype.noHighlight = function (b) {
    var a;
    if (b.visProp.draft == false) {
        if (b.type == JXG.OBJECT_CLASS_POINT) {
            this.setObjectStrokeColor(b, b.visProp.strokeColor, b.visProp.strokeOpacity);
            this.setObjectFillColor(b, b.visProp.strokeColor, b.visProp.strokeOpacity)
        } else {
            if (b.type == JXG.OBJECT_TYPE_POLYGON) {
                this.setObjectFillColor(b, b.visProp.fillColor, b.visProp.fillOpacity);
                for (a = 0; a < b.borders.length; a++) {
                    this.setObjectStrokeColor(b.borders[a], b.borders[a].visProp.strokeColor, b.visProp.strokeOpacity)
                }
            } else {
                this.setObjectStrokeColor(b, b.visProp.strokeColor, b.visProp.strokeOpacity);
                this.setObjectFillColor(b, b.visProp.fillColor, b.visProp.fillOpacity)
            }
        }
        this.setObjectStrokeWidth(b, b.visProp.strokeWidth)
    }
};
JXG.AbstractRenderer.prototype.remove = function (a) {};
JXG.AbstractRenderer.prototype.suspendRedraw = function () {};
JXG.AbstractRenderer.prototype.unsuspendRedraw = function () {};
JXG.AbstractRenderer.prototype.drawZoomBar = function (g) {
    var k, c, f, e, b, l, h, a, d;
    k = this.container.ownerDocument;
    c = k.createElement("div");
    c.className = "JXGtext";
    c.style.color = "#aaaaaa";
    c.style.backgroundColor = "#f5f5f5";
    c.style.padding = "2px";
    c.style.position = "absolute";
    c.style.fontSize = "10px";
    c.style.cursor = "pointer";
    c.style.zIndex = "100";
    this.container.appendChild(c);
    c.style.right = "5px";
    c.style.bottom = "5px";
    f = k.createElement("span");
    c.appendChild(f);
    f.innerHTML = "&nbsp;&ndash;&nbsp;";
    JXG.addEvent(f, "click", g.zoomOut, g);
    e = k.createElement("span");
    c.appendChild(e);
    e.innerHTML = "&nbsp;o&nbsp;";
    JXG.addEvent(e, "click", g.zoom100, g);
    b = k.createElement("span");
    c.appendChild(b);
    b.innerHTML = "&nbsp;+&nbsp;";
    JXG.addEvent(b, "click", g.zoomIn, g);
    l = k.createElement("span");
    c.appendChild(l);
    l.innerHTML = "&nbsp;&larr;&nbsp;";
    JXG.addEvent(l, "click", g.clickLeftArrow, g);
    h = k.createElement("span");
    c.appendChild(h);
    h.innerHTML = "&nbsp;&uarr;&nbsp;";
    JXG.addEvent(h, "click", g.clickUpArrow, g);
    a = k.createElement("span");
    c.appendChild(a);
    a.innerHTML = "&nbsp;&darr;&nbsp;";
    JXG.addEvent(a, "click", g.clickDownArrow, g);
    d = k.createElement("span");
    c.appendChild(d);
    d.innerHTML = "&nbsp;&rarr;&nbsp;";
    JXG.addEvent(d, "click", g.clickRightArrow, g)
};
JXG.AbstractRenderer.prototype.getElementById = function (a) {
    return document.getElementById(this.container.id + "_" + a)
};
JXG.AbstractRenderer.prototype.findSplit = function (w, h, g) {
    var n = 0,
        l = h,
        m, e, x, v, u, c, s, b, q, r, a;
    if (g - h < 2) {
        return [-1, 0]
    }
    x = w[h].scrCoords;
    v = w[g].scrCoords;
    if (isNaN(x[1] + x[2] + v[1] + v[2])) {
        return [NaN, g]
    }
    for (e = h + 1; e < g; e++) {
        u = w[e].scrCoords;
        c = u[1] - x[1];
        s = u[2] - x[2];
        b = v[1] - x[1];
        q = v[2] - x[2];
        r = b * b + q * q;
        if (r >= JXG.Math.eps) {
            a = (c * b + s * q) / r;
            m = c * c + s * s - a * (c * b + s * q)
        } else {
            a = 0;
            m = c * c + s * s
        }
        if (a < 0) {
            m = c * c + s * s
        } else {
            if (a > 1) {
                c = u[1] - v[1];
                s = u[2] - v[2];
                m = c * c + s * s
            }
        }
        if (m > n) {
            n = m;
            l = e
        }
    }
    return [Math.sqrt(n), l]
};
JXG.AbstractRenderer.prototype.RDP = function (f, e, d, b, c) {
    var a = this.findSplit(f, e, d);
    if (a[0] > b) {
        this.RDP(f, e, a[1], b, c);
        this.RDP(f, a[1], d, b, c)
    } else {
        c.push(f[d])
    }
};
JXG.AbstractRenderer.prototype.RamenDouglasPeuker = function (f, b) {
    var d = [],
        e, c, a;
    a = f.length;
    e = 0;
    while (e < a && isNaN(f[e].scrCoords[1] + f[e].scrCoords[2])) {
        e++
    }
    c = a - 1;
    while (c > e && isNaN(f[c].scrCoords[1] + f[c].scrCoords[2])) {
        c--
    }
    if (e > c || e == a) {
        return []
    }
    d[0] = f[e];
    this.RDP(f, e, c, b, d);
    return d
};
JXG.AbstractRenderer.prototype.setShadow = function (a) {};
JXG.AbstractRenderer.prototype.updatePathStringPoint = function (c, a, b) {};
JXG.AbstractRenderer.prototype.eval = function (a) {
    if (typeof a == "function") {
        return a()
    } else {
        return a
    }
};
JXG.FileReader = new function () {
    this.parseFileContent = function (a, b, d) {
        this.request = false;
        var c;
        try {
            this.request = new XMLHttpRequest();
            if (d.toLowerCase() == "raw") {
                this.request.overrideMimeType("text/plain; charset=iso-8859-1")
            } else {
                this.request.overrideMimeType("text/xml; charset=iso-8859-1")
            }
        } catch (c) {
            try {
                this.request = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (c) {
                try {
                    this.request = new ActiveXObject("Microsoft.XMLHTTP")
                } catch (c) {
                    this.request = false
                }
            }
        }
        if (!this.request) {
            alert("AJAX not activated!");
            return
        }
        this.request.open("GET", a, true);
        if (d.toLowerCase() == "raw") {
            this.cbp = function () {
                var e = this.request;
                if (e.readyState == 4) {
                    b(e.responseText)
                }
            }
        } else {
            this.cbp = function () {
                var e = this.request;
                if (e.readyState == 4) {
                    var f = "";
                    if (typeof e.responseStream != "undefined" && e.responseText.slice(0, 2) == "PK") {
                        f = (new JXG.Util.Unzip(JXG.Util.Base64.decodeAsArray(BinFileReader(this.request)))).unzip();
                        f = f[0][0]
                    } else {
                        f = e.responseText
                    }
                    this.parseString(f, b, d, false)
                }
            }
        }
        this.cb = JXG.bind(this.cbp, this);
        this.request.onreadystatechange = this.cb;
        try {
            this.request.send(null)
        } catch (c) {
            throw new Error("JSXGraph: problems opening " + a + " !")
        }
    };
    this.cleanWhitespace = function (a) {
        var b = a.firstChild;
        while (b != null) {
            if (b.nodeType == 3 && !/\S/.test(b.nodeValue)) {
                a.removeChild(b)
            } else {
                if (b.nodeType == 1) {
                    this.cleanWhitespace(b)
                }
            }
            b = b.nextSibling
        }
    };
    this.stringToXMLTree = function (b) {
        if (typeof DOMParser == "undefined") {
            DOMParser = function () {};
            DOMParser.prototype.parseFromString = function (f, g) {
                if (typeof ActiveXObject != "undefined") {
                    var e = new ActiveXObject("MSXML.DomDocument");
                    e.loadXML(f);
                    return e
                }
            }
        }
        var c = new DOMParser();
        var a = c.parseFromString(b, "text/xml");
        this.cleanWhitespace(a);
        return a
    };
    this.parseString = function (d, c, e, b) {
        var a;
        if (e.toLowerCase() == "cdy") {
            if (b) {
                d = JXG.Util.Base64.decode(d)
            }
            d = JXG.CinderellaReader.readCinderella(d, c);
            c.xmlString = d;
            c.afterLoad();
            return
        }
        if (e.toLowerCase() == "geonext") {
            d = JXG.GeonextReader.prepareString(d)
        }
        if (e.toLowerCase() == "geogebra") {
            d = JXG.GeogebraReader.prepareString(d, b)
        }
        if (e.toLowerCase() == "intergeo") {
            if (b) {
                d = JXG.Util.Base64.decode(d)
            }
            d = JXG.IntergeoReader.prepareString(d)
        }
        c.xmlString = d;
        var a = this.stringToXMLTree(d);
        this.readElements(a, c, e)
    };
    this.readElements = function (a, b, c) {
        if (c.toLowerCase() == "geonext") {
            b.suspendUpdate();
            if (a.getElementsByTagName("GEONEXT").length != 0) {
                JXG.GeonextReader.readGeonext(a, b)
            }
            b.unsuspendUpdate()
        } else {
            if (a.getElementsByTagName("geogebra").length != 0) {
                JXG.GeogebraReader.readGeogebra(a, b)
            } else {
                if (c.toLowerCase() == "intergeo") {
                    JXG.IntergeoReader.readIntergeo(a, b)
                }
            }
        }
        b.afterLoad()
    }
};
if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
    document.write('<script type="text/vbscript">\nFunction Base64Encode(inData)\n  Const Base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"\n  Dim cOut, sOut, I\n  For I = 1 To LenB(inData) Step 3\n    Dim nGroup, pOut, sGroup\n    nGroup = &H10000 * AscB(MidB(inData, I, 1)) + _\n      &H100 * MyASC(MidB(inData, I + 1, 1)) + MyASC(MidB(inData, I + 2, 1))\n    nGroup = Oct(nGroup)\n    nGroup = String(8 - Len(nGroup), "0") & nGroup\n    pOut = Mid(Base64, CLng("&o" & Mid(nGroup, 1, 2)) + 1, 1) + _\n      Mid(Base64, CLng("&o" & Mid(nGroup, 3, 2)) + 1, 1) + _\n      Mid(Base64, CLng("&o" & Mid(nGroup, 5, 2)) + 1, 1) + _\n      Mid(Base64, CLng("&o" & Mid(nGroup, 7, 2)) + 1, 1)\n    sOut = sOut + pOut\n  Next\n  Select Case LenB(inData) Mod 3\n    Case 1: \'8 bit final\n      sOut = Left(sOut, Len(sOut) - 2) + "=="\n    Case 2: \'16 bit final\n      sOut = Left(sOut, Len(sOut) - 1) + "="\n  End Select\n  Base64Encode = sOut\nEnd Function\n\nFunction MyASC(OneChar)\n  If OneChar = "" Then MyASC = 0 Else MyASC = AscB(OneChar)\nEnd Function\n\nFunction BinFileReader(xhr)\n    Dim byteString\n    Dim b64String\n    Dim i\n    byteString = xhr.responseBody\n    ReDim byteArray(LenB(byteString))\n    For i = 1 To LenB(byteString)\n        byteArray(i-1) = AscB(MidB(byteString, i, 1))\n    Next\n    b64String = Base64Encode(byteString)\n    BinFileReader = b64String\nEnd Function\n<\/script>\n')
}
JXG.Board = function (a, f, b, m, l, k, h, g, c, d, e) {
    this.BOARD_MODE_NONE = 0;
    this.BOARD_MODE_DRAG = 1;
    this.BOARD_MODE_CONSTRUCT = 16;
    this.BOARD_MODE_MOVE_ORIGIN = 2;
    this.BOARD_QUALITY_LOW = 1;
    this.BOARD_QUALITY_HIGH = 2;
    this.CONSTRUCTION_TYPE_POINT = 1129599060;
    this.CONSTRUCTION_TYPE_CIRCLE = 1129595724;
    this.CONSTRUCTION_TYPE_LINE = 1129598030;
    this.CONSTRUCTION_TYPE_GLIDER = 1129596740;
    this.CONSTRUCTION_TYPE_MIDPOINT = 1129598288;
    this.CONSTRUCTION_TYPE_PERPENDICULAR = 1129599044;
    this.CONSTRUCTION_TYPE_PARALLEL = 1129599052;
    this.CONSTRUCTION_TYPE_INTERSECTION = 1129597267;
    this.container = a;
    this.containerObj = document.getElementById(this.container);
    if (this.containerObj == null) {
        throw new Error("\nJSXGraph: HTML container element '" + (box) + "' not found.")
    }
    this.renderer = f;
    this.options = JXG.deepCopy(JXG.Options);
    this.dimension = 2;
    this.origin = {};
    this.origin.usrCoords = [1, 0, 0];
    this.origin.scrCoords = [1, m[0], m[1]];
    this.zoomX = l;
    this.zoomY = k;
    this.unitX = h;
    this.unitY = g;
    this.stretchX = this.zoomX * this.unitX;
    this.stretchY = this.zoomY * this.unitY;
    this.canvasWidth = c;
    this.canvasHeight = d;
    this.fontSize = this.options.text.fontSize;
    this.algebra = new JXG.Algebra(this);
    if ((b != "") && (b != null) && (typeof document.getElementById(b) != "undefined")) {
        this.id = b
    } else {
        this.id = this.generateId()
    }
    this.hooks = [];
    this.dependentBoards = [];
    this.objects = {};
    this.animationObjects = {};
    this.highlightedObjects = {};
    this.numObjects = 0;
    this.elementsByName = {};
    this.mode = this.BOARD_MODE_NONE;
    this.updateQuality = this.BOARD_QUALITY_HIGH;
    this.isSuspendedRedraw = false;
    this.snapToGrid = this.options.grid.snapToGrid;
    this.gridX = this.options.grid.gridX;
    this.gridY = this.options.grid.gridY;
    this.gridColor = this.options.grid.gridColor;
    this.gridOpacity = this.options.grid.gridOpacity;
    this.gridDash = this.options.grid.gridDash;
    this.snapSizeX = this.options.grid.snapSizeX;
    this.snapSizeY = this.options.grid.snapSizeY;
    this.calculateSnapSizes();
    this.hasGrid = this.options.grid.hasGrid;
    this.drag_dx = 0;
    this.drag_dy = 0;
    this.mousePosAbs = [0, 0];
    this.mousePosRel = [0, 0];
    this.drag_obj = null;
    this.xmlString = "";
    if ((e != null && e) || (e == null && this.options.showCopyright)) {
        this.renderer.displayCopyright(JXG.JSXGraph.licenseText, this.fontSize)
    }
    this.needsFullUpdate = false;
    this.reducedUpdate = false;
    this.geonextCompatibilityMode = false;
    if (this.options.text.useASCIIMathML) {
        if (typeof translateASCIIMath != "undefined") {
            init()
        } else {
            this.options.text.useASCIIMathML = false
        }
    }
    JXG.addEvent(document, "mousedown", this.mouseDownListener, this);
    JXG.addEvent(this.containerObj, "mousemove", this.mouseMoveListener, this);
    JXG.addEvent(this.containerObj, "touchstart", this.touchStartListener, this);
    JXG.addEvent(this.containerObj, "touchmove", this.touchMoveListener, this);
    JXG.addEvent(this.containerObj, "touchend", this.touchEndListener, this)
};
JXG.Board.prototype.generateName = function (c) {
    if (c.type == JXG.OBJECT_TYPE_TICKS) {
        return
    }
    var h;
    if (c.elementClass == JXG.OBJECT_CLASS_POINT) {
        h = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    } else {
        h = ["", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    }
    var e = 3;
    var b = "";
    var l = "";
    var k = "";
    if (c.elementClass == JXG.OBJECT_CLASS_POINT || c.elementClass == JXG.OBJECT_CLASS_LINE) {} else {
        if (c.type == JXG.OBJECT_TYPE_POLYGON) {
            b = "P_{";
            k = "}"
        } else {
            if (c.type == JXG.OBJECT_TYPE_CIRCLE) {
                b = "k_{";
                k = "}"
            } else {
                if (c.type == JXG.OBJECT_TYPE_ANGLE) {
                    b = "W_{";
                    k = "}"
                } else {
                    b = "s_{";
                    k = "}"
                }
            }
        }
    }
    var m = [];
    var a = "";
    var g = "";
    var f = 0;
    var d = 0;
    for (f = 0; f < e; f++) {
        m[f] = 0
    }
    while (m[e - 1] < h.length) {
        for (m[0] = 1; m[0] < h.length; m[0]++) {
            a = b;
            for (f = e; f > 0; f--) {
                a += h[m[f - 1]]
            }
            if (this.elementsByName[a + k] == null) {
                return a + k
            }
        }
        m[0] = h.length;
        for (f = 1; f < e; f++) {
            if (m[f - 1] == h.length) {
                m[f - 1] = 1;
                m[f]++
            }
        }
    }
    return ""
};
JXG.Board.prototype.generateId = function () {
    var a = 1;
    while (JXG.JSXGraph.boards["gxtBoard" + a] != null) {
        a = Math.round(Math.random() * 33)
    }
    return ("gxtBoard" + a)
};
JXG.Board.prototype.setId = function (d, c) {
    var b = this.numObjects,
        a = d.id;
    this.numObjects++;
    if ((a == "") || (a == null)) {
        a = this.id + c + b
    }
    d.id = a;
    this.objects[a] = d;
    if (d.hasLabel) {
        d.label.content.id = a + "Label";
        this.addText(d.label.content)
    }
    return a
};
JXG.Board.prototype.getRelativeMouseCoordinates = function (b) {
    var c = this.containerObj,
        a = JXG.getOffset(c),
        d;
    d = parseInt(JXG.getStyle(c, "borderLeftWidth"));
    if (isNaN(d)) {
        d = 0
    }
    a[0] += d;
    d = parseInt(JXG.getStyle(c, "borderTopWidth"));
    if (isNaN(d)) {
        d = 0
    }
    a[1] += d;
    d = parseInt(JXG.getStyle(c, "paddingLeft"));
    if (isNaN(d)) {
        d = 0
    }
    a[0] += d;
    d = parseInt(JXG.getStyle(c, "paddingTop"));
    if (isNaN(d)) {
        d = 0
    }
    a[1] += d;
    return a
};
JXG.Board.prototype.clickLeftArrow = function (a) {
    this.origin.scrCoords[1] += this.canvasWidth * 0.1;
    this.moveOrigin();
    return this
};
JXG.Board.prototype.clickRightArrow = function (a) {
    this.origin.scrCoords[1] -= this.canvasWidth * 0.1;
    this.moveOrigin();
    return this
};
JXG.Board.prototype.clickUpArrow = function (a) {
    this.origin.scrCoords[2] += this.canvasHeight * 0.1;
    this.moveOrigin();
    return this
};
JXG.Board.prototype.clickDownArrow = function (a) {
    this.origin.scrCoords[2] -= this.canvasHeight * 0.1;
    this.moveOrigin();
    return this
};
JXG.Board.prototype.touchStartListener = function (a) {
    var b = document.createEvent("MouseEvents");
    this.options.precision.hasPoint = this.options.precision.touch;
    b.initMouseEvent("mousedown", true, false, this.containerObj, 0, a.targetTouches[0].screenX, a.targetTouches[0].screenY, a.targetTouches[0].clientX, a.targetTouches[0].clientY, false, false, a.targetTouches.length == 1 ? false : true, false, 0, null);
    this.mouseDownListener(b)
};
JXG.Board.prototype.touchMoveListener = function (a) {
    a.preventDefault();
    var b = document.createEvent("MouseEvents");
    b.initMouseEvent("mousemove", true, false, this.containerObj, 0, a.targetTouches[0].screenX, a.targetTouches[0].screenY, a.targetTouches[0].clientX, a.targetTouches[0].clientY, false, false, a.targetTouches.length == 1 ? false : true, false, 0, null);
    this.mouseMoveListener(b)
};
JXG.Board.prototype.touchEndListener = function (a) {
    var b = document.createEvent("MouseEvents");
    b.initMouseEvent("mouseup", true, false, this.containerObj, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.mouseUpListener(b);
    this.options.precision.hasPoint = this.options.precision.mouse
};
JXG.Board.prototype.mouseUpListener = function (a) {
    this.updateQuality = this.BOARD_QUALITY_HIGH;
    JXG.removeEvent(document, "mouseup", this.mouseUpListener, this);
    this.mode = this.BOARD_MODE_NONE;
    if (this.mode == this.BOARD_MODE_MOVE_ORIGIN) {
        this.moveOrigin()
    } else {
        this.update()
    }
    this.drag_obj = null
};
JXG.Board.prototype.mouseDownListener = function (f) {
    var d, g, e, a, c, b;
    e = this.getRelativeMouseCoordinates(f);
    a = JXG.getPosition(f);
    c = a[0] - e[0];
    b = a[1] - e[1];
    this.mousePosAbs = a;
    this.mousePosRel = [c, b];
    if (f.shiftKey) {
        this.drag_dx = c - this.origin.scrCoords[1];
        this.drag_dy = b - this.origin.scrCoords[2];
        this.mode = this.BOARD_MODE_MOVE_ORIGIN;
        JXG.addEvent(document, "mouseup", this.mouseUpListener, this);
        return
    }
    if (this.mode == this.BOARD_MODE_CONSTRUCT) {
        return
    }
    this.mode = this.BOARD_MODE_DRAG;
    if (this.mode == this.BOARD_MODE_DRAG) {
        for (d in this.objects) {
            g = this.objects[d];
            if ((g.hasPoint != undefined) && ((g.type == JXG.OBJECT_TYPE_POINT) || (g.type == JXG.OBJECT_TYPE_GLIDER)) && (g.visProp.visible) && (!g.fixed) && (!g.frozen) && (g.hasPoint(c, b))) {
                if ((g.type == JXG.OBJECT_TYPE_POINT) || (g.type == JXG.OBJECT_TYPE_GLIDER)) {
                    this.drag_obj = this.objects[d];
                    if (this.options.takeFirst) {
                        break
                    }
                }
            }
        }
    }
    if (this.drag_obj == null) {
        this.mode = this.BOARD_MODE_NONE;
        return
    }
    this.dragObjCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [c, b], this);
    JXG.addEvent(document, "mouseup", this.mouseUpListener, this)
};
JXG.Board.prototype.mouseMoveListener = function (f) {
    var b, c, g, a, d, k, h;
    g = this.getRelativeMouseCoordinates(f);
    a = JXG.getPosition(f);
    k = a[0] - g[0];
    h = a[1] - g[1];
    this.mousePosAbs = a;
    this.mousePosRel = [k, h];
    this.updateQuality = this.BOARD_QUALITY_LOW;
    this.dehighlightAll(k, h);
    if (this.mode != this.BOARD_MODE_DRAG) {
        this.renderer.hide(this.infobox)
    }
    if (this.mode == this.BOARD_MODE_MOVE_ORIGIN) {
        this.origin.scrCoords[1] = k - this.drag_dx;
        this.origin.scrCoords[2] = h - this.drag_dy;
        this.moveOrigin()
    } else {
        if (this.mode == this.BOARD_MODE_DRAG) {
            d = new JXG.Coords(JXG.COORDS_BY_SCREEN, this.getScrCoordsOfMouse(k, h), this);
            if (this.drag_obj.type == JXG.OBJECT_TYPE_POINT || this.drag_obj.type == JXG.OBJECT_TYPE_LINE || this.drag_obj.type == JXG.OBJECT_TYPE_CIRCLE || this.drag_obj.elementClass == JXG.OBJECT_CLASS_CURVE) {
                this.drag_obj.setPositionDirectly(JXG.COORDS_BY_USER, d.usrCoords[1], d.usrCoords[2]);
                this.update(this.drag_obj)
            } else {
                if (this.drag_obj.type == JXG.OBJECT_TYPE_GLIDER) {
                    var e = this.drag_obj.coords;
                    this.drag_obj.setPositionDirectly(JXG.COORDS_BY_USER, d.usrCoords[1], d.usrCoords[2]);
                    if (this.drag_obj.slideObject.type == JXG.OBJECT_TYPE_CIRCLE) {
                        this.drag_obj.coords = this.algebra.projectPointToCircle(this.drag_obj, this.drag_obj.slideObject)
                    } else {
                        if (this.drag_obj.slideObject.type == JXG.OBJECT_TYPE_LINE) {
                            this.drag_obj.coords = this.algebra.projectPointToLine(this.drag_obj, this.drag_obj.slideObject)
                        }
                    }
                    if (this.drag_obj.group.length != 0) {
                        this.drag_obj.group[this.drag_obj.group.length - 1].dX = this.drag_obj.coords.scrCoords[1] - e.scrCoords[1];
                        this.drag_obj.group[this.drag_obj.group.length - 1].dY = this.drag_obj.coords.scrCoords[2] - e.scrCoords[2];
                        this.drag_obj.group[this.drag_obj.group.length - 1].update(this)
                    } else {
                        this.update(this.drag_obj)
                    }
                }
            }
            this.updateInfobox(this.drag_obj)
        } else {
            for (b in this.objects) {
                c = this.objects[b];
                if (c.hasPoint != undefined && c.visProp.visible == true && c.hasPoint(k, h)) {
                    this.updateInfobox(c);
                    if (this.highlightedObjects[b] == null) {
                        c.highlight();
                        this.highlightedObjects[b] = c
                    }
                }
            }
        }
    }
    this.updateQuality = this.BOARD_QUALITY_HIGH
};
JXG.Board.prototype.updateInfobox = function (b) {
    var a, e, c, d;
    if (!b.showInfobox) {
        return this
    }
    if (b.elementClass == JXG.OBJECT_CLASS_POINT) {
        c = b.coords.usrCoords[1] * 1;
        d = b.coords.usrCoords[2] * 1;
        this.infobox.setCoords(c + this.infobox.distanceX / (this.stretchX), d + this.infobox.distanceY / (this.stretchY));
        if (typeof (b.infoboxText) != "string") {
            a = Math.abs(c);
            if (a > 0.1) {
                a = c.toFixed(2)
            } else {
                if (a >= 0.01) {
                    a = c.toFixed(4)
                } else {
                    if (a >= 0.0001) {
                        a = c.toFixed(6)
                    } else {
                        a = c
                    }
                }
            }
            e = Math.abs(d);
            if (e > 0.1) {
                e = d.toFixed(2)
            } else {
                if (e >= 0.01) {
                    e = d.toFixed(4)
                } else {
                    if (e >= 0.0001) {
                        e = d.toFixed(6)
                    } else {
                        e = d
                    }
                }
            }
            this.highlightInfobox(a, e, b)
        } else {
            this.highlightCustomInfobox(b.infoboxText, b)
        }
        this.renderer.show(this.infobox);
        this.renderer.updateText(this.infobox)
    }
    return this
};
JXG.Board.prototype.highlightCustomInfobox = function (b, a) {
    this.infobox.setText('<span style="color:#34282C;">' + b + "</span>");
    return this
};
JXG.Board.prototype.highlightInfobox = function (a, c, b) {
    this.highlightCustomInfobox("(" + a + ", " + c + ")");
    return this
};
JXG.Board.prototype.dehighlightAll = function (a, d) {
    var b, c;
    for (b in this.highlightedObjects) {
        c = this.highlightedObjects[b];
        if ((c.hasPoint == undefined) || (!c.hasPoint(a, d)) || (c.visProp.visible == false)) {
            c.noHighlight();
            delete(this.highlightedObjects[b])
        }
    }
    return this
};
JXG.Board.prototype.getScrCoordsOfMouse = function (a, c) {
    if (this.snapToGrid) {
        var b = new JXG.Coords(JXG.COORDS_BY_SCREEN, [a, c], this);
        b.setCoordinates(JXG.COORDS_BY_USER, [Math.round((b.usrCoords[1]) * this.snapSizeX) / this.snapSizeX, Math.round((b.usrCoords[2]) * this.snapSizeY) / this.snapSizeY]);
        return [b.scrCoords[1], b.scrCoords[2]]
    } else {
        return [a, c]
    }
};
JXG.Board.prototype.getUsrCoordsOfMouse = function (e) {
    var c = this.getRelativeMouseCoordinates(e);
    var b = JXG.getPosition(e);
    var a = b[0] - c[0];
    var f = b[1] - c[1];
    var d = new JXG.Coords(JXG.COORDS_BY_SCREEN, [a, f], this);
    if (this.snapToGrid) {
        d.setCoordinates(JXG.COORDS_BY_USER, [Math.round((d.usrCoords[1]) * this.snapSizeX) / this.snapSizeX, Math.round((d.usrCoords[2]) * this.snapSizeY) / this.snapSizeY])
    }
    return [d.usrCoords[1], d.usrCoords[2]]
};
JXG.Board.prototype.getAllUnderMouse = function (b) {
    var a = this.getAllObjectsUnderMouse(b);
    a.push(this.getUsrCoordsOfMouse(b));
    return a
};
JXG.Board.prototype.getAllObjectsUnderMouse = function (g) {
    var f = this.getRelativeMouseCoordinates(g);
    var a = JXG.getPosition(g);
    var c = a[0] - f[0];
    var b = a[1] - f[1];
    var d = [];
    for (var e in this.objects) {
        if (this.objects[e].visProp.visible && this.objects[e].hasPoint(c, b)) {
            d.push(this.objects[e])
        }
    }
    return d
};
JXG.Board.prototype.setBoardMode = function (a) {
    this.mode = a;
    return this
};
JXG.Board.prototype.moveOrigin = function () {
    var b, a;
    for (a in this.objects) {
        b = this.objects[a];
        if (!b.frozen && (b.elementClass == JXG.OBJECT_CLASS_POINT || b.elementClass == JXG.OBJECT_CLASS_CURVE || b.type == JXG.OBJECT_TYPE_AXIS || b.type == JXG.OBJECT_TYPE_TEXT)) {
            if (b.elementClass != JXG.OBJECT_CLASS_CURVE && b.type != JXG.OBJECT_TYPE_AXIS) {
                b.coords.usr2screen()
            }
        }
    }
    this.clearTraces();
    this.fullUpdate();
    if (this.hasGrid) {
        this.renderer.removeGrid(this);
        this.renderer.drawGrid(this)
    }
    return this
};
JXG.Board.prototype.finalizeAdding = function (a) {
    if (a.hasLabel) {
        this.renderer.drawText(a.label.content)
    }
    if (!a.visProp.visible) {
        this.renderer.hide(a)
    }
    if (a.hasLabel && !a.label.content.visProp.visible) {
        this.renderer.hide(a.label.content)
    }
};
JXG.Board.prototype.addPoint = function (a) {
    var b = this.setId(a, "P");
    this.renderer.drawPoint(a);
    this.finalizeAdding(a);
    return b
};
JXG.Board.prototype.addLine = function (a) {
    var b = this.setId(a, "L");
    this.renderer.drawLine(a);
    this.finalizeAdding(a);
    return b
};
JXG.Board.prototype.addCircle = function (a) {
    var b = this.setId(a, "C");
    this.renderer.drawCircle(a);
    this.finalizeAdding(a);
    return b
};
JXG.Board.prototype.addPolygon = function (a) {
    var b = this.setId(a, "Py");
    this.renderer.drawPolygon(a);
    this.finalizeAdding(a);
    return b
};
JXG.Board.prototype.addCurve = function (a) {
    var b = this.setId(a, "G");
    this.renderer.drawCurve(a);
    this.finalizeAdding(a);
    return b
};
JXG.Board.prototype.addChart = function (a) {
    return this.setId(a, "Chart")
};
JXG.Board.prototype.addArrow = function (c) {
    var b = this.numObjects,
        a;
    this.numObjects++;
    a = c.id;
    if ((a == "") || (a == null)) {
        a = this.id + "A" + b
    }
    this.objects[a] = c;
    c.id = a;
    this.renderer.drawArrow(c);
    return a
};
JXG.Board.prototype.addNormal = function (e, c, b, a) {
    var m = JXG.getReference(this, c);
    var n = JXG.getReference(this, e);
    var f = this.numObjects;
    f++;
    if ((b == "") || (b == null)) {
        b = this.id + "L" + f
    }
    var k = this.algebra.perpendicular(n, m);
    var g = k[0].usrCoords.slice(1);
    var h = new JXG.Point(this, g, b + "P2", "", false);
    h.fixed = true;
    m.addChild(h);
    n.addChild(h);
    var d;
    if (k[1]) {
        d = new JXG.Line(this, h.id, m.id, b, a)
    } else {
        d = new JXG.Line(this, m.id, h.id, b, a)
    }
    d.changed = k[1];
    d.update = function () {
        if (this.needsUpdate) {
            var q = this.board.algebra.perpendicular(n, m);
            h.coords = q[0];
            if (this.changed != q[1]) {
                var l = this.point1;
                this.point1 = this.point2;
                this.point2 = l
            }
            this.updateStdform();
            if (this.traced) {
                this.cloneToBackground(true)
            }
        }
    };
    return d
};
JXG.Board.prototype.addIntersection = function (c) {
    var b = this.numObjects;
    this.numObjects++;
    var a = c.id;
    if ((a == "") || (a == null)) {
        a = this.id + "I" + b
    }
    this.objects[a] = c;
    c.id = a;
    c.intersect1.addChild(c);
    c.intersect2.addChild(c);
    return a
};
JXG.Board.prototype.addText = function (c) {
    var b = this.numObjects;
    this.numObjects++;
    var a = c.id;
    if ((a == "") || (a == null)) {
        a = this.id + "T" + b
    }
    this.objects[a] = c;
    c.id = a;
    if (!c.isLabel) {
        this.renderer.drawText(c);
        if (!c.visProp.visible) {
            this.renderer.hide(c)
        }
    }
    return a
};
JXG.Board.prototype.addConditions = function (l) {
    var k = null;
    var b = "var el,x,y,c;\n";
    var h = l.indexOf("<data>");
    var g = l.indexOf("</data>");
    if (h < 0) {
        return
    }
    while (h >= 0) {
        var f = l.slice(h + 6, g);
        var e = f.indexOf("=");
        var d = f.slice(0, e);
        var q = f.slice(e + 1);
        e = d.indexOf(".");
        var a = d.slice(0, e);
        var c = this.elementsByName[JXG.unescapeHTML(a)];
        var n = d.slice(e + 1).replace(/\s+/g, "").toLowerCase();
        q = this.algebra.geonext2JS(q);
        q = q.replace(/this\.board\./g, "this.");
        if (typeof this.elementsByName[a] == "undefined") {
            alert("debug conditions: |" + a + "| undefined")
        }
        b += 'el = this.objects["' + c.id + '"];\n';
        switch (n) {
        case "x":
            b += "y=el.coords.usrCoords[2];\n";
            b += "el.setPositionDirectly(JXG.COORDS_BY_USER," + (q) + ",y);\n";
            b += "el.update();\n";
            break;
        case "y":
            b += "x=el.coords.usrCoords[1];\n";
            b += "el.coords=new JXG.Coords(JXG.COORDS_BY_USER,[x," + (q) + "],this);\n";
            break;
        case "visible":
            b += "c=" + (q) + ";\n";
            b += "if (c) {el.showElement();} else {el.hideElement();}\n";
            break;
        case "position":
            b += "el.position = " + (q) + ";\n";
            b += "el.update();\n";
            break;
        case "stroke":
            b += "el.strokeColor = " + (q) + ";\n";
            break;
        case "strokewidth":
            b += "el.strokeWidth = " + (q) + ";\n";
            break;
        case "label":
            break;
        default:
            alert("property '" + n + "' in conditions not implemented:" + q);
            break
        }
        l = l.slice(g + 7);
        h = l.indexOf("<data>");
        g = l.indexOf("</data>")
    }
    b += "this.prepareUpdate();\n";
    b += "this.updateElements();\n";
    b += "return true;\n";
    this.updateConditions = new Function(b);
    this.updateConditions()
};
JXG.Board.prototype.updateConditions = function () {
    return false
};
JXG.Board.prototype.addImage = function (c) {
    var b = this.numObjects;
    this.numObjects++;
    var a = c.id;
    if ((a == "") || (a == null)) {
        a = this.id + "Im" + b
    }
    this.objects[a] = c;
    this.elementsByName[c.name] = c;
    c.id = a;
    this.renderer.drawImage(c);
    if (!c.visProp.visible) {
        this.renderer.hide(c)
    }
    return a
};
JXG.Board.prototype.calculateSnapSizes = function () {
    var c = new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], this),
        b = new JXG.Coords(JXG.COORDS_BY_USER, [1 / this.gridX, 1 / this.gridY], this),
        a = c.scrCoords[1] - b.scrCoords[1],
        d = c.scrCoords[2] - b.scrCoords[2];
    this.snapSizeX = this.gridX;
    while (Math.abs(a) > 25) {
        this.snapSizeX *= 2;
        a /= 2
    }
    this.snapSizeY = this.gridY;
    while (Math.abs(d) > 25) {
        this.snapSizeY *= 2;
        d /= 2
    }
    return this
};
JXG.Board.prototype.applyZoom = function () {
    var b, a;
    for (a in this.objects) {
        b = this.objects[a];
        if (!b.frozen && (b.elementClass == JXG.OBJECT_CLASS_POINT || b.elementClass == JXG.OBJECT_CLASS_CURVE || b.type == JXG.OBJECT_TYPE_AXIS || b.type == JXG.OBJECT_TYPE_TEXT)) {
            if (b.elementClass != JXG.OBJECT_CLASS_CURVE && b.type != JXG.OBJECT_TYPE_AXIS) {
                b.coords.usr2screen()
            }
        }
    }
    this.calculateSnapSizes();
    this.clearTraces();
    this.fullUpdate();
    if (this.hasGrid) {
        this.renderer.removeGrid(this);
        this.renderer.drawGrid(this)
    }
    return this
};
JXG.Board.prototype.zoomIn = function () {
    var b, a;
    this.zoomX *= this.options.zoom.factor;
    this.zoomY *= this.options.zoom.factor;
    b = this.origin.scrCoords[1] * this.options.zoom.factor;
    a = this.origin.scrCoords[2] * this.options.zoom.factor;
    this.origin = new JXG.Coords(JXG.COORDS_BY_SCREEN, [b, a], this);
    this.stretchX = this.zoomX * this.unitX;
    this.stretchY = this.zoomY * this.unitY;
    this.applyZoom();
    return this
};
JXG.Board.prototype.zoomOut = function () {
    var b, a;
    this.zoomX /= this.options.zoom.factor;
    this.zoomY /= this.options.zoom.factor;
    b = this.origin.scrCoords[1] / this.options.zoom.factor;
    a = this.origin.scrCoords[2] / this.options.zoom.factor;
    this.origin = new JXG.Coords(JXG.COORDS_BY_SCREEN, [b, a], this);
    this.stretchX = this.zoomX * this.unitX;
    this.stretchY = this.zoomY * this.unitY;
    this.applyZoom();
    return this
};
JXG.Board.prototype.zoom100 = function () {
    var d, b, c, a;
    c = this.zoomX;
    a = this.zoomY;
    this.zoomX = 1;
    this.zoomY = 1;
    d = this.origin.scrCoords[1] / c;
    b = this.origin.scrCoords[2] / a;
    this.origin = new JXG.Coords(JXG.COORDS_BY_SCREEN, [d, b], this);
    this.stretchX = this.zoomX * this.unitX;
    this.stretchY = this.zoomY * this.unitY;
    this.applyZoom();
    return this
};
JXG.Board.prototype.zoomAllPoints = function () {
    var m, h, d, g, b, f, k, s, r, q, n, l, e, c, a, u;
    m = this.zoomX / this.zoomY;
    h = 0;
    d = 0;
    g = 0;
    b = 0;
    for (f in this.objects) {
        if ((this.objects[f].elementClass == JXG.OBJECT_CLASS_POINT) && this.objects[f].visProp.visible) {
            if (this.objects[f].coords.usrCoords[1] < h) {
                h = this.objects[f].coords.usrCoords[1]
            } else {
                if (this.objects[f].coords.usrCoords[1] > d) {
                    d = this.objects[f].coords.usrCoords[1]
                }
            }
            if (this.objects[f].coords.usrCoords[2] > b) {
                b = this.objects[f].coords.usrCoords[2]
            } else {
                if (this.objects[f].coords.usrCoords[2] < g) {
                    g = this.objects[f].coords.usrCoords[2]
                }
            }
        }
    }
    k = 50;
    s = k / (this.unitX * this.zoomX);
    r = k / (this.unitY * this.zoomY);
    q = d - h + 2 * s;
    n = b - g + 2 * r;
    l = Math.min(this.canvasWidth / (this.unitX * q), this.canvasHeight / (this.unitY * n));
    c = l;
    e = l * m;
    a = -(h - s) * this.unitX * e;
    u = (b + r) * this.unitY * c;
    this.origin = new JXG.Coords(JXG.COORDS_BY_SCREEN, [a, u], this);
    this.zoomX = e;
    this.zoomY = c;
    this.stretchX = this.zoomX * this.unitX;
    this.stretchY = this.zoomY * this.unitY;
    this.applyZoom();
    return this
};
JXG.Board.prototype.removeObject = function (a) {
    var c, b;
    if (JXG.isArray(a)) {
        for (b = 0; b < a.length; b++) {
            this.removeObject(a[b])
        }
    }
    a = JXG.getReference(this, a);
    if (a == undefined) {
        return this
    }
    try {
        for (c in a.childElements) {
            a.childElements[c].board.removeObject(a.childElements[c])
        }
        for (c in this.objects) {
            if (typeof this.objects[c].childElements != "undefined") {
                delete(this.objects[c].childElements[a.id])
            }
        }
        delete(this.objects[a.id]);
        delete(this.elementsByName[a.name]);
        if (a.remove != undefined) {
            a.remove()
        }
    } catch (d) {}
    return this
};
JXG.Board.prototype.initGeonextBoard = function () {
    var e, d, c, b, a;
    e = new JXG.Point(this, [0, 0], this.id + "gOOe0", "Ursprung", false);
    e.fixed = true;
    d = new JXG.Point(this, [1, 0], this.id + "gXOe0", "Punkt_1_0", false);
    d.fixed = true;
    c = new JXG.Point(this, [0, 1], this.id + "gYOe0", "Punkt_0_1", false);
    c.fixed = true;
    b = new JXG.Line(this, this.id + "gOOe0", this.id + "gXOe0", this.id + "gXLe0", "X-Achse");
    b.hideElement();
    a = new JXG.Line(this, this.id + "gOOe0", this.id + "gYOe0", this.id + "gYLe0", "Y-Achse");
    a.hideElement();
    return this
};
JXG.Board.prototype.initInfobox = function () {
    this.infobox = new JXG.Text(this, "0,0", "", [0, 0], this.id + "__infobox", null, null, false, "html");
    this.infobox.distanceX = -20;
    this.infobox.distanceY = 25;
    this.renderer.hide(this.infobox);
    return this
};
JXG.Board.prototype.resizeContainer = function (a, b) {
    this.canvasWidth = 1 * a;
    this.canvasHeight = 1 * b;
    this.containerObj.style.width = (this.canvasWidth) + "px";
    this.containerObj.style.height = (this.canvasHeight) + "px";
    return this
};
JXG.Board.prototype.showDependencies = function () {
    var d, b, g, e, a;
    b = "<p>\n";
    for (d in this.objects) {
        a = 0;
        for (g in this.objects[d].childElements) {
            a++
        }
        if (a >= 0) {
            b += "<b>" + this.objects[d].id + ":</b> "
        }
        for (g in this.objects[d].childElements) {
            b += this.objects[d].childElements[g].id + "(" + this.objects[d].childElements[g].name + "), "
        }
        b += "<p>\n"
    }
    b += "</p>\n";
    e = window.open();
    e.document.open();
    e.document.write(b);
    e.document.close();
    return this
};
JXG.Board.prototype.showXML = function () {
    var a = window.open("");
    a.document.open();
    a.document.write("<pre>" + JXG.escapeHTML(this.xmlString) + "</pre>");
    a.document.close();
    return this
};
JXG.Board.prototype.prepareUpdate = function (b) {
    var a;
    for (a in this.objects) {
        this.objects[a].needsUpdate = true
    }
    return this
};
JXG.Board.prototype.updateElements = function (b) {
    var a, d, c = true;
    b = JXG.getReference(this, b);
    if (b == null) {
        c = false
    }
    for (a in this.objects) {
        d = this.objects[a];
        if (b != null && d.id != b.id) {
            c = false
        }
        if (!(c || this.needsFullUpdate || d.needsRegularUpdate)) {
            continue
        }
        if (b == null || d.id != b.id) {
            d.update(true)
        } else {
            d.update(false)
        }
    }
    return this
};
JXG.Board.prototype.updateRenderer = function (b) {
    var a, c;
    b = JXG.getReference(this, b);
    for (a in this.objects) {
        c = this.objects[a];
        if (!this.needsFullUpdate && !c.needsRegularUpdate) {
            continue
        }
        if (b == null || c.id != b.id) {
            c.updateRenderer()
        } else {
            c.updateRenderer()
        }
    }
    return this
};
JXG.Board.prototype.addHook = function (a) {
    this.hooks.push(a);
    a(this);
    return (this.hooks.length - 1)
};
JXG.Board.prototype.removeHook = function (a) {
    this.hooks[a] = null;
    return this
};
JXG.Board.prototype.updateHooks = function () {
    var a;
    for (a = 0; a < this.hooks.length; a++) {
        if (this.hooks[a] != null) {
            this.hooks[a](this)
        }
    }
    return this
};
JXG.Board.prototype.addChild = function (a) {
    this.dependentBoards.push(a);
    this.update();
    return this
};
JXG.Board.prototype.removeChild = function (b) {
    var a;
    for (a = this.dependentBoards.length - 1; a >= 0; a--) {
        if (this.dependentBoards[a] == b) {
            this.dependentBoards.splice(a, 1)
        }
    }
    return this
};
JXG.Board.prototype.update = function (e) {
    var d, c, f, a;
    if (this.isSuspendedUpdate) {
        return this
    }
    this.prepareUpdate(e).updateElements(e).updateConditions();
    this.renderer.suspendRedraw();
    this.updateRenderer(e);
    this.renderer.unsuspendRedraw();
    this.updateHooks();
    c = this.dependentBoards.length;
    for (d = 0; d < c; d++) {
        f = this.dependentBoards[d].id;
        a = JXG.JSXGraph.boards[f];
        if (a != this) {
            a.updateQuality = this.updateQuality;
            a.prepareUpdate(e).updateElements(e).updateConditions();
            a.renderer.suspendRedraw();
            a.updateRenderer(e);
            a.renderer.unsuspendRedraw();
            a.updateHooks()
        }
    }
    return this
};
JXG.Board.prototype.fullUpdate = function () {
    this.needsFullUpdate = true;
    this.update();
    this.needsFullUpdate = false;
    return this
};
JXG.Board.prototype.createElement = function (b, c, a) {
    var f, d, e;
    if (b != "turtle" && (c == null || c.length == 0)) {
        return null
    }
    if (c == null) {
        c = []
    }
    b = b.toLowerCase();
    if (a == null) {
        a = {}
    }
    for (d = 0; d < c.length; d++) {
        c[d] = JXG.getReference(this, c[d])
    }
    if (JXG.JSXGraph.elements[b] != null) {
        if (typeof JXG.JSXGraph.elements[b] == "function") {
            f = JXG.JSXGraph.elements[b](this, c, a)
        } else {
            f = JXG.JSXGraph.elements[b].creator(this, c, a)
        }
    } else {
        throw new Error("JSXGraph: JXG.createElement: Unknown element type given: " + b)
    }
    if (f == undefined) {
        return
    }
    if (JXG.isArray(a)) {
        a = a[0]
    }
    if (f.multipleElements) {
        for (e in f) {
            if (typeof f[e].setProperty != "undefined") {
                f[e].setProperty(a)
            }
        }
    } else {
        if (typeof f.setProperty != "undefined") {
            f.setProperty(a)
        }
    }
    this.update(f);
    return f
};
JXG.Board.prototype.create = JXG.Board.prototype.createElement;
JXG.Board.prototype.clearTraces = function () {
    var a;
    for (a in this.objects) {
        if (this.objects[a].traced) {
            this.objects[a].clearTrace()
        }
    }
    return this
};
JXG.Board.prototype.beforeLoad = function () {};
JXG.Board.prototype.afterLoad = function () {};
JXG.Board.prototype.suspendUpdate = function () {
    this.isSuspendedUpdate = true
};
JXG.Board.prototype.unsuspendUpdate = function () {
    this.isSuspendedUpdate = false;
    this.update()
};
JXG.Board.prototype.setBoundingBox = function (f, d) {
    if (!JXG.isArray(f)) {
        return
    }
    var e, c, b, a;
    c = this.canvasWidth;
    e = this.canvasHeight;
    if (d) {
        this.unitX = c / (f[2] - f[0]);
        this.unitY = e / (-f[3] + f[1]);
        if (this.unitX < this.unitY) {
            this.unitY = this.unitX
        } else {
            this.unitX = this.unitY
        }
    } else {
        this.unitX = c / (f[2] - f[0]);
        this.unitY = e / (-f[3] + f[1])
    }
    b = -this.unitX * f[0] * this.zoomX;
    a = this.unitY * f[1] * this.zoomY;
    this.origin = new JXG.Coords(JXG.COORDS_BY_SCREEN, [b, a], this);
    this.stretchX = this.zoomX * this.unitX;
    this.stretchY = this.zoomY * this.unitY;
    this.moveOrigin();
    return this
};
JXG.Board.prototype.animate = function () {
    var d = 0,
        a, h, g, b, f, k, e = null;
    for (a in this.animationObjects) {
        if (this.animationObjects[a] == null) {
            continue
        }
        d++;
        h = this.animationObjects[a];
        if (h.animationPath) {
            g = h.animationPath.pop();
            if (typeof g == "undefined") {
                delete(h.animationPath)
            } else {
                h.setPositionDirectly(JXG.COORDS_BY_USER, g[0], g[1]);
                h.prepareUpdate().update().updateRenderer();
                e = h
            }
        }
        if (h.animationData) {
            k = 0;
            for (b in h.animationData) {
                f = h.animationData[b].pop();
                if (typeof f == "undefined") {
                    delete(h.animationData[f])
                } else {
                    k++;
                    h.setProperty(b + ":" + f)
                }
            }
            if (k == 0) {
                delete(h.animationData)
            }
        }
        if (typeof h.animationData == "undefined" && typeof h.animationPath == "undefined") {
            this.animationObjects[a] = null;
            delete(this.animationObjects[a])
        }
    }
    if (d == 0) {
        window.clearInterval(this.animationIntervalCode);
        delete(this.animationIntervalCode)
    } else {
        this.update(e)
    }
};
JXG.Board.prototype.construct = function (a, s, B, w, e) {
    var h, x, g, m, v, l = {},
        n, c, r, d, b, A, f, u, z, y, q;
    if (typeof (s) == "undefined") {
        s = "normal"
    } else {
        y = []
    }
    l.lines = [];
    l.circles = [];
    l.points = [];
    l.intersections = [];
    l.angles = [];
    l.macros = [];
    l.functions = [];
    l.texts = [];
    l.polygons = [];
    h = a.split(";");
    for (x = 0; x < h.length; x++) {
        h[x] = h[x].replace(/^\s+/, "").replace(/\s+$/, "");
        if (h[x].length > 0) {
            if (h[x].search(/=/) != -1) {
                n = h[x].split("=");
                h[x] = n[1].replace(/^\s+/, "");
                n = n[0].replace(/\s+$/, "")
            } else {
                n = ""
            }
            attributes = {};
            q = true;
            while (q) {
                if (h[x].search(/(.*)draft$/) != -1) {
                    attributes.draft = true;
                    h[x] = RegExp.$1;
                    h[x] = h[x].replace(/\s+$/, "")
                }
                if (h[x].search(/(.*)invisible$/) != -1) {
                    attributes.visible = false;
                    h[x] = RegExp.$1;
                    h[x] = h[x].replace(/\s+$/, "")
                }
                if (h[x].search(/(.*)nolabel$/) != -1) {
                    attributes.withLabel = false;
                    h[x] = RegExp.$1;
                    h[x] = h[x].replace(/\s+$/, "")
                }
                if (h[x].search(/nolabel|invisible|draft/) == -1) {
                    q = false
                }
            }
            f = true;
            if (this.definedMacros) {
                for (v = 0; v < this.definedMacros.macros.length; v++) {
                    z = new RegExp("^" + this.definedMacros.macros[v][0] + "\\s*\\(");
                    if (h[x].search(z) != -1) {
                        f = false;
                        h[x].match(/\((.*)\)/);
                        A = RegExp.$1;
                        A = A.split(",");
                        for (u = 0; u < A.length; u++) {
                            A[u].match(/\s*(\S*)\s*/);
                            A[u] = RegExp.$1
                        }
                        l[n] = this.construct(this.definedMacros.macros[v][2], "macro", this.definedMacros.macros[v][1], A, n);
                        l.macros.push(l[n]);
                        v = this.definedMacros.macros.length
                    }
                }
            }
            if (f) {
                if (h[x].search(/^[\[\]].*[\[\]]$/) != -1) {
                    h[x].match(/([\[\]])(.*)([\[\]])/);
                    attributes.straightFirst = (RegExp.$1 != "[");
                    attributes.straightLast = (RegExp.$3 == "[");
                    c = (RegExp.$2).replace(/^\s+/, "").replace(/\s+$/, "");
                    if (c.search(/ /) != -1) {
                        c.match(/(\S*) +(\S*)/);
                        c = [];
                        c[0] = RegExp.$1;
                        c[1] = RegExp.$2
                    }
                    if (n != "") {
                        if (attributes.withLabel == undefined) {
                            attributes.withLabel = true
                        }
                        attributes.name = n;
                        if (s == "macro") {
                            y.push(n)
                        }
                    }
                    if (s == "macro") {
                        if (e != "") {
                            for (v = 0; v < y.length; v++) {
                                if (c[0] == y[v]) {
                                    c[0] = e + "." + c[0]
                                }
                                if (c[1] == y[v]) {
                                    c[1] = e + "." + c[1]
                                }
                            }
                        }
                        for (v = 0; v < B.length; v++) {
                            if (c[0] == B[v]) {
                                c = [w[v], c[1]]
                            }
                            if (c[1] == B[v]) {
                                c = [c[0], w[v]]
                            }
                        }
                        if (e != "") {
                            attributes.id = e + "." + n
                        }
                    }
                    c = [JXG.getReference(this, c[0]), JXG.getReference(this, c[1])];
                    l.lines.push(this.createElement("line", c, attributes));
                    if (n != "") {
                        l[n] = l.lines[l.lines.length - 1]
                    }
                } else {
                    if (h[x].search(/k\s*\(.*/) != -1) {
                        h[x].match(/k\s*\(\s*(\S.*\S|\S)\s*,\s*(\S.*\S|\S)\s*\)/);
                        c = [];
                        c[0] = RegExp.$1;
                        c[1] = RegExp.$2;
                        for (v = 0; v <= 1; v++) {
                            if (c[v].search(/[\[\]]/) != -1) {
                                c[v].match(/^[\[\]]\s*(\S.*\S)\s*[\[\]]$/);
                                c[v] = RegExp.$1;
                                if (c[v].search(/ /) != -1) {
                                    c[v].match(/(\S*) +(\S*)/);
                                    c[v] = [];
                                    c[v][0] = RegExp.$1;
                                    c[v][1] = RegExp.$2
                                }
                                if (s == "macro") {
                                    if (e != "") {
                                        for (u = 0; u < y.length; u++) {
                                            if (c[v][0] == y[u]) {
                                                c[v][0] = e + "." + c[v][0]
                                            }
                                            if (c[v][1] == y[u]) {
                                                c[v][1] = e + "." + c[v][1]
                                            }
                                        }
                                    }
                                    for (u = 0; u < B.length; u++) {
                                        if (c[v][0] == B[u]) {
                                            c[v] = [w[u], c[v][1]]
                                        }
                                        if (c[v][1] == B[u]) {
                                            c[v] = [c[v][0], w[u]]
                                        }
                                    }
                                }
                                c[v] = (function (C, k) {
                                    return function () {
                                        return JXG.getReference(k, C[0]).Dist(JXG.getReference(k, C[1]))
                                    }
                                })(c[v], this)
                            } else {
                                if (c[v].search(/[0-9\.\s]+/) != -1) {
                                    c[v] = 1 * c[v]
                                } else {
                                    if (s == "macro") {
                                        if (e != "") {
                                            for (u = 0; u < y.length; u++) {
                                                if (c[v] == y[u]) {
                                                    c[v] = e + "." + y[u]
                                                }
                                            }
                                        }
                                        for (u = 0; u < B.length; u++) {
                                            if (c[v] == B[u]) {
                                                c[v] = w[u]
                                            }
                                        }
                                    }
                                    c[v] = JXG.getReference(this, c[v])
                                }
                            }
                        }
                        if (n != "") {
                            if (attributes.withLabel == undefined) {
                                attributes.withLabel = true
                            }
                            attributes.name = n;
                            if (s == "macro") {
                                if (e != "") {
                                    attributes.id = e + "." + n
                                }
                                y.push(n)
                            }
                        }
                        l.circles.push(this.createElement("circle", c, attributes));
                        if (n != "") {
                            l[n] = l.circles[l.circles.length - 1]
                        }
                    } else {
                        if (h[x].search(/^[A-Z]+.*\(\s*[0-9\.\-]+\s*[,\|]\s*[0-9\.\-]+\s*\)/) != -1) {
                            h[x].match(/^([A-Z]+\S*)\s*\(\s*(.*)\s*[,\|]\s*(.*)\s*\)$/);
                            n = RegExp.$1;
                            attributes.name = n;
                            if (s == "macro") {
                                if (e != "") {
                                    attributes.id = e + "." + n
                                }
                                y.push(n)
                            }
                            l.points.push(this.createElement("point", [1 * RegExp.$2, 1 * RegExp.$3], attributes));
                            l[n] = l.points[l.points.length - 1]
                        } else {
                            if (h[x].search(/^[A-Z]+.*\(.+(([,\|]\s*[0-9\.\-]+\s*){2})?/) != -1) {
                                h[x].match(/([A-Z]+.*)\((.*)\)/);
                                n = RegExp.$1;
                                c = RegExp.$2;
                                n = n.replace(/^\s+/, "").replace(/\s+$/, "");
                                c = c.replace(/^\s+/, "").replace(/\s+$/, "");
                                if (c.search(/[,\|]/) != -1) {
                                    c.match(/(\S*)\s*[,\|]\s*([0-9\.]+)\s*[,\|]\s*([0-9\.]+)\s*/);
                                    c = [];
                                    c[0] = RegExp.$1;
                                    c[1] = 1 * RegExp.$2;
                                    c[2] = 1 * RegExp.$3
                                } else {
                                    r = c;
                                    c = [];
                                    c[0] = r;
                                    c[1] = 0;
                                    c[2] = 0
                                }
                                attributes.name = n;
                                if (s == "macro") {
                                    if (e != "") {
                                        for (u = 0; u < y.length; u++) {
                                            if (c[0] == y[u]) {
                                                c[0] = e + "." + y[u]
                                            }
                                        }
                                    }
                                    for (u = 0; u < B.length; u++) {
                                        if (c[0] == B[u]) {
                                            c[0] = w[u]
                                        }
                                    }
                                    if (e != "") {
                                        attributes.id = e + "." + n
                                    }
                                    y.push(n)
                                }
                                l.points.push(this.createElement("glider", [c[1], c[2], JXG.getReference(this, c[0])], attributes));
                                l[n] = l.points[l.points.length - 1]
                            } else {
                                if (h[x].search(/&/) != -1) {
                                    h[x].match(/(.*)&(.*)/);
                                    c = [];
                                    c[0] = RegExp.$1;
                                    c[1] = RegExp.$2;
                                    c[0] = c[0].replace(/\s+$/, "");
                                    c[1] = c[1].replace(/^\s+/, "");
                                    if (s == "macro") {
                                        for (v = 0; v <= 1; v++) {
                                            if (e != "") {
                                                for (u = 0; u < y.length; u++) {
                                                    if (c[v] == y[u]) {
                                                        c[v] = e + "." + y[u]
                                                    }
                                                }
                                            }
                                            for (u = 0; u < B.length; u++) {
                                                if (c[v] == B[u]) {
                                                    c[v] = w[u]
                                                }
                                            }
                                        }
                                    }
                                    c[0] = JXG.getReference(this, c[0]);
                                    c[1] = JXG.getReference(this, c[1]);
                                    if ((c[0].elementClass == JXG.OBJECT_CLASS_LINE || c[0].elementClass == JXG.OBJECT_CLASS_CURVE) && (c[0].elementClass == JXG.OBJECT_CLASS_LINE || c[1].elementClass == JXG.OBJECT_CLASS_LINE)) {
                                        if (n != "") {
                                            attributes.name = n;
                                            if (s == "macro") {
                                                if (e != "") {
                                                    attributes.id = e + "." + n
                                                }
                                                y.push(n)
                                            }
                                        }
                                        r = this.createElement("intersection", [c[0], c[1], 0], attributes);
                                        l.intersections.push(r);
                                        if (n != "") {
                                            l[attributes.name] = r
                                        }
                                    } else {
                                        if (n != "") {
                                            attributes.name = n + "_1";
                                            if (s == "macro") {
                                                if (e != "") {
                                                    attributes.id = e + "." + n + "_1"
                                                }
                                                y.push(n + "_1")
                                            }
                                        }
                                        r = this.createElement("intersection", [c[0], c[1], 0], attributes);
                                        l.intersections.push(r);
                                        if (n != "") {
                                            l[attributes.name] = r
                                        }
                                        if (n != "") {
                                            attributes.name = n + "_2";
                                            if (s == "macro") {
                                                if (e != "") {
                                                    attributes.id = e + "." + n + "_2"
                                                }
                                                y.push(n + "_2")
                                            }
                                        }
                                        r = this.createElement("intersection", [c[0], c[1], 1], attributes);
                                        l.intersections.push(r);
                                        if (n != "") {
                                            l[attributes.name] = r
                                        }
                                    }
                                } else {
                                    if (h[x].search(/\|[\|_]\s*\(/) != -1) {
                                        h[x].match(/\|([\|_])\s*\(\s*(\S*)\s*,\s*(\S*)\s*\)/);
                                        d = RegExp.$1;
                                        if (d == "|") {
                                            d = "parallel"
                                        } else {
                                            d = "normal"
                                        }
                                        c = [];
                                        c[0] = RegExp.$2;
                                        c[1] = RegExp.$3;
                                        if (s == "macro") {
                                            for (v = 0; v <= 1; v++) {
                                                if (e != "") {
                                                    for (u = 0; u < y.length; u++) {
                                                        if (c[v] == y[u]) {
                                                            c[v] = e + "." + y[u]
                                                        }
                                                    }
                                                }
                                                for (u = 0; u < B.length; u++) {
                                                    if (c[v] == B[u]) {
                                                        c[v] = w[u]
                                                    }
                                                }
                                            }
                                        }
                                        if (n != "") {
                                            attributes.name = n;
                                            if (attributes.withLabel == undefined) {
                                                attributes.withLabel = true
                                            }
                                            if (s == "macro") {
                                                if (e != "") {
                                                    attributes.id = e + "." + n
                                                }
                                                y.push(n)
                                            }
                                        }
                                        l.lines.push(this.createElement(d, [JXG.getReference(this, c[0]), JXG.getReference(this, c[1])], attributes));
                                        if (n != "") {
                                            l[n] = l.lines[l.lines.length - 1]
                                        }
                                    } else {
                                        if (h[x].search(/^</) != -1) {
                                            h[x].match(/<\s*\(\s*(\S*)\s*,\s*(\S*)\s*,\s*(\S*)\s*\)/);
                                            c = [];
                                            c[0] = RegExp.$1;
                                            c[1] = RegExp.$2;
                                            c[2] = RegExp.$3;
                                            if (s == "macro") {
                                                for (v = 0; v <= 2; v++) {
                                                    if (e != "") {
                                                        for (u = 0; u < y.length; u++) {
                                                            if (c[v] == y[u]) {
                                                                c[v] = e + "." + y[u]
                                                            }
                                                        }
                                                    }
                                                    for (u = 0; u < B.length; u++) {
                                                        if (c[v] == B[u]) {
                                                            c[v] = w[u]
                                                        }
                                                    }
                                                }
                                            }
                                            if (n == "") {
                                                l.lines.push(this.createElement("angle", [JXG.getReference(this, c[0]), JXG.getReference(this, c[1]), JXG.getReference(this, c[2])], attributes))
                                            } else {
                                                b = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigmaf", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"];
                                                d = "";
                                                for (v = 0; v < b.length; v++) {
                                                    if (n == b[v]) {
                                                        attributes.name = "&" + n + ";";
                                                        d = "greek";
                                                        break
                                                    } else {
                                                        if (v == b.length - 1) {
                                                            attributes.name = n
                                                        }
                                                    }
                                                }
                                                if (attributes.withLabel == undefined) {
                                                    attributes.withLabel = true
                                                }
                                                if (s == "macro") {
                                                    if (e != "") {
                                                        attributes.id = e + "." + n
                                                    }
                                                    y.push(n)
                                                }
                                                l.angles.push(this.createElement("angle", [JXG.getReference(this, c[0]), JXG.getReference(this, c[1]), JXG.getReference(this, c[2])], attributes));
                                                l[n] = l.angles[l.angles.length - 1]
                                            }
                                        } else {
                                            if (h[x].search(/([0-9]+)\/([0-9]+)\(\s*(\S*)\s*,\s*(\S*)\s*\)/) != -1) {
                                                c = [];
                                                c[0] = 1 * (RegExp.$1) / (1 * (RegExp.$2));
                                                c[1] = RegExp.$3;
                                                c[2] = RegExp.$4;
                                                if (s == "macro") {
                                                    for (v = 1; v <= 2; v++) {
                                                        if (e != "") {
                                                            for (u = 0; u < y.length; u++) {
                                                                if (c[v] == y[u]) {
                                                                    c[v] = e + "." + y[u]
                                                                }
                                                            }
                                                        }
                                                        for (u = 0; u < B.length; u++) {
                                                            if (c[v] == B[u]) {
                                                                c[v] = w[u]
                                                            }
                                                        }
                                                    }
                                                }
                                                c[1] = JXG.getReference(this, RegExp.$3);
                                                c[2] = JXG.getReference(this, RegExp.$4);
                                                r = [];
                                                r[0] = (function (C, k) {
                                                    return function () {
                                                        return (1 - C[0]) * C[1].coords.usrCoords[1] + C[0] * C[2].coords.usrCoords[1]
                                                    }
                                                })(c, this);
                                                r[1] = (function (C, k) {
                                                    return function () {
                                                        return (1 - C[0]) * C[1].coords.usrCoords[2] + C[0] * C[2].coords.usrCoords[2]
                                                    }
                                                })(c, this);
                                                if (n != "") {
                                                    attributes.name = n;
                                                    if (s == "macro") {
                                                        if (e != "") {
                                                            attributes.id = e + "." + n
                                                        }
                                                        y.push(n)
                                                    }
                                                }
                                                l.points.push(board.createElement("point", [r[0], r[1]], attributes));
                                                if (n != "") {
                                                    l[n] = l.points[l.points.length - 1]
                                                }
                                            } else {
                                                if (h[x].search(/(\S*)\s*:\s*(.*)/) != -1) {
                                                    n = RegExp.$1;
                                                    A = this.algebra.geonext2JS(RegExp.$2);
                                                    c = [new Function("x", "var y = " + A + "; return y;")];
                                                    attributes.name = n;
                                                    l.functions.push(board.create("functiongraph", c, attributes));
                                                    l[n] = l.functions[l.functions.length - 1]
                                                } else {
                                                    if (h[x].search(/#(.*)\(\s*([0-9])\s*[,|]\s*([0-9])\s*\)/) != -1) {
                                                        c = [];
                                                        c[0] = RegExp.$1;
                                                        c[1] = 1 * RegExp.$2;
                                                        c[2] = 1 * RegExp.$3;
                                                        c[0] = c[0].replace(/^\s+/, "").replace(/\s+$/, "");
                                                        l.texts.push(board.createElement("text", [c[1], c[2], c[0]], attributes))
                                                    } else {
                                                        if (h[x].search(/(\S*)\s*\[(.*)\]/) != -1) {
                                                            attributes.name = RegExp.$1;
                                                            if (attributes.withLabel == undefined) {
                                                                attributes.withLabel = true
                                                            }
                                                            c = RegExp.$2;
                                                            c = c.split(",");
                                                            for (v = 0; v < c.length; v++) {
                                                                c[v] = c[v].replace(/^\s+/, "").replace(/\s+$/, "");
                                                                if (s == "macro") {
                                                                    if (e != "") {
                                                                        for (u = 0; u < y.length; u++) {
                                                                            if (c[v] == y[u]) {
                                                                                c[v] = e + "." + y[u]
                                                                            }
                                                                        }
                                                                    }
                                                                    for (u = 0; u < B.length; u++) {
                                                                        if (c[v] == B[u]) {
                                                                            c[v] = w[u]
                                                                        }
                                                                    }
                                                                }
                                                                c[v] = JXG.getReference(this, c[v])
                                                            }
                                                            l.polygons.push(board.createElement("polygon", c, attributes));
                                                            l[attributes.name] = l.polygons[l.polygons.length - 1]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return l
};
JXG.Board.prototype.addMacro = function (c) {
    var e, a, b = "",
        d;
    c.match(/(.*)\{(.*)\}/);
    e = RegExp.$1;
    a = RegExp.$2;
    if (e.search(/=/) != -1) {
        e.match(/\s*(\S*)\s*=.*/);
        b = RegExp.$1;
        e = (e.split("="))[1]
    }
    e.match(/Macro\((.*)\)/);
    e = RegExp.$1;
    e = e.split(",");
    for (d = 0; d < e.length; d++) {
        e[d].match(/\s*(\S*)\s*/);
        e[d] = RegExp.$1
    }
    if (this.definedMacros == null) {
        this.definedMacros = {};
        this.definedMacros.macros = []
    }
    this.definedMacros.macros.push([b, e, a]);
    if (b != "") {
        this.definedMacros.defName = this.definedMacros.macros[this.definedMacros.macros.length - 1]
    }
};
JXG.Options = {
    showCopyright: true,
    showNavigation: true,
    takeSizeFromFile: false,
    renderer: "svg",
    grid: {
        hasGrid: false,
        gridX: 2,
        gridY: 2,
        gridColor: "#C0C0C0",
        gridOpacity: "0.5",
        gridDash: true,
        snapToGrid: false,
        snapSizeX: 2,
        snapSizeY: 2
    },
    zoom: {
        factor: 1.25
    },
    elements: {
        strokeColor: "#0000ff",
        highlightStrokeColor: "#C3D9FF",
        fillColor: "none",
        highlightFillColor: "none",
        strokeOpacity: 1,
        highlightStrokeOpacity: 1,
        fillOpacity: 1,
        highlightFillOpacity: 1,
        strokeWidth: "2px",
        withLabel: false,
        draft: {
            draft: false,
            color: "#565656",
            opacity: 0.8,
            strokeWidth: "1px"
        }
    },
    point: {
        withLabel: true,
        style: 5,
        face: "o",
        size: 3,
        fillColor: "#ff0000",
        highlightFillColor: "#EEEEEE",
        strokeWidth: "2px",
        strokeColor: "#ff0000",
        highlightStrokeColor: "#C3D9FF",
        zoom: false
    },
    line: {
        firstArrow: false,
        lastArrow: false,
        straightFirst: true,
        straightLast: true,
        fillColor: "#000000",
        highlightFillColor: "none",
        strokeColor: "#0000ff",
        highlightStrokeColor: "#888888",
        ticks: {
            drawLabels: true,
            drawZero: false,
            insertTicks: false,
            minTicksDistance: 50,
            maxTicksDistance: 300,
            minorHeight: 4,
            majorHeight: 10,
            minorTicks: 4,
            defaultDistance: 1
        },
        labelOffsets: [10, 10]
    },
    axis: {
        strokeColor: "#666666",
        highlightStrokeColor: "#888888"
    },
    circle: {
        fillColor: "none",
        highlightFillColor: "none",
        strokeColor: "#0000ff",
        highlightStrokeColor: "#C3D9FF"
    },
    conic: {
        fillColor: "none",
        highlightFillColor: "none",
        strokeColor: "#0000ff",
        highlightStrokeColor: "#C3D9FF"
    },
    angle: {
        withLabel: true,
        radius: 1,
        fillColor: "#FF7F00",
        highlightFillColor: "#FF7F00",
        strokeColor: "#FF7F00",
        fillOpacity: 0.3,
        highlightFillOpacity: 0.3
    },
    arc: {
        firstArrow: false,
        lastArrow: false,
        fillColor: "none",
        highlightFillColor: "none",
        strokeColor: "#0000ff",
        highlightStrokeColor: "#C3D9FF"
    },
    polygon: {
        fillColor: "#00FF00",
        highlightFillColor: "#00FF00",
        fillOpacity: 0.3,
        highlightFillOpacity: 0.3
    },
    sector: {
        fillColor: "#00FF00",
        highlightFillColor: "#00FF00",
        fillOpacity: 0.3,
        highlightFillOpacity: 0.3
    },
    text: {
        fontSize: 12,
        strokeColor: "#000000",
        useASCIIMathML: false,
        defaultDisplay: "html"
    },
    curve: {
        strokeWidth: "1px",
        strokeColor: "#0000ff",
        RDPsmoothing: false,
        numberPointsHigh: 1600,
        numberPointsLow: 400,
        doAdvancedPlot: true
    },
    precision: {
        touch: 20,
        mouse: 4,
        epsilon: 0.0001,
        hasPoint: 4
    },
    layer: {
        numlayers: 20,
        text: 9,
        point: 9,
        arc: 8,
        line: 7,
        circle: 6,
        curve: 5,
        polygon: 4,
        sector: 3,
        angle: 2,
        grid: 1,
        image: 0
    }
};
JXG.useStandardOptions = function (d) {
    var e = JXG.Options,
        c = d.hasGrid,
        b, a;
    d.hasGrid = e.grid.hasGrid;
    d.gridX = e.grid.gridX;
    d.gridY = e.grid.gridY;
    d.gridColor = e.grid.gridColor;
    d.gridOpacity = e.grid.gridOpacity;
    d.gridDash = e.grid.gridDash;
    d.snapToGrid = e.grid.snapToGrid;
    d.snapSizeX = e.grid.SnapSizeX;
    d.snapSizeY = e.grid.SnapSizeY;
    d.takeSizeFromFile = e.takeSizeFromFile;
    for (b in d.objects) {
        p = d.objects[b];
        if (p.elementClass == JXG.OBJECT_CLASS_POINT) {
            p.visProp.fillColor = e.point.fillColor;
            p.visProp.highlightFillColor = e.point.highlightFillColor;
            p.visProp.strokeColor = e.point.strokeColor;
            p.visProp.highlightStrokeColor = e.point.highlightStrokeColor
        } else {
            if (p.elementClass == JXG.OBJECT_CLASS_LINE) {
                p.visProp.fillColor = e.line.fillColor;
                p.visProp.highlightFillColor = e.line.highlightFillColor;
                p.visProp.strokeColor = e.line.strokeColor;
                p.visProp.highlightStrokeColor = e.line.highlightStrokeColor;
                for (a in p.ticks) {
                    a.majorTicks = e.line.ticks.majorTicks;
                    a.minTicksDistance = e.line.ticks.minTicksDistance;
                    a.minorHeight = e.line.ticks.minorHeight;
                    a.majorHeight = e.line.ticks.majorHeight
                }
            } else {
                if (p.elementClass == JXG.OBJECT_CLASS_CIRCLE) {
                    p.visProp.fillColor = e.circle.fillColor;
                    p.visProp.highlightFillColor = e.circle.highlightFillColor;
                    p.visProp.strokeColor = e.circle.strokeColor;
                    p.visProp.highlightStrokeColor = e.circle.highlightStrokeColor
                } else {
                    if (p.type == JXG.OBJECT_TYPE_ANGLE) {
                        p.visProp.fillColor = e.angle.fillColor;
                        p.visProp.highlightFillColor = e.angle.highlightFillColor;
                        p.visProp.strokeColor = e.angle.strokeColor
                    } else {
                        if (p.type == JXG.OBJECT_TYPE_ARC) {
                            p.visProp.fillColor = e.arc.fillColor;
                            p.visProp.highlightFillColor = e.arc.highlightFillColor;
                            p.visProp.strokeColor = e.arc.strokeColor;
                            p.visProp.highlightStrokeColor = e.arc.highlightStrokeColor
                        } else {
                            if (p.type == JXG.OBJECT_TYPE_POLYGON) {
                                p.visProp.fillColor = e.polygon.fillColor;
                                p.visProp.highlightFillColor = e.polygon.highlightFillColor;
                                p.visProp.fillOpacity = e.polygon.fillOpacity;
                                p.visProp.highlightFillOpacity = e.polygon.highlightFillOpacity
                            } else {
                                if (p.type == JXG.OBJECT_TYPE_CONIC) {
                                    p.visProp.fillColor = e.conic.fillColor;
                                    p.visProp.highlightFillColor = e.conic.highlightFillColor;
                                    p.visProp.strokeColor = e.conic.strokeColor;
                                    p.visProp.highlightStrokeColor = e.conic.highlightStrokeColor
                                } else {
                                    if (p.type == JXG.OBJECT_TYPE_CURVE) {
                                        p.visProp.strokeColor = e.curve.strokeColor
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    for (b in d.objects) {
        p = d.objects[b];
        if (p.type == JXG.OBJECT_TYPE_SECTOR) {
            p.arc.visProp.fillColor = e.sector.fillColor;
            p.arc.visProp.highlightFillColor = e.sector.highlightFillColor;
            p.arc.visProp.fillOpacity = e.sector.fillOpacity;
            p.arc.visProp.highlightFillOpacity = e.sector.highlightFillOpacity
        }
    }
    d.fullUpdate();
    if (c && d.hasGrid) {
        d.renderer.removeGrid(d);
        d.renderer.drawGrid(d)
    } else {
        if (c && !d.hasGrid) {
            d.renderer.removeGrid(d)
        } else {
            if (!c && d.hasGrid) {
                d.renderer.drawGrid(d)
            }
        }
    }
};
JXG.useBlackWhiteOptions = function (a) {
    o = JXG.Options;
    o.point.fillColor = JXG.rgb2bw(o.point.fillColor);
    o.point.highlightFillColor = JXG.rgb2bw(o.point.highlightFillColor);
    o.point.strokeColor = JXG.rgb2bw(o.point.strokeColor);
    o.point.highlightStrokeColor = JXG.rgb2bw(o.point.highlightStrokeColor);
    o.line.fillColor = JXG.rgb2bw(o.line.fillColor);
    o.line.highlightFillColor = JXG.rgb2bw(o.line.highlightFillColor);
    o.line.strokeColor = JXG.rgb2bw(o.line.strokeColor);
    o.line.highlightStrokeColor = JXG.rgb2bw(o.line.highlightStrokeColor);
    o.circle.fillColor = JXG.rgb2bw(o.circle.fillColor);
    o.circle.highlightFillColor = JXG.rgb2bw(o.circle.highlightFillColor);
    o.circle.strokeColor = JXG.rgb2bw(o.circle.strokeColor);
    o.circle.highlightStrokeColor = JXG.rgb2bw(o.circle.highlightStrokeColor);
    o.arc.fillColor = JXG.rgb2bw(o.arc.fillColor);
    o.arc.highlightFillColor = JXG.rgb2bw(o.arc.highlightFillColor);
    o.arc.strokeColor = JXG.rgb2bw(o.arc.strokeColor);
    o.arc.highlightStrokeColor = JXG.rgb2bw(o.arc.highlightStrokeColor);
    o.polygon.fillColor = JXG.rgb2bw(o.polygon.fillColor);
    o.polygon.highlightFillColor = JXG.rgb2bw(o.polygon.highlightFillColor);
    o.sector.fillColor = JXG.rgb2bw(o.sector.fillColor);
    o.sector.highlightFillColor = JXG.rgb2bw(o.sector.highlightFillColor);
    o.curve.strokeColor = JXG.rgb2bw(o.curve.strokeColor);
    o.grid.gridColor = JXG.rgb2bw(o.grid.gridColor);
    JXG.useStandardOptions(a)
};
JXG.rgb2bw = function (c) {
    if (c == "none") {
        return c
    }
    var b, e = "0123456789ABCDEF",
        d, a;
    a = JXG.rgbParser(c);
    b = 0.3 * a[0] + 0.59 * a[1] + 0.11 * a[2];
    d = e.charAt((b >> 4) & 15) + e.charAt(b & 15);
    c = "#" + d + "" + d + "" + d;
    return c
};
JXG.simulateColorBlindness = function (b, a) {
    o = JXG.Options;
    o.point.fillColor = JXG.rgb2cb(o.point.fillColor, a);
    o.point.highlightFillColor = JXG.rgb2cb(o.point.highlightFillColor, a);
    o.point.strokeColor = JXG.rgb2cb(o.point.strokeColor, a);
    o.point.highlightStrokeColor = JXG.rgb2cb(o.point.highlightStrokeColor, a);
    o.line.fillColor = JXG.rgb2cb(o.line.fillColor, a);
    o.line.highlightFillColor = JXG.rgb2cb(o.line.highlightFillColor, a);
    o.line.strokeColor = JXG.rgb2cb(o.line.strokeColor, a);
    o.line.highlightStrokeColor = JXG.rgb2cb(o.line.highlightStrokeColor, a);
    o.circle.fillColor = JXG.rgb2cb(o.circle.fillColor, a);
    o.circle.highlightFillColor = JXG.rgb2cb(o.circle.highlightFillColor, a);
    o.circle.strokeColor = JXG.rgb2cb(o.circle.strokeColor, a);
    o.circle.highlightStrokeColor = JXG.rgb2cb(o.circle.highlightStrokeColor, a);
    o.arc.fillColor = JXG.rgb2cb(o.arc.fillColor, a);
    o.arc.highlightFillColor = JXG.rgb2cb(o.arc.highlightFillColor, a);
    o.arc.strokeColor = JXG.rgb2cb(o.arc.strokeColor, a);
    o.arc.highlightStrokeColor = JXG.rgb2cb(o.arc.highlightStrokeColor, a);
    o.polygon.fillColor = JXG.rgb2cb(o.polygon.fillColor, a);
    o.polygon.highlightFillColor = JXG.rgb2cb(o.polygon.highlightFillColor, a);
    o.sector.fillColor = JXG.rgb2cb(o.sector.fillColor, a);
    o.sector.highlightFillColor = JXG.rgb2cb(o.sector.highlightFillColor, a);
    o.curve.strokeColor = JXG.rgb2cb(o.curve.strokeColor, a);
    o.grid.gridColor = JXG.rgb2cb(o.grid.gridColor, a);
    JXG.useStandardOptions(b)
};
JXG.rgb2cb = function (f, n) {
    if (f == "none") {
        return f
    }
    var r, e, d, w, q, k, c, v, h, b, u, g;
    q = JXG.rgb2LMS(f);
    e = q.l;
    d = q.m;
    w = q.s;
    n = n.toLowerCase();
    switch (n) {
    case "protanopia":
        c = -0.06150039994295001;
        v = 0.08277001656812001;
        h = -0.013200141220000003;
        b = 0.05858939668799999;
        u = -0.07934519995360001;
        g = 0.013289415272000003;
        inflection = 0.6903216543277437;
        k = w / d;
        if (k < inflection) {
            e = -(v * d + h * w) / c
        } else {
            e = -(u * d + g * w) / b
        }
        break;
    case "tritanopia":
        c = -0.00058973116217;
        v = 0.007690316482;
        h = -0.01011703519052;
        b = 0.025495080838999994;
        u = -0.0422740347;
        g = 0.017005316784;
        inflection = 0.8349489908460004;
        k = d / e;
        if (k < inflection) {
            w = -(c * e + v * d) / h
        } else {
            w = -(b * e + u * d) / g
        }
        break;
    default:
        c = -0.06150039994295001;
        v = 0.08277001656812001;
        h = -0.013200141220000003;
        b = 0.05858939668799999;
        u = -0.07934519995360001;
        g = 0.013289415272000003;
        inflection = 0.5763833686400911;
        k = w / e;
        if (k < inflection) {
            d = -(c * e + h * w) / v
        } else {
            d = -(b * e + g * w) / u
        }
        break
    }
    r = JXG.LMS2rgb(e, d, w);
    var a = "0123456789ABCDEF";
    k = a.charAt((r.r >> 4) & 15) + a.charAt(r.r & 15);
    f = "#" + k;
    k = a.charAt((r.g >> 4) & 15) + a.charAt(r.g & 15);
    f += k;
    k = a.charAt((r.b >> 4) & 15) + a.charAt(r.b & 15);
    f += k;
    return f
};
JXG.loadOptionsFromFile = function (b, c, a) {
    this.cbp = function (d) {
        this.parseString(d, c, a)
    };
    this.cb = JXG.bind(this.cbp, this);
    JXG.FileReader.parseFileContent(b, this.cb, "raw")
};
JXG.parseOptionsString = function (text, applyTo, board) {
    var newOptions = "";
    if (text != "") {
        newOptions = eval("(" + text + ")")
    } else {
        return
    }
    var maxDepth = 10;
    var applyOption = function (base, option, depth) {
            if (depth == 10) {
                return
            }
            depth++;
            for (var key in option) {
                if ((JXG.isNumber(option[key])) || (JXG.isArray(option[key])) || (JXG.isString(option[key])) || (option[key] == true) || (option[key] == false)) {
                    base[key] = option[key]
                } else {
                    applyOption(base[key], option[key], depth)
                }
            }
        };
    applyOption(this, newOptions, 0);
    if (applyTo && typeof board != "undefined") {
        JXG.useStandardOptions(board)
    }
};
JXG.JSXGraph = new function () {
    var e, b, d, a;
    this.licenseText = "";
    this.rendererType = "";
    this.boards = {};
    this.elements = {};
    if ((typeof forceRenderer == "undefined") || (forceRenderer == null) || (forceRenderer == "")) {
        e = navigator.appVersion.match(/MSIE (\d\.\d)/);
        b = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
        if ((!e) || (b)) {
            JXG.Options.renderer = "svg"
        } else {
            JXG.Options.renderer = "vml";

            function c(f) {
                document.body.scrollLeft;
                document.body.scrollTop
            }
            document.onmousemove = c
        }
    } else {
        JXG.Options.renderer = forceRenderer
    }
    a = JXG.rendererFiles[JXG.Options.renderer].split(",");
    for (d = 0; d < a.length; d++) {
        (function (f) {
            JXG.require(JXG.requirePath + f + ".js")
        })(a[d])
    }
    this.initBoard = function (l, g) {
        var r, C, B, v, s, y, k, f, A, z, x, u, q, m, n;
        f = JXG.getDimensions(l);
        if (typeof g == "undefined") {
            g = {}
        }
        if (typeof g.boundingbox != "undefined") {
            A = g.boundingbox;
            y = parseInt(f.width);
            k = parseInt(f.height);
            if (g.keepaspectratio) {
                v = y / (A[2] - A[0]);
                s = k / (-A[3] + A[1]);
                if (v < s) {
                    s = v
                } else {
                    v = s
                }
            } else {
                v = y / (A[2] - A[0]);
                s = k / (-A[3] + A[1])
            }
            C = -v * A[0];
            B = s * A[1]
        } else {
            C = ((typeof g.originX) == "undefined" ? 150 : g.originX);
            B = ((typeof g.originY) == "undefined" ? 150 : g.originY);
            v = ((typeof g.unitX) == "undefined" ? 50 : g.unitX);
            s = ((typeof g.unitY) == "undefined" ? 50 : g.unitY)
        }
        z = ((typeof g.zoom) == "undefined" ? 1 : g.zoom);
        x = z * ((typeof g.zoomX) == "undefined" ? 1 : g.zoomX);
        u = z * ((typeof g.zoomY) == "undefined" ? 1 : g.zoomY);
        q = ((typeof g.showCopyright) == "undefined" ? JXG.Options.showCopyright : g.showCopyright);
        if (JXG.Options.renderer == "svg") {
            r = new JXG.SVGRenderer(document.getElementById(l))
        } else {
            if (JXG.Options.renderer == "vml") {
                r = new JXG.VMLRenderer(document.getElementById(l))
            } else {
                r = new JXG.SilverlightRenderer(document.getElementById(l), f.width, f.height)
            }
        }
        n = new JXG.Board(l, r, "", [C, B], 1, 1, v, s, f.width, f.height, q);
        this.boards[n.id] = n;
        n.initInfobox();
        if ((typeof g.axis != "undefined") && g.axis) {
            n.defaultAxes = {};
            n.defaultAxes.x = n.create("axis", [
                [0, 0],
                [1, 0]
            ], {});
            n.defaultAxes.y = n.create("axis", [
                [0, 0],
                [0, 1]
            ], {})
        }
        if ((typeof g.grid != "undefined") && g.grid) {
            n.renderer.drawGrid(n)
        }
        if (typeof g.shownavigation != "undefined") {
            g.showNavigation = g.shownavigation
        }
        m = ((typeof g.showNavigation) == "undefined" ? n.options.showNavigation : g.showNavigation);
        if (m) {
            n.renderer.drawZoomBar(n)
        }
        return n
    };
    this.loadBoardFromFile = function (k, f, m) {
        var l, g, h;
        if (JXG.Options.renderer == "svg") {
            l = new JXG.SVGRenderer(document.getElementById(k))
        } else {
            l = new JXG.VMLRenderer(document.getElementById(k))
        }
        h = JXG.getDimensions(k);
        g = new JXG.Board(k, l, "", [150, 150], 1, 1, 50, 50, h.width, h.height);
        g.initInfobox();
        g.beforeLoad();
        JXG.FileReader.parseFileContent(f, g, m);
        if (g.options.showNavigation) {
            g.renderer.drawZoomBar(g)
        }
        this.boards[g.id] = g;
        return g
    };
    this.loadBoardFromString = function (k, f, m) {
        var l, h, g;
        if (JXG.Options.renderer == "svg") {
            l = new JXG.SVGRenderer(document.getElementById(k))
        } else {
            l = new JXG.VMLRenderer(document.getElementById(k))
        }
        h = JXG.getDimensions(k);
        g = new JXG.Board(k, l, "", [150, 150], 1, 1, 50, 50, h.width, h.height);
        g.initInfobox();
        g.beforeLoad();
        JXG.FileReader.parseString(f, g, m, true);
        if (g.options.showNavigation) {
            g.renderer.drawZoomBar(g)
        }
        this.boards[g.id] = g;
        return g
    };
    this.freeBoard = function (g) {
        var f;
        if (typeof (g) == "string") {
            g = this.boards[g]
        }
        JXG.removeEvent(document, "mousedown", g.mouseDownListener, g);
        JXG.removeEvent(document, "mouseup", g.mouseUpListener, g);
        JXG.removeEvent(g.containerObj, "mousemove", g.mouseMoveListener, g);
        for (f in g.objects) {
            g.removeObject(g.objects[f])
        }
        g.containerObj.innerHTML = "";
        for (f in g.objects) {
            delete(g.objects[f])
        }
        delete(g.renderer);
        delete(g.algebra);
        delete(this.boards[g.id])
    };
    this.registerElement = function (f, g) {
        f = f.toLowerCase();
        this.elements[f] = g;
        if (JXG.Board.prototype["_" + f]) {
            throw new Error("JSXGraph: Can't create wrapper method in JXG.Board because member '_" + f + "' already exists'")
        }
        JXG.Board.prototype["_" + f] = function (k, h) {
            return this.create(f, k, h)
        }
    };
    this.unregisterElement = function (f) {
        delete(this.elements[f.toLowerCase()]);
        delete(JXG.Board.prototype["_" + f.toLowerCase()])
    }
};
JXG.getReference = function (b, a) {
    if (typeof (a) == "string") {
        if (b.objects[a] != null) {
            a = b.objects[a]
        } else {
            if (b.elementsByName[a] != null) {
                a = b.elementsByName[a]
            }
        }
    }
    return a
};
JXG.getRef = JXG.getReference;
JXG.isString = function (a) {
    return typeof a == "string"
};
JXG.isNumber = function (a) {
    return typeof a == "number"
};
JXG.isFunction = function (a) {
    return typeof a == "function"
};
JXG.isArray = function (a) {
    return a != null && typeof a == "object" && "splice" in a && "join" in a
};
JXG.isPoint = function (a) {
    if (typeof a == "object") {
        return (a.elementClass == JXG.OBJECT_CLASS_POINT)
    }
    return false
};
JXG.str2Bool = function (a) {
    if (a == undefined || a == null) {
        return true
    }
    if (typeof a == "boolean") {
        return a
    }
    if (a.toLowerCase() != "true") {
        return false
    } else {
        return true
    }
};
JXG._board = function (b, a) {
    return JXG.JSXGraph.initBoard(b, a)
};
JXG.createEvalFunction = function (b, e, g) {
    var c = [],
        a, d;
    for (a = 0; a < g; a++) {
        if (typeof e[a] == "string") {
            d = b.algebra.geonext2JS(e[a]);
            d = d.replace(/this\.board\./g, "board.");
            c[a] = new Function("", "return " + (d) + ";")
        }
    }
    return function (h) {
        var f = e[h];
        if (typeof f == "string") {
            return c[h]()
        } else {
            if (typeof f == "function") {
                return f()
            } else {
                if (typeof f == "number") {
                    return f
                }
            }
        }
        return 0
    }
};
JXG.createFunction = function (b, c, d, e) {
    var a;
    if ((e == null || e == true) && JXG.isString(b)) {
        a = c.algebra.geonext2JS(b);
        return new Function(d, "return " + a + ";")
    } else {
        if (JXG.isFunction(b)) {
            return b
        } else {
            if (JXG.isNumber(b)) {
                return function () {
                    return b
                }
            } else {
                if (JXG.isString(b)) {
                    return function () {
                        return b
                    }
                }
            }
        }
    }
    return null
};
JXG.readOption = function (a, c, b) {
    var d = a.elements[b];
    if (typeof a[c][b] != "undefined") {
        d = a[c][b]
    }
    return d
};
JXG.checkAttributes = function (c, b) {
    var a;
    if (c == null) {
        c = {}
    }
    for (a in b) {
        if (c[a] == null || typeof c[a] == "undefined") {
            c[a] = b[a]
        }
    }
    return c
};
JXG.getDimensions = function (f) {
    var e, h, c, k, g, b, a, d;
    e = document.getElementById(f);
    if (e == null) {
        throw new Error("\nJSXGraph: HTML container element '" + (f) + "' not found.")
    }
    h = e.style.display;
    if (h != "none" && h != null) {
        return {
            width: e.offsetWidth,
            height: e.offsetHeight
        }
    }
    c = e.style;
    k = c.visibility;
    g = c.position;
    b = c.display;
    c.visibility = "hidden";
    c.position = "absolute";
    c.display = "block";
    a = e.clientWidth;
    d = e.clientHeight;
    c.display = b;
    c.position = g;
    c.visibility = k;
    return {
        width: a,
        height: d
    }
};
JXG.addEvent = function (d, c, b, a) {
    a["x_internal" + c] = function () {
        return b.apply(a, arguments)
    };
    if (typeof d.addEventListener != "undefined") {
        d.addEventListener(c, a["x_internal" + c], false)
    } else {
        d.attachEvent("on" + c, a["x_internal" + c])
    }
};
JXG.removeEvent = function (f, c, b, a) {
    try {
        if (typeof f.addEventListener != "undefined") {
            f.removeEventListener(c, a["x_internal" + c], false)
        } else {
            f.detachEvent("on" + c, a["x_internal" + c])
        }
    } catch (d) {}
};
JXG.bind = function (b, a) {
    return function () {
        return b.apply(a, arguments)
    }
};
JXG.getPosition = function (b) {
    var a = 0,
        c = 0,
        b;
    if (!b) {
        b = window.event
    }
    if (b.pageX || b.pageY) {
        a = b.pageX;
        c = b.pageY
    } else {
        if (b.clientX || b.clientY) {
            a = b.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            c = b.clientY + document.body.scrollTop + document.documentElement.scrollTop
        }
    }
    return [a, c]
};
JXG.getOffset = function (c) {
    var d = c,
        a = d.offsetLeft,
        b = d.offsetTop;
    while (d = d.offsetParent) {
        a += d.offsetLeft;
        b += d.offsetTop;
        if (d.offsetParent) {
            a += d.clientLeft;
            b += d.clientTop
        }
    }
    return [a, b]
};
JXG.getStyle = function (b, a) {
    return b.style[a]
};
JXG.keys = function (a) {
    var b = [],
        c;
    for (c in a) {
        b.push(c)
    }
    return b
};
JXG.escapeHTML = function (a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
};
JXG.unescapeHTML = function (a) {
    return a.replace(/<\/?[^>]+>/gi, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
};
JXG.clone = function (b) {
    var a = {};
    a.prototype = b;
    return a
};
JXG.deepCopy = function (d) {
    var f, b, e, a;
    if (typeof d !== "object" || d == null) {
        return d
    }
    if (this.isArray(d)) {
        f = [];
        for (b = 0; b < d.length; b++) {
            e = d[b];
            if (typeof e == "object") {
                if (this.isArray(e)) {
                    f[b] = [];
                    for (a = 0; a < e.length; a++) {
                        if (typeof e[a] != "object") {
                            f[b].push(e[a])
                        } else {
                            f[b].push(this.deepCopy(e[a]))
                        }
                    }
                } else {
                    f[b] = this.deepCopy(e)
                }
            } else {
                f[b] = e
            }
        }
    } else {
        f = {};
        for (b in d) {
            e = d[b];
            if (typeof e == "object") {
                if (this.isArray(e)) {
                    f[b] = [];
                    for (a = 0; a < e.length; a++) {
                        if (typeof e[a] != "object") {
                            f[b].push(e[a])
                        } else {
                            f[b].push(this.deepCopy(e[a]))
                        }
                    }
                } else {
                    f[b] = this.deepCopy(e)
                }
            } else {
                f[b] = e
            }
        }
    }
    return f
};
JXG.cloneAndCopy = function (d, c) {
    var a = {},
        b;
    a.prototype = d;
    for (b in c) {
        a[b] = c[b]
    }
    return a
};
JXG.toJSON = function (c) {
    switch (typeof c) {
    case "object":
        if (c) {
            var b = [];
            if (c instanceof Array) {
                for (var a = 0; a < c.length; a++) {
                    b.push(JXG.toJSON(c[a]))
                }
                return "[" + b.join(",") + "]"
            } else {
                for (var d in c) {
                    b.push('"' + d + '":' + JXG.toJSON(c[d]))
                }
                return "{" + b.join(",") + "}"
            }
        } else {
            return "null"
        }
    case "string":
        return '"' + c.replace(/(["'])/g, "\\$1") + '"';
    case "number":
    case "boolean":
        return new String(c)
    }
};
JXG.capitalize = function (a) {
    return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase()
};
JXG.timedChunk = function (b, d, c, e) {
    var a = b.concat();
    setTimeout(function () {
        var f = +new Date();
        do {
            d.call(c, a.shift())
        } while (a.length > 0 && (+new Date() - f < 300));
        if (a.length > 0) {
            setTimeout(arguments.callee, 1)
        } else {
            e(b)
        }
    }, 1)
};
JXG.trimNumber = function (a) {
    a = a.replace(/^0+/, "");
    a = a.replace(/0+$/, "");
    if (a[a.length - 1] == "." || a[a.length - 1] == ",") {
        a = a.slice(0, -1)
    }
    if (a[0] == "." || a[0] == ",") {
        a = "0" + a
    }
    return a
};
JXG.trim = function (a) {
    a = a.replace(/^w+/, "");
    a = a.replace(/w+$/, "");
    return a
};
JXG.debug = function (a) {
    if (typeof console != "undefined" && console.log) {
        if (typeof a === "string") {
            a = a.replace(/<\S[^><]*>/g, "")
        }
        console.log(a)
    } else {
        if (document.getElementById("debug")) {
            document.getElementById("debug").innerHTML += a + "<br/>"
        }
    }
};
JXG.OBJECT_TYPE_ARC = 1330921795;
JXG.OBJECT_TYPE_ARROW = 1330921815;
JXG.OBJECT_TYPE_AXIS = 1330921816;
JXG.OBJECT_TYPE_TICKS = 1330926680;
JXG.OBJECT_TYPE_CIRCLE = 1330922316;
JXG.OBJECT_TYPE_CONIC = 1330922319;
JXG.OBJECT_TYPE_CURVE = 1330923344;
JXG.OBJECT_TYPE_GLIDER = 1330923340;
JXG.OBJECT_TYPE_IMAGE = 1330926157;
JXG.OBJECT_TYPE_LINE = 1330924622;
JXG.OBJECT_TYPE_POINT = 1330925652;
JXG.OBJECT_TYPE_SLIDER = 1330926404;
JXG.OBJECT_TYPE_CAS = 1330922320;
JXG.OBJECT_TYPE_POLYGON = 1330925657;
JXG.OBJECT_TYPE_SECTOR = 1330926403;
JXG.OBJECT_TYPE_TEXT = 1330926661;
JXG.OBJECT_TYPE_ANGLE = 1330921799;
JXG.OBJECT_TYPE_INTERSECTION = 1330926158;
JXG.OBJECT_TYPE_TURTLE = 5198933;
JXG.OBJECT_TYPE_VECTOR = 1330927188;
JXG.OBJECT_CLASS_POINT = 1;
JXG.OBJECT_CLASS_LINE = 2;
JXG.OBJECT_CLASS_CIRCLE = 3;
JXG.OBJECT_CLASS_CURVE = 4;
JXG.OBJECT_CLASS_AREA = 5;
JXG.OBJECT_CLASS_OTHER = 6;
JXG.GeometryElement = function () {
    this.board = null;
    this.id = "";
    this.needsUpdate = true;
    this.name = "";
    this.visProp = {};
    JXG.clearVisPropOld(this);
    this.isReal = true;
    this.visProp.dash = 0;
    this.childElements = {};
    this.hasLabel = false;
    this.layer = 9;
    this.notExistingParents = {};
    this.traced = false;
    this.fixed = false;
    this.frozen = false;
    this.traces = {};
    this.numTraces = 0;
    this.transformations = [];
    this.baseElement = null;
    this.descendants = {};
    this.ancestors = {};
    this.symbolic = {};
    this.stdform = [1, 0, 0, 0, 1, 1, 0, 0];
    this.quadraticform = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    this.needsRegularUpdate = true
};
JXG.GeometryElement.prototype.init = function (b, c, a) {
    if (typeof (b) == "string") {
        b = JXG.JSXGraph.boards[b]
    }
    this.board = b;
    this.id = c;
    if ((a != null) && (typeof a != "undefined")) {
        a = a
    } else {
        a = this.board.generateName(this)
    }
    this.board.elementsByName[a] = this;
    this.name = a;
    this.visProp.strokeColor = this.board.options.elements.strokeColor;
    this.visProp.highlightStrokeColor = this.board.options.elements.highlightStrokeColor;
    this.visProp.fillColor = this.board.options.elements.fillColor;
    this.visProp.highlightFillColor = this.board.options.elements.highlightFillColor;
    this.visProp.strokeWidth = this.board.options.elements.strokeWidth;
    this.visProp.highlightStrokeWidth = this.visProp.strokeWidth;
    this.visProp.strokeOpacity = this.board.options.elements.strokeOpacity;
    this.visProp.highlightStrokeOpacity = this.board.options.elements.highlightStrokeOpacity;
    this.visProp.fillOpacity = this.board.options.elements.fillOpacity;
    this.visProp.highlightFillOpacity = this.board.options.elements.highlightFillOpacity;
    this.visProp.draft = this.board.options.elements.draft.draft;
    this.visProp.visible = true;
    this.visProp.shadow = false;
    this.visProp.gradient = "none";
    this.visProp.gradientSecondColor = "black";
    this.visProp.gradientAngle = "270";
    this.visProp.gradientSecondOpacity = this.visProp.fillOpacity;
    this.visProp.gradientPositionX = 0.5;
    this.visProp.gradientPositionY = 0.5
};
JXG.GeometryElement.prototype.addChild = function (c) {
    var b, a;
    this.childElements[c.id] = c;
    this.addDescendants(c);
    c.ancestors[this.id] = this;
    for (b in this.descendants) {
        this.descendants[b].ancestors[this.id] = this;
        for (a in this.ancestors) {
            this.descendants[b].ancestors[this.ancestors[a].id] = this.ancestors[a]
        }
    }
    for (b in this.ancestors) {
        for (a in this.descendants) {
            this.ancestors[b].descendants[this.descendants[a].id] = this.descendants[a]
        }
    }
    return this
};
JXG.GeometryElement.prototype.addDescendants = function (b) {
    var a;
    this.descendants[b.id] = b;
    for (a in b.childElements) {
        this.addDescendants(b.childElements[a])
    }
    return this
};
JXG.GeometryElement.prototype.generatePolynomial = function () {
    return []
};
JXG.GeometryElement.prototype.animate = function (d, c) {
    var a, b, f = 35,
        g = Math.ceil(c / (f * 1)),
        e, k = this;
    this.animationData = {};
    var l = function (w, v, s) {
            var u, r, q, n, m;
            u = JXG.rgb2hsv(w);
            r = JXG.rgb2hsv(v);
            q = (r[0] - u[0]) / (1 * g);
            n = (r[1] - u[1]) / (1 * g);
            m = (r[2] - u[2]) / (1 * g);
            k.animationData[s] = new Array(g);
            for (e = 0; e < g; e++) {
                k.animationData[s][g - e - 1] = JXG.hsv2rgb(u[0] + (e + 1) * q, u[1] + (e + 1) * n, u[2] + (e + 1) * m)
            }
        },
        h = function (r, m, q) {
            r = parseFloat(r);
            m = parseFloat(m);
            if (isNaN(r) || isNaN(m)) {
                return
            }
            var n = (m - r) / (1 * g);
            k.animationData[q] = new Array(g);
            for (e = 0; e < g; e++) {
                k.animationData[q][g - e - 1] = r + (e + 1) * n
            }
        };
    for (a in d) {
        b = a.toLowerCase();
        switch (b) {
        case "strokecolor":
            l(this.visProp.strokeColor, d[a], "strokeColor");
            break;
        case "strokeopacity":
            h(this.visProp.strokeOpacity, d[a], "strokeOpacity");
            break;
        case "strokewidth":
            h(this.visProp.strokeWidth, d[a], "strokeWidth");
            break;
        case "fillcolor":
            l(this.visProp.fillColor, d[a], "fillColor");
            break;
        case "fillopacity":
            h(this.visProp.fillOpacity, d[a], "fillOpacity");
            break
        }
    }
    this.board.animationObjects[this.id] = this;
    if (typeof this.board.animationIntervalCode == "undefined") {
        this.board.animationIntervalCode = window.setInterval("JXG.JSXGraph.boards['" + this.board.id + "'].animate();", f)
    }
    return this
};
JXG.GeometryElement.prototype.update = function () {
    if (this.traced) {
        this.cloneToBackground(true)
    }
    return this
};
JXG.GeometryElement.prototype.updateRenderer = function () {};
JXG.GeometryElement.prototype.hideElement = function () {
    this.visProp.visible = false;
    this.board.renderer.hide(this);
    if (this.label != null && this.hasLabel) {
        this.label.hiddenByParent = true;
        if (this.label.content.visProp.visible) {
            this.board.renderer.hide(this.label.content)
        }
    }
    return this
};
JXG.GeometryElement.prototype.showElement = function () {
    this.visProp.visible = true;
    this.board.renderer.show(this);
    if (this.label != null && this.hasLabel && this.label.hiddenByParent) {
        this.label.hiddenByParent = false;
        if (this.label.content.visProp.visible) {
            this.board.renderer.show(this.label.content)
        }
    }
    return this
};
JXG.GeometryElement.prototype.setProperty = function () {
    var f, e, c, b, d, g;
    for (f = 0; f < arguments.length; f++) {
        b = arguments[f];
        if (typeof b == "string") {
            g = b.split(":");
            g[0] = g[0].replace(/^\s+/, "").replace(/\s+$/, "");
            g[1] = g[1].replace(/^\s+/, "").replace(/\s+$/, "")
        } else {
            if (!JXG.isArray(b)) {
                for (e in b) {
                    this.setProperty([e, b[e]])
                }
                return this
            } else {
                g = b
            }
        }
        if (g[1] == null) {
            continue
        }
        switch (g[0].replace(/\s+/g).toLowerCase()) {
        case "strokewidth":
            this.visProp.strokeWidth = g[1];
            this.visProp.highlightStrokeWidth = g[1];
            this.board.renderer.setObjectStrokeWidth(this, this.visProp.strokeWidth);
            break;
        case "strokecolor":
            c = g[1];
            if (c.length == "9" && c.substr(0, 1) == "#") {
                d = c.substr(7, 2);
                c = c.substr(0, 7)
            } else {
                d = "FF"
            }
            this.visProp.strokeColor = c;
            this.visProp.strokeOpacity = parseInt(d.toUpperCase(), 16) / 255;
            this.board.renderer.setObjectStrokeColor(this, this.visProp.strokeColor, this.visProp.strokeOpacity);
            break;
        case "fillcolor":
            c = g[1];
            if (c.length == "9" && c.substr(0, 1) == "#") {
                d = c.substr(7, 2);
                c = c.substr(0, 7)
            } else {
                d = "FF"
            }
            this.visProp.fillColor = c;
            this.visProp.fillOpacity = parseInt(d.toUpperCase(), 16) / 255;
            this.board.renderer.setObjectFillColor(this, this.visProp.fillColor, this.visProp.fillOpacity);
            break;
        case "highlightstrokewidth":
            this.visProp.highlightStrokeWidth = g[1];
            break;
        case "highlightstrokecolor":
            c = g[1];
            if (c.length == "9" && c.substr(0, 1) == "#") {
                d = c.substr(7, 2);
                c = c.substr(0, 7)
            } else {
                d = "FF"
            }
            this.visProp.highlightStrokeColor = c;
            this.visProp.highlightStrokeOpacity = parseInt(d.toUpperCase(), 16) / 255;
            break;
        case "highlightfillcolor":
            c = g[1];
            if (c.length == "9" && c.substr(0, 1) == "#") {
                d = c.substr(7, 2);
                c = c.substr(0, 7)
            } else {
                d = "FF"
            }
            this.visProp.highlightFillColor = c;
            this.visProp.highlightFillOpacity = parseInt(d.toUpperCase(), 16) / 255;
            break;
        case "fillopacity":
            this.visProp.fillOpacity = g[1];
            this.board.renderer.setObjectFillColor(this, this.visProp.fillColor, this.visProp.fillOpacity);
            break;
        case "strokeopacity":
            this.visProp.strokeOpacity = g[1];
            this.board.renderer.setObjectStrokeColor(this, this.visProp.strokeColor, this.visProp.strokeOpacity);
            break;
        case "highlightfillopacity":
            this.visProp.highlightFillOpacity = g[1];
            break;
        case "highlightstrokeopacity":
            this.visProp.highlightStrokeOpacity = g[1];
            break;
        case "labelcolor":
            c = g[1];
            if (c.length == "9" && c.substr(0, 1) == "#") {
                d = c.substr(7, 2);
                c = c.substr(0, 7)
            } else {
                d = "FF"
            }
            if (d == "00") {
                if (this.label != null && this.hasLabel) {
                    this.label.content.hideElement()
                }
            }
            if (this.label != null && this.hasLabel) {
                this.label.color = c;
                this.board.renderer.setObjectStrokeColor(this.label.content, c, d)
            }
            if (this.type == JXG.OBJECT_TYPE_TEXT) {
                this.visProp.strokeColor = c;
                this.board.renderer.setObjectStrokeColor(this, this.visProp.strokeColor, 1)
            }
            break;
        case "infoboxtext":
            if (typeof (g[1]) == "string") {
                this.infoboxText = g[1]
            } else {
                this.infoboxText = false
            }
            break;
        case "showinfobox":
            if (g[1] == "false" || g[1] == false) {
                this.showInfobox = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.showInfobox = true
                }
            }
            break;
        case "visible":
            if (g[1] == "false" || g[1] == false) {
                this.visProp.visible = false;
                this.hideElement()
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.visible = true;
                    this.showElement()
                }
            }
            break;
        case "dash":
            this.setDash(g[1]);
            break;
        case "trace":
            if (g[1] == "false" || g[1] == false) {
                this.traced = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.traced = true
                }
            }
            break;
        case "style":
            this.setStyle(1 * g[1]);
            break;
        case "face":
            if (this.elementClass == JXG.OBJECT_CLASS_POINT) {
                this.setFace(g[1])
            }
            break;
        case "size":
            if (this.elementClass == JXG.OBJECT_CLASS_POINT) {
                this.visProp.size = 1 * g[1];
                this.board.renderer.updatePoint(this)
            }
            break;
        case "fixed":
            this.fixed = ((g[1] == "false") || (g[1] == false)) ? false : true;
            break;
        case "frozen":
            this.frozen = ((g[1] == "false") || (g[1] == false)) ? false : true;
            break;
        case "shadow":
            if (g[1] == "false" || g[1] == false) {
                this.visProp.shadow = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.shadow = true
                }
            }
            this.board.renderer.setShadow(this);
            break;
        case "gradient":
            this.visProp.gradient = g[1];
            this.board.renderer.setGradient(this);
            break;
        case "gradientsecondcolor":
            c = g[1];
            if (c.length == "9" && c.substr(0, 1) == "#") {
                d = c.substr(7, 2);
                c = c.substr(0, 7)
            } else {
                d = "FF"
            }
            this.visProp.gradientSecondColor = c;
            this.visProp.gradientSecondOpacity = parseInt(d.toUpperCase(), 16) / 255;
            this.board.renderer.updateGradient(this);
            break;
        case "gradientsecondopacity":
            this.visProp.gradientSecondOpacity = g[1];
            this.board.renderer.updateGradient(this);
            break;
        case "draft":
            if (g[1] == "false" || g[1] == false) {
                if (this.visProp.draft == true) {
                    this.visProp.draft = false;
                    this.board.renderer.removeDraft(this)
                }
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.draft = true;
                    this.board.renderer.setDraft(this)
                }
            }
            break;
        case "straightfirst":
            if (g[1] == "false" || g[1] == false) {
                this.visProp.straightFirst = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.straightFirst = true
                }
            }
            this.setStraight(this.visProp.straightFirst, this.visProp.straightLast);
            break;
        case "straightlast":
            if (g[1] == "false" || g[1] == false) {
                this.visProp.straightLast = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.straightLast = true
                }
            }
            this.setStraight(this.visProp.straightFirst, this.visProp.straightLast);
            break;
        case "firstarrow":
            if (g[1] == "false" || g[1] == false) {
                this.visProp.firstArrow = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.firstArrow = true
                }
            }
            this.setArrow(this.visProp.firstArrow, this.visProp.lastArrow);
            break;
        case "lastarrow":
            if (g[1] == "false" || g[1] == false) {
                this.visProp.lastArrow = false
            } else {
                if (g[1] == "true" || g[1] == true) {
                    this.visProp.lastArrow = true
                }
            }
            this.setArrow(this.visProp.firstArrow, this.visProp.lastArrow);
            break;
        case "curvetype":
            this.curveType = g[1];
            break;
        case "fontsize":
            this.visProp.fontSize = g[1];
            break;
        case "insertticks":
            if (this.type == JXG.OBJECT_TYPE_TICKS) {
                var a = this.insertTicks;
                this.insertTicks = true;
                if (g[1] == "false" || g[1] == false) {
                    this.insertTicks = false
                }
                if (a != this.insertTicks) {
                    this.calculateTicksCoordinates()
                }
            }
            break;
        case "drawlabels":
            if (this.type == JXG.OBJECT_TYPE_TICKS) {
                var a = this.drawLabels;
                this.drawLabels = true;
                if (g[1] == "false" || g[1] == false) {
                    this.drawLabels = false
                }
                if (a != this.drawLabels) {
                    this.calculateTicksCoordinates()
                }
            }
            break;
        case "drawzero":
            if (this.type == JXG.OBJECT_TYPE_TICKS) {
                var a = this.drawZero;
                this.drawZero = true;
                if (g[1] == "false" || g[1] == false) {
                    this.drawZero = false
                }
                if (a != this.drawZero) {
                    this.calculateTicksCoordinates()
                }
            }
            break;
        case "minorticks":
            if (this.type == JXG.OBJECT_TYPE_TICKS) {
                var a = this.minorTicks;
                if ((g[1] != null) && (g[1] > 0)) {
                    this.minorTicks = g[1]
                }
                if (a != this.minorTicks) {
                    this.calculateTicksCoordinates()
                }
            }
            break;
        case "majortickheight":
            if (this.type == JXG.OBJECT_TYPE_TICKS) {
                var a = this.majorHeight;
                if ((g[1] != null) && (g[1] > 0)) {
                    this.majorHeight = g[1]
                }
                if (a != this.majorHeight) {
                    this.calculateTicksCoordinates()
                }
            }
            break;
        case "minortickheight":
            if (this.type == JXG.OBJECT_TYPE_TICKS) {
                var a = this.minorHeight;
                if ((g[1] != null) && (g[1] > 0)) {
                    this.minorHeight = g[1]
                }
                if (a != this.minorHeight) {
                    this.calculateTicksCoordinates()
                }
            }
            break;
        case "snapwidth":
            if (this.type == JXG.OBJECT_TYPE_GLIDER) {
                this.snapWidth = g[1]
            }
            break;
        case "withlabel":
            if (!g[1]) {
                if (this.label != null && this.hasLabel) {
                    this.label.content.hideElement()
                }
            } else {
                if (this.label != null && this.hasLabel) {
                    if (this.visProp.visible) {
                        this.label.content.showElement()
                    }
                } else {
                    this.addLabelToElement();
                    if (!this.visProp.visible) {
                        this.label.content.hideElement()
                    }
                }
            }
            this.hasLabel = g[1]
        }
    }
    return this
};
JXG.GeometryElement.prototype.setDash = function (a) {
    this.visProp.dash = a;
    this.board.renderer.setDashStyle(this, this.visProp);
    return this
};
JXG.GeometryElement.prototype.prepareUpdate = function () {
    this.needsUpdate = true;
    return this
};
JXG.GeometryElement.prototype.remove = function () {
    this.board.renderer.remove(this.board.renderer.getElementById(this.id));
    if (this.hasLabel) {
        this.board.renderer.remove(this.board.renderer.getElementById(this.label.content.id))
    }
    return this
};
JXG.GeometryElement.prototype.getTextAnchor = function () {
    return new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], this.board)
};
JXG.GeometryElement.prototype.getLabelAnchor = function () {
    return new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], this.board)
};
JXG.GeometryElement.prototype.setStyle = function (a) {
    return this
};
JXG.GeometryElement.prototype.setStraight = function (a, b) {
    return this
};
JXG.GeometryElement.prototype.setArrow = function (b, a) {
    this.visProp.firstArrow = b;
    this.visProp.lastArrow = a;
    this.prepareUpdate().update();
    return this
};
JXG.GeometryElement.prototype.createLabel = function (b, c) {
    var a = false;
    if (typeof c == "undefined" || c == null) {
        c = [10, 10]
    }
    this.nameHTML = this.board.algebra.replaceSup(this.board.algebra.replaceSub(this.name));
    this.label = {};
    if (typeof b == "undefined" || b == true) {
        if (this.board.objects[this.id] == null) {
            this.board.objects[this.id] = this;
            a = true
        }
        this.label.relativeCoords = c;
        this.label.content = new JXG.Text(this.board, this.nameHTML, this.id, [this.label.relativeCoords[0], -this.label.relativeCoords[1]], this.id + "Label", "", null, true, this.board.options.text.defaultDisplay);
        if (a) {
            delete(this.board.objects[this.id])
        }
        this.label.color = "#000000";
        if (!this.visProp.visible) {
            this.label.hiddenByParent = true;
            this.label.content.visProp.visible = false
        }
        this.hasLabel = true
    }
    return this
};
JXG.GeometryElement.prototype.addLabelToElement = function () {
    this.createLabel(true);
    this.label.content.id = this.id + "Label";
    this.board.addText(this.label.content);
    this.board.renderer.drawText(this.label.content);
    if (!this.label.content.visProp.visible) {
        this.board.renderer.hide(this.label.content)
    }
    return this
};
JXG.GeometryElement.prototype.highlight = function () {
    this.board.renderer.highlight(this);
    return this
};
JXG.GeometryElement.prototype.noHighlight = function () {
    this.board.renderer.noHighlight(this);
    return this
};
JXG.GeometryElement.prototype.clearTrace = function () {
    var a;
    for (a in this.traces) {
        this.board.renderer.remove(this.traces[a])
    }
    this.numTraces = 0;
    return this
};
JXG.GeometryElement.prototype.cloneToBackground = function (a) {
    return this
};
JXG.GeometryElement.prototype.normalize = function () {
    this.stdform = this.board.algebra.normalize(this.stdform);
    return this
};
JXG.GeometryElement.prototype.toJSON = function () {
    var b = '{"name":' + this.name;
    b += ', "id":' + this.id;
    var c = [];
    for (var a in this.visProp) {
        if (this.visProp[a] != null) {
            c.push('"' + a + '":' + this.visProp[a])
        }
    }
    b += ', "visProp":{' + c.toString() + "}";
    b += "}";
    return b
};
JXG.GeometryElement.prototype.highlightStrokeColor = function (a) {
    this.setProperty({
        highlightStrokeColor: a
    })
};
JXG.GeometryElement.prototype.strokeColor = function (a) {
    this.setProperty({
        strokeColor: a
    })
};
JXG.GeometryElement.prototype.strokeWidth = function (a) {
    this.setProperty({
        strokeWidth: a
    })
};
JXG.GeometryElement.prototype.fillColor = function (a) {
    this.setProperty({
        fillColor: a
    })
};
JXG.GeometryElement.prototype.highlightFillColor = function (a) {
    this.setProperty({
        highlightFillColor: a
    })
};
JXG.GeometryElement.prototype.labelColor = function (a) {
    this.setProperty({
        labelColor: a
    })
};
JXG.GeometryElement.prototype.dash = function (a) {
    this.setProperty({
        dash: a
    })
};
JXG.GeometryElement.prototype.visible = function (a) {
    this.setProperty({
        visible: a
    })
};
JXG.GeometryElement.prototype.shadow = function (a) {
    this.setProperty({
        shadow: a
    })
};
JXG.clearVisPropOld = function (a) {
    a.visPropOld = {};
    a.visPropOld.strokeColor = "";
    a.visPropOld.strokeOpacity = "";
    a.visPropOld.strokeWidth = "";
    a.visPropOld.fillColor = "";
    a.visPropOld.fillOpacity = "";
    a.visPropOld.shadow = false;
    a.visPropOld.firstArrow = false;
    a.visPropOld.lastArrow = false
};
JXG.COORDS_BY_USER = 1;
JXG.COORDS_BY_SCREEN = 2;
JXG.Coords = function (c, b, a) {
    this.board = a;
    this.usrCoords = [];
    this.scrCoords = [];
    if (c == JXG.COORDS_BY_USER) {
        if (b.length <= 2) {
            this.usrCoords[0] = 1;
            this.usrCoords[1] = b[0];
            this.usrCoords[2] = b[1]
        } else {
            this.usrCoords[0] = b[0];
            this.usrCoords[1] = b[1];
            this.usrCoords[2] = b[2];
            this.normalizeUsrCoords()
        }
        this.usr2screen()
    } else {
        this.scrCoords[0] = 1;
        this.scrCoords[1] = b[0];
        this.scrCoords[2] = b[1];
        this.screen2usr()
    }
};
JXG.Coords.prototype.normalizeUsrCoords = function () {
    var a = 0.000001;
    if (Math.abs(this.usrCoords[0]) > a) {
        this.usrCoords[1] /= this.usrCoords[0];
        this.usrCoords[2] /= this.usrCoords[0];
        this.usrCoords[0] = 1
    }
};
JXG.Coords.prototype.usr2screen = function (f) {
    var e = Math.round,
        a = this.board,
        d = this.usrCoords,
        c = this.board.origin.scrCoords;
    if (f == null || f) {
        this.scrCoords[0] = e(d[0]);
        this.scrCoords[1] = e(d[0] * c[1] + d[1] * a.stretchX);
        this.scrCoords[2] = e(d[0] * c[2] - d[2] * a.stretchY)
    } else {
        this.scrCoords[0] = d[0];
        this.scrCoords[1] = d[0] * c[1] + d[1] * a.stretchX;
        this.scrCoords[2] = d[0] * c[2] - d[2] * a.stretchY
    }
};
JXG.Coords.prototype.screen2usr = function () {
    var d = this.board.origin.scrCoords,
        c = this.scrCoords,
        a = this.board;
    this.usrCoords[0] = 1;
    this.usrCoords[1] = (c[1] - d[1]) / a.stretchX;
    this.usrCoords[2] = (d[2] - c[2]) / a.stretchY
};
JXG.Coords.prototype.distance = function (b, e) {
    var d = 0,
        k, a = this.usrCoords,
        h = this.scrCoords,
        g;
    if (b == JXG.COORDS_BY_USER) {
        k = e.usrCoords;
        g = a[0] - k[0];
        d = g * g;
        g = a[1] - k[1];
        d += g * g;
        g = a[2] - k[2];
        d += g * g
    } else {
        k = e.scrCoords;
        g = h[0] - k[0];
        d = g * g;
        g = h[1] - k[1];
        d += g * g;
        g = h[2] - k[2];
        d += g * g
    }
    return Math.sqrt(d)
};
JXG.Coords.prototype.setCoordinates = function (e, c, b) {
    var a = this.usrCoords,
        d = this.scrCoords;
    if (e == JXG.COORDS_BY_USER) {
        if (c.length == 2) {
            a[0] = 1;
            a[1] = c[0];
            a[2] = c[1]
        } else {
            a[0] = c[0];
            a[1] = c[1];
            a[2] = c[2];
            this.normalizeUsrCoords()
        }
        this.usr2screen(b)
    } else {
        d[1] = c[0];
        d[2] = c[1];
        this.screen2usr()
    }
};
JXG.POINT_STYLE_X_SMALL = 0;
JXG.POINT_STYLE_X = 1;
JXG.POINT_STYLE_X_BIG = 2;
JXG.POINT_STYLE_CIRCLE_TINY = 3;
JXG.POINT_STYLE_CIRCLE_SMALL = 4;
JXG.POINT_STYLE_CIRCLE = 5;
JXG.POINT_STYLE_CIRCLE_BIG = 6;
JXG.POINT_STYLE_SQUARE_SMALL = 7;
JXG.POINT_STYLE_SQUARE = 8;
JXG.POINT_STYLE_SQUARE_BIG = 9;
JXG.POINT_STYLE_PLUS_SMALL = 10;
JXG.POINT_STYLE_PLUS = 11;
JXG.POINT_STYLE_PLUS_BIG = 12;
JXG.Point = function (e, f, g, b, a, d, c) {
    this.constructor();
    this.type = JXG.OBJECT_TYPE_POINT;
    this.elementClass = JXG.OBJECT_CLASS_POINT;
    this.init(e, g, b);
    if (f == null) {
        f = [0, 0]
    }
    this.coords = new JXG.Coords(JXG.COORDS_BY_USER, f, this.board);
    this.initialCoords = new JXG.Coords(JXG.COORDS_BY_USER, f, this.board);
    if (c == null) {
        c = e.options.layer.point
    }
    this.layer = c;
    this.showInfobox = true;
    this.label = {};
    this.label.relativeCoords = [10, -10];
    this.nameHTML = this.board.algebra.replaceSup(this.board.algebra.replaceSub(this.name));
    if (typeof d == "undefined" || d == true) {
        this.board.objects[this.id] = this;
        this.label.content = new JXG.Text(this.board, this.nameHTML, this.id, this.label.relativeCoords, this.id + "Label", "", null, true, this.board.options.text.defaultDisplay);
        delete(this.board.objects[this.id]);
        this.label.color = "#000000";
        if (!a) {
            this.label.hiddenByParent = true;
            this.label.content.visProp.visible = false
        }
        this.hasLabel = true
    } else {
        this.showInfobox = false
    }
    this.fixed = false;
    this.position = null;
    this.onPolygon = false;
    this.visProp.style = this.board.options.point.style;
    this.visProp.face = this.board.options.point.face;
    this.visProp.size = this.board.options.point.size;
    this.visProp.fillColor = this.board.options.point.fillColor;
    this.visProp.highlightFillColor = this.board.options.point.highlightFillColor;
    this.visProp.strokeColor = this.board.options.point.strokeColor;
    this.visProp.highlightStrokeColor = this.board.options.point.highlightStrokeColor;
    this.visProp.strokeWidth = this.board.options.point.strokeWidth;
    this.visProp.visible = a;
    this.slideObject = null;
    this.group = [];
    this.id = this.board.addPoint(this)
};
JXG.Point.prototype = new JXG.GeometryElement();
JXG.Point.prototype.hasPoint = function (b, d) {
    var a = this.coords.scrCoords,
        c;
    c = this.visProp.size;
    if (c < this.board.options.precision.hasPoint) {
        c = this.board.options.precision.hasPoint
    }
    return ((Math.abs(a[1] - b) < c + 2) && (Math.abs(a[2] - d)) < c + 2)
};
JXG.Point.prototype.updateConstraint = function () {
    return this
};
JXG.Point.prototype.update = function (e) {
    if (!this.needsUpdate) {
        return
    }
    if (typeof e == "undefined") {
        e = false
    }
    if (this.traced) {
        this.cloneToBackground(true)
    }
    if (this.type == JXG.OBJECT_TYPE_GLIDER) {
        if (this.slideObject.type == JXG.OBJECT_TYPE_CIRCLE) {
            if (e) {
                this.coords.setCoordinates(JXG.COORDS_BY_USER, [this.slideObject.midpoint.X() + Math.cos(this.position), this.slideObject.midpoint.Y() + Math.sin(this.position)]);
                this.coords = this.board.algebra.projectPointToCircle(this, this.slideObject)
            } else {
                this.coords = this.board.algebra.projectPointToCircle(this, this.slideObject);
                this.position = this.board.algebra.rad([this.slideObject.midpoint.X() + 1, this.slideObject.midpoint.Y()], this.slideObject.midpoint, this)
            }
        } else {
            if (this.slideObject.type == JXG.OBJECT_TYPE_LINE) {
                this.coords = this.board.algebra.projectPointToLine(this, this.slideObject);
                var d = this.slideObject.point1.coords;
                var h = this.slideObject.point2.coords;
                if (e) {
                    if (Math.abs(d.usrCoords[0]) >= JXG.Math.eps && Math.abs(h.usrCoords[0]) >= JXG.Math.eps) {
                        this.coords.setCoordinates(JXG.COORDS_BY_USER, [d.usrCoords[1] + this.position * (h.usrCoords[1] - d.usrCoords[1]), d.usrCoords[2] + this.position * (h.usrCoords[2] - d.usrCoords[2])])
                    }
                } else {
                    var k = 1;
                    var q = d.distance(JXG.COORDS_BY_USER, this.coords);
                    var b = d.distance(JXG.COORDS_BY_USER, h);
                    var g = h.distance(JXG.COORDS_BY_USER, this.coords);
                    if (((q > b) || (g > b)) && (q < g)) {
                        k = -1
                    }
                    this.position = k * q / b;
                    if (this.snapWidth != null && Math.abs(this._smax - this._smin) >= JXG.Math.eps) {
                        if (this.position < 0) {
                            this.position = 0
                        }
                        if (this.position > 1) {
                            this.position = 1
                        }
                        var r = this.position * (this._smax - this._smin) + this._smin;
                        r = Math.round(r / this.snapWidth) * this.snapWidth;
                        this.position = (r - this._smin) / (this._smax - this._smin);
                        this.update(true)
                    }
                }
                var c = this.slideObject.point1.coords.scrCoords;
                var n = this.slideObject.point2.coords.scrCoords;
                var f;
                if (this.slideObject.getSlope() == 0) {
                    f = 1
                } else {
                    f = 2
                }
                var l = this.coords.scrCoords[f];
                if (!this.slideObject.visProp.straightFirst) {
                    if (c[f] < n[f]) {
                        if (l < c[f]) {
                            this.coords = this.slideObject.point1.coords;
                            this.position = 0
                        }
                    } else {
                        if (c[f] > n[f]) {
                            if (l > c[f]) {
                                this.coords = this.slideObject.point1.coords;
                                this.position = 0
                            }
                        }
                    }
                }
                if (!this.slideObject.visProp.straightLast) {
                    if (c[f] < n[f]) {
                        if (l > n[f]) {
                            this.coords = this.slideObject.point2.coords;
                            this.position = 1
                        }
                    } else {
                        if (c[f] > n[f]) {
                            if (l < n[f]) {
                                this.coords = this.slideObject.point2.coords;
                                this.position = 1
                            }
                        }
                    }
                }
                if (this.onPolygon) {
                    var s = this.slideObject.point1.coords;
                    var m = this.slideObject.point2.coords;
                    if (Math.abs(this.coords.scrCoords[1] - s.scrCoords[1]) < this.board.options.precision.hasPoint && Math.abs(this.coords.scrCoords[2] - s.scrCoords[2]) < this.board.options.precision.hasPoint) {
                        var a = this.slideObject.parentPolygon;
                        for (var f = 0; f < a.borders.length; f++) {
                            if (this.slideObject == a.borders[f]) {
                                this.slideObject = a.borders[(f - 1 + a.borders.length) % a.borders.length];
                                break
                            }
                        }
                    } else {
                        if (Math.abs(this.coords.scrCoords[1] - m.scrCoords[1]) < this.board.options.precision.hasPoint && Math.abs(this.coords.scrCoords[2] - m.scrCoords[2]) < this.board.options.precision.hasPoint) {
                            var a = this.slideObject.parentPolygon;
                            for (var f = 0; f < a.borders.length; f++) {
                                if (this.slideObject == a.borders[f]) {
                                    this.slideObject = a.borders[(f + 1 + a.borders.length) % a.borders.length];
                                    break
                                }
                            }
                        }
                    }
                }
            } else {
                if (this.slideObject.type == JXG.OBJECT_TYPE_TURTLE) {
                    this.updateConstraint();
                    this.coords = this.board.algebra.projectPointToTurtle(this, this.slideObject)
                } else {
                    if (this.slideObject.elementClass == JXG.OBJECT_CLASS_CURVE) {
                        this.updateConstraint();
                        this.coords = this.board.algebra.projectPointToCurve(this, this.slideObject)
                    }
                }
            }
        }
    }
    if (this.type == JXG.OBJECT_TYPE_CAS) {
        this.updateConstraint()
    }
    this.updateTransform();
    this.needsUpdate = false;
    return this
};
JXG.Point.prototype.updateRenderer = function () {
    if (this.visProp.visible) {
        var a = this.isReal;
        this.isReal = (isNaN(this.coords.usrCoords[1] + this.coords.usrCoords[2])) ? false : true;
        this.isReal = (Math.abs(this.coords.usrCoords[0]) > this.board.algebra.eps) ? this.isReal : false;
        if (this.isReal) {
            if (a != this.isReal) {
                this.board.renderer.show(this);
                if (this.hasLabel && this.label.content.visProp.visible) {
                    this.board.renderer.show(this.label.content)
                }
            }
            this.board.renderer.updatePoint(this)
        } else {
            if (a != this.isReal) {
                this.board.renderer.hide(this);
                if (this.hasLabel && this.label.content.visProp.visible) {
                    this.board.renderer.hide(this.label.content)
                }
            }
        }
    }
    if (this.hasLabel && this.label.content.visProp.visible && this.isReal) {
        this.label.content.update();
        this.board.renderer.updateText(this.label.content)
    }
    return this
};
JXG.Point.prototype.X = function () {
    return this.coords.usrCoords[1]
};
JXG.Point.prototype.Y = function () {
    return this.coords.usrCoords[2]
};
JXG.Point.prototype.Z = function () {
    return this.coords.usrCoords[0]
};
JXG.Point.prototype.XEval = function () {
    return this.coords.usrCoords[1]
};
JXG.Point.prototype.YEval = function () {
    return this.coords.usrCoords[2]
};
JXG.Point.prototype.ZEval = function () {
    return this.coords.usrCoords[0]
};
JXG.Point.prototype.Dist = function (b) {
    var d, g = b.coords.usrCoords,
        a = this.coords.usrCoords,
        e;
    e = a[0] - g[0];
    d = e * e;
    e = a[1] - g[1];
    d += e * e;
    e = a[2] - g[2];
    d += e * e;
    return Math.sqrt(d)
};
JXG.Point.prototype.setPositionDirectly = function (a, g, e) {
    var d, k, h, c, b, f = this.coords;
    this.coords = new JXG.Coords(a, [g, e], this.board);
    if (this.group.length != 0) {
        k = this.coords.usrCoords[1] - f.usrCoords[1];
        h = this.coords.usrCoords[2] - f.usrCoords[2];
        for (d = 0; d < this.group.length; d++) {
            for (c in this.group[d].objects) {
                b = this.group[d].objects[c];
                b.initialCoords = new JXG.Coords(JXG.COORDS_BY_USER, [b.initialCoords.usrCoords[1] + k, b.initialCoords.usrCoords[2] + h], this.board)
            }
        }
        this.group[this.group.length - 1].dX = this.coords.scrCoords[1] - f.scrCoords[1];
        this.group[this.group.length - 1].dY = this.coords.scrCoords[2] - f.scrCoords[2];
        this.group[this.group.length - 1].update(this)
    } else {
        for (d = this.transformations.length - 1; d >= 0; d--) {
            this.initialCoords = new JXG.Coords(a, JXG.Math.matVecMult(JXG.Math.Numerics.Inverse(this.transformations[d].matrix), [1, g, e]), this.board)
        }
        this.update()
    }
    return this
};
JXG.Point.prototype.setPositionByTransform = function (e, a, d) {
    var c = this.coords;
    var b = this.board.create("transform", [a, d], {
        type: "translate"
    });
    if (this.transformations.length > 0 && this.transformations[this.transformations.length - 1].isNumericMatrix) {
        this.transformations[this.transformations.length - 1].melt(b)
    } else {
        this.addTransform(this, b)
    }
    if (this.group.length != 0) {} else {
        this.update()
    }
    return this
};
JXG.Point.prototype.setPosition = function (c, a, b) {
    this.setPositionDirectly(c, a, b);
    return this
};
JXG.Point.prototype.makeGlider = function (a) {
    this.slideObject = JXG.getReference(this.board, a);
    this.type = JXG.OBJECT_TYPE_GLIDER;
    this.snapWidth = null;
    this.slideObject.addChild(this);
    if (this.slideObject.elementClass == JXG.OBJECT_CLASS_LINE) {
        this.generatePolynomial = function () {
            return this.slideObject.generatePolynomial(this)
        }
    } else {
        if (this.slideObject.elementClass == JXG.OBJECT_CLASS_CIRCLE) {
            this.generatePolynomial = function () {
                return this.slideObject.generatePolynomial(this)
            }
        }
    }
    this.needsUpdate = true;
    this.update();
    return this
};
JXG.Point.prototype.addConstraint = function (e) {
    this.type = JXG.OBJECT_TYPE_CAS;
    var f = this.board.elementsByName;
    var g = [];
    var a;
    for (var d = 0; d < e.length; d++) {
        var b = e[d];
        if (typeof b == "string") {
            var c = this.board.algebra.geonext2JS(b);
            g[d] = new Function("", "return " + c + ";")
        } else {
            if (typeof b == "function") {
                g[d] = b
            } else {
                if (typeof b == "number") {
                    g[d] = function (h) {
                        return function () {
                            return h
                        }
                    }(b)
                } else {
                    if (typeof b == "object" && typeof b.Value == "function") {
                        g[d] = (function (h) {
                            return function () {
                                return h.Value()
                            }
                        })(b)
                    }
                }
            }
        }
    }
    if (e.length == 1) {
        this.updateConstraint = function () {
            var h = g[0]();
            if (JXG.isArray(h)) {
                this.coords.setCoordinates(JXG.COORDS_BY_USER, h)
            } else {
                this.coords = h
            }
        }
    } else {
        if (e.length == 2) {
            this.XEval = g[0];
            this.YEval = g[1];
            a = "this.coords.setCoordinates(JXG.COORDS_BY_USER,[this.XEval(),this.YEval()]);";
            this.updateConstraint = new Function("", a)
        } else {
            this.ZEval = g[0];
            this.XEval = g[1];
            this.YEval = g[2];
            a = "this.coords.setCoordinates(JXG.COORDS_BY_USER,[this.ZEval(),this.XEval(),this.YEval()]);";
            this.updateConstraint = new Function("", a)
        }
    }
    if (!this.board.isSuspendedUpdate) {
        this.update()
    }
    return this
};
JXG.Point.prototype.updateTransform = function () {
    if (this.transformations.length == 0 || this.baseElement == null) {
        return
    }
    var b, a;
    if (this === this.baseElement) {
        b = this.transformations[0].apply(this.baseElement, "self")
    } else {
        b = this.transformations[0].apply(this.baseElement)
    }
    this.coords.setCoordinates(JXG.COORDS_BY_USER, b);
    for (a = 1; a < this.transformations.length; a++) {
        this.coords.setCoordinates(JXG.COORDS_BY_USER, this.transformations[a].apply(this))
    }
    return this
};
JXG.Point.prototype.addTransform = function (d, b) {
    var e, c, a;
    if (this.transformations.length == 0) {
        this.baseElement = d
    }
    if (JXG.isArray(b)) {
        e = b
    } else {
        e = [b]
    }
    a = e.length;
    for (c = 0; c < a; c++) {
        this.transformations.push(e[c])
    }
    return this
};
JXG.Point.prototype.startAnimation = function (a, b) {
    if ((this.type == JXG.OBJECT_TYPE_GLIDER) && (typeof this.intervalCode == "undefined")) {
        this.intervalCode = window.setInterval("JXG.JSXGraph.boards['" + this.board.id + "'].objects['" + this.id + "']._anim(" + a + ", " + b + ")", 250);
        if (typeof this.intervalCount == "undefined") {
            this.intervalCount = 0
        }
    }
    return this
};
JXG.Point.prototype.stopAnimation = function () {
    if (typeof this.intervalCode != "undefined") {
        window.clearInterval(this.intervalCode);
        delete(this.intervalCode)
    }
    return this
};
JXG.Point.prototype.moveTo = function (g, c) {
    if (typeof c == "undefined" || c == 0) {
        this.setPosition(JXG.COORDS_BY_USER, g[0], g[1]);
        this.board.update(this);
        return this
    }
    var h = 35,
        k = Math.ceil(c / (h * 1)),
        l = new Array(k + 1),
        b = this.coords.usrCoords[1],
        a = this.coords.usrCoords[2],
        e = (g[0] - b),
        d = (g[1] - a),
        f;
    if (Math.abs(e) < JXG.Math.eps && Math.abs(d) < JXG.Math.eps) {
        return this
    }
    for (f = k; f >= 0; f--) {
        l[k - f] = [b + e * Math.sin((f / (k * 1)) * Math.PI / 2), a + d * Math.sin((f / (k * 1)) * Math.PI / 2)]
    }
    this.animationPath = l;
    this.board.animationObjects[this.id] = this;
    if (typeof this.board.animationIntervalCode == "undefined") {
        this.board.animationIntervalCode = window.setInterval("JXG.JSXGraph.boards['" + this.board.id + "'].animate();", h)
    }
    return this
};
JXG.Point.prototype.visit = function (k, d, b) {
    if (arguments.length == 2) {
        b = 1
    }
    var l = 35,
        m = Math.ceil(d / (l * 1)),
        n = new Array(b * (m + 1)),
        c = this.coords.usrCoords[1],
        a = this.coords.usrCoords[2],
        g = (k[0] - c),
        e = (k[1] - a),
        h, f;
    for (f = 0; f < b; f++) {
        for (h = m; h >= 0; h--) {
            n[f * (m + 1) + m - h] = [c + g * Math.pow(Math.sin((h / (m * 1)) * Math.PI), 2), a + e * Math.pow(Math.sin((h / (m * 1)) * Math.PI), 2)]
        }
    }
    this.animationPath = n;
    this.board.animationObjects[this.id] = this;
    if (typeof this.board.animationIntervalCode == "undefined") {
        this.board.animationIntervalCode = window.setInterval("JXG.JSXGraph.boards['" + this.board.id + "'].animate();", l)
    }
    return this
};
JXG.Point.prototype._anim = function (m, f) {
    var b, k, g, e, d, c, l = 1,
        a, h;
    this.intervalCount++;
    if (this.intervalCount > f) {
        this.intervalCount = 0
    }
    if (this.slideObject.elementClass == JXG.OBJECT_CLASS_LINE) {
        b = this.slideObject.point1.coords.distance(JXG.COORDS_BY_SCREEN, this.slideObject.point2.coords);
        k = this.slideObject.getSlope();
        if (k != "INF") {
            d = Math.atan(k);
            g = Math.round((this.intervalCount / f) * b * Math.cos(d));
            e = Math.round((this.intervalCount / f) * b * Math.sin(d))
        } else {
            g = 0;
            e = Math.round((this.intervalCount / f) * b)
        }
        if (m < 0) {
            c = this.slideObject.point2;
            if (this.slideObject.point2.coords.scrCoords[1] - this.slideObject.point1.coords.scrCoords[1] > 0) {
                l = -1
            } else {
                if (this.slideObject.point2.coords.scrCoords[1] - this.slideObject.point1.coords.scrCoords[1] == 0) {
                    if (this.slideObject.point2.coords.scrCoords[2] - this.slideObject.point1.coords.scrCoords[2] > 0) {
                        l = -1
                    }
                }
            }
        } else {
            c = this.slideObject.point1;
            if (this.slideObject.point1.coords.scrCoords[1] - this.slideObject.point2.coords.scrCoords[1] > 0) {
                l = -1
            } else {
                if (this.slideObject.point1.coords.scrCoords[1] - this.slideObject.point2.coords.scrCoords[1] == 0) {
                    if (this.slideObject.point1.coords.scrCoords[2] - this.slideObject.point2.coords.scrCoords[2] > 0) {
                        l = -1
                    }
                }
            }
        }
        this.coords.setCoordinates(JXG.COORDS_BY_SCREEN, [c.coords.scrCoords[1] + l * g, c.coords.scrCoords[2] + l * e])
    } else {
        if (this.slideObject.elementClass == JXG.OBJECT_CLASS_CURVE) {
            if (m > 0) {
                a = Math.round(this.intervalCount / f * this.board.canvasWidth)
            } else {
                a = Math.round((f - this.intervalCount) / f * this.board.canvasWidth)
            }
            this.coords.setCoordinates(JXG.COORDS_BY_SCREEN, [a, 0]);
            this.coords = this.board.algebra.projectPointToCurve(this, this.slideObject)
        } else {
            if (this.slideObject.elementClass == JXG.OBJECT_CLASS_CIRCLE) {
                if (m < 0) {
                    d = this.intervalCount / f * 2 * Math.PI
                } else {
                    d = (f - this.intervalCount) / f * 2 * Math.PI
                }
                h = this.slideObject.Radius();
                this.coords.setCoordinates(JXG.COORDS_BY_USER, [this.slideObject.midpoint.coords.usrCoords[1] + h * Math.cos(d), this.slideObject.midpoint.coords.usrCoords[2] + h * Math.sin(d)])
            }
        }
    }
    this.board.update(this);
    return this
};
JXG.Point.prototype.setStyle = function (a) {
    if (a == 0 || a == 1 || a == 2) {
        this.visProp.face = "cross";
        if (a == 0) {
            this.visProp.size = 2
        } else {
            if (a == 1) {
                this.visProp.size = 3
            } else {
                this.visProp.size = 4
            }
        }
    } else {
        if (a == 3 || a == 4 || a == 5 || a == 6) {
            this.visProp.face = "circle";
            if (a == 3) {
                this.visProp.size = 1
            } else {
                if (a == 4) {
                    this.visProp.size = 2
                } else {
                    if (a == 5) {
                        this.visProp.size = 3
                    } else {
                        this.visProp.size = 4
                    }
                }
            }
        } else {
            if (a == 7 || a == 8 || a == 9) {
                this.visProp.face = "square";
                if (a == 7) {
                    this.visProp.size = 2
                } else {
                    if (a == 8) {
                        this.visProp.size = 3
                    } else {
                        this.visProp.size = 4
                    }
                }
            } else {
                if (a == 10 || a == 11 || a == 12) {
                    this.visProp.face = "plus";
                    if (a == 10) {
                        this.visProp.size = 2
                    } else {
                        if (a == 11) {
                            this.visProp.size = 3
                        } else {
                            this.visProp.size = 4
                        }
                    }
                }
            }
        }
    }
    this.board.renderer.changePointStyle(this);
    return this
};
JXG.Point.prototype.setFace = function (a) {
    a = a.toLowerCase();
    if (a == "cross" || a == "x" || a == "plus" || a == "+" || a == "circle" || a == "o" || a == "square" || a == "[]" || a == "diamond" || a == "<>" || a == "triangleup" || a == "a" || a == "triangledown" || a == "v" || a == "triangleleft" || a == "<" || a == "triangleright" || a == ">") {
        this.visProp.face = a
    } else {
        this.visProp.face = "circle"
    }
    this.board.renderer.changePointStyle(this);
    return this
};
JXG.Point.prototype.remove = function () {
    if (this.hasLabel) {
        this.board.renderer.remove(this.board.renderer.getElementById(this.label.content.id))
    }
    this.board.renderer.remove(this.board.renderer.getElementById(this.id))
};
JXG.Point.prototype.getTextAnchor = function () {
    return this.coords
};
JXG.Point.prototype.getLabelAnchor = function () {
    return this.coords
};
JXG.Point.prototype.face = function (a) {
    this.setProperty({
        face: a
    })
};
JXG.Point.prototype.size = function (a) {
    this.setProperty({
        size: a
    })
};
JXG.Point.prototype.cloneToBackground = function (a) {
    var b = {};
    b.id = this.id + "T" + this.numTraces;
    this.numTraces++;
    b.coords = this.coords;
    b.visProp = this.visProp;
    b.elementClass = JXG.OBJECT_CLASS_POINT;
    JXG.clearVisPropOld(b);
    this.board.renderer.drawPoint(b);
    this.traces[b.id] = document.getElementById(b.id);
    delete b;
    return this
};
JXG.createPoint = function (f, c, g) {
    var e, b = false,
        d, a;
    g = JXG.checkAttributes(g, {
        withLabel: JXG.readOption(f.options, "point", "withLabel"),
        layer: null
    });
    a = (typeof g.visible == "undefined") || JXG.str2Bool(g.visible);
    for (d = 0; d < c.length; d++) {
        if (typeof c[d] == "function" || typeof c[d] == "string") {
            b = true
        }
    }
    if (!b) {
        if ((JXG.isNumber(c[0])) && (JXG.isNumber(c[1]))) {
            e = new JXG.Point(f, c, g.id, g.name, a, g.withLabel, g.layer);
            if (g.slideObject != null) {
                e.makeGlider(g.slideObject)
            } else {
                e.baseElement = e
            }
        } else {
            if ((typeof c[0] == "object") && (typeof c[1] == "object")) {
                e = new JXG.Point(f, [0, 0], g.id, g.name, a, g.withLabel, g.layer);
                e.addTransform(c[0], c[1])
            } else {
                throw new Error("JSXGraph: Can't create point with parent types '" + (typeof c[0]) + "' and '" + (typeof c[1]) + "'.")
            }
        }
    } else {
        e = new JXG.Point(f, [0, 0], g.id, g.name, a, g.withLabel, g.layer);
        e.addConstraint(c)
    }
    return e
};
JXG.createGlider = function (d, b, e) {
    var c, a;
    e = JXG.checkAttributes(e, {
        withLabel: JXG.readOption(d.options, "point", "withLabel"),
        layer: null
    });
    a = (typeof e.visible == "undefined") || JXG.str2Bool(e.visible);
    if (b.length == 1) {
        c = new JXG.Point(d, [0, 0], e.id, e.name, a, e.withLabel)
    } else {
        c = d.create("point", b.slice(0, -1), e)
    }
    c.makeGlider(b[b.length - 1]);
    return c
};
JXG.createIntersectionPoint = function (d, b, a) {
    var c;
    if (b.length >= 3) {
        if (b.length == 3) {
            b.push(null)
        }
        c = d.create("point", [d.intersection(b[0], b[1], b[2], b[3])], a)
    }
    b[0].addChild(c);
    b[1].addChild(c);
    c.generatePolynomial = function () {
        var e = b[0].generatePolynomial(c);
        var f = b[1].generatePolynomial(c);
        if ((e.length == 0) || (f.length == 0)) {
            return []
        } else {
            return [e[0], f[0]]
        }
    };
    return c
};
JXG.createOtherIntersectionPoint = function (d, b, a) {
    var c;
    if (b.length != 3 || !JXG.isPoint(b[2]) || (b[0].elementClass != JXG.OBJECT_CLASS_LINE && b[0].elementClass != JXG.OBJECT_CLASS_CIRCLE) || (b[1].elementClass != JXG.OBJECT_CLASS_LINE && b[1].elementClass != JXG.OBJECT_CLASS_CIRCLE)) {
        throw new Error("JSXGraph: Can't create 'other intersection point' with parent types '" + (typeof b[0]) + "',  '" + (typeof b[1]) + "'and  '" + (typeof b[2]) + "'.")
    } else {
        c = d.create("point", [d.otherIntersection(b[0], b[1], b[2])], a)
    }
    b[0].addChild(c);
    b[1].addChild(c);
    c.generatePolynomial = function () {
        var e = b[0].generatePolynomial(c);
        var f = b[1].generatePolynomial(c);
        if ((e.length == 0) || (f.length == 0)) {
            return []
        } else {
            return [e[0], f[0]]
        }
    };
    return c
};
JXG.JSXGraph.registerElement("point", JXG.createPoint);
JXG.JSXGraph.registerElement("glider", JXG.createGlider);
JXG.JSXGraph.registerElement("intersection", JXG.createIntersectionPoint);
JXG.JSXGraph.registerElement("otherintersection", JXG.createOtherIntersectionPoint);
JXG.Line = function (d, f, e, g, a, c, b) {
    this.constructor();
    this.type = JXG.OBJECT_TYPE_LINE;
    this.elementClass = JXG.OBJECT_CLASS_LINE;
    this.init(d, g, a);
    if (b == null) {
        b = d.options.layer.line
    }
    this.layer = b;
    this.point1 = JXG.getReference(this.board, f);
    this.point2 = JXG.getReference(this.board, e);
    this.image = null;
    this.imageTransformMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    this.visProp.fillColor = this.board.options.line.fillColor;
    this.visProp.highlightFillColor = this.board.options.line.highlightFillColor;
    this.visProp.strokeColor = this.board.options.line.strokeColor;
    this.visProp.highlightStrokeColor = this.board.options.line.highlightStrokeColor;
    this.visProp.straightFirst = this.board.options.line.straightFirst;
    this.visProp.straightLast = this.board.options.line.straightLast;
    this.visProp.visible = true;
    this.visProp.firstArrow = this.board.options.line.firstArrow;
    this.visProp.lastArrow = this.board.options.line.lastArrow;
    this.ticks = [];
    this.defaultTicks = null;
    this.parentPolygon = null;
    this.labelOffsets = [].concat(this.board.options.line.labelOffsets);
    this.labelOffsets[0] = Math.abs(this.labelOffsets[0]);
    this.labelOffsets[1] = Math.abs(this.labelOffsets[1]);
    this.createLabel(c);
    this.id = this.board.addLine(this);
    this.point1.addChild(this);
    this.point2.addChild(this);
    this.needsUpdate = true;
    this.update()
};
JXG.Line.prototype = new JXG.GeometryElement;
JXG.Line.prototype.hasPoint = function (k, g) {
    var f = [],
        r, n = [1, k, g],
        l = [],
        u, d, h, b, m, q, e, a;
    f[0] = this.stdform[0] - this.stdform[1] * this.board.origin.scrCoords[1] / this.board.stretchX + this.stdform[2] * this.board.origin.scrCoords[2] / this.board.stretchY;
    f[1] = this.stdform[1] / this.board.stretchX;
    f[2] = this.stdform[2] / (-this.board.stretchY);
    var l = [0, f[1], f[2]];
    l = JXG.Math.crossProduct(l, n);
    l = JXG.Math.crossProduct(l, f);
    l[1] /= l[0];
    l[2] /= l[0];
    l[0] = 1;
    r = (n[0] - l[0]) * (n[0] - l[0]) + (n[1] - l[1]) * (n[1] - l[1]) + (n[2] - l[2]) * (n[2] - l[2]);
    if (isNaN(r) || r > this.board.options.precision.hasPoint * this.board.options.precision.hasPoint) {
        return false
    }
    if (this.visProp.straightFirst && this.visProp.straightLast) {
        return true
    } else {
        b = this.point1.coords.scrCoords;
        m = this.point2.coords.scrCoords;
        a = (m[1] - b[1]) * (m[1] - b[1]) + (m[2] - b[2]) * (m[2] - b[2]);
        q = (l[1] - b[1]) * (l[1] - b[1]) + (l[2] - b[2]) * (l[2] - b[2]);
        e = (l[1] - m[1]) * (l[1] - m[1]) + (l[2] - m[2]) * (l[2] - m[2]);
        if ((q > a) || (e > a)) {
            if (q < e) {
                if (!this.visProp.straightFirst) {
                    return false
                }
            } else {
                if (!this.visProp.straightLast) {
                    return false
                }
            }
        }
        return true
    }
};
JXG.Line.prototype.update = function () {
    var a, b;
    if (this.constrained) {
        if (typeof this.funps != "undefined") {
            b = this.funps();
            this.point1 = b[0];
            this.point2 = b[1]
        } else {
            this.point1 = this.funp1();
            this.point2 = this.funp2()
        }
    }
    if (this.needsUpdate) {
        if (true || !this.board.geonextCompatibilityMode) {
            this.updateStdform()
        }
        for (a = 0; a < this.ticks.length; a++) {
            if (typeof this.ticks[a] != "undefined") {
                this.ticks[a].calculateTicksCoordinates()
            }
        }
    }
    if (this.traced) {
        this.cloneToBackground(true)
    }
};
JXG.Line.prototype.updateStdform = function () {
    var a = JXG.Math.crossProduct(this.point1.coords.usrCoords, this.point2.coords.usrCoords);
    this.stdform[0] = a[0];
    this.stdform[1] = a[1];
    this.stdform[2] = a[2];
    this.stdform[3] = 0;
    this.normalize()
};
JXG.Line.prototype.updateRenderer = function () {
    var a;
    if (this.needsUpdate && this.visProp.visible) {
        a = this.isReal;
        this.isReal = (isNaN(this.point1.coords.usrCoords[1] + this.point1.coords.usrCoords[2] + this.point2.coords.usrCoords[1] + this.point2.coords.usrCoords[2])) ? false : true;
        if (this.isReal) {
            if (a != this.isReal) {
                this.board.renderer.show(this);
                if (this.hasLabel && this.label.content.visProp.visible) {
                    this.board.renderer.show(this.label.content)
                }
            }
            this.board.renderer.updateLine(this)
        } else {
            if (a != this.isReal) {
                this.board.renderer.hide(this);
                if (this.hasLabel && this.label.content.visProp.visible) {
                    this.board.renderer.hide(this.label.content)
                }
            }
        }
        this.needsUpdate = false
    }
    if (this.hasLabel && this.label.content.visProp.visible && this.isReal) {
        this.label.content.update();
        this.board.renderer.updateText(this.label.content)
    }
};
JXG.Line.prototype.generatePolynomial = function (e) {
    var d = this.point1.symbolic.x,
        c = this.point1.symbolic.y,
        g = this.point2.symbolic.x,
        f = this.point2.symbolic.y,
        b = e.symbolic.x,
        a = e.symbolic.y;
    return [["(", c, ")*(", b, ")-(", c, ")*(", g, ")+(", a, ")*(", g, ")-(", d, ")*(", a, ")+(", d, ")*(", f, ")-(", b, ")*(", f, ")"].join("")]
};
JXG.Line.prototype.getRise = function () {
    if (Math.abs(this.stdform[2]) >= JXG.Math.eps) {
        return -this.stdform[0] / this.stdform[2]
    } else {
        return Infinity
    }
};
JXG.Line.prototype.getSlope = function () {
    if (Math.abs(this.stdform[2]) >= JXG.Math.eps) {
        return -this.stdform[1] / this.stdform[2]
    } else {
        return Infinity
    }
};
JXG.Line.prototype.setStraight = function (a, b) {
    this.visProp.straightFirst = a;
    this.visProp.straightLast = b;
    this.board.renderer.updateLine(this)
};
JXG.Line.prototype.getTextAnchor = function () {
    return new JXG.Coords(JXG.COORDS_BY_USER, [0.5 * (this.point2.X() - this.point1.X()), 0.5 * (this.point2.Y() - this.point1.Y())], this.board)
};
JXG.Line.prototype.setLabelRelativeCoords = function (a) {
    this.label.content.relativeCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [a[0], -a[1]], this.board)
};
JXG.Line.prototype.getLabelAnchor = function () {
    var e, c, b, d, a, f = this.labelOffsets[0],
        g = this.labelOffsets[1];
    if (!this.visProp.straightFirst && !this.visProp.straightLast) {
        this.setLabelRelativeCoords(this.labelOffsets);
        return new JXG.Coords(JXG.COORDS_BY_USER, [this.point2.X() - 0.5 * (this.point2.X() - this.point1.X()), this.point2.Y() - 0.5 * (this.point2.Y() - this.point1.Y())], this.board)
    } else {
        c = new JXG.Coords(JXG.COORDS_BY_USER, this.point1.coords.usrCoords, this.board);
        b = new JXG.Coords(JXG.COORDS_BY_USER, this.point2.coords.usrCoords, this.board);
        this.board.renderer.calcStraight(this, c, b);
        if (this.visProp.straightFirst) {
            e = c
        } else {
            e = b
        }
        if (this.label.content != null) {
            d = [0, 0];
            a = this.getSlope();
            if (e.scrCoords[2] == 0) {
                if (a == Infinity) {
                    d = [f, -g]
                } else {
                    if (a >= 0) {
                        d = [f, -g]
                    } else {
                        d = [-f, -g]
                    }
                }
            } else {
                if (e.scrCoords[2] == this.board.canvasHeight) {
                    if (a == Infinity) {
                        d = [f, g]
                    } else {
                        if (a >= 0) {
                            d = [-f, g]
                        } else {
                            d = [f, g]
                        }
                    }
                }
            }
            if (e.scrCoords[1] == 0) {
                if (a == Infinity) {
                    d = [f, g]
                } else {
                    if (a >= 0) {
                        d = [f, -g]
                    } else {
                        d = [f, g]
                    }
                }
            } else {
                if (e.scrCoords[1] == this.board.canvasWidth) {
                    if (a == Infinity) {
                        d = [-f, g]
                    } else {
                        if (a >= 0) {
                            d = [-f, g]
                        } else {
                            d = [-f, -g]
                        }
                    }
                }
            }
            this.setLabelRelativeCoords(d)
        }
        return e
    }
};
JXG.Line.prototype.cloneToBackground = function (b) {
    var d = {},
        c, a;
    d.id = this.id + "T" + this.numTraces;
    this.numTraces++;
    d.point1 = this.point1;
    d.point2 = this.point2;
    d.stdform = this.stdform;
    JXG.clearVisPropOld(d);
    d.board = {};
    d.board.unitX = this.board.unitX;
    d.board.unitY = this.board.unitY;
    d.board.zoomX = this.board.zoomX;
    d.board.zoomY = this.board.zoomY;
    d.board.stretchX = this.board.stretchX;
    d.board.stretchY = this.board.stretchY;
    d.board.origin = this.board.origin;
    d.board.canvasHeight = this.board.canvasHeight;
    d.board.canvasWidth = this.board.canvasWidth;
    d.board.dimension = this.board.dimension;
    d.board.algebra = this.board.algebra;
    d.visProp = this.visProp;
    a = this.getSlope();
    c = this.getRise();
    d.getSlope = function () {
        return a
    };
    d.getRise = function () {
        return c
    };
    this.board.renderer.enhancedRendering = true;
    this.board.renderer.drawLine(d);
    this.board.renderer.enhancedRendering = false;
    this.traces[d.id] = this.board.renderer.getElementById(d.id);
    delete d
};
JXG.Line.prototype.addTransform = function (a) {
    var c, b;
    if (JXG.isArray(a)) {
        c = a
    } else {
        c = [a]
    }
    for (b = 0; b < c.length; b++) {
        this.point1.transformations.push(c[b]);
        this.point2.transformations.push(c[b])
    }
};
JXG.Line.prototype.setPosition = function (d, a, c) {
    var b = this.board.create("transform", [a, c], {
        type: "translate"
    });
    if (this.point1.transformations.length > 0 && this.point1.transformations[this.point1.transformations.length - 1].isNumericMatrix) {
        this.point1.transformations[this.point1.transformations.length - 1].melt(b)
    } else {
        this.point1.addTransform(this.point1, b)
    }
    if (this.point2.transformations.length > 0 && this.point2.transformations[this.point2.transformations.length - 1].isNumericMatrix) {
        this.point2.transformations[this.point2.transformations.length - 1].melt(b)
    } else {
        this.point2.addTransform(this.point2, b)
    }
};
JXG.Line.prototype.X = function (k) {
    var n = this.stdform[1],
        m = this.stdform[2],
        l = this.stdform[0],
        g, f, d, e, h;
    k *= Math.PI;
    g = n * Math.cos(k) + m * Math.sin(k);
    f = l;
    d = Math.sqrt(g * g + f * f);
    e = -f / d;
    h = g / d;
    if (Math.abs(h) < this.board.algebra.eps) {
        h = 1
    }
    return e * Math.cos(k) / h
};
JXG.Line.prototype.Y = function (k) {
    var n = this.stdform[1],
        m = this.stdform[2],
        l = this.stdform[0],
        g, f, d, e, h;
    k *= Math.PI;
    g = n * Math.cos(k) + m * Math.sin(k);
    f = l;
    d = Math.sqrt(g * g + f * f);
    e = -f / d;
    h = g / d;
    if (Math.abs(h) < this.board.algebra.eps) {
        h = 1
    }
    return e * Math.sin(k) / h
};
JXG.Line.prototype.Z = function (h) {
    var f = this.stdform[1],
        e = this.stdform[2],
        m = this.stdform[0],
        d, l, g, k;
    h *= Math.PI;
    d = f * Math.cos(h) + e * Math.sin(h);
    l = m;
    g = Math.sqrt(d * d + l * l);
    k = d / g;
    if (Math.abs(k) >= this.board.algebra.eps) {
        return 1
    } else {
        return 0
    }
};
JXG.Line.prototype.minX = function () {
    return 0
};
JXG.Line.prototype.maxX = function () {
    return 1
};
JXG.Line.prototype.addTicks = function (a) {
    if (a.id == "" || typeof a.id == "undefined") {
        a.id = this.id + "_ticks_" + (this.ticks.length + 1)
    }
    this.board.renderer.drawTicks(a);
    this.ticks.push(a);
    this.ticks[this.ticks.length - 1].updateRenderer();
    return a.id
};
JXG.Line.prototype.removeAllTicks = function () {
    var a;
    for (a = this.ticks.length; a > 0; a--) {
        this.board.renderer.remove(this.ticks[a - 1].rendNode)
    }
    this.ticks = new Array()
};
JXG.Line.prototype.removeTicks = function (c) {
    var b, a;
    if (this.defaultTicks != null && this.defaultTicks == c) {
        this.defaultTicks = null
    }
    for (b = this.ticks.length; b > 0; b--) {
        if (this.ticks[b - 1] == c) {
            this.board.renderer.remove(this.ticks[b - 1].rendNode);
            for (a = 0; a < this.ticks[b - 1].ticks.length; a++) {
                if (this.ticks[b - 1].labels[a] != null) {
                    if (this.ticks[b - 1].labels[a].show) {
                        this.board.renderer.remove(this.ticks[b - 1].labels[a].rendNode)
                    }
                }
            }
            delete(this.ticks[b - 1])
        }
    }
};
JXG.createLine = function (g, k, f) {
    var b, m, l, e, h = [];
    f = JXG.checkAttributes(f, {
        withLabel: JXG.readOption(g.options, "line", "withLabel"),
        layer: null,
        labelOffsets: JXG.readOption(g.options, "line", "labelOffsets")
    });
    var d = false;
    if (k.length == 2) {
        if (k[0].length > 1) {
            m = g.create("point", k[0], {
                visible: false,
                fixed: true
            })
        } else {
            if (k[0].elementClass == JXG.OBJECT_CLASS_POINT) {
                m = JXG.getReference(g, k[0])
            } else {
                if ((typeof k[0] == "function") && (k[0]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                    m = k[0]();
                    d = true
                } else {
                    throw new Error("JSXGraph: Can't create line with parent types '" + (typeof k[0]) + "' and '" + (typeof k[1]) + "'.")
                }
            }
        }
        if (k[1].length > 1) {
            l = g.create("point", k[1], {
                visible: false,
                fixed: true
            })
        } else {
            if (k[1].elementClass == JXG.OBJECT_CLASS_POINT) {
                l = JXG.getReference(g, k[1])
            } else {
                if ((typeof k[1] == "function") && (k[1]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                    l = k[1]();
                    d = true
                } else {
                    throw new Error("JSXGraph: Can't create line with parent types '" + (typeof k[0]) + "' and '" + (typeof k[1]) + "'.")
                }
            }
        }
        b = new JXG.Line(g, m.id, l.id, f.id, f.name, f.withLabel, f.layer);
        if (d) {
            b.constrained = true;
            b.funp1 = k[0];
            b.funp2 = k[1]
        }
    } else {
        if (k.length == 3) {
            for (e = 0; e < 3; e++) {
                if (typeof k[e] == "number") {
                    h[e] = function (c) {
                        return function () {
                            return c
                        }
                    }(k[e])
                } else {
                    if (typeof k[e] == "function") {
                        h[e] = k[e]
                    } else {
                        throw new Error("JSXGraph: Can't create line with parent types '" + (typeof k[0]) + "' and '" + (typeof k[1]) + "' and '" + (typeof k[2]) + "'.");
                        return
                    }
                }
            }
            m = g.create("point", [function () {
                return (0 + h[2]() * h[2]() + h[1]() * h[1]()) * 0.5
            }, function () {
                return (h[2]() - h[1]() * h[0]() + h[2]()) * 0.5
            }, function () {
                return (-h[1]() - h[2]() * h[0]() - h[1]()) * 0.5
            }], {
                visible: false,
                name: " "
            });
            l = g.create("point", [function () {
                return h[2]() * h[2]() + h[1]() * h[1]()
            }, function () {
                return -h[1]() * h[0]() + h[2]()
            }, function () {
                return -h[2]() * h[0]() - h[1]()
            }], {
                visible: false,
                name: " "
            });
            b = new JXG.Line(g, m.id, l.id, f.id, f.name, f.withLabel)
        } else {
            if ((k.length == 1) && (typeof k[0] == "function") && (k[0]().length == 2) && (k[0]()[0].elementClass == JXG.OBJECT_CLASS_POINT) && (k[0]()[1].elementClass == JXG.OBJECT_CLASS_POINT)) {
                var a = k[0]();
                b = new JXG.Line(g, a[0].id, a[1].id, f.id, f.name, f.withLabel, f.layer);
                b.constrained = true;
                b.funps = k[0]
            } else {
                throw new Error("JSXGraph: Can't create line with parent types '" + (typeof k[0]) + "' and '" + (typeof k[1]) + "'.")
            }
        }
    }
    b.labelOffsets = f.labelOffsets;
    return b
};
JXG.JSXGraph.registerElement("line", JXG.createLine);
JXG.createSegment = function (c, a, d) {
    var b;
    d = JXG.checkAttributes(d, {
        withLabel: JXG.readOption(c.options, "line", "withLabel"),
        layer: null
    });
    d.straightFirst = false;
    d.straightLast = false;
    b = c.create("line", a, d);
    return b
};
JXG.JSXGraph.registerElement("segment", JXG.createSegment);
JXG.createArrow = function (d, b, a) {
    var c;
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(d.options, "line", "withLabel"),
        layer: null
    });
    c = d.create("line", b, a);
    c.setStraight(false, false);
    c.setArrow(false, true);
    c.type = JXG.OBJECT_TYPE_VECTOR;
    return c
};
JXG.JSXGraph.registerElement("arrow", JXG.createArrow);
JXG.createAxis = function (e, l, b) {
    var h, g, m, f, c, a, d, k;
    if ((JXG.isArray(l[0]) || JXG.isPoint(l[0])) && (JXG.isArray(l[1]) || JXG.isPoint(l[1]))) {
        if (JXG.isPoint(l[0])) {
            h = l[0]
        } else {
            h = new JXG.Point(e, l[0], "", "", false)
        }
        if (JXG.isPoint(l[1])) {
            g = l[1]
        } else {
            g = new JXG.Point(e, l[1], "", "", false)
        }
        h.fixed = true;
        g.fixed = true;
        b = JXG.checkAttributes(b, {
            lastArrow: true,
            straightFirst: true,
            straightLast: true,
            strokeWidth: 1,
            withLabel: false,
            strokeColor: e.options.axis.strokeColor
        });
        b.highlightStrokeColor = b.highlightStrokeColor || b.strokeColor || e.options.axis.highlightStrokeColor;
        m = e.create("line", [h, g], b);
        m.needsRegularUpdate = false;
        b = JXG.checkAttributes(b, {
            minorTicks: 4,
            insertTicks: true
        });
        if (b.ticksDistance != "undefined" && b.ticksDistance != null) {
            f = b.ticksDistance
        } else {
            if (JXG.isArray(b.ticks)) {
                f = b.ticks
            } else {
                c = new JXG.Coords(JXG.COORDS_BY_USER, [m.point1.coords.usrCoords.slice(1)], e);
                a = new JXG.Coords(JXG.COORDS_BY_USER, [m.point2.coords.usrCoords.slice(1)], e);
                e.renderer.calcStraight(m, c, a);
                d = c.distance(JXG.COORDS_BY_USER, a);
                f = 1
            }
        }
        k = e.create("ticks", [m, f], b);
        k.needsRegularUpdate = false;
        m.defaultTicks = k
    } else {
        throw new Error("JSXGraph: Can't create point with parent types '" + (typeof l[0]) + "' and '" + (typeof l[1]) + "'.")
    }
    return m
};
JXG.JSXGraph.registerElement("axis", JXG.createAxis);
JXG.createTangent = function (m, q, e) {
    var a, n, k, l, h, d, b, r, s, u;
    if (q.length == 1) {
        a = q[0];
        n = a.slideObject
    } else {
        if (q.length == 2) {
            if (JXG.isPoint(q[0])) {
                a = q[0];
                n = q[1]
            } else {
                if (JXG.isPoint(q[1])) {
                    n = q[0];
                    a = q[1]
                } else {
                    throw new Error("JSXGraph: Can't create normal with parent types '" + (typeof q[0]) + "' and '" + (typeof q[1]) + "'.")
                }
            }
        } else {
            throw new Error("JSXGraph: Can't create normal with parent types '" + (typeof q[0]) + "' and '" + (typeof q[1]) + "'.")
        }
    }
    e = JXG.checkAttributes(e, {
        withLabel: JXG.readOption(m.options, "line", "withLabel"),
        layer: null
    });
    if (n.elementClass == JXG.OBJECT_CLASS_LINE) {
        u = m.create("line", [n.point1, n.point2], e)
    } else {
        if (n.elementClass == JXG.OBJECT_CLASS_CURVE && !(n.type == JXG.OBJECT_TYPE_CONIC)) {
            if (n.curveType != "plot") {
                k = n.X;
                l = n.Y;
                u = m.create("line", [function () {
                    return -a.X() * m.D(l)(a.position) + a.Y() * m.D(k)(a.position)
                }, function () {
                    return m.D(l)(a.position)
                }, function () {
                    return -m.D(k)(a.position)
                }], e);
                a.addChild(u);
                u.glider = a
            } else {
                u = m.create("line", [function () {
                    h = Math.floor(a.position);
                    if (h == n.numberPoints - 1) {
                        h--
                    }
                    if (h < 0) {
                        return 1
                    }
                    return n.Y(h) * n.X(h + 1) - n.X(h) * n.Y(h + 1)
                }, function () {
                    h = Math.floor(a.position);
                    if (h == n.numberPoints - 1) {
                        h--
                    }
                    if (h < 0) {
                        return 0
                    }
                    return n.Y(h + 1) - n.Y(h)
                }, function () {
                    h = Math.floor(a.position);
                    if (h == n.numberPoints - 1) {
                        h--
                    }
                    if (h < 0) {
                        return 0
                    }
                    return n.X(h) - n.X(h + 1)
                }], e);
                a.addChild(u);
                u.glider = a
            }
        } else {
            if (n.type == JXG.OBJECT_TYPE_TURTLE) {
                u = m.create("line", [function () {
                    h = Math.floor(a.position);
                    for (d = 0; d < n.objects.length; d++) {
                        b = n.objects[d];
                        if (b.type == JXG.OBJECT_TYPE_CURVE) {
                            if (h < b.numberPoints) {
                                break
                            }
                            h -= b.numberPoints
                        }
                    }
                    if (h == b.numberPoints - 1) {
                        h--
                    }
                    if (h < 0) {
                        return 1
                    }
                    return b.Y(h) * b.X(h + 1) - b.X(h) * b.Y(h + 1)
                }, function () {
                    h = Math.floor(a.position);
                    for (d = 0; d < n.objects.length; d++) {
                        b = n.objects[d];
                        if (b.type == JXG.OBJECT_TYPE_CURVE) {
                            if (h < b.numberPoints) {
                                break
                            }
                            h -= b.numberPoints
                        }
                    }
                    if (h == b.numberPoints - 1) {
                        h--
                    }
                    if (h < 0) {
                        return 0
                    }
                    return b.Y(h + 1) - b.Y(h)
                }, function () {
                    h = Math.floor(a.position);
                    for (d = 0; d < n.objects.length; d++) {
                        b = n.objects[d];
                        if (b.type == JXG.OBJECT_TYPE_CURVE) {
                            if (h < b.numberPoints) {
                                break
                            }
                            h -= b.numberPoints
                        }
                    }
                    if (h == b.numberPoints - 1) {
                        h--
                    }
                    if (h < 0) {
                        return 0
                    }
                    return b.X(h) - b.X(h + 1)
                }], e);
                a.addChild(u);
                u.glider = a
            } else {
                if (n.elementClass == JXG.OBJECT_CLASS_CIRCLE || n.type == JXG.OBJECT_TYPE_CONIC) {
                    u = m.create("line", [function () {
                        return JXG.Math.matVecMult(n.quadraticform, a.coords.usrCoords)[0]
                    }, function () {
                        return JXG.Math.matVecMult(n.quadraticform, a.coords.usrCoords)[1]
                    }, function () {
                        return JXG.Math.matVecMult(n.quadraticform, a.coords.usrCoords)[2]
                    }], e);
                    a.addChild(u);
                    u.glider = a
                }
            }
        }
    }
    return u
};
JXG.JSXGraph.registerElement("tangent", JXG.createTangent);
JXG.JSXGraph.registerElement("polar", JXG.createTangent);
JXG.Group = function (e, h, a) {
    var f, d, b, g, c;
    this.board = e;
    this.objects = {};
    f = this.board.numObjects;
    this.board.numObjects++;
    if ((h == "") || (h == null) || (typeof h == "undefined")) {
        this.id = this.board.id + "Group" + f
    } else {
        this.id = h
    }
    this.type = JXG.OBJECT_TYPE_POINT;
    this.elementClass = JXG.OBJECT_CLASS_POINT;
    if ((a == "") || (a == null) || (typeof a == "undefined")) {
        this.name = "group_" + this.board.generateName(this)
    } else {
        this.name = a
    }
    delete(this.type);
    if ((arguments.length == 4) && (JXG.isArray(arguments[3]))) {
        d = arguments[3]
    } else {
        d = [];
        for (b = 3; b < arguments.length; b++) {
            d.push(arguments[b])
        }
    }
    for (b = 0; b < d.length; b++) {
        g = JXG.getReference(this.board, d[b]);
        if ((!g.fixed) && ((g.type == JXG.OBJECT_TYPE_POINT) || (g.type == JXG.OBJECT_TYPE_GLIDER))) {
            if (g.group.length != 0) {
                this.addGroup(g.group[g.group.length - 1])
            } else {
                this.addPoint(g)
            }
        }
    }
    for (c in this.objects) {
        this.objects[c].group.push(this)
    }
    this.dX = 0;
    this.dY = 0
};
JXG.Group.prototype.ungroup = function () {
    var a;
    for (a in this.objects) {
        if (this.objects[a].group[this.objects[a].group.length - 1] == this) {
            this.objects[a].group.pop()
        }
        delete(this.objects[a])
    }
};
JXG.Group.prototype.update = function (a) {
    var c = null,
        b;
    for (b in this.objects) {
        c = this.objects[b];
        if (c.id != a.id) {
            c.coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [c.coords.scrCoords[1] + this.dX, c.coords.scrCoords[2] + this.dY], c.board)
        }
    }
    for (b in this.objects) {
        if (this.board.objects[b] != undefined) {
            this.objects[b].update(false)
        } else {
            delete(this.objects[b])
        }
    }
};
JXG.Group.prototype.addPoint = function (a) {
    this.objects[a.id] = a
};
JXG.Group.prototype.addPoints = function (a) {
    var b;
    for (b in a) {
        this.objects[b.id] = b
    }
};
JXG.Group.prototype.addGroup = function (b) {
    var a;
    for (a in b.objects) {
        this.addPoint(b.objects[a])
    }
};
JXG.createGroup = function (c, b, a) {
    return new JXG.Group(c, a.id, a.name, b)
};
JXG.JSXGraph.registerElement("group", JXG.createGroup);
JXG.Circle = function (f, h, e, b, g, a, d, c) {
    this.constructor();
    this.type = JXG.OBJECT_TYPE_CIRCLE;
    this.elementClass = JXG.OBJECT_CLASS_CIRCLE;
    this.init(f, g, a);
    if (c == null) {
        c = f.options.layer.circle
    }
    this.layer = c;
    this.method = h;
    this.midpoint = JXG.getReference(this.board, e);
    this.midpoint.addChild(this);
    this.visProp.visible = true;
    this.visProp.fillColor = this.board.options.circle.fillColor;
    this.visProp.highlightFillColor = this.board.options.circle.highlightFillColor;
    this.visProp.strokeColor = this.board.options.circle.strokeColor;
    this.visProp.highlightStrokeColor = this.board.options.circle.highlightStrokeColor;
    this.point2 = null;
    this.radius = 0;
    this.line = null;
    this.circle = null;
    if (h == "twoPoints") {
        this.point2 = JXG.getReference(f, b);
        this.point2.addChild(this);
        this.radius = this.Radius()
    } else {
        if (h == "pointRadius") {
            this.generateTerm(b);
            this.updateRadius()
        } else {
            if (h == "pointLine") {
                this.line = JXG.getReference(f, b);
                this.radius = this.line.point1.coords.distance(JXG.COORDS_BY_USER, this.line.point2.coords)
            } else {
                if (h == "pointCircle") {
                    this.circle = JXG.getReference(f, b);
                    this.radius = this.circle.Radius()
                }
            }
        }
    }
    if (d != null) {
        this.createLabel(d)
    }
    if (h == "twoPoints") {
        this.id = this.board.addCircle(this)
    } else {
        if (h == "pointRadius") {
            this.id = this.board.addCircle(this);
            this.notifyParents(b)
        } else {
            if (h == "pointLine") {
                this.line.addChild(this);
                this.id = this.board.addCircle(this)
            } else {
                if (h == "pointCircle") {
                    this.circle.addChild(this);
                    this.id = this.board.addCircle(this)
                }
            }
        }
    }
};
JXG.Circle.prototype = new JXG.GeometryElement;
JXG.Circle.prototype.hasPoint = function (a, g) {
    var b = this.board.options.precision.hasPoint / (this.board.stretchX),
        d = this.midpoint.coords.usrCoords,
        e = new JXG.Coords(JXG.COORDS_BY_SCREEN, [a, g], this.board),
        c = this.Radius();
    var f = Math.sqrt((d[1] - e.usrCoords[1]) * (d[1] - e.usrCoords[1]) + (d[2] - e.usrCoords[2]) * (d[2] - e.usrCoords[2]));
    return (Math.abs(f - c) < b)
};
JXG.Circle.prototype.generatePolynomial = function (g) {
    var e = this.midpoint.symbolic.x;
    var d = this.midpoint.symbolic.y;
    var c = g.symbolic.x;
    var b = g.symbolic.y;
    var a = this.generateRadiusSquared();
    if (a == "") {
        return []
    }
    var f = "((" + c + ")-(" + e + "))^2 + ((" + b + ")-(" + d + "))^2 - (" + a + ")";
    return [f]
};
JXG.Circle.prototype.generateRadiusSquared = function () {
    var b = "";
    if (this.method == "twoPoints") {
        var d = this.midpoint.symbolic.x;
        var c = this.midpoint.symbolic.y;
        var f = this.point2.symbolic.x;
        var e = this.point2.symbolic.y;
        b = "(" + f + "-" + d + ")^2 + (" + e + "-" + c + ")^2"
    } else {
        if (this.method == "pointRadius") {
            if (typeof (this.radius) == "number") {
                b = "" + this.radius * this.radius
            }
        } else {
            if (this.method == "pointLine") {
                var f = this.line.point1.symbolic.x;
                var e = this.line.point1.symbolic.y;
                var a = this.line.point2.symbolic.x;
                var g = this.line.point2.symbolic.y;
                b = "(" + f + "-" + a + ")^2 + (" + e + "-" + g + ")^2"
            } else {
                if (this.method == "pointCircle") {
                    b = this.circle.Radius()
                }
            }
        }
    }
    return b
};
JXG.Circle.prototype.update = function () {
    if (this.traced) {
        this.cloneToBackground(true)
    }
    if (this.needsUpdate) {
        if (this.method == "pointLine") {
            this.radius = this.line.point1.coords.distance(JXG.COORDS_BY_USER, this.line.point2.coords)
        } else {
            if (this.method == "pointCircle") {
                this.radius = this.circle.Radius()
            } else {
                if (this.method == "pointRadius") {
                    this.radius = this.updateRadius()
                }
            }
        }
        if (!this.board.geonextCompatibilityMode) {
            this.updateStdform();
            this.updateQuadraticform()
        }
    }
};
JXG.Circle.prototype.updateQuadraticform = function () {
    var a = this.midpoint,
        d = a.X(),
        c = a.Y(),
        b = this.Radius();
    this.quadraticform = [
        [d * d + c * c - b * b, -d, -c],
        [-d, 1, 0],
        [-c, 0, 1]
    ]
};
JXG.Circle.prototype.updateStdform = function () {
    this.stdform[3] = 0.5;
    this.stdform[4] = this.Radius();
    this.stdform[1] = -this.midpoint.coords.usrCoords[1];
    this.stdform[2] = -this.midpoint.coords.usrCoords[2];
    this.normalize()
};
JXG.Circle.prototype.updateRenderer = function () {
    if (this.needsUpdate && this.visProp.visible) {
        var a = this.isReal;
        this.isReal = (isNaN(this.midpoint.coords.usrCoords[1] + this.midpoint.coords.usrCoords[2] + this.Radius())) ? false : true;
        if (this.isReal) {
            if (a != this.isReal) {
                this.board.renderer.show(this);
                if (this.hasLabel && this.label.content.visProp.visible) {
                    this.board.renderer.show(this.label.content)
                }
            }
            this.board.renderer.updateCircle(this)
        } else {
            if (a != this.isReal) {
                this.board.renderer.hide(this);
                if (this.hasLabel && this.label.content.visProp.visible) {
                    this.board.renderer.hide(this.label.content)
                }
            }
        }
        this.needsUpdate = false
    }
    if (this.hasLabel && this.label.content.visProp.visible && this.isReal) {
        this.label.content.update();
        this.board.renderer.updateText(this.label.content)
    }
};
JXG.Circle.prototype.generateTerm = function (b) {
    if (typeof b == "string") {
        var c = this.board.elementsByName;
        var a = this.board.algebra.geonext2JS(b + "");
        this.updateRadius = new Function("return " + a + ";")
    } else {
        if (typeof b == "number") {
            this.updateRadius = function () {
                return b
            }
        } else {
            this.updateRadius = b
        }
    }
};
JXG.Circle.prototype.notifyParents = function (b) {
    var a = null;
    var c = this.board.elementsByName;
    if (typeof b == "string") {
        this.board.algebra.findDependencies(this, b + "")
    }
};
JXG.Circle.prototype.Radius = function () {
    if (this.method == "twoPoints") {
        return (Math.sqrt(Math.pow(this.midpoint.coords.usrCoords[1] - this.point2.coords.usrCoords[1], 2) + Math.pow(this.midpoint.coords.usrCoords[2] - this.point2.coords.usrCoords[2], 2)))
    } else {
        if (this.method == "pointLine" || this.method == "pointCircle") {
            return this.radius
        } else {
            if (this.method == "pointRadius") {
                return this.updateRadius()
            }
        }
    }
};
JXG.Circle.prototype.getRadius = function () {
    return this.Radius()
};
JXG.Circle.prototype.getTextAnchor = function () {
    return this.midpoint.coords
};
JXG.Circle.prototype.getLabelAnchor = function () {
    if (this.method == "twoPoints") {
        var b = this.midpoint.coords.usrCoords[1] - this.point2.coords.usrCoords[1];
        var a = this.midpoint.coords.usrCoords[2] - this.point2.coords.usrCoords[2];
        return new JXG.Coords(JXG.COORDS_BY_USER, [this.midpoint.coords.usrCoords[1] + b, this.midpoint.coords.usrCoords[2] + a], this.board)
    } else {
        if (this.method == "pointLine" || this.method == "pointCircle" || this.method == "pointRadius") {
            return new JXG.Coords(JXG.COORDS_BY_USER, [this.midpoint.coords.usrCoords[1] - this.Radius(), this.midpoint.coords.usrCoords[2]], this.board)
        }
    }
};
JXG.Circle.prototype.cloneToBackground = function (a) {
    var c = {};
    c.id = this.id + "T" + this.numTraces;
    this.numTraces++;
    c.midpoint = {};
    c.midpoint.coords = this.midpoint.coords;
    var b = this.Radius();
    c.Radius = function () {
        return b
    };
    c.getRadius = function () {
        return b
    };
    c.board = {};
    c.board.unitX = this.board.unitX;
    c.board.unitY = this.board.unitY;
    c.board.zoomX = this.board.zoomX;
    c.board.zoomY = this.board.zoomY;
    c.board.stretchX = this.board.stretchX;
    c.board.stretchY = this.board.stretchY;
    c.visProp = this.visProp;
    JXG.clearVisPropOld(c);
    this.board.renderer.drawCircle(c);
    this.traces[c.id] = this.board.renderer.getElementById(c.id);
    delete c
};
JXG.Circle.prototype.addTransform = function (a) {
    var c;
    if (JXG.isArray(a)) {
        c = a
    } else {
        c = [a]
    }
    for (var b = 0; b < c.length; b++) {
        this.midpoint.transformations.push(c[b]);
        if (this.method == "twoPoints") {
            this.point2.transformations.push(c[b])
        }
    }
};
JXG.Circle.prototype.setPosition = function (d, a, c) {
    var b = this.board.create("transform", [a, c], {
        type: "translate"
    });
    this.addTransform(b)
};
JXG.Circle.prototype.X = function (a) {
    a *= 2 * Math.PI;
    return this.Radius() * Math.cos(a) + this.midpoint.coords.usrCoords[1]
};
JXG.Circle.prototype.Y = function (a) {
    a *= 2 * Math.PI;
    return this.Radius() * Math.sin(a) + this.midpoint.coords.usrCoords[2]
};
JXG.Circle.prototype.minX = function () {
    return 0
};
JXG.Circle.prototype.maxX = function () {
    return 1
};
JXG.Circle.prototype.Area = function () {
    var a = this.Radius();
    return a * a * Math.PI
};
JXG.createCircle = function (d, g, f) {
    var c, e, b;
    f = JXG.checkAttributes(f, {
        withLabel: JXG.readOption(d.options, "circle", "withLabel"),
        layer: null
    });
    e = [];
    for (b = 0; b < g.length; b++) {
        if (JXG.isPoint(g[b])) {
            e[b] = g[b]
        } else {
            if (g[b].length > 1) {
                e[b] = d.create("point", g[b], {
                    visible: false,
                    fixed: true
                })
            } else {
                e[b] = g[b]
            }
        }
    }
    if (g.length == 2 && JXG.isPoint(e[0]) && JXG.isPoint(e[1])) {
        c = new JXG.Circle(d, "twoPoints", e[0], e[1], f.id, f.name, f.withLabel, f.layer)
    } else {
        if ((JXG.isNumber(e[0]) || JXG.isFunction(e[0]) || JXG.isString(e[0])) && JXG.isPoint(e[1])) {
            c = new JXG.Circle(d, "pointRadius", e[1], e[0], f.id, f.name, f.withLabel, f.layer)
        } else {
            if ((JXG.isNumber(e[1]) || JXG.isFunction(e[1]) || JXG.isString(e[1])) && JXG.isPoint(e[0])) {
                c = new JXG.Circle(d, "pointRadius", e[0], e[1], f.id, f.name, f.withLabel, f.layer)
            } else {
                if ((e[0].type == JXG.OBJECT_TYPE_CIRCLE) && JXG.isPoint(e[1])) {
                    c = new JXG.Circle(d, "pointCircle", e[1], e[0], f.id, f.name, f.withLabel, f.layer)
                } else {
                    if ((e[1].type == JXG.OBJECT_TYPE_CIRCLE) && JXG.isPoint(e[0])) {
                        c = new JXG.Circle(d, "pointCircle", e[0], e[1], f.id, f.name, f.withLabel, f.layer)
                    } else {
                        if ((e[0].type == JXG.OBJECT_TYPE_LINE) && JXG.isPoint(e[1])) {
                            c = new JXG.Circle(d, "pointLine", e[1], e[0], f.id, f.name, f.withLabel, f.layer)
                        } else {
                            if ((e[1].type == JXG.OBJECT_TYPE_LINE) && JXG.isPoint(e[0])) {
                                c = new JXG.Circle(d, "pointLine", e[0], e[1], f.id, f.name, f.withLabel, f.layer)
                            } else {
                                if (g.length == 3 && JXG.isPoint(e[0]) && JXG.isPoint(e[1]) && JXG.isPoint(e[2])) {
                                    var a = JXG.createCircumcircle(d, e, f);
                                    a[0].setProperty({
                                        visible: false
                                    });
                                    return a[1]
                                } else {
                                    throw new Error("JSXGraph: Can't create circle with parent types '" + (typeof g[0]) + "' and '" + (typeof g[1]) + "'.")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return c
};
JXG.JSXGraph.registerElement("circle", JXG.createCircle);
JXG.createEllipse = function (h, l, g) {
    var n = [],
        b, a, e, f;
    g = JXG.checkAttributes(g, {
        withLabel: JXG.readOption(h.options, "conic", "withLabel"),
        layer: null
    });
    for (e = 0; e < 2; e++) {
        if (l[e].length > 1) {
            n[e] = h.create("point", l[e], {
                visible: false,
                fixed: true
            })
        } else {
            if (JXG.isPoint(l[e])) {
                n[e] = JXG.getReference(h, l[e])
            } else {
                if ((typeof l[e] == "function") && (l[e]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                    n[e] = l[e]()
                } else {
                    if (JXG.isString(l[e])) {
                        n[e] = JXG.getReference(h, l[e])
                    } else {
                        throw new Error("JSXGraph: Can't create Ellipse with parent types '" + (typeof l[0]) + "' and '" + (typeof l[1]) + "'.")
                    }
                }
            }
        }
    }
    if (JXG.isNumber(l[2])) {
        a = JXG.createFunction(l[2], h)
    } else {
        if ((typeof l[2] == "function") && (JXG.isNumber(l[2]()))) {
            a = l[2]
        } else {
            if (JXG.isPoint(l[2])) {
                b = JXG.getReference(h, l[2])
            } else {
                if (l[2].length > 1) {
                    b = h.create("point", l[2], {
                        visible: false,
                        fixed: true
                    })
                } else {
                    if ((typeof l[2] == "function") && (l[2]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                        b = l[2]()
                    } else {
                        if (JXG.isString(l[2])) {
                            b = JXG.getReference(h, l[2])
                        } else {
                            throw new Error("JSXGraph: Can't create Ellipse with parent types '" + (typeof l[0]) + "' and '" + (typeof l[1]) + "' and '" + (typeof l[2]) + "'.")
                        }
                    }
                }
            }
            a = function () {
                return b.Dist(n[0]) + b.Dist(n[1])
            }
        }
    }
    if (typeof l[4] == "undefined") {
        l[4] = 1.0001 * Math.PI
    }
    if (typeof l[3] == "undefined") {
        l[3] = -1.0001 * Math.PI
    }
    g = JXG.checkAttributes(g, {
        curveType: "parameter"
    });
    var k = h.create("point", [function () {
        return (n[0].X() + n[1].X()) * 0.5
    }, function () {
        return (n[0].Y() + n[1].Y()) * 0.5
    }], {
        visible: false,
        name: "",
        withLabel: false
    });
    var m = function () {
            var q = n[0].X(),
                z = n[0].Y(),
                w = n[1].X(),
                v = n[1].Y(),
                y, x, u;
            var s = (w - q > 0) ? 1 : -1;
            if (Math.abs(w - q) > 1e-7) {
                y = Math.atan2(v - z, w - q) + ((s < 0) ? Math.PI : 0)
            } else {
                y = ((v - z > 0) ? 0.5 : -0.5) * Math.PI
            }
            x = Math.cos(y);
            u = Math.sin(y);
            var r = [
                [1, 0, 0],
                [k.X(), x, -u],
                [k.Y(), u, x]
            ];
            return r
        };
    var c = h.create("curve", [function (q) {
        return 0
    }, function (q) {
        return 0
    },
    l[3], l[4]], g);
    var d = function (u, r) {
            var y = a() * 0.5,
                q = y * y,
                s = n[1].Dist(n[0]) * 0.5,
                v = q - s * s,
                x = Math.sqrt(v),
                w = [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                A, z;
            if (!r) {
                f = m();
                A = k.X();
                z = k.Y();
                w[0][0] = f[0][0];
                w[0][1] = 0;
                w[0][2] = 0;
                w[1][0] = A * (1 - f[1][1]) + z * f[1][2];
                w[1][1] = f[1][1];
                w[1][2] = f[2][1];
                w[2][0] = z * (1 - f[1][1]) - A * f[1][2];
                w[2][1] = f[1][2];
                w[2][2] = f[2][2];
                c.quadraticform = JXG.Math.matMatMult(JXG.Math.Matrix.transpose(w), JXG.Math.matMatMult([
                    [-1 + A * A / (y * y) + z * z / v, -A / q, -A / v],
                    [-A / q, 1 / q, 0],
                    [-z / v, 0, 1 / v]
                ], w))
            }
            return JXG.Math.matVecMult(f, [1, y * Math.cos(u), x * Math.sin(u)])
        };
    c.X = function (q, r) {
        return d(q, r)[1]
    };
    c.Y = function (q, r) {
        return d(q, r)[2]
    };
    c.midpoint = k;
    c.type = JXG.OBJECT_TYPE_CONIC;
    return c
};
JXG.createHyperbola = function (h, l, g) {
    var n = [],
        b, a, e, f;
    g = JXG.checkAttributes(g, {
        withLabel: JXG.readOption(h.options, "conic", "withLabel"),
        layer: null
    });
    for (e = 0; e < 2; e++) {
        if (l[e].length > 1) {
            n[e] = h.create("point", l[e], {
                visible: false,
                fixed: true
            })
        } else {
            if (JXG.isPoint(l[e])) {
                n[e] = JXG.getReference(h, l[e])
            } else {
                if ((typeof l[e] == "function") && (l[e]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                    n[e] = l[e]()
                } else {
                    if (JXG.isString(l[e])) {
                        n[e] = JXG.getReference(h, l[e])
                    } else {
                        throw new Error("JSXGraph: Can't create Hyperbola with parent types '" + (typeof l[0]) + "' and '" + (typeof l[1]) + "'.")
                    }
                }
            }
        }
    }
    if (JXG.isNumber(l[2])) {
        a = JXG.createFunction(l[2], h)
    } else {
        if ((typeof l[2] == "function") && (JXG.isNumber(l[2]()))) {
            a = l[2]
        } else {
            if (JXG.isPoint(l[2])) {
                b = JXG.getReference(h, l[2])
            } else {
                if (l[2].length > 1) {
                    b = h.create("point", l[2], {
                        visible: false,
                        fixed: true
                    })
                } else {
                    if ((typeof l[2] == "function") && (l[2]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                        b = l[2]()
                    } else {
                        if (JXG.isString(l[2])) {
                            b = JXG.getReference(h, l[2])
                        } else {
                            throw new Error("JSXGraph: Can't create Hyperbola with parent types '" + (typeof l[0]) + "' and '" + (typeof l[1]) + "' and '" + (typeof l[2]) + "'.")
                        }
                    }
                }
            }
            a = function () {
                return b.Dist(n[0]) - b.Dist(n[1])
            }
        }
    }
    if (typeof l[4] == "undefined") {
        l[4] = 1.0001 * Math.PI
    }
    if (typeof l[3] == "undefined") {
        l[3] = -1.0001 * Math.PI
    }
    g = JXG.checkAttributes(g, {
        curveType: "parameter"
    });
    var k = h.create("point", [function () {
        return (n[0].X() + n[1].X()) * 0.5
    }, function () {
        return (n[0].Y() + n[1].Y()) * 0.5
    }], {
        visible: false,
        name: "",
        withLabel: false
    });
    var m = function () {
            var s = n[0].X(),
                r = n[0].Y(),
                x = n[1].X(),
                v = n[1].Y(),
                u;
            var w = (x - s > 0) ? 1 : -1;
            if (Math.abs(x - s) > 1e-7) {
                u = Math.atan2(v - r, x - s) + ((w < 0) ? Math.PI : 0)
            } else {
                u = ((v - r > 0) ? 0.5 : -0.5) * Math.PI
            }
            var q = [
                [1, 0, 0],
                [k.X(), Math.cos(u), -Math.sin(u)],
                [k.Y(), Math.sin(u), Math.cos(u)]
            ];
            return q
        };
    var c = h.create("curve", [function (q) {
        return 0
    }, function (q) {
        return 0
    },
    l[3], l[4]], g);
    var d = function (u, r) {
            var y = a() * 0.5,
                q = y * y,
                s = n[1].Dist(n[0]) * 0.5,
                x = Math.sqrt(-y * y + s * s),
                v = x * x,
                w = [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                A, z;
            if (!r) {
                f = m();
                A = k.X();
                z = k.Y();
                w[0][0] = f[0][0];
                w[0][1] = 0;
                w[0][2] = 0;
                w[1][0] = A * (1 - f[1][1]) + z * f[1][2];
                w[1][1] = f[1][1];
                w[1][2] = f[2][1];
                w[2][0] = z * (1 - f[1][1]) - A * f[1][2];
                w[2][1] = f[1][2];
                w[2][2] = f[2][2];
                c.quadraticform = JXG.Math.matMatMult(JXG.Math.Matrix.transpose(w), JXG.Math.matMatMult([
                    [-1 + A * A / q + z * z / v, -A / q, z / v],
                    [-A / q, 1 / q, 0],
                    [z / v, 0, -1 / v]
                ], w))
            }
            return JXG.Math.matVecMult(f, [1, y / Math.cos(u), x * Math.tan(u)])
        };
    c.X = function (q, r) {
        return d(q, r)[1]
    };
    c.Y = function (q, r) {
        return d(q, r)[2]
    };
    c.midpoint = k;
    c.type = JXG.OBJECT_TYPE_CONIC;
    return c
};
JXG.createParabola = function (g, k, f) {
    var e = k[0],
        b = k[1],
        d;
    f = JXG.checkAttributes(f, {
        withLabel: JXG.readOption(g.options, "conic", "withLabel"),
        layer: null
    });
    if (k[0].length > 1) {
        e = g.create("point", k[0], {
            visible: false,
            fixed: true
        })
    } else {
        if (JXG.isPoint(k[0])) {
            e = JXG.getReference(g, k[0])
        } else {
            if ((typeof k[0] == "function") && (k[0]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                e = k[0]()
            } else {
                if (JXG.isString(k[0])) {
                    e = JXG.getReference(g, k[0])
                } else {
                    throw new Error("JSXGraph: Can't create Parabola with parent types '" + (typeof k[0]) + "' and '" + (typeof k[1]) + "'.")
                }
            }
        }
    }
    if (typeof k[3] == "undefined") {
        k[3] = 10
    }
    if (typeof k[2] == "undefined") {
        k[2] = -10
    }
    f = JXG.checkAttributes(f, {
        curveType: "parameter"
    });
    var h = g.create("point", [function () {
        var l = [0, b.stdform[1], b.stdform[2]];
        l = JXG.Math.crossProduct(l, e.coords.usrCoords);
        return g.algebra.meetLineLine(l, b.stdform, 0).usrCoords
    }], {
        visible: false,
        name: "",
        withLabel: false
    });
    var m = function () {
            var q = Math.atan(b.getSlope()),
                n = (h.X() + e.X()) * 0.5,
                r = (h.Y() + e.Y()) * 0.5;
            q += (e.Y() - h.Y() < 0 || (e.Y() == h.Y() && e.X() > h.X())) ? Math.PI : 0;
            var l = [
                [1, 0, 0],
                [n * (1 - Math.cos(q)) + r * Math.sin(q), Math.cos(q), -Math.sin(q)],
                [r * (1 - Math.cos(q)) - n * Math.sin(q), Math.sin(q), Math.cos(q)]
            ];
            return l
        };
    var a = g.create("curve", [function (l) {
        return 0
    }, function (l) {
        return 0
    },
    k[2], k[3]], f);
    var c = function (r, s) {
            var u = h.Dist(e) * 0.5,
                q = [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                n = (h.X() + e.X()) * 0.5,
                l = (h.Y() + e.Y()) * 0.5;
            if (!s) {
                d = m();
                q[0][0] = d[0][0];
                q[0][1] = 0;
                q[0][2] = 0;
                q[1][0] = n * (1 - d[1][1]) + l * d[1][2];
                q[1][1] = d[1][1];
                q[1][2] = d[2][1];
                q[2][0] = l * (1 - d[1][1]) - n * d[1][2];
                q[2][1] = d[1][2];
                q[2][2] = d[2][2];
                a.quadraticform = JXG.Math.matMatMult(JXG.Math.Matrix.transpose(q), JXG.Math.matMatMult([
                    [-l * 4 * u - n * n, n, 2 * u],
                    [n, -1, 0],
                    [2 * u, 0, 0]
                ], q))
            }
            return JXG.Math.matVecMult(d, [1, r + n, r * r / (u * 4) + l])
        };
    a.X = function (l, n) {
        return c(l, n)[1]
    };
    a.Y = function (l, n) {
        return c(l, n)[2]
    };
    a.type = JXG.OBJECT_TYPE_CONIC;
    return a
};
JXG.createConic = function (e, x, q) {
    var g = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ],
        C, A, z, y, f = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ],
        r, n, u = [],
        v, s, B, m = [];
    if (x.length == 5) {
        B = true
    } else {
        if (x.length == 6) {
            B = false
        } else {
            throw new Error("JSXGraph: Can't create generic Conic with " + parent.length + " parameters.")
        }
    }
    q = JXG.checkAttributes(q, {
        withLabel: JXG.readOption(e.options, "conic", "withLabel"),
        layer: null
    });
    if (B) {
        for (v = 0; v < 5; v++) {
            if (x[v].length > 1) {
                u[v] = e.create("point", x[v], {
                    visible: false,
                    fixed: true
                })
            } else {
                if (JXG.isPoint(x[v])) {
                    u[v] = JXG.getReference(e, x[v])
                } else {
                    if ((typeof x[v] == "function") && (x[v]().elementClass == JXG.OBJECT_CLASS_POINT)) {
                        u[v] = x[v]()
                    } else {
                        if (JXG.isString(x[v])) {
                            u[v] = JXG.getReference(e, x[v])
                        } else {
                            throw new Error("JSXGraph: Can't create Conic section with parent types '" + (typeof x[v]) + "'.")
                        }
                    }
                }
            }
        }
    } else {
        s = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        s[0][0] = (JXG.isFunction(x[2])) ?
        function () {
            return x[2]()
        } : function () {
            return x[2]
        };
        s[0][1] = (JXG.isFunction(x[4])) ?
        function () {
            return x[4]()
        } : function () {
            return x[4]
        };
        s[0][2] = (JXG.isFunction(x[5])) ?
        function () {
            return x[5]()
        } : function () {
            return x[5]
        };
        s[1][1] = (JXG.isFunction(x[0])) ?
        function () {
            return x[0]()
        } : function () {
            return x[0]
        };
        s[1][2] = (JXG.isFunction(x[3])) ?
        function () {
            return x[3]()
        } : function () {
            return x[3]
        };
        s[2][2] = (JXG.isFunction(x[1])) ?
        function () {
            return x[1]()
        } : function () {
            return x[1]
        }
    }
    var h = function (a) {
            var c, b;
            for (c = 0; c < 3; c++) {
                for (b = c; b < 3; b++) {
                    a[c][b] += a[b][c]
                }
            }
            for (c = 0; c < 3; c++) {
                for (b = 0; b < c; b++) {
                    a[c][b] = a[b][c]
                }
            }
            return a
        };
    var l = function (b, a) {
            var E, c, D = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
            for (E = 0; E < 3; E++) {
                for (c = 0; c < 3; c++) {
                    D[E][c] = b[E] * a[c]
                }
            }
            return h(D)
        };
    var w = function (D, b, c) {
            var G, H, a, I = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
                F, E;
            a = JXG.Math.matVecMult(b, c);
            G = JXG.Math.innerProduct(c, a);
            a = JXG.Math.matVecMult(D, c);
            H = JXG.Math.innerProduct(c, a);
            for (F = 0; F < 3; F++) {
                for (E = 0; E < 3; E++) {
                    I[F][E] = G * D[F][E] - H * b[F][E]
                }
            }
            return I
        };
    var k = e.create("curve", [function (a) {
        return 0
    }, function (a) {
        return 0
    },
    0, 2 * Math.PI], q);
    var d = function (E, F) {
            var D, c, a, b;
            if (!F) {
                if (B) {
                    for (D = 0; D < 5; D++) {
                        m[D] = u[D].coords.usrCoords
                    }
                    r = l(JXG.Math.crossProduct(m[0], m[1]), JXG.Math.crossProduct(m[2], m[3]));
                    n = l(JXG.Math.crossProduct(m[0], m[2]), JXG.Math.crossProduct(m[1], m[3]));
                    f = w(r, n, m[4])
                } else {
                    for (D = 0; D < 3; D++) {
                        for (c = D; c < 3; c++) {
                            f[D][c] = s[D][c]();
                            if (c > D) {
                                f[c][D] = f[D][c]
                            }
                        }
                    }
                }
                k.quadraticform = f;
                C = JXG.Math.Numerics.Jacobi(f);
                if (C[0][0][0] < 0) {
                    C[0][0][0] *= (-1);
                    C[0][1][1] *= (-1);
                    C[0][2][2] *= (-1)
                }
                for (D = 0; D < 3; D++) {
                    a = 0;
                    for (c = 0; c < 3; c++) {
                        a += C[1][c][D] * C[1][c][D]
                    }
                    a = Math.sqrt(a);
                    for (c = 0; c < 3; c++) {}
                }
                g = C[1];
                y = Math.sqrt(Math.abs(C[0][0][0]));
                A = Math.sqrt(Math.abs(C[0][1][1]));
                z = Math.sqrt(Math.abs(C[0][2][2]))
            }
            if (C[0][1][1] < 0 && C[0][2][2] < 0) {
                b = JXG.Math.matVecMult(g, [1 / y, Math.cos(E) / A, Math.sin(E) / z])
            } else {
                if (C[0][1][1] < 0 && C[0][2][2] > 0) {
                    b = JXG.Math.matVecMult(g, [Math.cos(E) / y, 1 / A, Math.sin(E) / z])
                } else {
                    if (C[0][2][2] < 0) {
                        b = JXG.Math.matVecMult(g, [Math.sin(E) / y, Math.cos(E) / A, 1 / z])
                    }
                }
            }
            b[1] /= b[0];
            b[2] /= b[0];
            b[0] = 1;
            return b
        };
    k.X = function (a, b) {
        return d(a, b)[1]
    };
    k.Y = function (a, b) {
        return d(a, b)[2]
    };
    k.midpoint = e.create("point", [function () {
        var a = k.quadraticform;
        return [a[1][1] * a[2][2] - a[1][2] * a[1][2], a[1][2] * a[0][2] - a[2][2] * a[0][1], a[0][1] * a[1][2] - a[1][1] * a[0][2]]
    }], {
        name: "",
        visible: false
    });
    k.type = JXG.OBJECT_TYPE_CONIC;
    return k
};
JXG.JSXGraph.registerElement("ellipse", JXG.createEllipse);
JXG.JSXGraph.registerElement("hyperbola", JXG.createHyperbola);
JXG.JSXGraph.registerElement("parabola", JXG.createParabola);
JXG.JSXGraph.registerElement("conic", JXG.createConic);
JXG.Polygon = function (m, n, q, c, b, d, a, g, k) {
    this.constructor();
    this.type = JXG.OBJECT_TYPE_POLYGON;
    this.elementClass = JXG.OBJECT_CLASS_AREA;
    this.init(m, c, b);
    if (k == null) {
        k = m.options.layer.polygon
    }
    this.layer = k;
    if ((typeof d == "undefined") || (d == null)) {
        d = true
    }
    if ((typeof g == "undefined") || (g == null)) {
        g = false
    }
    this.withLines = d;
    this.vertices = [];
    for (var f = 0; f < n.length; f++) {
        var h = JXG.getReference(this.board, n[f]);
        this.vertices[f] = h
    }
    if ((typeof q == "undefined") || (q == null)) {
        q = [];
        for (var f = 0; f < n.length - 1; f++) {
            q[f] = {}
        }
    }
    if (this.vertices[this.vertices.length - 1] != this.vertices[0]) {
        this.vertices.push(this.vertices[0]);
        q.push({})
    }
    this.visProp.fillColor = this.board.options.polygon.fillColor;
    this.visProp.highlightFillColor = this.board.options.polygon.highlightFillColor;
    this.visProp.fillOpacity = this.board.options.polygon.fillOpacity;
    this.visProp.highlightFillOpacity = this.board.options.polygon.highlightFillOpacity;
    var e;
    this.borders = [];
    if (d) {
        for (var f = 0; f < this.vertices.length - 1; f++) {
            e = new JXG.Line(m, this.vertices[f], this.vertices[f + 1], q[f].id, q[f].name, g, this.layer + 1);
            e.setStraight(false, false);
            this.borders[f] = e;
            e.parentPolygon = this
        }
    }
    for (var f = 0; f < this.vertices.length - 1; f++) {
        var h = JXG.getReference(this.board, this.vertices[f]);
        h.addChild(this)
    }
    this.createLabel(a, [0, 0]);
    this.id = this.board.addPolygon(this)
};
JXG.Polygon.prototype = new JXG.GeometryElement;
JXG.Polygon.prototype.hasPoint = function (a, b) {
    return false
};
JXG.Polygon.prototype.updateRenderer = function () {
    if (this.needsUpdate) {
        this.board.renderer.updatePolygon(this);
        this.needsUpdate = false
    }
    if (this.hasLabel && this.label.content.visProp.visible) {
        this.label.content.update();
        this.board.renderer.updateText(this.label.content)
    }
};
JXG.Polygon.prototype.getTextAnchor = function () {
    var e = 0;
    var d = 0;
    var c = 0;
    var g = 0;
    e = c = this.vertices[0].X();
    d = g = this.vertices[0].Y();
    for (var f = 0; f < this.vertices.length; f++) {
        if (this.vertices[f].X() < e) {
            e = this.vertices[f].X()
        }
        if (this.vertices[f].X() > c) {
            c = this.vertices[f].X()
        }
        if (this.vertices[f].Y() > d) {
            d = this.vertices[f].Y()
        }
        if (this.vertices[f].Y() < g) {
            g = this.vertices[f].Y()
        }
    }
    return new JXG.Coords(JXG.COORDS_BY_USER, [(e + c) * 0.5, (d + g) * 0.5], this.board)
};
JXG.Polygon.prototype.getLabelAnchor = function () {
    var e = 0;
    var d = 0;
    var c = 0;
    var g = 0;
    e = c = this.vertices[0].X();
    d = g = this.vertices[0].Y();
    for (var f = 0; f < this.vertices.length; f++) {
        if (this.vertices[f].X() < e) {
            e = this.vertices[f].X()
        }
        if (this.vertices[f].X() > c) {
            c = this.vertices[f].X()
        }
        if (this.vertices[f].Y() > d) {
            d = this.vertices[f].Y()
        }
        if (this.vertices[f].Y() < g) {
            g = this.vertices[f].Y()
        }
    }
    return new JXG.Coords(JXG.COORDS_BY_USER, [(e + c) * 0.5, (d + g) * 0.5], this.board)
};
JXG.Polygon.prototype.cloneToBackground = function (a) {
    var b = {};
    b.id = this.id + "T" + this.numTraces;
    this.numTraces++;
    b.vertices = this.vertices;
    b.visProp = this.visProp;
    JXG.clearVisPropOld(b);
    this.board.renderer.drawPolygon(b);
    this.traces[b.id] = $(b.id);
    delete b
};
JXG.createPolygon = function (d, a, e) {
    var c, b;
    e = JXG.checkAttributes(e, {
        withLabel: JXG.readOption(d.options, "polygon", "withLabel"),
        layer: null
    });
    for (b = 0; b < a.length; b++) {
        a[b] = JXG.getReference(d, a[b]);
        if (!JXG.isPoint(a[b])) {
            throw new Error("JSXGraph: Can't create polygon with parent types other than 'point'.")
        }
    }
    c = new JXG.Polygon(d, a, e.borders, e.id, e.name, e.withLines, e.withLabel, e.lineLabels, e.layer);
    if (e.withLines || true) {
        for (b = 0; b < c.borders.length; b++) {
            c.borders[b].setProperty(e)
        }
    }
    return c
};
JXG.JSXGraph.registerElement("polygon", JXG.createPolygon);
JXG.Polygon.prototype.hideElement = function () {
    this.visProp.visible = false;
    this.board.renderer.hide(this);
    if (this.withLines) {
        for (var a = 0; a < this.borders.length; a++) {
            this.borders[a].hideElement()
        }
    }
    if (this.hasLabel && this.label != null) {
        this.label.hiddenByParent = true;
        if (this.label.content.visProp.visible) {
            this.board.renderer.hide(this.label.content)
        }
    }
};
JXG.Polygon.prototype.showElement = function () {
    this.visProp.visible = true;
    this.board.renderer.show(this);
    if (this.withLines) {
        for (var a = 0; a < this.borders.length; a++) {
            this.borders[a].showElement()
        }
    }
};
JXG.Polygon.prototype.Area = function () {
    var b = 0,
        a;
    for (a = 0; a < this.vertices.length - 1; a++) {
        b += (this.vertices[a].X() * this.vertices[a + 1].Y() - this.vertices[a + 1].X() * this.vertices[a].Y())
    }
    b /= 2;
    return Math.abs(b)
};
JXG.createRegularPolygon = function (k, q, h) {
    var d, f, e, a = [],
        b, m, g, l;
    h = JXG.checkAttributes(h, {
        withLabel: JXG.readOption(k.options, "polygon", "withLabel"),
        layer: null
    });
    if (JXG.isNumber(q[q.length - 1]) && q.length != 3) {
        throw new Error("JSXGraph: A regular polygon needs two point and a number as input.")
    }
    g = q.length;
    e = q[g - 1];
    if ((!JXG.isNumber(e) && !JXG.isPoint(JXG.getReference(k, e))) || e < 3) {
        throw new Error("JSXGraph: The third parameter has to be number greater than 2 or a point.")
    }
    if (JXG.isPoint(JXG.getReference(k, e))) {
        e = g;
        l = true
    } else {
        g--;
        l = false
    }
    for (f = 0; f < g; f++) {
        q[f] = JXG.getReference(k, q[f]);
        if (!JXG.isPoint(q[f])) {
            throw new Error("JSXGraph: Can't create regular polygon if the first two parameters aren't points.")
        }
    }
    a[0] = q[0];
    a[1] = q[1];
    for (f = 2; f < e; f++) {
        b = k.create("transform", [Math.PI * (2 - (e - 2) / e), a[f - 1]], {
            type: "rotate"
        });
        if (l) {
            a[f] = q[f];
            a[f].addTransform(q[f - 2], b)
        } else {
            a[f] = k.create("point", [a[f - 2], b], {
                name: "",
                withLabel: false,
                fixed: true,
                face: "o",
                size: 1
            })
        }
    }
    d = k.create("polygon", a, h);
    return d
};
JXG.JSXGraph.registerElement("regularpolygon", JXG.createRegularPolygon);
JXG.Curve = function (e, b, f, a, d, c) {
    this.constructor();
    this.points = [];
    this.type = JXG.OBJECT_TYPE_CURVE;
    this.elementClass = JXG.OBJECT_CLASS_CURVE;
    this.init(e, f, a);
    if (c == null) {
        c = e.options.layer.curve
    }
    this.layer = c;
    this.doAdvancedPlot = this.board.options.curve.doAdvancedPlot;
    this.numberPointsHigh = this.board.options.curve.numberPointsHigh;
    this.numberPointsLow = this.board.options.curve.numberPointsLow;
    this.numberPoints = this.numberPointsHigh;
    this.visProp.strokeWidth = this.board.options.curve.strokeWidth;
    this.visProp.highlightStrokeWidth = this.visProp.strokeWidth;
    this.visProp.visible = true;
    this.dataX = null;
    this.dataY = null;
    this.curveType = null;
    if (b[0] != null) {
        this.varname = b[0]
    } else {
        this.varname = "x"
    }
    this.xterm = b[1];
    this.yterm = b[2];
    this.generateTerm(this.varname, this.xterm, this.yterm, b[3], b[4]);
    this.updateCurve();
    this.createLabel(d);
    this.id = this.board.addCurve(this);
    if (typeof this.xterm == "string") {
        this.notifyParents(this.xterm)
    }
    if (typeof this.yterm == "string") {
        this.notifyParents(this.yterm)
    }
};
JXG.Curve.prototype = new JXG.GeometryElement;
JXG.Curve.prototype.minX = function () {
    if (this.curveType == "polar") {
        return 0
    } else {
        var a = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, 0], this.board);
        return a.usrCoords[1]
    }
};
JXG.Curve.prototype.maxX = function () {
    var a;
    if (this.curveType == "polar") {
        return 2 * Math.PI
    } else {
        a = new JXG.Coords(JXG.COORDS_BY_SCREEN, [this.board.canvasWidth, 0], this.board);
        return a.usrCoords[1]
    }
};
JXG.Curve.prototype.hasPoint = function (r, q) {
    var s, A = Infinity,
        I, k, C, B, v, u, w, b, J, z, m, G, h, F, f, l, n, E = this.numberPointsLow,
        H = (this.maxX() - this.minX()) / E,
        a = this.board.options.precision.hasPoint / (this.board.unitX * this.board.zoomX),
        e, D, g = true;
    a = a * a;
    e = new JXG.Coords(JXG.COORDS_BY_SCREEN, [r, q], this.board);
    r = e.usrCoords[1];
    q = e.usrCoords[2];
    if (this.curveType == "parameter" || this.curveType == "polar" || this.curveType == "functiongraph") {
        D = this.transformations.length;
        for (C = 0, s = this.minX(); C < E; C++) {
            v = this.X(s, g);
            u = this.Y(s, g);
            for (B = 0; B < D; B++) {
                k = this.transformations[B];
                k.update();
                I = JXG.Math.matVecMult(k.matrix, [1, v, u]);
                v = I[1];
                u = I[2]
            }
            A = (r - v) * (r - v) + (q - u) * (q - u);
            if (A < a) {
                return true
            }
            s += H
        }
    } else {
        if (this.curveType == "plot") {
            D = this.numberPoints;
            for (C = 0; C < D - 1; C++) {
                w = this.X(C);
                b = this.X(C + 1);
                J = this.Y(C);
                z = this.Y(C + 1);
                F = b - w;
                f = z - J;
                G = r - w;
                h = q - J;
                n = F * F + f * f;
                if (n >= JXG.Math.eps) {
                    l = G * F + h * f;
                    m = l / n;
                    A = G * G + h * h - m * l
                } else {
                    m = 0;
                    A = G * G + h * h
                }
                if (m >= 0 && m <= 1 && A < a) {
                    return true
                }
            }
            return false
        }
    }
    return (A < a)
};
JXG.Curve.prototype.allocatePoints = function () {
    var b, a;
    a = this.numberPoints;
    if (this.points.length < this.numberPoints) {
        for (b = this.points.length; b < a; b++) {
            this.points[b] = new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], this.board)
        }
    }
};
JXG.Curve.prototype.update = function () {
    if (this.needsUpdate) {
        this.updateCurve()
    }
    return this
};
JXG.Curve.prototype.updateRenderer = function () {
    if (this.needsUpdate) {
        this.board.renderer.updateCurve(this);
        this.needsUpdate = false
    }
    if (this.hasLabel && this.label.content.visProp.visible) {
        this.label.content.update();
        this.board.renderer.updateText(this.label.content)
    }
    return this
};
JXG.Curve.prototype.updateDataArray = function () {
    return this
};
JXG.Curve.prototype.updateCurve = function () {
    var b, c, g, a, f, d, e = false;
    this.updateDataArray();
    c = this.minX();
    g = this.maxX();
    if (this.dataX != null) {
        this.numberPoints = this.dataX.length;
        b = this.numberPoints;
        this.allocatePoints();
        for (d = 0; d < b; d++) {
            a = d;
            if (this.dataY != null) {
                f = d
            } else {
                f = this.X(a)
            }
            this.points[d].setCoordinates(JXG.COORDS_BY_USER, [this.X(a, e), this.Y(f, e)], false);
            this.updateTransform(this.points[d]);
            e = true
        }
    } else {
        if (this.doAdvancedPlot) {
            this.updateParametricCurve(c, g, b)
        } else {
            if (this.board.updateQuality == this.board.BOARD_QUALITY_HIGH) {
                this.numberPoints = this.numberPointsHigh
            } else {
                this.numberPoints = this.numberPointsLow
            }
            b = this.numberPoints;
            this.allocatePoints();
            this.updateParametricCurveNaive(c, g, b)
        }
    }
    this.getLabelAnchor();
    return this
};
JXG.Curve.prototype.updateParametricCurveNaive = function (c, g, b) {
    var e, d, f = false,
        a = (g - c) / b;
    for (e = 0; e < b; e++) {
        d = c + e * a;
        this.points[e].setCoordinates(JXG.COORDS_BY_USER, [this.X(d, f), this.Y(d, f)], false);
        this.updateTransform(this.points[e]);
        f = true
    }
    return this
};
JXG.Curve.prototype.updateParametricCurve = function (B, a, v) {
    var s, k, h, c = false,
        u = new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], this.board),
        g, f, z, b, l, D, C, n, e, r = [],
        d = [],
        A = [],
        w = [],
        m = false,
        q = 0;
    if (this.board.updateQuality == this.board.BOARD_QUALITY_LOW) {
        C = 12;
        n = 12;
        e = 12
    } else {
        C = 20;
        n = 2;
        e = 2
    }
    w[0] = a - B;
    for (s = 1; s < C; s++) {
        w[s] = w[s - 1] * 0.5
    }
    s = 1;
    r[0] = 1;
    d[0] = 0;
    k = B;
    u.setCoordinates(JXG.COORDS_BY_USER, [this.X(k, c), this.Y(k, c)], false);
    c = true;
    z = u.scrCoords[1];
    b = u.scrCoords[2];
    h = k;
    k = a;
    u.setCoordinates(JXG.COORDS_BY_USER, [this.X(k, c), this.Y(k, c)], false);
    g = u.scrCoords[1];
    f = u.scrCoords[2];
    A[0] = [g, f];
    l = 1;
    D = 0;
    this.points = [];
    this.points[q++] = new JXG.Coords(JXG.COORDS_BY_SCREEN, [z, b], this.board);
    do {
        m = this.isDistOK(z, b, g, f, n, e) || this.isSegmentOutside(z, b, g, f);
        while (D < C && (!m || D < 3) && !(!this.isSegmentDefined(z, b, g, f) && D > 8)) {
            r[l] = s;
            d[l] = D;
            A[l] = [g, f];
            l++;
            s = 2 * s - 1;
            D++;
            k = B + s * w[D];
            u.setCoordinates(JXG.COORDS_BY_USER, [this.X(k, c), this.Y(k, c)], false);
            g = u.scrCoords[1];
            f = u.scrCoords[2];
            m = this.isDistOK(z, b, g, f, n, e) || this.isSegmentOutside(z, b, g, f)
        }
        this.points[q] = new JXG.Coords(JXG.COORDS_BY_SCREEN, [g, f], this.board);
        this.updateTransform(this.points[q]);
        q++;
        z = g;
        b = f;
        h = k;
        l--;
        g = A[l][0];
        f = A[l][1];
        D = d[l] + 1;
        s = r[l] * 2
    } while (l != 0);
    this.numberPoints = this.points.length;
    return this
};
JXG.Curve.prototype.isSegmentOutside = function (b, d, a, c) {
    if (d < 0 && c < 0) {
        return true
    } else {
        if (d > this.board.canvasHeight && c > this.board.canvasHeight) {
            return true
        } else {
            if (b < 0 && a < 0) {
                return true
            } else {
                if (b > this.board.canvasWidth && a > this.board.canvasWidth) {
                    return true
                }
            }
        }
    }
    return false
};
JXG.Curve.prototype.isDistOK = function (d, f, c, e, b, a) {
    if (isNaN(d + f + c + e)) {
        return false
    }
    return (Math.abs(c - d) < a && Math.abs(e - f) < a)
};
JXG.Curve.prototype.isSegmentDefined = function (b, d, a, c) {
    if (isNaN(b + d) && isNaN(a + c)) {
        return false
    }
    return true
};
JXG.Curve.prototype.updateTransform = function (e) {
    var d, f, b, a = this.transformations.length;
    if (a == 0) {
        return e
    }
    for (b = 0; b < a; b++) {
        d = this.transformations[b];
        d.update();
        f = JXG.Math.matVecMult(d.matrix, e.usrCoords);
        e.setCoordinates(JXG.COORDS_BY_USER, [f[1], f[2]])
    }
    return e
};
JXG.Curve.prototype.addTransform = function (b) {
    var d, c, a;
    if (JXG.isArray(b)) {
        d = b
    } else {
        d = [b]
    }
    a = d.length;
    for (c = 0; c < a; c++) {
        this.transformations.push(d[c])
    }
    return this
};
JXG.Curve.prototype.setPosition = function (d, a, c) {
    var b = this.board.create("transform", [a, c], {
        type: "translate"
    });
    if (this.transformations.length > 0 && this.transformations[this.transformations.length - 1].isNumericMatrix) {
        this.transformations[this.transformations.length - 1].melt(b)
    } else {
        this.addTransform(b)
    }
    return this
};
JXG.Curve.prototype.generateTerm = function (b, f, c, a, g) {
    var e, d;
    if (JXG.isArray(f)) {
        this.dataX = f;
        this.X = function (h) {
            return this.dataX[h]
        };
        this.curveType = "plot";
        this.numberPoints = this.dataX.length
    } else {
        this.X = JXG.createFunction(f, this.board, b);
        if (JXG.isString(f)) {
            this.curveType = "functiongraph"
        } else {
            if (JXG.isFunction(f) || JXG.isNumber(f)) {
                this.curveType = "parameter"
            }
        }
    }
    if (JXG.isArray(c)) {
        this.dataY = c;
        this.Y = function (h) {
            if (JXG.isFunction(this.dataY[h])) {
                return this.dataY[h]()
            } else {
                return this.dataY[h]
            }
        }
    } else {
        this.Y = JXG.createFunction(c, this.board, b)
    }
    if (JXG.isFunction(f) && JXG.isArray(c)) {
        e = JXG.createFunction(c[0], this.board, "");
        d = JXG.createFunction(c[1], this.board, "");
        this.X = function (h) {
            return (f)(h) * Math.cos(h) + e()
        };
        this.Y = function (h) {
            return (f)(h) * Math.sin(h) + d()
        };
        this.curveType = "polar"
    }
    if (a != null) {
        this.minX = JXG.createFunction(a, this.board, "")
    }
    if (g != null) {
        this.maxX = JXG.createFunction(g, this.board, "")
    }
};
JXG.Curve.prototype.notifyParents = function (a) {
    this.board.algebra.findDependencies(this, a)
};
JXG.Curve.prototype.getLabelAnchor = function () {
    var a = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, this.board.canvasHeight * 0.5], this.board);
    a = this.board.algebra.projectCoordsToCurve(a.usrCoords[1], a.usrCoords[2], 0, this)[0];
    return a
};
JXG.createCurve = function (c, b, a) {
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(c.options, "curve", "withLabel"),
        layer: null
    });
    return new JXG.Curve(c, ["x"].concat(b), a.id, a.name, a.withLabel, a.layer)
};
JXG.JSXGraph.registerElement("curve", JXG.createCurve);
JXG.createFunctiongraph = function (d, b, a) {
    var c = ["x", "x"].concat(b);
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(d.options, "curve", "withLabel"),
        layer: null
    });
    a.curveType = "functiongraph";
    return new JXG.Curve(d, c, a.id, a.name, a.withLabel, a.layer)
};
JXG.JSXGraph.registerElement("functiongraph", JXG.createFunctiongraph);
JXG.createSpline = function (c, b, a) {
    var d;
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(c.options, "curve", "withLabel"),
        layer: null
    });
    d = function () {
        var g, e = [],
            h = [];
        var f = function (n, m) {
                var l, k;
                if (!m) {
                    e = [];
                    h = [];
                    if (b.length == 2 && JXG.isArray(b[0]) && JXG.isArray(b[1]) && b[0].length == b[1].length) {
                        for (l = 0; l < b[0].length; l++) {
                            if (typeof b[0][l] == "function") {
                                e.push(b[0][l]())
                            } else {
                                e.push(b[0][l])
                            }
                            if (typeof b[1][l] == "function") {
                                h.push(b[1][l]())
                            } else {
                                h.push(b[1][l])
                            }
                        }
                    } else {
                        for (l = 0; l < b.length; l++) {
                            if (JXG.isPoint(b[l])) {
                                e.push(b[l].X());
                                h.push(b[l].Y())
                            } else {
                                if (JXG.isArray(b[l]) && b[l].length == 2) {
                                    for (l = 0; l < b.length; l++) {
                                        if (typeof b[l][0] == "function") {
                                            e.push(b[l][0]())
                                        } else {
                                            e.push(b[l][0])
                                        }
                                        if (typeof b[l][1] == "function") {
                                            h.push(b[l][1]())
                                        } else {
                                            h.push(b[l][1])
                                        }
                                    }
                                }
                            }
                        }
                    }
                    g = JXG.Math.Numerics.splineDef(e, h)
                }
                return JXG.Math.Numerics.splineEval(n, e, h, g)
            };
        return f
    };
    return new JXG.Curve(c, ["x", "x", d()], a.id, a.name, a.withLabel, a.layer)
};
JXG.JSXGraph.registerElement("spline", JXG.createSpline);
JXG.createRiemannsum = function (g, b, a) {
    var l, e, h, d, k;
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(g.options, "curve", "withLabel"),
        layer: null,
        fillOpacity: 0.3,
        fillColor: "#ffff00",
        curveType: "plot"
    });
    h = b[0];
    l = JXG.createFunction(b[1], g, "");
    if (l == null) {
        throw new Error("JSXGraph: JXG.createRiemannsum: argument '2' n has to be number or function.")
    }
    e = JXG.createFunction(b[2], g, "", false);
    if (e == null) {
        throw new Error("JSXGraph: JXG.createRiemannsum: argument 3 'type' has to be string or function.")
    }
    d = ["x", [0],
        [0]
    ].concat(b.slice(3));
    k = new JXG.Curve(g, d, a.id, a.name, a.withLabel, a.layer);
    k.updateDataArray = function () {
        var c = JXG.Math.Numerics.riemann(h, l(), e(), this.minX(), this.maxX());
        this.dataX = c[0];
        this.dataY = c[1]
    };
    return k
};
JXG.JSXGraph.registerElement("riemannsum", JXG.createRiemannsum);
JXG.createArc = function (f, c, a) {
    var e, g, d, b;
    if (!(JXG.isPoint(c[0]) && JXG.isPoint(c[1]) && JXG.isPoint(c[2]))) {
        throw new Error("JSXGraph: Can't create Arc with parent types '" + (typeof c[0]) + "' and '" + (typeof c[1]) + "' and '" + (typeof c[2]) + "'.")
    }
    g = {
        withLabel: JXG.readOption(f.options, "elements", "withLabel"),
        layer: JXG.readOption(f.options, "layer", "arc"),
        useDirection: false
    };
    g.strokeWidth = f.options.elements.strokeWidth;
    b = f.options.arc;
    for (d in b) {
        g[d] = b[d]
    }
    a = JXG.checkAttributes(a, g);
    e = f.create("curve", [
        [0],
        [0]
    ], a);
    e.type = JXG.OBJECT_TYPE_ARC;
    e.midpoint = JXG.getReference(f, c[0]);
    e.point2 = JXG.getReference(f, c[1]);
    e.point3 = JXG.getReference(f, c[2]);
    e.midpoint.addChild(e);
    e.point2.addChild(e);
    e.point3.addChild(e);
    e.useDirection = a.useDirection;
    e.updateDataArray = function () {
        var D = this.point2,
            z = this.midpoint,
            w = this.point3,
            I, m, K, F, h = this.board.algebra.rad(D, z, w),
            G, E = Math.ceil(h / Math.PI * 90) + 1,
            J = h / E,
            r = z.X(),
            q = z.Y(),
            s, l, k, u, H;
        if (this.useDirection) {
            var l, k = c[1].coords.usrCoords,
                u = c[3].coords.usrCoords,
                H = c[2].coords.usrCoords;
            l = (k[1] - H[1]) * (k[2] - u[2]) - (k[2] - H[2]) * (k[1] - u[1]);
            if (l < 0) {
                this.point2 = c[1];
                this.point3 = c[2]
            } else {
                this.point2 = c[2];
                this.point3 = c[1]
            }
        }
        this.dataX = [D.X()];
        this.dataY = [D.Y()];
        for (I = J, G = 1; G <= E; G++, I += J) {
            m = Math.cos(I);
            K = Math.sin(I);
            F = [
                [1, 0, 0],
                [r * (1 - m) + q * K, m, -K],
                [q * (1 - m) - r * K, K, m]
            ];
            s = JXG.Math.matVecMult(F, D.coords.usrCoords);
            this.dataX.push(s[1] / s[0]);
            this.dataY.push(s[2] / s[0])
        }
    };
    e.Radius = function () {
        return this.point2.Dist(this.midpoint)
    };
    e.getRadius = function () {
        return this.Radius()
    };
    e.hasPoint = function (h, u) {
        var l = this.board.options.precision.hasPoint / (this.board.stretchX),
            s = new JXG.Coords(JXG.COORDS_BY_SCREEN, [h, u], this.board),
            m = this.Radius(),
            q = this.midpoint.coords.distance(JXG.COORDS_BY_USER, s),
            k = (Math.abs(q - m) < l),
            n;
        if (k) {
            n = this.board.algebra.rad(this.point2, this.midpoint, s.usrCoords.slice(1));
            if (n > this.board.algebra.rad(this.point2, this.midpoint, this.point3)) {
                k = false
            }
        }
        return k
    };
    e.hasPointSector = function (h, s) {
        var q = new JXG.Coords(JXG.COORDS_BY_SCREEN, [h, s], this.board),
            l = this.Radius(),
            n = this.midpoint.coords.distance(JXG.COORDS_BY_USER, q),
            k = (n < l),
            m;
        if (k) {
            m = this.board.algebra.rad(this.point2, this.midpoint, q.usrCoords.slice(1));
            if (m > this.board.algebra.rad(this.point2, this.midpoint, this.point3)) {
                k = false
            }
        }
        return k
    };
    e.getTextAnchor = function () {
        return this.midpoint.coords
    };
    e.getLabelAnchor = function () {
        var l = this.board.algebra.rad(this.point2, this.midpoint, this.point3),
            w = 10 / (this.board.stretchX),
            u = 10 / (this.board.stretchY),
            r = this.point2.coords.usrCoords,
            h = this.midpoint.coords.usrCoords,
            k = r[1] - h[1],
            v = r[2] - h[2],
            s, n, m, q;
        if (this.label.content != null) {
            this.label.content.relativeCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, 0], this.board)
        }
        s = new JXG.Coords(JXG.COORDS_BY_USER, [h[1] + Math.cos(l * 0.5) * k - Math.sin(l * 0.5) * v, h[2] + Math.sin(l * 0.5) * k + Math.cos(l * 0.5) * v], this.board);
        n = s.usrCoords[1] - h[1];
        m = s.usrCoords[2] - h[2];
        q = Math.sqrt(n * n + m * m);
        n = n * (q + w) / q;
        m = m * (q + u) / q;
        return new JXG.Coords(JXG.COORDS_BY_USER, [h[1] + n, h[2] + m], this.board)
    };
    e.prepareUpdate().update();
    return e
};
JXG.JSXGraph.registerElement("arc", JXG.createArc);
JXG.createSemicircle = function (d, b, a) {
    var c, f, e = "";
    a = JXG.checkAttributes(a, {});
    if (a.id != null) {
        e = a.id + "_mp"
    }
    if ((JXG.isPoint(b[0])) && (JXG.isPoint(b[1]))) {
        f = d.create("midpoint", [b[0], b[1]], {
            id: e,
            withLabel: false,
            visible: false
        });
        c = d.create("arc", [f, b[1], b[0]], a)
    } else {
        throw new Error("JSXGraph: Can't create Semicircle with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "'.")
    }
    return c
};
JXG.JSXGraph.registerElement("semicircle", JXG.createSemicircle);
JXG.createCircumcircleArc = function (e, b, a) {
    var d, g, f, c;
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(e.options, "arc", "withLabel"),
        layer: null
    });
    if (a.id != null) {
        f = a.id + "_mp"
    }
    if ((JXG.isPoint(b[0])) && (JXG.isPoint(b[1])) && (JXG.isPoint(b[2]))) {
        g = e.create("circumcirclemidpoint", [b[0], b[1], b[2]], {
            id: f,
            withLabel: false,
            visible: false
        });
        a.useDirection = true;
        d = e.create("arc", [g, b[0], b[2], b[1]], a)
    } else {
        throw new Error("JSXGraph: create Circumcircle Arc with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "' and '" + (typeof b[2]) + "'.")
    }
    return d
};
JXG.JSXGraph.registerElement("circumcirclearc", JXG.createCircumcircleArc);
JXG.createSector = function (f, c, a) {
    var e, g, d, b;
    if (!(JXG.isPoint(c[0]) && JXG.isPoint(c[1]) && JXG.isPoint(c[2]))) {
        throw new Error("JSXGraph: Can't create Sector with parent types '" + (typeof c[0]) + "' and '" + (typeof c[1]) + "' and '" + (typeof c[2]) + "'.")
    }
    g = {
        withLabel: JXG.readOption(f.options, "elements", "withLabel"),
        layer: JXG.readOption(f.options, "layer", "sector"),
        useDirection: false
    };
    g.strokeWidth = f.options.elements.strokeWidth;
    b = f.options.sector;
    for (d in b) {
        g[d] = b[d]
    }
    a = JXG.checkAttributes(a, g);
    e = f.create("curve", [
        [0],
        [0]
    ], a);
    e.type = JXG.OBJECT_TYPE_SECTOR;
    e.point1 = JXG.getReference(f, c[0]);
    e.point2 = JXG.getReference(f, c[1]);
    e.point3 = JXG.getReference(f, c[2]);
    e.point1.addChild(e);
    e.point2.addChild(e);
    e.point3.addChild(e);
    e.useDirection = a.useDirection;
    e.updateDataArray = function () {
        var D = this.point2,
            z = this.point1,
            w = this.point3,
            I, m, K, F, h = this.board.algebra.rad(D, z, w),
            G, E = Math.ceil(h / Math.PI * 90) + 1,
            J = h / E,
            r = z.X(),
            q = z.Y(),
            s, l, k, u, H;
        if (this.useDirection) {
            var l, k = c[1].coords.usrCoords,
                u = c[3].coords.usrCoords,
                H = c[2].coords.usrCoords;
            l = (k[1] - H[1]) * (k[2] - u[2]) - (k[2] - H[2]) * (k[1] - u[1]);
            if (l < 0) {
                this.point2 = c[1];
                this.point3 = c[2]
            } else {
                this.point2 = c[2];
                this.point3 = c[1]
            }
        }
        this.dataX = [z.X(), D.X()];
        this.dataY = [z.Y(), D.Y()];
        for (I = J, G = 1; G <= E; G++, I += J) {
            m = Math.cos(I);
            K = Math.sin(I);
            F = [
                [1, 0, 0],
                [r * (1 - m) + q * K, m, -K],
                [q * (1 - m) - r * K, K, m]
            ];
            s = JXG.Math.matVecMult(F, D.coords.usrCoords);
            this.dataX.push(s[1] / s[0]);
            this.dataY.push(s[2] / s[0])
        }
        this.dataX.push(z.X());
        this.dataY.push(z.Y())
    };
    e.Radius = function () {
        return this.point2.Dist(this.point1)
    };
    e.getRadius = function () {
        return this.Radius()
    };
    e.hasPointSector = function (h, s) {
        var q = new JXG.Coords(JXG.COORDS_BY_SCREEN, [h, s], this.board),
            l = this.Radius(),
            n = this.point1.coords.distance(JXG.COORDS_BY_USER, q),
            k = (n < l),
            m;
        if (k) {
            m = this.board.algebra.rad(this.point2, this.point1, q.usrCoords.slice(1));
            if (m > this.board.algebra.rad(this.point2, this.point1, this.point3)) {
                k = false
            }
        }
        return k
    };
    e.getTextAnchor = function () {
        return this.point1.coords
    };
    e.getLabelAnchor = function () {
        var l = this.board.algebra.rad(this.point2, this.point1, this.point3),
            w = 10 / (this.board.stretchX),
            u = 10 / (this.board.stretchY),
            r = this.point2.coords.usrCoords,
            h = this.point1.coords.usrCoords,
            k = r[1] - h[1],
            v = r[2] - h[2],
            s, n, m, q;
        if (this.label.content != null) {
            this.label.content.relativeCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, 0], this.board)
        }
        s = new JXG.Coords(JXG.COORDS_BY_USER, [h[1] + Math.cos(l * 0.5) * k - Math.sin(l * 0.5) * v, h[2] + Math.sin(l * 0.5) * k + Math.cos(l * 0.5) * v], this.board);
        n = s.usrCoords[1] - h[1];
        m = s.usrCoords[2] - h[2];
        q = Math.sqrt(n * n + m * m);
        n = n * (q + w) / q;
        m = m * (q + u) / q;
        return new JXG.Coords(JXG.COORDS_BY_USER, [h[1] + n, h[2] + m], this.board)
    };
    e.prepareUpdate().update();
    return e
};
JXG.JSXGraph.registerElement("sector", JXG.createSector);
JXG.createCircumcircleSector = function (e, b, a) {
    var d, g, f = "",
        c;
    a = JXG.checkAttributes(a, {
        withLabel: JXG.readOption(e.options, "sector", "withLabel"),
        layer: null
    });
    if (a.id != null) {
        f = a.id + "_mp"
    }
    if ((JXG.isPoint(b[0])) && (JXG.isPoint(b[1])) && (JXG.isPoint(b[2]))) {
        g = e.create("circumcirclemidpoint", [b[0], b[1], b[2]], {
            id: f,
            withLabel: false,
            visible: false
        });
        a.useDirection = true;
        d = e.create("sector", [g, b[0], b[2], b[1]], a)
    } else {
        throw new Error("JSXGraph: Can't create circumcircle sector with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "' and '" + (typeof b[2]) + "'.")
    }
    return d
};
JXG.JSXGraph.registerElement("circumcirclesector", JXG.createCircumcircleSector);
JXG.createAngle = function (h, m, f) {
    var b, a, d, u, q, r, l = ["&alpha;", "&beta;", "&gamma;", "&delta;", "&epsilon;", "&zeta;", "&eta", "&theta;", "&iota;", "&kappa;", "&lambda;", "&mu;", "&nu;", "&xi;", "&omicron;", "&pi;", "&rho;", "&sigmaf;", "&sigma;", "&tau;", "&upsilon;", "&phi;", "&chi;", "&psi;", "&omega;"],
        g = 0,
        e, k, c, n, s;
    d = {
        withLabel: JXG.readOption(h.options, "elements", "withLabel"),
        layer: JXG.readOption(h.options, "layer", "angle"),
        radius: JXG.readOption(h.options, "angle", "radius"),
        text: ""
    };
    u = h.options.angle;
    for (q in u) {
        d[q] = u[q]
    }
    f = JXG.checkAttributes(f, d);
    if ((JXG.isPoint(m[0])) && (JXG.isPoint(m[1])) && (JXG.isPoint(m[2]))) {
        r = f.text;
        if (r == "") {
            while (g < l.length) {
                e = g;
                k = l[g];
                for (b in h.objects) {
                    if (h.objects[b].type == JXG.OBJECT_TYPE_ANGLE) {
                        if (h.objects[b].text == k) {
                            g++;
                            break
                        }
                    }
                }
                if (g == e) {
                    r = k;
                    g = l.length + 1
                }
            }
            if (g == l.length) {
                c = "&alpha;_{";
                n = "}";
                s = false;
                e = 0;
                while (!s) {
                    for (b in h.objects) {
                        if (h.objects[b].type == JXG.OBJECT_TYPE_ANGLE) {
                            if (h.objects[b].text == (c + e + n)) {
                                s = true;
                                break
                            }
                        }
                    }
                    if (s) {
                        s = false
                    } else {
                        s = true;
                        r = (c + e + n)
                    }
                }
            }
        }
        a = h.create("point", [function () {
            var v = m[0],
                y = m[1],
                w = f.radius,
                x = y.Dist(v);
            return [y.X() + (v.X() - y.X()) * w / x, y.Y() + (v.Y() - y.Y()) * w / x]
        }], {
            withLabel: false,
            visible: false
        });
        f.name = r;
        b = h.create("sector", [m[1], a, m[2]], f);
        b.type = JXG.OBJECT_TYPE_ANGLE;
        b.text = r;
        m[0].addChild(b);
        b.getLabelAnchor = function () {
            var x = this.board.algebra.rad(this.point2, this.point1, this.point3),
                F = 10 / (this.board.stretchX),
                D = 10 / (this.board.stretchY),
                B = this.point2.coords.usrCoords,
                v = this.point1.coords.usrCoords,
                w = B[1] - v[1],
                E = B[2] - v[2],
                C, z, y, A;
            if (this.label.content != null) {
                this.label.content.relativeCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, 0], this.board)
            }
            C = new JXG.Coords(JXG.COORDS_BY_USER, [v[1] + Math.cos(x * 0.5 * 1.125) * w - Math.sin(x * 0.5 * 1.125) * E, v[2] + Math.sin(x * 0.5 * 1.125) * w + Math.cos(x * 0.5 * 1.125) * E], this.board);
            z = C.usrCoords[1] - v[1];
            y = C.usrCoords[2] - v[2];
            A = Math.sqrt(z * z + y * y);
            z = z * (A + F) / A;
            y = y * (A + D) / A;
            return new JXG.Coords(JXG.COORDS_BY_USER, [v[1] + z, v[2] + y], this.board)
        }
    } else {
        throw new Error("JSXGraph: Can't create angle with parent types '" + (typeof m[0]) + "' and '" + (typeof m[1]) + "' and '" + (typeof m[2]) + "'.")
    }
    return b
};
JXG.JSXGraph.registerElement("angle", JXG.createAngle);
JXG.Algebra = function (a) {
    this.board = a;
    this.eps = JXG.Math.eps
};
JXG.Algebra.prototype.angle = function (f, e, d) {
    var k = [],
        h = [],
        g = [],
        m, l, q, n;
    if (f.coords == null) {
        k[0] = f[0];
        k[1] = f[1]
    } else {
        k[0] = f.coords.usrCoords[1];
        k[1] = f.coords.usrCoords[2]
    }
    if (e.coords == null) {
        h[0] = e[0];
        h[1] = e[1]
    } else {
        h[0] = e.coords.usrCoords[1];
        h[1] = e.coords.usrCoords[2]
    }
    if (d.coords == null) {
        g[0] = d[0];
        g[1] = d[1]
    } else {
        g[0] = d.coords.usrCoords[1];
        g[1] = d.coords.usrCoords[2]
    }
    m = k[0] - h[0];
    l = k[1] - h[1];
    q = g[0] - h[0];
    n = g[1] - h[1];
    return Math.atan2(m * n - l * q, m * q + l * n)
};
JXG.Algebra.prototype.trueAngle = function (a, c, b) {
    return this.rad(a, c, b) * 57.29577951308232
};
JXG.Algebra.prototype.rad = function (q, n, m) {
    var h, e, x, w, c, b, g, f, l, k, d, u, s, y, r, v, a = 0;
    if (q.coords == null) {
        h = q[0];
        e = q[1]
    } else {
        h = q.coords.usrCoords[1];
        e = q.coords.usrCoords[2]
    }
    if (n.coords == null) {
        x = n[0];
        w = n[1]
    } else {
        x = n.coords.usrCoords[1];
        w = n.coords.usrCoords[2]
    }
    if (m.coords == null) {
        c = m[0];
        b = m[1]
    } else {
        c = m.coords.usrCoords[1];
        b = m.coords.usrCoords[2]
    }
    l = c - x;
    k = b - w;
    g = h - x;
    f = e - w;
    v = l * g + k * f;
    d = g * k - f * l;
    u = Math.sqrt(g * g + f * f);
    s = Math.sqrt(l * l + k * k);
    y = v / (u * s);
    if (y > 1) {
        y = 1
    } else {
        if (y < -1) {
            y = -1
        }
    }
    r = Math.acos(y);
    if ((Math.sin(r) * d) < 0) {
        a = 6.283185307179586 - r
    } else {
        a = r
    }
    return a
};
JXG.Algebra.prototype.angleBisector = function (f, e, b) {
    var c = f.coords.usrCoords,
        l = e.coords.usrCoords,
        g = b.coords.usrCoords,
        n = c[1] - l[1],
        m = c[2] - l[2],
        k = Math.sqrt(n * n + m * m),
        a, q, h;
    n /= k;
    m /= k;
    a = Math.acos(n);
    if (m < 0) {
        a *= -1
    }
    if (a < 0) {
        a += 2 * Math.PI
    }
    n = g[1] - l[1];
    m = g[2] - l[2];
    k = Math.sqrt(n * n + m * m);
    n /= k;
    m /= k;
    q = Math.acos(n);
    if (m < 0) {
        q *= -1
    }
    if (q < 0) {
        q += 2 * Math.PI
    }
    h = (a + q) * 0.5;
    if (a > q) {
        h += Math.PI
    }
    n = Math.cos(h) + l[1];
    m = Math.sin(h) + l[2];
    return new JXG.Coords(JXG.COORDS_BY_USER, [n, m], this.board)
};
JXG.Algebra.prototype.midpoint = function (a, b) {
    return new JXG.Coords(JXG.COORDS_BY_USER, [(a.coords.usrCoords[0] + b.coords.usrCoords[0]) * 0.5, (a.coords.usrCoords[1] + b.coords.usrCoords[1]) * 0.5, (a.coords.usrCoords[2] + b.coords.usrCoords[2]) * 0.5], this.board)
};
JXG.Algebra.prototype.parallel = function (e, b, h) {
    var c = 1,
        f = h.coords.usrCoords,
        k = e.coords.usrCoords,
        a = b.coords.usrCoords,
        g = f[1] + c * (a[1] - k[1]),
        d = f[2] + c * (a[2] - k[2]);
    return new JXG.Coords(JXG.COORDS_BY_USER, [g, d], this.board)
};
JXG.Algebra.prototype.reflection = function (m, h) {
    var d = h.coords.usrCoords,
        n = m.point1.coords.usrCoords,
        c = m.point2.coords.usrCoords,
        b, g, a, e, k, f, l;
    k = c[1] - n[1];
    f = c[2] - n[2];
    b = d[1] - n[1];
    g = d[2] - n[2];
    l = (k * g - f * b) / (k * k + f * f);
    a = d[1] + 2 * l * f;
    e = d[2] - 2 * l * k;
    return new JXG.Coords(JXG.COORDS_BY_USER, [a, e], this.board)
};
JXG.Algebra.prototype.rotation = function (a, m, f) {
    var h = m.coords.usrCoords,
        b = a.coords.usrCoords,
        e, l, g, n, d, k;
    e = h[1] - b[1];
    l = h[2] - b[2];
    g = Math.cos(f);
    n = Math.sin(f);
    d = e * g - l * n + b[1];
    k = e * n + l * g + b[2];
    return new JXG.Coords(JXG.COORDS_BY_USER, [d, k], this.board)
};
JXG.Algebra.prototype.perpendicular = function (q, m) {
    var e = q.point1.coords.usrCoords,
        d = q.point2.coords.usrCoords,
        b = m.coords.usrCoords,
        k, g, h, n, f, c, a, l;
    if (m == q.point1) {
        k = e[1] + d[2] - e[2];
        g = e[2] - d[1] + e[1];
        h = true
    } else {
        if (m == q.point2) {
            k = d[1] + e[2] - d[2];
            g = d[2] - e[1] + d[1];
            h = false
        } else {
            if (((Math.abs(e[1] - d[1]) > this.eps) && (Math.abs(b[2] - (e[2] - d[2]) * (b[1] - e[1]) / (e[1] - d[1]) - e[2]) < this.eps)) || ((Math.abs(e[1] - d[1]) <= this.eps) && (Math.abs(e[1] - b[1]) < this.eps))) {
                k = b[1] + d[2] - b[2];
                g = b[2] - d[1] + b[1];
                h = true;
                if (Math.abs(k - b[1]) < this.eps && Math.abs(g - b[2]) < this.eps) {
                    k = b[1] + e[2] - b[2];
                    g = b[2] - e[1] + b[1];
                    h = false
                }
            } else {
                n = e[2] - d[2];
                f = e[1] - d[1];
                c = d[1] * n - d[2] * f;
                a = b[1] * f + b[2] * n;
                l = n * n + f * f;
                if (Math.abs(l) < this.eps) {
                    l = this.eps
                }
                k = (c * n + a * f) / l;
                g = (a * n - c * f) / l;
                h = true
            }
        }
    }
    return [new JXG.Coords(JXG.COORDS_BY_USER, [k, g], this.board), h]
};
JXG.Algebra.prototype.circumcenterMidpoint = function (g, e, d) {
    var c = g.coords.usrCoords,
        b = e.coords.usrCoords,
        a = d.coords.usrCoords,
        m, l, k, h, f;
    m = ((c[1] - b[1]) * (c[1] + b[1]) + (c[2] - b[2]) * (c[2] + b[2])) * 0.5;
    l = ((b[1] - a[1]) * (b[1] + a[1]) + (b[2] - a[2]) * (b[2] + a[2])) * 0.5;
    k = (c[1] - b[1]) * (b[2] - a[2]) - (b[1] - a[1]) * (c[2] - b[2]);
    if (Math.abs(k) < this.eps) {
        k = this.eps
    }
    h = (m * (b[2] - a[2]) - l * (c[2] - b[2])) / k;
    f = (l * (c[1] - b[1]) - m * (b[1] - a[1])) / k;
    return new JXG.Coords(JXG.COORDS_BY_USER, [h, f], this.board)
};
JXG.Algebra.prototype.intersectLineLine = function (m, l) {
    var f = m.point1.coords.usrCoords,
        d = m.point2.coords.usrCoords,
        b = l.point1.coords.usrCoords,
        a = l.point2.coords.usrCoords,
        e, c, k, h, g;
    e = f[1] * d[2] - f[2] * d[1];
    c = b[1] * a[2] - b[2] * a[1];
    k = (d[2] - f[2]) * (b[1] - a[1]) - (f[1] - d[1]) * (a[2] - b[2]);
    if (Math.abs(k) < this.eps) {
        k = this.eps
    }
    h = (e * (b[1] - a[1]) - c * (f[1] - d[1])) / k;
    g = (c * (d[2] - f[2]) - e * (a[2] - b[2])) / k;
    return new JXG.Coords(JXG.COORDS_BY_USER, [h, g], this.board)
};
JXG.Algebra.prototype.intersectCircleLine = function (k, z) {
    var L = z.point1.coords.usrCoords,
        J = z.point2.coords.usrCoords,
        e = k.midpoint.coords.usrCoords,
        D, a, K, I, B, G, E, m, C, A, g, f, F, u, n, c, v, q, H;
    D = z.point1.Dist(z.point2);
    if (D > 0) {
        a = k.midpoint.Dist(z.point1);
        K = k.midpoint.Dist(z.point2);
        I = ((a * a) + (D * D) - (K * K)) / (2 * D);
        B = (a * a) - (I * I);
        B = (B < 0) ? 0 : B;
        G = Math.sqrt(B);
        E = k.Radius();
        m = Math.sqrt((E * E) - G * G);
        C = J[1] - L[1];
        A = J[2] - L[2];
        g = e[1] + (G / D) * A;
        f = e[2] - (G / D) * C;
        a = (J[1] * A) - (J[2] * C);
        K = (g * C) + (f * A);
        F = (A * A) + (C * C);
        if (Math.abs(F) < this.eps) {
            F = this.eps
        }
        u = ((a * A) + (K * C)) / F;
        n = ((K * A) - (a * C)) / F;
        c = m / D;
        v = new JXG.Coords(JXG.COORDS_BY_USER, [u + c * C, n + c * A], this.board);
        q = new JXG.Coords(JXG.COORDS_BY_USER, [u - c * C, n - c * A], this.board);
        H = k.midpoint.coords.distance(JXG.COORDS_BY_USER, v);
        if ((E < (H - 1)) || isNaN(H)) {
            return [0]
        } else {
            return [2, v, q]
        }
    }
    return [0]
};
JXG.Algebra.prototype.intersectCircleCircle = function (l, k) {
    var c = {},
        f = l.Radius(),
        e = k.Radius(),
        d = l.midpoint.coords.usrCoords,
        b = k.midpoint.coords.usrCoords,
        q, g, v, u, r, n, m;
    q = f + e;
    g = Math.abs(f - e);
    v = l.midpoint.coords.distance(JXG.COORDS_BY_USER, k.midpoint.coords);
    if (v > q) {
        return [0]
    } else {
        if (v < g) {
            return [0]
        } else {
            if (v != 0) {
                c[0] = 1;
                u = b[1] - d[1];
                r = b[2] - d[2];
                n = (v * v - e * e + f * f) / (2 * v);
                m = Math.sqrt(f * f - n * n);
                c[1] = new JXG.Coords(JXG.COORDS_BY_USER, [d[1] + (n / v) * u + (m / v) * r, d[2] + (n / v) * r - (m / v) * u], this.board);
                c[2] = new JXG.Coords(JXG.COORDS_BY_USER, [d[1] + (n / v) * u - (m / v) * r, d[2] + (n / v) * r + (m / v) * u], this.board)
            } else {
                return [0]
            }
            return c
        }
    }
};
JXG.Algebra.prototype.projectPointToCircle = function (b, e) {
    var f = b.coords.distance(JXG.COORDS_BY_USER, e.midpoint.coords),
        d = b.coords.usrCoords,
        h = e.midpoint.coords.usrCoords,
        a, g, c;
    if (Math.abs(f) < this.eps) {
        f = this.eps
    }
    c = e.Radius() / f;
    a = h[1] + c * (d[1] - h[1]);
    g = h[2] + c * (d[2] - h[2]);
    return new JXG.Coords(JXG.COORDS_BY_USER, [a, g], this.board)
};
JXG.Algebra.prototype.projectPointToLine = function (a, b) {
    var c = [0, b.stdform[1], b.stdform[2]];
    c = JXG.Math.crossProduct(c, a.coords.usrCoords);
    return this.meetLineLine(c, b.stdform, 0)
};
JXG.Algebra.prototype.projectPointToCurve = function (c, e) {
    var b = c.X(),
        f = c.Y(),
        d = c.position || 0,
        a = this.projectCoordsToCurve(b, f, d, e);
    c.position = a[1];
    return a[0]
};
JXG.Algebra.prototype.projectCoordsToCurve = function (g, f, l, m) {
    var z, v, b, u, a, e, r, w, n, d, q, k = 1000000,
        h, C, A, c, B, s;
    if (m.curveType == "parameter" || m.curveType == "polar") {
        h = function (D) {
            var y = g - m.X(D),
                x = f - m.Y(D);
            return y * y + x * x
        };
        c = h(l);
        s = 20;
        B = (m.maxX() - m.minX()) / s;
        C = m.minX();
        for (q = 0; q < s; q++) {
            A = h(C);
            if (A < c) {
                l = C;
                c = A
            }
            C += B
        }
        l = JXG.Math.Numerics.root(JXG.Math.Numerics.D(h), l);
        if (l < m.minX()) {
            l = m.maxX() + l - m.minX()
        }
        if (l > m.maxX()) {
            l = m.minX() + l - m.maxX()
        }
        z = new JXG.Coords(JXG.COORDS_BY_USER, [m.X(l), m.Y(l)], this.board)
    } else {
        if (m.curveType == "plot") {
            w = k;
            for (r = 0; r < m.numberPoints; r++) {
                v = g - m.X(r);
                b = f - m.Y(r);
                n = Math.sqrt(v * v + b * b);
                if (n < w) {
                    w = n;
                    l = r
                }
                if (r == m.numberPoints - 1) {
                    continue
                }
                u = m.X(r + 1) - m.X(r);
                a = m.Y(r + 1) - m.Y(r);
                e = u * u + a * a;
                if (e >= JXG.Math.eps) {
                    d = (v * u + b * a) / e;
                    n = Math.sqrt(v * v + b * b - d * (v * u + b * a))
                } else {
                    d = 0;
                    n = Math.sqrt(v * v + b * b)
                }
                if (d >= 0 && d <= 1 && n < w) {
                    l = r + d;
                    w = n
                }
            }
            r = Math.floor(l);
            d = l - r;
            if (r < m.numberPoints - 1) {
                g = d * m.X(r + 1) + (1 - d) * m.X(r);
                f = d * m.Y(r + 1) + (1 - d) * m.Y(r)
            } else {
                g = m.X(r);
                f = m.Y(r)
            }
            z = new JXG.Coords(JXG.COORDS_BY_USER, [g, f], this.board)
        } else {
            l = g;
            g = l;
            f = m.Y(l);
            z = new JXG.Coords(JXG.COORDS_BY_USER, [g, f], this.board)
        }
    }
    return [m.updateTransform(z), l]
};
JXG.Algebra.prototype.projectPointToTurtle = function (l, q) {
    var n, r, k, h, c, m = 0,
        f = 0,
        d = 1000000,
        g, a, b, e = q.objects.length;
    for (c = 0; c < e; c++) {
        a = q.objects[c];
        if (a.elementClass == JXG.OBJECT_CLASS_CURVE) {
            n = this.projectPointToCurve(l, a);
            g = this.distance(n.usrCoords, l.coords.usrCoords);
            if (g < d) {
                k = n.usrCoords[1];
                h = n.usrCoords[2];
                r = l.position;
                d = g;
                b = a;
                f = m
            }
            m += a.numberPoints
        }
    }
    n = new JXG.Coords(JXG.COORDS_BY_USER, [k, h], this.board);
    l.position = r + f;
    return b.updateTransform(n)
};
JXG.Algebra.prototype.replacePow = function (d) {
    var h, m, k, g, l, e, a, b, f, q, n;
    f = d.indexOf("^");
    while (f >= 0) {
        b = d.slice(0, f);
        if (b.charAt(b.length - 1) == ")") {
            h = 1;
            m = b.length - 2;
            while (m >= 0 && h > 0) {
                k = b.charAt(m);
                if (k == ")") {
                    h++
                } else {
                    if (k == "(") {
                        h--
                    }
                }
                m--
            }
            if (h == 0) {
                g = "";
                e = b.substring(0, m + 1);
                a = m;
                while (a >= 0 && e.substr(a, 1).match(/(\w+)/)) {
                    g = RegExp.$1 + g;
                    a--
                }
                g += b.substring(m + 1, b.length);
                g = g.replace(/([\(\)\+\*\%\^\-\/\]\[])/g, "\\$1")
            }
        } else {
            g = "[\\w\\.]+"
        }
        q = d.slice(f + 1);
        if (q.match(/^([\w\.]*\()/)) {
            h = 1;
            m = RegExp.$1.length;
            while (m < q.length && h > 0) {
                k = q.charAt(m);
                if (k == ")") {
                    h--
                } else {
                    if (k == "(") {
                        h++
                    }
                }
                m++
            }
            if (h == 0) {
                l = q.substring(0, m);
                l = l.replace(/([\(\)\+\*\%\^\-\/\[\]])/g, "\\$1")
            }
        } else {
            l = "[\\w\\.]+"
        }
        n = new RegExp("(" + g + ")\\^(" + l + ")");
        d = d.replace(n, "this.board.algebra.pow($1,$2)");
        f = d.indexOf("^")
    }
    return d
};
JXG.Algebra.prototype.replaceIf = function (b) {
    var u = "",
        d, r, f = null,
        a = null,
        k = null,
        e, q, g, l, h, m, n;
    e = b.indexOf("If(");
    if (e < 0) {
        return b
    }
    b = b.replace(/""/g, "0");
    while (e >= 0) {
        d = b.slice(0, e);
        r = b.slice(e + 3);
        g = 1;
        q = 0;
        l = -1;
        h = -1;
        while (q < r.length && g > 0) {
            m = r.charAt(q);
            if (m == ")") {
                g--
            } else {
                if (m == "(") {
                    g++
                } else {
                    if (m == "," && g == 1) {
                        if (l < 0) {
                            l = q
                        } else {
                            h = q
                        }
                    }
                }
            }
            q++
        }
        n = r.slice(0, q - 1);
        r = r.slice(q);
        if (l < 0) {
            return ""
        }
        if (h < 0) {
            return ""
        }
        f = n.slice(0, l);
        a = n.slice(l + 1, h);
        k = n.slice(h + 1);
        f = this.replaceIf(f);
        a = this.replaceIf(a);
        k = this.replaceIf(k);
        u += d + "((" + f + ")?(" + a + "):(" + k + "))";
        b = r;
        f = null;
        a = null;
        e = b.indexOf("If(")
    }
    u += r;
    return u
};
JXG.Algebra.prototype.replaceSub = function (c) {
    if (c.indexOf) {} else {
        return c
    }
    var b = c.indexOf("_{"),
        a;
    while (b >= 0) {
        c = c.substr(0, b) + c.substr(b).replace(/_\{/, "<sub>");
        a = c.substr(b).indexOf("}");
        if (a >= 0) {
            c = c.substr(0, a) + c.substr(a).replace(/\}/, "</sub>")
        }
        b = c.indexOf("_{")
    }
    b = c.indexOf("_");
    while (b >= 0) {
        c = c.substr(0, b) + c.substr(b).replace(/_(.?)/, "<sub>$1</sub>");
        b = c.indexOf("_")
    }
    return c
};
JXG.Algebra.prototype.replaceSup = function (c) {
    if (c.indexOf) {} else {
        return c
    }
    var b = c.indexOf("^{"),
        a;
    while (b >= 0) {
        c = c.substr(0, b) + c.substr(b).replace(/\^\{/, "<sup>");
        a = c.substr(b).indexOf("}");
        if (a >= 0) {
            c = c.substr(0, a) + c.substr(a).replace(/\}/, "</sup>")
        }
        b = c.indexOf("^{")
    }
    b = c.indexOf("^");
    while (b >= 0) {
        c = c.substr(0, b) + c.substr(b).replace(/\^(.?)/, "<sup>$1</sup>");
        b = c.indexOf("^")
    }
    return c
};
JXG.Algebra.prototype.replaceNameById = function (d) {
    var g = 0,
        a, f, e, c, b = ["X", "Y", "L", "V"];
    for (c = 0; c < b.length; c++) {
        g = d.indexOf(b[c] + "(");
        while (g >= 0) {
            if (g >= 0) {
                a = d.indexOf(")", g + 2);
                if (a >= 0) {
                    f = d.slice(g + 2, a);
                    f = f.replace(/\\(['"])?/g, "$1");
                    e = this.board.elementsByName[f];
                    d = d.slice(0, g + 2) + e.id + d.slice(a)
                }
            }
            a = d.indexOf(")", g + 2);
            g = d.indexOf(b[c] + "(", a)
        }
    }
    g = d.indexOf("Dist(");
    while (g >= 0) {
        if (g >= 0) {
            a = d.indexOf(",", g + 5);
            if (a >= 0) {
                f = d.slice(g + 5, a);
                f = f.replace(/\\(['"])?/g, "$1");
                e = this.board.elementsByName[f];
                d = d.slice(0, g + 5) + e.id + d.slice(a)
            }
        }
        a = d.indexOf(",", g + 5);
        g = d.indexOf(",", a);
        a = d.indexOf(")", g + 1);
        if (a >= 0) {
            f = d.slice(g + 1, a);
            f = f.replace(/\\(['"])?/g, "$1");
            e = this.board.elementsByName[f];
            d = d.slice(0, g + 1) + e.id + d.slice(a)
        }
        a = d.indexOf(")", g + 1);
        g = d.indexOf("Dist(", a)
    }
    b = ["Deg", "Rad"];
    for (c = 0; c < b.length; c++) {
        g = d.indexOf(b[c] + "(");
        while (g >= 0) {
            if (g >= 0) {
                a = d.indexOf(",", g + 4);
                if (a >= 0) {
                    f = d.slice(g + 4, a);
                    f = f.replace(/\\(['"])?/g, "$1");
                    e = this.board.elementsByName[f];
                    d = d.slice(0, g + 4) + e.id + d.slice(a)
                }
            }
            a = d.indexOf(",", g + 4);
            g = d.indexOf(",", a);
            a = d.indexOf(",", g + 1);
            if (a >= 0) {
                f = d.slice(g + 1, a);
                f = f.replace(/\\(['"])?/g, "$1");
                e = this.board.elementsByName[f];
                d = d.slice(0, g + 1) + e.id + d.slice(a)
            }
            a = d.indexOf(",", g + 1);
            g = d.indexOf(",", a);
            a = d.indexOf(")", g + 1);
            if (a >= 0) {
                f = d.slice(g + 1, a);
                f = f.replace(/\\(['"])?/g, "$1");
                e = this.board.elementsByName[f];
                d = d.slice(0, g + 1) + e.id + d.slice(a)
            }
            a = d.indexOf(")", g + 1);
            g = d.indexOf(b[c] + "(", a)
        }
    }
    return d
};
JXG.Algebra.prototype.replaceIdByObj = function (a) {
    var b = /(X|Y|L)\(([\w_]+)\)/g;
    a = a.replace(b, 'this.board.objects["$2"].$1()');
    b = /(V)\(([\w_]+)\)/g;
    a = a.replace(b, 'this.board.objects["$2"].Value()');
    b = /(Dist)\(([\w_]+),([\w_]+)\)/g;
    a = a.replace(b, 'this.board.objects["$2"].Dist(this.board.objects["$3"])');
    b = /(Deg)\(([\w_]+),([ \w\[\w_]+),([\w_]+)\)/g;
    a = a.replace(b, 'this.board.algebra.trueAngle(this.board.objects["$2"],this.board.objects["$3"],this.board.objects["$4"])');
    b = /Rad\(([\w_]+),([\w_]+),([\w_]+)\)/g;
    a = a.replace(b, 'this.board.algebra.rad(this.board.objects["$1"],this.board.objects["$2"],this.board.objects["$3"])');
    return a
};
JXG.Algebra.prototype.geonext2JS = function (b) {
    var d, c, a, f = ["Abs", "ACos", "ASin", "ATan", "Ceil", "Cos", "Exp", "Floor", "Log", "Max", "Min", "Random", "Round", "Sin", "Sqrt", "Tan", "Trunc"],
        e = ["Math.abs", "Math.acos", "Math.asin", "Math.atan", "Math.ceil", "Math.cos", "Math.exp", "Math.floor", "Math.log", "Math.max", "Math.min", "Math.random", "this.board.round", "Math.sin", "Math.sqrt", "Math.tan", "Math.ceil"];
    b = b.replace(/&lt;/g, "<");
    b = b.replace(/&gt;/g, ">");
    b = b.replace(/&amp;/g, "&");
    c = b;
    c = this.replaceNameById(c);
    c = this.replaceIf(c);
    c = this.replacePow(c);
    c = this.replaceIdByObj(c);
    for (a = 0; a < f.length; a++) {
        d = new RegExp(f[a], "ig");
        c = c.replace(d, e[a])
    }
    c = c.replace(/True/g, "true");
    c = c.replace(/False/g, "false");
    c = c.replace(/fasle/g, "false");
    c = c.replace(/Pi/g, "Math.PI");
    return c
};
JXG.Algebra.prototype.findDependencies = function (d, b) {
    var e = this.board.elementsByName,
        c, f, a;
    for (c in e) {
        if (c != d.name) {
            if (e[c].type == JXG.OBJECT_TYPE_TEXT) {
                if (!e[c].isLabel) {
                    a = c.replace(/\[/g, "\\[");
                    a = a.replace(/\]/g, "\\]");
                    f = new RegExp("\\(([\\w\\[\\]'_ ]+,)*(" + a + ")(,[\\w\\[\\]'_ ]+)*\\)", "g");
                    if (b.search(f) >= 0) {
                        e[c].addChild(d)
                    }
                }
            } else {
                a = c.replace(/\[/g, "\\[");
                a = a.replace(/\]/g, "\\]");
                f = new RegExp("\\(([\\w\\[\\]'_ ]+,)*(" + a + ")(,[\\w\\[\\]'_ ]+)*\\)", "g");
                if (b.search(f) >= 0) {
                    e[c].addChild(d)
                }
            }
        }
    }
};
JXG.Algebra.prototype.distance = function (e, d) {
    var c = 0,
        b, a;
    if (e.length != d.length) {
        return
    }
    a = e.length;
    for (b = 0; b < a; b++) {
        c += (e[b] - d[b]) * (e[b] - d[b])
    }
    return Math.sqrt(c)
};
JXG.Algebra.prototype.affineDistance = function (b, a) {
    var c;
    if (b.length != a.length) {
        return
    }
    c = this.distance(b, a);
    if (c > this.eps && (Math.abs(b[0]) < this.eps || Math.abs(a[0]) < this.eps)) {
        return Infinity
    } else {
        return c
    }
};
JXG.Algebra.prototype.pow = function (d, c) {
    if (d == 0) {
        if (c == 0) {
            return 1
        } else {
            return 0
        }
    }
    if (Math.floor(c) == c) {
        return Math.pow(d, c)
    } else {
        if (d > 0) {
            return Math.exp(c * Math.log(Math.abs(d)))
        } else {
            return NaN
        }
    }
};
JXG.Algebra.prototype.meet = function (d, b, c) {
    var a = this.eps;
    if (Math.abs(d[3]) < a && Math.abs(b[3]) < a) {
        return this.meetLineLine(d, b, c)
    } else {
        if (Math.abs(d[3]) >= a && Math.abs(b[3]) < a) {
            return this.meetLineCircle(b, d, c)
        } else {
            if (Math.abs(d[3]) < a && Math.abs(b[3]) >= a) {
                return this.meetLineCircle(d, b, c)
            } else {
                return this.meetCircleCircle(d, b, c)
            }
        }
    }
};
JXG.Algebra.prototype.meetLineLine = function (b, a, c) {
    var d = JXG.Math.crossProduct(b, a);
    if (Math.abs(d[0]) > this.eps) {
        d[1] /= d[0];
        d[2] /= d[0];
        d[0] = 1
    }
    return new JXG.Coords(JXG.COORDS_BY_USER, d, this.board)
};
JXG.Algebra.prototype.meetLineCircle = function (l, e, r) {
    var w, v, u, s, m, h, g, f, q, x;
    if (e[4] < this.eps) {
        return new JXG.Coords(JXG.COORDS_BY_USER, e.slice(1, 3), this.board)
    }
    u = e[0];
    v = e.slice(1, 3);
    w = e[3];
    s = l[0];
    m = l.slice(1, 3);
    h = w;
    g = (v[0] * m[1] - v[1] * m[0]);
    f = w * s * s - (v[0] * m[0] + v[1] * m[1]) * s + u;
    q = g * g - 4 * h * f;
    if (q >= 0) {
        q = Math.sqrt(q);
        x = [(-g + q) / (2 * h), (-g - q) / (2 * h)];
        return ((r == 0) ? new JXG.Coords(JXG.COORDS_BY_USER, [-x[0] * (-m[1]) - s * m[0], -x[0] * m[0] - s * m[1]], this.board) : new JXG.Coords(JXG.COORDS_BY_USER, [-x[1] * (-m[1]) - s * m[0], -x[1] * m[0] - s * m[1]], this.board))
    } else {
        return new JXG.Coords(JXG.COORDS_BY_USER, [NaN, NaN], this.board)
    }
};
JXG.Algebra.prototype.meetCircleCircle = function (c, a, b) {
    var d;
    if (c[4] < this.eps) {
        if (this.distance(c.slice(1, 3), a.slice(1, 3)) == a[4]) {
            return new JXG.Coords(JXG.COORDS_BY_USER, c.slice(1, 3), this.board)
        } else {
            return new JXG.Coords(JXG.COORDS_BY_USER, [NaN, NaN], this.board)
        }
    }
    if (a[4] < this.eps) {
        if (this.distance(a.slice(1, 3), c.slice(1, 3)) == c[4]) {
            return new JXG.Coords(JXG.COORDS_BY_USER, a.slice(1, 3), this.board)
        } else {
            return new JXG.Coords(JXG.COORDS_BY_USER, [NaN, NaN], this.board)
        }
    }
    d = [a[3] * c[0] - c[3] * a[0], a[3] * c[1] - c[3] * a[1], a[3] * c[2] - c[3] * a[2], 0, 1, Infinity, Infinity, Infinity];
    d = this.normalize(d);
    return this.meetLineCircle(d, c, b)
};
JXG.Algebra.prototype.normalize = function (c) {
    var a = 2 * c[3],
        d = c[4] / (a),
        e, b;
    c[5] = d;
    c[6] = -c[1] / a;
    c[7] = -c[2] / a;
    if (d == Infinity || isNaN(d)) {
        e = Math.sqrt(c[1] * c[1] + c[2] * c[2]);
        c[0] /= e;
        c[1] /= e;
        c[2] /= e;
        c[3] = 0;
        c[4] = 1
    } else {
        if (Math.abs(d) >= 1) {
            c[0] = (c[6] * c[6] + c[7] * c[7] - d * d) / (2 * d);
            c[1] = -c[6] / d;
            c[2] = -c[7] / d;
            c[3] = 1 / (2 * d);
            c[4] = 1
        } else {
            b = (d <= 0) ? (-1) : (1);
            c[0] = b * (c[6] * c[6] + c[7] * c[7] - d * d) * 0.5;
            c[1] = -b * c[6];
            c[2] = -b * c[7];
            c[3] = b / 2;
            c[4] = b * d
        }
    }
    return c
};
JXG.Algebra.prototype.meetCurveCurve = function (v, u, h, m) {
    var n = 0,
        r, q, D, B, z, y, g, x, w, s, C, A, l, k;
    if (arguments.callee.t1memo) {
        r = arguments.callee.t1memo;
        q = arguments.callee.t2memo
    } else {
        r = h;
        q = m
    }
    x = v.X(r) - u.X(q);
    w = v.Y(r) - u.Y(q);
    s = x * x + w * w;
    C = v.board.D(v.X, v);
    A = u.board.D(u.X, u);
    l = v.board.D(v.Y, v);
    k = u.board.D(u.Y, u);
    while (s > JXG.Math.eps && n < 10) {
        D = C(r);
        B = -A(q);
        z = l(r);
        y = -k(q);
        g = D * y - B * z;
        r -= (y * x - B * w) / g;
        q -= (D * w - z * x) / g;
        x = v.X(r) - u.X(q);
        w = v.Y(r) - u.Y(q);
        s = x * x + w * w;
        n++
    }
    arguments.callee.t1memo = r;
    arguments.callee.t2memo = q;
    if (Math.abs(r) < Math.abs(q)) {
        return (new JXG.Coords(JXG.COORDS_BY_USER, [v.X(r), v.Y(r)], this.board))
    } else {
        return (new JXG.Coords(JXG.COORDS_BY_USER, [u.X(q), u.Y(q)], this.board))
    }
};
JXG.Algebra.prototype.meetCurveLine = function (c, a, q) {
    var u, f, e, g, s, b, m, d, n, r, l, k, h;
    for (e = 0; e < arguments.length - 1; e++) {
        if (arguments[e].elementClass == JXG.OBJECT_CLASS_CURVE) {
            g = arguments[e]
        } else {
            if (arguments[e].elementClass == JXG.OBJECT_CLASS_LINE) {
                s = arguments[e]
            } else {
                throw new Error("JSXGraph: Can't call meetCurveLine with parent class '" + (arguments[e].elementClass) + ".")
            }
        }
    }
    b = function (v) {
        return s.stdform[0] * 1 + s.stdform[1] * g.X(v) + s.stdform[2] * g.Y(v)
    };
    if (arguments.callee.t1memo) {
        l = arguments.callee.t1memo
    } else {
        l = g.minX()
    }
    u = JXG.Math.Numerics.root(b, l);
    arguments.callee.t1memo = u;
    k = g.X(u);
    h = g.Y(u);
    if (q == 1) {
        if (arguments.callee.t2memo) {
            l = arguments.callee.t2memo;
            f = JXG.Math.Numerics.root(b, l)
        }
        if (!(Math.abs(f - u) > 0.1 && Math.abs(k - g.X(f)) > 0.1 && Math.abs(h - g.Y(f)) > 0.1)) {
            n = 20;
            r = (g.maxX() - g.minX()) / n;
            d = g.minX();
            for (e = 0; e < n; e++) {
                f = JXG.Math.Numerics.root(b, d);
                if (Math.abs(f - u) > 0.1 && Math.abs(k - g.X(f)) > 0.1 && Math.abs(h - g.Y(f)) > 0.1) {
                    break
                }
                d += r
            }
        }
        u = f;
        arguments.callee.t2memo = u
    }
    if (Math.abs(b(u)) > JXG.Math.eps) {
        m = 0
    } else {
        m = 1
    }
    return (new JXG.Coords(JXG.COORDS_BY_USER, [m, g.X(u), g.Y(u)], this.board))
};
JXG.Intersection = function (e, b, d, c, g, f, m, l) {
    this.constructor();
    this.board = e;
    this.id = b;
    this.name = this.id;
    this.visProp = {};
    this.visProp.visible = true;
    this.show = true;
    this.real = true;
    this.notExistingParents = {};
    this.intersect1 = JXG.getReference(this.board, d);
    this.intersect2 = JXG.getReference(this.board, c);
    this.type = JXG.OBJECT_TYPE_INTERSECTION;
    if (((this.intersect1 == "") || (this.intersect1 == undefined)) && ((this.intersect2 == "") || (this.intersect2 == undefined))) {
        return
    }
    if (((this.intersect1.type == this.intersect2.type) && (this.intersect1.type == JXG.OBJECT_TYPE_LINE || this.intersect1.type == JXG.OBJECT_TYPE_ARROW)) || ((this.intersect1.type == JXG.OBJECT_TYPE_LINE) && (this.intersect2.type == JXG.OBJECT_TYPE_ARROW)) || ((this.intersect2.type == JXG.OBJECT_TYPE_LINE) && (this.intersect1.type == JXG.OBJECT_TYPE_ARROW))) {
        var h = this.board.algebra.intersectLineLine(this.intersect1, this.intersect2).usrCoords.slice(1);
        this.p = new JXG.Point(this.board, h, g, m, true);
        this.p.fixed = true;
        this.addChild(this.p);
        this.real = true;
        this.update = function () {
            if (this.needsUpdate) {
                this.p.coords = this.board.algebra.intersectLineLine(this.intersect1, this.intersect2);
                this.needsUpdate = false
            }
        };
        this.hideElement = function () {
            this.visProp.visible = false;
            this.p.hideElement()
        };
        this.showElement = function () {
            this.visProp.visible = true;
            this.p.showElement()
        };
        this.hideChild = function (q) {
            this.notExistingParents[q] = this.board.objects[q];
            for (var n in this.descendants) {
                if (this.descendants[n].visProp.visible && this.descendants[n].type != JXG.OBJECT_TYPE_INTERSECTION) {
                    if (this.descendants[n].type != JXG.OBJECT_TYPE_TEXT) {
                        this.descendants[n].hideElement();
                        this.descendants[n].visProp.visible = true
                    } else {
                        if (!this.descendants[n].isLabel) {
                            this.descendants[n].hideElement();
                            this.descendants[n].visProp.visible = true
                        }
                    }
                }
                this.descendants[n].notExistingParents[q] = this.board.objects[q]
            }
        };
        this.showChild = function (q) {
            for (var n in this.board.objects) {
                delete(this.board.objects[n].notExistingParents[q]);
                if (this.board.objects[n].visProp.visible && JXG.keys(this.board.objects[n].notExistingParents).length == 0) {
                    if (this.board.objects[n].type != JXG.OBJECT_TYPE_INTERSECTION) {
                        this.board.objects[n].showElement()
                    }
                }
            }
        }
    } else {
        if (((d.type == c.type) && (d.type == JXG.OBJECT_TYPE_CIRCLE || d.type == JXG.OBJECT_TYPE_ARC)) || (d.type == JXG.OBJECT_TYPE_CIRCLE && c.type == JXG.OBJECT_TYPE_ARC) || (c.type == JXG.OBJECT_TYPE_CIRCLE && d.type == JXG.OBJECT_TYPE_ARC)) {
            this.p1 = new JXG.Point(this.board, [0, 0], g, m, false);
            this.p1.fixed = true;
            this.p1.label.content.visProp.visible = true;
            this.p2 = new JXG.Point(this.board, [0, 0], f, l, false);
            this.p2.fixed = true;
            this.p2.label.content.visProp.visible = true;
            this.addChild(this.p1);
            this.addChild(this.p2);
            var k = this.board.algebra.intersectCircleCircle(this.intersect1, this.intersect2);
            if (k[0] == 1) {
                this.p1.coords = k[1];
                this.p1.showElement();
                this.p1.updateRenderer();
                this.p2.coords = k[2];
                this.p2.showElement();
                this.p2.updateRenderer();
                this.real = true
            } else {
                this.real = false
            }
            this.update = function () {
                if (!this.needsUpdate) {
                    return
                }
                var r = this.board.algebra.intersectCircleCircle(this.intersect1, this.intersect2);
                var q = this.p1.visProp.visible;
                var n = this.p2.visProp.visible;
                if (r[0] == 0) {
                    if (this.real) {
                        this.hideChild(this.id);
                        this.p1.visProp.visible = q;
                        this.p2.visProp.visible = n;
                        this.real = false
                    }
                } else {
                    this.p1.coords = r[1];
                    this.p2.coords = r[2];
                    if (!this.real) {
                        this.showChild(this.id);
                        this.real = true
                    }
                }
                this.needsUpdate = false
            };
            this.hideElement = function () {
                this.visProp.visible = false;
                this.p1.hideElement();
                this.p2.hideElement()
            };
            this.showElement = function () {
                this.visProp.visible = true;
                this.p1.showElement();
                this.p2.showElement()
            };
            this.hideChild = function (q) {
                this.notExistingParents[q] = this.board.objects[q];
                for (var n in this.descendants) {
                    if (this.descendants[n].visProp.visible && this.descendants[n].type != JXG.OBJECT_TYPE_INTERSECTION) {
                        if (this.descendants[n].type != JXG.OBJECT_TYPE_TEXT) {
                            this.descendants[n].hideElement();
                            this.descendants[n].visProp.visible = true
                        } else {
                            if (!this.descendants[n].isLabel) {
                                this.descendants[n].hideElement();
                                this.descendants[n].visProp.visible = true
                            }
                        }
                    }
                    this.descendants[n].notExistingParents[q] = this.board.objects[q]
                }
            };
            this.showChild = function (q) {
                var n;
                for (n in this.board.objects) {
                    delete(this.board.objects[n].notExistingParents[q]);
                    if (this.board.objects[n].visProp.visible && JXG.keys(this.board.objects[n].notExistingParents).length == 0) {
                        if (this.board.objects[n].type != JXG.OBJECT_TYPE_INTERSECTION) {
                            this.board.objects[n].showElement()
                        }
                    }
                }
            }
        } else {
            this.p1 = new JXG.Point(this.board, [0, 0], g, m, false);
            this.p1.fixed = true;
            this.p1.label.content.visProp.visible = true;
            this.p2 = new JXG.Point(this.board, [0, 0], f, l, false);
            this.p2.fixed = true;
            this.p2.label.content.visProp.visible = true;
            this.addChild(this.p1);
            this.addChild(this.p2);
            if (this.intersect1.type == JXG.OBJECT_TYPE_LINE || this.intersect1.type == JXG.OBJECT_TYPE_ARROW) {
                var a = this.intersect1;
                this.intersect1 = this.intersect2;
                this.intersect2 = a
            }
            var k = this.board.algebra.intersectCircleLine(this.intersect1, this.intersect2);
            if (k[0] == 1) {
                this.p1.coords = k[1];
                this.p1.showElement();
                this.p1.update()
            } else {
                if (k[0] == 2) {
                    this.p1.coords = k[1];
                    this.p1.showElement();
                    this.p2.coords = k[2];
                    this.p2.showElement();
                    this.p1.updateRenderer();
                    this.p2.updateRenderer();
                    this.real = true
                } else {
                    this.real = false
                }
            }
            this.update = function () {
                if (!this.needsUpdate) {
                    return
                }
                var r = this.board.algebra.intersectCircleLine(this.intersect1, this.intersect2);
                var q = this.p1.visProp.visible;
                var n = this.p2.visProp.visible;
                if (r[0] == 0) {
                    if (this.real) {
                        this.hideChild(this.id);
                        this.p1.visProp.visible = q;
                        this.p2.visProp.visible = n;
                        this.real = false
                    }
                } else {
                    if (r[0] == 2) {
                        this.p1.coords = r[1];
                        this.p2.coords = r[2];
                        if (!this.real) {
                            this.showChild(this.id);
                            this.real = true
                        }
                    }
                }
                this.needsUpdate = false
            };
            this.hideElement = function () {
                this.visProp.visible = false;
                this.p1.hideElement();
                this.p2.hideElement()
            };
            this.showElement = function () {
                this.visProp.visible = true;
                this.p1.showElement();
                this.p2.showElement()
            };
            this.hideChild = function (q) {
                this.notExistingParents[q] = this.board.objects[q];
                for (var n in this.descendants) {
                    if (this.descendants[n].visProp.visible && this.descendants[n].type != JXG.OBJECT_TYPE_INTERSECTION) {
                        if (this.descendants[n].type != JXG.OBJECT_TYPE_TEXT) {
                            this.descendants[n].hideElement();
                            this.descendants[n].visProp.visible = true
                        } else {
                            if (!this.descendants[n].isLabel) {
                                this.descendants[n].hideElement();
                                this.descendants[n].visProp.visible = true
                            }
                        }
                    }
                    this.descendants[n].notExistingParents[q] = this.board.objects[q]
                }
            };
            this.showChild = function (q) {
                var n;
                for (n in this.board.objects) {
                    delete(this.board.objects[n].notExistingParents[q]);
                    if (this.board.objects[n].visProp.visible && JXG.keys(this.board.objects[n].notExistingParents).length == 0) {
                        if (this.board.objects[n].type != JXG.OBJECT_TYPE_INTERSECTION) {
                            this.board.objects[n].showElement()
                        }
                    }
                }
            }
        }
    }
    this.id = this.board.addIntersection(this)
};
JXG.Intersection.prototype = new JXG.GeometryElement();
JXG.Intersection.prototype.update = function () {
    return
};
JXG.Intersection.prototype.hasPoint = function (a, b) {
    return false
};
JXG.Intersection.prototype.hideChild = function (a) {};
JXG.Intersection.prototype.showChild = function (a) {};
JXG.Intersection.prototype.remove = function () {
    if (this.p != undefined) {
        this.board.removeObject(this.p)
    }
    if (this.p1 != undefined) {
        this.board.removeObject(this.p1)
    }
    if (this.p2 != undefined) {
        this.board.removeObject(this.p2)
    }
    return
};
JXG.Intersection.prototype.updateRenderer = function () {};
JXG.createPerpendicularPoint = function (c, f, e) {
    var a, d, b;
    if (JXG.isPoint(f[0]) && f[1].type == JXG.OBJECT_TYPE_LINE) {
        d = f[0];
        a = f[1]
    } else {
        if (JXG.isPoint(f[1]) && f[0].type == JXG.OBJECT_TYPE_LINE) {
            d = f[1];
            a = f[0]
        } else {
            throw new Error("JSXGraph: Can't create perpendicular point with parent types '" + (typeof f[0]) + "' and '" + (typeof f[1]) + "'.")
        }
    }
    b = JXG.createPoint(c, [function () {
        return c.algebra.perpendicular(a, d)[0]
    }], {
        fixed: true,
        name: e.name,
        id: e.id
    });
    d.addChild(b);
    a.addChild(b);
    b.update();
    b.generatePolynomial = function () {
        var h = a.point1.symbolic.x;
        var g = a.point1.symbolic.y;
        var r = a.point2.symbolic.x;
        var q = a.point2.symbolic.y;
        var u = d.symbolic.x;
        var s = d.symbolic.y;
        var m = b.symbolic.x;
        var k = b.symbolic.y;
        var n = "(" + g + ")*(" + m + ")-(" + g + ")*(" + r + ")+(" + k + ")*(" + r + ")-(" + h + ")*(" + k + ")+(" + h + ")*(" + q + ")-(" + m + ")*(" + q + ")";
        var l = "(" + s + ")*(" + g + ")-(" + s + ")*(" + q + ")-(" + k + ")*(" + g + ")+(" + k + ")*(" + q + ")+(" + u + ")*(" + h + ")-(" + u + ")*(" + r + ")-(" + m + ")*(" + h + ")+(" + m + ")*(" + r + ")";
        return [n, l]
    };
    return b
};
JXG.createPerpendicular = function (e, h, g) {
    var f, a, b, d, c;
    h[0] = JXG.getReference(e, h[0]);
    h[1] = JXG.getReference(e, h[1]);
    if (JXG.isPoint(h[0]) && h[1].elementClass == JXG.OBJECT_CLASS_LINE) {
        a = h[1];
        f = h[0]
    } else {
        if (JXG.isPoint(h[1]) && h[0].elementClass == JXG.OBJECT_CLASS_LINE) {
            a = h[0];
            f = h[1]
        } else {
            throw new Error("JSXGraph: Can't create perpendicular with parent types '" + (typeof h[0]) + "' and '" + (typeof h[1]) + "'.")
        }
    }
    if (!JXG.isArray(g.id)) {
        g.id = ["", ""]
    }
    if (!JXG.isArray(g.name)) {
        g.name = ["", ""]
    }
    d = JXG.createPerpendicularPoint(e, [a, f], {
        fixed: true,
        name: g.name[1],
        id: g.id[1],
        visible: false
    });
    b = JXG.createSegment(e, [function () {
        return (e.algebra.perpendicular(a, f)[1] ? [d, f] : [f, d])
    }], {
        name: g.name[0],
        id: g.id[0]
    });
    c = [b, d];
    c.line = b;
    c.point = d;
    c.multipleElements = true;
    return c
};
JXG.createMidpoint = function (f, h, g) {
    var d, c, e;
    if (h.length == 2 && JXG.isPoint(h[0]) && JXG.isPoint(h[1])) {
        d = h[0];
        c = h[1]
    } else {
        if (h.length == 1 && h[0].elementClass == JXG.OBJECT_CLASS_LINE) {
            d = h[0].point1;
            c = h[0].point2
        } else {
            throw new Error("JSXGraph: Can't create midpoint.")
        }
    }
    if (g) {
        g.fixed = true
    } else {
        g = {
            fixed: true
        }
    }
    e = f.create("point", [function () {
        return (d.coords.usrCoords[1] + c.coords.usrCoords[1]) / 2
    }, function () {
        return (d.coords.usrCoords[2] + c.coords.usrCoords[2]) / 2
    }], g);
    d.addChild(e);
    c.addChild(e);
    e.update();
    e.generatePolynomial = function () {
        var k = d.symbolic.x;
        var b = d.symbolic.y;
        var m = c.symbolic.x;
        var l = c.symbolic.y;
        var q = e.symbolic.x;
        var n = e.symbolic.y;
        var a = "(" + b + ")*(" + q + ")-(" + b + ")*(" + m + ")+(" + n + ")*(" + m + ")-(" + k + ")*(" + n + ")+(" + k + ")*(" + l + ")-(" + q + ")*(" + l + ")";
        var r = "(" + k + ")^2 - 2*(" + k + ")*(" + q + ")+(" + b + ")^2-2*(" + b + ")*(" + n + ")-(" + m + ")^2+2*(" + m + ")*(" + q + ")-(" + l + ")^2+2*(" + l + ")*(" + n + ")";
        return [a, r]
    };
    if (JXG.nullAtts) {
        g = null
    }
    return e
};
JXG.createParallelPoint = function (f, l, k) {
    var e, d, h, g;
    if (l.length == 3 && l[0].elementClass == JXG.OBJECT_CLASS_POINT && l[1].elementClass == JXG.OBJECT_CLASS_POINT && l[2].elementClass == JXG.OBJECT_CLASS_POINT) {
        e = l[0];
        d = l[1];
        h = l[2]
    } else {
        if (l[0].elementClass == JXG.OBJECT_CLASS_POINT && l[1].elementClass == JXG.OBJECT_CLASS_LINE) {
            h = l[0];
            e = l[1].point1;
            d = l[1].point2
        } else {
            if (l[1].elementClass == JXG.OBJECT_CLASS_POINT && l[0].elementClass == JXG.OBJECT_CLASS_LINE) {
                h = l[1];
                e = l[0].point1;
                d = l[0].point2
            } else {
                throw new Error("JSXGraph: Can't create parallel point with parent types '" + (typeof l[0]) + "', '" + (typeof l[1]) + "' and '" + (typeof l[2]) + "'.")
            }
        }
    }
    g = f.create("point", [function () {
        return h.coords.usrCoords[1] + d.coords.usrCoords[1] - e.coords.usrCoords[1]
    }, function () {
        return h.coords.usrCoords[2] + d.coords.usrCoords[2] - e.coords.usrCoords[2]
    }], k);
    h.addChild(g);
    g.update();
    g.generatePolynomial = function () {
        var b = e.symbolic.x;
        var a = e.symbolic.y;
        var v = d.symbolic.x;
        var u = d.symbolic.y;
        var m = h.symbolic.x;
        var c = h.symbolic.y;
        var r = g.symbolic.x;
        var n = g.symbolic.y;
        var s = "(" + u + ")*(" + r + ")-(" + u + ")*(" + m + ")-(" + a + ")*(" + r + ")+(" + a + ")*(" + m + ")-(" + n + ")*(" + v + ")+(" + n + ")*(" + b + ")+(" + c + ")*(" + v + ")-(" + c + ")*(" + b + ")";
        var q = "(" + n + ")*(" + b + ")-(" + n + ")*(" + m + ")-(" + u + ")*(" + b + ")+(" + u + ")*(" + m + ")-(" + r + ")*(" + a + ")+(" + r + ")*(" + c + ")+(" + v + ")*(" + a + ")-(" + v + ")*(" + c + ")";
        return [s, q]
    };
    return g
};
JXG.createParallel = function (d, b, k) {
    var h, a, c, f;
    f = {
        name: null,
        id: null,
        fixed: true,
        visible: false
    };
    if (JXG.isArray(k.name) && k.name.length == 2) {
        f.name = k.name[1];
        k.name = k.name[0]
    } else {
        f.name = k.name + "p2"
    }
    if (JXG.isArray(k.id) && k.id.length == 2) {
        f.id = k.id[1];
        k.id = k.id[0]
    } else {
        f.id = k.id + "p2"
    }
    try {
        a = JXG.createParallelPoint(d, b, f)
    } catch (g) {
        throw new Error("JSXGraph: Can't create parallel with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "'.")
    }
    h = null;
    if (b.length == 3) {
        h = b[2]
    } else {
        if (b[0].elementClass == JXG.OBJECT_CLASS_POINT) {
            h = b[0]
        } else {
            if (b[1].elementClass == JXG.OBJECT_CLASS_POINT) {
                h = b[1]
            }
        }
    }
    c = d.create("line", [h, a], k);
    return c
};
JXG.createArrowParallel = function (c, b, g) {
    var a, d;
    try {
        a = JXG.createParallel(c, b, g)
    } catch (f) {
        throw new Error("JSXGraph: Can't create arrowparallel with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "'.")
    }
    a.setStraight(false, false);
    a.setArrow(false, true);
    return a
};
JXG.createNormal = function (d, b, a) {
    var k;
    var l;
    if (b.length == 1) {
        k = b[0];
        l = k.slideObject
    } else {
        if (b.length == 2) {
            if (JXG.isPoint(b[0])) {
                k = b[0];
                l = b[1]
            } else {
                if (JXG.isPoint(b[1])) {
                    l = b[0];
                    k = b[1]
                } else {
                    throw new Error("JSXGraph: Can't create normal with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "'.")
                }
            }
        } else {
            throw new Error("JSXGraph: Can't create normal with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "'.")
        }
    }
    if (l.elementClass == JXG.OBJECT_CLASS_LINE) {
        return d.create("line", [function () {
            return l.stdform[1] * k.Y() - l.stdform[2] * k.X()
        }, function () {
            return l.stdform[2] * k.Z()
        }, function () {
            return -l.stdform[1] * k.Z()
        }], a)
    } else {
        if (l.elementClass == JXG.OBJECT_CLASS_CIRCLE) {
            return d.create("line", [l.midpoint, k], a)
        } else {
            if (l.elementClass == JXG.OBJECT_CLASS_CURVE) {
                if (l.curveType != "plot") {
                    var e = l.X;
                    var h = l.Y;
                    return d.create("line", [function () {
                        return -k.X() * d.D(e)(k.position) - k.Y() * d.D(h)(k.position)
                    }, function () {
                        return d.D(e)(k.position)
                    }, function () {
                        return d.D(h)(k.position)
                    }], a)
                } else {
                    return d.create("line", [function () {
                        var f = Math.floor(k.position);
                        var c = k.position - f;
                        if (f == l.numberPoints - 1) {
                            f--;
                            c = 1
                        }
                        if (f < 0) {
                            return 1
                        }
                        return (l.Y(f) + c * (l.Y(f + 1) - l.Y(f))) * (l.Y(f) - l.Y(f + 1)) - (l.X(f) + c * (l.X(f + 1) - l.X(f))) * (l.X(f + 1) - l.X(f))
                    }, function () {
                        var c = Math.floor(k.position);
                        if (c == l.numberPoints - 1) {
                            c--
                        }
                        if (c < 0) {
                            return 0
                        }
                        return l.X(c + 1) - l.X(c)
                    }, function () {
                        var c = Math.floor(k.position);
                        if (c == l.numberPoints - 1) {
                            c--
                        }
                        if (c < 0) {
                            return 0
                        }
                        return l.Y(c + 1) - l.Y(c)
                    }], a)
                }
            } else {
                if (l.type == JXG.OBJECT_TYPE_TURTLE) {
                    return d.create("line", [function () {
                        var g = Math.floor(k.position);
                        var c = k.position - g;
                        var m, f;
                        for (f = 0; f < l.objects.length; f++) {
                            m = l.objects[f];
                            if (m.type == JXG.OBJECT_TYPE_CURVE) {
                                if (g < m.numberPoints) {
                                    break
                                }
                                g -= m.numberPoints
                            }
                        }
                        if (g == m.numberPoints - 1) {
                            g--;
                            c = 1
                        }
                        if (g < 0) {
                            return 1
                        }
                        return (m.Y(g) + c * (m.Y(g + 1) - m.Y(g))) * (m.Y(g) - m.Y(g + 1)) - (m.X(g) + c * (m.X(g + 1) - m.X(g))) * (m.X(g + 1) - m.X(g))
                    }, function () {
                        var f = Math.floor(k.position);
                        var g, c;
                        for (c = 0; c < l.objects.length; c++) {
                            g = l.objects[c];
                            if (g.type == JXG.OBJECT_TYPE_CURVE) {
                                if (f < g.numberPoints) {
                                    break
                                }
                                f -= g.numberPoints
                            }
                        }
                        if (f == g.numberPoints - 1) {
                            f--
                        }
                        if (f < 0) {
                            return 0
                        }
                        return g.X(f + 1) - g.X(f)
                    }, function () {
                        var f = Math.floor(k.position);
                        var g, c;
                        for (c = 0; c < l.objects.length; c++) {
                            g = l.objects[c];
                            if (g.type == JXG.OBJECT_TYPE_CURVE) {
                                if (f < g.numberPoints) {
                                    break
                                }
                                f -= g.numberPoints
                            }
                        }
                        if (f == g.numberPoints - 1) {
                            f--
                        }
                        if (f < 0) {
                            return 0
                        }
                        return g.Y(f + 1) - g.Y(f)
                    }], a)
                } else {
                    throw new Error("JSXGraph: Can't create normal with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "'.")
                }
            }
        }
    }
};
JXG.createBisector = function (c, g, f) {
    var e, a, d, b;
    if (g[0].elementClass == JXG.OBJECT_CLASS_POINT && g[1].elementClass == JXG.OBJECT_CLASS_POINT && g[2].elementClass == JXG.OBJECT_CLASS_POINT) {
        d = {
            name: "",
            id: null,
            fixed: true,
            visible: false
        };
        if (f) {
            d = JXG.cloneAndCopy(f, d)
        }
        e = c.create("point", [function () {
            return c.algebra.angleBisector(g[0], g[1], g[2])
        }], d);
        for (b = 0; b < 3; b++) {
            g[b].addChild(e)
        }
        if (typeof f.straightFirst == "undefined") {
            f.straightFirst = false
        }
        if (typeof f.straightLast == "undefined") {
            f.straightLast = true
        }
        a = JXG.createLine(c, [g[1], e], f);
        return a
    } else {
        throw new Error("JSXGraph: Can't create angle bisector with parent types '" + (typeof g[0]) + "' and '" + (typeof g[1]) + "'.")
    }
};
JXG.createAngularBisectorsOfTwoLines = function (g, k, d) {
    var c = JXG.getReference(g, k[0]),
        b = JXG.getReference(g, k[1]),
        m = "",
        l = "",
        h = "",
        e = "",
        f;
    d = JXG.checkAttributes(d, {});
    if (d.id != null) {
        if (JXG.isArray(d.id)) {
            m = d.id[0];
            l = d.id[1]
        } else {
            m = d.id;
            l = d.id
        }
    }
    if (d.name != null) {
        if (JXG.isArray(d.name)) {
            h = d.name[0];
            e = d.name[1]
        } else {
            h = d.name;
            e = d.name
        }
    }
    d.id = m;
    d.name = h;
    var a = g.create("line", [function () {
        var r = Math.sqrt(c.stdform[1] * c.stdform[1] + c.stdform[2] * c.stdform[2]);
        var q = Math.sqrt(b.stdform[1] * b.stdform[1] + b.stdform[2] * b.stdform[2]);
        return c.stdform[0] / r - b.stdform[0] / q
    }, function () {
        var r = Math.sqrt(c.stdform[1] * c.stdform[1] + c.stdform[2] * c.stdform[2]);
        var q = Math.sqrt(b.stdform[1] * b.stdform[1] + b.stdform[2] * b.stdform[2]);
        return c.stdform[1] / r - b.stdform[1] / q
    }, function () {
        var r = Math.sqrt(c.stdform[1] * c.stdform[1] + c.stdform[2] * c.stdform[2]);
        var q = Math.sqrt(b.stdform[1] * b.stdform[1] + b.stdform[2] * b.stdform[2]);
        return c.stdform[2] / r - b.stdform[2] / q
    }], d);
    d.id = l;
    d.name = e;
    var n = g.create("line", [function () {
        var r = Math.sqrt(c.stdform[1] * c.stdform[1] + c.stdform[2] * c.stdform[2]);
        var q = Math.sqrt(b.stdform[1] * b.stdform[1] + b.stdform[2] * b.stdform[2]);
        return c.stdform[0] / r + b.stdform[0] / q
    }, function () {
        var r = Math.sqrt(c.stdform[1] * c.stdform[1] + c.stdform[2] * c.stdform[2]);
        var q = Math.sqrt(b.stdform[1] * b.stdform[1] + b.stdform[2] * b.stdform[2]);
        return c.stdform[1] / r + b.stdform[1] / q
    }, function () {
        var r = Math.sqrt(c.stdform[1] * c.stdform[1] + c.stdform[2] * c.stdform[2]);
        var q = Math.sqrt(b.stdform[1] * b.stdform[1] + b.stdform[2] * b.stdform[2]);
        return c.stdform[2] / r + b.stdform[2] / q
    }], d);
    f = [a, n];
    f.lines = [a, n];
    f.line1 = a;
    f.line2 = n;
    f.multipleElements = true;
    return f
};
JXG.createCircumcircleMidpoint = function (b, e, d) {
    var c, a;
    if (e[0].elementClass == JXG.OBJECT_CLASS_POINT && e[1].elementClass == JXG.OBJECT_CLASS_POINT && e[2].elementClass == JXG.OBJECT_CLASS_POINT) {
        d.fixed = d.fixed || true;
        c = JXG.createPoint(b, [function () {
            return b.algebra.circumcenterMidpoint(e[0], e[1], e[2])
        }], d);
        for (a = 0; a < 3; a++) {
            e[a].addChild(c)
        }
        return c
    } else {
        throw new Error("JSXGraph: Can't create circumcircle midpoint with parent types '" + (typeof e[0]) + "', '" + (typeof e[1]) + "' and '" + (typeof e[2]) + "'.")
    }
};
JXG.createCircumcircle = function (b, l, k) {
    var g, h, d, a;
    d = JXG.clone(k);
    if (k.name && JXG.isArray(k.name)) {
        d.name = k.name[0];
        k.name = k.name[1]
    }
    if (k.id && JXG.isArray(k.id)) {
        d.id = k.id[0];
        k.id = k.id[1]
    }
    try {
        g = JXG.createCircumcircleMidpoint(b, l, d);
        h = JXG.createCircle(b, [g, l[0]], k)
    } catch (f) {
        throw new Error("JSXGraph: Can't create circumcircle with parent types '" + (typeof l[0]) + "', '" + (typeof l[1]) + "' and '" + (typeof l[2]) + "'.")
    }
    a = [g, h];
    a.point = g;
    a.circle = h;
    a.multipleElements = true;
    return a
};
JXG.createReflection = function (b, f, e) {
    var a, d, c;
    if (f[0].elementClass == JXG.OBJECT_CLASS_POINT && f[1].elementClass == JXG.OBJECT_CLASS_LINE) {
        d = f[0];
        a = f[1]
    } else {
        if (f[1].elementClass == JXG.OBJECT_CLASS_POINT && f[0].elementClass == JXG.OBJECT_CLASS_LINE) {
            d = f[1];
            a = f[0]
        } else {
            throw new Error("JSXGraph: Can't create reflection point with parent types '" + (typeof f[0]) + "' and '" + (typeof f[1]) + "'.")
        }
    }
    e.fixed = true;
    c = JXG.createPoint(b, [function () {
        return b.algebra.reflection(a, d)
    }], e);
    d.addChild(c);
    a.addChild(c);
    c.update();
    return c
};
JXG.createMirrorPoint = function (a, d, c) {
    var b;
    if (JXG.isPoint(d[0]) && JXG.isPoint(d[1])) {
        c.fixed = c.fixed || true;
        b = JXG.createPoint(a, [function () {
            return a.algebra.rotation(d[0], d[1], Math.PI)
        }], c);
        for (i = 0; i < 2; i++) {
            d[i].addChild(b)
        }
    } else {
        throw new Error("JSXGraph: Can't create mirror point with parent types '" + (typeof d[0]) + "' and '" + (typeof d[1]) + "'.")
    }
    b.update();
    return b
};
JXG.createIntegral = function (f, x, l) {
    var w, s, q = {},
        d = 0,
        c = 0,
        b, a, k, h, r = 1,
        v, m, e, y, g, n, u;
    if (!JXG.isArray(l.id) || (l.id.length != 5)) {
        l.id = ["", "", "", "", ""]
    }
    if (!JXG.isArray(l.name) || (l.name.length != 5)) {
        l.name = ["", "", "", "", ""]
    }
    if (JXG.isArray(x[0]) && x[1].elementClass == JXG.OBJECT_CLASS_CURVE) {
        w = x[0];
        s = x[1]
    } else {
        if (JXG.isArray(x[1]) && x[0].elementClass == JXG.OBJECT_CLASS_CURVE) {
            w = x[1];
            s = x[0]
        } else {
            throw new Error("JSXGraph: Can't create integral with parent types '" + (typeof x[0]) + "' and '" + (typeof x[1]) + "'.")
        }
    }
    if ((typeof l != "undefined") && (l != null)) {
        q = JXG.cloneAndCopy(l, {
            name: l.name[0],
            id: l.id[0]
        })
    }
    d = w[0];
    c = w[1];
    if (JXG.isFunction(d)) {
        b = d;
        a = function () {
            return s.yterm(b())
        };
        d = b()
    } else {
        b = d;
        a = s.yterm(d)
    }
    if (JXG.isFunction(d)) {
        k = c;
        h = function () {
            return s.yterm(k())
        };
        c = k()
    } else {
        k = c;
        h = s.yterm(c)
    }
    if (c < d) {
        r = -1
    }
    v = f.create("glider", [b, a, s], q);
    if (JXG.isFunction(b)) {
        v.hideElement()
    }
    q.name = l.name[1];
    q.id = l.id[1];
    q.visible = false;
    m = f.create("point", [function () {
        return v.X()
    },
    0], q);
    q.name = l.name[2];
    q.id = l.id[2];
    q.visible = l.visible || true;
    e = f.create("glider", [k, h, s], q);
    if (JXG.isFunction(k)) {
        e.hideElement()
    }
    q.name = l.name[3];
    q.id = l.id[3];
    q.visible = false;
    y = f.create("point", [function () {
        return e.X()
    },
    0], q);
    g = JXG.Math.Numerics.I([d, c], s.yterm);
    n = f.create("text", [function () {
        return e.X() + 0.2
    }, function () {
        return e.Y() - 0.8
    }, function () {
        var z = JXG.Math.Numerics.I([m.X(), y.X()], s.yterm);
        return "&int; = " + (z).toFixed(4)
    }], {
        labelColor: l.labelColor
    });
    q.name = l.name[4];
    q.id = l.id[4];
    q.visible = l.visible || true;
    q.fillColor = q.fillColor || f.options.polygon.fillColor;
    q.highlightFillColor = q.highlightFillColor || f.options.polygon.highlightFillColor;
    q.fillOpacity = q.fillOpacity || f.options.polygon.fillOpacity;
    q.highlightFillOpacity = q.highlightFillOpacity || f.options.polygon.highlightFillOpacity;
    q.strokeWidth = 0;
    q.highlightStrokeWidth = 0;
    q.strokeOpacity = 0;
    u = f.create("curve", [
        [0],
        [0]
    ], q);
    u.updateDataArray = function () {
        var z, D, B, C, A;
        if (m.X() < y.X()) {
            C = m.X();
            A = y.X()
        } else {
            C = y.X();
            A = m.X()
        }
        z = [C, C];
        D = [0, s.yterm(C)];
        for (B = 0; B < s.numberPoints; B++) {
            if ((C <= s.points[B].usrCoords[1]) && (s.points[B].usrCoords[1] <= A)) {
                z.push(s.points[B].usrCoords[1]);
                D.push(s.points[B].usrCoords[2])
            }
        }
        z.push(A);
        D.push(s.yterm(A));
        z.push(A);
        D.push(0);
        z.push(C);
        D.push(0);
        this.dataX = z;
        this.dataY = D
    };
    v.addChild(u);
    e.addChild(u);
    v.addChild(n);
    e.addChild(n);
    return u
};
JXG.createLocus = function (d, b, a) {
    var f, e;
    if (JXG.isArray(b) && b.length == 1 && b[0].elementClass == JXG.OBJECT_CLASS_POINT) {
        e = b[0]
    } else {
        throw new Error("JSXGraph: Can't create locus with parent of type other than point.")
    }
    f = d.create("curve", [
        [null],
        [null]
    ], a);
    f.dontCallServer = false;
    f.updateDataArray = function () {
        cb = function (g, h, c) {
            f.dataX = g;
            f.dataY = h;
            d.update()
        };
        if (d.mode == d.BOARD_MODE_NONE && !this.dontCallServer) {
            JXG.Math.Symbolic.geometricLocusByGroebnerBase(d, e, cb);
            this.dontCallServer = true
        } else {
            this.dontCallServer = false
        }
    };
    return f
};
JXG.JSXGraph.registerElement("arrowparallel", JXG.createArrowParallel);
JXG.JSXGraph.registerElement("bisector", JXG.createBisector);
JXG.JSXGraph.registerElement("bisectorlines", JXG.createAngularBisectorsOfTwoLines);
JXG.JSXGraph.registerElement("circumcircle", JXG.createCircumcircle);
JXG.JSXGraph.registerElement("circumcirclemidpoint", JXG.createCircumcircleMidpoint);
JXG.JSXGraph.registerElement("integral", JXG.createIntegral);
JXG.JSXGraph.registerElement("midpoint", JXG.createMidpoint);
JXG.JSXGraph.registerElement("mirrorpoint", JXG.createMirrorPoint);
JXG.JSXGraph.registerElement("normal", JXG.createNormal);
JXG.JSXGraph.registerElement("parallel", JXG.createParallel);
JXG.JSXGraph.registerElement("parallelpoint", JXG.createParallelPoint);
JXG.JSXGraph.registerElement("perpendicular", JXG.createPerpendicular);
JXG.JSXGraph.registerElement("perpendicularpoint", JXG.createPerpendicularPoint);
JXG.JSXGraph.registerElement("reflection", JXG.createReflection);
JXG.JSXGraph.registerElement("locus", JXG.createLocus);
JXG.Text = function (k, q, f, n, c, a, d, m, l, h) {
    this.constructor();
    this.type = JXG.OBJECT_TYPE_TEXT;
    this.elementClass = JXG.OBJECT_CLASS_OTHER;
    this.init(k, c, a);
    this.contentStr = q;
    this.plaintextStr = "";
    if (h == null) {
        h = k.options.layer.text
    }
    this.layer = h;
    this.display = l || "html";
    if ((typeof m != "undefined") && (m != null)) {
        this.isLabel = m
    } else {
        this.isLabel = false
    }
    this.visProp.strokeColor = this.board.options.text.strokeColor;
    this.visProp.visible = true;
    if (d != null) {
        this.digits = d
    } else {
        this.digits = 2
    }
    if ((this.element = this.board.objects[f])) {
        var e;
        if (!this.isLabel) {
            e = this.element.getTextAnchor()
        } else {
            e = this.element.getLabelAnchor()
        }
        this.element.addChild(this);
        this.relativeCoords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [parseFloat(n[0]), parseFloat(n[1])], this.board);
        this.coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [this.relativeCoords.scrCoords[1] + e.scrCoords[1], this.relativeCoords.scrCoords[2] + e.scrCoords[2]], this.board)
    } else {
        this.X = JXG.createFunction(n[0], this.board, "");
        this.Y = JXG.createFunction(n[1], this.board, "");
        this.coords = new JXG.Coords(JXG.COORDS_BY_USER, [this.X(), this.Y()], this.board);
        var g = "this.coords.setCoordinates(JXG.COORDS_BY_USER,[this.X(),this.Y()]);";
        this.updateCoords = new Function("", g)
    }
    if (typeof this.contentStr == "function") {
        this.updateText = function () {
            this.plaintextStr = this.contentStr()
        }
    } else {
        var b;
        if (typeof this.contentStr == "number") {
            b = (this.contentStr).toFixed(this.digits)
        } else {
            if (this.board.options.text.useASCIIMathML) {
                b = "'`" + this.contentStr + "`'"
            } else {
                b = this.generateTerm(this.contentStr)
            }
        }
        this.updateText = new Function("this.plaintextStr = " + b + ";")
    }
    if (!this.isLabel) {
        this.id = this.board.addText(this)
    }
    if (typeof this.contentStr == "string") {
        this.notifyParents(this.contentStr)
    }
};
JXG.Text.prototype = new JXG.GeometryElement();
JXG.Text.prototype.hasPoint = function (a, b) {
    return false
};
JXG.Text.prototype.setText = function (b) {
    var a;
    if (typeof b == "number") {
        a = (b).toFixed(this.digits)
    } else {
        a = this.generateTerm(b)
    }
    this.updateText = new Function("this.plaintextStr = " + a + ";");
    this.updateText();
    return this
};
JXG.Text.prototype.setCoords = function (a, b) {
    this.X = function () {
        return a
    };
    this.Y = function () {
        return b
    };
    this.coords = new JXG.Coords(JXG.COORDS_BY_USER, [a, b], this.board);
    return this
};
JXG.Text.prototype.update = function () {
    if (this.needsUpdate && !this.frozen) {
        if (this.relativeCoords) {
            var a;
            if (!this.isLabel) {
                a = this.element.getTextAnchor()
            } else {
                a = this.element.getLabelAnchor()
            }
            this.coords.setCoordinates(JXG.COORDS_BY_SCREEN, [this.relativeCoords.scrCoords[1] + a.scrCoords[1], this.relativeCoords.scrCoords[2] + a.scrCoords[2]])
        } else {
            this.updateCoords()
        }
    }
    if (this.needsUpdate) {
        this.updateText()
    }
    return this
};
JXG.Text.prototype.updateRenderer = function () {
    if (this.needsUpdate) {
        this.board.renderer.updateText(this);
        this.needsUpdate = false
    }
    return this
};
JXG.Text.prototype.generateTerm = function (e) {
    var d = null;
    var g = this.board.elementsByName;
    var f = '""';
    e = e.replace(/\r/g, "");
    e = e.replace(/\n/g, "");
    e = e.replace(/\"/g, '\\"');
    e = e.replace(/\'/g, "\\'");
    e = e.replace(/&amp;arc;/g, "&ang;");
    e = e.replace(/<arc\s*\/>/g, "&ang;");
    e = e.replace(/<sqrt\s*\/>/g, "&radic;");
    var c;
    c = e.indexOf("<value>");
    var a = e.indexOf("</value>");
    if (c >= 0) {
        while (c >= 0) {
            f += ' + "' + this.board.algebra.replaceSub(this.board.algebra.replaceSup(e.slice(0, c))) + '"';
            var b = e.slice(c + 7, a);
            var d = this.board.algebra.geonext2JS(b);
            d = d.replace(/\\"/g, '"');
            d = d.replace(/\\'/g, "'");
            if (d.indexOf("toFixed") < 0) {
                f += "+(" + d + ").toFixed(" + (this.digits) + ")"
            } else {
                f += "+(" + d + ")"
            }
            e = e.slice(a + 8);
            c = e.indexOf("<value>");
            a = e.indexOf("</value>")
        }
    }
    f += ' + "' + this.board.algebra.replaceSub(this.board.algebra.replaceSup(e)) + '"';
    f = f.replace(/<overline>/g, "<span style=text-decoration:overline>");
    f = f.replace(/<\/overline>/g, "</span>");
    f = f.replace(/<arrow>/g, "<span style=text-decoration:overline>");
    f = f.replace(/<\/arrow>/g, "</span>");
    f = f.replace(/&amp;/g, "&");
    return f
};
JXG.Text.prototype.notifyParents = function (c) {
    var b = null;
    var d = this.board.elementsByName;
    do {
        var a = /<value>([\w\s\*\/\^\-\+\(\)\[\],<>=!]+)<\/value>/;
        b = a.exec(c);
        if (b != null) {
            this.board.algebra.findDependencies(this, b[1]);
            c = c.substr(b.index);
            c = c.replace(a, "")
        }
    } while (b != null);
    return this
};
JXG.createText = function (a, c, b) {
    b = JXG.checkAttributes(b, {
        layer: null,
        display: a.options.text.defaultDisplay
    });
    return new JXG.Text(a, c[c.length - 1], null, c, b.id, b.name, b.digits, false, b.display, b.layer)
};
JXG.JSXGraph.registerElement("text", JXG.createText);
JXG.Image = function (f, b, g, d, c, h, a, e) {
    this.type = JXG.OBJECT_TYPE_IMAGE;
    this.elementClass = JXG.OBJECT_CLASS_OTHER;
    this.transformations = [];
    this.init(f, h, a);
    this.coords = new JXG.Coords(JXG.COORDS_BY_USER, g, this.board);
    this.initialCoords = new JXG.Coords(JXG.COORDS_BY_USER, g, this.board);
    this.size = [d[0] * f.stretchX, d[1] * f.stretchY];
    this.url = b;
    if (c == null) {
        c = f.options.layer.image
    }
    this.layer = c;
    this.parent = e;
    this.visProp.visible = true;
    this.id = this.board.addImage(this)
};
JXG.Image.prototype = new JXG.GeometryElement;
JXG.Image.prototype.hasPoint = function (a, b) {
    return false
};
JXG.Image.prototype.updateRenderer = function () {
    this.updateTransform();
    this.board.renderer.updateImage(this)
};
JXG.Image.prototype.updateTransform = function () {
    if (this.transformations.length == 0) {
        return
    }
    for (var a = 0; a < this.transformations.length; a++) {
        this.transformations[a].update()
    }
};
JXG.Image.prototype.addTransform = function (a) {
    if (JXG.isArray(a)) {
        for (var b = 0; b < a.length; b++) {
            this.transformations.push(a[b])
        }
    } else {
        this.transformations.push(a)
    }
};
JXG.createImage = function (c, b, d) {
    var a;
    if (d == null) {
        d = {}
    } else {
        if (d.imageString != null) {
            a = d.imageString
        }
    }
    if (typeof d.layer == "undefined") {
        d.layer = null
    }
    return new JXG.Image(c, b[0], b[1], b[2], d.layer, false, false, undefined)
};
JXG.JSXGraph.registerElement("image", JXG.createImage);
JXG.createSlider = function (m, z, v) {
    var h, f, y, k, A, q, c, b, x, B, l, e, d, a, w, u, r, s, g;
    h = z[0];
    f = z[1];
    y = z[2][0];
    k = z[2][1];
    A = z[2][2];
    q = A - y;
    v = JXG.checkAttributes(v, {
        strokeColor: "#000000",
        fillColor: "#ffffff",
        withTicks: true
    });
    g = JXG.str2Bool(v.fixed);
    c = m.create("point", h, {
        visible: !g,
        fixed: g,
        name: "",
        withLabel: false,
        face: "<>",
        size: 5,
        strokeColor: "#000000",
        fillColor: "#ffffff"
    });
    b = m.create("point", f, {
        visible: !g,
        fixed: g,
        name: "",
        withLabel: false,
        face: "<>",
        size: 5,
        strokeColor: "#000000",
        fillColor: "#ffffff"
    });
    m.create("group", [c, b]);
    x = m.create("segment", [c, b], {
        strokewidth: 1,
        name: "",
        withLabel: false,
        strokeColor: v.strokeColor
    });
    if (v.withTicks) {
        B = 2;
        l = m.create("ticks", [x, b.Dist(c) / B], {
            insertTicks: true,
            minorTicks: 0,
            drawLabels: false,
            drawZero: true
        })
    }
    if (g) {
        c.needsRegularUpdate = false;
        b.needsRegularUpdate = false;
        x.needsRegularUpdate = false
    }
    e = h[0] + (f[0] - h[0]) * (k - y) / (A - y);
    d = h[1] + (f[1] - h[1]) * (k - y) / (A - y);
    if (v.snapWidth != null) {
        s = v.snapWidth
    }
    if (v.snapwidth != null) {
        s = v.snapwidth
    }
    a = m.create("glider", [e, d, x], {
        style: 6,
        strokeColor: v.strokeColor,
        fillColor: v.fillColor,
        showInfobox: false,
        name: v.name,
        withLabel: false,
        snapWidth: s
    });
    w = m.create("line", [c, a], {
        straightFirst: false,
        straightLast: false,
        strokewidth: 3,
        strokeColor: v.strokeColor,
        name: "",
        withLabel: false
    });
    a.Value = function () {
        return this.position * q + y
    };
    a._smax = A;
    a._smin = y;
    if (typeof v.withLabel == "undefined" || v.withLabel == true) {
        if (v.name && v.name != "") {
            u = v.name + " = "
        } else {
            u = ""
        }
        r = m.create("text", [function () {
            return (b.X() - c.X()) * 0.05 + b.X()
        }, function () {
            return (b.Y() - c.Y()) * 0.05 + b.Y()
        }, function () {
            return u + (a.Value()).toFixed(2)
        }], {
            name: ""
        })
    }
    return a
};
JXG.JSXGraph.registerElement("slider", JXG.createSlider);
JXG.Chart = function (h, m, e) {
    this.constructor();
    if (m.length == 0) {
        return
    }
    this.elements = [];
    var d = e.id || "";
    var b = e.name || "";
    this.init(h, d, b);
    var n, l, f;
    if (m.length > 0 && (typeof m[0] == "number")) {
        l = m;
        n = [];
        for (f = 0; f < l.length; f++) {
            n[f] = f + 1
        }
    } else {
        if (m.length == 1) {
            l = m[0];
            n = [];
            var g;
            if (JXG.isFunction(l)) {
                g = l().length
            } else {
                g = l.length
            }
            for (f = 0; f < g; f++) {
                n[f] = f + 1
            }
        }
        if (m.length == 2) {
            n = m[0];
            l = m[1]
        }
    }
    if (e == undefined) {
        e = {}
    }
    var a = e.chartStyle || "line";
    a = a.replace(/ /g, "");
    a = a.split(",");
    var k;
    for (f = 0; f < a.length; f++) {
        switch (a[f]) {
        case "bar":
            k = this.drawBar(h, [n, l], e);
            break;
        case "line":
            k = this.drawLine(h, [n, l], e);
            break;
        case "fit":
            k = this.drawFit(h, [n, l], e);
            break;
        case "spline":
            k = this.drawSpline(h, [n, l], e);
            break;
        case "pie":
            k = this.drawPie(h, [l], e);
            break;
        case "point":
            k = this.drawPoints(h, [n, l], e);
            break;
        case "radar":
            k = this.drawRadar(h, m, e);
            break
        }
        this.elements.push(k)
    }
    this.id = this.board.addChart(this);
    return this.elements
};
JXG.Chart.prototype = new JXG.GeometryElement;
JXG.Chart.prototype.drawLine = function (f, e, b) {
    var d = e[0],
        a = e[1];
    b.fillColor = "none";
    b.highlightFillColor = "none";
    var g = f.create("curve", [d, a], b);
    this.rendNode = g.rendNode;
    return g
};
JXG.Chart.prototype.drawSpline = function (f, d, b) {
    var a = d[0],
        h = d[1],
        e;
    b.fillColor = "none";
    b.highlightFillColor = "none";
    var g = f.create("spline", [a, h], b);
    this.rendNode = g.rendNode;
    return g
};
JXG.Chart.prototype.drawFit = function (f, e, d) {
    var a = e[0],
        k = e[1],
        g = (((typeof d.degree == "undefined") || (parseInt(d.degree) == NaN) || (parseInt(d.degree) < 1)) ? 1 : parseInt(d.degree));
    d.fillColor = "none";
    d.highlightFillColor = "none";
    var b = JXG.Math.Numerics.regressionPolynomial(g, a, k);
    var h = f.create("functiongraph", [b], d);
    this.rendNode = h.rendNode;
    return h
};
JXG.Chart.prototype.drawBar = function (h, l, f) {
    var g, e = [],
        m = l[0],
        k = l[1],
        n, c, u, s, b, a, q, d = [],
        r;
    if (f.fillOpacity == undefined) {
        f.fillOpacity = 0.6
    }
    if (f && f.width) {
        n = f.width
    } else {
        if (m.length <= 1) {
            n = 1
        } else {
            n = m[1] - m[0];
            for (g = 1; g < m.length - 1; g++) {
                n = (m[g + 1] - m[g] < n) ? (m[g + 1] - m[g]) : n
            }
        }
        n *= 0.8
    }
    r = f.fillColor;
    for (g = 0; g < m.length; g++) {
        if (JXG.isFunction(m[g])) {
            c = function () {
                return m[g]() - n * 0.5
            };
            u = function () {
                return m[g]()
            };
            s = function () {
                return m[g]() + n * 0.5
            }
        } else {
            c = m[g] - n * 0.5;
            u = m[g];
            s = m[g] + n * 0.5
        }
        if (JXG.isFunction(k[g])) {
            a = b
        } else {
            a = k[g] + 0.2
        }
        b = k[g];
        if (f.dir == "horizontal") {
            d[0] = h.create("point", [0, c], {
                name: "",
                fixed: true,
                visible: false
            });
            d[1] = h.create("point", [b, c], {
                name: "",
                fixed: true,
                visible: false
            });
            d[2] = h.create("point", [b, s], {
                name: "",
                fixed: true,
                visible: false
            });
            d[3] = h.create("point", [0, s], {
                name: "",
                fixed: true,
                visible: false
            });
            if (f.labels && f.labels[g]) {
                h.create("text", [b, s, f.labels[g]], f)
            }
        } else {
            d[0] = h.create("point", [c, 0], {
                name: "",
                fixed: true,
                visible: false
            });
            d[1] = h.create("point", [c, b], {
                name: "",
                fixed: true,
                visible: false
            });
            d[2] = h.create("point", [s, b], {
                name: "",
                fixed: true,
                visible: false
            });
            d[3] = h.create("point", [s, 0], {
                name: "",
                fixed: true,
                visible: false
            });
            if (f.labels && f.labels[g]) {
                h.create("text", [s, b, f.labels[g]], f)
            }
        }
        f.withLines = false;
        if (!r) {
            q = f.colorArray || ["#B02B2C", "#3F4C6B", "#C79810", "#D15600", "#FFFF88", "#C3D9FF", "#4096EE", "#008C00"];
            f.fillColor = q[g % q.length]
        }
        e[g] = h.create("polygon", d, f)
    }
    this.rendNode = e[0].rendNode;
    return e
};
JXG.Chart.prototype.drawPoints = function (g, d, c) {
    var e;
    var f = [];
    c.fixed = true;
    c.name = "";
    var b = JXG.isArray(c.infoboxArray) ? c.infoboxArray || false : false;
    var a = d[0];
    var h = d[1];
    for (e = 0; e < a.length; e++) {
        c.infoboxtext = b ? b[e % b.length] : false;
        f[e] = g.create("point", [a[e], h[e]], c)
    }
    this.rendNode = f[0].rendNode;
    return f
};
JXG.Chart.prototype.drawPie = function (d, w, f) {
    var g = w[0];
    if (g.length <= 0) {
        return
    }
    if (typeof g[0] == "function") {
        return
    }
    var v;
    var q = [];
    var e = [];
    var k = JXG.Math.Statistics.sum(g);
    var c = f.colorArray || ["#B02B2C", "#3F4C6B", "#C79810", "#D15600", "#FFFF88", "#C3D9FF", "#4096EE", "#008C00"];
    var A = f.highlightColorArray || ["#FF7400"];
    var r = new Array(g.length);
    for (v = 0; v < g.length; v++) {
        r[v] = ""
    }
    var l = f.labelArray || r;
    var b = f.radius || 4;
    var z = {};
    if (typeof f.highlightOnSector == "undefined") {
        f.highlightOnSector = false
    }
    z.name = f.name;
    z.id = f.id;
    z.strokeWidth = f.strokeWidth || 1;
    z.strokeColor = f.strokeColor || "none";
    z.straightFirst = false;
    z.straightLast = false;
    z.fillColor = f.fillColor || "#FFFF88";
    z.fillOpacity = f.fillOpacity || 0.6;
    z.highlightFillColor = f.highlightFillColor || "#FF7400";
    z.highlightStrokeColor = f.highlightStrokeColor || "#FFFFFF";
    z.gradient = f.gradient || "none";
    var n = f.center || [0, 0];
    var u = n[0];
    var a = n[1];
    var x = d.create("point", [u, a], {
        name: "",
        fixed: true,
        visible: false
    });
    q[0] = d.create("point", [b + u, 0 + a], {
        name: "",
        fixed: true,
        visible: false
    });
    var B = 0;
    for (v = 0; v < g.length; v++) {
        B += (k != 0) ? (2 * Math.PI * g[v] / k) : 0;
        var h = b * Math.cos(B) + u;
        var m = b * Math.sin(B) + a;
        q[v + 1] = d.create("point", [h, m], {
            name: "",
            fixed: true,
            visible: false,
            withLabel: false
        });
        z.fillColor = c[v % c.length];
        z.name = l[v];
        if (z.name != "") {
            z.withLabel = true
        } else {
            z.withLabel = false
        }
        z.labelColor = c[v % c.length];
        z.highlightfillColor = A[v % A.length];
        e[v] = d.create("sector", [x, q[v], q[v + 1]], z);
        if (f.highlightOnSector) {
            e[v].hasPoint = e[v].hasPointSector
        }
    }
    this.rendNode = e[0].rendNode;
    return {
        arcs: e,
        points: q,
        midpoint: x
    }
};
JXG.Chart.prototype.drawRadar = function (k, L, G) {
    if (L.length <= 0) {
        alert("No data");
        return
    }
    var W = G.paramArray;
    if (W == undefined) {
        alert("Need paramArray attribute");
        return
    }
    var I = W.length;
    if (I <= 1) {
        alert("Need more than 1 param");
        return
    }
    var V, T;
    for (V = 0; V < L.length; V++) {
        if (I != L[V].length) {
            alert("Use data length equal to number of params (" + L[V].length + " != " + I + ")");
            return
        }
    }
    maxes = new Array(I);
    mins = new Array(I);
    for (T = 0; T < I; T++) {
        maxes[T] = L[0][T];
        mins[T] = maxes[T]
    }
    for (V = 1; V < L.length; V++) {
        for (T = 0; T < I; T++) {
            if (L[V][T] > maxes[T]) {
                maxes[T] = L[V][T]
            }
            if (L[V][T] < mins[T]) {
                mins[T] = L[V][T]
            }
        }
    }
    var F = new Array(L.length);
    var q = new Array(L.length);
    for (V = 0; V < L.length; V++) {
        F[V] = "";
        q[V] = []
    }
    var c = new Array(I);
    var H = new Array(I);
    var z = G.startShiftRatio || 0;
    var w = G.endShiftRatio || 0;
    for (V = 0; V < I; V++) {
        c[V] = (maxes[V] - mins[V]) * z;
        H[V] = (maxes[V] - mins[V]) * w
    }
    var A = G.startShiftArray || c;
    var y = G.endShiftArray || H;
    var d = G.startArray || mins;
    if (G.start != undefined) {
        for (var V = 0; V < I; V++) {
            d[V] = G.start
        }
    }
    var U = G.endArray || maxes;
    if (G.end != undefined) {
        for (var V = 0; V < I; V++) {
            U[V] = G.end
        }
    }
    if (A.length != I) {
        alert("Start shifts length is not equal to number of parameters");
        return
    }
    if (y.length != I) {
        alert("End shifts length is not equal to number of parameters");
        return
    }
    if (d.length != I) {
        alert("Starts length is not equal to number of parameters");
        return
    }
    if (U.length != I) {
        alert("Ends length is not equal to number of parameters");
        return
    }
    var r = G.labelArray || F;
    var n = G.colorArray || ["#B02B2C", "#3F4C6B", "#C79810", "#D15600", "#FFFF88", "#C3D9FF", "#4096EE", "#008C00"];
    var s = G.highlightColorArray || ["#FF7400"];
    var K = G.radius || 10;
    var u = {};
    if (typeof G.highlightOnSector == "undefined") {
        G.highlightOnSector = false
    }
    u.name = G.name;
    u.id = G.id;
    u.strokeWidth = G.strokeWidth || 1;
    u.polyStrokeWidth = G.polyStrokeWidth || 2 * u.strokeWidth;
    u.strokeColor = G.strokeColor || "black";
    u.straightFirst = false;
    u.straightLast = false;
    u.fillColor = G.fillColor || "#FFFF88";
    u.fillOpacity = G.fillOpacity || 0.4;
    u.highlightFillColor = G.highlightFillColor || "#FF7400";
    u.highlightStrokeColor = G.highlightStrokeColor || "black";
    u.gradient = G.gradient || "none";
    var R = G.center || [0, 0];
    var N = R[0];
    var B = R[1];
    var a = k.createElement("point", [N, B], {
        name: "",
        fixed: true,
        withlabel: false,
        visible: false
    });
    var h = Math.PI / 2 - Math.PI / I;
    if (G.startAngle || G.startAngle === 0) {
        h = G.startAngle
    }
    var b = h;
    var Q = [];
    var g = [];
    var S = function () {
            var ac, ab, ae, ad, af = [].concat(this.labelOffsets);
            ac = this.point1.X();
            ab = this.point2.X();
            ae = this.point1.Y();
            ad = this.point2.Y();
            if (ab < ac) {
                af[0] = -af[0]
            }
            if (ad < ae) {
                af[1] = -af[1]
            }
            this.setLabelRelativeCoords(af);
            return new JXG.Coords(JXG.COORDS_BY_USER, [this.point2.X(), this.point2.Y()], this.board)
        };
    var E = function (af, ac) {
            var ab;
            var ae;
            var ad;
            ab = k.createElement("transform", [-(d[ac] - A[ac]), 0], {
                type: "translate"
            });
            ae = k.createElement("transform", [K / ((U[ac] + y[ac]) - (d[ac] - A[ac])), 1], {
                type: "scale"
            });
            ab.melt(ae);
            ad = k.createElement("transform", [af], {
                type: "rotate"
            });
            ab.melt(ad);
            return ab
        };
    var J;
    for (V = 0; V < I; V++) {
        b += 2 * Math.PI / I;
        var m = K * Math.cos(b) + N;
        var P = K * Math.sin(b) + B;
        Q[V] = k.createElement("point", [m, P], {
            name: "",
            fixed: true,
            withlabel: false,
            visible: false
        });
        g[V] = k.createElement("line", [a, Q[V]], {
            name: W[V],
            strokeColor: u.strokeColor,
            strokeWidth: u.strokeWidth,
            strokeOpacity: 1,
            straightFirst: false,
            straightLast: false,
            withLabel: true,
            highlightStrokeColor: u.highlightStrokeColor
        });
        g[V].getLabelAnchor = S;
        J = E(b, V);
        for (T = 0; T < L.length; T++) {
            var Y = L[T][V];
            q[T][V] = k.createElement("point", [Y, 0], {
                name: "",
                fixed: true,
                withlabel: false,
                visible: false
            });
            q[T][V].addTransform(q[T][V], J)
        }
    }
    var aa = new Array(L.length);
    for (V = 0; V < L.length; V++) {
        u.labelColor = n[V % n.length];
        u.strokeColor = n[V % n.length];
        u.fillColor = n[V % n.length];
        aa[V] = k.createElement("polygon", q[V], {
            withLines: true,
            withLabel: false,
            fillColor: u.fillColor,
            fillOpacity: u.fillOpacity
        });
        for (T = 0; T < I; T++) {
            aa[V].borders[T].setProperty("strokeColor:" + n[V % n.length]);
            aa[V].borders[T].setProperty("strokeWidth:" + u.polyStrokeWidth)
        }
    }
    var v = G.legendPosition || "none";
    switch (v) {
    case "right":
        var C = G.legendLeftOffset || 2;
        var X = G.legendTopOffset || 1;
        this.legend = k.createElement("legend", [N + K + C, B + K - X], {
            labelArray: r,
            colorArray: n
        });
        break;
    case "none":
        break;
    default:
        alert("Unknown legend position")
    }
    var f = [];
    if (G.showCircles != false) {
        var l = [];
        for (V = 0; V < 6; V++) {
            l[V] = 20 * V
        }
        l[0] = "0";
        var D = G.circleLabelArray || l;
        var O = D.length;
        if (O < 2) {
            alert("Too less circles");
            return
        }
        var Z = [];
        var x = h + Math.PI / I;
        J = E(x, 0);
        u.fillColor = "none";
        u.highlightFillColor = "none";
        u.strokeColor = G.strokeColor || "black";
        u.strokeWidth = G.circleStrokeWidth || 0.5;
        var e = (U[0] - d[0]) / (O - 1);
        for (V = 0; V < O; V++) {
            Z[V] = k.createElement("point", [d[0] + V * e, 0], {
                name: D[V],
                size: 0,
                withLabel: true,
                visible: true
            });
            Z[V].addTransform(Z[V], J);
            f[V] = k.createElement("circle", [a, Z[V]], u)
        }
    }
    this.rendNode = aa[0].rendNode;
    return {
        circles: f,
        lines: g,
        points: q,
        midpoint: a,
        polygons: aa
    }
};
JXG.Chart.prototype.updateRenderer = function () {};
JXG.Chart.prototype.update = function () {
    if (this.needsUpdate) {
        this.updateDataArray()
    }
};
JXG.Chart.prototype.updateDataArray = function () {};
JXG.createChart = function (e, u, f) {
    if ((u.length == 1) && (typeof u[0] == "string")) {
        var s = document.getElementById(u[0]),
            A, d, n, m, c, a, r = [],
            h, g, z, y, B, k, b, l, v, q;
        if (typeof s != "undefined") {
            f = JXG.checkAttributes(f, {
                withHeader: true
            });
            s = (new JXG.DataSource()).loadFromTable(u[0], f.withHeader, f.withHeader);
            A = s.data;
            c = s.columnHeader;
            d = s.rowHeader;
            y = f.width;
            B = f.name;
            k = f.strokeColor;
            b = f.fillColor;
            l = f.highlightStrokeColor;
            v = f.highlightFillColor;
            e.suspendUpdate();
            q = A.length;
            z = [];
            if (f.rows && JXG.isArray(f.rows)) {
                for (n = 0; n < q; n++) {
                    for (m = 0; m < f.rows.length; m++) {
                        if ((f.rows[m] == n) || (f.withHeaders && f.rows[m] == d[n])) {
                            z.push(A[n]);
                            break
                        }
                    }
                }
            } else {
                z = A
            }
            q = z.length;
            for (n = 0; n < q; n++) {
                g = [];
                if (f.chartStyle && f.chartStyle.indexOf("bar") != -1) {
                    if (y) {
                        h = y
                    } else {
                        h = 0.8
                    }
                    g.push(1 - h / 2 + (n + 0.5) * h / (1 * q));
                    for (m = 1; m < z[n].length; m++) {
                        g.push(g[m - 1] + 1)
                    }
                    f.width = h / (1 * q)
                }
                if (B && B.length == q) {
                    f.name = B[n]
                } else {
                    if (f.withHeaders) {
                        f.name = c[n]
                    }
                }
                if (k && k.length == q) {
                    f.strokeColor = k[n]
                } else {
                    f.strokeColor = JXG.hsv2rgb(((n + 1) / (1 * q)) * 360, 0.9, 0.6)
                }
                if (b && b.length == q) {
                    f.fillColor = b[n]
                } else {
                    f.fillColor = JXG.hsv2rgb(((n + 1) / (1 * q)) * 360, 0.9, 1)
                }
                if (l && l.length == q) {
                    f.highlightStrokeColor = l[n]
                } else {
                    f.highlightStrokeColor = JXG.hsv2rgb(((n + 1) / (1 * q)) * 360, 0.9, 1)
                }
                if (v && v.length == q) {
                    f.highlightFillColor = v[n]
                } else {
                    f.highlightFillColor = JXG.hsv2rgb(((n + 1) / (1 * q)) * 360, 0.9, 0.6)
                }
                if (f.chartStyle && f.chartStyle.indexOf("bar") != -1) {
                    r.push(new JXG.Chart(e, [g, z[n]], f))
                } else {
                    r.push(new JXG.Chart(e, [z[n]], f))
                }
            }
            e.unsuspendUpdate()
        }
        return r
    } else {
        return new JXG.Chart(e, u, f)
    }
};
JXG.JSXGraph.registerElement("chart", JXG.createChart);
JXG.Legend = function (c, d, a) {
    this.constructor();
    this.board = c;
    this.coords = new JXG.Coords(JXG.COORDS_BY_USER, d, this.board);
    this.myAtts = {};
    this.label_array = a.labelArray || ["1", "2", "3", "4", "5", "6", "7", "8"];
    this.color_array = a.colorArray || ["#B02B2C", "#3F4C6B", "#C79810", "#D15600", "#FFFF88", "#C3D9FF", "#4096EE", "#008C00"];
    var b;
    this.lines = [];
    this.myAtts.strokeWidth = a.strokeWidth || 5;
    this.myAtts.straightFirst = false;
    this.myAtts.straightLast = false;
    this.myAtts.withLabel = true;
    this.style = a.legendStyle || "vertical";
    switch (this.style) {
    case "vertical":
        this.drawVerticalLegend(a);
        break;
    default:
        alert("Unknown legend style" + this.style);
        break
    }
};
JXG.Legend.prototype = new JXG.GeometryElement;
JXG.Legend.prototype.drawVerticalLegend = function (c) {
    var b = c.lineLength || 1;
    var a = (c.rowHeight || 20) / this.board.stretchY;
    for (i = 0; i < this.label_array.length; i++) {
        this.myAtts.strokeColor = this.color_array[i];
        this.myAtts.highlightStrokeColor = this.color_array[i];
        this.myAtts.name = this.label_array[i];
        this.myAtts.labelOffsets = [10, 0];
        this.lines[i] = board.createElement("line", [
            [this.coords.usrCoords[1], this.coords.usrCoords[2] - i * a],
            [this.coords.usrCoords[1] + b, this.coords.usrCoords[2] - i * a]
        ], this.myAtts);
        this.lines[i].getLabelAnchor = function () {
            this.setLabelRelativeCoords(this.labelOffsets);
            return new JXG.Coords(JXG.COORDS_BY_USER, [this.point2.X(), this.point2.Y()], this.board)
        }
    }
};
JXG.createLegend = function (c, b, a) {
    var d = [0, 0];
    if (b != undefined) {
        if (b.length == 2) {
            d = b
        }
    }
    return new JXG.Legend(c, d, a)
};
JXG.JSXGraph.registerElement("legend", JXG.createLegend);
JXG.Transformation = function (b, a, c) {
    this.elementClass = JXG.OBJECT_CLASS_OTHER;
    this.matrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    this.board = b;
    this.isNumericMatrix = false;
    this.setMatrix(b, a, c)
};
JXG.Transformation.prototype = {};
JXG.Transformation.prototype.update = function () {};
JXG.Transformation.prototype.setMatrix = function (c, b, d) {
    var a;
    this.isNumericMatrix = true;
    for (a = 0; a < d.length; a++) {
        if (typeof d[a] != "number") {
            this.isNumericMatrix = false;
            break
        }
    }
    if (b == "translate") {
        this.evalParam = JXG.createEvalFunction(c, d, 2);
        this.update = function () {
            this.matrix[1][0] = this.evalParam(0);
            this.matrix[2][0] = this.evalParam(1)
        }
    } else {
        if (b == "scale") {
            this.evalParam = JXG.createEvalFunction(c, d, 2);
            this.update = function () {
                this.matrix[1][1] = this.evalParam(0);
                this.matrix[2][2] = this.evalParam(1)
            }
        } else {
            if (b == "reflect") {
                if (d.length < 4) {
                    d[0] = JXG.getReference(c, d[0])
                }
                if (d.length == 2) {
                    d[1] = JXG.getReference(c, d[1])
                }
                if (d.length == 4) {
                    this.evalParam = JXG.createEvalFunction(c, d, 4)
                }
                this.update = function () {
                    var e, k, f, h, g;
                    if (d.length == 1) {
                        e = d[0].point2.X() - d[0].point1.X();
                        k = d[0].point2.Y() - d[0].point1.Y();
                        f = d[0].point1.X();
                        h = d[0].point1.Y()
                    } else {
                        if (d.length == 2) {
                            e = d[1].X() - d[0].X();
                            k = d[1].Y() - d[0].Y();
                            f = d[0].X();
                            h = d[0].Y()
                        } else {
                            if (d.length == 4) {
                                e = this.evalParam(2) - this.evalParam(0);
                                k = this.evalParam(3) - this.evalParam(1);
                                f = this.evalParam(0);
                                h = this.evalParam(1)
                            }
                        }
                    }
                    g = e * e + k * k;
                    this.matrix[1][1] = (e * e - k * k) / g;
                    this.matrix[1][2] = 2 * e * k / g;
                    this.matrix[2][1] = 2 * e * k / g;
                    this.matrix[2][2] = (-e * e + k * k) / g;
                    this.matrix[1][0] = f * (1 - this.matrix[1][1]) - h * this.matrix[1][2];
                    this.matrix[2][0] = h * (1 - this.matrix[2][2]) - f * this.matrix[2][1]
                }
            } else {
                if (b == "rotate") {
                    if (d.length == 3) {
                        this.evalParam = JXG.createEvalFunction(c, d, 3)
                    } else {
                        if (d.length <= 2) {
                            this.evalParam = JXG.createEvalFunction(c, d, 1);
                            if (d.length == 2) {
                                d[1] = JXG.getReference(c, d[1])
                            }
                        }
                    }
                    this.update = function () {
                        var g = this.evalParam(0),
                            e, k, h = Math.cos(g),
                            f = Math.sin(g);
                        this.matrix[1][1] = h;
                        this.matrix[1][2] = -f;
                        this.matrix[2][1] = f;
                        this.matrix[2][2] = h;
                        if (d.length > 1) {
                            if (d.length == 3) {
                                e = this.evalParam(1);
                                k = this.evalParam(2)
                            } else {
                                e = d[1].X();
                                k = d[1].Y()
                            }
                            this.matrix[1][0] = e * (1 - h) + k * f;
                            this.matrix[2][0] = k * (1 - h) - e * f
                        }
                    }
                } else {
                    if (b == "shear") {
                        this.evalParam = JXG.createEvalFunction(c, d, 1);
                        this.update = function () {
                            var e = this.evalParam(0);
                            this.matrix[1][1] = Math.tan(e)
                        }
                    } else {
                        if (b == "generic") {
                            this.evalParam = JXG.createEvalFunction(c, d, 9);
                            this.update = function () {
                                this.matrix[0][0] = this.evalParam(0);
                                this.matrix[0][1] = this.evalParam(1);
                                this.matrix[0][2] = this.evalParam(2);
                                this.matrix[1][0] = this.evalParam(3);
                                this.matrix[1][1] = this.evalParam(4);
                                this.matrix[1][2] = this.evalParam(5);
                                this.matrix[2][0] = this.evalParam(6);
                                this.matrix[2][1] = this.evalParam(7);
                                this.matrix[2][2] = this.evalParam(8)
                            }
                        }
                    }
                }
            }
        }
    }
};
JXG.Transformation.prototype.apply = function (a) {
    this.update();
    if (arguments[1] != null) {
        return JXG.Math.matVecMult(this.matrix, a.initialCoords.usrCoords)
    } else {
        return JXG.Math.matVecMult(this.matrix, a.coords.usrCoords)
    }
};
JXG.Transformation.prototype.applyOnce = function (d) {
    var e, a, b;
    if (!JXG.isArray(d)) {
        this.update();
        e = JXG.Math.matVecMult(this.matrix, d.coords.usrCoords);
        d.coords.setCoordinates(JXG.COORDS_BY_USER, [e[1], e[2]])
    } else {
        a = d.length;
        for (b = 0; b < a; b++) {
            this.update();
            e = JXG.Math.matVecMult(this.matrix, d[b].coords.usrCoords);
            d[b].coords.setCoordinates(JXG.COORDS_BY_USER, [e[1], e[2]])
        }
    }
};
JXG.Transformation.prototype.bindTo = function (c) {
    var b, a;
    if (JXG.isArray(c)) {
        a = c.length;
        for (b = 0; b < a; b++) {
            c[b].transformations.push(this)
        }
    } else {
        c.transformations.push(this)
    }
};
JXG.Transformation.prototype.setProperty = function (a) {};
JXG.Transformation.prototype.melt = function (g) {
    var f = [],
        e, a, d, b, h, c;
    a = g.matrix.length;
    d = this.matrix[0].length;
    for (e = 0; e < a; e++) {
        f[e] = []
    }
    this.update();
    g.update();
    for (e = 0; e < a; e++) {
        for (c = 0; c < d; c++) {
            h = 0;
            for (b = 0; b < a; b++) {
                h += g.matrix[e][b] * this.matrix[b][c]
            }
            f[e][c] = h
        }
    }
    this.update = function () {
        var k = this.matrix.length,
            l = this.matrix[0].length;
        for (e = 0; e < k; e++) {
            for (c = 0; c < l; c++) {
                this.matrix[e][c] = f[e][c]
            }
        }
    };
    return true
};
JXG.createTransform = function (a, c, b) {
    return new JXG.Transformation(a, b.type, c)
};
JXG.JSXGraph.registerElement("transform", JXG.createTransform);
JXG.Turtle = function (e, d, b) {
    var a, f, c;
    this.type = JXG.OBJECT_TYPE_TURTLE;
    this.turtleIsHidden = false;
    this.board = e;
    this.attributes = JXG.checkAttributes(b, {
        withLabel: false,
        layer: null
    });
    this.attributes.straightFirst = false;
    this.attributes.straightLast = false;
    a = 0;
    f = 0;
    c = 90;
    if (d.length != 0) {
        if (d.length == 3) {
            a = d[0];
            f = d[1];
            c = d[2]
        } else {
            if (d.length == 2) {
                if (JXG.isArray(d[0])) {
                    a = d[0][0];
                    f = d[0][1];
                    c = d[1]
                } else {
                    a = d[0];
                    f = d[1]
                }
            } else {
                a = d[0][0];
                f = d[0][1]
            }
        }
    }
    this.init(a, f, c);
    return this
};
JXG.Turtle.prototype = new JXG.GeometryElement;
JXG.Turtle.prototype.init = function (a, d, c) {
    this.arrowLen = 20 / Math.sqrt(this.board.unitX * this.board.unitX + this.board.unitY * this.board.unitY);
    this.pos = [a, d];
    this.isPenDown = true;
    this.dir = 90;
    this.stack = [];
    this.objects = [];
    this.attributes.curveType = "plot";
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    this.turtle = this.board.create("point", this.pos, {
        fixed: true,
        name: " ",
        visible: false,
        withLabel: false
    });
    this.objects.push(this.turtle);
    this.turtle2 = this.board.create("point", [this.pos[0], this.pos[1] + this.arrowLen], {
        fixed: true,
        name: " ",
        visible: false,
        withLabel: false
    });
    this.objects.push(this.turtle2);
    var b = this.attributes.strokeWidth || this.attributes.strokewidth || 2;
    this.arrow = this.board.create("line", [this.turtle, this.turtle2], {
        strokeColor: "#ff0000",
        straightFirst: false,
        straightLast: false,
        strokeWidth: b,
        withLabel: false,
        lastArrow: true
    });
    this.objects.push(this.arrow);
    this.right(90 - c);
    this.board.update()
};
JXG.Turtle.prototype.forward = function (a) {
    if (a == 0) {
        return
    }
    var c = a * Math.cos(this.dir * Math.PI / 180);
    var b = a * Math.sin(this.dir * Math.PI / 180);
    if (!this.turtleIsHidden) {
        var d = this.board.create("transform", [c, b], {
            type: "translate"
        });
        d.applyOnce(this.turtle);
        d.applyOnce(this.turtle2)
    }
    if (this.isPenDown) {
        if (this.curve.dataX.length >= 8192) {
            this.curve = this.board.create("curve", [
                [this.pos[0]],
                [this.pos[1]]
            ], this.attributes);
            this.objects.push(this.curve)
        }
    }
    this.pos[0] += c;
    this.pos[1] += b;
    if (this.isPenDown) {
        this.curve.dataX.push(this.pos[0]);
        this.curve.dataY.push(this.pos[1])
    }
    this.board.update();
    return this
};
JXG.Turtle.prototype.back = function (a) {
    return this.forward(-a)
};
JXG.Turtle.prototype.right = function (b) {
    this.dir -= b;
    this.dir %= 360;
    if (!this.turtleIsHidden) {
        var a = this.board.create("transform", [-b * Math.PI / 180, this.turtle], {
            type: "rotate"
        });
        a.applyOnce(this.turtle2)
    }
    this.board.update();
    return this
};
JXG.Turtle.prototype.left = function (a) {
    return this.right(-a)
};
JXG.Turtle.prototype.penUp = function () {
    this.isPenDown = false;
    return this
};
JXG.Turtle.prototype.penDown = function () {
    this.isPenDown = true;
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    return this
};
JXG.Turtle.prototype.clean = function () {
    for (var a = 0; a < this.objects.length; a++) {
        var b = this.objects[a];
        if (b.type == JXG.OBJECT_TYPE_CURVE) {
            this.board.removeObject(b.id);
            this.objects.splice(a, 1)
        }
    }
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    this.board.update();
    return this
};
JXG.Turtle.prototype.clearScreen = function () {
    for (var a = 0; a < this.objects.length; a++) {
        var b = this.objects[a];
        this.board.removeObject(b.id)
    }
    this.init(0, 0, 90);
    return this
};
JXG.Turtle.prototype.setPos = function (a, c) {
    if (JXG.isArray(a)) {
        this.pos = a
    } else {
        this.pos = [a, c]
    }
    if (!this.turtleIsHidden) {
        this.turtle.setPositionDirectly(JXG.COORDS_BY_USER, a, c);
        this.turtle2.setPositionDirectly(JXG.COORDS_BY_USER, a, c + this.arrowLen);
        var b = this.board.create("transform", [-(this.dir - 90) * Math.PI / 180, this.turtle], {
            type: "rotate"
        });
        b.applyOnce(this.turtle2)
    }
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    this.board.update();
    return this
};
JXG.Turtle.prototype.setPenSize = function (a) {
    this.attributes.strokeWidth = a;
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    return this
};
JXG.Turtle.prototype.setPenColor = function (a) {
    this.attributes.strokeColor = a;
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    return this
};
JXG.Turtle.prototype.setHighlightPenColor = function (a) {
    this.attributes.highlightStrokeColor = a;
    this.curve = this.board.create("curve", [
        [this.pos[0]],
        [this.pos[1]]
    ], this.attributes);
    this.objects.push(this.curve);
    return this
};
JXG.Turtle.prototype.setProperty = function () {
    var e;
    var a;
    var c, d;
    var b;
    for (c = 0; c < arguments.length; c++) {
        a = arguments[c];
        if (typeof a == "string") {
            e = a.split(":")
        } else {
            if (!JXG.isArray(a)) {
                for (var b in a) {
                    this.setProperty([b, a[b]])
                }
                return this
            } else {
                e = a
            }
        }
        this.attributes[e[0]] = e[1]
    }
    for (c = 0; c < this.objects.length; c++) {
        d = this.objects[c];
        if (d.type == JXG.OBJECT_TYPE_CURVE) {
            d.setProperty(this.attributes)
        }
    }
    return this
};
JXG.Turtle.prototype.showTurtle = function () {
    this.turtleIsHidden = false;
    this.arrow.setProperty("visible:true");
    this.setPos(this.pos[0], this.pos[1]);
    this.board.update();
    return this
};
JXG.Turtle.prototype.hideTurtle = function () {
    this.turtleIsHidden = true;
    this.arrow.setProperty("visible:false");
    this.setPos(this.pos[0], this.pos[1]);
    this.board.update();
    return this
};
JXG.Turtle.prototype.home = function () {
    this.pos = [0, 0];
    this.setPos(this.pos[0], this.pos[1]);
    return this
};
JXG.Turtle.prototype.pushTurtle = function () {
    this.stack.push([this.pos[0], this.pos[1], this.dir]);
    return this
};
JXG.Turtle.prototype.popTurtle = function () {
    var a = this.stack.pop();
    this.pos[0] = a[0];
    this.pos[1] = a[1];
    this.dir = a[2];
    this.setPos(this.pos[0], this.pos[1]);
    return this
};
JXG.Turtle.prototype.lookTo = function (e) {
    if (JXG.isArray(e)) {
        var b = this.pos[0];
        var a = this.pos[1];
        var f = e[0];
        var d = e[1];
        var c;
        c = Math.atan2(d - a, f - b);
        this.right(this.dir - (c * 180 / Math.PI))
    } else {
        if (JXG.isNumber(e)) {
            this.right(this.dir - (e))
        }
    }
    return this
};
JXG.Turtle.prototype.moveTo = function (d) {
    if (JXG.isArray(d)) {
        var b = d[0] - this.pos[0];
        var a = d[1] - this.pos[1];
        if (!this.turtleIsHidden) {
            var c = this.board.create("transform", [b, a], {
                type: "translate"
            });
            c.applyOnce(this.turtle);
            c.applyOnce(this.turtle2)
        }
        if (this.isPenDown) {
            if (this.curve.dataX.length >= 8192) {
                this.curve = this.board.create("curve", [
                    [this.pos[0]],
                    [this.pos[1]]
                ], this.attributes);
                this.objects.push(this.curve)
            }
        }
        this.pos[0] = d[0];
        this.pos[1] = d[1];
        if (this.isPenDown) {
            this.curve.dataX.push(this.pos[0]);
            this.curve.dataY.push(this.pos[1])
        }
        this.board.update()
    }
    return this
};
JXG.Turtle.prototype.fd = function (a) {
    return this.forward(a)
};
JXG.Turtle.prototype.bk = function (a) {
    return this.back(a)
};
JXG.Turtle.prototype.lt = function (a) {
    return this.left(a)
};
JXG.Turtle.prototype.rt = function (a) {
    return this.right(a)
};
JXG.Turtle.prototype.pu = function () {
    return this.penUp()
};
JXG.Turtle.prototype.pd = function () {
    return this.penDown()
};
JXG.Turtle.prototype.ht = function () {
    return this.hideTurtle()
};
JXG.Turtle.prototype.st = function () {
    return this.showTurtle()
};
JXG.Turtle.prototype.cs = function () {
    return this.clearScreen()
};
JXG.Turtle.prototype.push = function () {
    return this.pushTurtle()
};
JXG.Turtle.prototype.pop = function () {
    return this.popTurtle()
};
JXG.Turtle.prototype.X = function (a) {
    return this.pos[0]
};
JXG.Turtle.prototype.Y = function (a) {
    return this.pos[1]
};
JXG.Turtle.prototype.hasPoint = function (a, d) {
    var b, c;
    for (b = 0; b < this.objects.length; b++) {
        c = this.objects[b];
        if (c.type == JXG.OBJECT_TYPE_CURVE) {
            if (c.hasPoint(a, d)) {
                return true
            }
        }
    }
    return false
};
JXG.createTurtle = function (c, b, a) {
    if (b == null) {
        b = []
    }
    return new JXG.Turtle(c, b, a)
};
JXG.JSXGraph.registerElement("turtle", JXG.createTurtle);
JXG.rgbParser = function () {
    if (arguments.length == 0) {
        return
    }
    if (arguments.length >= 3) {
        arguments[0] = [arguments[0], arguments[1], arguments[2]];
        arguments.length = 1
    }
    var l = arguments[0];
    if (JXG.isArray(l)) {
        var c = false,
            f;
        for (f = 0; f < 3; f++) {
            c |= /\./.test(arguments[0][f].toString())
        }
        for (f = 0; f < 3; f++) {
            c &= (arguments[0][f] >= 0) & (arguments[0][f] <= 1)
        }
        if (c) {
            return [Math.ceil(arguments[0][0] * 255), Math.ceil(arguments[0][1] * 255), Math.ceil(arguments[0][2] * 255)]
        } else {
            arguments[0].length = 3;
            return arguments[0]
        }
    } else {
        if (typeof arguments[0] == "string") {
            l = arguments[0]
        }
    }
    var a, h, m;
    if (l.charAt(0) == "#") {
        l = l.substr(1, 6)
    }
    l = l.replace(/ /g, "");
    l = l.toLowerCase();
    var e = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        feldspar: "d19275",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslateblue: "8470ff",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        violetred: "d02090",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32"
    };
    for (var n in e) {
        if (l == n) {
            l = e[n]
        }
    }
    var k = [{
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
        process: function (b) {
            return [parseInt(b[1]), parseInt(b[2]), parseInt(b[3])]
        }
    }, {
        re: /^(\w{2})(\w{2})(\w{2})$/,
        example: ["#00ff00", "336699"],
        process: function (b) {
            return [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)]
        }
    }, {
        re: /^(\w{1})(\w{1})(\w{1})$/,
        example: ["#fb0", "f0f"],
        process: function (b) {
            return [parseInt(b[1] + b[1], 16), parseInt(b[2] + b[2], 16), parseInt(b[3] + b[3], 16)]
        }
    }];
    for (var f = 0; f < k.length; f++) {
        var s = k[f].re;
        var d = k[f].process;
        var q = s.exec(l);
        if (q) {
            channels = d(q);
            a = channels[0];
            h = channels[1];
            m = channels[2]
        }
    }
    a = (a < 0 || isNaN(a)) ? 0 : ((a > 255) ? 255 : a);
    h = (h < 0 || isNaN(h)) ? 0 : ((h > 255) ? 255 : h);
    m = (m < 0 || isNaN(m)) ? 0 : ((m > 255) ? 255 : m);
    return [a, h, m]
};
JXG.rgb2css = function () {
    var d, c, a;
    d = JXG.rgbParser.apply(JXG.rgbParser, arguments);
    c = d[1];
    a = d[2];
    d = d[0];
    return "rgb(" + d + ", " + c + ", " + a + ")"
};
JXG.rgb2hex = function () {
    var d, c, a;
    d = JXG.rgbParser.apply(JXG.rgbParser, arguments);
    c = d[1];
    a = d[2];
    d = d[0];
    d = d.toString(16);
    c = c.toString(16);
    a = a.toString(16);
    if (d.length == 1) {
        d = "0" + d
    }
    if (c.length == 1) {
        c = "0" + c
    }
    if (a.length == 1) {
        a = "0" + a
    }
    return "#" + d + c + a
};
JXG.hsv2rgb = function (m, g, e) {
    var h, n, c, l, k, d, b, a, r;
    m = ((m % 360) + 360) % 360;
    if (g == 0) {
        if (isNaN(m) || m < JXG.Math.eps) {
            h = e;
            n = e;
            c = e
        } else {
            return "#ffffff"
        }
    } else {
        if (m >= 360) {
            d = 0
        } else {
            d = m
        }
        d = d / 60;
        k = Math.floor(d);
        l = d - k;
        b = e * (1 - g);
        a = e * (1 - (g * l));
        r = e * (1 - (g * (1 - l)));
        switch (k) {
        case 0:
            h = e;
            n = r;
            c = b;
            break;
        case 1:
            h = a;
            n = e;
            c = b;
            break;
        case 2:
            h = b;
            n = e;
            c = r;
            break;
        case 3:
            h = b;
            n = a;
            c = e;
            break;
        case 4:
            h = r;
            n = b;
            c = e;
            break;
        case 5:
            h = e;
            n = b;
            c = a;
            break
        }
    }
    h = Math.round(h * 255).toString(16);
    h = (h.length == 2) ? h : ((h.length == 1) ? "0" + h : "00");
    n = Math.round(n * 255).toString(16);
    n = (n.length == 2) ? n : ((n.length == 1) ? "0" + n : "00");
    c = Math.round(c * 255).toString(16);
    c = (c.length == 2) ? c : ((c.length == 1) ? "0" + c : "00");
    return ["#", h, n, c].join("")
};
JXG.rgb2hsv = function () {
    var a, m, u, n, c, e, d, w, l, y, x, q, f, k;
    a = JXG.rgbParser.apply(JXG.rgbParser, arguments);
    m = a[1];
    u = a[2];
    a = a[0];
    k = JXG.Math.Statistics;
    n = a / 255;
    c = m / 255;
    e = u / 255;
    q = k.max([a, m, u]);
    f = k.min([a, m, u]);
    d = q / 255;
    w = f / 255;
    x = d;
    y = 0;
    if (x > 0) {
        y = (x - w) / (x * 1)
    }
    l = 1 / (d - w);
    if (y > 0) {
        if (q == a) {
            l = (c - e) * l
        } else {
            if (q == m) {
                l = 2 + (e - n) * l
            } else {
                l = 4 + (n - c) * l
            }
        }
    }
    l *= 60;
    if (l < 0) {
        l += 360
    }
    if (q == f) {
        l = 0
    }
    return [l, y, x]
};
JXG.rgb2LMS = function () {
    var k, h, c, d, a, f, e;
    matrix = [
        [0.05059983, 0.08585369, 0.0095242],
        [0.01893033, 0.08925308, 0.01370054],
        [0.00292202, 0.00975732, 0.07145979]
    ];
    k = JXG.rgbParser.apply(JXG.rgbParser, arguments);
    h = k[1];
    c = k[2];
    k = k[0];
    k = Math.pow(k, 0.476190476);
    h = Math.pow(h, 0.476190476);
    c = Math.pow(c, 0.476190476);
    d = k * matrix[0][0] + h * matrix[0][1] + c * matrix[0][2];
    a = k * matrix[1][0] + h * matrix[1][1] + c * matrix[1][2];
    f = k * matrix[2][0] + h * matrix[2][1] + c * matrix[2][2];
    e = [d, a, f];
    e.l = d;
    e.m = a;
    e.s = f;
    return e
};
JXG.LMS2rgb = function (d, c, f) {
    var k, h, a, e;
    matrix = [
        [30.830854, -29.832659, 1.610474],
        [-6.481468, 17.715578, -2.532642],
        [-0.37569, -1.199062, 14.273846]
    ];
    k = d * matrix[0][0] + c * matrix[0][1] + f * matrix[0][2];
    h = d * matrix[1][0] + c * matrix[1][1] + f * matrix[1][2];
    a = d * matrix[2][0] + c * matrix[2][1] + f * matrix[2][2];
    lut_lookup = function (g) {
        var l = 127,
            b = 64;
        while (b > 0) {
            if (Math.pow(l, 0.476190476) > g) {
                l -= b
            } else {
                if (Math.pow(l + 1, 0.476190476) > g) {
                    return l
                }
                l += b
            }
            b /= 2
        }
        if (l == 254 && 13.994955247 < g) {
            return 255
        }
        return l
    };
    k = lut_lookup(k);
    h = lut_lookup(h);
    a = lut_lookup(a);
    e = [k, h, a];
    e.r = k;
    e.g = h;
    e.b = a;
    return e
};
JXG.Board.prototype.angle = function (a, c, b) {
    return this.algebra.angle(a, c, b)
};
JXG.Board.prototype.rad = function (a, c, b) {
    return this.algebra.rad(a, c, b)
};
JXG.Board.prototype.distance = function (b, a) {
    return this.algebra.distance(b, a)
};
JXG.Board.prototype.pow = function (d, c) {
    return this.algebra.pow(d, c)
};
JXG.Board.prototype.round = function (a, b) {
    return (a).toFixed(b)
};
JXG.Board.prototype.cosh = function (a) {
    return JXG.Math.cosh(a)
};
JXG.Board.prototype.sinh = function (a) {
    return JXG.Math.sinh(a)
};
JXG.Board.prototype.sgn = function (a) {
    return (a == 0 ? 0 : a / (Math.abs(a)))
};
JXG.Board.prototype.D = function (a, b) {
    return JXG.Math.Numerics.D(a, b)
};
JXG.Board.prototype.I = function (a, b) {
    return JXG.Math.Numerics.I(a, b)
};
JXG.Board.prototype.root = function (b, a, c) {
    return JXG.Math.Numerics.root(b, a, c)
};
JXG.Board.prototype.lagrangePolynomial = function (a) {
    return JXG.Math.Numerics.lagrangePolynomial(a)
};
JXG.Board.prototype.neville = function (a) {
    return JXG.Math.Numerics.neville(a)
};
JXG.Board.prototype.riemannsum = function (c, e, b, d, a) {
    return JXG.Math.Numerics.riemannsum(c, e, b, d, a)
};
JXG.Board.prototype.abs = Math.abs;
JXG.Board.prototype.acos = Math.acos;
JXG.Board.prototype.asin = Math.asin;
JXG.Board.prototype.atan = Math.atan;
JXG.Board.prototype.ceil = Math.ceil;
JXG.Board.prototype.cos = Math.cos;
JXG.Board.prototype.exp = Math.exp;
JXG.Board.prototype.floor = Math.floor;
JXG.Board.prototype.log = Math.log;
JXG.Board.prototype.max = Math.max;
JXG.Board.prototype.min = Math.min;
JXG.Board.prototype.random = Math.random;
JXG.Board.prototype.sin = Math.sin;
JXG.Board.prototype.sqrt = Math.sqrt;
JXG.Board.prototype.tan = Math.tan;
JXG.Board.prototype.trunc = Math.ceil;
JXG.Board.prototype.factorial = function (a) {
    return JXG.Math.factorial(a)
};
JXG.Board.prototype.binomial = function (b, a) {
    return JXG.Math.binomial(b, a)
};
JXG.Point.prototype.setPositionX = function (c, a) {
    var b = (c == JXG.COORDS_BY_USER) ? this.coords.usrCoords[2] : this.coords.scrCoords[2];
    this.setPosition(c, a, b)
};
JXG.Point.prototype.setPositionY = function (c, b) {
    var a = (c == JXG.COORDS_BY_USER) ? this.coords.usrCoords[1] : this.coords.scrCoords[1];
    this.setPosition(c, a, b)
};
JXG.Board.prototype.getElement = function (a) {
    return JXG.getReference(this, a)
};
JXG.Board.prototype.intersectionOptions = ["point", [
    [JXG.OBJECT_CLASS_LINE, JXG.OBJECT_CLASS_LINE],
    [JXG.OBJECT_CLASS_LINE, JXG.OBJECT_CLASS_CIRCLE],
    [JXG.OBJECT_CLASS_CIRCLE, JXG.OBJECT_CLASS_CIRCLE]
]];
JXG.Board.prototype.intersection = function (d, b, c, a) {
    d = JXG.getReference(this, d);
    b = JXG.getReference(this, b);
    if (d.elementClass == JXG.OBJECT_CLASS_CURVE && b.elementClass == JXG.OBJECT_CLASS_CURVE) {
        return function () {
            return d.board.algebra.meetCurveCurve(d, b, c, a)
        }
    } else {
        if ((d.elementClass == JXG.OBJECT_CLASS_CURVE && b.elementClass == JXG.OBJECT_CLASS_LINE) || (b.elementClass == JXG.OBJECT_CLASS_CURVE && d.elementClass == JXG.OBJECT_CLASS_LINE)) {
            return function () {
                return d.board.algebra.meetCurveLine(d, b, c)
            }
        } else {
            return function () {
                return d.board.algebra.meet(d.stdform, b.stdform, c)
            }
        }
    }
};
JXG.Board.prototype.intersectionFunc = function (d, b, c, a) {
    return this.intersection(d, b, c, a)
};
JXG.Board.prototype.otherIntersection = function (b, a, c) {
    b = JXG.getReference(this, b);
    a = JXG.getReference(this, a);
    return function () {
        var d = b.board.algebra.meet(b.stdform, a.stdform, 0);
        if (Math.abs(c.X() - d.usrCoords[1]) > JXG.Math.eps || Math.abs(c.Y() - d.usrCoords[2]) > JXG.Math.eps || Math.abs(c.Z() - d.usrCoords[0]) > JXG.Math.eps) {
            return d
        } else {
            return b.board.algebra.meet(b.stdform, a.stdform, 1)
        }
    }
};
JXG.Board.prototype.pointFunc = function () {
    return [null]
};
JXG.Board.prototype.pointOptions = ["point", [
    [JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.lineFunc = function () {
    return arguments
};
JXG.Board.prototype.lineOptions = ["line", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.linesegmentFunc = function () {
    return arguments
};
JXG.Board.prototype.linesegmentOptions = ["line", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.linesegmentAtts = {
    straightFirst: false,
    straightLast: false
};
JXG.Board.prototype.arrowFunc = function () {
    return arguments
};
JXG.Board.prototype.arrowOptions = ["arrow", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.circleFunc = function () {
    return arguments
};
JXG.Board.prototype.circleOptions = ["circle", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT],
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE],
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_CIRCLE]
]];
JXG.Board.prototype.arrowparallelOptions = ["arrowparallel", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.arrowparallelFunc = function () {
    return arguments
};
JXG.Board.prototype.bisectorOptions = ["bisector", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.bisectorFunc = function () {
    return arguments
};
JXG.Board.prototype.circumcircleOptions = ["circumcircle", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.circumcircleFunc = function () {
    return arguments
};
JXG.Board.prototype.circumcirclemidpointOptions = ["circumcirclemidpoint", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.circumcirclemidpointFunc = function () {
    return arguments
};
JXG.Board.prototype.integralOptions = ["integral", [
    []
]];
JXG.Board.prototype.integralFunc = function () {
    return arguments
};
JXG.Board.prototype.midpointOptions = ["midpoint", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT],
    [JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.midpointFunc = function () {
    return arguments
};
JXG.Board.prototype.mirrorpointOptions = ["mirrorpoint", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.mirrorpointFunc = function () {
    return arguments
};
JXG.Board.prototype.normalOptions = ["normal", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.normalFunc = function () {
    return arguments
};
JXG.Board.prototype.parallelOptions = ["parallel", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.parallelFunc = function () {
    return arguments
};
JXG.Board.prototype.parallelpointOptions = ["parallelpoint", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_POINT]
]];
JXG.Board.prototype.parallelpointFunc = function () {
    return arguments
};
JXG.Board.prototype.perpendicularOptions = ["perpendicular", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.perpendicularFunc = function () {
    return arguments
};
JXG.Board.prototype.perpendicularpointOptions = ["perpendicularpoint", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.perpendicularpointFunc = function () {
    return arguments
};
JXG.Board.prototype.reflectionOptions = ["reflection", [
    [JXG.OBJECT_CLASS_POINT, JXG.OBJECT_CLASS_LINE]
]];
JXG.Board.prototype.reflectionFunc = function () {
    return arguments
};
JXG.Board.prototype.pstricks = {};
JXG.Board.prototype.pstricks.givePsTricksToDiv = function (a, b) {
    JXG.PsTricks.givePsTricksToDiv(a, b)
};
JXG.Ticks = function (a, f, e, g, b, h, c, d) {
    this.constructor();
    this.type = JXG.OBJECT_TYPE_TICKS;
    this.elementClass = JXG.OBJECT_CLASS_OTHER;
    this.line = a;
    this.board = this.line.board;
    this.ticksFunction = null;
    this.fixedTicks = null;
    this.equidistant = false;
    if (JXG.isFunction(f)) {
        this.ticksFunction = f;
        throw new Error("Function arguments are no longer supported.")
    } else {
        if (JXG.isArray(f)) {
            this.fixedTicks = f
        } else {
            if (Math.abs(f) < JXG.Math.eps) {
                f = this.board.options.line.ticks.defaultDistance
            }
            this.ticksFunction = function (k) {
                return f
            };
            this.equidistant = true
        }
    }
    this.minorTicks = ((e == null) ? this.board.options.line.ticks.minorTicks : e);
    if (this.minorTicks < 0) {
        this.minorTicks = -this.minorTicks
    }
    this.majorHeight = ((g == null) || (g == 0) ? this.board.options.line.ticks.majorHeight : g);
    if (this.majorHeight < 0) {
        this.majorHeight = -this.majorHeight
    }
    this.minorHeight = ((b == null) || (b == 0) ? this.board.options.line.ticks.minorHeight : b);
    if (this.minorHeight < 0) {
        this.minorHeight = -this.minorHeight
    }
    this.minTicksDistance = this.board.options.line.ticks.minTicksDistance;
    this.maxTicksDistance = this.board.options.line.ticks.maxTicksDistance;
    this.insertTicks = this.board.options.line.ticks.insertTicks;
    this.drawZero = this.board.options.line.ticks.drawZero;
    this.drawLabels = this.board.options.line.ticks.drawLabels;
    this.labels = [];
    this.init(this.board, h, c);
    this.visProp.visible = true;
    this.visProp.fillColor = this.line.visProp.fillColor;
    this.visProp.highlightFillColor = this.line.visProp.highlightFillColor;
    this.visProp.strokeColor = this.line.visProp.strokeColor;
    this.visProp.highlightStrokeColor = this.line.visProp.highlightStrokeColor;
    this.visProp.strokeWidth = this.line.visProp.strokeWidth;
    this.id = this.line.addTicks(this)
};
JXG.Ticks.prototype = new JXG.GeometryElement;
JXG.Ticks.prototype.hasPoint = function (a, b) {
    return false
};
JXG.Ticks.prototype.calculateTicksCoordinates = function () {
    var L = this.line.point1,
        K = this.line.point2,
        d = L.coords.distance(JXG.COORDS_BY_USER, K.coords),
        h = (K.coords.usrCoords[1] - L.coords.usrCoords[1]) / d,
        g = (K.coords.usrCoords[2] - L.coords.usrCoords[2]) / d,
        s = L.coords.distance(JXG.COORDS_BY_SCREEN, new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1] + h, L.coords.usrCoords[2] + g], this.board)),
        B = (this.equidistant ? this.ticksFunction(1) : 1),
        H = 5,
        w, u, N = 1,
        k, q, y, n, I, C, P = function (W, Q, T, S, V) {
            var U, R;
            U = W.toString();
            if (U.length > 5) {
                U = W.toPrecision(3).toString()
            }
            R = new JXG.Text(T, U, null, [Q.usrCoords[1], Q.usrCoords[2]], V + I + "Label", "", null, true, T.options.text.defaultDisplay);
            R.distanceX = 0;
            R.distanceY = -10;
            R.setCoords(Q.usrCoords[1] * 1 + R.distanceX / (T.stretchX), Q.usrCoords[2] * 1 + R.distanceY / (T.stretchY));
            if (S) {
                R.visProp.visible = true
            } else {
                R.visProp.visible = false
            }
            return R
        },
        a = function (Q) {
            return Math.floor(Q) - (Math.floor(Q) % B)
        },
        x = JXG.Math.eps,
        r = -this.line.getSlope(),
        J = this.majorHeight / 2,
        e = this.minorHeight / 2,
        c = 0,
        A = 0,
        z = 0,
        O = 0;
    if (Math.abs(r) < x) {
        c = 0;
        A = J;
        z = 0;
        O = e
    } else {
        if ((Math.abs(r) > 1 / x) || (isNaN(r))) {
            c = J;
            A = 0;
            z = e;
            O = 0
        } else {
            c = -J / Math.sqrt(1 / (r * r) + 1);
            A = c / r;
            z = -e / Math.sqrt(1 / (r * r) + 1);
            O = z / r
        }
    }
    if (this.ticks != null) {
        for (var G = 0; G < this.ticks.length; G++) {
            if (this.labels[G] != null) {
                if (this.labels[G].visProp.visible) {
                    this.board.renderer.remove(this.labels[G].rendNode)
                }
            }
        }
    }
    this.ticks = new Array();
    this.labels = new Array();
    w = new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1], L.coords.usrCoords[2]], this.board);
    u = new JXG.Coords(JXG.COORDS_BY_USER, [K.coords.usrCoords[1], K.coords.usrCoords[2]], this.board);
    this.board.renderer.calcStraight(this.line, w, u);
    if (!this.equidistant) {
        var m = L.coords.usrCoords[1] - w.usrCoords[1];
        var l = L.coords.usrCoords[2] - w.usrCoords[2];
        var v = Math.sqrt(m * m + l * l);
        var f = L.coords.usrCoords[1] - u.usrCoords[1];
        var D = L.coords.usrCoords[2] - u.usrCoords[2];
        var b = Math.sqrt(f * f + D * D);
        var F = 0;
        var E = 0;
        for (var I = 0; I < this.fixedTicks.length; I++) {
            if ((-v <= this.fixedTicks[I]) && (this.fixedTicks[I] <= b)) {
                if (this.fixedTicks[I] < 0) {
                    F = Math.abs(m) * this.fixedTicks[I] / v;
                    E = Math.abs(l) * this.fixedTicks[I] / v
                } else {
                    F = Math.abs(f) * this.fixedTicks[I] / b;
                    E = Math.abs(D) * this.fixedTicks[I] / b
                }
                y = new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1] + F, L.coords.usrCoords[2] + E], this.board);
                this.ticks.push(y);
                this.ticks[this.ticks.length - 1].major = true;
                this.labels.push(P(this.fixedTicks[I], y, this.board, this.drawLabels, this.id))
            }
        }
        this.board.renderer.updateTicks(this, c, A, z, O);
        return
    }
    while (s > 4 * this.minTicksDistance) {
        B /= 10;
        h /= 10;
        g /= 10;
        s = L.coords.distance(JXG.COORDS_BY_SCREEN, new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1] + h, L.coords.usrCoords[2] + g], this.board))
    }
    while (s < this.minTicksDistance) {
        B *= H;
        h *= H;
        g *= H;
        H = (H == 5 ? 2 : 5);
        s = L.coords.distance(JXG.COORDS_BY_SCREEN, new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1] + h, L.coords.usrCoords[2] + g], this.board))
    }
    if (this.board.renderer.isSameDirection(L.coords, w, u)) {
        k = a(L.coords.distance(JXG.COORDS_BY_USER, w));
        q = L.coords.distance(JXG.COORDS_BY_USER, u);
        if (this.board.renderer.isSameDirection(L.coords, K.coords, w)) {
            if (this.line.visProp.straightFirst) {
                k -= 2 * B
            }
        } else {
            q = -1 * q;
            k = -1 * k;
            if (this.line.visProp.straightFirst) {
                k -= 2 * B
            }
        }
    } else {
        if (!this.line.visProp.straightFirst) {
            k = 0
        } else {
            k = -a(L.coords.distance(JXG.COORDS_BY_USER, w)) - 2 * B
        }
        if (!this.line.visProp.straightLast) {
            q = d
        } else {
            q = L.coords.distance(JXG.COORDS_BY_USER, u)
        }
    }
    n = new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1] + k * h / B, L.coords.usrCoords[2] + k * g / B], this.board);
    y = new JXG.Coords(JXG.COORDS_BY_USER, [L.coords.usrCoords[1] + k * h / B, L.coords.usrCoords[2] + k * g / B], this.board);
    h /= this.minorTicks + 1;
    g /= this.minorTicks + 1;
    I = 0;
    C = k;
    while (n.distance(JXG.COORDS_BY_USER, y) < Math.abs(q - k) + JXG.Math.eps) {
        if (I % (this.minorTicks + 1) == 0) {
            y.major = true;
            this.labels.push(P(C, y, this.board, this.drawLabels, this.id));
            C += B
        } else {
            y.major = false;
            this.labels.push(null)
        }
        I++;
        this.ticks.push(y);
        y = new JXG.Coords(JXG.COORDS_BY_USER, [y.usrCoords[1] + h, y.usrCoords[2] + g], this.board);
        if (!this.drawZero && y.distance(JXG.COORDS_BY_USER, L.coords) <= JXG.Math.eps) {
            I++;
            C += B;
            y = new JXG.Coords(JXG.COORDS_BY_USER, [y.usrCoords[1] + h, y.usrCoords[2] + g], this.board)
        }
    }
    this.board.renderer.updateTicks(this, c, A, z, O);
    return
};
JXG.Ticks.prototype.updateRenderer = function () {
    if (this.needsUpdate) {
        this.calculateTicksCoordinates();
        this.needsUpdate = false
    }
};
JXG.createTicks = function (d, b, a) {
    var c;
    a = JXG.checkAttributes(a, {
        layer: null
    });
    if ((b[0].elementClass == JXG.OBJECT_CLASS_LINE) && (JXG.isFunction(b[1]) || JXG.isArray(b[1]) || JXG.isNumber(b[1]))) {
        c = new JXG.Ticks(b[0], b[1], a.minorTicks, a.majHeight, a.minHeight, a.id, a.name, a.layer)
    } else {
        throw new Error("JSXGraph: Can't create Ticks with parent types '" + (typeof b[0]) + "' and '" + (typeof b[1]) + "' and '" + (typeof b[2]) + "'.")
    }
    return c
};
JXG.JSXGraph.registerElement("ticks", JXG.createTicks);
JXG.Util = {};
JXG.Util.Unzip = function (W) {
    var q = [],
        I = "",
        G = false,
        D, J = 0,
        T = [],
        v, h = new Array(32768),
        ab = 0,
        O = false,
        Y, K, aa = [0, 128, 64, 192, 32, 160, 96, 224, 16, 144, 80, 208, 48, 176, 112, 240, 8, 136, 72, 200, 40, 168, 104, 232, 24, 152, 88, 216, 56, 184, 120, 248, 4, 132, 68, 196, 36, 164, 100, 228, 20, 148, 84, 212, 52, 180, 116, 244, 12, 140, 76, 204, 44, 172, 108, 236, 28, 156, 92, 220, 60, 188, 124, 252, 2, 130, 66, 194, 34, 162, 98, 226, 18, 146, 82, 210, 50, 178, 114, 242, 10, 138, 74, 202, 42, 170, 106, 234, 26, 154, 90, 218, 58, 186, 122, 250, 6, 134, 70, 198, 38, 166, 102, 230, 22, 150, 86, 214, 54, 182, 118, 246, 14, 142, 78, 206, 46, 174, 110, 238, 30, 158, 94, 222, 62, 190, 126, 254, 1, 129, 65, 193, 33, 161, 97, 225, 17, 145, 81, 209, 49, 177, 113, 241, 9, 137, 73, 201, 41, 169, 105, 233, 25, 153, 89, 217, 57, 185, 121, 249, 5, 133, 69, 197, 37, 165, 101, 229, 21, 149, 85, 213, 53, 181, 117, 245, 13, 141, 77, 205, 45, 173, 109, 237, 29, 157, 93, 221, 61, 189, 125, 253, 3, 131, 67, 195, 35, 163, 99, 227, 19, 147, 83, 211, 51, 179, 115, 243, 11, 139, 75, 203, 43, 171, 107, 235, 27, 155, 91, 219, 59, 187, 123, 251, 7, 135, 71, 199, 39, 167, 103, 231, 23, 151, 87, 215, 55, 183, 119, 247, 15, 143, 79, 207, 47, 175, 111, 239, 31, 159, 95, 223, 63, 191, 127, 255],
        ae = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
        V = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99],
        P = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
        C = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
        r = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
        z = W,
        b = 0,
        g = 0,
        af = 1,
        a = 0,
        ad = 256,
        f = [],
        l;

    function d() {
        a += 8;
        if (b < z.length) {
            return z[b++]
        } else {
            return -1
        }
    }
    function s() {
        af = 1
    }
    function Z() {
        var ah;
        a++;
        ah = (af & 1);
        af >>= 1;
        if (af == 0) {
            af = d();
            ah = (af & 1);
            af = (af >> 1) | 128
        }
        return ah
    }
    function X(ah) {
        var aj = 0,
            ai = ah;
        while (ai--) {
            aj = (aj << 1) | Z()
        }
        if (ah) {
            aj = aa[aj] >> (8 - ah)
        }
        return aj
    }
    function c() {
        ab = 0
    }
    function A(ah) {
        K++;
        h[ab++] = ah;
        q.push(String.fromCharCode(ah));
        if (ab == 32768) {
            ab = 0
        }
    }
    function n() {
        this.b0 = 0;
        this.b1 = 0;
        this.jump = null;
        this.jumppos = -1
    }
    var e = 288;
    var y = new Array(e);
    var R = new Array(32);
    var L = 0;
    var ac = null;
    var u = null;
    var Q = new Array(64);
    var N = new Array(64);
    var B = 0;
    var F = new Array(17);
    F[0] = 0;
    var S;
    var x;

    function k() {
        while (1) {
            if (F[B] >= x) {
                return -1
            }
            if (S[F[B]] == B) {
                return F[B]++
            }
            F[B]++
        }
    }
    function H() {
        var ai = ac[L];
        var ah;
        if (G) {
            document.write("<br>len:" + B + " treepos:" + L)
        }
        if (B == 17) {
            return -1
        }
        L++;
        B++;
        ah = k();
        if (G) {
            document.write("<br>IsPat " + ah)
        }
        if (ah >= 0) {
            ai.b0 = ah;
            if (G) {
                document.write("<br>b0 " + ai.b0)
            }
        } else {
            ai.b0 = 32768;
            if (G) {
                document.write("<br>b0 " + ai.b0)
            }
            if (H()) {
                return -1
            }
        }
        ah = k();
        if (ah >= 0) {
            ai.b1 = ah;
            if (G) {
                document.write("<br>b1 " + ai.b1)
            }
            ai.jump = null
        } else {
            ai.b1 = 32768;
            if (G) {
                document.write("<br>b1 " + ai.b1)
            }
            ai.jump = ac[L];
            ai.jumppos = L;
            if (H()) {
                return -1
            }
        }
        B--;
        return 0
    }
    function m(al, aj, am, ai) {
        var ak;
        if (G) {
            document.write("currentTree " + al + " numval " + aj + " lengths " + am + " show " + ai)
        }
        ac = al;
        L = 0;
        S = am;
        x = aj;
        for (ak = 0; ak < 17; ak++) {
            F[ak] = 0
        }
        B = 0;
        if (H()) {
            if (G) {
                alert("invalid huffman tree\n")
            }
            return -1
        }
        if (G) {
            document.write("<br>Tree: " + ac.length);
            for (var ah = 0; ah < 32; ah++) {
                document.write("Places[" + ah + "].b0=" + ac[ah].b0 + "<br>");
                document.write("Places[" + ah + "].b1=" + ac[ah].b1 + "<br>")
            }
        }
        return 0
    }
    function E(ak) {
        var ai, aj, am = 0,
            al = ak[am],
            ah;
        while (1) {
            ah = Z();
            if (G) {
                document.write("b=" + ah)
            }
            if (ah) {
                if (!(al.b1 & 32768)) {
                    if (G) {
                        document.write("ret1")
                    }
                    return al.b1
                }
                al = al.jump;
                ai = ak.length;
                for (aj = 0; aj < ai; aj++) {
                    if (ak[aj] === al) {
                        am = aj;
                        break
                    }
                }
            } else {
                if (!(al.b0 & 32768)) {
                    if (G) {
                        document.write("ret2")
                    }
                    return al.b0
                }
                am++;
                al = ak[am]
            }
        }
        if (G) {
            document.write("ret3")
        }
        return -1
    }
    function ag() {
        var al, ay, ai, aw, ax;
        do {
            al = Z();
            ai = X(2);
            switch (ai) {
            case 0:
                if (G) {
                    alert("Stored\n")
                }
                break;
            case 1:
                if (G) {
                    alert("Fixed Huffman codes\n")
                }
                break;
            case 2:
                if (G) {
                    alert("Dynamic Huffman codes\n")
                }
                break;
            case 3:
                if (G) {
                    alert("Reserved block type!!\n")
                }
                break;
            default:
                if (G) {
                    alert("Unexpected value %d!\n", ai)
                }
                break
            }
            if (ai == 0) {
                var au, ah;
                s();
                au = d();
                au |= (d() << 8);
                ah = d();
                ah |= (d() << 8);
                if (((au ^ ~ah) & 65535)) {
                    document.write("BlockLen checksum mismatch\n")
                }
                while (au--) {
                    ay = d();
                    A(ay)
                }
            } else {
                if (ai == 1) {
                    var av;
                    while (1) {
                        av = (aa[X(7)] >> 1);
                        if (av > 23) {
                            av = (av << 1) | Z();
                            if (av > 199) {
                                av -= 128;
                                av = (av << 1) | Z()
                            } else {
                                av -= 48;
                                if (av > 143) {
                                    av = av + 136
                                }
                            }
                        } else {
                            av += 256
                        }
                        if (av < 256) {
                            A(av)
                        } else {
                            if (av == 256) {
                                break
                            } else {
                                var ax, aq;
                                av -= 256 + 1;
                                ax = X(V[av]) + ae[av];
                                av = aa[X(5)] >> 3;
                                if (C[av] > 8) {
                                    aq = X(8);
                                    aq |= (X(C[av] - 8) << 8)
                                } else {
                                    aq = X(C[av])
                                }
                                aq += P[av];
                                for (av = 0; av < ax; av++) {
                                    var ay = h[(ab - aq) & 32767];
                                    A(ay)
                                }
                            }
                        }
                    }
                } else {
                    if (ai == 2) {
                        var av, ar, aj, ao, ap;
                        var an = new Array(288 + 32);
                        aj = 257 + X(5);
                        ao = 1 + X(5);
                        ap = 4 + X(4);
                        for (av = 0; av < 19; av++) {
                            an[av] = 0
                        }
                        for (av = 0; av < ap; av++) {
                            an[r[av]] = X(3)
                        }
                        ax = R.length;
                        for (aw = 0; aw < ax; aw++) {
                            R[aw] = new n()
                        }
                        if (m(R, 19, an, 0)) {
                            c();
                            return 1
                        }
                        if (G) {
                            document.write("<br>distanceTree");
                            for (var az = 0; az < R.length; az++) {
                                document.write("<br>" + R[az].b0 + " " + R[az].b1 + " " + R[az].jump + " " + R[az].jumppos)
                            }
                        }
                        ar = aj + ao;
                        aw = 0;
                        var ak = -1;
                        if (G) {
                            document.write("<br>n=" + ar + " bits: " + a + "<br>")
                        }
                        while (aw < ar) {
                            ak++;
                            av = E(R);
                            if (G) {
                                document.write("<br>" + ak + " i:" + aw + " decode: " + av + "    bits " + a + "<br>")
                            }
                            if (av < 16) {
                                an[aw++] = av
                            } else {
                                if (av == 16) {
                                    var at;
                                    av = 3 + X(2);
                                    if (aw + av > ar) {
                                        c();
                                        return 1
                                    }
                                    at = aw ? an[aw - 1] : 0;
                                    while (av--) {
                                        an[aw++] = at
                                    }
                                } else {
                                    if (av == 17) {
                                        av = 3 + X(3)
                                    } else {
                                        av = 11 + X(7)
                                    }
                                    if (aw + av > ar) {
                                        c();
                                        return 1
                                    }
                                    while (av--) {
                                        an[aw++] = 0
                                    }
                                }
                            }
                        }
                        ax = y.length;
                        for (aw = 0; aw < ax; aw++) {
                            y[aw] = new n()
                        }
                        if (m(y, aj, an, 0)) {
                            c();
                            return 1
                        }
                        ax = y.length;
                        for (aw = 0; aw < ax; aw++) {
                            R[aw] = new n()
                        }
                        var am = new Array();
                        for (aw = aj; aw < an.length; aw++) {
                            am[aw - aj] = an[aw]
                        }
                        if (m(R, ao, am, 0)) {
                            c();
                            return 1
                        }
                        if (G) {
                            document.write("<br>literalTree")
                        }
                        while (1) {
                            av = E(y);
                            if (av >= 256) {
                                var ax, aq;
                                av -= 256;
                                if (av == 0) {
                                    break
                                }
                                av--;
                                ax = X(V[av]) + ae[av];
                                av = E(R);
                                if (C[av] > 8) {
                                    aq = X(8);
                                    aq |= (X(C[av] - 8) << 8)
                                } else {
                                    aq = X(C[av])
                                }
                                aq += P[av];
                                while (ax--) {
                                    var ay = h[(ab - aq) & 32767];
                                    A(ay)
                                }
                            } else {
                                A(av)
                            }
                        }
                    }
                }
            }
        } while (!al);
        c();
        s();
        return 0
    }
    JXG.Util.Unzip.prototype.unzipFile = function (ah) {
        var ai;
        this.unzip();
        for (ai = 0; ai < T.length; ai++) {
            if (T[ai][1] == ah) {
                return T[ai][0]
            }
        }
    };
    JXG.Util.Unzip.prototype.unzip = function () {
        if (G) {
            alert(z)
        }
        w();
        return T
    };

    function w() {
        if (G) {
            alert("NEXTFILE")
        }
        q = [];
        var al = [];
        O = false;
        al[0] = d();
        al[1] = d();
        if (G) {
            alert("type: " + al[0] + " " + al[1])
        }
        if (al[0] == parseInt("78", 16) && al[1] == parseInt("da", 16)) {
            if (G) {
                alert("GEONExT-GZIP")
            }
            ag();
            if (G) {
                alert(q.join(""))
            }
            T[J] = new Array(2);
            T[J][0] = q.join("");
            T[J][1] = "geonext.gxt";
            J++
        }
        if (al[0] == parseInt("1f", 16) && al[1] == parseInt("8b", 16)) {
            if (G) {
                alert("GZIP")
            }
            U();
            if (G) {
                alert(q.join(""))
            }
            T[J] = new Array(2);
            T[J][0] = q.join("");
            T[J][1] = "file";
            J++
        }
        if (al[0] == parseInt("50", 16) && al[1] == parseInt("4b", 16)) {
            O = true;
            al[2] = d();
            al[3] = d();
            if (al[2] == parseInt("3", 16) && al[3] == parseInt("4", 16)) {
                al[0] = d();
                al[1] = d();
                if (G) {
                    alert("ZIP-Version: " + al[1] + " " + al[0] / 10 + "." + al[0] % 10)
                }
                D = d();
                D |= (d() << 8);
                if (G) {
                    alert("gpflags: " + D)
                }
                var ah = d();
                ah |= (d() << 8);
                if (G) {
                    alert("method: " + ah)
                }
                d();
                d();
                d();
                d();
                var am = d();
                am |= (d() << 8);
                am |= (d() << 16);
                am |= (d() << 24);
                var ak = d();
                ak |= (d() << 8);
                ak |= (d() << 16);
                ak |= (d() << 24);
                var ap = d();
                ap |= (d() << 8);
                ap |= (d() << 16);
                ap |= (d() << 24);
                if (G) {
                    alert("local CRC: " + am + "\nlocal Size: " + ap + "\nlocal CompSize: " + ak)
                }
                var ai = d();
                ai |= (d() << 8);
                var ao = d();
                ao |= (d() << 8);
                if (G) {
                    alert("filelen " + ai)
                }
                aj = 0;
                f = [];
                while (ai--) {
                    var an = d();
                    if (an == "/" | an == ":") {
                        aj = 0
                    } else {
                        if (aj < ad - 1) {
                            f[aj++] = String.fromCharCode(an)
                        }
                    }
                }
                if (G) {
                    alert("nameBuf: " + f)
                }
                if (!l) {
                    l = f
                }
                var aj = 0;
                while (aj < ao) {
                    an = d();
                    aj++
                }
                Y = 4294967295;
                K = 0;
                if (ap = 0 && fileOut.charAt(l.length - 1) == "/") {
                    if (G) {
                        alert("skipdir")
                    }
                }
                if (ah == 8) {
                    ag();
                    if (G) {
                        alert(q.join(""))
                    }
                    T[J] = new Array(2);
                    T[J][0] = q.join("");
                    T[J][1] = f.join("");
                    J++
                }
                U()
            }
        }
    }
    function U() {
        var am, aj = [],
            ak, ai, al, ah, an;
        if ((D & 8)) {
            aj[0] = d();
            aj[1] = d();
            aj[2] = d();
            aj[3] = d();
            if (aj[0] == parseInt("50", 16) && aj[1] == parseInt("4b", 16) && aj[2] == parseInt("07", 16) && aj[3] == parseInt("08", 16)) {
                am = d();
                am |= (d() << 8);
                am |= (d() << 16);
                am |= (d() << 24)
            } else {
                am = aj[0] | (aj[1] << 8) | (aj[2] << 16) | (aj[3] << 24)
            }
            ak = d();
            ak |= (d() << 8);
            ak |= (d() << 16);
            ak |= (d() << 24);
            ai = d();
            ai |= (d() << 8);
            ai |= (d() << 16);
            ai |= (d() << 24);
            if (G) {
                alert("CRC:")
            }
        }
        if (O) {
            w()
        }
        aj[0] = d();
        if (aj[0] != 8) {
            if (G) {
                alert("Unknown compression method!")
            }
            return 0
        }
        D = d();
        if (G) {
            if ((D & ~ (parseInt("1f", 16)))) {
                alert("Unknown flags set!")
            }
        }
        d();
        d();
        d();
        d();
        d();
        al = d();
        if ((D & 4)) {
            aj[0] = d();
            aj[2] = d();
            B = aj[0] + 256 * aj[1];
            if (G) {
                alert("Extra field size: " + B)
            }
            for (ah = 0; ah < B; ah++) {
                d()
            }
        }
        if ((D & 8)) {
            ah = 0;
            f = [];
            while (an = d()) {
                if (an == "7" || an == ":") {
                    ah = 0
                }
                if (ah < ad - 1) {
                    f[ah++] = an
                }
            }
            if (G) {
                alert("original file name: " + f)
            }
        }
        if ((D & 16)) {
            while (an = d()) {}
        }
        if ((D & 2)) {
            d();
            d()
        }
        ag();
        am = d();
        am |= (d() << 8);
        am |= (d() << 16);
        am |= (d() << 24);
        ai = d();
        ai |= (d() << 8);
        ai |= (d() << 16);
        ai |= (d() << 24);
        if (O) {
            w()
        }
    }
};
JXG.Util.Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (c) {
        var a = [],
            l, h, f, k, g, e, d, b = 0;
        c = JXG.Util.Base64._utf8_encode(c);
        while (b < c.length) {
            l = c.charCodeAt(b++);
            h = c.charCodeAt(b++);
            f = c.charCodeAt(b++);
            k = l >> 2;
            g = ((l & 3) << 4) | (h >> 4);
            e = ((h & 15) << 2) | (f >> 6);
            d = f & 63;
            if (isNaN(h)) {
                e = d = 64
            } else {
                if (isNaN(f)) {
                    d = 64
                }
            }
            a.push([this._keyStr.charAt(k), this._keyStr.charAt(g), this._keyStr.charAt(e), this._keyStr.charAt(d)].join(""))
        }
        return a.join("")
    },
    decode: function (d, c) {
        var a = [],
            m, k, g, l, h, f, e, b = 0;
        d = d.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (b < d.length) {
            l = this._keyStr.indexOf(d.charAt(b++));
            h = this._keyStr.indexOf(d.charAt(b++));
            f = this._keyStr.indexOf(d.charAt(b++));
            e = this._keyStr.indexOf(d.charAt(b++));
            m = (l << 2) | (h >> 4);
            k = ((h & 15) << 4) | (f >> 2);
            g = ((f & 3) << 6) | e;
            a.push(String.fromCharCode(m));
            if (f != 64) {
                a.push(String.fromCharCode(k))
            }
            if (e != 64) {
                a.push(String.fromCharCode(g))
            }
        }
        a = a.join("");
        if (c) {
            a = JXG.Util.Base64._utf8_decode(a)
        }
        return a
    },
    _utf8_encode: function (b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var e = 0; e < b.length; e++) {
            var d = b.charCodeAt(e);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    },
    _utf8_decode: function (a) {
        var d = [],
            f = 0,
            g = 0,
            e = 0,
            b = 0;
        while (f < a.length) {
            g = a.charCodeAt(f);
            if (g < 128) {
                d.push(String.fromCharCode(g));
                f++
            } else {
                if ((g > 191) && (g < 224)) {
                    e = a.charCodeAt(f + 1);
                    d.push(String.fromCharCode(((g & 31) << 6) | (e & 63)));
                    f += 2
                } else {
                    e = a.charCodeAt(f + 1);
                    b = a.charCodeAt(f + 2);
                    d.push(String.fromCharCode(((g & 15) << 12) | ((e & 63) << 6) | (b & 63)));
                    f += 3
                }
            }
        }
        return d.join("")
    },
    _destrip: function (f, d) {
        var b = [],
            e, c, a = [];
        if (d == null) {
            d = 76
        }
        f.replace(/ /g, "");
        e = f.length / d;
        for (c = 0; c < e; c++) {
            b[c] = f.substr(c * d, d)
        }
        if (e != f.length / d) {
            b[b.length] = f.substr(e * d, f.length - (e * d))
        }
        for (c = 0; c < b.length; c++) {
            a.push(b[c])
        }
        return a.join("\n")
    },
    decodeAsArray: function (b) {
        var d = this.decode(b),
            a = [],
            c;
        for (c = 0; c < d.length; c++) {
            a[c] = d.charCodeAt(c)
        }
        return a
    },
    decodeGEONExT: function (a) {
        return decodeAsArray(destrip(a), false)
    }
};
JXG.Util.asciiCharCodeAt = function (b, a) {
    var d = b.charCodeAt(a);
    if (d > 255) {
        switch (d) {
        case 8364:
            d = 128;
            break;
        case 8218:
            d = 130;
            break;
        case 402:
            d = 131;
            break;
        case 8222:
            d = 132;
            break;
        case 8230:
            d = 133;
            break;
        case 8224:
            d = 134;
            break;
        case 8225:
            d = 135;
            break;
        case 710:
            d = 136;
            break;
        case 8240:
            d = 137;
            break;
        case 352:
            d = 138;
            break;
        case 8249:
            d = 139;
            break;
        case 338:
            d = 140;
            break;
        case 381:
            d = 142;
            break;
        case 8216:
            d = 145;
            break;
        case 8217:
            d = 146;
            break;
        case 8220:
            d = 147;
            break;
        case 8221:
            d = 148;
            break;
        case 8226:
            d = 149;
            break;
        case 8211:
            d = 150;
            break;
        case 8212:
            d = 151;
            break;
        case 732:
            d = 152;
            break;
        case 8482:
            d = 153;
            break;
        case 353:
            d = 154;
            break;
        case 8250:
            d = 155;
            break;
        case 339:
            d = 156;
            break;
        case 382:
            d = 158;
            break;
        case 376:
            d = 159;
            break;
        default:
            break
        }
    }
    return d
};
JXG.Util.utf8Decode = function (a) {
    var b = [];
    var e = 0;
    var g = 0,
        f = 0,
        d = 0;
    while (e < a.length) {
        g = a.charCodeAt(e);
        if (g < 128) {
            b.push(String.fromCharCode(g));
            e++
        } else {
            if ((g > 191) && (g < 224)) {
                d = a.charCodeAt(e + 1);
                b.push(String.fromCharCode(((g & 31) << 6) | (d & 63)));
                e += 2
            } else {
                d = a.charCodeAt(e + 1);
                c3 = a.charCodeAt(e + 2);
                b.push(String.fromCharCode(((g & 15) << 12) | ((d & 63) << 6) | (c3 & 63)));
                e += 3
            }
        }
    }
    return b.join("")
};
JXG.PsTricks = new function () {
    this.psTricksString = ""
};
JXG.PsTricks.convertBoardToPsTricks = function (b) {
    var d = new JXG.Coords(JXG.COORDS_BY_SCREEN, [b.canvasWidth, b.canvasHeight], b);
    var c = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, 0], b);
    this.psTricksString = "\\begin{pspicture*}(" + c.usrCoords[1] + "," + d.usrCoords[2] + ")(" + d.usrCoords[1] + "," + c.usrCoords[2] + ")\n";
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_ARC) {
            if (e.visProp.visible) {
                this.addSector(e)
            }
        }
    }
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_POLYGON) {
            if (e.visProp.visible) {
                this.addPolygon(e)
            }
        }
    }
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_ANGLE) {
            if (e.visProp.visible) {
                this.addAngle(e)
            }
        }
    }
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_CIRCLE) {
            if (e.visProp.visible) {
                this.addCircle(e)
            }
        }
    }
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_ARC) {
            if (e.visProp.visible) {
                this.addArc(e)
            }
        }
    }
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_LINE) {
            if (e.visProp.visible) {
                this.addLine(e)
            }
        }
    }
    for (var a in b.objects) {
        var e = b.objects[a];
        if (e.type == JXG.OBJECT_TYPE_POINT) {
            if (e.visProp.visible) {
                this.addPoint(e)
            }
        }
    }
    this.psTricksString += "\\end{pspicture*}"
};
JXG.PsTricks.givePsTricksToDiv = function (a, b) {
    this.convertBoardToPsTricks(b);
    document.getElementById(a).innerHTML = this.psTricksString
};
JXG.PsTricks.addPoint = function (a) {
    this.psTricksString += "\\psdot";
    this.psTricksString += "[linecolor=" + this.parseColor(a.visProp.strokeColor) + ",";
    this.psTricksString += "dotstyle=";
    if (a.visProp.face == "cross") {
        this.psTricksString += "x, dotsize=";
        if (a.visProp.size == 2) {
            this.psTricksString += "2pt 2"
        } else {
            if (a.visProp.size == 3) {
                this.psTricksString += "5pt 2"
            } else {
                if (a.visProp.size >= 4) {
                    this.psTricksString += "5pt 3"
                }
            }
        }
    } else {
        if (a.visProp.face == "circle") {
            this.psTricksString += "*, dotsize=";
            if (a.visProp.size == 1) {
                this.psTricksString += "2pt 2"
            } else {
                if (a.visProp.size == 2) {
                    this.psTricksString += "4pt 2"
                } else {
                    if (a.visProp.size == 3) {
                        this.psTricksString += "6pt 2"
                    } else {
                        if (a.visProp.size >= 4) {
                            this.psTricksString += "6pt 3"
                        }
                    }
                }
            }
        } else {
            if (a.visProp.face == "square") {
                this.psTricksString += "square*, dotsize=";
                if (a.visProp.size == 2) {
                    this.psTricksString += "2pt 2"
                } else {
                    if (a.visProp.size == 3) {
                        this.psTricksString += "5pt 2"
                    } else {
                        if (a.visProp.size >= 4) {
                            this.psTricksString += "5pt 3"
                        }
                    }
                }
            } else {
                if (a.visProp.face == "plus") {
                    this.psTricksString += "+, dotsize=";
                    if (a.visProp.size == 2) {
                        this.psTricksString += "2pt 2"
                    } else {
                        if (a.visProp.size == 3) {
                            this.psTricksString += "5pt 2"
                        } else {
                            if (a.visProp.size >= 4) {
                                this.psTricksString += "5pt 3"
                            }
                        }
                    }
                }
            }
        }
    }
    this.psTricksString += "]";
    this.psTricksString += "(" + a.coords.usrCoords[1] + "," + a.coords.usrCoords[2] + ")\n";
    this.psTricksString += "\\rput(" + (a.coords.usrCoords[1] + 15 / a.board.stretchY) + "," + (a.coords.usrCoords[2] + 15 / a.board.stretchY) + "){\\small $" + a.name + "$}\n"
};
JXG.PsTricks.addLine = function (c) {
    var b = new JXG.Coords(JXG.COORDS_BY_USER, c.point1.coords.usrCoords, c.board);
    var a = new JXG.Coords(JXG.COORDS_BY_USER, c.point2.coords.usrCoords, c.board);
    if (c.visProp.straightFirst || c.visProp.straightLast) {
        c.board.renderer.calcStraight(c, b, a)
    }
    this.psTricksString += "\\psline";
    this.psTricksString += "[linecolor=" + this.parseColor(c.visProp.strokeColor) + ", linewidth=" + c.visProp.strokeWidth + "px";
    this.psTricksString += "]";
    if (c.visProp.firstArrow) {
        if (c.visProp.lastArrow) {
            this.psTricksString += "{<->}"
        } else {
            this.psTricksString += "{<-}"
        }
    } else {
        if (c.visProp.lastArrow) {
            this.psTricksString += "{->}"
        }
    }
    this.psTricksString += "(" + b.usrCoords[1] + "," + b.usrCoords[2] + ")(" + a.usrCoords[1] + "," + a.usrCoords[2] + ")\n"
};
JXG.PsTricks.addCircle = function (b) {
    var a = b.Radius();
    this.psTricksString += "\\pscircle";
    this.psTricksString += "[linecolor=" + this.parseColor(b.visProp.strokeColor) + ", linewidth=" + b.visProp.strokeWidth + "px";
    if (b.visProp.fillColor != "none" && b.visProp.fillOpacity != 0) {
        this.psTricksString += ", fillstyle=solid, fillcolor=" + this.parseColor(b.visProp.fillColor) + ", opacity=" + JXG.Math.round(b.visProp.fillOpacity, 5)
    }
    this.psTricksString += "]";
    this.psTricksString += "(" + b.midpoint.coords.usrCoords[1] + "," + b.midpoint.coords.usrCoords[2] + "){" + a + "}\n"
};
JXG.PsTricks.addPolygon = function (b) {
    this.psTricksString += "\\pspolygon";
    this.psTricksString += "[linestyle=none, fillstyle=solid, fillcolor=" + this.parseColor(b.visProp.fillColor) + ", opacity=" + JXG.Math.round(b.visProp.fillOpacity, 5) + "]";
    for (var a = 0; a < b.vertices.length; a++) {
        this.psTricksString += "(" + b.vertices[a].coords.usrCoords[1] + "," + b.vertices[a].coords.usrCoords[2] + ")"
    }
    this.psTricksString += "\n"
};
JXG.PsTricks.addArc = function (b) {
    var a = b.Radius();
    var d = {};
    d.coords = new JXG.Coords(JXG.COORDS_BY_USER, [b.board.canvasWidth / (b.board.stretchY), b.midpoint.coords.usrCoords[2]], b.board);
    var c = JXG.Math.round(b.board.algebra.trueAngle(d, b.midpoint, b.point2), 4);
    var e = JXG.Math.round(b.board.algebra.trueAngle(d, b.midpoint, b.point3), 4);
    this.psTricksString += "\\psarc";
    this.psTricksString += "[linecolor=" + this.parseColor(b.visProp.strokeColor) + ", linewidth=" + b.visProp.strokeWidth + "px";
    this.psTricksString += "]";
    if (b.visProp.lastArrow) {
        if (b.visProp.firstArrow) {
            this.psTricksString += "{<->}"
        } else {
            this.psTricksString += "{<-}"
        }
    } else {
        if (b.visProp.firstArrow) {
            this.psTricksString += "{->}"
        }
    }
    this.psTricksString += "(" + b.midpoint.coords.usrCoords[1] + "," + b.midpoint.coords.usrCoords[2] + "){" + a + "}{" + c + "}{" + e + "}\n"
};
JXG.PsTricks.addSector = function (b) {
    var a = b.Radius();
    var d = {};
    d.coords = new JXG.Coords(JXG.COORDS_BY_USER, [b.board.canvasWidth / (b.board.stretchY), b.midpoint.coords.usrCoords[2]], b.board);
    var c = JXG.Math.round(b.board.algebra.trueAngle(d, b.midpoint, b.point2), 4);
    var e = JXG.Math.round(b.board.algebra.trueAngle(d, b.midpoint, b.point3), 4);
    if (b.visProp.fillColor != "none" && b.visProp.fillOpacity != 0) {
        this.psTricksString += "\\pswedge";
        this.psTricksString += "[linestyle=none, fillstyle=solid, fillcolor=" + this.parseColor(b.visProp.fillColor) + ", opacity=" + JXG.Math.round(b.visProp.fillOpacity, 5) + "]";
        this.psTricksString += "(" + b.midpoint.coords.usrCoords[1] + "," + b.midpoint.coords.usrCoords[2] + "){" + a + "}{" + c + "}{" + e + "}\n"
    }
};
JXG.PsTricks.addAngle = function (b) {
    var a = b.radius;
    var d = {};
    d.coords = new JXG.Coords(JXG.COORDS_BY_USER, [b.board.canvasWidth / (b.board.stretchY), b.point2.coords.usrCoords[2]], b.board);
    var c = JXG.Math.round(b.board.algebra.trueAngle(d, b.point2, b.point1), 4);
    var e = JXG.Math.round(b.board.algebra.trueAngle(d, b.point2, b.point3), 4);
    if (b.visProp.fillColor != "none" && b.visProp.fillOpacity != 0) {
        this.psTricksString += "\\pswedge";
        this.psTricksString += "[linestyle=none, fillstyle=solid, fillcolor=" + this.parseColor(b.visProp.fillColor) + ", opacity=" + JXG.Math.round(b.visProp.fillOpacity, 5) + "]";
        this.psTricksString += "(" + b.point2.coords.usrCoords[1] + "," + b.point2.coords.usrCoords[2] + "){" + a + "}{" + c + "}{" + e + "}\n"
    }
    this.psTricksString += "\\psarc";
    this.psTricksString += "[linecolor=" + this.parseColor(b.visProp.strokeColor) + ", linewidth=" + b.visProp.strokeWidth + "px";
    this.psTricksString += "]";
    this.psTricksString += "(" + b.point2.coords.usrCoords[1] + "," + b.point2.coords.usrCoords[2] + "){" + a + "}{" + c + "}{" + e + "}\n"
};
JXG.PsTricks.parseColor = function (b) {
    var a = JXG.rgbParser(b);
    return "{[rgb]{" + a[0] / 255 + "," + a[1] / 255 + "," + a[2] / 255 + "}}"
};
JXG.Server = function () {};
JXG.Server.modules = function () {};
JXG.Server.runningCalls = {};
JXG.Server.handleError = function (a) {
    alert("error occured, server says: " + a.message)
};
JXG.Server.callServer = function (action, callback, data, sync) {
    var fileurl, passdata, AJAX, params, id, dataJSONStr, k;
    if (typeof sync == "undefined" || sync == null) {
        sync = false
    }
    params = "";
    for (k in data) {
        params += "&" + escape(k) + "=" + escape(data[k])
    }
    dataJSONStr = JXG.toJSON(data);
    do {
        id = action + Math.floor(Math.random() * 4096)
    } while (typeof this.runningCalls[id] != "undefined");
    this.runningCalls[id] = {
        action: action
    };
    if (typeof data.module != "undefined") {
        this.runningCalls[id].module = data.module
    }
    fileurl = JXG.serverBase + "JXGServer.py";
    passdata = "action=" + escape(action) + "&id=" + id + "&dataJSON=" + escape(JXG.Util.Base64.encode(dataJSONStr));
    this.cbp = function (d) {
        var str, data, tmp, inject, paramlist, id, i, j;
        str = (new JXG.Util.Unzip(JXG.Util.Base64.decodeAsArray(d))).unzip();
        if (JXG.isArray(str) && str.length > 0) {
            str = str[0][0]
        }
        if (typeof str != "string") {
            return
        }
        data = eval("(" + str + ")");
        if (data.type == "error") {
            this.handleError(data)
        } else {
            if (data.type == "response") {
                id = data.id;
                for (i = 0; i < data.fields.length; i++) {
                    tmp = data.fields[i];
                    inject = tmp.namespace + (typeof eval(tmp.namespace) == "object" ? "." : ".prototype.") + tmp.name + " = " + tmp.value;
                    eval(inject)
                }
                for (i = 0; i < data.handler.length; i++) {
                    tmp = data.handler[i];
                    paramlist = [];
                    for (j = 0; j < tmp.parameters.length; j++) {
                        paramlist[j] = '"' + tmp.parameters[j] + '": ' + tmp.parameters[j]
                    }
                    inject = "if(typeof JXG.Server.modules." + this.runningCalls[id].module + ' == "undefined")JXG.Server.modules.' + this.runningCalls[id].module + " = {};";
                    inject += "JXG.Server.modules." + this.runningCalls[id].module + "." + tmp.name + "_cb = " + tmp.callback + ";";
                    inject += "JXG.Server.modules." + this.runningCalls[id].module + "." + tmp.name + " = function (" + tmp.parameters.join(",") + ', __JXGSERVER_CB__) {if(typeof __JXGSERVER_CB__ == "undefined") __JXGSERVER_CB__ = JXG.Server.modules.' + this.runningCalls[id].module + "." + tmp.name + "_cb;var __JXGSERVER_PAR__ = {" + paramlist.join(",") + ', "module": "' + this.runningCalls[id].module + '", "handler": "' + tmp.name + '" };JXG.Server.callServer("exec", __JXGSERVER_CB__, __JXGSERVER_PAR__);};';
                    eval(inject)
                }
                delete this.runningCalls[id];
                callback(data.data)
            }
        }
    };
    this.cb = JXG.bind(this.cbp, this);
    if (window.XMLHttpRequest) {
        AJAX = new XMLHttpRequest();
        AJAX.overrideMimeType("text/plain; charset=iso-8859-1")
    } else {
        AJAX = new ActiveXObject("Microsoft.XMLHTTP")
    }
    if (AJAX) {
        AJAX.open("POST", fileurl, !sync);
        AJAX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (!sync) {
            AJAX.onreadystatechange = (function (cb) {
                return function () {
                    switch (AJAX.readyState) {
                    case 4:
                        if (AJAX.status != 200) {
                            alert("Fehler:" + AJAX.status)
                        } else {
                            cb(AJAX.responseText)
                        }
                        break;
                    default:
                        return false;
                        break
                    }
                }
            })(this.cb)
        }
        AJAX.send(passdata);
        if (sync) {
            this.cb(AJAX.responseText)
        }
    } else {
        return false
    }
};
JXG.Server.loadModule_cb = function (b) {
    var a;
    for (a = 0; a < b.length; a++) {
        alert(b[a].name + ": " + b[a].value)
    }
};
JXG.Server.loadModule = function (a) {
    return JXG.Server.callServer("load", JXG.Server.loadModule_cb, {
        module: a
    }, true)
};
JXG.DataSource = function () {
    this.data = [];
    this.columnHeaders = [];
    this.rowHeaders = [];
    return this
};
JXG.DataSource.prototype.loadFromArray = function (e, f, d) {
    var c, b, a;
    if (typeof f == "undefined") {
        f = false
    }
    if (typeof d == "undefined") {
        d = false
    }
    if (JXG.isArray(f)) {
        this.columnHeader = f;
        f = false
    }
    if (JXG.isArray(d)) {
        this.rowHeader = d;
        d = false
    }
    this.data = [];
    if (f) {
        this.columnHeader = []
    }
    if (d) {
        this.rowHeader = []
    }
    if (typeof e != "undefined") {
        this.data = new Array(e.length);
        for (c = 0; c < e.length; c++) {
            this.data[c] = new Array(e[c].length);
            for (b = 0; b < e[c].length; b++) {
                a = e[c][b];
                if ("" + parseFloat(a) == a) {
                    this.data[c][b] = parseFloat(a)
                } else {
                    if (a != "-") {
                        this.data[c][b] = a
                    } else {
                        this.data[c][b] = NaN
                    }
                }
            }
        }
        if (f) {
            this.columnHeader = this.data[0].slice(1);
            this.data = this.data.slice(1)
        }
        if (d) {
            this.rowHeader = new Array();
            for (c = 0; c < this.data.length; c++) {
                this.rowHeader.push(this.data[c][0]);
                this.data[c] = this.data[c].slice(1)
            }
        }
    }
    return this
};
JXG.DataSource.prototype.loadFromTable = function (h, c, f) {
    var k, e, d, b, g, a;
    if (typeof c == "undefined") {
        c = false
    }
    if (typeof f == "undefined") {
        f = false
    }
    if (JXG.isArray(c)) {
        this.columnHeader = c;
        c = false
    }
    if (JXG.isArray(f)) {
        this.rowHeader = f;
        f = false
    }
    this.data = [];
    if (c) {
        this.columnHeader = []
    }
    if (f) {
        this.rowHeader = []
    }
    h = document.getElementById(h);
    if (typeof h != "undefined") {
        k = h.getElementsByTagName("tr");
        this.data = new Array(k.length);
        for (e = 0; e < k.length; e++) {
            b = k[e].getElementsByTagName("td");
            this.data[e] = new Array(b.length);
            for (d = 0; d < b.length; d++) {
                g = b[d].innerHTML;
                if ("" + parseFloat(g) == g) {
                    this.data[e][d] = parseFloat(g)
                } else {
                    if (g != "-") {
                        this.data[e][d] = g
                    } else {
                        this.data[e][d] = NaN
                    }
                }
            }
        }
        if (c) {
            this.columnHeader = this.data[0].slice(1);
            this.data = this.data.slice(1)
        }
        if (f) {
            this.rowHeader = new Array();
            for (e = 0; e < this.data.length; e++) {
                this.rowHeader.push(this.data[e][0]);
                this.data[e] = this.data[e].slice(1)
            }
        }
    }
    return this
};
JXG.DataSource.prototype.addColumn = function (a, c, b) {};
JXG.DataSource.prototype.addRow = function (a, c, b) {};
JXG.DataSource.prototype.getColumn = function (b) {
    var a = new Array(this.data.length),
        c;
    if (typeof b == "string") {
        for (c = 0; c < this.columnHeader.length; c++) {
            if (b == this.columnHeader[c]) {
                b = c;
                break
            }
        }
    }
    for (c = 0; c < this.data.length; c++) {
        if (this.data[c].length > b) {
            a[c] = this.data[c][b]
        }
    }
    return a
};
JXG.DataSource.prototype.getRow = function (c) {
    var a, b;
    if (typeof c == "string") {
        for (b = 0; b < this.rowHeader.length; b++) {
            if (c == this.rowHeader[b]) {
                c = b;
                break
            }
        }
    }
    a = new Array(this.data[c].length);
    for (b = 0; b < this.data[c].length; b++) {
        a[b] = this.data[c][b]
    }
    return a
};
JXG.SVGRenderer = function (a) {
    var b;
    this.constructor();
    this.svgRoot = null;
    this.suspendHandle = null;
    this.svgNamespace = "http://www.w3.org/2000/svg";
    this.xlinkNamespace = "http://www.w3.org/1999/xlink";
    this.container = a;
    this.container.style.MozUserSelect = "none";
    this.container.style.overflow = "hidden";
    if (this.container.style.position == "") {
        this.container.style.position = "relative"
    }
    this.svgRoot = this.container.ownerDocument.createElementNS(this.svgNamespace, "svg");
    this.svgRoot.style.overflow = "hidden";
    this.svgRoot.style.width = this.container.style.width;
    this.svgRoot.style.height = this.container.style.height;
    this.container.appendChild(this.svgRoot);
    this.defs = this.container.ownerDocument.createElementNS(this.svgNamespace, "defs");
    this.svgRoot.appendChild(this.defs);
    this.filter = this.container.ownerDocument.createElementNS(this.svgNamespace, "filter");
    this.filter.setAttributeNS(null, "id", this.container.id + "_f1");
    this.filter.setAttributeNS(null, "width", "300%");
    this.filter.setAttributeNS(null, "height", "300%");
    this.feOffset = this.container.ownerDocument.createElementNS(this.svgNamespace, "feOffset");
    this.feOffset.setAttributeNS(null, "result", "offOut");
    this.feOffset.setAttributeNS(null, "in", "SourceAlpha");
    this.feOffset.setAttributeNS(null, "dx", "5");
    this.feOffset.setAttributeNS(null, "dy", "5");
    this.filter.appendChild(this.feOffset);
    this.feGaussianBlur = this.container.ownerDocument.createElementNS(this.svgNamespace, "feGaussianBlur");
    this.feGaussianBlur.setAttributeNS(null, "result", "blurOut");
    this.feGaussianBlur.setAttributeNS(null, "in", "offOut");
    this.feGaussianBlur.setAttributeNS(null, "stdDeviation", "3");
    this.filter.appendChild(this.feGaussianBlur);
    this.feBlend = this.container.ownerDocument.createElementNS(this.svgNamespace, "feBlend");
    this.feBlend.setAttributeNS(null, "in", "SourceGraphic");
    this.feBlend.setAttributeNS(null, "in2", "blurOut");
    this.feBlend.setAttributeNS(null, "mode", "normal");
    this.filter.appendChild(this.feBlend);
    this.defs.appendChild(this.filter);
    this.layer = [];
    for (b = 0; b < JXG.Options.layer.numlayers; b++) {
        this.layer[b] = this.container.ownerDocument.createElementNS(this.svgNamespace, "g");
        this.svgRoot.appendChild(this.layer[b])
    }
    this.dashArray = ["2, 2", "5, 5", "10, 10", "20, 20", "20, 10, 10, 10", "20, 5, 10, 5"]
};
JXG.SVGRenderer.prototype = new JXG.AbstractRenderer;
JXG.SVGRenderer.prototype.setShadow = function (a) {
    if (a.visPropOld.shadow == a.visProp.shadow) {
        return
    }
    if (a.rendNode != null) {
        if (a.visProp.shadow) {
            a.rendNode.setAttributeNS(null, "filter", "url(#f1)")
        } else {
            a.rendNode.removeAttributeNS(null, "filter")
        }
    }
    a.visPropOld.shadow = a.visProp.shadow
};
JXG.SVGRenderer.prototype.setGradient = function (c) {
    var l = c.rendNode,
        d, f, e, e, k, b, a, h, g;
    if (typeof c.visProp.fillOpacity == "function") {
        f = c.visProp.fillOpacity()
    } else {
        f = c.visProp.fillOpacity
    }
    f = (f > 0) ? f : 0;
    if (typeof c.visProp.fillColor == "function") {
        d = c.visProp.fillColor()
    } else {
        d = c.visProp.fillColor
    }
    if (c.visProp.gradient == "linear") {
        e = this.createPrim("linearGradient", c.id + "_gradient");
        b = "0%";
        a = "100%";
        h = "0%";
        g = "0%";
        e.setAttributeNS(null, "x1", b);
        e.setAttributeNS(null, "x2", a);
        e.setAttributeNS(null, "y1", h);
        e.setAttributeNS(null, "y2", g);
        node2 = this.createPrim("stop", c.id + "_gradient1");
        node2.setAttributeNS(null, "offset", "0%");
        node2.setAttributeNS(null, "style", "stop-color:" + d + ";stop-opacity:" + f);
        k = this.createPrim("stop", c.id + "_gradient2");
        k.setAttributeNS(null, "offset", "100%");
        k.setAttributeNS(null, "style", "stop-color:" + c.visProp.gradientSecondColor + ";stop-opacity:" + c.visProp.gradientSecondOpacity);
        e.appendChild(node2);
        e.appendChild(k);
        this.defs.appendChild(e);
        l.setAttributeNS(null, "style", "fill:url(#" + c.id + "_gradient)");
        c.gradNode1 = node2;
        c.gradNode2 = k
    } else {
        if (c.visProp.gradient == "radial") {
            e = this.createPrim("radialGradient", c.id + "_gradient");
            e.setAttributeNS(null, "cx", "50%");
            e.setAttributeNS(null, "cy", "50%");
            e.setAttributeNS(null, "r", "50%");
            e.setAttributeNS(null, "fx", c.visProp.gradientPositionX * 100 + "%");
            e.setAttributeNS(null, "fy", c.visProp.gradientPositionY * 100 + "%");
            node2 = this.createPrim("stop", c.id + "_gradient1");
            node2.setAttributeNS(null, "offset", "0%");
            node2.setAttributeNS(null, "style", "stop-color:" + c.visProp.gradientSecondColor + ";stop-opacity:" + c.visProp.gradientSecondOpacity);
            k = this.createPrim("stop", c.id + "_gradient2");
            k.setAttributeNS(null, "offset", "100%");
            k.setAttributeNS(null, "style", "stop-color:" + d + ";stop-opacity:" + f);
            e.appendChild(node2);
            e.appendChild(k);
            this.defs.appendChild(e);
            l.setAttributeNS(null, "style", "fill:url(#" + c.id + "_gradient)");
            c.gradNode1 = node2;
            c.gradNode2 = k
        } else {
            l.removeAttributeNS(null, "style")
        }
    }
};
JXG.SVGRenderer.prototype.updateGradient = function (d) {
    var b = d.gradNode1,
        a = d.gradNode2,
        c, e;
    if (b == null || a == 0) {
        return
    }
    if (typeof d.visProp.fillOpacity == "function") {
        e = d.visProp.fillOpacity()
    } else {
        e = d.visProp.fillOpacity
    }
    e = (e > 0) ? e : 0;
    if (typeof d.visProp.fillColor == "function") {
        c = d.visProp.fillColor()
    } else {
        c = d.visProp.fillColor
    }
    if (d.visProp.gradient == "linear") {
        b.setAttributeNS(null, "style", "stop-color:" + c + ";stop-opacity:" + e);
        a.setAttributeNS(null, "style", "stop-color:" + d.visProp.gradientSecondColor + ";stop-opacity:" + d.visProp.gradientSecondOpacity)
    } else {
        if (d.visProp.gradient == "radial") {
            b.setAttributeNS(null, "style", "stop-color:" + d.visProp.gradientSecondColor + ";stop-opacity:" + d.visProp.gradientSecondOpacity);
            a.setAttributeNS(null, "style", "stop-color:" + c + ";stop-opacity:" + e)
        }
    }
};
JXG.SVGRenderer.prototype.displayCopyright = function (c, d) {
    var b = this.createPrim("text", "licenseText"),
        a;
    b.setAttributeNS(null, "x", "20");
    b.setAttributeNS(null, "y", 2 + d);
    b.setAttributeNS(null, "style", "font-family:Arial,Helvetica,sans-serif; font-size:" + d + "px; fill:#356AA0;  opacity:0.3;");
    a = document.createTextNode(c);
    b.appendChild(a);
    this.appendChildPrim(b, 0)
};
JXG.SVGRenderer.prototype.drawInternalText = function (a) {
    var b = this.createPrim("text", a.id);
    b.setAttributeNS(null, "class", "JXGtext");
    b.setAttributeNS(null, "style", "'alignment-baseline:middle;");
    a.rendNodeText = document.createTextNode("");
    b.appendChild(a.rendNodeText);
    this.appendChildPrim(b, 9);
    return b
};
JXG.SVGRenderer.prototype.updateInternalText = function (a) {
    a.rendNode.setAttributeNS(null, "x", (a.coords.scrCoords[1]) + "px");
    a.rendNode.setAttributeNS(null, "y", (a.coords.scrCoords[2]) + "px");
    a.updateText();
    if (a.htmlStr != a.plaintextStr) {
        a.rendNodeText.data = a.plaintextStr;
        a.htmlStr = a.plaintextStr
    }
};
JXG.SVGRenderer.prototype.drawTicks = function (a) {
    var b = this.createPrim("path", a.id);
    this.appendChildPrim(b, a.layer);
    this.appendNodesToElement(a, "path")
};
JXG.SVGRenderer.prototype.updateTicks = function (e, f, a, h, b) {
    var g = "",
        k, m, d, l = e.ticks.length;
    for (k = 0; k < l; k++) {
        m = e.ticks[k].scrCoords;
        if (e.ticks[k].major) {
            if (e.labels[k].visProp.visible) {
                this.drawText(e.labels[k])
            }
            g += "M " + (m[1] + f) + " " + (m[2] - a) + " L " + (m[1] - f) + " " + (m[2] + a) + " "
        } else {
            g += "M " + (m[1] + h) + " " + (m[2] - b) + " L " + (m[1] - h) + " " + (m[2] + b) + " "
        }
    }
    d = this.getElementById(e.id);
    if (d == null) {
        d = this.createPrim("path", e.id);
        this.appendChildPrim(d, e.layer);
        this.appendNodesToElement(e, "path")
    }
    d.setAttributeNS(null, "stroke", e.visProp.strokeColor);
    d.setAttributeNS(null, "stroke-opacity", e.visProp.strokeOpacity);
    d.setAttributeNS(null, "stroke-width", e.visProp.strokeWidth);
    this.updatePathPrim(d, g, e.board)
};
JXG.SVGRenderer.prototype.drawImage = function (b) {
    var a = b.url,
        c = this.createPrim("image", b.id);
    c.setAttributeNS(this.xlinkNamespace, "xlink:href", a);
    c.setAttributeNS(null, "preserveAspectRatio", "none");
    this.appendChildPrim(c, b.layer);
    b.rendNode = c;
    this.updateImage(b)
};
JXG.SVGRenderer.prototype.transformImage = function (b, a) {
    var c = b.rendNode,
        d = c.getAttributeNS(null, "transform");
    d += " " + this.joinTransforms(b, a);
    c.setAttributeNS(null, "transform", d)
};
JXG.SVGRenderer.prototype.joinTransforms = function (e, c) {
    var f = "",
        b, d, a = c.length;
    for (b = 0; b < a; b++) {
        d = c[b].matrix[1][1] + "," + c[b].matrix[2][1] + "," + c[b].matrix[1][2] + "," + c[b].matrix[2][2] + "," + c[b].matrix[1][0] + "," + c[b].matrix[2][0];
        f += "matrix(" + d + ") "
    }
    return f
};
JXG.SVGRenderer.prototype.transformImageParent = function (c, a) {
    var b, d;
    if (a != null) {
        b = a[1][1] + "," + a[2][1] + "," + a[1][2] + "," + a[2][2] + "," + a[1][0] + "," + a[2][0];
        d = "matrix(" + b + ")"
    } else {
        d = ""
    }
    c.rendNode.setAttributeNS(null, "transform", d)
};
JXG.SVGRenderer.prototype.setArrowAtts = function (a, d, b) {
    if (!a) {
        return
    }
    a.setAttributeNS(null, "stroke", d);
    a.setAttributeNS(null, "stroke-opacity", b);
    a.setAttributeNS(null, "fill", d);
    a.setAttributeNS(null, "fill-opacity", b)
};
JXG.SVGRenderer.prototype.setObjectStrokeColor = function (el, color, opacity) {
    var c = this.eval(color),
        o = this.eval(opacity),
        node;
    o = (o > 0) ? o : 0;
    if (el.visPropOld.strokeColor == c && el.visPropOld.strokeOpacity == o) {
        return
    }
    node = el.rendNode;
    if (el.type == JXG.OBJECT_TYPE_TEXT) {
        if (el.display == "html") {
            node.style.color = c
        } else {
            node.setAttributeNS(null, "style", "fill:" + c)
        }
    } else {
        node.setAttributeNS(null, "stroke", c);
        node.setAttributeNS(null, "stroke-opacity", o)
    }
    if (el.type == JXG.OBJECT_TYPE_ARROW) {
        this.setArrowAtts(el.rendNodeTriangle, c, o)
    } else {
        if (el.elementClass == JXG.OBJECT_CLASS_CURVE || el.elementClass == JXG.OBJECT_CLASS_LINE) {
            if (el.visProp.firstArrow) {
                this.setArrowAtts(el.rendNodeTriangleStart, c, o)
            }
            if (el.visProp.lastArrow) {
                this.setArrowAtts(el.rendNodeTriangleEnd, c, o)
            }
        }
    }
    el.visPropOld.strokeColor = c;
    el.visPropOld.strokeOpacity = o
};
JXG.SVGRenderer.prototype.setObjectFillColor = function (el, color, opacity) {
    var node, c = this.eval(color),
        o = this.eval(opacity);
    o = (o > 0) ? o : 0;
    if (el.visPropOld.fillColor == c && el.visPropOld.fillOpacity == o) {
        return
    }
    node = el.rendNode;
    node.setAttributeNS(null, "fill", c);
    node.setAttributeNS(null, "fill-opacity", o);
    if (el.visProp.gradient != null) {
        this.updateGradient(el)
    }
    el.visPropOld.fillColor = c;
    el.visPropOld.fillOpacity = o
};
JXG.SVGRenderer.prototype.setObjectStrokeWidth = function (el, width) {
    var w = this.eval(width),
        node;
    try {
        if (el.visPropOld.strokeWidth == w) {
            return
        }
    } catch (e) {}
    node = el.rendNode;
    this.setPropertyPrim(node, "stroked", "true");
    if (w != null) {
        this.setPropertyPrim(node, "stroke-width", w)
    }
    el.visPropOld.strokeWidth = w
};
JXG.SVGRenderer.prototype.hide = function (a) {
    var b;
    if (a == null) {
        return
    }
    b = a.rendNode;
    b.setAttributeNS(null, "display", "none");
    b.style.visibility = "hidden"
};
JXG.SVGRenderer.prototype.show = function (a) {
    var b = a.rendNode;
    b.setAttributeNS(null, "display", "inline");
    b.style.visibility = "inherit"
};
JXG.SVGRenderer.prototype.remove = function (a) {
    if (a != null && a.parentNode != null) {
        a.parentNode.removeChild(a)
    }
};
JXG.SVGRenderer.prototype.suspendRedraw = function () {
    if (true) {
        this.suspendHandle = this.svgRoot.suspendRedraw(10000)
    }
};
JXG.SVGRenderer.prototype.unsuspendRedraw = function () {
    if (true) {
        this.svgRoot.unsuspendRedraw(this.suspendHandle);
        this.svgRoot.forceRedraw()
    }
};
JXG.SVGRenderer.prototype.setDashStyle = function (b, a) {
    var d = b.visProp.dash,
        c = b.rendNode;
    if (b.visProp.dash > 0) {
        c.setAttributeNS(null, "stroke-dasharray", this.dashArray[d - 1])
    } else {
        if (c.hasAttributeNS(null, "stroke-dasharray")) {
            c.removeAttributeNS(null, "stroke-dasharray")
        }
    }
};
JXG.SVGRenderer.prototype.setGridDash = function (b) {
    var a = this.getElementById(b);
    this.setPropertyPrim(a, "stroke-dasharray", "5, 5")
};
JXG.SVGRenderer.prototype.createPrim = function (a, c) {
    var b = this.container.ownerDocument.createElementNS(this.svgNamespace, a);
    b.setAttributeNS(null, "id", this.container.id + "_" + c);
    b.style.position = "absolute";
    if (a == "path") {
        b.setAttributeNS(null, "stroke-linecap", "butt");
        b.setAttributeNS(null, "stroke-linejoin", "round")
    }
    return b
};
JXG.SVGRenderer.prototype.createArrowHead = function (c, e) {
    var d = c.id + "Triangle",
        b, a;
    if (e != null) {
        d += e
    }
    b = this.createPrim("marker", d);
    b.setAttributeNS(null, "viewBox", "0 0 10 6");
    b.setAttributeNS(null, "refY", "3");
    b.setAttributeNS(null, "markerUnits", "strokeWidth");
    b.setAttributeNS(null, "markerHeight", "6");
    b.setAttributeNS(null, "markerWidth", "6");
    b.setAttributeNS(null, "orient", "auto");
    b.setAttributeNS(null, "stroke", c.visProp.strokeColor);
    b.setAttributeNS(null, "stroke-opacity", c.visProp.strokeOpacity);
    b.setAttributeNS(null, "fill", c.visProp.strokeColor);
    b.setAttributeNS(null, "fill-opacity", c.visProp.strokeOpacity);
    a = this.container.ownerDocument.createElementNS(this.svgNamespace, "path");
    if (e == "End") {
        b.setAttributeNS(null, "refX", "0");
        a.setAttributeNS(null, "d", "M 0 3 L 10 6 L 10 0 z")
    } else {
        b.setAttributeNS(null, "refX", "10");
        a.setAttributeNS(null, "d", "M 0 0 L 10 3 L 0 6 z")
    }
    b.appendChild(a);
    return b
};
JXG.SVGRenderer.prototype.makeArrow = function (c, b, d) {
    var a = this.createArrowHead(b, d);
    this.defs.appendChild(a);
    c.setAttributeNS(null, "marker-end", "url(#" + this.container.id + "_" + b.id + "Triangle)");
    b.rendNodeTriangle = a
};
JXG.SVGRenderer.prototype.makeArrows = function (b) {
    var a;
    if (b.visPropOld.firstArrow == b.visProp.firstArrow && b.visPropOld.lastArrow == b.visProp.lastArrow) {
        return
    }
    if (b.visProp.firstArrow) {
        a = b.rendNodeTriangleStart;
        if (a == null) {
            a = this.createArrowHead(b, "End");
            this.defs.appendChild(a);
            b.rendNodeTriangleStart = a;
            b.rendNode.setAttributeNS(null, "marker-start", "url(#" + this.container.id + "_" + b.id + "TriangleEnd)")
        }
    } else {
        a = b.rendNodeTriangleStart;
        if (a != null) {
            this.remove(a)
        }
    }
    if (b.visProp.lastArrow) {
        a = b.rendNodeTriangleEnd;
        if (a == null) {
            a = this.createArrowHead(b, "Start");
            this.defs.appendChild(a);
            b.rendNodeTriangleEnd = a;
            b.rendNode.setAttributeNS(null, "marker-end", "url(#" + this.container.id + "_" + b.id + "TriangleStart)")
        }
    } else {
        a = b.rendNodeTriangleEnd;
        if (a != null) {
            this.remove(a)
        }
    }
    b.visPropOld.firstArrow = b.visProp.firstArrow;
    b.visPropOld.lastArrow = b.visProp.lastArrow
};
JXG.SVGRenderer.prototype.updateLinePrim = function (e, b, a, d, c) {
    e.setAttributeNS(null, "x1", b);
    e.setAttributeNS(null, "y1", a);
    e.setAttributeNS(null, "x2", d);
    e.setAttributeNS(null, "y2", c)
};
JXG.SVGRenderer.prototype.updateCirclePrim = function (c, a, d, b) {
    c.setAttributeNS(null, "cx", (a));
    c.setAttributeNS(null, "cy", (d));
    c.setAttributeNS(null, "r", (b))
};
JXG.SVGRenderer.prototype.updateEllipsePrim = function (b, a, e, d, c) {
    b.setAttributeNS(null, "cx", (a));
    b.setAttributeNS(null, "cy", (e));
    b.setAttributeNS(null, "rx", (d));
    b.setAttributeNS(null, "ry", (c))
};
JXG.SVGRenderer.prototype.updateRectPrim = function (d, a, e, b, c) {
    d.setAttributeNS(null, "x", (a));
    d.setAttributeNS(null, "y", (e));
    d.setAttributeNS(null, "width", (b));
    d.setAttributeNS(null, "height", (c))
};
JXG.SVGRenderer.prototype.updatePathPrim = function (b, c, a) {
    b.setAttributeNS(null, "d", c)
};
JXG.SVGRenderer.prototype.updatePathStringPrim = function (a) {
    var c = " M ",
        d = " L ",
        b = c,
        l = 5000,
        f = "",
        e, h, k = (a.curveType != "plot"),
        g;
    if (a.numberPoints <= 0) {
        return ""
    }
    if (k && a.board.options.curve.RDPsmoothing) {
        a.points = this.RamenDouglasPeuker(a.points, 0.5)
    }
    g = Math.min(a.points.length, a.numberPoints);
    for (e = 0; e < g; e++) {
        h = a.points[e].scrCoords;
        if (isNaN(h[1]) || isNaN(h[2])) {
            b = c
        } else {
            if (h[1] > l) {
                h[1] = l
            } else {
                if (h[1] < -l) {
                    h[1] = -l
                }
            }
            if (h[2] > l) {
                h[2] = l
            } else {
                if (h[2] < -l) {
                    h[2] = -l
                }
            }
            f += [b, h[1], " ", h[2]].join("");
            b = d
        }
    }
    return f
};
JXG.SVGRenderer.prototype.updatePathStringPoint = function (e, b, d) {
    var c = "",
        g = e.coords.scrCoords,
        f = b * Math.sqrt(3) * 0.5,
        a = b * 0.5;
    if (d == "x") {
        c = "M " + (g[1] - b) + " " + (g[2] - b) + " L " + (g[1] + b) + " " + (g[2] + b) + " M " + (g[1] + b) + " " + (g[2] - b) + " L " + (g[1] - b) + " " + (g[2] + b)
    } else {
        if (d == "+") {
            c = "M " + (g[1] - b) + " " + (g[2]) + " L " + (g[1] + b) + " " + (g[2]) + " M " + (g[1]) + " " + (g[2] - b) + " L " + (g[1]) + " " + (g[2] + b)
        } else {
            if (d == "diamond") {
                c = "M " + (g[1] - b) + " " + (g[2]) + " L " + (g[1]) + " " + (g[2] + b) + " L " + (g[1] + b) + " " + (g[2]) + " L " + (g[1]) + " " + (g[2] - b) + " Z "
            } else {
                if (d == "A") {
                    c = "M " + (g[1]) + " " + (g[2] - b) + " L " + (g[1] - f) + " " + (g[2] + a) + " L " + (g[1] + f) + " " + (g[2] + a) + " Z "
                } else {
                    if (d == "v") {
                        c = "M " + (g[1]) + " " + (g[2] + b) + " L " + (g[1] - f) + " " + (g[2] - a) + " L " + (g[1] + f) + " " + (g[2] - a) + " Z "
                    } else {
                        if (d == ">") {
                            c = "M " + (g[1] + b) + " " + (g[2]) + " L " + (g[1] - a) + " " + (g[2] - f) + " L " + (g[1] - a) + " " + (g[2] + f) + " Z "
                        } else {
                            if (d == "<") {
                                c = "M " + (g[1] - b) + " " + (g[2]) + " L " + (g[1] + a) + " " + (g[2] - f) + " L " + (g[1] + a) + " " + (g[2] + f) + " Z "
                            }
                        }
                    }
                }
            }
        }
    }
    return c
};
JXG.SVGRenderer.prototype.updatePolygonePrim = function (e, d) {
    var f = "",
        b, c, a = d.vertices.length;
    e.setAttributeNS(null, "stroke", "none");
    for (c = 0; c < a - 1; c++) {
        b = d.vertices[c].coords.scrCoords;
        f = f + b[1] + "," + b[2];
        if (c < a - 2) {
            f += " "
        }
    }
    e.setAttributeNS(null, "points", f)
};
JXG.SVGRenderer.prototype.appendChildPrim = function (a, b) {
    if (typeof b == "undefined") {
        b = 0
    } else {
        if (b >= JXG.Options.layer.numlayers) {
            b = JXG.Options.layer.numlayers - 1
        }
    }
    this.layer[b].appendChild(a)
};
JXG.SVGRenderer.prototype.setPropertyPrim = function (b, a, c) {
    if (a == "stroked") {
        return
    }
    b.setAttributeNS(null, a, c)
};
JXG.SVGRenderer.prototype.drawVerticalGrid = function (d, b, f, c) {
    var e = this.createPrim("path", "gridx"),
        a = "";
    while (d.scrCoords[1] < b.scrCoords[1] + f - 1) {
        a += " M " + d.scrCoords[1] + " " + 0 + " L " + d.scrCoords[1] + " " + c.canvasHeight + " ";
        d.setCoordinates(JXG.COORDS_BY_SCREEN, [d.scrCoords[1] + f, d.scrCoords[2]])
    }
    this.updatePathPrim(e, a, c);
    return e
};
JXG.SVGRenderer.prototype.drawHorizontalGrid = function (d, b, f, c) {
    var e = this.createPrim("path", "gridy"),
        a = "";
    while (d.scrCoords[2] <= b.scrCoords[2] + f - 1) {
        a += " M " + 0 + " " + d.scrCoords[2] + " L " + c.canvasWidth + " " + d.scrCoords[2] + " ";
        d.setCoordinates(JXG.COORDS_BY_SCREEN, [d.scrCoords[1], d.scrCoords[2] + f])
    }
    this.updatePathPrim(e, a, c);
    return e
};
JXG.SVGRenderer.prototype.appendNodesToElement = function (a, b) {
    a.rendNode = this.getElementById(a.id)
};
JXG.VMLRenderer = function (a) {
    this.constructor();
    this.container = a;
    this.container.style.overflow = "hidden";
    this.container.onselectstart = function () {
        return false
    };
    this.resolution = 10;
    a.ownerDocument.namespaces.add("jxgvml", "urn:schemas-microsoft-com:vml");
    this.container.ownerDocument.createStyleSheet().addRule(".jxgvml", "behavior:url(#default#VML)");
    try {
        !a.ownerDocument.namespaces.jxgvml && a.ownerDocument.namespaces.add("jxgvml", "urn:schemas-microsoft-com:vml");
        this.createNode = function (c) {
            return a.ownerDocument.createElement("<jxgvml:" + c + ' class="jxgvml">')
        }
    } catch (b) {
        this.createNode = function (c) {
            return a.ownerDocument.createElement("<" + c + ' xmlns="urn:schemas-microsoft.com:vml" class="jxgvml">')
        }
    }
    this.dashArray = ["Solid", "1 1", "ShortDash", "Dash", "LongDash", "ShortDashDot", "LongDashDot"]
};
JXG.VMLRenderer.prototype = new JXG.AbstractRenderer;
JXG.VMLRenderer.prototype.setAttr = function (c, a, f, b) {
    try {
        if (document.documentMode == 8) {
            c[a] = f
        } else {
            c.setAttribute(a, f, b)
        }
    } catch (d) {}
};
JXG.VMLRenderer.prototype.setShadow = function (a) {
    var b = a.rendNodeShadow;
    if (!b) {
        return
    }
    if (a.visPropOld.shadow == a.visProp.shadow) {
        return
    }
    if (a.visProp.shadow) {
        this.setAttr(b, "On", "True");
        this.setAttr(b, "Offset", "3pt,3pt");
        this.setAttr(b, "Opacity", "60%");
        this.setAttr(b, "Color", "#aaaaaa")
    } else {
        this.setAttr(b, "On", "False")
    }
    a.visPropOld.shadow = a.visProp.shadow
};
JXG.VMLRenderer.prototype.setGradient = function (b) {
    var a = b.rendNodeFill;
    if (b.visProp.gradient == "linear") {
        this.setAttr(a, "type", "gradient");
        this.setAttr(a, "color2", b.visProp.gradientSecondColor);
        this.setAttr(a, "opacity2", b.visProp.gradientSecondOpacity);
        this.setAttr(a, "angle", b.visProp.gradientAngle)
    } else {
        if (b.visProp.gradient == "radial") {
            this.setAttr(a, "type", "gradientradial");
            this.setAttr(a, "color2", b.visProp.gradientSecondColor);
            this.setAttr(a, "opacity2", b.visProp.gradientSecondOpacity);
            this.setAttr(a, "focusposition", b.visProp.gradientPositionX * 100 + "%," + b.visProp.gradientPositionY * 100 + "%");
            this.setAttr(a, "focussize", "0,0")
        } else {
            this.setAttr(a, "type", "solid")
        }
    }
};
JXG.VMLRenderer.prototype.updateGradient = function (a) {};
JXG.VMLRenderer.prototype.addShadowToGroup = function (a, c) {
    var b, d;
    if (a == "lines") {
        for (b in c.objects) {
            d = c.objects[b];
            if (d.elementClass == JXG.OBJECT_CLASS_LINE) {
                this.addShadowToElement(d)
            }
        }
    } else {
        if (a == "points") {
            for (b in c.objects) {
                d = c.objects[b];
                if (d.elementClass == JXG.OBJECT_CLASS_POINT) {
                    this.addShadowToElement(d)
                }
            }
        } else {
            if (a == "circles") {
                for (b in c.objects) {
                    d = c.objects[b];
                    if (d.elementClass == JXG.OBJECT_CLASS_CIRCLE) {
                        this.addShadowToElement(d)
                    }
                }
            }
        }
    }
    c.fullUpdate()
};
JXG.VMLRenderer.prototype.displayCopyright = function (c, d) {
    var b, a;
    b = this.createNode("textbox");
    b.style.position = "absolute";
    this.setAttr(b, "id", this.container.id + "_licenseText");
    b.style.left = 20;
    b.style.top = (2);
    b.style.fontSize = (d);
    b.style.color = "#356AA0";
    b.style.fontFamily = "Arial,Helvetica,sans-serif";
    this.setAttr(b, "opacity", "30%");
    b.style.filter = "alpha(opacity = 30)";
    a = document.createTextNode(c);
    b.appendChild(a);
    this.appendChildPrim(b, 0)
};
JXG.VMLRenderer.prototype.drawInternalText = function (a) {
    var b;
    b = this.createNode("textbox");
    b.style.position = "absolute";
    if (document.documentMode == 8) {
        b.setAttribute("class", "JXGtext")
    } else {
        b.setAttribute("className", 9)
    }
    a.rendNodeText = document.createTextNode("");
    b.appendChild(a.rendNodeText);
    this.appendChildPrim(b, 9);
    return b
};
JXG.VMLRenderer.prototype.updateInternalText = function (a) {
    a.rendNode.style.left = (a.coords.scrCoords[1]) + "px";
    a.rendNode.style.top = (a.coords.scrCoords[2] - this.vOffsetText) + "px";
    a.updateText();
    if (a.htmlStr != a.plaintextStr) {
        a.rendNodeText.data = a.plaintextStr;
        a.htmlStr = a.plaintextStr
    }
};
JXG.VMLRenderer.prototype.drawTicks = function (b) {
    var a = this.createPrim("path", b.id);
    this.appendChildPrim(a, b.layer);
    this.appendNodesToElement(b, "path")
};
JXG.VMLRenderer.prototype.updateTicks = function (f, g, b, h, e) {
    var d = [],
        k, l, m, n, a = this.resolution;
    l = f.ticks.length;
    for (k = 0; k < l; k++) {
        m = f.ticks[k].scrCoords;
        if (f.ticks[k].major) {
            if (f.labels[k].visProp.visible) {
                this.drawText(f.labels[k])
            }
            d.push(" m " + Math.round(a * (m[1] + g)) + ", " + Math.round(a * (m[2] - b)) + " l " + Math.round(a * (m[1] - g)) + ", " + Math.round(a * (m[2] + b)) + " ")
        } else {
            d.push(" m " + Math.round(a * (m[1] + h)) + ", " + Math.round(a * (m[2] - e)) + " l " + Math.round(a * (m[1] - h)) + ", " + Math.round(a * (m[2] + e)) + " ")
        }
    }
    n = this.getElementById(f.id);
    if (n == null) {
        n = this.createPrim("path", f.id);
        this.appendChildPrim(n, f.layer);
        this.appendNodesToElement(f, "path")
    }
    this.setAttr(n, "stroked", "true");
    this.setAttr(n, "strokecolor", f.visProp.strokeColor, 1);
    this.setAttr(n, "strokeweight", f.visProp.strokeWidth);
    this.updatePathPrim(n, d, f.board)
};
JXG.VMLRenderer.prototype.drawImage = function (b) {
    var c, a = b.url;
    c = this.container.ownerDocument.createElement("img");
    c.style.position = "absolute";
    this.setAttr(c, "id", this.container.id + "_" + b.id);
    this.setAttr(c, "src", a);
    this.container.appendChild(c);
    this.appendChildPrim(c, b.layer);
    c.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11='1.0', sizingMethod='auto expand')";
    b.rendNode = c;
    this.updateImage(b)
};
JXG.VMLRenderer.prototype.transformImage = function (c, b) {
    var d = c.rendNode,
        a;
    a = this.joinTransforms(c, b);
    d.style.left = (c.coords.scrCoords[1] + a[1][0]) + "px";
    d.style.top = (c.coords.scrCoords[2] - c.size[1] + a[2][0]) + "px";
    d.filters.item(0).M11 = a[1][1];
    d.filters.item(0).M12 = a[1][2];
    d.filters.item(0).M21 = a[2][1];
    d.filters.item(0).M22 = a[2][2]
};
JXG.VMLRenderer.prototype.joinTransforms = function (e, d) {
    var b = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ],
        c, a = d.length;
    for (c = 0; c < a; c++) {
        b = JXG.Math.matMatMult(d[c].matrix, b)
    }
    return b
};
JXG.VMLRenderer.prototype.transformImageParent = function (b, a) {};
JXG.VMLRenderer.prototype.hide = function (a) {
    a.rendNode.style.visibility = "hidden"
};
JXG.VMLRenderer.prototype.show = function (a) {
    a.rendNode.style.visibility = "inherit"
};
JXG.VMLRenderer.prototype.setDashStyle = function (b, a) {
    var c;
    if (a.dash >= 0) {
        c = b.rendNodeStroke;
        this.setAttr(c, "dashstyle", this.dashArray[a.dash])
    }
};
JXG.VMLRenderer.prototype.setObjectStrokeColor = function (el, color, opacity) {
    var c = this.eval(color),
        o = this.eval(opacity),
        node, nodeStroke;
    o = (o > 0) ? o : 0;
    if (el.visPropOld.strokeColor == c && el.visPropOld.strokeOpacity == o) {
        return
    }
    if (el.type == JXG.OBJECT_TYPE_TEXT) {
        el.rendNode.style.color = c
    } else {
        node = el.rendNode;
        this.setAttr(node, "stroked", "true");
        this.setAttr(node, "strokecolor", c);
        if (el.id == "gridx") {
            nodeStroke = this.getElementById("gridx_stroke")
        } else {
            if (el.id == "gridy") {
                nodeStroke = this.getElementById("gridy_stroke")
            } else {
                nodeStroke = el.rendNodeStroke
            }
        }
        if (o != undefined) {
            this.setAttr(nodeStroke, "opacity", (o * 100) + "%")
        }
    }
    el.visPropOld.strokeColor = c;
    el.visPropOld.strokeOpacity = o
};
JXG.VMLRenderer.prototype.setObjectFillColor = function (el, color, opacity) {
    var c = this.eval(color),
        o = this.eval(opacity);
    o = (o > 0) ? o : 0;
    if (el.visPropOld.fillColor == c && el.visPropOld.fillOpacity == o) {
        return
    }
    if (c == "none") {
        this.setAttr(el.rendNode, "filled", "false")
    } else {
        this.setAttr(el.rendNode, "filled", "true");
        this.setAttr(el.rendNode, "fillcolor", c);
        if (o != undefined && el.rendNodeFill) {
            this.setAttr(el.rendNodeFill, "opacity", (o * 100) + "%")
        }
    }
    el.visPropOld.fillColor = c;
    el.visPropOld.fillOpacity = o
};
JXG.VMLRenderer.prototype.remove = function (a) {
    if (a != null) {
        a.removeNode(true)
    }
};
JXG.VMLRenderer.prototype.suspendRedraw = function () {
    this.container.style.display = "none"
};
JXG.VMLRenderer.prototype.unsuspendRedraw = function () {
    this.container.style.display = ""
};
JXG.VMLRenderer.prototype.setAttributes = function (node, props, vmlprops, visProp) {
    var val, i, p;
    len = props.length;
    for (i = 0; i < len; i++) {
        p = props[i];
        if (visProp[p] != null) {
            val = this.eval(visProp[p]);
            val = (val > 0) ? val : 0;
            this.setAttr(node, vmlprops[i], val)
        }
    }
};
JXG.VMLRenderer.prototype.setGridDash = function (b, a) {
    var a = this.getElementById(b + "_stroke");
    this.setAttr(a, "dashstyle", "Dash")
};
JXG.VMLRenderer.prototype.setObjectStrokeWidth = function (el, width) {
    var w = this.eval(width),
        node;
    if (el.visPropOld.strokeWidth == w) {
        return
    }
    node = el.rendNode;
    this.setPropertyPrim(node, "stroked", "true");
    if (w != null) {
        this.setPropertyPrim(node, "stroke-width", w)
    }
    el.visPropOld.strokeWidth = w
};
JXG.VMLRenderer.prototype.createPrim = function (b, g) {
    var c, a = this.createNode("fill"),
        f = this.createNode("stroke"),
        e = this.createNode("shadow"),
        d;
    this.setAttr(a, "id", this.container.id + "_" + g + "_fill");
    this.setAttr(f, "id", this.container.id + "_" + g + "_stroke");
    this.setAttr(e, "id", this.container.id + "_" + g + "_shadow");
    if (b == "circle" || b == "ellipse") {
        c = this.createNode("oval");
        c.appendChild(a);
        c.appendChild(f);
        c.appendChild(e)
    } else {
        if (b == "polygon" || b == "path" || b == "shape" || b == "line") {
            c = this.createNode("shape");
            c.appendChild(a);
            c.appendChild(f);
            c.appendChild(e);
            d = this.createNode("path");
            this.setAttr(d, "id", this.container.id + "_" + g + "_path");
            c.appendChild(d)
        } else {
            c = this.createNode(b);
            c.appendChild(a);
            c.appendChild(f);
            c.appendChild(e)
        }
    }
    c.style.position = "absolute";
    this.setAttr(c, "id", this.container.id + "_" + g);
    return c
};
JXG.VMLRenderer.prototype.appendNodesToElement = function (a, b) {
    if (b == "shape" || b == "path" || b == "polygon") {
        a.rendNodePath = this.getElementById(a.id + "_path")
    }
    a.rendNodeFill = this.getElementById(a.id + "_fill");
    a.rendNodeStroke = this.getElementById(a.id + "_stroke");
    a.rendNodeShadow = this.getElementById(a.id + "_shadow");
    a.rendNode = this.getElementById(a.id)
};
JXG.VMLRenderer.prototype.makeArrow = function (c, b, d) {
    var a = b.rendNodeStroke;
    this.setAttr(a, "endarrow", "block");
    this.setAttr(a, "endarrowlength", "long")
};
JXG.VMLRenderer.prototype.makeArrows = function (b) {
    var a;
    if (b.visPropOld.firstArrow == b.visProp.firstArrow && b.visPropOld.lastArrow == b.visProp.lastArrow) {
        return
    }
    if (b.visProp.firstArrow) {
        a = b.rendNodeStroke;
        this.setAttr(a, "startarrow", "block");
        this.setAttr(a, "startarrowlength", "long")
    } else {
        a = b.rendNodeStroke;
        if (a != null) {
            this.setAttr(a, "startarrow", "none")
        }
    }
    if (b.visProp.lastArrow) {
        a = b.rendNodeStroke;
        this.setAttr(a, "id", this.container.id + "_" + b.id + "stroke");
        this.setAttr(a, "endarrow", "block");
        this.setAttr(a, "endarrowlength", "long")
    } else {
        a = b.rendNodeStroke;
        if (a != null) {
            this.setAttr(a, "endarrow", "none")
        }
    }
    b.visPropOld.firstArrow = b.visProp.firstArrow;
    b.visPropOld.lastArrow = b.visProp.lastArrow
};
JXG.VMLRenderer.prototype.updateLinePrim = function (h, b, a, d, c, f) {
    var e, g = this.resolution;
    e = ["m ", g * b, ", ", g * a, " l ", g * d, ", ", g * c];
    this.updatePathPrim(h, e, f)
};
JXG.VMLRenderer.prototype.updateCirclePrim = function (c, a, d, b) {
    c.style.left = (a - b) + "px";
    c.style.top = (d - b) + "px";
    c.style.width = (b * 2) + "px";
    c.style.height = (b * 2) + "px"
};
JXG.VMLRenderer.prototype.updateRectPrim = function (d, a, e, b, c) {
    d.style.left = (a) + "px";
    d.style.top = (e) + "px";
    d.style.width = (b) + "px";
    d.style.height = (c) + "px"
};
JXG.VMLRenderer.prototype.updateEllipsePrim = function (b, a, e, d, c) {
    b.style.left = (a - d) + "px";
    b.style.top = (e - c) + "px";
    b.style.width = (d * 2) + "px";
    b.style.height = (c * 2) + "px"
};
JXG.VMLRenderer.prototype.updatePathPrim = function (c, d, b) {
    var a = b.canvasWidth,
        e = b.canvasHeight;
    c.style.width = a;
    c.style.height = e;
    this.setAttr(c, "coordsize", [(this.resolution * a), (this.resolution * e)].join(","));
    this.setAttr(c, "path", d.join(""))
};
JXG.VMLRenderer.prototype.updatePathStringPrim = function (b) {
    var h = [],
        g, l, a = this.resolution,
        f = Math.round,
        d = " m ",
        e = " l ",
        c = d,
        m = (b.curveType != "plot"),
        k = Math.min(b.numberPoints, 8192);
    if (b.numberPoints <= 0) {
        return ""
    }
    if (m && b.board.options.curve.RDPsmoothing) {
        b.points = this.RamenDouglasPeuker(b.points, 1)
    }
    k = Math.min(k, b.points.length);
    for (g = 0; g < k; g++) {
        l = b.points[g].scrCoords;
        if (isNaN(l[1]) || isNaN(l[2])) {
            c = d
        } else {
            if (l[1] > 20000) {
                l[1] = 20000
            } else {
                if (l[1] < -20000) {
                    l[1] = -20000
                }
            }
            if (l[2] > 20000) {
                l[2] = 20000
            } else {
                if (l[2] < -20000) {
                    l[2] = -20000
                }
            }
            h.push([c, f(a * l[1]), ", ", f(a * l[2])].join(""));
            c = e
        }
    }
    h.push(" e");
    return h
};
JXG.VMLRenderer.prototype.updatePathStringPoint = function (e, b, d) {
    var c = [],
        h = e.coords.scrCoords,
        g = b * Math.sqrt(3) * 0.5,
        a = b * 0.5,
        f = this.resolution;
    if (d == "x") {
        c.push(["m ", (f * (h[1] - b)), ", ", (f * (h[2] - b)), " l ", (f * (h[1] + b)), ", ", (f * (h[2] + b)), " m ", (f * (h[1] + b)), ", ", (f * (h[2] - b)), " l ", (f * (h[1] - b)), ", ", (f * (h[2] + b))].join(""))
    } else {
        if (d == "+") {
            c.push(["m ", (f * (h[1] - b)), ", ", (f * (h[2])), " l ", (f * (h[1] + b)), ", ", (f * (h[2])), " m ", (f * (h[1])), ", ", (f * (h[2] - b)), " l ", (f * (h[1])), ", ", (f * (h[2] + b))].join(""))
        } else {
            if (d == "diamond") {
                c.push(["m ", (f * (h[1] - b)), ", ", (f * (h[2])), " l ", (f * (h[1])), ", ", (f * (h[2] + b)), " l ", (f * (h[1] + b)), ", ", (f * (h[2])), " l ", (f * (h[1])), ", ", (f * (h[2] - b)), " x e "].join(""))
            } else {
                if (d == "A") {
                    c.push(["m ", (f * (h[1])), ", ", (f * (h[2] - b)), " l ", Math.round(f * (h[1] - g)), ", ", (f * (h[2] + a)), " l ", Math.round(f * (h[1] + g)), ", ", (f * (h[2] + a)), " x e "].join(""))
                } else {
                    if (d == "v") {
                        c.push(["m ", (f * (h[1])), ", ", (f * (h[2] + b)), " l ", Math.round(f * (h[1] - g)), ", ", (f * (h[2] - a)), " l ", Math.round(f * (h[1] + g)), ", ", (f * (h[2] - a)), " x e "].join(""))
                    } else {
                        if (d == ">") {
                            c.push(["m ", (f * (h[1] + b)), ", ", (f * (h[2])), " l ", (f * (h[1] - a)), ", ", Math.round(f * (h[2] - g)), " l ", (f * (h[1] - a)), ", ", Math.round(f * (h[2] + g)), " l ", (f * (h[1] + b)), ", ", (f * (h[2]))].join(""))
                        } else {
                            if (d == "<") {
                                c.push(["m ", (f * (h[1] - b)), ", ", (f * (h[2])), " l ", (f * (h[1] + a)), ", ", Math.round(f * (h[2] - g)), " l ", (f * (h[1] + a)), ", ", Math.round(f * (h[2] + g)), " x e "].join(""))
                            }
                        }
                    }
                }
            }
        }
    }
    return c
};
JXG.VMLRenderer.prototype.updatePolygonePrim = function (e, c) {
    var f = c.vertices[0].coords.scrCoords[1],
        b = c.vertices[0].coords.scrCoords[1],
        d = c.vertices[0].coords.scrCoords[2],
        a = c.vertices[0].coords.scrCoords[2],
        g, k = c.vertices.length,
        l, n, m, h = [];
    this.setAttr(e, "stroked", "false");
    for (g = 1; g < k - 1; g++) {
        l = c.vertices[g].coords.scrCoords;
        if (l[1] < f) {
            f = l[1]
        } else {
            if (l[1] > b) {
                b = l[1]
            }
        }
        if (l[2] < d) {
            d = l[2]
        } else {
            if (l[2] > a) {
                a = l[2]
            }
        }
    }
    n = Math.round(b - f);
    m = Math.round(a - d);
    if (!isNaN(n) && !isNaN(m)) {
        e.style.width = n;
        e.style.height = m;
        this.setAttr(e, "coordsize", n + "," + m)
    }
    l = c.vertices[0].coords.scrCoords;
    h.push(["m ", l[1], ",", l[2], " l "].join(""));
    for (g = 1; g < k - 1; g++) {
        l = c.vertices[g].coords.scrCoords;
        h.push(l[1] + "," + l[2]);
        if (g < k - 2) {
            h.push(", ")
        }
    }
    h.push(" x e");
    this.setAttr(e, "path", h.join(""))
};
JXG.VMLRenderer.prototype.appendChildPrim = function (a, b) {
    if (typeof b == "undefined") {
        b = 0
    }
    a.style.zIndex = b;
    this.container.appendChild(a)
};
JXG.VMLRenderer.prototype.setPropertyPrim = function (node, key, val) {
    var keyVml = "",
        node2, v;
    switch (key) {
    case "stroke":
        keyVml = "strokecolor";
        break;
    case "stroke-width":
        keyVml = "strokeweight";
        break;
    case "stroke-dasharray":
        keyVml = "dashstyle";
        break
    }
    if (keyVml != "") {
        v = this.eval(val);
        this.setAttr(node, keyVml, v)
    }
};
JXG.VMLRenderer.prototype.drawVerticalGrid = function (d, b, f, c) {
    var e = this.createPrim("path", "gridx"),
        a = [];
    while (d.scrCoords[1] < b.scrCoords[1] + f - 1) {
        a.push(" m " + (this.resolution * d.scrCoords[1]) + ", " + 0 + " l " + (this.resolution * d.scrCoords[1]) + ", " + (this.resolution * c.canvasHeight) + " ");
        d.setCoordinates(JXG.COORDS_BY_SCREEN, [d.scrCoords[1] + f, d.scrCoords[2]])
    }
    this.updatePathPrim(e, a, c);
    return e
};
JXG.VMLRenderer.prototype.drawHorizontalGrid = function (d, b, f, c) {
    var e = this.createPrim("path", "gridy"),
        a = [];
    while (d.scrCoords[2] <= b.scrCoords[2] + f - 1) {
        a.push(" m " + 0 + ", " + (this.resolution * d.scrCoords[2]) + " l " + (this.resolution * c.canvasWidth) + ", " + (this.resolution * d.scrCoords[2]) + " ");
        d.setCoordinates(JXG.COORDS_BY_SCREEN, [d.scrCoords[1], d.scrCoords[2] + f])
    }
    this.updatePathPrim(e, a, c);
    return e
};