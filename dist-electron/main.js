import jt, { ipcMain as Q, screen as dt, BrowserWindow as gt, desktopCapturer as sd, shell as ld, app as pe, dialog as Xn, protocol as Ll, nativeImage as Ul, net as cd, Tray as ud, Menu as fd } from "electron";
import { fileURLToPath as kl, pathToFileURL as dd } from "node:url";
import z from "node:path";
import Zt from "node:fs/promises";
import St from "fs";
import hd from "constants";
import Zr from "stream";
import ko from "util";
import Ml from "assert";
import ie from "path";
import li from "child_process";
import Bl from "events";
import en from "crypto";
import jl from "tty";
import ci from "os";
import Ct from "url";
import pd from "string_decoder";
import Hl from "zlib";
import md from "http";
const tn = z.dirname(kl(import.meta.url)), gd = z.join(tn, ".."), Et = process.env.VITE_DEV_SERVER_URL, ui = z.join(gd, "dist");
let lr = null;
Q.on("hud-overlay-hide", () => {
  lr && !lr.isDestroyed() && lr.minimize();
});
function yd() {
  const e = dt.getPrimaryDisplay(), { workArea: t } = e, r = 1e3, n = 100, i = Math.floor(t.x + (t.width - r) / 2), o = Math.floor(t.y + t.height - n - 5), a = new gt({
    width: r,
    height: n,
    minWidth: 1e3,
    maxWidth: 1e3,
    minHeight: 100,
    maxHeight: 100,
    x: i,
    y: o,
    frame: !1,
    transparent: !0,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    webPreferences: {
      preload: z.join(tn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      backgroundThrottling: !1
    }
  });
  return a.setContentProtection(!0), a.webContents.on("did-finish-load", () => {
    a == null || a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), lr = a, a.on("closed", () => {
    lr === a && (lr = null);
  }), Et ? a.loadURL(Et + "?windowType=hud-overlay") : a.loadFile(z.join(ui, "index.html"), {
    query: { windowType: "hud-overlay" }
  }), a;
}
function Ed() {
  const e = process.platform === "darwin", t = new gt({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    ...e && {
      titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 12, y: 12 }
    },
    transparent: !1,
    resizable: !0,
    alwaysOnTop: !1,
    skipTaskbar: !1,
    title: "OpenScreen",
    backgroundColor: "#000000",
    webPreferences: {
      preload: z.join(tn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      backgroundThrottling: !1
    }
  });
  return t.maximize(), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), t == null || t.webContents.openDevTools();
  }), Et ? t.loadURL(Et + "?windowType=editor") : t.loadFile(z.join(ui, "index.html"), {
    query: { windowType: "editor" }
  }), t;
}
function wd() {
  const { width: e, height: t } = dt.getPrimaryDisplay().workAreaSize, r = new gt({
    width: 620,
    height: 420,
    minHeight: 350,
    maxHeight: 500,
    x: Math.round((e - 620) / 2),
    y: Math.round((t - 420) / 2),
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    transparent: !0,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: z.join(tn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return Et ? r.loadURL(Et + "?windowType=source-selector") : r.loadFile(z.join(ui, "index.html"), {
    query: { windowType: "source-selector" }
  }), r;
}
function vd() {
  const { width: e, height: t } = dt.getPrimaryDisplay().workAreaSize, r = new gt({
    width: 460,
    height: 600,
    minWidth: 400,
    minHeight: 500,
    x: Math.round((e - 460) / 2),
    y: Math.round((t - 600) / 2),
    frame: !1,
    resizable: !1,
    transparent: !0,
    backgroundColor: "#00000000",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 12 },
    webPreferences: {
      preload: z.join(tn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return Et ? r.loadURL(Et + "?windowType=electron-auth") : r.loadFile(z.join(ui, "index.html"), {
    query: { windowType: "electron-auth" }
  }), r;
}
let Sn = null, Cn = !1, Cr = [], bn = 0, $n = null;
function _d(e, t, r, n, i) {
  Q.handle("get-sources", async (a, s) => (await sd.getSources(s)).map((d) => ({
    id: d.id,
    name: d.name,
    display_id: d.display_id,
    thumbnail: d.thumbnail ? d.thumbnail.toDataURL() : null,
    appIcon: d.appIcon ? d.appIcon.toDataURL() : null
  }))), Q.handle("select-source", (a, s) => {
    Sn = s;
    const l = n();
    return l && l.close(), Sn;
  }), Q.handle("get-selected-source", () => Sn), Q.handle("open-source-selector", () => {
    const a = n();
    if (a) {
      a.focus();
      return;
    }
    t();
  }), Q.handle("switch-to-editor", () => {
    const a = r();
    a && a.close(), e();
  }), Q.handle("hide-main-window", () => {
    const a = r();
    a && !a.isDestroyed() && a.hide();
  }), Q.handle("show-main-window", () => {
    const a = r();
    a && !a.isDestroyed() && a.show();
  }), Q.handle("minimize-main-window", () => {
    const a = r();
    a && !a.isDestroyed() && a.minimize();
  }), Q.handle("restore-main-window", () => {
    const a = r();
    a && !a.isDestroyed() && (a.isMinimized() && a.restore(), a.show());
  }), Q.handle("store-recorded-video", async (a, s, l) => {
    try {
      const d = z.join(ar, l);
      return await Zt.writeFile(d, Buffer.from(s)), o = d, {
        success: !0,
        path: d,
        message: "Video stored successfully"
      };
    } catch (d) {
      return console.error("Failed to store video:", d), {
        success: !1,
        message: "Failed to store video",
        error: String(d)
      };
    }
  }), Q.handle("get-recorded-video-path", async () => {
    try {
      const s = (await Zt.readdir(ar)).filter((c) => c.endsWith(".webm"));
      if (s.length === 0)
        return { success: !1, message: "No recorded video found" };
      const l = s.sort().reverse()[0];
      return { success: !0, path: z.join(ar, l) };
    } catch (a) {
      return console.error("Failed to get video path:", a), { success: !1, message: "Failed to get video path", error: String(a) };
    }
  }), Q.handle("set-recording-state", (a, s) => {
    i && i(s, (Sn || { name: "Screen" }).name);
  }), Q.handle("open-external-url", async (a, s) => {
    try {
      return await ld.openExternal(s), { success: !0 };
    } catch (l) {
      return console.error("Failed to open URL:", l), { success: !1, error: String(l) };
    }
  }), Q.handle("get-asset-base-path", () => {
    try {
      return pe.isPackaged ? z.join(process.resourcesPath, "assets") : z.join(pe.getAppPath(), "public");
    } catch (a) {
      return console.error("Failed to resolve asset base path:", a), null;
    }
  }), Q.handle("save-exported-video", async (a, s, l) => {
    try {
      const d = r(), c = l.toLowerCase().endsWith(".gif"), f = c ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }];
      if (!d)
        throw new Error("Main window not available");
      const h = await Xn.showSaveDialog(d, {
        title: c ? "Save Exported GIF" : "Save Exported Video",
        defaultPath: z.join(pe.getPath("downloads"), l),
        filters: f,
        properties: ["createDirectory", "showOverwriteConfirmation"]
      });
      return h.canceled || !h.filePath ? {
        success: !1,
        cancelled: !0,
        message: "Export cancelled"
      } : (await Zt.writeFile(h.filePath, Buffer.from(s)), {
        success: !0,
        path: h.filePath,
        message: "Video exported successfully"
      });
    } catch (d) {
      return console.error("Failed to save exported video:", d), {
        success: !1,
        message: "Failed to save exported video",
        error: String(d)
      };
    }
  }), Q.handle("open-video-file-picker", async () => {
    try {
      const a = await Xn.showOpenDialog({
        title: "Select Video File",
        defaultPath: ar,
        filters: [
          { name: "Video Files", extensions: ["webm", "mp4", "mov", "avi", "mkv"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      return a.canceled || a.filePaths.length === 0 ? { success: !1, cancelled: !0 } : {
        success: !0,
        path: a.filePaths[0]
      };
    } catch (a) {
      return console.error("Failed to open file picker:", a), {
        success: !1,
        message: "Failed to open file picker",
        error: String(a)
      };
    }
  });
  let o = null;
  Q.handle("set-current-video-path", (a, s) => (o = s, { success: !0 })), Q.handle("get-current-video-path", () => o ? { success: !0, path: o } : { success: !1 }), Q.handle("clear-current-video-path", () => (o = null, { success: !0 })), Q.handle("get-platform", () => process.platform), Q.handle("start-cursor-tracking", () => {
    const a = dt.getPrimaryDisplay(), { width: s, height: l } = a.size;
    return Cr = [], bn = Date.now(), Cn = !0, $n = setInterval(() => {
      if (!Cn) return;
      const d = dt.getCursorScreenPoint(), c = Date.now() - bn;
      Cr.push({
        x: d.x / s,
        y: d.y / l,
        timestamp: c,
        type: "move"
      });
    }, 33), { success: !0, screenWidth: s, screenHeight: l };
  }), Q.handle("stop-cursor-tracking", () => {
    Cn = !1, $n && (clearInterval($n), $n = null);
    const a = Date.now() - bn, s = dt.getPrimaryDisplay(), { width: l, height: d } = s.size, c = {
      events: Cr,
      screenWidth: l,
      screenHeight: d,
      duration: a
    };
    return Cr = [], c;
  }), Q.handle("record-cursor-click", (a, s) => {
    if (!Cn) return { success: !1 };
    const l = dt.getPrimaryDisplay(), { width: d, height: c } = l.size, f = dt.getCursorScreenPoint(), h = Date.now() - bn;
    return Cr.push({
      x: f.x / d,
      y: f.y / c,
      timestamp: h,
      type: "click",
      button: s
    }), { success: !0 };
  }), Q.handle("save-cursor-data", async (a, s, l) => {
    try {
      const d = s.replace(/\.\w+$/, ".cursor.json");
      return await Zt.writeFile(d, l, "utf-8"), { success: !0, path: d };
    } catch (d) {
      return console.error("Failed to save cursor data:", d), { success: !1, error: String(d) };
    }
  }), Q.handle("load-cursor-data", async (a, s) => {
    try {
      const l = s.replace(/\.\w+$/, ".cursor.json");
      return { success: !0, data: await Zt.readFile(l, "utf-8") };
    } catch (l) {
      return { success: !1, error: String(l) };
    }
  });
}
var $e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ke = {}, qt = {}, Ie = {};
Ie.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ie.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var ut = hd, Td = process.cwd, Wn = null, Ad = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Wn || (Wn = Td.call(process)), Wn;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ka = process.chdir;
  process.chdir = function(e) {
    Wn = null, ka.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ka);
}
var Sd = Cd;
function Cd(e) {
  ut.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Ad === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(h, g, w) {
      var E = Date.now(), T = 0;
      c(h, g, function S(A) {
        if (A && (A.code === "EACCES" || A.code === "EPERM" || A.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(g, function(D, x) {
              D && D.code === "ENOENT" ? c(h, g, S) : w(A);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(A);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(h, g, w, E, T, S) {
      var A;
      if (S && typeof S == "function") {
        var D = 0;
        A = function(x, ee, se) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, c.call(e, h, g, w, E, T, A);
          S.apply(this, arguments);
        };
      }
      return c.call(e, h, g, w, E, T, A);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, h, g, w, E) {
      for (var T = 0; ; )
        try {
          return c.call(e, f, h, g, w, E);
        } catch (S) {
          if (S.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw S;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, h, g) {
      c.open(
        f,
        ut.O_WRONLY | ut.O_SYMLINK,
        h,
        function(w, E) {
          if (w) {
            g && g(w);
            return;
          }
          c.fchmod(E, h, function(T) {
            c.close(E, function(S) {
              g && g(T || S);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, h) {
      var g = c.openSync(f, ut.O_WRONLY | ut.O_SYMLINK, h), w = !0, E;
      try {
        E = c.fchmodSync(g, h), w = !1;
      } finally {
        if (w)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return E;
    };
  }
  function r(c) {
    ut.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, g, w) {
      c.open(f, ut.O_SYMLINK, function(E, T) {
        if (E) {
          w && w(E);
          return;
        }
        c.futimes(T, h, g, function(S) {
          c.close(T, function(A) {
            w && w(S || A);
          });
        });
      });
    }, c.lutimesSync = function(f, h, g) {
      var w = c.openSync(f, ut.O_SYMLINK), E, T = !0;
      try {
        E = c.futimesSync(w, h, g), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(w);
          } catch {
          }
        else
          c.closeSync(w);
      }
      return E;
    }) : c.futimes && (c.lutimes = function(f, h, g, w) {
      w && process.nextTick(w);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(f, h, g) {
      return c.call(e, f, h, function(w) {
        d(w) && (w = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, h) {
      try {
        return c.call(e, f, h);
      } catch (g) {
        if (!d(g)) throw g;
      }
    };
  }
  function o(c) {
    return c && function(f, h, g, w) {
      return c.call(e, f, h, g, function(E) {
        d(E) && (E = null), w && w.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, h, g) {
      try {
        return c.call(e, f, h, g);
      } catch (w) {
        if (!d(w)) throw w;
      }
    };
  }
  function s(c) {
    return c && function(f, h, g) {
      typeof h == "function" && (g = h, h = null);
      function w(E, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return h ? c.call(e, f, h, w) : c.call(e, f, w);
    };
  }
  function l(c) {
    return c && function(f, h) {
      var g = h ? c.call(e, f, h) : c.call(e, f);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function d(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Ma = Zr.Stream, bd = $d;
function $d(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Ma.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var d = a[s];
      this[d] = i[d];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Ma.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Rd = Id, Pd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Id(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Pd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ne = St, Od = Sd, Dd = bd, Nd = Rd, Rn = ko, Ee, Kn;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), Kn = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", Kn = "___graceful-fs.previous");
function Fd() {
}
function ql(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Mt = Fd;
Rn.debuglog ? Mt = Rn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Mt = function() {
  var e = Rn.format.apply(Rn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ne[Ee]) {
  var xd = $e[Ee] || [];
  ql(ne, xd), ne.close = function(e) {
    function t(r, n) {
      return e.call(ne, r, function(i) {
        i || Ba(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Kn, {
      value: e
    }), t;
  }(ne.close), ne.closeSync = function(e) {
    function t(r) {
      e.apply(ne, arguments), Ba();
    }
    return Object.defineProperty(t, Kn, {
      value: e
    }), t;
  }(ne.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Mt(ne[Ee]), Ml.equal(ne[Ee].length, 0);
  });
}
$e[Ee] || ql($e, ne[Ee]);
var Oe = Mo(Nd(ne));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ne.__patched && (Oe = Mo(ne), ne.__patched = !0);
function Mo(e) {
  Od(e), e.gracefulify = Mo, e.createReadStream = ee, e.createWriteStream = se;
  var t = e.readFile;
  e.readFile = r;
  function r(y, q, B) {
    return typeof q == "function" && (B = q, q = null), M(y, q, B);
    function M(X, P, $, O) {
      return t(X, P, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? zt([M, [X, P, $], b, O || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(y, q, B, M);
    function X(P, $, O, b, N) {
      return n(P, $, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(y, q, B, M);
    function X(P, $, O, b, N) {
      return o(P, $, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(y, q, B, M) {
    return typeof B == "function" && (M = B, B = 0), X(y, q, B, M);
    function X(P, $, O, b, N) {
      return s(P, $, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(y, q, B) {
    typeof q == "function" && (B = q, q = null);
    var M = c.test(process.version) ? function($, O, b, N) {
      return d($, X(
        $,
        O,
        b,
        N
      ));
    } : function($, O, b, N) {
      return d($, O, X(
        $,
        O,
        b,
        N
      ));
    };
    return M(y, q, B);
    function X(P, $, O, b) {
      return function(N, I) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? zt([
          M,
          [P, $, O],
          N,
          b || Date.now(),
          Date.now()
        ]) : (I && I.sort && I.sort(), typeof O == "function" && O.call(this, N, I));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Dd(e);
    S = h.ReadStream, D = h.WriteStream;
  }
  var g = e.ReadStream;
  g && (S.prototype = Object.create(g.prototype), S.prototype.open = A);
  var w = e.WriteStream;
  w && (D.prototype = Object.create(w.prototype), D.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return S;
    },
    set: function(y) {
      S = y;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return D;
    },
    set: function(y) {
      D = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = S;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return E;
    },
    set: function(y) {
      E = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(y) {
      T = y;
    },
    enumerable: !0,
    configurable: !0
  });
  function S(y, q) {
    return this instanceof S ? (g.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments);
  }
  function A() {
    var y = this;
    Le(y.path, y.flags, y.mode, function(q, B) {
      q ? (y.autoClose && y.destroy(), y.emit("error", q)) : (y.fd = B, y.emit("open", B), y.read());
    });
  }
  function D(y, q) {
    return this instanceof D ? (w.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
    var y = this;
    Le(y.path, y.flags, y.mode, function(q, B) {
      q ? (y.destroy(), y.emit("error", q)) : (y.fd = B, y.emit("open", B));
    });
  }
  function ee(y, q) {
    return new e.ReadStream(y, q);
  }
  function se(y, q) {
    return new e.WriteStream(y, q);
  }
  var V = e.open;
  e.open = Le;
  function Le(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(y, q, B, M);
    function X(P, $, O, b, N) {
      return V(P, $, O, function(I, k) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function zt(e) {
  Mt("ENQUEUE", e[0].name, e[1]), ne[Ee].push(e), Bo();
}
var Pn;
function Ba() {
  for (var e = Date.now(), t = 0; t < ne[Ee].length; ++t)
    ne[Ee][t].length > 2 && (ne[Ee][t][3] = e, ne[Ee][t][4] = e);
  Bo();
}
function Bo() {
  if (clearTimeout(Pn), Pn = void 0, ne[Ee].length !== 0) {
    var e = ne[Ee].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Mt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Mt("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), d = Math.min(l * 1.2, 100);
      s >= d ? (Mt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ne[Ee].push(e);
    }
    Pn === void 0 && (Pn = setTimeout(Bo, 0));
  }
}
(function(e) {
  const t = Ie.fromCallback, r = Oe, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? r.exists(i, o) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, o, a, s, l, d) {
    return typeof d == "function" ? r.read(i, o, a, s, l, d) : new Promise((c, f) => {
      r.read(i, o, a, s, l, (h, g, w) => {
        if (h) return f(h);
        c({ bytesRead: g, buffer: w });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, o, ...a) : new Promise((s, l) => {
      r.write(i, o, ...a, (d, c, f) => {
        if (d) return l(d);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, o, ...a) : new Promise((s, l) => {
      r.writev(i, o, ...a, (d, c, f) => {
        if (d) return l(d);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(qt);
var jo = {}, Gl = {};
const Ld = ie;
Gl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Ld.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Wl = qt, { checkPath: Vl } = Gl, Yl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
jo.makeDir = async (e, t) => (Vl(e), Wl.mkdir(e, {
  mode: Yl(t),
  recursive: !0
}));
jo.makeDirSync = (e, t) => (Vl(e), Wl.mkdirSync(e, {
  mode: Yl(t),
  recursive: !0
}));
const Ud = Ie.fromPromise, { makeDir: kd, makeDirSync: ji } = jo, Hi = Ud(kd);
var tt = {
  mkdirs: Hi,
  mkdirsSync: ji,
  // alias
  mkdirp: Hi,
  mkdirpSync: ji,
  ensureDir: Hi,
  ensureDirSync: ji
};
const Md = Ie.fromPromise, zl = qt;
function Bd(e) {
  return zl.access(e).then(() => !0).catch(() => !1);
}
var Gt = {
  pathExists: Md(Bd),
  pathExistsSync: zl.existsSync
};
const cr = Oe;
function jd(e, t, r, n) {
  cr.open(e, "r+", (i, o) => {
    if (i) return n(i);
    cr.futimes(o, t, r, (a) => {
      cr.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function Hd(e, t, r) {
  const n = cr.openSync(e, "r+");
  return cr.futimesSync(n, t, r), cr.closeSync(n);
}
var Xl = {
  utimesMillis: jd,
  utimesMillisSync: Hd
};
const fr = qt, me = ie, qd = ko;
function Gd(e, t, r) {
  const n = r.dereference ? (i) => fr.stat(i, { bigint: !0 }) : (i) => fr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Wd(e, t, r) {
  let n;
  const i = r.dereference ? (a) => fr.statSync(a, { bigint: !0 }) : (a) => fr.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: n };
}
function Vd(e, t, r, n, i) {
  qd.callbackify(Gd)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (rn(s, l)) {
        const d = me.basename(e), c = me.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && Ho(e, t) ? i(new Error(fi(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function Yd(e, t, r, n) {
  const { srcStat: i, destStat: o } = Wd(e, t, n);
  if (o) {
    if (rn(i, o)) {
      const a = me.basename(e), s = me.basename(t);
      if (r === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Ho(e, t))
    throw new Error(fi(e, t, r));
  return { srcStat: i, destStat: o };
}
function Kl(e, t, r, n, i) {
  const o = me.resolve(me.dirname(e)), a = me.resolve(me.dirname(r));
  if (a === o || a === me.parse(a).root) return i();
  fr.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : rn(t, l) ? i(new Error(fi(e, r, n))) : Kl(e, t, a, n, i));
}
function Jl(e, t, r, n) {
  const i = me.resolve(me.dirname(e)), o = me.resolve(me.dirname(r));
  if (o === i || o === me.parse(o).root) return;
  let a;
  try {
    a = fr.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (rn(t, a))
    throw new Error(fi(e, r, n));
  return Jl(e, t, o, n);
}
function rn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Ho(e, t) {
  const r = me.resolve(e).split(me.sep).filter((i) => i), n = me.resolve(t).split(me.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function fi(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var mr = {
  checkPaths: Vd,
  checkPathsSync: Yd,
  checkParentPaths: Kl,
  checkParentPathsSync: Jl,
  isSrcSubdir: Ho,
  areIdentical: rn
};
const Fe = Oe, kr = ie, zd = tt.mkdirs, Xd = Gt.pathExists, Kd = Xl.utimesMillis, Mr = mr;
function Jd(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Mr.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    Mr.checkParentPaths(e, a, t, "copy", (l) => l ? n(l) : r.filter ? Ql(ja, s, e, t, r, n) : ja(s, e, t, r, n));
  });
}
function ja(e, t, r, n, i) {
  const o = kr.dirname(r);
  Xd(o, (a, s) => {
    if (a) return i(a);
    if (s) return Jn(e, t, r, n, i);
    zd(o, (l) => l ? i(l) : Jn(e, t, r, n, i));
  });
}
function Ql(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function Qd(e, t, r, n, i) {
  return n.filter ? Ql(Jn, e, t, r, n, i) : Jn(e, t, r, n, i);
}
function Jn(e, t, r, n, i) {
  (n.dereference ? Fe.stat : Fe.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? oh(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Zd(s, e, t, r, n, i) : s.isSymbolicLink() ? lh(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Zd(e, t, r, n, i, o) {
  return t ? eh(e, r, n, i, o) : Zl(e, r, n, i, o);
}
function eh(e, t, r, n, i) {
  if (n.overwrite)
    Fe.unlink(r, (o) => o ? i(o) : Zl(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Zl(e, t, r, n, i) {
  Fe.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? th(e.mode, t, r, i) : di(r, e.mode, i));
}
function th(e, t, r, n) {
  return rh(e) ? nh(r, e, (i) => i ? n(i) : Ha(e, t, r, n)) : Ha(e, t, r, n);
}
function rh(e) {
  return (e & 128) === 0;
}
function nh(e, t, r) {
  return di(e, t | 128, r);
}
function Ha(e, t, r, n) {
  ih(t, r, (i) => i ? n(i) : di(r, e, n));
}
function di(e, t, r) {
  return Fe.chmod(e, t, r);
}
function ih(e, t, r) {
  Fe.stat(e, (n, i) => n ? r(n) : Kd(t, i.atime, i.mtime, r));
}
function oh(e, t, r, n, i, o) {
  return t ? ec(r, n, i, o) : ah(e.mode, r, n, i, o);
}
function ah(e, t, r, n, i) {
  Fe.mkdir(r, (o) => {
    if (o) return i(o);
    ec(t, r, n, (a) => a ? i(a) : di(r, e, i));
  });
}
function ec(e, t, r, n) {
  Fe.readdir(e, (i, o) => i ? n(i) : tc(o, e, t, r, n));
}
function tc(e, t, r, n, i) {
  const o = e.pop();
  return o ? sh(e, o, t, r, n, i) : i();
}
function sh(e, t, r, n, i, o) {
  const a = kr.join(r, t), s = kr.join(n, t);
  Mr.checkPaths(a, s, "copy", i, (l, d) => {
    if (l) return o(l);
    const { destStat: c } = d;
    Qd(c, a, s, i, (f) => f ? o(f) : tc(e, r, n, i, o));
  });
}
function lh(e, t, r, n, i) {
  Fe.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = kr.resolve(process.cwd(), a)), e)
      Fe.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Fe.symlink(a, r, i) : i(s) : (n.dereference && (l = kr.resolve(process.cwd(), l)), Mr.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Mr.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : ch(a, r, i)));
    else
      return Fe.symlink(a, r, i);
  });
}
function ch(e, t, r) {
  Fe.unlink(t, (n) => n ? r(n) : Fe.symlink(e, t, r));
}
var uh = Jd;
const Te = Oe, Br = ie, fh = tt.mkdirsSync, dh = Xl.utimesMillisSync, jr = mr;
function hh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = jr.checkPathsSync(e, t, "copy", r);
  return jr.checkParentPathsSync(e, n, t, "copy"), ph(i, e, t, r);
}
function ph(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Br.dirname(r);
  return Te.existsSync(i) || fh(i), rc(e, t, r, n);
}
function mh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return rc(e, t, r, n);
}
function rc(e, t, r, n) {
  const o = (n.dereference ? Te.statSync : Te.lstatSync)(t);
  if (o.isDirectory()) return Th(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return gh(o, e, t, r, n);
  if (o.isSymbolicLink()) return Ch(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function gh(e, t, r, n, i) {
  return t ? yh(e, r, n, i) : nc(e, r, n, i);
}
function yh(e, t, r, n) {
  if (n.overwrite)
    return Te.unlinkSync(r), nc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function nc(e, t, r, n) {
  return Te.copyFileSync(t, r), n.preserveTimestamps && Eh(e.mode, t, r), qo(r, e.mode);
}
function Eh(e, t, r) {
  return wh(e) && vh(r, e), _h(t, r);
}
function wh(e) {
  return (e & 128) === 0;
}
function vh(e, t) {
  return qo(e, t | 128);
}
function qo(e, t) {
  return Te.chmodSync(e, t);
}
function _h(e, t) {
  const r = Te.statSync(e);
  return dh(t, r.atime, r.mtime);
}
function Th(e, t, r, n, i) {
  return t ? ic(r, n, i) : Ah(e.mode, r, n, i);
}
function Ah(e, t, r, n) {
  return Te.mkdirSync(r), ic(t, r, n), qo(r, e);
}
function ic(e, t, r) {
  Te.readdirSync(e).forEach((n) => Sh(n, e, t, r));
}
function Sh(e, t, r, n) {
  const i = Br.join(t, e), o = Br.join(r, e), { destStat: a } = jr.checkPathsSync(i, o, "copy", n);
  return mh(a, i, o, n);
}
function Ch(e, t, r, n) {
  let i = Te.readlinkSync(t);
  if (n.dereference && (i = Br.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Te.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Te.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (o = Br.resolve(process.cwd(), o)), jr.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Te.statSync(r).isDirectory() && jr.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return bh(i, r);
  } else
    return Te.symlinkSync(i, r);
}
function bh(e, t) {
  return Te.unlinkSync(t), Te.symlinkSync(e, t);
}
var $h = hh;
const Rh = Ie.fromCallback;
var Go = {
  copy: Rh(uh),
  copySync: $h
};
const qa = Oe, oc = ie, J = Ml, Hr = process.platform === "win32";
function ac(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || qa[r], r = r + "Sync", e[r] = e[r] || qa[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Wo(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J.strictEqual(typeof r, "function", "rimraf: callback function required"), J(t, "rimraf: invalid options argument provided"), J.strictEqual(typeof t, "object", "rimraf: options should be object"), ac(t), Ga(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => Ga(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function Ga(e, t, r) {
  J(e), J(t), J(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Hr)
      return Wa(e, t, n, r);
    if (i && i.isDirectory())
      return Vn(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return Hr ? Wa(e, t, o, r) : Vn(e, t, o, r);
        if (o.code === "EISDIR")
          return Vn(e, t, o, r);
      }
      return r(o);
    });
  });
}
function Wa(e, t, r, n) {
  J(e), J(t), J(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? Vn(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Va(e, t, r) {
  let n;
  J(e), J(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? Yn(e, t, r) : t.unlinkSync(e);
}
function Vn(e, t, r, n) {
  J(e), J(t), J(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Ph(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Ph(e, t, r) {
  J(e), J(t), J(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      Wo(oc.join(e, s), t, (l) => {
        if (!a) {
          if (l) return r(a = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function sc(e, t) {
  let r;
  t = t || {}, ac(t), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J(t, "rimraf: missing options"), J.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Hr && Va(e, t, n);
  }
  try {
    r && r.isDirectory() ? Yn(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Hr ? Va(e, t, n) : Yn(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Yn(e, t, n);
  }
}
function Yn(e, t, r) {
  J(e), J(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Ih(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Ih(e, t) {
  if (J(e), J(t), t.readdirSync(e).forEach((r) => sc(oc.join(e, r), t)), Hr) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var Oh = Wo;
Wo.sync = sc;
const Qn = Oe, Dh = Ie.fromCallback, lc = Oh;
function Nh(e, t) {
  if (Qn.rm) return Qn.rm(e, { recursive: !0, force: !0 }, t);
  lc(e, t);
}
function Fh(e) {
  if (Qn.rmSync) return Qn.rmSync(e, { recursive: !0, force: !0 });
  lc.sync(e);
}
var hi = {
  remove: Dh(Nh),
  removeSync: Fh
};
const xh = Ie.fromPromise, cc = qt, uc = ie, fc = tt, dc = hi, Ya = xh(async function(t) {
  let r;
  try {
    r = await cc.readdir(t);
  } catch {
    return fc.mkdirs(t);
  }
  return Promise.all(r.map((n) => dc.remove(uc.join(t, n))));
});
function za(e) {
  let t;
  try {
    t = cc.readdirSync(e);
  } catch {
    return fc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = uc.join(e, r), dc.removeSync(r);
  });
}
var Lh = {
  emptyDirSync: za,
  emptydirSync: za,
  emptyDir: Ya,
  emptydir: Ya
};
const Uh = Ie.fromCallback, hc = ie, pt = Oe, pc = tt;
function kh(e, t) {
  function r() {
    pt.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  pt.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = hc.dirname(e);
    pt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? pc.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(a);
      s.isDirectory() ? r() : pt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Mh(e) {
  let t;
  try {
    t = pt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = hc.dirname(e);
  try {
    pt.statSync(r).isDirectory() || pt.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") pc.mkdirsSync(r);
    else throw n;
  }
  pt.writeFileSync(e, "");
}
var Bh = {
  createFile: Uh(kh),
  createFileSync: Mh
};
const jh = Ie.fromCallback, mc = ie, ht = Oe, gc = tt, Hh = Gt.pathExists, { areIdentical: yc } = mr;
function qh(e, t, r) {
  function n(i, o) {
    ht.link(i, o, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  ht.lstat(t, (i, o) => {
    ht.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (o && yc(s, o)) return r(null);
      const l = mc.dirname(t);
      Hh(l, (d, c) => {
        if (d) return r(d);
        if (c) return n(e, t);
        gc.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function Gh(e, t) {
  let r;
  try {
    r = ht.lstatSync(t);
  } catch {
  }
  try {
    const o = ht.lstatSync(e);
    if (r && yc(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = mc.dirname(t);
  return ht.existsSync(n) || gc.mkdirsSync(n), ht.linkSync(e, t);
}
var Wh = {
  createLink: jh(qh),
  createLinkSync: Gh
};
const mt = ie, Fr = Oe, Vh = Gt.pathExists;
function Yh(e, t, r) {
  if (mt.isAbsolute(e))
    return Fr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = mt.dirname(t), i = mt.join(n, e);
    return Vh(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : Fr.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: mt.relative(n, e)
    })));
  }
}
function zh(e, t) {
  let r;
  if (mt.isAbsolute(e)) {
    if (r = Fr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = mt.dirname(t), i = mt.join(n, e);
    if (r = Fr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Fr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: mt.relative(n, e)
    };
  }
}
var Xh = {
  symlinkPaths: Yh,
  symlinkPathsSync: zh
};
const Ec = Oe;
function Kh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Ec.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Jh(e, t) {
  let r;
  if (t) return t;
  try {
    r = Ec.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Qh = {
  symlinkType: Kh,
  symlinkTypeSync: Jh
};
const Zh = Ie.fromCallback, wc = ie, Ve = qt, vc = tt, ep = vc.mkdirs, tp = vc.mkdirsSync, _c = Xh, rp = _c.symlinkPaths, np = _c.symlinkPathsSync, Tc = Qh, ip = Tc.symlinkType, op = Tc.symlinkTypeSync, ap = Gt.pathExists, { areIdentical: Ac } = mr;
function sp(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ve.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ve.stat(e),
      Ve.stat(t)
    ]).then(([a, s]) => {
      if (Ac(a, s)) return n(null);
      Xa(e, t, r, n);
    }) : Xa(e, t, r, n);
  });
}
function Xa(e, t, r, n) {
  rp(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, ip(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const l = wc.dirname(t);
      ap(l, (d, c) => {
        if (d) return n(d);
        if (c) return Ve.symlink(e, t, s, n);
        ep(l, (f) => {
          if (f) return n(f);
          Ve.symlink(e, t, s, n);
        });
      });
    });
  });
}
function lp(e, t, r) {
  let n;
  try {
    n = Ve.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = Ve.statSync(e), l = Ve.statSync(t);
    if (Ac(s, l)) return;
  }
  const i = np(e, t);
  e = i.toDst, r = op(i.toCwd, r);
  const o = wc.dirname(t);
  return Ve.existsSync(o) || tp(o), Ve.symlinkSync(e, t, r);
}
var cp = {
  createSymlink: Zh(sp),
  createSymlinkSync: lp
};
const { createFile: Ka, createFileSync: Ja } = Bh, { createLink: Qa, createLinkSync: Za } = Wh, { createSymlink: es, createSymlinkSync: ts } = cp;
var up = {
  // file
  createFile: Ka,
  createFileSync: Ja,
  ensureFile: Ka,
  ensureFileSync: Ja,
  // link
  createLink: Qa,
  createLinkSync: Za,
  ensureLink: Qa,
  ensureLinkSync: Za,
  // symlink
  createSymlink: es,
  createSymlinkSync: ts,
  ensureSymlink: es,
  ensureSymlinkSync: ts
};
function fp(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function dp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Vo = { stringify: fp, stripBom: dp };
let dr;
try {
  dr = Oe;
} catch {
  dr = St;
}
const pi = Ie, { stringify: Sc, stripBom: Cc } = Vo;
async function hp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || dr, n = "throws" in t ? t.throws : !0;
  let i = await pi.fromCallback(r.readFile)(e, t);
  i = Cc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const pp = pi.fromPromise(hp);
function mp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || dr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Cc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function gp(e, t, r = {}) {
  const n = r.fs || dr, i = Sc(t, r);
  await pi.fromCallback(n.writeFile)(e, i, r);
}
const yp = pi.fromPromise(gp);
function Ep(e, t, r = {}) {
  const n = r.fs || dr, i = Sc(t, r);
  return n.writeFileSync(e, i, r);
}
var wp = {
  readFile: pp,
  readFileSync: mp,
  writeFile: yp,
  writeFileSync: Ep
};
const In = wp;
var vp = {
  // jsonfile exports
  readJson: In.readFile,
  readJsonSync: In.readFileSync,
  writeJson: In.writeFile,
  writeJsonSync: In.writeFileSync
};
const _p = Ie.fromCallback, xr = Oe, bc = ie, $c = tt, Tp = Gt.pathExists;
function Ap(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = bc.dirname(e);
  Tp(i, (o, a) => {
    if (o) return n(o);
    if (a) return xr.writeFile(e, t, r, n);
    $c.mkdirs(i, (s) => {
      if (s) return n(s);
      xr.writeFile(e, t, r, n);
    });
  });
}
function Sp(e, ...t) {
  const r = bc.dirname(e);
  if (xr.existsSync(r))
    return xr.writeFileSync(e, ...t);
  $c.mkdirsSync(r), xr.writeFileSync(e, ...t);
}
var Yo = {
  outputFile: _p(Ap),
  outputFileSync: Sp
};
const { stringify: Cp } = Vo, { outputFile: bp } = Yo;
async function $p(e, t, r = {}) {
  const n = Cp(t, r);
  await bp(e, n, r);
}
var Rp = $p;
const { stringify: Pp } = Vo, { outputFileSync: Ip } = Yo;
function Op(e, t, r) {
  const n = Pp(t, r);
  Ip(e, n, r);
}
var Dp = Op;
const Np = Ie.fromPromise, Pe = vp;
Pe.outputJson = Np(Rp);
Pe.outputJsonSync = Dp;
Pe.outputJSON = Pe.outputJson;
Pe.outputJSONSync = Pe.outputJsonSync;
Pe.writeJSON = Pe.writeJson;
Pe.writeJSONSync = Pe.writeJsonSync;
Pe.readJSON = Pe.readJson;
Pe.readJSONSync = Pe.readJsonSync;
var Fp = Pe;
const xp = Oe, To = ie, Lp = Go.copy, Rc = hi.remove, Up = tt.mkdirp, kp = Gt.pathExists, rs = mr;
function Mp(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  rs.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    rs.checkParentPaths(e, s, t, "move", (d) => {
      if (d) return n(d);
      if (Bp(t)) return ns(e, t, i, l, n);
      Up(To.dirname(t), (c) => c ? n(c) : ns(e, t, i, l, n));
    });
  });
}
function Bp(e) {
  const t = To.dirname(e);
  return To.parse(t).root === t;
}
function ns(e, t, r, n, i) {
  if (n) return qi(e, t, r, i);
  if (r)
    return Rc(t, (o) => o ? i(o) : qi(e, t, r, i));
  kp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : qi(e, t, r, i));
}
function qi(e, t, r, n) {
  xp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : jp(e, t, r, n) : n());
}
function jp(e, t, r, n) {
  Lp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : Rc(e, n));
}
var Hp = Mp;
const Pc = Oe, Ao = ie, qp = Go.copySync, Ic = hi.removeSync, Gp = tt.mkdirpSync, is = mr;
function Wp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = is.checkPathsSync(e, t, "move", r);
  return is.checkParentPathsSync(e, i, t, "move"), Vp(t) || Gp(Ao.dirname(t)), Yp(e, t, n, o);
}
function Vp(e) {
  const t = Ao.dirname(e);
  return Ao.parse(t).root === t;
}
function Yp(e, t, r, n) {
  if (n) return Gi(e, t, r);
  if (r)
    return Ic(t), Gi(e, t, r);
  if (Pc.existsSync(t)) throw new Error("dest already exists.");
  return Gi(e, t, r);
}
function Gi(e, t, r) {
  try {
    Pc.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return zp(e, t, r);
  }
}
function zp(e, t, r) {
  return qp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Ic(e);
}
var Xp = Wp;
const Kp = Ie.fromCallback;
var Jp = {
  move: Kp(Hp),
  moveSync: Xp
}, bt = {
  // Export promiseified graceful-fs:
  ...qt,
  // Export extra methods:
  ...Go,
  ...Lh,
  ...up,
  ...Fp,
  ...tt,
  ...Jp,
  ...Yo,
  ...Gt,
  ...hi
}, Wt = {}, wt = {}, fe = {}, vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.CancellationError = vt.CancellationToken = void 0;
const Qp = Bl;
class Zp extends Qp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new So());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, o) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new So());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
vt.CancellationToken = Zp;
class So extends Error {
  constructor() {
    super("cancelled");
  }
}
vt.CancellationError = So;
var gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.newError = em;
function em(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Re = {}, Co = { exports: {} }, On = { exports: {} }, Wi, os;
function tm() {
  if (os) return Wi;
  os = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Wi = function(c, f) {
    f = f || {};
    var h = typeof c;
    if (h === "string" && c.length > 0)
      return a(c);
    if (h === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var h = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= n ? Math.round(c / n) + "d" : f >= r ? Math.round(c / r) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= n ? d(c, f, n, "day") : f >= r ? d(c, f, r, "hour") : f >= t ? d(c, f, t, "minute") : f >= e ? d(c, f, e, "second") : c + " ms";
  }
  function d(c, f, h, g) {
    var w = f >= h * 1.5;
    return Math.round(c / h) + " " + g + (w ? "s" : "");
  }
  return Wi;
}
var Vi, as;
function Oc() {
  if (as) return Vi;
  as = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = s, n.enable = o, n.enabled = l, n.humanize = tm(), n.destroy = c, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let h = 0;
      for (let g = 0; g < f.length; g++)
        h = (h << 5) - h + f.charCodeAt(g), h |= 0;
      return n.colors[Math.abs(h) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let h, g = null, w, E;
      function T(...S) {
        if (!T.enabled)
          return;
        const A = T, D = Number(/* @__PURE__ */ new Date()), x = D - (h || D);
        A.diff = x, A.prev = h, A.curr = D, h = D, S[0] = n.coerce(S[0]), typeof S[0] != "string" && S.unshift("%O");
        let ee = 0;
        S[0] = S[0].replace(/%([a-zA-Z%])/g, (V, Le) => {
          if (V === "%%")
            return "%";
          ee++;
          const y = n.formatters[Le];
          if (typeof y == "function") {
            const q = S[ee];
            V = y.call(A, q), S.splice(ee, 1), ee--;
          }
          return V;
        }), n.formatArgs.call(A, S), (A.log || n.log).apply(A, S);
      }
      return T.namespace = f, T.useColors = n.useColors(), T.color = n.selectColor(f), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (w !== n.namespaces && (w = n.namespaces, E = n.enabled(f)), E),
        set: (S) => {
          g = S;
        }
      }), typeof n.init == "function" && n.init(T), T;
    }
    function i(f, h) {
      const g = n(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of h)
        g[0] === "-" ? n.skips.push(g.slice(1)) : n.names.push(g);
    }
    function a(f, h) {
      let g = 0, w = 0, E = -1, T = 0;
      for (; g < f.length; )
        if (w < h.length && (h[w] === f[g] || h[w] === "*"))
          h[w] === "*" ? (E = w, T = g, w++) : (g++, w++);
        else if (E !== -1)
          w = E + 1, T++, g = T;
        else
          return !1;
      for (; w < h.length && h[w] === "*"; )
        w++;
      return w === h.length;
    }
    function s() {
      const f = [
        ...n.names,
        ...n.skips.map((h) => "-" + h)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const h of n.skips)
        if (a(f, h))
          return !1;
      for (const h of n.names)
        if (a(f, h))
          return !0;
      return !1;
    }
    function d(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return Vi = e, Vi;
}
var ss;
function rm() {
  return ss || (ss = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const d = "color: " + this.color;
      l.splice(1, 0, d, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (c++, h === "%c" && (f = c));
      }), l.splice(f, 0, d);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Oc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(On, On.exports)), On.exports;
}
var Dn = { exports: {} }, Yi, ls;
function nm() {
  return ls || (ls = 1, Yi = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Yi;
}
var zi, cs;
function im() {
  if (cs) return zi;
  cs = 1;
  const e = ci, t = jl, r = nm(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, d) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !d && i === void 0)
      return 0;
    const c = i || 0;
    if (n.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : c;
  }
  function s(l) {
    const d = a(l, l && l.isTTY);
    return o(d);
  }
  return zi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, zi;
}
var us;
function om() {
  return us || (us = 1, function(e, t) {
    const r = jl, n = ko;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = im();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, g) => {
      const w = g.substring(6).toLowerCase().replace(/_([a-z])/g, (T, S) => S.toUpperCase());
      let E = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), h[w] = E, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: g, useColors: w } = this;
      if (w) {
        const E = this.color, T = "\x1B[3" + (E < 8 ? E : "8;5;" + E), S = `  ${T};1m${g} \x1B[0m`;
        h[0] = S + h[0].split(`
`).join(`
` + S), h.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + g + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function d() {
      return process.env.DEBUG;
    }
    function c(h) {
      h.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let w = 0; w < g.length; w++)
        h.inspectOpts[g[w]] = t.inspectOpts[g[w]];
    }
    e.exports = Oc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(Dn, Dn.exports)), Dn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Co.exports = rm() : Co.exports = om();
var am = Co.exports, nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.ProgressCallbackTransform = void 0;
const sm = Zr;
class lm extends sm.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
nn.ProgressCallbackTransform = lm;
Object.defineProperty(Re, "__esModule", { value: !0 });
Re.DigestTransform = Re.HttpExecutor = Re.HttpError = void 0;
Re.createHttpError = $o;
Re.parseJson = gm;
Re.configureRequestOptionsFromUrl = Nc;
Re.configureRequestUrl = Xo;
Re.safeGetHeader = ur;
Re.configureRequestOptions = Zn;
Re.safeStringifyJson = ei;
const cm = en, um = am, fm = St, dm = Zr, bo = Ct, hm = vt, fs = gr, pm = nn, Nt = (0, um.default)("electron-builder");
function $o(e, t = null) {
  return new zo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ei(e.headers), t);
}
const mm = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class zo extends Error {
  constructor(t, r = `HTTP error: ${mm.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Re.HttpError = zo;
function gm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class tr {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new hm.CancellationToken(), n) {
    Zn(t);
    const i = n == null ? void 0 : JSON.stringify(n), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Nt(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, r, (a) => a.end(o));
  }
  doApiRequest(t, r, n, i = 0) {
    return Nt.enabled && Nt(`Request: ${ei(t)}`), r.createPromise((o, a, s) => {
      const l = this.createRequest(t, (d) => {
        try {
          this.handleResponse(d, t, r, o, a, i, n);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (d) => {
        this.doApiRequest(d, r, n, i).then(o).catch(a);
      }), n(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, o) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, o, a, s) {
    var l;
    if (Nt.enabled && Nt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ei(r)}`), t.statusCode === 404) {
      o($o(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, f = ur(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(tr.prepareRedirectUrlOptions(f, r), n, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (g) => h += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = ur(t, "content-type"), w = g != null && (Array.isArray(g) ? g.find((E) => E.includes("json")) != null : g.includes("json"));
          o($o(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (g) {
        o(g);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, o) => {
      const a = [], s = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Xo(t, s), Zn(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (l) => {
          l == null ? n(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, d) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              d(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            d(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", r.callback);
      const a = ur(o, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(tr.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Em(r, o) : r.responseHandler(o, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (o) => {
      this.doDownload(o, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = Nc(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = tr.reconstructOriginalUrl(r), a = Dc(t, r);
      tr.isCrossOriginRedirect(o, a) && (Nt.enabled && Nt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new bo.URL(`${r}//${n}${i}${o}`);
  }
  static isCrossOriginRedirect(t, r) {
    if (t.hostname.toLowerCase() !== r.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && r.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(r.port))
      return !1;
    if (t.protocol !== r.protocol)
      return !0;
    const n = t.port, i = r.port;
    return n !== i;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof zo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Re.HttpExecutor = tr;
function Dc(e, t) {
  try {
    return new bo.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${n}//${r}${i}`;
    return new bo.URL(e, o);
  }
}
function Nc(e, t) {
  const r = Zn(t), n = Dc(e, t);
  return Xo(n, r), r;
}
function Xo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ro extends dm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, cm.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, fs.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, fs.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Re.DigestTransform = Ro;
function ym(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function ur(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Em(e, t) {
  if (!ym(ur(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = ur(t, "content-length");
    a != null && r.push(new pm.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Ro(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Ro(e.options.sha2, "sha256", "hex"));
  const i = (0, fm.createWriteStream)(e.destination);
  r.push(i);
  let o = t;
  for (const a of r)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Zn(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ei(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.MemoLazy = void 0;
class wm {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Fc(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
mi.MemoLazy = wm;
function Fc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Fc(e[a], t[a]));
  }
  return e === t;
}
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.githubUrl = vm;
on.githubTagPrefix = _m;
on.getS3LikeProviderBaseUrl = Tm;
function vm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function _m(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Tm(e) {
  const t = e.provider;
  if (t === "s3")
    return Am(e);
  if (t === "spaces")
    return Sm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Am(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return xc(t, e.path);
}
function xc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Sm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return xc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
Ko.retry = Lc;
const Cm = vt;
async function Lc(e, t) {
  var r;
  const { retries: n, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Cm.CancellationToken() } = t;
  try {
    return await e();
  } catch (d) {
    if (await Promise.resolve((r = s == null ? void 0 : s(d)) !== null && r !== void 0 ? r : !0) && n > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await Lc(e, { ...t, retries: n - 1, attempt: a + 1 });
    throw d;
  }
}
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
Jo.parseDn = bm;
function bm(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && o.set(r, n);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? n += e[a] : (a++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && s === "=") {
        r = n, n = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        r !== null && o.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += s;
  }
  return o;
}
var hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.nil = hr.UUID = void 0;
const Uc = en, kc = gr, $m = "options.name must be either a string or a Buffer", ds = (0, Uc.randomBytes)(16);
ds[0] = ds[0] | 1;
const zn = {}, W = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  zn[t] = e, W[e] = t;
}
class Ht {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Ht.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return Rm(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Pm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (zn[t[14] + t[15]] & 240) >> 4,
        variant: hs((zn[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: hs((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, kc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = zn[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
hr.UUID = Ht;
Ht.OID = Ht.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function hs(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Lr;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Lr || (Lr = {}));
function Rm(e, t, r, n, i = Lr.ASCII) {
  const o = (0, Uc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, kc.newError)($m, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Lr.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Lr.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new Ht(s);
      break;
    default:
      l = W[s[0]] + W[s[1]] + W[s[2]] + W[s[3]] + "-" + W[s[4]] + W[s[5]] + "-" + W[s[6] & 15 | r] + W[s[7]] + "-" + W[s[8] & 63 | 128] + W[s[9]] + "-" + W[s[10]] + W[s[11]] + W[s[12]] + W[s[13]] + W[s[14]] + W[s[15]];
      break;
  }
  return l;
}
function Pm(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
hr.nil = new Ht("00000000-0000-0000-0000-000000000000");
var an = {}, Mc = {};
(function(e) {
  (function(t) {
    t.parser = function(p, u) {
      return new n(p, u);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = d, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(p, u) {
      if (!(this instanceof n))
        return new n(p, u);
      var C = this;
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = u || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!p, C.noscript = !!(p || C.opt.noscript), C.state = y.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(E)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !p), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), B(C, "onready");
    }
    Object.create || (Object.create = function(p) {
      function u() {
      }
      u.prototype = p;
      var C = new u();
      return C;
    }), Object.keys || (Object.keys = function(p) {
      var u = [];
      for (var C in p) p.hasOwnProperty(C) && u.push(C);
      return u;
    });
    function i(p) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, _ = 0, Y = r.length; _ < Y; _++) {
        var te = p[r[_]].length;
        if (te > u)
          switch (r[_]) {
            case "textNode":
              X(p);
              break;
            case "cdata":
              M(p, "oncdata", p.cdata), p.cdata = "";
              break;
            case "script":
              M(p, "onscript", p.script), p.script = "";
              break;
            default:
              $(p, "Max buffer length exceeded: " + r[_]);
          }
        C = Math.max(C, te);
      }
      var oe = t.MAX_BUFFER_LENGTH - C;
      p.bufferCheckPosition = oe + p.position;
    }
    function o(p) {
      for (var u = 0, C = r.length; u < C; u++)
        p[r[u]] = "";
    }
    function a(p) {
      X(p), p.cdata !== "" && (M(p, "oncdata", p.cdata), p.cdata = ""), p.script !== "" && (M(p, "onscript", p.script), p.script = "");
    }
    n.prototype = {
      end: function() {
        O(this);
      },
      write: Je,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(p) {
      return p !== "error" && p !== "end";
    });
    function d(p, u) {
      return new c(p, u);
    }
    function c(p, u) {
      if (!(this instanceof c))
        return new c(p, u);
      s.apply(this), this._parser = new n(p, u), this.writable = !0, this.readable = !0;
      var C = this;
      this._parser.onend = function() {
        C.emit("end");
      }, this._parser.onerror = function(_) {
        C.emit("error", _), C._parser.error = null;
      }, this._decoder = null, l.forEach(function(_) {
        Object.defineProperty(C, "on" + _, {
          get: function() {
            return C._parser["on" + _];
          },
          set: function(Y) {
            if (!Y)
              return C.removeAllListeners(_), C._parser["on" + _] = Y, Y;
            C.on(_, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(p) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(p)) {
        if (!this._decoder) {
          var u = pd.StringDecoder;
          this._decoder = new u("utf8");
        }
        p = this._decoder.write(p);
      }
      return this._parser.write(p.toString()), this.emit("data", p), !0;
    }, c.prototype.end = function(p) {
      return p && p.length && this.write(p), this._parser.end(), !0;
    }, c.prototype.on = function(p, u) {
      var C = this;
      return !C._parser["on" + p] && l.indexOf(p) !== -1 && (C._parser["on" + p] = function() {
        var _ = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        _.splice(0, 0, p), C.emit.apply(C, _);
      }), s.prototype.on.call(C, p, u);
    };
    var f = "[CDATA[", h = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", E = { xml: g, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, A = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function ee(p) {
      return p === '"' || p === "'";
    }
    function se(p) {
      return p === ">" || x(p);
    }
    function V(p, u) {
      return p.test(u);
    }
    function Le(p, u) {
      return !V(p, u);
    }
    var y = 0;
    t.STATE = {
      BEGIN: y++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: y++,
      // leading whitespace
      TEXT: y++,
      // general stuff
      TEXT_ENTITY: y++,
      // &amp and such.
      OPEN_WAKA: y++,
      // <
      SGML_DECL: y++,
      // <!BLARG
      SGML_DECL_QUOTED: y++,
      // <!BLARG foo "bar
      DOCTYPE: y++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: y++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: y++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: y++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: y++,
      // <!-
      COMMENT: y++,
      // <!--
      COMMENT_ENDING: y++,
      // <!-- blah -
      COMMENT_ENDED: y++,
      // <!-- blah --
      CDATA: y++,
      // <![CDATA[ something
      CDATA_ENDING: y++,
      // ]
      CDATA_ENDING_2: y++,
      // ]]
      PROC_INST: y++,
      // <?hi
      PROC_INST_BODY: y++,
      // <?hi there
      PROC_INST_ENDING: y++,
      // <?hi "there" ?
      OPEN_TAG: y++,
      // <strong
      OPEN_TAG_SLASH: y++,
      // <strong /
      ATTRIB: y++,
      // <a
      ATTRIB_NAME: y++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: y++,
      // <a foo _
      ATTRIB_VALUE: y++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: y++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: y++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: y++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: y++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: y++,
      // <foo bar=&quot
      CLOSE_TAG: y++,
      // </a
      CLOSE_TAG_SAW_WHITE: y++,
      // </a   >
      SCRIPT: y++,
      // <script> ...
      SCRIPT_ENDING: y++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(p) {
      var u = t.ENTITIES[p], C = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[p] = C;
    });
    for (var q in t.STATE)
      t.STATE[t.STATE[q]] = q;
    y = t.STATE;
    function B(p, u, C) {
      p[u] && p[u](C);
    }
    function M(p, u, C) {
      p.textNode && X(p), B(p, u, C);
    }
    function X(p) {
      p.textNode = P(p.opt, p.textNode), p.textNode && B(p, "ontext", p.textNode), p.textNode = "";
    }
    function P(p, u) {
      return p.trim && (u = u.trim()), p.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function $(p, u) {
      return X(p), p.trackPosition && (u += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), u = new Error(u), p.error = u, B(p, "onerror", u), p;
    }
    function O(p) {
      return p.sawRoot && !p.closedRoot && b(p, "Unclosed root tag"), p.state !== y.BEGIN && p.state !== y.BEGIN_WHITESPACE && p.state !== y.TEXT && $(p, "Unexpected end"), X(p), p.c = "", p.closed = !0, B(p, "onend"), n.call(p, p.strict, p.opt), p;
    }
    function b(p, u) {
      if (typeof p != "object" || !(p instanceof n))
        throw new Error("bad call to strictFail");
      p.strict && $(p, u);
    }
    function N(p) {
      p.strict || (p.tagName = p.tagName[p.looseCase]());
      var u = p.tags[p.tags.length - 1] || p, C = p.tag = { name: p.tagName, attributes: {} };
      p.opt.xmlns && (C.ns = u.ns), p.attribList.length = 0, M(p, "onopentagstart", C);
    }
    function I(p, u) {
      var C = p.indexOf(":"), _ = C < 0 ? ["", p] : p.split(":"), Y = _[0], te = _[1];
      return u && p === "xmlns" && (Y = "xmlns", te = ""), { prefix: Y, local: te };
    }
    function k(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var u = I(p.attribName, !0), C = u.prefix, _ = u.local;
        if (C === "xmlns")
          if (_ === "xml" && p.attribValue !== g)
            b(
              p,
              "xml: prefix must be bound to " + g + `
Actual: ` + p.attribValue
            );
          else if (_ === "xmlns" && p.attribValue !== w)
            b(
              p,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + p.attribValue
            );
          else {
            var Y = p.tag, te = p.tags[p.tags.length - 1] || p;
            Y.ns === te.ns && (Y.ns = Object.create(te.ns)), Y.ns[_] = p.attribValue;
          }
        p.attribList.push([p.attribName, p.attribValue]);
      } else
        p.tag.attributes[p.attribName] = p.attribValue, M(p, "onattribute", {
          name: p.attribName,
          value: p.attribValue
        });
      p.attribName = p.attribValue = "";
    }
    function G(p, u) {
      if (p.opt.xmlns) {
        var C = p.tag, _ = I(p.tagName);
        C.prefix = _.prefix, C.local = _.local, C.uri = C.ns[_.prefix] || "", C.prefix && !C.uri && (b(p, "Unbound namespace prefix: " + JSON.stringify(p.tagName)), C.uri = _.prefix);
        var Y = p.tags[p.tags.length - 1] || p;
        C.ns && Y.ns !== C.ns && Object.keys(C.ns).forEach(function(mn) {
          M(p, "onopennamespace", {
            prefix: mn,
            uri: C.ns[mn]
          });
        });
        for (var te = 0, oe = p.attribList.length; te < oe; te++) {
          var ge = p.attribList[te], ve = ge[0], at = ge[1], ue = I(ve, !0), je = ue.prefix, Ni = ue.local, pn = je === "" ? "" : C.ns[je] || "", vr = {
            name: ve,
            value: at,
            prefix: je,
            local: Ni,
            uri: pn
          };
          je && je !== "xmlns" && !pn && (b(p, "Unbound namespace prefix: " + JSON.stringify(je)), vr.uri = je), p.tag.attributes[ve] = vr, M(p, "onattribute", vr);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!u, p.sawRoot = !0, p.tags.push(p.tag), M(p, "onopentag", p.tag), u || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = y.SCRIPT : p.state = y.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function j(p) {
      if (!p.tagName) {
        b(p, "Weird empty close tag."), p.textNode += "</>", p.state = y.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = y.SCRIPT;
          return;
        }
        M(p, "onscript", p.script), p.script = "";
      }
      var u = p.tags.length, C = p.tagName;
      p.strict || (C = C[p.looseCase]());
      for (var _ = C; u--; ) {
        var Y = p.tags[u];
        if (Y.name !== _)
          b(p, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        b(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = y.TEXT;
        return;
      }
      p.tagName = C;
      for (var te = p.tags.length; te-- > u; ) {
        var oe = p.tag = p.tags.pop();
        p.tagName = p.tag.name, M(p, "onclosetag", p.tagName);
        var ge = {};
        for (var ve in oe.ns)
          ge[ve] = oe.ns[ve];
        var at = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && oe.ns !== at.ns && Object.keys(oe.ns).forEach(function(ue) {
          var je = oe.ns[ue];
          M(p, "onclosenamespace", { prefix: ue, uri: je });
        });
      }
      u === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = y.TEXT;
    }
    function K(p) {
      var u = p.entity, C = u.toLowerCase(), _, Y = "";
      return p.ENTITIES[u] ? p.ENTITIES[u] : p.ENTITIES[C] ? p.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), Y = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), Y = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || Y.toLowerCase() !== u ? (b(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(_));
    }
    function de(p, u) {
      u === "<" ? (p.state = y.OPEN_WAKA, p.startTagPosition = p.position) : x(u) || (b(p, "Non-whitespace before first tag."), p.textNode = u, p.state = y.TEXT);
    }
    function U(p, u) {
      var C = "";
      return u < p.length && (C = p.charAt(u)), C;
    }
    function Je(p) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return $(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (p === null)
        return O(u);
      typeof p == "object" && (p = p.toString());
      for (var C = 0, _ = ""; _ = U(p, C++), u.c = _, !!_; )
        switch (u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case y.BEGIN:
            if (u.state = y.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            de(u, _);
            continue;
          case y.BEGIN_WHITESPACE:
            de(u, _);
            continue;
          case y.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var Y = C - 1; _ && _ !== "<" && _ !== "&"; )
                _ = U(p, C++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += p.substring(Y, C - 1);
            }
            _ === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : (!x(_) && (!u.sawRoot || u.closedRoot) && b(u, "Text data outside of root node."), _ === "&" ? u.state = y.TEXT_ENTITY : u.textNode += _);
            continue;
          case y.SCRIPT:
            _ === "<" ? u.state = y.SCRIPT_ENDING : u.script += _;
            continue;
          case y.SCRIPT_ENDING:
            _ === "/" ? u.state = y.CLOSE_TAG : (u.script += "<" + _, u.state = y.SCRIPT);
            continue;
          case y.OPEN_WAKA:
            if (_ === "!")
              u.state = y.SGML_DECL, u.sgmlDecl = "";
            else if (!x(_)) if (V(T, _))
              u.state = y.OPEN_TAG, u.tagName = _;
            else if (_ === "/")
              u.state = y.CLOSE_TAG, u.tagName = "";
            else if (_ === "?")
              u.state = y.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (b(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var te = u.position - u.startTagPosition;
                _ = new Array(te).join(" ") + _;
              }
              u.textNode += "<" + _, u.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (u.sgmlDecl + _ === "--") {
              u.state = y.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = y.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + _, u.sgmlDecl = "") : (u.sgmlDecl + _).toUpperCase() === f ? (M(u, "onopencdata"), u.state = y.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + _).toUpperCase() === h ? (u.state = y.DOCTYPE, (u.doctype || u.sawRoot) && b(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : _ === ">" ? (M(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = y.TEXT) : (ee(_) && (u.state = y.SGML_DECL_QUOTED), u.sgmlDecl += _);
            continue;
          case y.SGML_DECL_QUOTED:
            _ === u.q && (u.state = y.SGML_DECL, u.q = ""), u.sgmlDecl += _;
            continue;
          case y.DOCTYPE:
            _ === ">" ? (u.state = y.TEXT, M(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += _, _ === "[" ? u.state = y.DOCTYPE_DTD : ee(_) && (u.state = y.DOCTYPE_QUOTED, u.q = _));
            continue;
          case y.DOCTYPE_QUOTED:
            u.doctype += _, _ === u.q && (u.q = "", u.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            _ === "]" ? (u.doctype += _, u.state = y.DOCTYPE) : _ === "<" ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : ee(_) ? (u.doctype += _, u.state = y.DOCTYPE_DTD_QUOTED, u.q = _) : u.doctype += _;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            u.doctype += _, _ === u.q && (u.state = y.DOCTYPE_DTD, u.q = "");
            continue;
          case y.COMMENT:
            _ === "-" ? u.state = y.COMMENT_ENDING : u.comment += _;
            continue;
          case y.COMMENT_ENDING:
            _ === "-" ? (u.state = y.COMMENT_ENDED, u.comment = P(u.opt, u.comment), u.comment && M(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + _, u.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            _ !== ">" ? (b(u, "Malformed comment"), u.comment += "--" + _, u.state = y.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = y.DOCTYPE_DTD : u.state = y.TEXT;
            continue;
          case y.CDATA:
            _ === "]" ? u.state = y.CDATA_ENDING : u.cdata += _;
            continue;
          case y.CDATA_ENDING:
            _ === "]" ? u.state = y.CDATA_ENDING_2 : (u.cdata += "]" + _, u.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            _ === ">" ? (u.cdata && M(u, "oncdata", u.cdata), M(u, "onclosecdata"), u.cdata = "", u.state = y.TEXT) : _ === "]" ? u.cdata += "]" : (u.cdata += "]]" + _, u.state = y.CDATA);
            continue;
          case y.PROC_INST:
            _ === "?" ? u.state = y.PROC_INST_ENDING : x(_) ? u.state = y.PROC_INST_BODY : u.procInstName += _;
            continue;
          case y.PROC_INST_BODY:
            if (!u.procInstBody && x(_))
              continue;
            _ === "?" ? u.state = y.PROC_INST_ENDING : u.procInstBody += _;
            continue;
          case y.PROC_INST_ENDING:
            _ === ">" ? (M(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = y.TEXT) : (u.procInstBody += "?" + _, u.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            V(S, _) ? u.tagName += _ : (N(u), _ === ">" ? G(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : (x(_) || b(u, "Invalid character in tag name"), u.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            _ === ">" ? (G(u, !0), j(u)) : (b(u, "Forward-slash in opening tag not followed by >"), u.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if (x(_))
              continue;
            _ === ">" ? G(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : V(T, _) ? (u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            _ === "=" ? u.state = y.ATTRIB_VALUE : _ === ">" ? (b(u, "Attribute without value"), u.attribValue = u.attribName, k(u), G(u)) : x(_) ? u.state = y.ATTRIB_NAME_SAW_WHITE : V(S, _) ? u.attribName += _ : b(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              u.state = y.ATTRIB_VALUE;
            else {
              if (x(_))
                continue;
              b(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", M(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", _ === ">" ? G(u) : V(T, _) ? (u.attribName = _, u.state = y.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (x(_))
              continue;
            ee(_) ? (u.q = _, u.state = y.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || $(u, "Unquoted attribute value"), u.state = y.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            k(u), u.q = "", u.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            x(_) ? u.state = y.ATTRIB : _ === ">" ? G(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : V(T, _) ? (b(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!se(_)) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            k(u), _ === ">" ? G(u) : u.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? j(u) : V(S, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = y.SCRIPT) : (x(_) || b(u, "Invalid tagname in closing tag"), u.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(_))
                continue;
              Le(T, _) ? u.script ? (u.script += "</" + _, u.state = y.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if (x(_))
              continue;
            _ === ">" ? j(u) : b(u, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var oe, ge;
            switch (u.state) {
              case y.TEXT_ENTITY:
                oe = y.TEXT, ge = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                oe = y.ATTRIB_VALUE_QUOTED, ge = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                oe = y.ATTRIB_VALUE_UNQUOTED, ge = "attribValue";
                break;
            }
            if (_ === ";") {
              var ve = K(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (u.entity = "", u.state = oe, u.write(ve)) : (u[ge] += ve, u.entity = "", u.state = oe);
            } else V(u.entity.length ? D : A, _) ? u.entity += _ : (b(u, "Invalid character in entity name"), u[ge] += "&" + u.entity + _, u.entity = "", u.state = oe);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, u = Math.floor, C = function() {
        var _ = 16384, Y = [], te, oe, ge = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var at = ""; ++ge < ve; ) {
          var ue = Number(arguments[ge]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          u(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? Y.push(ue) : (ue -= 65536, te = (ue >> 10) + 55296, oe = ue % 1024 + 56320, Y.push(te, oe)), (ge + 1 === ve || Y.length > _) && (at += p.apply(null, Y), Y.length = 0);
        }
        return at;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(Mc);
Object.defineProperty(an, "__esModule", { value: !0 });
an.XElement = void 0;
an.parseXml = Nm;
const Im = Mc, Nn = gr;
class Bc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Nn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Dm(t))
      throw (0, Nn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Nn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Nn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (ps(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => ps(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
an.XElement = Bc;
const Om = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Dm(e) {
  return Om.test(e);
}
function ps(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Nm(e) {
  let t = null;
  const r = Im.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new Bc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    n.push(o);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const o = n[n.length - 1];
    o.value = i, o.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = vt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = gr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Re;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = mi;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = nn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = on;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var s = Ko;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Jo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var d = hr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return d.UUID;
  } });
  var c = an;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(fe);
var we = {}, Qo = {}, Ye = {};
function jc(e) {
  return typeof e > "u" || e === null;
}
function Fm(e) {
  return typeof e == "object" && e !== null;
}
function xm(e) {
  return Array.isArray(e) ? e : jc(e) ? [] : [e];
}
function Lm(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function Um(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function km(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ye.isNothing = jc;
Ye.isObject = Fm;
Ye.toArray = xm;
Ye.repeat = Um;
Ye.isNegativeZero = km;
Ye.extend = Lm;
function Hc(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function qr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Hc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
qr.prototype = Object.create(Error.prototype);
qr.prototype.constructor = qr;
qr.prototype.toString = function(t) {
  return this.name + ": " + Hc(this, t);
};
var sn = qr, Ir = Ye;
function Xi(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function Ki(e, t) {
  return Ir.repeat(" ", t - e.length) + e;
}
function Mm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    d = Xi(
      e.buffer,
      n[a - l],
      i[a - l],
      e.position - (n[a] - n[a - l]),
      f
    ), s = Ir.repeat(" ", t.indent) + Ki((e.line - l + 1).toString(), c) + " | " + d.str + `
` + s;
  for (d = Xi(e.buffer, n[a], i[a], e.position, f), s += Ir.repeat(" ", t.indent) + Ki((e.line + 1).toString(), c) + " | " + d.str + `
`, s += Ir.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    d = Xi(
      e.buffer,
      n[a + l],
      i[a + l],
      e.position - (n[a] - n[a + l]),
      f
    ), s += Ir.repeat(" ", t.indent) + Ki((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return s.replace(/\n$/, "");
}
var Bm = Mm, ms = sn, jm = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Hm = [
  "scalar",
  "sequence",
  "mapping"
];
function qm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Gm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (jm.indexOf(r) === -1)
      throw new ms('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = qm(t.styleAliases || null), Hm.indexOf(this.kind) === -1)
    throw new ms('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var De = Gm, br = sn, Ji = De;
function gs(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function Wm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function Po(e) {
  return this.extend(e);
}
Po.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof Ji)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new br("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof Ji))
      throw new br("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new br("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new br("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof Ji))
      throw new br("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Po.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = gs(i, "implicit"), i.compiledExplicit = gs(i, "explicit"), i.compiledTypeMap = Wm(i.compiledImplicit, i.compiledExplicit), i;
};
var qc = Po, Vm = De, Gc = new Vm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Ym = De, Wc = new Ym("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), zm = De, Vc = new zm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Xm = qc, Yc = new Xm({
  explicit: [
    Gc,
    Wc,
    Vc
  ]
}), Km = De;
function Jm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Qm() {
  return null;
}
function Zm(e) {
  return e === null;
}
var zc = new Km("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Jm,
  construct: Qm,
  predicate: Zm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), eg = De;
function tg(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function rg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function ng(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Xc = new eg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: tg,
  construct: rg,
  predicate: ng,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), ig = Ye, og = De;
function ag(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function sg(e) {
  return 48 <= e && e <= 55;
}
function lg(e) {
  return 48 <= e && e <= 57;
}
function cg(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ag(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!sg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!lg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function ug(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function fg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !ig.isNegativeZero(e);
}
var Kc = new og("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: cg,
  construct: ug,
  predicate: fg,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Jc = Ye, dg = De, hg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function pg(e) {
  return !(e === null || !hg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function mg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var gg = /^[-+]?[0-9]+e/;
function yg(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Jc.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), gg.test(r) ? r.replace("e", ".e") : r;
}
function Eg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Jc.isNegativeZero(e));
}
var Qc = new dg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: pg,
  construct: mg,
  predicate: Eg,
  represent: yg,
  defaultStyle: "lowercase"
}), Zc = Yc.extend({
  implicit: [
    zc,
    Xc,
    Kc,
    Qc
  ]
}), eu = Zc, wg = De, tu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), ru = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function vg(e) {
  return e === null ? !1 : tu.exec(e) !== null || ru.exec(e) !== null;
}
function _g(e) {
  var t, r, n, i, o, a, s, l = 0, d = null, c, f, h;
  if (t = tu.exec(e), t === null && (t = ru.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), d = (c * 60 + f) * 6e4, t[9] === "-" && (d = -d)), h = new Date(Date.UTC(r, n, i, o, a, s, l)), d && h.setTime(h.getTime() - d), h;
}
function Tg(e) {
  return e.toISOString();
}
var nu = new wg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: vg,
  construct: _g,
  instanceOf: Date,
  represent: Tg
}), Ag = De;
function Sg(e) {
  return e === "<<" || e === null;
}
var iu = new Ag("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Sg
}), Cg = De, Zo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function bg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = Zo;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function $g(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = Zo, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Rg(e) {
  var t = "", r = 0, n, i, o = e.length, a = Zo;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function Pg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var ou = new Cg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: bg,
  construct: $g,
  predicate: Pg,
  represent: Rg
}), Ig = De, Og = Object.prototype.hasOwnProperty, Dg = Object.prototype.toString;
function Ng(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, Dg.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Og.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Fg(e) {
  return e !== null ? e : [];
}
var au = new Ig("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Ng,
  construct: Fg
}), xg = De, Lg = Object.prototype.toString;
function Ug(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], Lg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function kg(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var su = new xg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ug,
  construct: kg
}), Mg = De, Bg = Object.prototype.hasOwnProperty;
function jg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Bg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Hg(e) {
  return e !== null ? e : {};
}
var lu = new Mg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: jg,
  construct: Hg
}), ea = eu.extend({
  implicit: [
    nu,
    iu
  ],
  explicit: [
    ou,
    au,
    su,
    lu
  ]
}), Lt = Ye, cu = sn, qg = Bm, Gg = ea, _t = Object.prototype.hasOwnProperty, ti = 1, uu = 2, fu = 3, ri = 4, Qi = 1, Wg = 2, ys = 3, Vg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Yg = /[\x85\u2028\u2029]/, zg = /[,\[\]\{\}]/, du = /^(?:!|!!|![a-z\-]+!)$/i, hu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Es(e) {
  return Object.prototype.toString.call(e);
}
function et(e) {
  return e === 10 || e === 13;
}
function Bt(e) {
  return e === 9 || e === 32;
}
function xe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function rr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Xg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Kg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Jg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function ws(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Qg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function pu(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var mu = new Array(256), gu = new Array(256);
for (var Xt = 0; Xt < 256; Xt++)
  mu[Xt] = ws(Xt) ? 1 : 0, gu[Xt] = ws(Xt);
function Zg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Gg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function yu(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = qg(r), new cu(t, r);
}
function L(e, t) {
  throw yu(e, t);
}
function ni(e, t) {
  e.onWarning && e.onWarning.call(null, yu(e, t));
}
var vs = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && ni(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], du.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), _t.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), hu.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      L(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function yt(e, t, r, n) {
  var i, o, a, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || L(e, "expected valid JSON character");
    else Vg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function _s(e, t, r, n) {
  var i, o, a, s;
  for (Lt.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], _t.call(t, o) || (pu(t, o, r[o]), n[o] = !0);
}
function nr(e, t, r, n, i, o, a, s, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Es(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Es(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (d = 0, c = o.length; d < c; d += 1)
        _s(e, t, o[d], r);
    else
      _s(e, t, o, r);
  else
    !e.json && !_t.call(r, i) && _t.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), pu(t, i, o), delete r[i];
  return t;
}
function ta(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function le(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Bt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (et(i))
      for (ta(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && ni(e, "deficient indentation"), n;
}
function gi(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || xe(r)));
}
function ra(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Lt.repeat(`
`, t - 1));
}
function e0(e, t, r) {
  var n, i, o, a, s, l, d, c, f = e.kind, h = e.result, g;
  if (g = e.input.charCodeAt(e.position), xe(g) || rr(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), xe(i) || r && rr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), xe(i) || r && rr(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), xe(n))
        break;
    } else {
      if (e.position === e.lineStart && gi(e) || r && rr(g))
        break;
      if (et(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, le(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    s && (yt(e, o, a, !1), ra(e, e.line - l), o = a = e.position, s = !1), Bt(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return yt(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function t0(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (yt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else et(r) ? (yt(e, n, i, !0), ra(e, le(e, !1, t)), n = i = e.position) : e.position === e.lineStart && gi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function r0(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return yt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (yt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), et(s))
        le(e, !1, t);
      else if (s < 256 && mu[s])
        e.result += gu[s], e.position++;
      else if ((a = Kg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Xg(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += Qg(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else et(s) ? (yt(e, r, n, !0), ra(e, le(e, !1, t)), r = n = e.position) : e.position === e.lineStart && gi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function n0(e, t) {
  var r = !0, n, i, o, a = e.tag, s, l = e.anchor, d, c, f, h, g, w = /* @__PURE__ */ Object.create(null), E, T, S, A;
  if (A = e.input.charCodeAt(e.position), A === 91)
    c = 93, g = !1, s = [];
  else if (A === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), A = e.input.charCodeAt(++e.position); A !== 0; ) {
    if (le(e, !0, t), A = e.input.charCodeAt(e.position), A === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    r ? A === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), T = E = S = null, f = h = !1, A === 63 && (d = e.input.charCodeAt(e.position + 1), xe(d) && (f = h = !0, e.position++, le(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, pr(e, t, ti, !1, !0), T = e.tag, E = e.result, le(e, !0, t), A = e.input.charCodeAt(e.position), (h || e.line === n) && A === 58 && (f = !0, A = e.input.charCodeAt(++e.position), le(e, !0, t), pr(e, t, ti, !1, !0), S = e.result), g ? nr(e, s, w, T, E, S, n, i, o) : f ? s.push(nr(e, null, w, T, E, S, n, i, o)) : s.push(E), le(e, !0, t), A = e.input.charCodeAt(e.position), A === 44 ? (r = !0, A = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function i0(e, t) {
  var r, n, i = Qi, o = !1, a = !1, s = t, l = 0, d = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Qi === i ? i = f === 43 ? ys : Wg : L(e, "repeat of a chomping mode identifier");
    else if ((c = Jg(f)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? L(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Bt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Bt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!et(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ta(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), et(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === ys ? e.result += Lt.repeat(`
`, o ? 1 + l : l) : i === Qi && o && (e.result += `
`);
      break;
    }
    for (n ? Bt(f) ? (d = !0, e.result += Lt.repeat(`
`, o ? 1 + l : l)) : d ? (d = !1, e.result += Lt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Lt.repeat(`
`, l) : e.result += Lt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, r = e.position; !et(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    yt(e, r, e.position, !1);
  }
  return !0;
}
function Ts(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !xe(a)))); ) {
    if (s = !0, e.position++, le(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, pr(e, t, fu, !1, !0), o.push(e.result), le(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function o0(e, t, r) {
  var n, i, o, a, s, l, d = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), g = null, w = null, E = null, T = !1, S = !1, A;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), A = e.input.charCodeAt(e.position); A !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (A === 63 || A === 58) && xe(n))
      A === 63 ? (T && (nr(e, f, h, g, w, null, a, s, l), g = w = E = null), S = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, A = n;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !pr(e, r, uu, !1, !0))
        break;
      if (e.line === o) {
        for (A = e.input.charCodeAt(e.position); Bt(A); )
          A = e.input.charCodeAt(++e.position);
        if (A === 58)
          A = e.input.charCodeAt(++e.position), xe(A) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (nr(e, f, h, g, w, null, a, s, l), g = w = E = null), S = !0, T = !1, i = !1, g = e.tag, w = e.result;
        else if (S)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (S)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (T && (a = e.line, s = e.lineStart, l = e.position), pr(e, t, ri, !0, i) && (T ? w = e.result : E = e.result), T || (nr(e, f, h, g, w, E, a, s, l), g = w = E = null), le(e, !0, -1), A = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && A !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && nr(e, f, h, g, w, null, a, s, l), S && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = f), S;
}
function a0(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !xe(a); )
      a === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), du.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), zg.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !hu.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : _t.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function s0(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !xe(r) && !rr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function l0(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !xe(n) && !rr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), _t.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], le(e, !0, -1), !0;
}
function pr(e, t, r, n, i) {
  var o, a, s, l = 1, d = !1, c = !1, f, h, g, w, E, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = ri === r || fu === r, n && le(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; a0(e) || s0(e); )
      le(e, !0, -1) ? (d = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = d || i), (l === 1 || ri === r) && (ti === r || uu === r ? E = t : E = t + 1, T = e.position - e.lineStart, l === 1 ? s && (Ts(e, T) || o0(e, T, E)) || n0(e, E) ? c = !0 : (a && i0(e, E) || t0(e, E) || r0(e, E) ? c = !0 : l0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : e0(e, E, ti === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Ts(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (w = e.implicitTypes[f], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (_t.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, g = e.typeMap.multi[e.kind || "fallback"], f = 0, h = g.length; f < h; f += 1)
        if (e.tag.slice(0, g[f].tag.length) === g[f].tag) {
          w = g[f];
          break;
        }
    w || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function c0(e) {
  var t = e.position, r, n, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (le(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !xe(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && L(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Bt(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !et(a));
        break;
      }
      if (et(a)) break;
      for (r = e.position; a !== 0 && !xe(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && ta(e), _t.call(vs, n) ? vs[n](e, n, i) : ni(e, 'unknown document directive "' + n + '"');
  }
  if (le(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, le(e, !0, -1)) : o && L(e, "directives end mark is expected"), pr(e, e.lineIndent - 1, ri, !1, !0), le(e, !0, -1), e.checkLineBreaks && Yg.test(e.input.slice(t, e.position)) && ni(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && gi(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, le(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Eu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new Zg(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    c0(r);
  return r.documents;
}
function u0(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = Eu(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function f0(e, t) {
  var r = Eu(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new cu("expected a single document in the stream, but found more");
  }
}
Qo.loadAll = u0;
Qo.load = f0;
var wu = {}, yi = Ye, ln = sn, d0 = ea, vu = Object.prototype.toString, _u = Object.prototype.hasOwnProperty, na = 65279, h0 = 9, Gr = 10, p0 = 13, m0 = 32, g0 = 33, y0 = 34, Io = 35, E0 = 37, w0 = 38, v0 = 39, _0 = 42, Tu = 44, T0 = 45, ii = 58, A0 = 61, S0 = 62, C0 = 63, b0 = 64, Au = 91, Su = 93, $0 = 96, Cu = 123, R0 = 124, bu = 125, Ae = {};
Ae[0] = "\\0";
Ae[7] = "\\a";
Ae[8] = "\\b";
Ae[9] = "\\t";
Ae[10] = "\\n";
Ae[11] = "\\v";
Ae[12] = "\\f";
Ae[13] = "\\r";
Ae[27] = "\\e";
Ae[34] = '\\"';
Ae[92] = "\\\\";
Ae[133] = "\\N";
Ae[160] = "\\_";
Ae[8232] = "\\L";
Ae[8233] = "\\P";
var P0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], I0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function O0(e, t) {
  var r, n, i, o, a, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && _u.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[a] = s;
  return r;
}
function D0(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new ln("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + yi.repeat("0", n - t.length) + t;
}
var N0 = 1, Wr = 2;
function F0(e) {
  this.schema = e.schema || d0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = yi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = O0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Wr : N0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function As(e, t) {
  for (var r = yi.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function Oo(e, t) {
  return `
` + yi.repeat(" ", e.indent * t);
}
function x0(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function oi(e) {
  return e === m0 || e === h0;
}
function Vr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== na || 65536 <= e && e <= 1114111;
}
function Ss(e) {
  return Vr(e) && e !== na && e !== p0 && e !== Gr;
}
function Cs(e, t, r) {
  var n = Ss(e), i = n && !oi(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Tu && e !== Au && e !== Su && e !== Cu && e !== bu) && e !== Io && !(t === ii && !i) || Ss(t) && !oi(t) && e === Io || t === ii && i
  );
}
function L0(e) {
  return Vr(e) && e !== na && !oi(e) && e !== T0 && e !== C0 && e !== ii && e !== Tu && e !== Au && e !== Su && e !== Cu && e !== bu && e !== Io && e !== w0 && e !== _0 && e !== g0 && e !== R0 && e !== A0 && e !== S0 && e !== v0 && e !== y0 && e !== E0 && e !== b0 && e !== $0;
}
function U0(e) {
  return !oi(e) && e !== ii;
}
function Or(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function $u(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Ru = 1, Do = 2, Pu = 3, Iu = 4, er = 5;
function k0(e, t, r, n, i, o, a, s) {
  var l, d = 0, c = null, f = !1, h = !1, g = n !== -1, w = -1, E = L0(Or(e, 0)) && U0(Or(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Or(e, l), !Vr(d))
        return er;
      E = E && Cs(d, c, s), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Or(e, l), d === Gr)
        f = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!Vr(d))
        return er;
      E = E && Cs(d, c, s), c = d;
    }
    h = h || g && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !f && !h ? E && !a && !i(e) ? Ru : o === Wr ? er : Do : r > 9 && $u(e) ? er : a ? o === Wr ? er : Do : h ? Iu : Pu;
}
function M0(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Wr ? '""' : "''";
    if (!e.noCompatMode && (P0.indexOf(t) !== -1 || I0.test(t)))
      return e.quotingType === Wr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return x0(e, d);
    }
    switch (k0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Ru:
        return t;
      case Do:
        return "'" + t.replace(/'/g, "''") + "'";
      case Pu:
        return "|" + bs(t, e.indent) + $s(As(t, o));
      case Iu:
        return ">" + bs(t, e.indent) + $s(As(B0(t, a), o));
      case er:
        return '"' + j0(t) + '"';
      default:
        throw new ln("impossible error: invalid scalar style");
    }
  }();
}
function bs(e, t) {
  var r = $u(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function $s(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function B0(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, Rs(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", n += s + (!i && !o && l !== "" ? `
` : "") + Rs(l, t), i = o;
  }
  return n;
}
function Rs(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function j0(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Or(e, i), n = Ae[r], !n && Vr(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || D0(r);
  return t;
}
function H0(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (ot(e, t, s, !1, !1) || typeof s > "u" && ot(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Ps(e, t, r, n) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = r.length; a < s; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (ot(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && ot(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Oo(e, t)), e.dump && Gr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function q0(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, l, d, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), ot(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ot(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function G0(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, l, d, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new ln("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!n || i !== "") && (h += Oo(e, t)), d = a[s], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), ot(e, t + 1, d, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Gr === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Oo(e, t)), ot(e, t + 1, c, !0, f) && (e.dump && Gr === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Is(e, t, r) {
  var n, i, o, a, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, vu.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (_u.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new ln("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function ot(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, Is(e, r, !1) || Is(e, r, !0);
  var s = vu.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(r), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (G0(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (q0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Ps(e, t - 1, e.dump, i) : Ps(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (H0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && M0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new ln("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (d = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump);
  }
  return !0;
}
function W0(e, t) {
  var r = [], n = [], i, o;
  for (No(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function No(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        No(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        No(e[n[i]], t, r);
}
function V0(e, t) {
  t = t || {};
  var r = new F0(t);
  r.noRefs || W0(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), ot(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
wu.dump = V0;
var Ou = Qo, Y0 = wu;
function ia(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
we.Type = De;
we.Schema = qc;
we.FAILSAFE_SCHEMA = Yc;
we.JSON_SCHEMA = Zc;
we.CORE_SCHEMA = eu;
we.DEFAULT_SCHEMA = ea;
we.load = Ou.load;
we.loadAll = Ou.loadAll;
we.dump = Y0.dump;
we.YAMLException = sn;
we.types = {
  binary: ou,
  float: Qc,
  map: Vc,
  null: zc,
  pairs: su,
  set: lu,
  timestamp: nu,
  bool: Xc,
  int: Kc,
  merge: iu,
  omap: au,
  seq: Wc,
  str: Gc
};
we.safeLoad = ia("safeLoad", "load");
we.safeLoadAll = ia("safeLoadAll", "loadAll");
we.safeDump = ia("safeDump", "dump");
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.Lazy = void 0;
class z0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
Ei.Lazy = z0;
var Fo = { exports: {} };
const X0 = "2.0.0", Du = 256, K0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, J0 = 16, Q0 = Du - 6, Z0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var wi = {
  MAX_LENGTH: Du,
  MAX_SAFE_COMPONENT_LENGTH: J0,
  MAX_SAFE_BUILD_LENGTH: Q0,
  MAX_SAFE_INTEGER: K0,
  RELEASE_TYPES: Z0,
  SEMVER_SPEC_VERSION: X0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ey = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var vi = ey;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = wi, o = vi;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [h, n]
  ], w = (T) => {
    for (const [S, A] of g)
      T = T.split(`${S}*`).join(`${S}{0,${A}}`).split(`${S}+`).join(`${S}{1,${A}}`);
    return T;
  }, E = (T, S, A) => {
    const D = w(S), x = f++;
    o(T, x, S), c[T] = x, l[x] = S, d[x] = D, a[x] = new RegExp(S, A ? "g" : void 0), s[x] = new RegExp(D, A ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), E("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${h}+`), E("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), E("FULL", `^${l[c.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), E("LOOSE", `^${l[c.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), E("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), E("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", l[c.COERCE], !0), E("COERCERTLFULL", l[c.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Fo, Fo.exports);
var cn = Fo.exports;
const ty = Object.freeze({ loose: !0 }), ry = Object.freeze({}), ny = (e) => e ? typeof e != "object" ? ty : e : ry;
var oa = ny;
const Os = /^[0-9]+$/, Nu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Os.test(e), n = Os.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, iy = (e, t) => Nu(t, e);
var Fu = {
  compareIdentifiers: Nu,
  rcompareIdentifiers: iy
};
const Fn = vi, { MAX_LENGTH: Ds, MAX_SAFE_INTEGER: xn } = wi, { safeRe: Ln, t: Un } = cn, oy = oa, { compareIdentifiers: Zi } = Fu;
let ay = class Ze {
  constructor(t, r) {
    if (r = oy(r), t instanceof Ze) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ds)
      throw new TypeError(
        `version is longer than ${Ds} characters`
      );
    Fn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ln[Un.LOOSE] : Ln[Un.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > xn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > xn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > xn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < xn)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Fn("SemVer.compare", this.version, this.options, t), !(t instanceof Ze)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ze(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ze || (t = new Ze(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof Ze || (t = new Ze(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Fn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Zi(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ze || (t = new Ze(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Fn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Zi(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Ln[Un.PRERELEASELOOSE] : Ln[Un.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let o = [r, i];
          n === !1 && (o = [r]), Zi(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ne = ay;
const Ns = Ne, sy = (e, t, r = !1) => {
  if (e instanceof Ns)
    return e;
  try {
    return new Ns(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var yr = sy;
const ly = yr, cy = (e, t) => {
  const r = ly(e, t);
  return r ? r.version : null;
};
var uy = cy;
const fy = yr, dy = (e, t) => {
  const r = fy(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var hy = dy;
const Fs = Ne, py = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Fs(
      e instanceof Fs ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var my = py;
const xs = yr, gy = (e, t) => {
  const r = xs(e, null, !0), n = xs(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? r : n, s = o ? n : r, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var yy = gy;
const Ey = Ne, wy = (e, t) => new Ey(e, t).major;
var vy = wy;
const _y = Ne, Ty = (e, t) => new _y(e, t).minor;
var Ay = Ty;
const Sy = Ne, Cy = (e, t) => new Sy(e, t).patch;
var by = Cy;
const $y = yr, Ry = (e, t) => {
  const r = $y(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Py = Ry;
const Ls = Ne, Iy = (e, t, r) => new Ls(e, r).compare(new Ls(t, r));
var ze = Iy;
const Oy = ze, Dy = (e, t, r) => Oy(t, e, r);
var Ny = Dy;
const Fy = ze, xy = (e, t) => Fy(e, t, !0);
var Ly = xy;
const Us = Ne, Uy = (e, t, r) => {
  const n = new Us(e, r), i = new Us(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var aa = Uy;
const ky = aa, My = (e, t) => e.sort((r, n) => ky(r, n, t));
var By = My;
const jy = aa, Hy = (e, t) => e.sort((r, n) => jy(n, r, t));
var qy = Hy;
const Gy = ze, Wy = (e, t, r) => Gy(e, t, r) > 0;
var _i = Wy;
const Vy = ze, Yy = (e, t, r) => Vy(e, t, r) < 0;
var sa = Yy;
const zy = ze, Xy = (e, t, r) => zy(e, t, r) === 0;
var xu = Xy;
const Ky = ze, Jy = (e, t, r) => Ky(e, t, r) !== 0;
var Lu = Jy;
const Qy = ze, Zy = (e, t, r) => Qy(e, t, r) >= 0;
var la = Zy;
const eE = ze, tE = (e, t, r) => eE(e, t, r) <= 0;
var ca = tE;
const rE = xu, nE = Lu, iE = _i, oE = la, aE = sa, sE = ca, lE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return rE(e, r, n);
    case "!=":
      return nE(e, r, n);
    case ">":
      return iE(e, r, n);
    case ">=":
      return oE(e, r, n);
    case "<":
      return aE(e, r, n);
    case "<=":
      return sE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Uu = lE;
const cE = Ne, uE = yr, { safeRe: kn, t: Mn } = cn, fE = (e, t) => {
  if (e instanceof cE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? kn[Mn.COERCEFULL] : kn[Mn.COERCE]);
  else {
    const l = t.includePrerelease ? kn[Mn.COERCERTLFULL] : kn[Mn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return uE(`${n}.${i}.${o}${a}${s}`, t);
};
var dE = fE;
class hE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var pE = hE, eo, ks;
function Xe() {
  if (ks) return eo;
  ks = 1;
  const e = /\s+/g;
  class t {
    constructor($, O) {
      if (O = i(O), $ instanceof t)
        return $.loose === !!O.loose && $.includePrerelease === !!O.includePrerelease ? $ : new t($.raw, O);
      if ($ instanceof o)
        return this.raw = $.value, this.set = [[$]], this.formatted = void 0, this;
      if (this.options = O, this.loose = !!O.loose, this.includePrerelease = !!O.includePrerelease, this.raw = $.trim().replace(e, " "), this.set = this.raw.split("||").map((b) => this.parseRange(b.trim())).filter((b) => b.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const b = this.set[0];
        if (this.set = this.set.filter((N) => !E(N[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const N of this.set)
            if (N.length === 1 && T(N[0])) {
              this.set = [N];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let $ = 0; $ < this.set.length; $++) {
          $ > 0 && (this.formatted += "||");
          const O = this.set[$];
          for (let b = 0; b < O.length; b++)
            b > 0 && (this.formatted += " "), this.formatted += O[b].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange($) {
      const b = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + $, N = n.get(b);
      if (N)
        return N;
      const I = this.options.loose, k = I ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      $ = $.replace(k, M(this.options.includePrerelease)), a("hyphen replace", $), $ = $.replace(l[d.COMPARATORTRIM], c), a("comparator trim", $), $ = $.replace(l[d.TILDETRIM], f), a("tilde trim", $), $ = $.replace(l[d.CARETTRIM], h), a("caret trim", $);
      let G = $.split(" ").map((U) => A(U, this.options)).join(" ").split(/\s+/).map((U) => B(U, this.options));
      I && (G = G.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[d.COMPARATORLOOSE])))), a("range list", G);
      const j = /* @__PURE__ */ new Map(), K = G.map((U) => new o(U, this.options));
      for (const U of K) {
        if (E(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const de = [...j.values()];
      return n.set(b, de), de;
    }
    intersects($, O) {
      if (!($ instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => S(b, O) && $.set.some((N) => S(N, O) && b.every((I) => N.every((k) => I.intersects(k, O)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test($) {
      if (!$)
        return !1;
      if (typeof $ == "string")
        try {
          $ = new s($, this.options);
        } catch {
          return !1;
        }
      for (let O = 0; O < this.set.length; O++)
        if (X(this.set[O], $, this.options))
          return !0;
      return !1;
    }
  }
  eo = t;
  const r = pE, n = new r(), i = oa, o = Ti(), a = vi, s = Ne, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = cn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = wi, E = (P) => P.value === "<0.0.0-0", T = (P) => P.value === "", S = (P, $) => {
    let O = !0;
    const b = P.slice();
    let N = b.pop();
    for (; O && b.length; )
      O = b.every((I) => N.intersects(I, $)), N = b.pop();
    return O;
  }, A = (P, $) => (P = P.replace(l[d.BUILD], ""), a("comp", P, $), P = se(P, $), a("caret", P), P = x(P, $), a("tildes", P), P = Le(P, $), a("xrange", P), P = q(P, $), a("stars", P), P), D = (P) => !P || P.toLowerCase() === "x" || P === "*", x = (P, $) => P.trim().split(/\s+/).map((O) => ee(O, $)).join(" "), ee = (P, $) => {
    const O = $.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return P.replace(O, (b, N, I, k, G) => {
      a("tilde", P, b, N, I, k, G);
      let j;
      return D(N) ? j = "" : D(I) ? j = `>=${N}.0.0 <${+N + 1}.0.0-0` : D(k) ? j = `>=${N}.${I}.0 <${N}.${+I + 1}.0-0` : G ? (a("replaceTilde pr", G), j = `>=${N}.${I}.${k}-${G} <${N}.${+I + 1}.0-0`) : j = `>=${N}.${I}.${k} <${N}.${+I + 1}.0-0`, a("tilde return", j), j;
    });
  }, se = (P, $) => P.trim().split(/\s+/).map((O) => V(O, $)).join(" "), V = (P, $) => {
    a("caret", P, $);
    const O = $.loose ? l[d.CARETLOOSE] : l[d.CARET], b = $.includePrerelease ? "-0" : "";
    return P.replace(O, (N, I, k, G, j) => {
      a("caret", P, N, I, k, G, j);
      let K;
      return D(I) ? K = "" : D(k) ? K = `>=${I}.0.0${b} <${+I + 1}.0.0-0` : D(G) ? I === "0" ? K = `>=${I}.${k}.0${b} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.0${b} <${+I + 1}.0.0-0` : j ? (a("replaceCaret pr", j), I === "0" ? k === "0" ? K = `>=${I}.${k}.${G}-${j} <${I}.${k}.${+G + 1}-0` : K = `>=${I}.${k}.${G}-${j} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.${G}-${j} <${+I + 1}.0.0-0`) : (a("no pr"), I === "0" ? k === "0" ? K = `>=${I}.${k}.${G}${b} <${I}.${k}.${+G + 1}-0` : K = `>=${I}.${k}.${G}${b} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.${G} <${+I + 1}.0.0-0`), a("caret return", K), K;
    });
  }, Le = (P, $) => (a("replaceXRanges", P, $), P.split(/\s+/).map((O) => y(O, $)).join(" ")), y = (P, $) => {
    P = P.trim();
    const O = $.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return P.replace(O, (b, N, I, k, G, j) => {
      a("xRange", P, b, N, I, k, G, j);
      const K = D(I), de = K || D(k), U = de || D(G), Je = U;
      return N === "=" && Je && (N = ""), j = $.includePrerelease ? "-0" : "", K ? N === ">" || N === "<" ? b = "<0.0.0-0" : b = "*" : N && Je ? (de && (k = 0), G = 0, N === ">" ? (N = ">=", de ? (I = +I + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : N === "<=" && (N = "<", de ? I = +I + 1 : k = +k + 1), N === "<" && (j = "-0"), b = `${N + I}.${k}.${G}${j}`) : de ? b = `>=${I}.0.0${j} <${+I + 1}.0.0-0` : U && (b = `>=${I}.${k}.0${j} <${I}.${+k + 1}.0-0`), a("xRange return", b), b;
    });
  }, q = (P, $) => (a("replaceStars", P, $), P.trim().replace(l[d.STAR], "")), B = (P, $) => (a("replaceGTE0", P, $), P.trim().replace(l[$.includePrerelease ? d.GTE0PRE : d.GTE0], "")), M = (P) => ($, O, b, N, I, k, G, j, K, de, U, Je) => (D(b) ? O = "" : D(N) ? O = `>=${b}.0.0${P ? "-0" : ""}` : D(I) ? O = `>=${b}.${N}.0${P ? "-0" : ""}` : k ? O = `>=${O}` : O = `>=${O}${P ? "-0" : ""}`, D(K) ? j = "" : D(de) ? j = `<${+K + 1}.0.0-0` : D(U) ? j = `<${K}.${+de + 1}.0-0` : Je ? j = `<=${K}.${de}.${U}-${Je}` : P ? j = `<${K}.${de}.${+U + 1}-0` : j = `<=${j}`, `${O} ${j}`.trim()), X = (P, $, O) => {
    for (let b = 0; b < P.length; b++)
      if (!P[b].test($))
        return !1;
    if ($.prerelease.length && !O.includePrerelease) {
      for (let b = 0; b < P.length; b++)
        if (a(P[b].semver), P[b].semver !== o.ANY && P[b].semver.prerelease.length > 0) {
          const N = P[b].semver;
          if (N.major === $.major && N.minor === $.minor && N.patch === $.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return eo;
}
var to, Ms;
function Ti() {
  if (Ms) return to;
  Ms = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = r(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = c.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  to = t;
  const r = oa, { safeRe: n, t: i } = cn, o = Uu, a = vi, s = Ne, l = Xe();
  return to;
}
const mE = Xe(), gE = (e, t, r) => {
  try {
    t = new mE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ai = gE;
const yE = Xe(), EE = (e, t) => new yE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var wE = EE;
const vE = Ne, _E = Xe(), TE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new _E(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new vE(n, r));
  }), n;
};
var AE = TE;
const SE = Ne, CE = Xe(), bE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new CE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new SE(n, r));
  }), n;
};
var $E = bE;
const ro = Ne, RE = Xe(), Bs = _i, PE = (e, t) => {
  e = new RE(e, t);
  let r = new ro("0.0.0");
  if (e.test(r) || (r = new ro("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new ro(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || Bs(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Bs(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var IE = PE;
const OE = Xe(), DE = (e, t) => {
  try {
    return new OE(e, t).range || "*";
  } catch {
    return null;
  }
};
var NE = DE;
const FE = Ne, ku = Ti(), { ANY: xE } = ku, LE = Xe(), UE = Ai, js = _i, Hs = sa, kE = ca, ME = la, BE = (e, t, r, n) => {
  e = new FE(e, n), t = new LE(t, n);
  let i, o, a, s, l;
  switch (r) {
    case ">":
      i = js, o = kE, a = Hs, s = ">", l = ">=";
      break;
    case "<":
      i = Hs, o = ME, a = js, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (UE(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let f = null, h = null;
    if (c.forEach((g) => {
      g.semver === xE && (g = new ku(">=0.0.0")), f = f || g, h = h || g, i(g.semver, f.semver, n) ? f = g : a(g.semver, h.semver, n) && (h = g);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var ua = BE;
const jE = ua, HE = (e, t, r) => jE(e, t, ">", r);
var qE = HE;
const GE = ua, WE = (e, t, r) => GE(e, t, "<", r);
var VE = WE;
const qs = Xe(), YE = (e, t, r) => (e = new qs(e, r), t = new qs(t, r), e.intersects(t, r));
var zE = YE;
const XE = Ai, KE = ze;
var JE = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((c, f) => KE(c, f, r));
  for (const c of a)
    XE(c, t, r) ? (o = c, i || (i = c)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, f] of n)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const Gs = Xe(), fa = Ti(), { ANY: no } = fa, $r = Ai, da = ze, QE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Gs(e, r), t = new Gs(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = ew(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, ZE = [new fa(">=0.0.0-0")], Ws = [new fa(">=0.0.0")], ew = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === no) {
    if (t.length === 1 && t[0].semver === no)
      return !0;
    r.includePrerelease ? e = ZE : e = Ws;
  }
  if (t.length === 1 && t[0].semver === no) {
    if (r.includePrerelease)
      return !0;
    t = Ws;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Vs(i, g, r) : g.operator === "<" || g.operator === "<=" ? o = Ys(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = da(i.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (i && !$r(g, String(i), r) || o && !$r(g, String(o), r))
      return null;
    for (const w of t)
      if (!$r(g, String(w), r))
        return !1;
    return !0;
  }
  let s, l, d, c, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", i) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === ">" || g.operator === ">=") {
        if (s = Vs(i, g, r), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !$r(i.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Ys(o, g, r), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !$r(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && d && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, Vs = (e, t, r) => {
  if (!e)
    return t;
  const n = da(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Ys = (e, t, r) => {
  if (!e)
    return t;
  const n = da(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var tw = QE;
const io = cn, zs = wi, rw = Ne, Xs = Fu, nw = yr, iw = uy, ow = hy, aw = my, sw = yy, lw = vy, cw = Ay, uw = by, fw = Py, dw = ze, hw = Ny, pw = Ly, mw = aa, gw = By, yw = qy, Ew = _i, ww = sa, vw = xu, _w = Lu, Tw = la, Aw = ca, Sw = Uu, Cw = dE, bw = Ti(), $w = Xe(), Rw = Ai, Pw = wE, Iw = AE, Ow = $E, Dw = IE, Nw = NE, Fw = ua, xw = qE, Lw = VE, Uw = zE, kw = JE, Mw = tw;
var Mu = {
  parse: nw,
  valid: iw,
  clean: ow,
  inc: aw,
  diff: sw,
  major: lw,
  minor: cw,
  patch: uw,
  prerelease: fw,
  compare: dw,
  rcompare: hw,
  compareLoose: pw,
  compareBuild: mw,
  sort: gw,
  rsort: yw,
  gt: Ew,
  lt: ww,
  eq: vw,
  neq: _w,
  gte: Tw,
  lte: Aw,
  cmp: Sw,
  coerce: Cw,
  Comparator: bw,
  Range: $w,
  satisfies: Rw,
  toComparators: Pw,
  maxSatisfying: Iw,
  minSatisfying: Ow,
  minVersion: Dw,
  validRange: Nw,
  outside: Fw,
  gtr: xw,
  ltr: Lw,
  intersects: Uw,
  simplifyRange: kw,
  subset: Mw,
  SemVer: rw,
  re: io.re,
  src: io.src,
  tokens: io.t,
  SEMVER_SPEC_VERSION: zs.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: zs.RELEASE_TYPES,
  compareIdentifiers: Xs.compareIdentifiers,
  rcompareIdentifiers: Xs.rcompareIdentifiers
}, un = {}, ai = { exports: {} };
ai.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", w = "[object GeneratorFunction]", E = "[object Map]", T = "[object Number]", S = "[object Null]", A = "[object Object]", D = "[object Promise]", x = "[object Proxy]", ee = "[object RegExp]", se = "[object Set]", V = "[object String]", Le = "[object Symbol]", y = "[object Undefined]", q = "[object WeakMap]", B = "[object ArrayBuffer]", M = "[object DataView]", X = "[object Float32Array]", P = "[object Float64Array]", $ = "[object Int8Array]", O = "[object Int16Array]", b = "[object Int32Array]", N = "[object Uint8Array]", I = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, K = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, U = {};
  U[X] = U[P] = U[$] = U[O] = U[b] = U[N] = U[I] = U[k] = U[G] = !0, U[s] = U[l] = U[B] = U[c] = U[M] = U[f] = U[h] = U[g] = U[E] = U[T] = U[A] = U[ee] = U[se] = U[V] = U[q] = !1;
  var Je = typeof $e == "object" && $e && $e.Object === Object && $e, p = typeof self == "object" && self && self.Object === Object && self, u = Je || p || Function("return this")(), C = t && !t.nodeType && t, _ = C && !0 && e && !e.nodeType && e, Y = _ && _.exports === C, te = Y && Je.process, oe = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), ge = oe && oe.isTypedArray;
  function ve(m, v) {
    for (var R = -1, F = m == null ? 0 : m.length, Z = 0, H = []; ++R < F; ) {
      var ae = m[R];
      v(ae, R, m) && (H[Z++] = ae);
    }
    return H;
  }
  function at(m, v) {
    for (var R = -1, F = v.length, Z = m.length; ++R < F; )
      m[Z + R] = v[R];
    return m;
  }
  function ue(m, v) {
    for (var R = -1, F = m == null ? 0 : m.length; ++R < F; )
      if (v(m[R], R, m))
        return !0;
    return !1;
  }
  function je(m, v) {
    for (var R = -1, F = Array(m); ++R < m; )
      F[R] = v(R);
    return F;
  }
  function Ni(m) {
    return function(v) {
      return m(v);
    };
  }
  function pn(m, v) {
    return m.has(v);
  }
  function vr(m, v) {
    return m == null ? void 0 : m[v];
  }
  function mn(m) {
    var v = -1, R = Array(m.size);
    return m.forEach(function(F, Z) {
      R[++v] = [Z, F];
    }), R;
  }
  function of(m, v) {
    return function(R) {
      return m(v(R));
    };
  }
  function af(m) {
    var v = -1, R = Array(m.size);
    return m.forEach(function(F) {
      R[++v] = F;
    }), R;
  }
  var sf = Array.prototype, lf = Function.prototype, gn = Object.prototype, Fi = u["__core-js_shared__"], va = lf.toString, Qe = gn.hasOwnProperty, _a = function() {
    var m = /[^.]+$/.exec(Fi && Fi.keys && Fi.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Ta = gn.toString, cf = RegExp(
    "^" + va.call(Qe).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Aa = Y ? u.Buffer : void 0, yn = u.Symbol, Sa = u.Uint8Array, Ca = gn.propertyIsEnumerable, uf = sf.splice, Rt = yn ? yn.toStringTag : void 0, ba = Object.getOwnPropertySymbols, ff = Aa ? Aa.isBuffer : void 0, df = of(Object.keys, Object), xi = Yt(u, "DataView"), _r = Yt(u, "Map"), Li = Yt(u, "Promise"), Ui = Yt(u, "Set"), ki = Yt(u, "WeakMap"), Tr = Yt(Object, "create"), hf = Ot(xi), pf = Ot(_r), mf = Ot(Li), gf = Ot(Ui), yf = Ot(ki), $a = yn ? yn.prototype : void 0, Mi = $a ? $a.valueOf : void 0;
  function Pt(m) {
    var v = -1, R = m == null ? 0 : m.length;
    for (this.clear(); ++v < R; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Ef() {
    this.__data__ = Tr ? Tr(null) : {}, this.size = 0;
  }
  function wf(m) {
    var v = this.has(m) && delete this.__data__[m];
    return this.size -= v ? 1 : 0, v;
  }
  function vf(m) {
    var v = this.__data__;
    if (Tr) {
      var R = v[m];
      return R === n ? void 0 : R;
    }
    return Qe.call(v, m) ? v[m] : void 0;
  }
  function _f(m) {
    var v = this.__data__;
    return Tr ? v[m] !== void 0 : Qe.call(v, m);
  }
  function Tf(m, v) {
    var R = this.__data__;
    return this.size += this.has(m) ? 0 : 1, R[m] = Tr && v === void 0 ? n : v, this;
  }
  Pt.prototype.clear = Ef, Pt.prototype.delete = wf, Pt.prototype.get = vf, Pt.prototype.has = _f, Pt.prototype.set = Tf;
  function rt(m) {
    var v = -1, R = m == null ? 0 : m.length;
    for (this.clear(); ++v < R; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Af() {
    this.__data__ = [], this.size = 0;
  }
  function Sf(m) {
    var v = this.__data__, R = wn(v, m);
    if (R < 0)
      return !1;
    var F = v.length - 1;
    return R == F ? v.pop() : uf.call(v, R, 1), --this.size, !0;
  }
  function Cf(m) {
    var v = this.__data__, R = wn(v, m);
    return R < 0 ? void 0 : v[R][1];
  }
  function bf(m) {
    return wn(this.__data__, m) > -1;
  }
  function $f(m, v) {
    var R = this.__data__, F = wn(R, m);
    return F < 0 ? (++this.size, R.push([m, v])) : R[F][1] = v, this;
  }
  rt.prototype.clear = Af, rt.prototype.delete = Sf, rt.prototype.get = Cf, rt.prototype.has = bf, rt.prototype.set = $f;
  function It(m) {
    var v = -1, R = m == null ? 0 : m.length;
    for (this.clear(); ++v < R; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Rf() {
    this.size = 0, this.__data__ = {
      hash: new Pt(),
      map: new (_r || rt)(),
      string: new Pt()
    };
  }
  function Pf(m) {
    var v = vn(this, m).delete(m);
    return this.size -= v ? 1 : 0, v;
  }
  function If(m) {
    return vn(this, m).get(m);
  }
  function Of(m) {
    return vn(this, m).has(m);
  }
  function Df(m, v) {
    var R = vn(this, m), F = R.size;
    return R.set(m, v), this.size += R.size == F ? 0 : 1, this;
  }
  It.prototype.clear = Rf, It.prototype.delete = Pf, It.prototype.get = If, It.prototype.has = Of, It.prototype.set = Df;
  function En(m) {
    var v = -1, R = m == null ? 0 : m.length;
    for (this.__data__ = new It(); ++v < R; )
      this.add(m[v]);
  }
  function Nf(m) {
    return this.__data__.set(m, n), this;
  }
  function Ff(m) {
    return this.__data__.has(m);
  }
  En.prototype.add = En.prototype.push = Nf, En.prototype.has = Ff;
  function st(m) {
    var v = this.__data__ = new rt(m);
    this.size = v.size;
  }
  function xf() {
    this.__data__ = new rt(), this.size = 0;
  }
  function Lf(m) {
    var v = this.__data__, R = v.delete(m);
    return this.size = v.size, R;
  }
  function Uf(m) {
    return this.__data__.get(m);
  }
  function kf(m) {
    return this.__data__.has(m);
  }
  function Mf(m, v) {
    var R = this.__data__;
    if (R instanceof rt) {
      var F = R.__data__;
      if (!_r || F.length < r - 1)
        return F.push([m, v]), this.size = ++R.size, this;
      R = this.__data__ = new It(F);
    }
    return R.set(m, v), this.size = R.size, this;
  }
  st.prototype.clear = xf, st.prototype.delete = Lf, st.prototype.get = Uf, st.prototype.has = kf, st.prototype.set = Mf;
  function Bf(m, v) {
    var R = _n(m), F = !R && td(m), Z = !R && !F && Bi(m), H = !R && !F && !Z && La(m), ae = R || F || Z || H, he = ae ? je(m.length, String) : [], ye = he.length;
    for (var re in m)
      Qe.call(m, re) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (re == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Z && (re == "offset" || re == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (re == "buffer" || re == "byteLength" || re == "byteOffset") || // Skip index properties.
      Kf(re, ye))) && he.push(re);
    return he;
  }
  function wn(m, v) {
    for (var R = m.length; R--; )
      if (Da(m[R][0], v))
        return R;
    return -1;
  }
  function jf(m, v, R) {
    var F = v(m);
    return _n(m) ? F : at(F, R(m));
  }
  function Ar(m) {
    return m == null ? m === void 0 ? y : S : Rt && Rt in Object(m) ? zf(m) : ed(m);
  }
  function Ra(m) {
    return Sr(m) && Ar(m) == s;
  }
  function Pa(m, v, R, F, Z) {
    return m === v ? !0 : m == null || v == null || !Sr(m) && !Sr(v) ? m !== m && v !== v : Hf(m, v, R, F, Pa, Z);
  }
  function Hf(m, v, R, F, Z, H) {
    var ae = _n(m), he = _n(v), ye = ae ? l : lt(m), re = he ? l : lt(v);
    ye = ye == s ? A : ye, re = re == s ? A : re;
    var Ue = ye == A, He = re == A, _e = ye == re;
    if (_e && Bi(m)) {
      if (!Bi(v))
        return !1;
      ae = !0, Ue = !1;
    }
    if (_e && !Ue)
      return H || (H = new st()), ae || La(m) ? Ia(m, v, R, F, Z, H) : Vf(m, v, ye, R, F, Z, H);
    if (!(R & i)) {
      var Me = Ue && Qe.call(m, "__wrapped__"), Be = He && Qe.call(v, "__wrapped__");
      if (Me || Be) {
        var ct = Me ? m.value() : m, nt = Be ? v.value() : v;
        return H || (H = new st()), Z(ct, nt, R, F, H);
      }
    }
    return _e ? (H || (H = new st()), Yf(m, v, R, F, Z, H)) : !1;
  }
  function qf(m) {
    if (!xa(m) || Qf(m))
      return !1;
    var v = Na(m) ? cf : K;
    return v.test(Ot(m));
  }
  function Gf(m) {
    return Sr(m) && Fa(m.length) && !!U[Ar(m)];
  }
  function Wf(m) {
    if (!Zf(m))
      return df(m);
    var v = [];
    for (var R in Object(m))
      Qe.call(m, R) && R != "constructor" && v.push(R);
    return v;
  }
  function Ia(m, v, R, F, Z, H) {
    var ae = R & i, he = m.length, ye = v.length;
    if (he != ye && !(ae && ye > he))
      return !1;
    var re = H.get(m);
    if (re && H.get(v))
      return re == v;
    var Ue = -1, He = !0, _e = R & o ? new En() : void 0;
    for (H.set(m, v), H.set(v, m); ++Ue < he; ) {
      var Me = m[Ue], Be = v[Ue];
      if (F)
        var ct = ae ? F(Be, Me, Ue, v, m, H) : F(Me, Be, Ue, m, v, H);
      if (ct !== void 0) {
        if (ct)
          continue;
        He = !1;
        break;
      }
      if (_e) {
        if (!ue(v, function(nt, Dt) {
          if (!pn(_e, Dt) && (Me === nt || Z(Me, nt, R, F, H)))
            return _e.push(Dt);
        })) {
          He = !1;
          break;
        }
      } else if (!(Me === Be || Z(Me, Be, R, F, H))) {
        He = !1;
        break;
      }
    }
    return H.delete(m), H.delete(v), He;
  }
  function Vf(m, v, R, F, Z, H, ae) {
    switch (R) {
      case M:
        if (m.byteLength != v.byteLength || m.byteOffset != v.byteOffset)
          return !1;
        m = m.buffer, v = v.buffer;
      case B:
        return !(m.byteLength != v.byteLength || !H(new Sa(m), new Sa(v)));
      case c:
      case f:
      case T:
        return Da(+m, +v);
      case h:
        return m.name == v.name && m.message == v.message;
      case ee:
      case V:
        return m == v + "";
      case E:
        var he = mn;
      case se:
        var ye = F & i;
        if (he || (he = af), m.size != v.size && !ye)
          return !1;
        var re = ae.get(m);
        if (re)
          return re == v;
        F |= o, ae.set(m, v);
        var Ue = Ia(he(m), he(v), F, Z, H, ae);
        return ae.delete(m), Ue;
      case Le:
        if (Mi)
          return Mi.call(m) == Mi.call(v);
    }
    return !1;
  }
  function Yf(m, v, R, F, Z, H) {
    var ae = R & i, he = Oa(m), ye = he.length, re = Oa(v), Ue = re.length;
    if (ye != Ue && !ae)
      return !1;
    for (var He = ye; He--; ) {
      var _e = he[He];
      if (!(ae ? _e in v : Qe.call(v, _e)))
        return !1;
    }
    var Me = H.get(m);
    if (Me && H.get(v))
      return Me == v;
    var Be = !0;
    H.set(m, v), H.set(v, m);
    for (var ct = ae; ++He < ye; ) {
      _e = he[He];
      var nt = m[_e], Dt = v[_e];
      if (F)
        var Ua = ae ? F(Dt, nt, _e, v, m, H) : F(nt, Dt, _e, m, v, H);
      if (!(Ua === void 0 ? nt === Dt || Z(nt, Dt, R, F, H) : Ua)) {
        Be = !1;
        break;
      }
      ct || (ct = _e == "constructor");
    }
    if (Be && !ct) {
      var Tn = m.constructor, An = v.constructor;
      Tn != An && "constructor" in m && "constructor" in v && !(typeof Tn == "function" && Tn instanceof Tn && typeof An == "function" && An instanceof An) && (Be = !1);
    }
    return H.delete(m), H.delete(v), Be;
  }
  function Oa(m) {
    return jf(m, id, Xf);
  }
  function vn(m, v) {
    var R = m.__data__;
    return Jf(v) ? R[typeof v == "string" ? "string" : "hash"] : R.map;
  }
  function Yt(m, v) {
    var R = vr(m, v);
    return qf(R) ? R : void 0;
  }
  function zf(m) {
    var v = Qe.call(m, Rt), R = m[Rt];
    try {
      m[Rt] = void 0;
      var F = !0;
    } catch {
    }
    var Z = Ta.call(m);
    return F && (v ? m[Rt] = R : delete m[Rt]), Z;
  }
  var Xf = ba ? function(m) {
    return m == null ? [] : (m = Object(m), ve(ba(m), function(v) {
      return Ca.call(m, v);
    }));
  } : od, lt = Ar;
  (xi && lt(new xi(new ArrayBuffer(1))) != M || _r && lt(new _r()) != E || Li && lt(Li.resolve()) != D || Ui && lt(new Ui()) != se || ki && lt(new ki()) != q) && (lt = function(m) {
    var v = Ar(m), R = v == A ? m.constructor : void 0, F = R ? Ot(R) : "";
    if (F)
      switch (F) {
        case hf:
          return M;
        case pf:
          return E;
        case mf:
          return D;
        case gf:
          return se;
        case yf:
          return q;
      }
    return v;
  });
  function Kf(m, v) {
    return v = v ?? a, !!v && (typeof m == "number" || de.test(m)) && m > -1 && m % 1 == 0 && m < v;
  }
  function Jf(m) {
    var v = typeof m;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? m !== "__proto__" : m === null;
  }
  function Qf(m) {
    return !!_a && _a in m;
  }
  function Zf(m) {
    var v = m && m.constructor, R = typeof v == "function" && v.prototype || gn;
    return m === R;
  }
  function ed(m) {
    return Ta.call(m);
  }
  function Ot(m) {
    if (m != null) {
      try {
        return va.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function Da(m, v) {
    return m === v || m !== m && v !== v;
  }
  var td = Ra(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ra : function(m) {
    return Sr(m) && Qe.call(m, "callee") && !Ca.call(m, "callee");
  }, _n = Array.isArray;
  function rd(m) {
    return m != null && Fa(m.length) && !Na(m);
  }
  var Bi = ff || ad;
  function nd(m, v) {
    return Pa(m, v);
  }
  function Na(m) {
    if (!xa(m))
      return !1;
    var v = Ar(m);
    return v == g || v == w || v == d || v == x;
  }
  function Fa(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= a;
  }
  function xa(m) {
    var v = typeof m;
    return m != null && (v == "object" || v == "function");
  }
  function Sr(m) {
    return m != null && typeof m == "object";
  }
  var La = ge ? Ni(ge) : Gf;
  function id(m) {
    return rd(m) ? Bf(m) : Wf(m);
  }
  function od() {
    return [];
  }
  function ad() {
    return !1;
  }
  e.exports = nd;
})(ai, ai.exports);
var Bw = ai.exports;
Object.defineProperty(un, "__esModule", { value: !0 });
un.DownloadedUpdateHelper = void 0;
un.createTempUpdateFile = Ww;
const jw = en, Hw = St, Ks = Bw, Ft = bt, Ur = ie;
class qw {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Ur.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Ks(this.versionInfo, r) && Ks(this.fileInfo.info, n.info) && await (0, Ft.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(n, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, r, n, i, o, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Ft.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Ft.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Ft.pathExists)(n))
      return null;
    let o;
    try {
      o = await (0, Ft.readJson)(n);
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), r.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Ur.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Ft.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await Gw(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Ur.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
un.DownloadedUpdateHelper = qw;
function Gw(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, jw.createHash)(t);
    a.on("error", o).setEncoding(r), (0, Hw.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function Ww(e, t, r) {
  let n = 0, i = Ur.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Ft.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Ur.join(t, `${n++}-${e}`);
    }
  return i;
}
var Si = {}, ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
ha.getAppCacheDir = Yw;
const oo = ie, Vw = ci;
function Yw() {
  const e = (0, Vw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || oo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = oo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || oo.join(e, ".cache"), t;
}
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.ElectronAppAdapter = void 0;
const Js = ie, zw = ha;
class Xw {
  constructor(t = jt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Js.join(process.resourcesPath, "app-update.yml") : Js.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, zw.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
Si.ElectronAppAdapter = Xw;
var Bu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = fe;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return jt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, d, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (h) => {
            h == null ? l(a) : d(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = jt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, d) {
      o.on("redirect", (c, f, h) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : d(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Bu);
var fn = {}, Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.newBaseUrl = Kw;
Ke.newUrlFromBase = Jw;
Ke.getChannelFilename = Qw;
const ju = Ct;
function Kw(e) {
  const t = new ju.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Jw(e, t, r = !1) {
  const n = new ju.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Qw(e) {
  return `${e}.yml`;
}
var ce = {}, Zw = "[object Symbol]", Hu = /[\\^$.*+?()[\]{}|]/g, ev = RegExp(Hu.source), tv = typeof $e == "object" && $e && $e.Object === Object && $e, rv = typeof self == "object" && self && self.Object === Object && self, nv = tv || rv || Function("return this")(), iv = Object.prototype, ov = iv.toString, Qs = nv.Symbol, Zs = Qs ? Qs.prototype : void 0, el = Zs ? Zs.toString : void 0;
function av(e) {
  if (typeof e == "string")
    return e;
  if (lv(e))
    return el ? el.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function sv(e) {
  return !!e && typeof e == "object";
}
function lv(e) {
  return typeof e == "symbol" || sv(e) && ov.call(e) == Zw;
}
function cv(e) {
  return e == null ? "" : av(e);
}
function uv(e) {
  return e = cv(e), e && ev.test(e) ? e.replace(Hu, "\\$&") : e;
}
var qu = uv;
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.Provider = void 0;
ce.findFile = mv;
ce.parseUpdateInfo = gv;
ce.getFileList = Gu;
ce.resolveFiles = yv;
const Tt = fe, fv = we, dv = Ct, si = Ke, hv = qu;
class pv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const o = (0, si.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, si.newUrlFromBase)(`${t.pathname.replace(new RegExp(hv(n), "g"), r)}.blockmap`, i ? new dv.URL(i) : t), o];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Tt.configureRequestUrl)(t, n), n;
  }
}
ce.Provider = pv;
function mv(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, Tt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (n = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return o || (r == null ? e[0] : e.find((a) => !r.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function gv(e, t, r) {
  if (e == null)
    throw (0, Tt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, fv.load)(e);
  } catch (i) {
    throw (0, Tt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Gu(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Tt.newError)(`No files provided: ${(0, Tt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function yv(e, t, r = (n) => n) {
  const i = Gu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, Tt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Tt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, si.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, si.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.GenericProvider = void 0;
const tl = fe, ao = Ke, so = ce;
class Ev extends so.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, ao.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, ao.getChannelFilename)(this.channel), r = (0, ao.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, so.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof tl.HttpError && i.statusCode === 404)
          throw (0, tl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * n);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, so.resolveFiles)(t, this.baseUrl);
  }
}
fn.GenericProvider = Ev;
var Ci = {}, bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.BitbucketProvider = void 0;
const rl = fe, lo = Ke, co = ce;
class wv extends co.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, lo.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new rl.CancellationToken(), r = (0, lo.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, lo.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, co.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, rl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, co.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
bi.BitbucketProvider = wv;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.GitHubProvider = At.BaseGitHubProvider = void 0;
At.computeReleaseNotes = Vu;
const it = fe, Ut = Mu, vv = Ct, ir = Ke, xo = ce, uo = /\/tag\/([^/]+)$/;
class Wu extends xo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, ir.newBaseUrl)((0, it.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, ir.newBaseUrl)((0, it.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
At.BaseGitHubProvider = Wu;
class _v extends Wu {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, o;
    const a = new it.CancellationToken(), s = await this.httpRequest((0, ir.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, it.parseXml)(s);
    let d = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Ut.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          c = uo.exec(d.element("link").attribute("href"))[1];
        else
          for (const S of l.getElements("entry")) {
            const A = uo.exec(S.element("link").attribute("href"));
            if (A === null)
              continue;
            const D = A[1], x = ((n = Ut.prerelease(D)) === null || n === void 0 ? void 0 : n[0]) || null, ee = !T || ["alpha", "beta"].includes(T), se = x !== null && !["alpha", "beta"].includes(String(x));
            if (ee && !se && !(T === "beta" && x === "alpha")) {
              c = D;
              break;
            }
            if (x && x === T) {
              c = D;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const T of l.getElements("entry"))
          if (uo.exec(T.element("link").attribute("href"))[1] === c) {
            d = T;
            break;
          }
      }
    } catch (T) {
      throw (0, it.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, it.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", g = "";
    const w = async (T) => {
      h = (0, ir.getChannelFilename)(T), g = (0, ir.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const S = this.createRequestOptions(g);
      try {
        return await this.executor.request(S, a);
      } catch (A) {
        throw A instanceof it.HttpError && A.statusCode === 404 ? (0, it.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${A.stack || A.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : A;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = Ut.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((o = Ut.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await w(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        f = await w(this.getDefaultChannelName());
      else
        throw T;
    }
    const E = (0, xo.parseUpdateInfo)(f, h, g);
    return E.releaseName == null && (E.releaseName = d.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = Vu(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...E
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, ir.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new vv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, it.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, xo.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
At.GitHubProvider = _v;
function nl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Vu(e, t, r, n) {
  if (!t)
    return nl(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Ut.valid(a) && Ut.lt(e, a) && i.push({
      version: a,
      note: nl(o)
    });
  }
  return i.sort((o, a) => Ut.rcompare(o.version, a.version));
}
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.GitLabProvider = void 0;
const Se = fe, fo = Ct, Tv = qu, Bn = Ke, ho = ce;
class Av extends ho.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, r, n) {
    super({
      ...n,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = r, this.cachedLatestVersion = null;
    const o = t.host || "gitlab.com";
    this.baseApiUrl = (0, Bn.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new Se.CancellationToken(), r = (0, Bn.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, g = await this.httpRequest(r, h, t);
      if (!g)
        throw (0, Se.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(g);
    } catch (h) {
      throw (0, Se.newError)(`Unable to find latest release on GitLab (${r}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let o = null, a = "", s = null;
    const l = async (h) => {
      a = (0, Bn.getChannelFilename)(h);
      const g = n.assets.links.find((E) => E.name === a);
      if (!g)
        throw (0, Se.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new fo.URL(g.direct_asset_url);
      const w = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const E = await this.httpRequest(s, w, t);
        if (!E)
          throw (0, Se.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return E;
      } catch (E) {
        throw E instanceof Se.HttpError && E.statusCode === 404 ? (0, Se.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
      }
    };
    try {
      o = await l(this.channel);
    } catch (h) {
      if (this.channel !== this.getDefaultChannelName())
        o = await l(this.getDefaultChannelName());
      else
        throw h;
    }
    if (!o)
      throw (0, Se.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const d = (0, ho.parseUpdateInfo)(o, a, s);
    d.releaseName == null && (d.releaseName = n.name), d.releaseNotes == null && (d.releaseNotes = n.description || null);
    const c = /* @__PURE__ */ new Map();
    for (const h of n.assets.links)
      c.set(this.normalizeFilename(h.name), h.direct_asset_url);
    const f = {
      tag: i,
      assets: c,
      ...d
    };
    return this.cachedLatestVersion = f, f;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const r = /* @__PURE__ */ new Map();
    for (const n of t.links)
      r.set(this.normalizeFilename(n.name), n.direct_asset_url);
    return r;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, r) {
    const n = [`${r}.blockmap`, `${this.normalizeFilename(r)}.blockmap`];
    for (const i of n) {
      const o = t.get(i);
      if (o)
        return new fo.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new Se.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const o = (0, Bn.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, r);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof Se.HttpError && a.statusCode === 404)
          continue;
        throw (0, Se.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Se.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const r = {};
    return t != null && (t.startsWith("Bearer") ? r.authorization = t : r["PRIVATE-TOKEN"] = t), r;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const r = await this.fetchReleaseInfoByVersion(t);
    return r && r.assets ? this.convertAssetsToMap(r.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, r, n) {
    let i = null, o = null;
    const a = await this.getVersionInfoForBlockMap(r);
    a && (i = this.findBlockMapInAssets(a, n));
    const s = await this.getVersionInfoForBlockMap(t);
    if (s) {
      const l = n.replace(new RegExp(Tv(r), "g"), t);
      o = this.findBlockMapInAssets(s, l);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [a, s] = await this.findBlockMapUrlsFromAssets(r, n, o);
      if (!s)
        throw (0, Se.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, Se.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, ho.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, Se.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new fo.URL(o),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
$i.GitLabProvider = Av;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.KeygenProvider = void 0;
const il = fe, po = Ke, mo = ce;
class Sv extends mo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, po.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new il.CancellationToken(), r = (0, po.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, po.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, mo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, il.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, mo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Ri.KeygenProvider = Sv;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.PrivateGitHubProvider = void 0;
const Kt = fe, Cv = we, bv = ie, ol = Ct, al = Ke, $v = At, Rv = ce;
class Pv extends $v.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Kt.CancellationToken(), r = (0, al.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, Kt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ol.URL(i.url);
    let a;
    try {
      a = (0, Cv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof Kt.HttpError && s.statusCode === 404 ? (0, Kt.newError)(`Cannot find ${r} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = n.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, al.newUrlFromBase)(n, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Kt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Rv.getFileList)(t).map((r) => {
      const n = bv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, Kt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ol.URL(i.url),
        info: r
      };
    });
  }
}
Pi.PrivateGitHubProvider = Pv;
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.isUrlProbablySupportMultiRangeRequests = Yu;
Ci.createClient = xv;
const jn = fe, Iv = bi, sl = fn, Ov = At, Dv = $i, Nv = Ri, Fv = Pi;
function Yu(e) {
  return !e.includes("s3.amazonaws.com");
}
function xv(e, t, r) {
  if (typeof e == "string")
    throw (0, jn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Ov.GitHubProvider(i, t, r) : new Fv.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new Iv.BitbucketProvider(e, t, r);
    case "gitlab":
      return new Dv.GitLabProvider(e, t, r);
    case "keygen":
      return new Nv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new sl.GenericProvider({
        provider: "generic",
        url: (0, jn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new sl.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Yu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, jn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, jn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Ii = {}, dn = {}, Er = {}, Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.OperationKind = void 0;
Vt.computeOperations = Lv;
var kt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(kt || (Vt.OperationKind = kt = {}));
function Lv(e, t, r) {
  const n = cl(e.files), i = cl(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = kv(n.get(l), d.offset, r);
  let w = a.offset;
  for (let E = 0; E < c.checksums.length; w += c.sizes[E], E++) {
    const T = c.sizes[E], S = c.checksums[E];
    let A = h.get(S);
    A != null && g.get(S) !== T && (r.warn(`Checksum ("${S}") matches, but size differs (old: ${g.get(S)}, new: ${T})`), A = void 0), A === void 0 ? (f++, o != null && o.kind === kt.DOWNLOAD && o.end === w ? o.end += T : (o = {
      kind: kt.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, ll(o, s, S, E))) : o != null && o.kind === kt.COPY && o.end === A ? o.end += T : (o = {
      kind: kt.COPY,
      start: A,
      end: A + T
      // oldBlocks: [checksum]
    }, ll(o, s, S, E));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Uv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function ll(e, t, r, n) {
  if (Uv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${kt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function kv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], d = i.get(s);
    if (d === void 0)
      n.set(s, o), i.set(s, l);
    else if (r.debug != null) {
      const c = d === l ? "(same size)" : `(size: ${d}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function cl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.DataSplitter = void 0;
Er.copyData = zu;
const Hn = fe, Mv = St, Bv = Zr, jv = Vt, ul = Buffer.from(`\r
\r
`);
var ft;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(ft || (ft = {}));
function zu(e, t, r, n, i) {
  const o = (0, Mv.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", n), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class Hv extends Bv.Writable {
  constructor(t, r, n, i, o, a, s, l) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = l, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = ft.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      n();
    }).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Hn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === ft.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = ft.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === ft.BODY)
          this.readState = ft.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Hn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Hn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = ft.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, o), this.remainingPartDataCount = n - (o - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const o = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== jv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        zu(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(ul, r);
    if (n !== -1)
      return n + ul.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Hn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r, this.transferred += n - r, this.delta += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
Er.DataSplitter = Hv;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.executeTasksUsingMultipleRangeRequests = qv;
Oi.checkIsRangesSupported = Uo;
const Lo = fe, fl = Er, dl = Vt;
function qv(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    Gv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function Gv(e, t, r, n, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), d = [];
  for (let h = t.start; h < t.end; h++) {
    const g = t.tasks[h];
    g.kind === dl.OperationKind.DOWNLOAD && (o += `${g.start}-${g.end - 1}, `, l.set(a, h), a++, d.push(g.end - g.start), s += g.end - g.start);
  }
  if (a <= 1) {
    const h = (g) => {
      if (g >= t.end) {
        n();
        return;
      }
      const w = t.tasks[g++];
      if (w.kind === dl.OperationKind.COPY)
        (0, fl.copyData)(w, r, t.oldFileFd, i, () => h(g));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${w.start}-${w.end - 1}`;
        const T = e.httpExecutor.createRequest(E, (S) => {
          S.on("error", i), Uo(S, i) && (S.pipe(r, {
            end: !1
          }), S.once("end", () => h(g)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(T, i), T.end();
      }
    };
    h(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (h) => {
    if (!Uo(h, i))
      return;
    const g = (0, Lo.safeGetHeader)(h, "content-type"), w = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(g);
    if (w == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${g}"`));
      return;
    }
    const E = new fl.DataSplitter(r, t, l, w[1] || w[2], d, n, s, e.options.onProgress);
    E.on("error", i), h.pipe(E), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Uo(e, t) {
  if (e.statusCode >= 400)
    return t((0, Lo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Lo.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.ProgressDifferentialDownloadCallbackTransform = void 0;
const Wv = Zr;
var or;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(or || (or = {}));
class Vv extends Wv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = or.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == or.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = or.COPY;
  }
  beginRangeDownload() {
    this.operationType = or.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Di.ProgressDifferentialDownloadCallbackTransform = Vv;
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.DifferentialDownloader = void 0;
const Rr = fe, go = bt, Yv = St, zv = Er, Xv = Ct, qn = Vt, hl = Oi, Kv = Di;
class Jv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, Rr.configureRequestUrl)(this.options.newUrl, t), (0, Rr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, qn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === qn.OperationKind.DOWNLOAD ? o += d : a += d;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return n.info(`Full: ${pl(s)}, To download: ${pl(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, go.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, go.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, go.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Yv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const S = [];
        let A = 0;
        for (const x of t)
          x.kind === qn.OperationKind.DOWNLOAD && (S.push(x.end - x.start), A += x.end - x.start);
        const D = {
          expectedByteCounts: S,
          grandTotal: A
        };
        d = new Kv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new Rr.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (S) {
            s(S);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const S of l)
        S.on("error", s), f == null ? f = S : f = f.pipe(S);
      const h = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, hl.executeTasksUsingMultipleRangeRequests)(this, t, h, n, s), g(0);
        return;
      }
      let w = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", g = (S) => {
        var A, D;
        if (S >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const x = t[S++];
        if (x.kind === qn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, zv.copyData)(x, h, n, s, () => g(S));
          return;
        }
        const ee = `bytes=${x.start}-${x.end - 1}`;
        T.headers.range = ee, (D = (A = this.logger) === null || A === void 0 ? void 0 : A.debug) === null || D === void 0 || D.call(A, `download range: ${ee}`), d && d.beginRangeDownload();
        const se = this.httpExecutor.createRequest(T, (V) => {
          V.on("error", s), V.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && s((0, Rr.createHttpError)(V)), V.pipe(h, {
            end: !1
          }), V.once("end", () => {
            d && d.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => g(S), 1e3)) : g(S);
          });
        });
        se.on("redirect", (V, Le, y) => {
          this.logger.info(`Redirect to ${Qv(y)}`), E = y, (0, Rr.configureRequestUrl)(new Xv.URL(E), T), se.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(se, s), se.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(n, o), o += a.length;
    }), o !== n.length)
      throw new Error(`Received data length ${o} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, hl.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
dn.DifferentialDownloader = Jv;
function pl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Qv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.GenericDifferentialDownloader = void 0;
const Zv = dn;
class e_ extends Zv.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Ii.GenericDifferentialDownloader = e_;
var $t = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = fe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      n(this.emitter, "login", o);
    }
    progress(o) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      n(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      n(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = r;
  function n(i, o, a) {
    i.on(o, a);
  }
})($t);
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.NoOpLogger = wt.AppUpdater = void 0;
const Ce = fe, t_ = en, r_ = ci, n_ = Bl, qe = bt, i_ = we, yo = Ei, Ge = ie, xt = Mu, ml = un, o_ = Si, gl = Bu, a_ = fn, Eo = Ci, wo = Hl, s_ = Ii, Jt = $t;
class pa extends n_.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Ce.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ce.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, gl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Xu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new yo.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Jt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new yo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new yo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new o_.ElectronAppAdapter(), this.httpExecutor = new gl.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, xt.parse)(n);
    if (i == null)
      throw (0, Ce.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = l_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new a_.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Eo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Eo.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = pa.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new jt.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = Ce.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, xt.parse)(t.version);
    if (r == null)
      throw (0, Ce.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, xt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, xt.gt)(r, n), a = (0, xt.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, r_.release)();
    if (r)
      try {
        if ((0, xt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Eo.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new Ce.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ce.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ce.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ce.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Ce.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(Jt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, i_.load)(await (0, qe.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Ge.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, qe.readFile)(t, "utf-8");
      if (Ce.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Ce.UUID.v5((0, t_.randomBytes)(4096), Ce.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, qe.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Ge.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new ml.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (A) => this.emit(Jt.DOWNLOAD_PROGRESS, A));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const A = decodeURIComponent(t.fileInfo.url.pathname);
      return A.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Ge.basename(A) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, qe.mkdir)(d, { recursive: !0 });
    const c = s();
    let f = Ge.join(d, c);
    const h = a == null ? null : Ge.join(d, `package-${o}${Ge.extname(a.path) || ".7z"}`), g = async (A) => {
      await l.setDownloadedFile(f, h, i, r, c, A), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = Ge.join(d, "current.blockmap");
      return await (0, qe.pathExists)(D) && await (0, qe.copyFile)(D, Ge.join(l.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, w = this._logger, E = await l.validateDownloadedPath(f, i, r, w);
    if (E != null)
      return f = E, await g(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, qe.unlink)(f).catch(() => {
    })), S = await (0, ml.createTempUpdateFile)(`temp-${c}`, d, w);
    try {
      await t.task(S, n, h, T), await (0, Ce.retry)(() => (0, qe.rename)(S, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (A) => A instanceof Error && /^EBUSY:/.test(A.message) ? !0 : (w.warn(`Cannot rename temp file to final file: ${A.message || A.stack}`), !1)
      });
    } catch (A) {
      throw await T(), A instanceof Ce.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), A;
    }
    return w.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = r.updateInfoAndProvider.provider, s = await a.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const l = async (w) => {
        const E = await this.httpExecutor.downloadToBuffer(w, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (E == null || E.length === 0)
          throw new Error(`Blockmap "${w.href}" is empty`);
        try {
          return JSON.parse((0, wo.gunzipSync)(E).toString());
        } catch (T) {
          throw new Error(`Cannot parse blockmap "${w.href}", error: ${T}`);
        }
      }, d = {
        newUrl: t.url,
        oldFile: Ge.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (d.onProgress = (w) => this.emit(Jt.DOWNLOAD_PROGRESS, w));
      const c = async (w, E) => {
        const T = Ge.join(E, "current.blockmap");
        await (0, qe.outputFile)(T, (0, wo.gzipSync)(JSON.stringify(w)));
      }, f = async (w) => {
        const E = Ge.join(w, "current.blockmap");
        try {
          if (await (0, qe.pathExists)(E))
            return JSON.parse((0, wo.gunzipSync)(await (0, qe.readFile)(E)).toString());
        } catch (T) {
          this._logger.warn(`Cannot parse blockmap "${E}", error: ${T}`);
        }
        return null;
      }, h = await l(s[1]);
      await c(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let g = await f(this.downloadedUpdateHelper.cacheDir);
      return g == null && (g = await l(s[0])), await new s_.GenericDifferentialDownloader(t.info, this.httpExecutor, d).download(g, h), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
wt.AppUpdater = pa;
function l_(e) {
  const t = (0, xt.prerelease)(e);
  return t != null && t.length > 0;
}
class Xu {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
wt.NoOpLogger = Xu;
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.BaseUpdater = void 0;
const yl = li, c_ = wt;
class u_ extends c_.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      jt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, o = n == null ? null : n.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, yl.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: n, detached: !0 }, l = (0, yl.spawn)(t, r, s);
        l.on("error", (d) => {
          a(d);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
Wt.BaseUpdater = u_;
var Yr = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Qt = bt, f_ = dn, d_ = Hl;
class h_ extends f_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Ku(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await p_(this.options.oldFile), i);
  }
}
hn.FileWithEmbeddedBlockMapDifferentialDownloader = h_;
function Ku(e) {
  return JSON.parse((0, d_.inflateRawSync)(e).toString());
}
async function p_(e) {
  const t = await (0, Qt.open)(e, "r");
  try {
    const r = (await (0, Qt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Qt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Qt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Qt.close)(t), Ku(i);
  } catch (r) {
    throw await (0, Qt.close)(t), r;
  }
}
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.AppImageUpdater = void 0;
const El = fe, wl = li, m_ = bt, g_ = St, Pr = ie, y_ = Wt, E_ = hn, w_ = ce, vl = $t;
class v_ extends y_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, w_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, El.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, m_.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(vl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(vl.DOWNLOAD_PROGRESS, s)), await new E_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, El.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, g_.unlinkSync)(r);
    let n;
    const i = Pr.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Pr.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Pr.join(Pr.dirname(r), Pr.basename(o)), (0, wl.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, wl.execFileSync)(n, [], { env: a })), !0;
  }
}
Yr.AppImageUpdater = v_;
var zr = {}, wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.LinuxUpdater = void 0;
const __ = Wt;
class T_ extends __.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: r } = this.app, n = `"${r} would like to update"`, i = this.sudoWithArgs(n);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let o = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (o = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${o}/bin/bash`, "-c", `'${t.join(" ")}'${o}`]);
  }
  sudoWithArgs(t) {
    const r = this.determineSudoCommand(), n = [r];
    return /kdesudo/i.test(r) ? (n.push("--comment", t), n.push("-c")) : /gksudo/i.test(r) ? n.push("--message", t) : /pkexec/i.test(r) && n.push("--disable-internal-agent"), n;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const r of t)
      if (this.hasCommand(r))
        return r;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var r;
    const n = (r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || r === void 0 ? void 0 : r.trim();
    if (n)
      return n;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
wr.LinuxUpdater = T_;
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.DebUpdater = void 0;
const A_ = ce, _l = $t, S_ = wr;
class ma extends S_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, A_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(_l.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(_l.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      ma.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    var o;
    if (t === "dpkg")
      try {
        n(["dpkg", "-i", r]);
      } catch (a) {
        i.warn((o = a.message) !== null && o !== void 0 ? o : a), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        r
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
zr.DebUpdater = ma;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.PacmanUpdater = void 0;
const Tl = $t, C_ = ce, b_ = wr;
class ga extends b_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, C_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Tl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Tl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      ga.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (n) {
      return this.dispatchError(n), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n) {
    var i;
    try {
      r(["pacman", "-U", "--noconfirm", t]);
    } catch (o) {
      n.warn((i = o.message) !== null && i !== void 0 ? i : o), n.warn("pacman installation failed, attempting to update package database and retry");
      try {
        r(["pacman", "-Sy", "--noconfirm"]), r(["pacman", "-U", "--noconfirm", t]);
      } catch (a) {
        throw n.error("Retry after pacman -Sy failed"), a;
      }
    }
  }
}
Xr.PacmanUpdater = ga;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.RpmUpdater = void 0;
const Al = $t, $_ = ce, R_ = wr;
class ya extends R_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, $_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Al.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Al.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      ya.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    if (t === "zypper")
      return n(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", r]);
    if (t === "dnf")
      return n(["dnf", "install", "--nogpgcheck", "-y", r]);
    if (t === "yum")
      return n(["yum", "install", "--nogpgcheck", "-y", r]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), n(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", r]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Kr.RpmUpdater = ya;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.MacUpdater = void 0;
const Sl = fe, vo = bt, P_ = St, Cl = ie, I_ = md, O_ = wt, D_ = ce, bl = li, $l = en;
class N_ extends O_.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = jt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, bl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, bl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && r.some(s) ? r = r.filter((f) => a === s(f)) : r = r.filter((f) => !s(f));
    const l = (0, D_.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Sl.newError)(`ZIP file not provided: ${(0, Sl.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const g = Cl.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, vo.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let E = !0;
        w() && (E = await this.differentialDownloadInstaller(l, t, f, d, c)), E && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Cl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, vo.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, vo.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, I_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const f = (0, $l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, $l.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, E) => {
        const T = w.url;
        if (a.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("No authenthication info");
            return;
          }
          const D = w.headers.authorization.split(" ")[1], x = Buffer.from(D, "base64").toString("ascii"), [ee, se] = x.split(":");
          if (ee !== "autoupdater" || se !== f) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const V = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          E.writeHead(200, { "Content-Type": "application/json", "Content-Length": V.length }), E.end(V);
          return;
        }
        if (!T.startsWith(g)) {
          a.warn(`${T} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        a.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let S = !1;
        E.on("finish", () => {
          S || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const A = (0, P_.createReadStream)(i);
        A.on("error", (D) => {
          try {
            E.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          S = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${D}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), A.pipe(E);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : d([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Jr.MacUpdater = N_;
var Qr = {}, Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
Ea.verifySignature = x_;
const Rl = fe, Ju = li, F_ = ci, Pl = ie;
function Qu(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function x_(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, Ju.execFile)(...Qu(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var d;
      try {
        if (a != null || l) {
          _o(r, a, l, i), n(null);
          return;
        }
        const c = L_(s);
        if (c.Status === 0) {
          try {
            const w = Pl.normalize(c.Path), E = Pl.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${E}`), w !== E) {
              _o(r, new Error(`LiteralPath of ${w} is different than ${E}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = w.message) !== null && d !== void 0 ? d : w.stack}`);
          }
          const h = (0, Rl.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const w of e) {
            const E = (0, Rl.parseDn)(w);
            if (E.size ? g = Array.from(E.keys()).every((S) => E.get(S) === h.get(S)) : w === h.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, g) => h === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (c) {
        _o(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function L_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function _o(e, t, r, n) {
  if (U_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Ju.execFileSync)(...Qu("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function U_() {
  const e = F_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.NsisUpdater = void 0;
const Gn = fe, Il = ie, k_ = Wt, M_ = hn, Ol = $t, B_ = ce, j_ = bt, H_ = Ea, Dl = Ct;
class q_ extends k_.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, H_.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, B_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, a, s) => {
        const l = n.packageInfo, d = l != null && a != null;
        if (d && t.disableWebInstaller)
          throw (0, Gn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Gn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Gn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, a, r))
          try {
            await this.httpExecutor.download(new Dl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, j_.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Il.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(r, n).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? jt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Dl.URL(r.path),
        oldFile: Il.join(this.downloadedUpdateHelper.cacheDir, Gn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Ol.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ol.DOWNLOAD_PROGRESS, a)), await new M_.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Qr.NsisUpdater = q_;
(function(e) {
  var t = $e && $e.__createBinding || (Object.create ? function(T, S, A, D) {
    D === void 0 && (D = A);
    var x = Object.getOwnPropertyDescriptor(S, A);
    (!x || ("get" in x ? !S.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return S[A];
    } }), Object.defineProperty(T, D, x);
  } : function(T, S, A, D) {
    D === void 0 && (D = A), T[D] = S[A];
  }), r = $e && $e.__exportStar || function(T, S) {
    for (var A in T) A !== "default" && !Object.prototype.hasOwnProperty.call(S, A) && t(S, T, A);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = bt, i = ie;
  var o = Wt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = wt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = ce;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = Yr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var d = zr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return d.DebUpdater;
  } });
  var c = Xr;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = Kr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = Jr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var g = Qr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), r($t, e);
  let w;
  function E() {
    if (process.platform === "win32")
      w = new Qr.NsisUpdater();
    else if (process.platform === "darwin")
      w = new Jr.MacUpdater();
    else {
      w = new Yr.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(T))
          return w;
        switch ((0, n.readFileSync)(T).toString().trim()) {
          case "deb":
            w = new zr.DebUpdater();
            break;
          case "rpm":
            w = new Kr.RpmUpdater();
            break;
          case "pacman":
            w = new Xr.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return w;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => w || E()
  });
})(ke);
ke.autoUpdater.autoDownload = !1;
ke.autoUpdater.autoInstallOnAppQuit = !0;
ke.autoUpdater.autoRunAppAfterInstall = !0;
function G_() {
  ke.autoUpdater.on("error", (e) => {
    console.log("[AutoUpdater] Error:", e.message);
  }), ke.autoUpdater.on("checking-for-update", () => {
    console.log("[AutoUpdater] Checking for updates...");
  }), ke.autoUpdater.on("update-available", (e) => {
    console.log("[AutoUpdater] Update available:", e.version);
    const t = gt.getFocusedWindow();
    Xn.showMessageBox(t || {}, {
      type: "info",
      title: "Update Available",
      message: `A new version (v${e.version}) is available!`,
      detail: "Would you like to download and install it? The update will be applied when you restart the app.",
      buttons: ["Update", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then(({ response: r }) => {
      r === 0 && (ke.autoUpdater.downloadUpdate(), gt.getAllWindows().forEach((i) => {
        i.isDestroyed() || i.webContents.send("update-downloading");
      }));
    });
  }), ke.autoUpdater.on("update-not-available", () => {
    console.log("[AutoUpdater] App is up to date.");
  }), ke.autoUpdater.on("download-progress", (e) => {
    console.log(`[AutoUpdater] Download: ${Math.round(e.percent)}%`);
  }), ke.autoUpdater.on("update-downloaded", (e) => {
    console.log("[AutoUpdater] Update downloaded:", e.version);
    const t = gt.getFocusedWindow();
    Xn.showMessageBox(t || {}, {
      type: "info",
      title: "Update Ready",
      message: "Update has been downloaded!",
      detail: "The update will be installed when you restart the app. Restart now?",
      buttons: ["Restart Now", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then(({ response: r }) => {
      r === 0 && ke.autoUpdater.quitAndInstall(!1, !0);
    });
  }), setTimeout(() => {
    ke.autoUpdater.checkForUpdates().catch((e) => {
      console.log("[AutoUpdater] Check failed (offline?):", e.message);
    });
  }, 5e3);
}
const W_ = z.dirname(kl(import.meta.url));
Ll.registerSchemesAsPrivileged([
  {
    scheme: "velo-asset",
    privileges: {
      secure: !0,
      supportFetchAPI: !0,
      bypassCSP: !0,
      corsEnabled: !0,
      stream: !0
    }
  }
]);
pe.setName("Velo Studio");
const Nl = "velostudio";
process.defaultApp && process.argv.length >= 2 ? pe.setAsDefaultProtocolClient(Nl, process.execPath, [z.resolve(process.argv[1])]) : pe.setAsDefaultProtocolClient(Nl);
let Dr = null;
function Zu(e) {
  console.log("[Deep Link] Received:", e);
  try {
    const t = new URL(e), r = t.searchParams.get("access_token"), n = t.searchParams.get("refresh_token");
    r && n && (console.log("[Deep Link] Got auth tokens, sending to auth window"), We && !We.isDestroyed() ? (We.webContents.send("deep-link-auth", { accessToken: r, refreshToken: n }), We.focus()) : Dr = e);
  } catch (t) {
    console.error("[Deep Link] Failed to parse URL:", t);
  }
}
pe.on("open-url", (e, t) => {
  e.preventDefault(), Zu(t);
});
const ar = z.join(pe.getPath("userData"), "recordings");
async function V_() {
  try {
    await Zt.mkdir(ar, { recursive: !0 }), console.log("RECORDINGS_DIR:", ar), console.log("User Data Path:", pe.getPath("userData"));
  } catch (e) {
    console.error("Failed to create recordings directory:", e);
  }
}
process.env.APP_ROOT = z.join(W_, "..");
const Y_ = process.env.VITE_DEV_SERVER_URL, gT = z.join(process.env.APP_ROOT, "dist-electron"), ef = z.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Y_ ? z.join(process.env.APP_ROOT, "public") : ef;
let be = null, We = null, Nr = null, sr = null, tf = "";
const rf = nf("openscreen.png"), z_ = nf("rec-button.png");
function wa() {
  be = yd();
}
function Fl() {
  sr = new ud(rf);
}
function nf(e) {
  return Ul.createFromPath(z.join(process.env.VITE_PUBLIC || ef, e)).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function xl(e = !1) {
  if (!sr) return;
  const t = e ? z_ : rf, r = e ? `Recording: ${tf}` : "Velo Studio", n = e ? [
    {
      label: "Stop Recording",
      click: () => {
        be && !be.isDestroyed() && be.webContents.send("stop-recording-from-tray");
      }
    }
  ] : [
    {
      label: "Open",
      click: () => {
        be && !be.isDestroyed() ? be.isMinimized() && be.restore() : wa();
      }
    },
    {
      label: "Quit",
      click: () => {
        pe.quit();
      }
    }
  ];
  sr.setImage(t), sr.setToolTip(r), sr.setContextMenu(fd.buildFromTemplate(n));
}
function X_() {
  be && (be.close(), be = null), be = Ed();
}
function K_() {
  return Nr = wd(), Nr.on("closed", () => {
    Nr = null;
  }), Nr;
}
pe.on("window-all-closed", () => {
});
pe.on("activate", () => {
  gt.getAllWindows().length === 0 && wa();
});
pe.whenReady().then(async () => {
  if (Ll.handle("velo-asset", (t) => {
    const r = new URL(t.url), n = decodeURIComponent(r.pathname).replace(/^\//, "");
    let i;
    pe.isPackaged ? i = z.join(process.resourcesPath, "assets") : i = z.join(process.env.APP_ROOT || "", "public");
    const o = z.join(i, n);
    return console.log("[velo-asset protocol] Resolving:", t.url, "->", o), cd.fetch(dd(o).href);
  }), process.platform === "darwin" && !pe.isPackaged) {
    const t = z.join(process.env.APP_ROOT || "", "icons", "icons", "mac", "icon.icns");
    try {
      const r = Ul.createFromPath(t);
      !r.isEmpty() && pe.dock && pe.dock.setIcon(r);
    } catch (r) {
      console.warn("Failed to set dock icon:", r);
    }
  }
  const { ipcMain: e } = await import("electron");
  e.on("hud-overlay-close", () => {
    pe.quit();
  }), e.on("auth-ready", () => {
    We && !We.isDestroyed() && (We.close(), We = null), wa();
  }), Fl(), xl(), await V_(), _d(
    X_,
    K_,
    () => be,
    () => Nr,
    (t, r) => {
      tf = r, sr || Fl(), xl(t), t || be && be.restore();
    }
  ), We = vd(), We.on("closed", () => {
    We = null;
  }), Dr && setTimeout(() => {
    Dr && (Zu(Dr), Dr = null);
  }, 1500), G_();
});
export {
  gT as MAIN_DIST,
  ar as RECORDINGS_DIR,
  ef as RENDERER_DIST,
  Y_ as VITE_DEV_SERVER_URL
};
