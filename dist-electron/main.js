import jt, { ipcMain as Q, screen as ht, BrowserWindow as ot, desktopCapturer as ld, shell as cd, app as me, dialog as Xn, protocol as Ul, nativeImage as kl, net as ud, systemPreferences as ji, Tray as fd, Menu as dd } from "electron";
import { fileURLToPath as Ml, pathToFileURL as hd } from "node:url";
import z from "node:path";
import Zt from "node:fs/promises";
import St from "fs";
import pd from "constants";
import Zr from "stream";
import Mo from "util";
import Bl from "assert";
import ie from "path";
import li from "child_process";
import jl from "events";
import en from "crypto";
import Hl from "tty";
import ci from "os";
import Ct from "url";
import md from "string_decoder";
import ql from "zlib";
import gd from "http";
const tn = z.dirname(Ml(import.meta.url)), yd = z.join(tn, ".."), Et = process.env.VITE_DEV_SERVER_URL, ui = z.join(yd, "dist");
let cr = null;
Q.on("hud-overlay-hide", () => {
  cr && !cr.isDestroyed() && cr.minimize();
});
function Ed() {
  const e = ht.getPrimaryDisplay(), { workArea: t } = e, r = 1e3, n = 100, i = Math.floor(t.x + (t.width - r) / 2), o = Math.floor(t.y + t.height - n - 5), a = new ot({
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
  }), cr = a, a.on("closed", () => {
    cr === a && (cr = null);
  }), Et ? a.loadURL(Et + "?windowType=hud-overlay") : a.loadFile(z.join(ui, "index.html"), {
    query: { windowType: "hud-overlay" }
  }), a;
}
function wd() {
  const e = process.platform === "darwin", t = new ot({
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
function vd() {
  const { width: e, height: t } = ht.getPrimaryDisplay().workAreaSize, r = new ot({
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
function _d() {
  const { width: e, height: t } = ht.getPrimaryDisplay().workAreaSize, r = new ot({
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
let Sn = null, Cn = !1, br = [], bn = 0, Rn = null;
function Ad(e, t, r, n, i) {
  Q.handle("get-sources", async (a, s) => (await ld.getSources(s)).map((d) => ({
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
      const d = z.join(sr, l);
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
      const s = (await Zt.readdir(sr)).filter((c) => c.endsWith(".webm"));
      if (s.length === 0)
        return { success: !1, message: "No recorded video found" };
      const l = s.sort().reverse()[0];
      return { success: !0, path: z.join(sr, l) };
    } catch (a) {
      return console.error("Failed to get video path:", a), { success: !1, message: "Failed to get video path", error: String(a) };
    }
  }), Q.handle("set-recording-state", (a, s) => {
    i && i(s, (Sn || { name: "Screen" }).name);
  }), Q.handle("open-external-url", async (a, s) => {
    try {
      return await cd.openExternal(s), { success: !0 };
    } catch (l) {
      return console.error("Failed to open URL:", l), { success: !1, error: String(l) };
    }
  }), Q.handle("get-asset-base-path", () => {
    try {
      return me.isPackaged ? z.join(process.resourcesPath, "assets") : z.join(me.getAppPath(), "public");
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
        defaultPath: z.join(me.getPath("downloads"), l),
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
        defaultPath: sr,
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
    const a = ht.getPrimaryDisplay(), { width: s, height: l } = a.size;
    return br = [], bn = Date.now(), Cn = !0, Rn = setInterval(() => {
      if (!Cn) return;
      const d = ht.getCursorScreenPoint(), c = Date.now() - bn;
      br.push({
        x: d.x / s,
        y: d.y / l,
        timestamp: c,
        type: "move"
      });
    }, 33), { success: !0, screenWidth: s, screenHeight: l };
  }), Q.handle("stop-cursor-tracking", () => {
    Cn = !1, Rn && (clearInterval(Rn), Rn = null);
    const a = Date.now() - bn, s = ht.getPrimaryDisplay(), { width: l, height: d } = s.size, c = {
      events: br,
      screenWidth: l,
      screenHeight: d,
      duration: a
    };
    return br = [], c;
  }), Q.handle("record-cursor-click", (a, s) => {
    if (!Cn) return { success: !1 };
    const l = ht.getPrimaryDisplay(), { width: d, height: c } = l.size, f = ht.getCursorScreenPoint(), h = Date.now() - bn;
    return br.push({
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
var $e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Me = {}, qt = {}, Oe = {};
Oe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Oe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var ft = pd, Td = process.cwd, Wn = null, Sd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Wn || (Wn = Td.call(process)), Wn;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Ma = process.chdir;
  process.chdir = function(e) {
    Wn = null, Ma.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Ma);
}
var Cd = bd;
function bd(e) {
  ft.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Sd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(h, g, w) {
      var E = Date.now(), A = 0;
      c(h, g, function S(T) {
        if (T && (T.code === "EACCES" || T.code === "EPERM" || T.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(g, function(D, x) {
              D && D.code === "ENOENT" ? c(h, g, S) : w(T);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        w && w(T);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(h, g, w, E, A, S) {
      var T;
      if (S && typeof S == "function") {
        var D = 0;
        T = function(x, ee, se) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, c.call(e, h, g, w, E, A, T);
          S.apply(this, arguments);
        };
      }
      return c.call(e, h, g, w, E, A, T);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, h, g, w, E) {
      for (var A = 0; ; )
        try {
          return c.call(e, f, h, g, w, E);
        } catch (S) {
          if (S.code === "EAGAIN" && A < 10) {
            A++;
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
        ft.O_WRONLY | ft.O_SYMLINK,
        h,
        function(w, E) {
          if (w) {
            g && g(w);
            return;
          }
          c.fchmod(E, h, function(A) {
            c.close(E, function(S) {
              g && g(A || S);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, h) {
      var g = c.openSync(f, ft.O_WRONLY | ft.O_SYMLINK, h), w = !0, E;
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
    ft.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, g, w) {
      c.open(f, ft.O_SYMLINK, function(E, A) {
        if (E) {
          w && w(E);
          return;
        }
        c.futimes(A, h, g, function(S) {
          c.close(A, function(T) {
            w && w(S || T);
          });
        });
      });
    }, c.lutimesSync = function(f, h, g) {
      var w = c.openSync(f, ft.O_SYMLINK), E, A = !0;
      try {
        E = c.futimesSync(w, h, g), A = !1;
      } finally {
        if (A)
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
      function w(E, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), g && g.apply(this, arguments);
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
var Ba = Zr.Stream, Rd = $d;
function $d(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Ba.call(this);
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
    Ba.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Pd = Od, Id = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Od(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Id(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ne = St, Dd = Cd, Nd = Rd, Fd = Pd, $n = Mo, we, Kn;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (we = Symbol.for("graceful-fs.queue"), Kn = Symbol.for("graceful-fs.previous")) : (we = "___graceful-fs.queue", Kn = "___graceful-fs.previous");
function xd() {
}
function Gl(e, t) {
  Object.defineProperty(e, we, {
    get: function() {
      return t;
    }
  });
}
var Mt = xd;
$n.debuglog ? Mt = $n.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Mt = function() {
  var e = $n.format.apply($n, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ne[we]) {
  var Ld = $e[we] || [];
  Gl(ne, Ld), ne.close = function(e) {
    function t(r, n) {
      return e.call(ne, r, function(i) {
        i || ja(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Kn, {
      value: e
    }), t;
  }(ne.close), ne.closeSync = function(e) {
    function t(r) {
      e.apply(ne, arguments), ja();
    }
    return Object.defineProperty(t, Kn, {
      value: e
    }), t;
  }(ne.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Mt(ne[we]), Bl.equal(ne[we].length, 0);
  });
}
$e[we] || Gl($e, ne[we]);
var De = Bo(Fd(ne));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ne.__patched && (De = Bo(ne), ne.__patched = !0);
function Bo(e) {
  Dd(e), e.gracefulify = Bo, e.createReadStream = ee, e.createWriteStream = se;
  var t = e.readFile;
  e.readFile = r;
  function r(y, q, B) {
    return typeof q == "function" && (B = q, q = null), M(y, q, B);
    function M(X, P, R, O) {
      return t(X, P, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? zt([M, [X, P, R], b, O || Date.now(), Date.now()]) : typeof R == "function" && R.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(y, q, B, M);
    function X(P, R, O, b, N) {
      return n(P, R, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, R, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(y, q, B, M);
    function X(P, R, O, b, N) {
      return o(P, R, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, R, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(y, q, B, M) {
    return typeof B == "function" && (M = B, B = 0), X(y, q, B, M);
    function X(P, R, O, b, N) {
      return s(P, R, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, R, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(y, q, B) {
    typeof q == "function" && (B = q, q = null);
    var M = c.test(process.version) ? function(R, O, b, N) {
      return d(R, X(
        R,
        O,
        b,
        N
      ));
    } : function(R, O, b, N) {
      return d(R, O, X(
        R,
        O,
        b,
        N
      ));
    };
    return M(y, q, B);
    function X(P, R, O, b) {
      return function(N, I) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? zt([
          M,
          [P, R, O],
          N,
          b || Date.now(),
          Date.now()
        ]) : (I && I.sort && I.sort(), typeof O == "function" && O.call(this, N, I));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Nd(e);
    S = h.ReadStream, D = h.WriteStream;
  }
  var g = e.ReadStream;
  g && (S.prototype = Object.create(g.prototype), S.prototype.open = T);
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
  var A = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(y) {
      A = y;
    },
    enumerable: !0,
    configurable: !0
  });
  function S(y, q) {
    return this instanceof S ? (g.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments);
  }
  function T() {
    var y = this;
    Ue(y.path, y.flags, y.mode, function(q, B) {
      q ? (y.autoClose && y.destroy(), y.emit("error", q)) : (y.fd = B, y.emit("open", B), y.read());
    });
  }
  function D(y, q) {
    return this instanceof D ? (w.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
    var y = this;
    Ue(y.path, y.flags, y.mode, function(q, B) {
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
  e.open = Ue;
  function Ue(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(y, q, B, M);
    function X(P, R, O, b, N) {
      return V(P, R, O, function(I, k) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, R, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function zt(e) {
  Mt("ENQUEUE", e[0].name, e[1]), ne[we].push(e), jo();
}
var Pn;
function ja() {
  for (var e = Date.now(), t = 0; t < ne[we].length; ++t)
    ne[we][t].length > 2 && (ne[we][t][3] = e, ne[we][t][4] = e);
  jo();
}
function jo() {
  if (clearTimeout(Pn), Pn = void 0, ne[we].length !== 0) {
    var e = ne[we].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Mt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Mt("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), d = Math.min(l * 1.2, 100);
      s >= d ? (Mt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ne[we].push(e);
    }
    Pn === void 0 && (Pn = setTimeout(jo, 0));
  }
}
(function(e) {
  const t = Oe.fromCallback, r = De, n = [
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
var Ho = {}, Wl = {};
const Ud = ie;
Wl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Ud.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Vl = qt, { checkPath: Yl } = Wl, zl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Ho.makeDir = async (e, t) => (Yl(e), Vl.mkdir(e, {
  mode: zl(t),
  recursive: !0
}));
Ho.makeDirSync = (e, t) => (Yl(e), Vl.mkdirSync(e, {
  mode: zl(t),
  recursive: !0
}));
const kd = Oe.fromPromise, { makeDir: Md, makeDirSync: Hi } = Ho, qi = kd(Md);
var tt = {
  mkdirs: qi,
  mkdirsSync: Hi,
  // alias
  mkdirp: qi,
  mkdirpSync: Hi,
  ensureDir: qi,
  ensureDirSync: Hi
};
const Bd = Oe.fromPromise, Xl = qt;
function jd(e) {
  return Xl.access(e).then(() => !0).catch(() => !1);
}
var Gt = {
  pathExists: Bd(jd),
  pathExistsSync: Xl.existsSync
};
const ur = De;
function Hd(e, t, r, n) {
  ur.open(e, "r+", (i, o) => {
    if (i) return n(i);
    ur.futimes(o, t, r, (a) => {
      ur.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function qd(e, t, r) {
  const n = ur.openSync(e, "r+");
  return ur.futimesSync(n, t, r), ur.closeSync(n);
}
var Kl = {
  utimesMillis: Hd,
  utimesMillisSync: qd
};
const dr = qt, ge = ie, Gd = Mo;
function Wd(e, t, r) {
  const n = r.dereference ? (i) => dr.stat(i, { bigint: !0 }) : (i) => dr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Vd(e, t, r) {
  let n;
  const i = r.dereference ? (a) => dr.statSync(a, { bigint: !0 }) : (a) => dr.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: n };
}
function Yd(e, t, r, n, i) {
  Gd.callbackify(Wd)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (rn(s, l)) {
        const d = ge.basename(e), c = ge.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && qo(e, t) ? i(new Error(fi(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function zd(e, t, r, n) {
  const { srcStat: i, destStat: o } = Vd(e, t, n);
  if (o) {
    if (rn(i, o)) {
      const a = ge.basename(e), s = ge.basename(t);
      if (r === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && qo(e, t))
    throw new Error(fi(e, t, r));
  return { srcStat: i, destStat: o };
}
function Jl(e, t, r, n, i) {
  const o = ge.resolve(ge.dirname(e)), a = ge.resolve(ge.dirname(r));
  if (a === o || a === ge.parse(a).root) return i();
  dr.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : rn(t, l) ? i(new Error(fi(e, r, n))) : Jl(e, t, a, n, i));
}
function Ql(e, t, r, n) {
  const i = ge.resolve(ge.dirname(e)), o = ge.resolve(ge.dirname(r));
  if (o === i || o === ge.parse(o).root) return;
  let a;
  try {
    a = dr.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (rn(t, a))
    throw new Error(fi(e, r, n));
  return Ql(e, t, o, n);
}
function rn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function qo(e, t) {
  const r = ge.resolve(e).split(ge.sep).filter((i) => i), n = ge.resolve(t).split(ge.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function fi(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var gr = {
  checkPaths: Yd,
  checkPathsSync: zd,
  checkParentPaths: Jl,
  checkParentPathsSync: Ql,
  isSrcSubdir: qo,
  areIdentical: rn
};
const xe = De, kr = ie, Xd = tt.mkdirs, Kd = Gt.pathExists, Jd = Kl.utimesMillis, Mr = gr;
function Qd(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Mr.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    Mr.checkParentPaths(e, a, t, "copy", (l) => l ? n(l) : r.filter ? Zl(Ha, s, e, t, r, n) : Ha(s, e, t, r, n));
  });
}
function Ha(e, t, r, n, i) {
  const o = kr.dirname(r);
  Kd(o, (a, s) => {
    if (a) return i(a);
    if (s) return Jn(e, t, r, n, i);
    Xd(o, (l) => l ? i(l) : Jn(e, t, r, n, i));
  });
}
function Zl(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function Zd(e, t, r, n, i) {
  return n.filter ? Zl(Jn, e, t, r, n, i) : Jn(e, t, r, n, i);
}
function Jn(e, t, r, n, i) {
  (n.dereference ? xe.stat : xe.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? ah(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? eh(s, e, t, r, n, i) : s.isSymbolicLink() ? ch(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function eh(e, t, r, n, i, o) {
  return t ? th(e, r, n, i, o) : ec(e, r, n, i, o);
}
function th(e, t, r, n, i) {
  if (n.overwrite)
    xe.unlink(r, (o) => o ? i(o) : ec(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function ec(e, t, r, n, i) {
  xe.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? rh(e.mode, t, r, i) : di(r, e.mode, i));
}
function rh(e, t, r, n) {
  return nh(e) ? ih(r, e, (i) => i ? n(i) : qa(e, t, r, n)) : qa(e, t, r, n);
}
function nh(e) {
  return (e & 128) === 0;
}
function ih(e, t, r) {
  return di(e, t | 128, r);
}
function qa(e, t, r, n) {
  oh(t, r, (i) => i ? n(i) : di(r, e, n));
}
function di(e, t, r) {
  return xe.chmod(e, t, r);
}
function oh(e, t, r) {
  xe.stat(e, (n, i) => n ? r(n) : Jd(t, i.atime, i.mtime, r));
}
function ah(e, t, r, n, i, o) {
  return t ? tc(r, n, i, o) : sh(e.mode, r, n, i, o);
}
function sh(e, t, r, n, i) {
  xe.mkdir(r, (o) => {
    if (o) return i(o);
    tc(t, r, n, (a) => a ? i(a) : di(r, e, i));
  });
}
function tc(e, t, r, n) {
  xe.readdir(e, (i, o) => i ? n(i) : rc(o, e, t, r, n));
}
function rc(e, t, r, n, i) {
  const o = e.pop();
  return o ? lh(e, o, t, r, n, i) : i();
}
function lh(e, t, r, n, i, o) {
  const a = kr.join(r, t), s = kr.join(n, t);
  Mr.checkPaths(a, s, "copy", i, (l, d) => {
    if (l) return o(l);
    const { destStat: c } = d;
    Zd(c, a, s, i, (f) => f ? o(f) : rc(e, r, n, i, o));
  });
}
function ch(e, t, r, n, i) {
  xe.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = kr.resolve(process.cwd(), a)), e)
      xe.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? xe.symlink(a, r, i) : i(s) : (n.dereference && (l = kr.resolve(process.cwd(), l)), Mr.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Mr.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : uh(a, r, i)));
    else
      return xe.symlink(a, r, i);
  });
}
function uh(e, t, r) {
  xe.unlink(t, (n) => n ? r(n) : xe.symlink(e, t, r));
}
var fh = Qd;
const Te = De, Br = ie, dh = tt.mkdirsSync, hh = Kl.utimesMillisSync, jr = gr;
function ph(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = jr.checkPathsSync(e, t, "copy", r);
  return jr.checkParentPathsSync(e, n, t, "copy"), mh(i, e, t, r);
}
function mh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Br.dirname(r);
  return Te.existsSync(i) || dh(i), nc(e, t, r, n);
}
function gh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return nc(e, t, r, n);
}
function nc(e, t, r, n) {
  const o = (n.dereference ? Te.statSync : Te.lstatSync)(t);
  if (o.isDirectory()) return Th(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return yh(o, e, t, r, n);
  if (o.isSymbolicLink()) return bh(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function yh(e, t, r, n, i) {
  return t ? Eh(e, r, n, i) : ic(e, r, n, i);
}
function Eh(e, t, r, n) {
  if (n.overwrite)
    return Te.unlinkSync(r), ic(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function ic(e, t, r, n) {
  return Te.copyFileSync(t, r), n.preserveTimestamps && wh(e.mode, t, r), Go(r, e.mode);
}
function wh(e, t, r) {
  return vh(e) && _h(r, e), Ah(t, r);
}
function vh(e) {
  return (e & 128) === 0;
}
function _h(e, t) {
  return Go(e, t | 128);
}
function Go(e, t) {
  return Te.chmodSync(e, t);
}
function Ah(e, t) {
  const r = Te.statSync(e);
  return hh(t, r.atime, r.mtime);
}
function Th(e, t, r, n, i) {
  return t ? oc(r, n, i) : Sh(e.mode, r, n, i);
}
function Sh(e, t, r, n) {
  return Te.mkdirSync(r), oc(t, r, n), Go(r, e);
}
function oc(e, t, r) {
  Te.readdirSync(e).forEach((n) => Ch(n, e, t, r));
}
function Ch(e, t, r, n) {
  const i = Br.join(t, e), o = Br.join(r, e), { destStat: a } = jr.checkPathsSync(i, o, "copy", n);
  return gh(a, i, o, n);
}
function bh(e, t, r, n) {
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
    return Rh(i, r);
  } else
    return Te.symlinkSync(i, r);
}
function Rh(e, t) {
  return Te.unlinkSync(t), Te.symlinkSync(e, t);
}
var $h = ph;
const Ph = Oe.fromCallback;
var Wo = {
  copy: Ph(fh),
  copySync: $h
};
const Ga = De, ac = ie, J = Bl, Hr = process.platform === "win32";
function sc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Ga[r], r = r + "Sync", e[r] = e[r] || Ga[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Vo(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J.strictEqual(typeof r, "function", "rimraf: callback function required"), J(t, "rimraf: invalid options argument provided"), J.strictEqual(typeof t, "object", "rimraf: options should be object"), sc(t), Wa(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => Wa(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function Wa(e, t, r) {
  J(e), J(t), J(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Hr)
      return Va(e, t, n, r);
    if (i && i.isDirectory())
      return Vn(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return Hr ? Va(e, t, o, r) : Vn(e, t, o, r);
        if (o.code === "EISDIR")
          return Vn(e, t, o, r);
      }
      return r(o);
    });
  });
}
function Va(e, t, r, n) {
  J(e), J(t), J(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? Vn(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Ya(e, t, r) {
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
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Ih(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Ih(e, t, r) {
  J(e), J(t), J(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      Vo(ac.join(e, s), t, (l) => {
        if (!a) {
          if (l) return r(a = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function lc(e, t) {
  let r;
  t = t || {}, sc(t), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J(t, "rimraf: missing options"), J.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Hr && Ya(e, t, n);
  }
  try {
    r && r.isDirectory() ? Yn(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Hr ? Ya(e, t, n) : Yn(e, t, n);
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
      Oh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Oh(e, t) {
  if (J(e), J(t), t.readdirSync(e).forEach((r) => lc(ac.join(e, r), t)), Hr) {
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
var Dh = Vo;
Vo.sync = lc;
const Qn = De, Nh = Oe.fromCallback, cc = Dh;
function Fh(e, t) {
  if (Qn.rm) return Qn.rm(e, { recursive: !0, force: !0 }, t);
  cc(e, t);
}
function xh(e) {
  if (Qn.rmSync) return Qn.rmSync(e, { recursive: !0, force: !0 });
  cc.sync(e);
}
var hi = {
  remove: Nh(Fh),
  removeSync: xh
};
const Lh = Oe.fromPromise, uc = qt, fc = ie, dc = tt, hc = hi, za = Lh(async function(t) {
  let r;
  try {
    r = await uc.readdir(t);
  } catch {
    return dc.mkdirs(t);
  }
  return Promise.all(r.map((n) => hc.remove(fc.join(t, n))));
});
function Xa(e) {
  let t;
  try {
    t = uc.readdirSync(e);
  } catch {
    return dc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = fc.join(e, r), hc.removeSync(r);
  });
}
var Uh = {
  emptyDirSync: Xa,
  emptydirSync: Xa,
  emptyDir: za,
  emptydir: za
};
const kh = Oe.fromCallback, pc = ie, mt = De, mc = tt;
function Mh(e, t) {
  function r() {
    mt.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  mt.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = pc.dirname(e);
    mt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? mc.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(a);
      s.isDirectory() ? r() : mt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Bh(e) {
  let t;
  try {
    t = mt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = pc.dirname(e);
  try {
    mt.statSync(r).isDirectory() || mt.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") mc.mkdirsSync(r);
    else throw n;
  }
  mt.writeFileSync(e, "");
}
var jh = {
  createFile: kh(Mh),
  createFileSync: Bh
};
const Hh = Oe.fromCallback, gc = ie, pt = De, yc = tt, qh = Gt.pathExists, { areIdentical: Ec } = gr;
function Gh(e, t, r) {
  function n(i, o) {
    pt.link(i, o, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  pt.lstat(t, (i, o) => {
    pt.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (o && Ec(s, o)) return r(null);
      const l = gc.dirname(t);
      qh(l, (d, c) => {
        if (d) return r(d);
        if (c) return n(e, t);
        yc.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function Wh(e, t) {
  let r;
  try {
    r = pt.lstatSync(t);
  } catch {
  }
  try {
    const o = pt.lstatSync(e);
    if (r && Ec(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = gc.dirname(t);
  return pt.existsSync(n) || yc.mkdirsSync(n), pt.linkSync(e, t);
}
var Vh = {
  createLink: Hh(Gh),
  createLinkSync: Wh
};
const gt = ie, Fr = De, Yh = Gt.pathExists;
function zh(e, t, r) {
  if (gt.isAbsolute(e))
    return Fr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = gt.dirname(t), i = gt.join(n, e);
    return Yh(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : Fr.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: gt.relative(n, e)
    })));
  }
}
function Xh(e, t) {
  let r;
  if (gt.isAbsolute(e)) {
    if (r = Fr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = gt.dirname(t), i = gt.join(n, e);
    if (r = Fr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Fr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: gt.relative(n, e)
    };
  }
}
var Kh = {
  symlinkPaths: zh,
  symlinkPathsSync: Xh
};
const wc = De;
function Jh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  wc.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Qh(e, t) {
  let r;
  if (t) return t;
  try {
    r = wc.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Zh = {
  symlinkType: Jh,
  symlinkTypeSync: Qh
};
const ep = Oe.fromCallback, vc = ie, Ve = qt, _c = tt, tp = _c.mkdirs, rp = _c.mkdirsSync, Ac = Kh, np = Ac.symlinkPaths, ip = Ac.symlinkPathsSync, Tc = Zh, op = Tc.symlinkType, ap = Tc.symlinkTypeSync, sp = Gt.pathExists, { areIdentical: Sc } = gr;
function lp(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ve.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ve.stat(e),
      Ve.stat(t)
    ]).then(([a, s]) => {
      if (Sc(a, s)) return n(null);
      Ka(e, t, r, n);
    }) : Ka(e, t, r, n);
  });
}
function Ka(e, t, r, n) {
  np(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, op(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const l = vc.dirname(t);
      sp(l, (d, c) => {
        if (d) return n(d);
        if (c) return Ve.symlink(e, t, s, n);
        tp(l, (f) => {
          if (f) return n(f);
          Ve.symlink(e, t, s, n);
        });
      });
    });
  });
}
function cp(e, t, r) {
  let n;
  try {
    n = Ve.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = Ve.statSync(e), l = Ve.statSync(t);
    if (Sc(s, l)) return;
  }
  const i = ip(e, t);
  e = i.toDst, r = ap(i.toCwd, r);
  const o = vc.dirname(t);
  return Ve.existsSync(o) || rp(o), Ve.symlinkSync(e, t, r);
}
var up = {
  createSymlink: ep(lp),
  createSymlinkSync: cp
};
const { createFile: Ja, createFileSync: Qa } = jh, { createLink: Za, createLinkSync: es } = Vh, { createSymlink: ts, createSymlinkSync: rs } = up;
var fp = {
  // file
  createFile: Ja,
  createFileSync: Qa,
  ensureFile: Ja,
  ensureFileSync: Qa,
  // link
  createLink: Za,
  createLinkSync: es,
  ensureLink: Za,
  ensureLinkSync: es,
  // symlink
  createSymlink: ts,
  createSymlinkSync: rs,
  ensureSymlink: ts,
  ensureSymlinkSync: rs
};
function dp(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function hp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Yo = { stringify: dp, stripBom: hp };
let hr;
try {
  hr = De;
} catch {
  hr = St;
}
const pi = Oe, { stringify: Cc, stripBom: bc } = Yo;
async function pp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || hr, n = "throws" in t ? t.throws : !0;
  let i = await pi.fromCallback(r.readFile)(e, t);
  i = bc(i);
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
const mp = pi.fromPromise(pp);
function gp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || hr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = bc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function yp(e, t, r = {}) {
  const n = r.fs || hr, i = Cc(t, r);
  await pi.fromCallback(n.writeFile)(e, i, r);
}
const Ep = pi.fromPromise(yp);
function wp(e, t, r = {}) {
  const n = r.fs || hr, i = Cc(t, r);
  return n.writeFileSync(e, i, r);
}
var vp = {
  readFile: mp,
  readFileSync: gp,
  writeFile: Ep,
  writeFileSync: wp
};
const In = vp;
var _p = {
  // jsonfile exports
  readJson: In.readFile,
  readJsonSync: In.readFileSync,
  writeJson: In.writeFile,
  writeJsonSync: In.writeFileSync
};
const Ap = Oe.fromCallback, xr = De, Rc = ie, $c = tt, Tp = Gt.pathExists;
function Sp(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Rc.dirname(e);
  Tp(i, (o, a) => {
    if (o) return n(o);
    if (a) return xr.writeFile(e, t, r, n);
    $c.mkdirs(i, (s) => {
      if (s) return n(s);
      xr.writeFile(e, t, r, n);
    });
  });
}
function Cp(e, ...t) {
  const r = Rc.dirname(e);
  if (xr.existsSync(r))
    return xr.writeFileSync(e, ...t);
  $c.mkdirsSync(r), xr.writeFileSync(e, ...t);
}
var zo = {
  outputFile: Ap(Sp),
  outputFileSync: Cp
};
const { stringify: bp } = Yo, { outputFile: Rp } = zo;
async function $p(e, t, r = {}) {
  const n = bp(t, r);
  await Rp(e, n, r);
}
var Pp = $p;
const { stringify: Ip } = Yo, { outputFileSync: Op } = zo;
function Dp(e, t, r) {
  const n = Ip(t, r);
  Op(e, n, r);
}
var Np = Dp;
const Fp = Oe.fromPromise, Ie = _p;
Ie.outputJson = Fp(Pp);
Ie.outputJsonSync = Np;
Ie.outputJSON = Ie.outputJson;
Ie.outputJSONSync = Ie.outputJsonSync;
Ie.writeJSON = Ie.writeJson;
Ie.writeJSONSync = Ie.writeJsonSync;
Ie.readJSON = Ie.readJson;
Ie.readJSONSync = Ie.readJsonSync;
var xp = Ie;
const Lp = De, To = ie, Up = Wo.copy, Pc = hi.remove, kp = tt.mkdirp, Mp = Gt.pathExists, ns = gr;
function Bp(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  ns.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ns.checkParentPaths(e, s, t, "move", (d) => {
      if (d) return n(d);
      if (jp(t)) return is(e, t, i, l, n);
      kp(To.dirname(t), (c) => c ? n(c) : is(e, t, i, l, n));
    });
  });
}
function jp(e) {
  const t = To.dirname(e);
  return To.parse(t).root === t;
}
function is(e, t, r, n, i) {
  if (n) return Gi(e, t, r, i);
  if (r)
    return Pc(t, (o) => o ? i(o) : Gi(e, t, r, i));
  Mp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Gi(e, t, r, i));
}
function Gi(e, t, r, n) {
  Lp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Hp(e, t, r, n) : n());
}
function Hp(e, t, r, n) {
  Up(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : Pc(e, n));
}
var qp = Bp;
const Ic = De, So = ie, Gp = Wo.copySync, Oc = hi.removeSync, Wp = tt.mkdirpSync, os = gr;
function Vp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = os.checkPathsSync(e, t, "move", r);
  return os.checkParentPathsSync(e, i, t, "move"), Yp(t) || Wp(So.dirname(t)), zp(e, t, n, o);
}
function Yp(e) {
  const t = So.dirname(e);
  return So.parse(t).root === t;
}
function zp(e, t, r, n) {
  if (n) return Wi(e, t, r);
  if (r)
    return Oc(t), Wi(e, t, r);
  if (Ic.existsSync(t)) throw new Error("dest already exists.");
  return Wi(e, t, r);
}
function Wi(e, t, r) {
  try {
    Ic.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Xp(e, t, r);
  }
}
function Xp(e, t, r) {
  return Gp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Oc(e);
}
var Kp = Vp;
const Jp = Oe.fromCallback;
var Qp = {
  move: Jp(qp),
  moveSync: Kp
}, bt = {
  // Export promiseified graceful-fs:
  ...qt,
  // Export extra methods:
  ...Wo,
  ...Uh,
  ...fp,
  ...xp,
  ...tt,
  ...Qp,
  ...zo,
  ...Gt,
  ...hi
}, Wt = {}, wt = {}, de = {}, vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.CancellationError = vt.CancellationToken = void 0;
const Zp = jl;
class em extends Zp.EventEmitter {
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
      return Promise.reject(new Co());
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
          o(new Co());
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
vt.CancellationToken = em;
class Co extends Error {
  constructor() {
    super("cancelled");
  }
}
vt.CancellationError = Co;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.newError = tm;
function tm(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Pe = {}, bo = { exports: {} }, On = { exports: {} }, Vi, as;
function rm() {
  if (as) return Vi;
  as = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Vi = function(c, f) {
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
  return Vi;
}
var Yi, ss;
function Dc() {
  if (ss) return Yi;
  ss = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = s, n.enable = o, n.enabled = l, n.humanize = rm(), n.destroy = c, Object.keys(t).forEach((f) => {
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
      function A(...S) {
        if (!A.enabled)
          return;
        const T = A, D = Number(/* @__PURE__ */ new Date()), x = D - (h || D);
        T.diff = x, T.prev = h, T.curr = D, h = D, S[0] = n.coerce(S[0]), typeof S[0] != "string" && S.unshift("%O");
        let ee = 0;
        S[0] = S[0].replace(/%([a-zA-Z%])/g, (V, Ue) => {
          if (V === "%%")
            return "%";
          ee++;
          const y = n.formatters[Ue];
          if (typeof y == "function") {
            const q = S[ee];
            V = y.call(T, q), S.splice(ee, 1), ee--;
          }
          return V;
        }), n.formatArgs.call(T, S), (T.log || n.log).apply(T, S);
      }
      return A.namespace = f, A.useColors = n.useColors(), A.color = n.selectColor(f), A.extend = i, A.destroy = n.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (w !== n.namespaces && (w = n.namespaces, E = n.enabled(f)), E),
        set: (S) => {
          g = S;
        }
      }), typeof n.init == "function" && n.init(A), A;
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
      let g = 0, w = 0, E = -1, A = 0;
      for (; g < f.length; )
        if (w < h.length && (h[w] === f[g] || h[w] === "*"))
          h[w] === "*" ? (E = w, A = g, w++) : (g++, w++);
        else if (E !== -1)
          w = E + 1, A++, g = A;
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
  return Yi = e, Yi;
}
var ls;
function nm() {
  return ls || (ls = 1, function(e, t) {
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
    e.exports = Dc()(t);
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
var Dn = { exports: {} }, zi, cs;
function im() {
  return cs || (cs = 1, zi = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), zi;
}
var Xi, us;
function om() {
  if (us) return Xi;
  us = 1;
  const e = ci, t = Hl, r = im(), { env: n } = process;
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
  return Xi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Xi;
}
var fs;
function am() {
  return fs || (fs = 1, function(e, t) {
    const r = Hl, n = Mo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = om();
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
      const w = g.substring(6).toLowerCase().replace(/_([a-z])/g, (A, S) => S.toUpperCase());
      let E = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), h[w] = E, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: g, useColors: w } = this;
      if (w) {
        const E = this.color, A = "\x1B[3" + (E < 8 ? E : "8;5;" + E), S = `  ${A};1m${g} \x1B[0m`;
        h[0] = S + h[0].split(`
`).join(`
` + S), h.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
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
    e.exports = Dc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(Dn, Dn.exports)), Dn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? bo.exports = nm() : bo.exports = am();
var sm = bo.exports, nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.ProgressCallbackTransform = void 0;
const lm = Zr;
class cm extends lm.Transform {
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
nn.ProgressCallbackTransform = cm;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.DigestTransform = Pe.HttpExecutor = Pe.HttpError = void 0;
Pe.createHttpError = $o;
Pe.parseJson = ym;
Pe.configureRequestOptionsFromUrl = Fc;
Pe.configureRequestUrl = Ko;
Pe.safeGetHeader = fr;
Pe.configureRequestOptions = Zn;
Pe.safeStringifyJson = ei;
const um = en, fm = sm, dm = St, hm = Zr, Ro = Ct, pm = vt, ds = yr, mm = nn, Nt = (0, fm.default)("electron-builder");
function $o(e, t = null) {
  return new Xo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ei(e.headers), t);
}
const gm = /* @__PURE__ */ new Map([
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
class Xo extends Error {
  constructor(t, r = `HTTP error: ${gm.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Pe.HttpError = Xo;
function ym(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class tr {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new pm.CancellationToken(), n) {
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
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, f = fr(t, "location");
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
          const g = fr(t, "content-type"), w = g != null && (Array.isArray(g) ? g.find((E) => E.includes("json")) != null : g.includes("json"));
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
      Ko(t, s), Zn(s), this.doDownload(s, {
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
      const a = fr(o, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(tr.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? wm(r, o) : r.responseHandler(o, r.callback);
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
    const n = Fc(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = tr.reconstructOriginalUrl(r), a = Nc(t, r);
      tr.isCrossOriginRedirect(o, a) && (Nt.enabled && Nt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new Ro.URL(`${r}//${n}${i}${o}`);
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
        if (n < r && (i instanceof Xo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Pe.HttpExecutor = tr;
function Nc(e, t) {
  try {
    return new Ro.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${n}//${r}${i}`;
    return new Ro.URL(e, o);
  }
}
function Fc(e, t) {
  const r = Zn(t), n = Nc(e, t);
  return Ko(n, r), r;
}
function Ko(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Po extends hm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, um.createHash)(r);
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
      throw (0, ds.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ds.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Pe.DigestTransform = Po;
function Em(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function fr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function wm(e, t) {
  if (!Em(fr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = fr(t, "content-length");
    a != null && r.push(new mm.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Po(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Po(e.options.sha2, "sha256", "hex"));
  const i = (0, dm.createWriteStream)(e.destination);
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
class vm {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && xc(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
mi.MemoLazy = vm;
function xc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => xc(e[a], t[a]));
  }
  return e === t;
}
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.githubUrl = _m;
on.githubTagPrefix = Am;
on.getS3LikeProviderBaseUrl = Tm;
function _m(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Am(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Tm(e) {
  const t = e.provider;
  if (t === "s3")
    return Sm(e);
  if (t === "spaces")
    return Cm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Sm(e) {
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
  return Lc(t, e.path);
}
function Lc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Cm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Lc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
Jo.retry = Uc;
const bm = vt;
async function Uc(e, t) {
  var r;
  const { retries: n, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new bm.CancellationToken() } = t;
  try {
    return await e();
  } catch (d) {
    if (await Promise.resolve((r = s == null ? void 0 : s(d)) !== null && r !== void 0 ? r : !0) && n > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await Uc(e, { ...t, retries: n - 1, attempt: a + 1 });
    throw d;
  }
}
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.parseDn = Rm;
function Rm(e) {
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
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.nil = pr.UUID = void 0;
const kc = en, Mc = yr, $m = "options.name must be either a string or a Buffer", hs = (0, kc.randomBytes)(16);
hs[0] = hs[0] | 1;
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
    return Pm(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Im(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (zn[t[14] + t[15]] & 240) >> 4,
        variant: ps((zn[t[19] + t[20]] & 224) >> 5),
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
        variant: ps((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Mc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
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
pr.UUID = Ht;
Ht.OID = Ht.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function ps(e) {
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
function Pm(e, t, r, n, i = Lr.ASCII) {
  const o = (0, kc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Mc.newError)($m, "ERR_INVALID_UUID_NAME");
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
function Im(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
pr.nil = new Ht("00000000-0000-0000-0000-000000000000");
var an = {}, Bc = {};
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
              R(p, "Max buffer length exceeded: " + r[_]);
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
          var u = md.StringDecoder;
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
    var f = "[CDATA[", h = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", E = { xml: g, xmlns: w }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, T = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
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
    function Ue(p, u) {
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
    function R(p, u) {
      return X(p), p.trackPosition && (u += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), u = new Error(u), p.error = u, B(p, "onerror", u), p;
    }
    function O(p) {
      return p.sawRoot && !p.closedRoot && b(p, "Unclosed root tag"), p.state !== y.BEGIN && p.state !== y.BEGIN_WHITESPACE && p.state !== y.TEXT && R(p, "Unexpected end"), X(p), p.c = "", p.closed = !0, B(p, "onend"), n.call(p, p.strict, p.opt), p;
    }
    function b(p, u) {
      if (typeof p != "object" || !(p instanceof n))
        throw new Error("bad call to strictFail");
      p.strict && R(p, u);
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
          var ye = p.attribList[te], _e = ye[0], st = ye[1], fe = I(_e, !0), He = fe.prefix, Ni = fe.local, pn = He === "" ? "" : C.ns[He] || "", _r = {
            name: _e,
            value: st,
            prefix: He,
            local: Ni,
            uri: pn
          };
          He && He !== "xmlns" && !pn && (b(p, "Unbound namespace prefix: " + JSON.stringify(He)), _r.uri = He), p.tag.attributes[_e] = _r, M(p, "onattribute", _r);
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
        var ye = {};
        for (var _e in oe.ns)
          ye[_e] = oe.ns[_e];
        var st = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && oe.ns !== st.ns && Object.keys(oe.ns).forEach(function(fe) {
          var He = oe.ns[fe];
          M(p, "onclosenamespace", { prefix: fe, uri: He });
        });
      }
      u === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = y.TEXT;
    }
    function K(p) {
      var u = p.entity, C = u.toLowerCase(), _, Y = "";
      return p.ENTITIES[u] ? p.ENTITIES[u] : p.ENTITIES[C] ? p.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), Y = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), Y = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || Y.toLowerCase() !== u ? (b(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(_));
    }
    function he(p, u) {
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
        return R(
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
            he(u, _);
            continue;
          case y.BEGIN_WHITESPACE:
            he(u, _);
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
            else if (!x(_)) if (V(A, _))
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
            _ === ">" ? G(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : V(A, _) ? (u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : b(u, "Invalid attribute name");
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
              }), u.attribName = "", _ === ">" ? G(u) : V(A, _) ? (u.attribName = _, u.state = y.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (x(_))
              continue;
            ee(_) ? (u.q = _, u.state = y.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || R(u, "Unquoted attribute value"), u.state = y.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            k(u), u.q = "", u.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            x(_) ? u.state = y.ATTRIB : _ === ">" ? G(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : V(A, _) ? (b(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : b(u, "Invalid attribute name");
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
              Ue(A, _) ? u.script ? (u.script += "</" + _, u.state = y.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = _;
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
            var oe, ye;
            switch (u.state) {
              case y.TEXT_ENTITY:
                oe = y.TEXT, ye = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                oe = y.ATTRIB_VALUE_QUOTED, ye = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                oe = y.ATTRIB_VALUE_UNQUOTED, ye = "attribValue";
                break;
            }
            if (_ === ";") {
              var _e = K(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(_e) ? (u.entity = "", u.state = oe, u.write(_e)) : (u[ye] += _e, u.entity = "", u.state = oe);
            } else V(u.entity.length ? D : T, _) ? u.entity += _ : (b(u, "Invalid character in entity name"), u[ye] += "&" + u.entity + _, u.entity = "", u.state = oe);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, u = Math.floor, C = function() {
        var _ = 16384, Y = [], te, oe, ye = -1, _e = arguments.length;
        if (!_e)
          return "";
        for (var st = ""; ++ye < _e; ) {
          var fe = Number(arguments[ye]);
          if (!isFinite(fe) || // `NaN`, `+Infinity`, or `-Infinity`
          fe < 0 || // not a valid Unicode code point
          fe > 1114111 || // not a valid Unicode code point
          u(fe) !== fe)
            throw RangeError("Invalid code point: " + fe);
          fe <= 65535 ? Y.push(fe) : (fe -= 65536, te = (fe >> 10) + 55296, oe = fe % 1024 + 56320, Y.push(te, oe)), (ye + 1 === _e || Y.length > _) && (st += p.apply(null, Y), Y.length = 0);
        }
        return st;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(Bc);
Object.defineProperty(an, "__esModule", { value: !0 });
an.XElement = void 0;
an.parseXml = Fm;
const Om = Bc, Nn = yr;
class jc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Nn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Nm(t))
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
      if (ms(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => ms(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
an.XElement = jc;
const Dm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Nm(e) {
  return Dm.test(e);
}
function ms(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Fm(e) {
  let t = null;
  const r = Om.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new jc(i.name);
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
  var r = yr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Pe;
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
  var s = Jo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Qo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var d = pr;
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
})(de);
var ve = {}, Zo = {}, Ye = {};
function Hc(e) {
  return typeof e > "u" || e === null;
}
function xm(e) {
  return typeof e == "object" && e !== null;
}
function Lm(e) {
  return Array.isArray(e) ? e : Hc(e) ? [] : [e];
}
function Um(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function km(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Mm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ye.isNothing = Hc;
Ye.isObject = xm;
Ye.toArray = Lm;
Ye.repeat = km;
Ye.isNegativeZero = Mm;
Ye.extend = Um;
function qc(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function qr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = qc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
qr.prototype = Object.create(Error.prototype);
qr.prototype.constructor = qr;
qr.prototype.toString = function(t) {
  return this.name + ": " + qc(this, t);
};
var sn = qr, Or = Ye;
function Ki(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function Ji(e, t) {
  return Or.repeat(" ", t - e.length) + e;
}
function Bm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    d = Ki(
      e.buffer,
      n[a - l],
      i[a - l],
      e.position - (n[a] - n[a - l]),
      f
    ), s = Or.repeat(" ", t.indent) + Ji((e.line - l + 1).toString(), c) + " | " + d.str + `
` + s;
  for (d = Ki(e.buffer, n[a], i[a], e.position, f), s += Or.repeat(" ", t.indent) + Ji((e.line + 1).toString(), c) + " | " + d.str + `
`, s += Or.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    d = Ki(
      e.buffer,
      n[a + l],
      i[a + l],
      e.position - (n[a] - n[a + l]),
      f
    ), s += Or.repeat(" ", t.indent) + Ji((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return s.replace(/\n$/, "");
}
var jm = Bm, gs = sn, Hm = [
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
], qm = [
  "scalar",
  "sequence",
  "mapping"
];
function Gm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Wm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Hm.indexOf(r) === -1)
      throw new gs('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Gm(t.styleAliases || null), qm.indexOf(this.kind) === -1)
    throw new gs('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Ne = Wm, Rr = sn, Qi = Ne;
function ys(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function Vm() {
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
function Io(e) {
  return this.extend(e);
}
Io.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof Qi)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Rr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof Qi))
      throw new Rr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Rr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Rr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof Qi))
      throw new Rr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Io.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = ys(i, "implicit"), i.compiledExplicit = ys(i, "explicit"), i.compiledTypeMap = Vm(i.compiledImplicit, i.compiledExplicit), i;
};
var Gc = Io, Ym = Ne, Wc = new Ym("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), zm = Ne, Vc = new zm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Xm = Ne, Yc = new Xm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Km = Gc, zc = new Km({
  explicit: [
    Wc,
    Vc,
    Yc
  ]
}), Jm = Ne;
function Qm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Zm() {
  return null;
}
function eg(e) {
  return e === null;
}
var Xc = new Jm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Qm,
  construct: Zm,
  predicate: eg,
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
}), tg = Ne;
function rg(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function ng(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function ig(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Kc = new tg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: rg,
  construct: ng,
  predicate: ig,
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
}), og = Ye, ag = Ne;
function sg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function lg(e) {
  return 48 <= e && e <= 55;
}
function cg(e) {
  return 48 <= e && e <= 57;
}
function ug(e) {
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
          if (!sg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!lg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!cg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function fg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function dg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !og.isNegativeZero(e);
}
var Jc = new ag("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ug,
  construct: fg,
  predicate: dg,
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
}), Qc = Ye, hg = Ne, pg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function mg(e) {
  return !(e === null || !pg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function gg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var yg = /^[-+]?[0-9]+e/;
function Eg(e, t) {
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
  else if (Qc.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), yg.test(r) ? r.replace("e", ".e") : r;
}
function wg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Qc.isNegativeZero(e));
}
var Zc = new hg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: mg,
  construct: gg,
  predicate: wg,
  represent: Eg,
  defaultStyle: "lowercase"
}), eu = zc.extend({
  implicit: [
    Xc,
    Kc,
    Jc,
    Zc
  ]
}), tu = eu, vg = Ne, ru = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), nu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function _g(e) {
  return e === null ? !1 : ru.exec(e) !== null || nu.exec(e) !== null;
}
function Ag(e) {
  var t, r, n, i, o, a, s, l = 0, d = null, c, f, h;
  if (t = ru.exec(e), t === null && (t = nu.exec(e)), t === null) throw new Error("Date resolve error");
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
var iu = new vg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: _g,
  construct: Ag,
  instanceOf: Date,
  represent: Tg
}), Sg = Ne;
function Cg(e) {
  return e === "<<" || e === null;
}
var ou = new Sg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Cg
}), bg = Ne, ea = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Rg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = ea;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function $g(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = ea, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Pg(e) {
  var t = "", r = 0, n, i, o = e.length, a = ea;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function Ig(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var au = new bg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Rg,
  construct: $g,
  predicate: Ig,
  represent: Pg
}), Og = Ne, Dg = Object.prototype.hasOwnProperty, Ng = Object.prototype.toString;
function Fg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, Ng.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Dg.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function xg(e) {
  return e !== null ? e : [];
}
var su = new Og("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Fg,
  construct: xg
}), Lg = Ne, Ug = Object.prototype.toString;
function kg(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], Ug.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Mg(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var lu = new Lg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: kg,
  construct: Mg
}), Bg = Ne, jg = Object.prototype.hasOwnProperty;
function Hg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (jg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function qg(e) {
  return e !== null ? e : {};
}
var cu = new Bg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Hg,
  construct: qg
}), ta = tu.extend({
  implicit: [
    iu,
    ou
  ],
  explicit: [
    au,
    su,
    lu,
    cu
  ]
}), Lt = Ye, uu = sn, Gg = jm, Wg = ta, _t = Object.prototype.hasOwnProperty, ti = 1, fu = 2, du = 3, ri = 4, Zi = 1, Vg = 2, Es = 3, Yg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, zg = /[\x85\u2028\u2029]/, Xg = /[,\[\]\{\}]/, hu = /^(?:!|!!|![a-z\-]+!)$/i, pu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function ws(e) {
  return Object.prototype.toString.call(e);
}
function et(e) {
  return e === 10 || e === 13;
}
function Bt(e) {
  return e === 9 || e === 32;
}
function Le(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function rr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Kg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Jg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Qg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function vs(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Zg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function mu(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var gu = new Array(256), yu = new Array(256);
for (var Xt = 0; Xt < 256; Xt++)
  gu[Xt] = vs(Xt) ? 1 : 0, yu[Xt] = vs(Xt);
function e0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Wg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Eu(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Gg(r), new uu(t, r);
}
function L(e, t) {
  throw Eu(e, t);
}
function ni(e, t) {
  e.onWarning && e.onWarning.call(null, Eu(e, t));
}
var _s = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && ni(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], hu.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), _t.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), pu.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
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
    else Yg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function As(e, t, r, n) {
  var i, o, a, s;
  for (Lt.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], _t.call(t, o) || (mu(t, o, r[o]), n[o] = !0);
}
function nr(e, t, r, n, i, o, a, s, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && ws(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && ws(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (d = 0, c = o.length; d < c; d += 1)
        As(e, t, o[d], r);
    else
      As(e, t, o, r);
  else
    !e.json && !_t.call(r, i) && _t.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), mu(t, i, o), delete r[i];
  return t;
}
function ra(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ce(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Bt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (et(i))
      for (ra(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && ni(e, "deficient indentation"), n;
}
function gi(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Le(r)));
}
function na(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Lt.repeat(`
`, t - 1));
}
function t0(e, t, r) {
  var n, i, o, a, s, l, d, c, f = e.kind, h = e.result, g;
  if (g = e.input.charCodeAt(e.position), Le(g) || rr(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Le(i) || r && rr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Le(i) || r && rr(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Le(n))
        break;
    } else {
      if (e.position === e.lineStart && gi(e) || r && rr(g))
        break;
      if (et(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    s && (yt(e, o, a, !1), na(e, e.line - l), o = a = e.position, s = !1), Bt(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return yt(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function r0(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (yt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else et(r) ? (yt(e, n, i, !0), na(e, ce(e, !1, t)), n = i = e.position) : e.position === e.lineStart && gi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function n0(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return yt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (yt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), et(s))
        ce(e, !1, t);
      else if (s < 256 && gu[s])
        e.result += yu[s], e.position++;
      else if ((a = Jg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Kg(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += Zg(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else et(s) ? (yt(e, r, n, !0), na(e, ce(e, !1, t)), r = n = e.position) : e.position === e.lineStart && gi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function i0(e, t) {
  var r = !0, n, i, o, a = e.tag, s, l = e.anchor, d, c, f, h, g, w = /* @__PURE__ */ Object.create(null), E, A, S, T;
  if (T = e.input.charCodeAt(e.position), T === 91)
    c = 93, g = !1, s = [];
  else if (T === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (ce(e, !0, t), T = e.input.charCodeAt(e.position), T === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    r ? T === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), A = E = S = null, f = h = !1, T === 63 && (d = e.input.charCodeAt(e.position + 1), Le(d) && (f = h = !0, e.position++, ce(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, mr(e, t, ti, !1, !0), A = e.tag, E = e.result, ce(e, !0, t), T = e.input.charCodeAt(e.position), (h || e.line === n) && T === 58 && (f = !0, T = e.input.charCodeAt(++e.position), ce(e, !0, t), mr(e, t, ti, !1, !0), S = e.result), g ? nr(e, s, w, A, E, S, n, i, o) : f ? s.push(nr(e, null, w, A, E, S, n, i, o)) : s.push(E), ce(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (r = !0, T = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function o0(e, t) {
  var r, n, i = Zi, o = !1, a = !1, s = t, l = 0, d = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Zi === i ? i = f === 43 ? Es : Vg : L(e, "repeat of a chomping mode identifier");
    else if ((c = Qg(f)) >= 0)
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
    for (ra(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), et(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Es ? e.result += Lt.repeat(`
`, o ? 1 + l : l) : i === Zi && o && (e.result += `
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
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Le(a)))); ) {
    if (s = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, mr(e, t, du, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function a0(e, t, r) {
  var n, i, o, a, s, l, d = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), g = null, w = null, E = null, A = !1, S = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && Le(n))
      T === 63 ? (A && (nr(e, f, h, g, w, null, a, s, l), g = w = E = null), S = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = n;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !mr(e, r, fu, !1, !0))
        break;
      if (e.line === o) {
        for (T = e.input.charCodeAt(e.position); Bt(T); )
          T = e.input.charCodeAt(++e.position);
        if (T === 58)
          T = e.input.charCodeAt(++e.position), Le(T) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (nr(e, f, h, g, w, null, a, s, l), g = w = E = null), S = !0, A = !1, i = !1, g = e.tag, w = e.result;
        else if (S)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (S)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), mr(e, t, ri, !0, i) && (A ? w = e.result : E = e.result), A || (nr(e, f, h, g, w, E, a, s, l), g = w = E = null), ce(e, !0, -1), T = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && T !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && nr(e, f, h, g, w, null, a, s, l), S && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = f), S;
}
function s0(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Le(a); )
      a === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), hu.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Xg.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !pu.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : _t.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function l0(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Le(r) && !rr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function c0(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Le(n) && !rr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), _t.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], ce(e, !0, -1), !0;
}
function mr(e, t, r, n, i) {
  var o, a, s, l = 1, d = !1, c = !1, f, h, g, w, E, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = ri === r || du === r, n && ce(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; s0(e) || l0(e); )
      ce(e, !0, -1) ? (d = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = d || i), (l === 1 || ri === r) && (ti === r || fu === r ? E = t : E = t + 1, A = e.position - e.lineStart, l === 1 ? s && (Ts(e, A) || a0(e, A, E)) || i0(e, E) ? c = !0 : (a && o0(e, E) || r0(e, E) || n0(e, E) ? c = !0 : c0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : t0(e, E, ti === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Ts(e, A))), e.tag === null)
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
function u0(e) {
  var t = e.position, r, n, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (ce(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !Le(a); )
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
      for (r = e.position; a !== 0 && !Le(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && ra(e), _t.call(_s, n) ? _s[n](e, n, i) : ni(e, 'unknown document directive "' + n + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && L(e, "directives end mark is expected"), mr(e, e.lineIndent - 1, ri, !1, !0), ce(e, !0, -1), e.checkLineBreaks && zg.test(e.input.slice(t, e.position)) && ni(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && gi(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function wu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new e0(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    u0(r);
  return r.documents;
}
function f0(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = wu(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function d0(e, t) {
  var r = wu(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new uu("expected a single document in the stream, but found more");
  }
}
Zo.loadAll = f0;
Zo.load = d0;
var vu = {}, yi = Ye, ln = sn, h0 = ta, _u = Object.prototype.toString, Au = Object.prototype.hasOwnProperty, ia = 65279, p0 = 9, Gr = 10, m0 = 13, g0 = 32, y0 = 33, E0 = 34, Oo = 35, w0 = 37, v0 = 38, _0 = 39, A0 = 42, Tu = 44, T0 = 45, ii = 58, S0 = 61, C0 = 62, b0 = 63, R0 = 64, Su = 91, Cu = 93, $0 = 96, bu = 123, P0 = 124, Ru = 125, Se = {};
Se[0] = "\\0";
Se[7] = "\\a";
Se[8] = "\\b";
Se[9] = "\\t";
Se[10] = "\\n";
Se[11] = "\\v";
Se[12] = "\\f";
Se[13] = "\\r";
Se[27] = "\\e";
Se[34] = '\\"';
Se[92] = "\\\\";
Se[133] = "\\N";
Se[160] = "\\_";
Se[8232] = "\\L";
Se[8233] = "\\P";
var I0 = [
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
], O0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function D0(e, t) {
  var r, n, i, o, a, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Au.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[a] = s;
  return r;
}
function N0(e) {
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
var F0 = 1, Wr = 2;
function x0(e) {
  this.schema = e.schema || h0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = yi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = D0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Wr : F0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ss(e, t) {
  for (var r = yi.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function Do(e, t) {
  return `
` + yi.repeat(" ", e.indent * t);
}
function L0(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function oi(e) {
  return e === g0 || e === p0;
}
function Vr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ia || 65536 <= e && e <= 1114111;
}
function Cs(e) {
  return Vr(e) && e !== ia && e !== m0 && e !== Gr;
}
function bs(e, t, r) {
  var n = Cs(e), i = n && !oi(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Tu && e !== Su && e !== Cu && e !== bu && e !== Ru) && e !== Oo && !(t === ii && !i) || Cs(t) && !oi(t) && e === Oo || t === ii && i
  );
}
function U0(e) {
  return Vr(e) && e !== ia && !oi(e) && e !== T0 && e !== b0 && e !== ii && e !== Tu && e !== Su && e !== Cu && e !== bu && e !== Ru && e !== Oo && e !== v0 && e !== A0 && e !== y0 && e !== P0 && e !== S0 && e !== C0 && e !== _0 && e !== E0 && e !== w0 && e !== R0 && e !== $0;
}
function k0(e) {
  return !oi(e) && e !== ii;
}
function Dr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function $u(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Pu = 1, No = 2, Iu = 3, Ou = 4, er = 5;
function M0(e, t, r, n, i, o, a, s) {
  var l, d = 0, c = null, f = !1, h = !1, g = n !== -1, w = -1, E = U0(Dr(e, 0)) && k0(Dr(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Dr(e, l), !Vr(d))
        return er;
      E = E && bs(d, c, s), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Dr(e, l), d === Gr)
        f = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!Vr(d))
        return er;
      E = E && bs(d, c, s), c = d;
    }
    h = h || g && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !f && !h ? E && !a && !i(e) ? Pu : o === Wr ? er : No : r > 9 && $u(e) ? er : a ? o === Wr ? er : No : h ? Ou : Iu;
}
function B0(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Wr ? '""' : "''";
    if (!e.noCompatMode && (I0.indexOf(t) !== -1 || O0.test(t)))
      return e.quotingType === Wr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return L0(e, d);
    }
    switch (M0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Pu:
        return t;
      case No:
        return "'" + t.replace(/'/g, "''") + "'";
      case Iu:
        return "|" + Rs(t, e.indent) + $s(Ss(t, o));
      case Ou:
        return ">" + Rs(t, e.indent) + $s(Ss(j0(t, a), o));
      case er:
        return '"' + H0(t) + '"';
      default:
        throw new ln("impossible error: invalid scalar style");
    }
  }();
}
function Rs(e, t) {
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
function j0(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, Ps(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", n += s + (!i && !o && l !== "" ? `
` : "") + Ps(l, t), i = o;
  }
  return n;
}
function Ps(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function H0(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Dr(e, i), n = Se[r], !n && Vr(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || N0(r);
  return t;
}
function q0(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (at(e, t, s, !1, !1) || typeof s > "u" && at(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Is(e, t, r, n) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = r.length; a < s; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (at(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && at(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Do(e, t)), e.dump && Gr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function G0(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, l, d, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), at(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), at(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function W0(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, l, d, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new ln("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!n || i !== "") && (h += Do(e, t)), d = a[s], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), at(e, t + 1, d, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Gr === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Do(e, t)), at(e, t + 1, c, !0, f) && (e.dump && Gr === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Os(e, t, r) {
  var n, i, o, a, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, _u.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (Au.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new ln("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function at(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, Os(e, r, !1) || Os(e, r, !0);
  var s = _u.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(r), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (W0(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (G0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Is(e, t - 1, e.dump, i) : Is(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (q0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && B0(e, e.dump, t, o, l);
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
function V0(e, t) {
  var r = [], n = [], i, o;
  for (Fo(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function Fo(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Fo(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        Fo(e[n[i]], t, r);
}
function Y0(e, t) {
  t = t || {};
  var r = new x0(t);
  r.noRefs || V0(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), at(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
vu.dump = Y0;
var Du = Zo, z0 = vu;
function oa(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ve.Type = Ne;
ve.Schema = Gc;
ve.FAILSAFE_SCHEMA = zc;
ve.JSON_SCHEMA = eu;
ve.CORE_SCHEMA = tu;
ve.DEFAULT_SCHEMA = ta;
ve.load = Du.load;
ve.loadAll = Du.loadAll;
ve.dump = z0.dump;
ve.YAMLException = sn;
ve.types = {
  binary: au,
  float: Zc,
  map: Yc,
  null: Xc,
  pairs: lu,
  set: cu,
  timestamp: iu,
  bool: Kc,
  int: Jc,
  merge: ou,
  omap: su,
  seq: Vc,
  str: Wc
};
ve.safeLoad = oa("safeLoad", "load");
ve.safeLoadAll = oa("safeLoadAll", "loadAll");
ve.safeDump = oa("safeDump", "dump");
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.Lazy = void 0;
class X0 {
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
Ei.Lazy = X0;
var xo = { exports: {} };
const K0 = "2.0.0", Nu = 256, J0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Q0 = 16, Z0 = Nu - 6, ey = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var wi = {
  MAX_LENGTH: Nu,
  MAX_SAFE_COMPONENT_LENGTH: Q0,
  MAX_SAFE_BUILD_LENGTH: Z0,
  MAX_SAFE_INTEGER: J0,
  RELEASE_TYPES: ey,
  SEMVER_SPEC_VERSION: K0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ty = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var vi = ty;
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
  ], w = (A) => {
    for (const [S, T] of g)
      A = A.split(`${S}*`).join(`${S}{0,${T}}`).split(`${S}+`).join(`${S}{1,${T}}`);
    return A;
  }, E = (A, S, T) => {
    const D = w(S), x = f++;
    o(A, x, S), c[A] = x, l[x] = S, d[x] = D, a[x] = new RegExp(S, T ? "g" : void 0), s[x] = new RegExp(D, T ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), E("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${h}+`), E("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), E("FULL", `^${l[c.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), E("LOOSE", `^${l[c.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), E("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), E("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", l[c.COERCE], !0), E("COERCERTLFULL", l[c.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(xo, xo.exports);
var cn = xo.exports;
const ry = Object.freeze({ loose: !0 }), ny = Object.freeze({}), iy = (e) => e ? typeof e != "object" ? ry : e : ny;
var aa = iy;
const Ds = /^[0-9]+$/, Fu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Ds.test(e), n = Ds.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, oy = (e, t) => Fu(t, e);
var xu = {
  compareIdentifiers: Fu,
  rcompareIdentifiers: oy
};
const Fn = vi, { MAX_LENGTH: Ns, MAX_SAFE_INTEGER: xn } = wi, { safeRe: Ln, t: Un } = cn, ay = aa, { compareIdentifiers: eo } = xu;
let sy = class Ze {
  constructor(t, r) {
    if (r = ay(r), t instanceof Ze) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ns)
      throw new TypeError(
        `version is longer than ${Ns} characters`
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
      return eo(n, i);
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
      return eo(n, i);
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
          n === !1 && (o = [r]), eo(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Fe = sy;
const Fs = Fe, ly = (e, t, r = !1) => {
  if (e instanceof Fs)
    return e;
  try {
    return new Fs(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Er = ly;
const cy = Er, uy = (e, t) => {
  const r = cy(e, t);
  return r ? r.version : null;
};
var fy = uy;
const dy = Er, hy = (e, t) => {
  const r = dy(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var py = hy;
const xs = Fe, my = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new xs(
      e instanceof xs ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var gy = my;
const Ls = Er, yy = (e, t) => {
  const r = Ls(e, null, !0), n = Ls(t, null, !0), i = r.compare(n);
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
var Ey = yy;
const wy = Fe, vy = (e, t) => new wy(e, t).major;
var _y = vy;
const Ay = Fe, Ty = (e, t) => new Ay(e, t).minor;
var Sy = Ty;
const Cy = Fe, by = (e, t) => new Cy(e, t).patch;
var Ry = by;
const $y = Er, Py = (e, t) => {
  const r = $y(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Iy = Py;
const Us = Fe, Oy = (e, t, r) => new Us(e, r).compare(new Us(t, r));
var ze = Oy;
const Dy = ze, Ny = (e, t, r) => Dy(t, e, r);
var Fy = Ny;
const xy = ze, Ly = (e, t) => xy(e, t, !0);
var Uy = Ly;
const ks = Fe, ky = (e, t, r) => {
  const n = new ks(e, r), i = new ks(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var sa = ky;
const My = sa, By = (e, t) => e.sort((r, n) => My(r, n, t));
var jy = By;
const Hy = sa, qy = (e, t) => e.sort((r, n) => Hy(n, r, t));
var Gy = qy;
const Wy = ze, Vy = (e, t, r) => Wy(e, t, r) > 0;
var _i = Vy;
const Yy = ze, zy = (e, t, r) => Yy(e, t, r) < 0;
var la = zy;
const Xy = ze, Ky = (e, t, r) => Xy(e, t, r) === 0;
var Lu = Ky;
const Jy = ze, Qy = (e, t, r) => Jy(e, t, r) !== 0;
var Uu = Qy;
const Zy = ze, eE = (e, t, r) => Zy(e, t, r) >= 0;
var ca = eE;
const tE = ze, rE = (e, t, r) => tE(e, t, r) <= 0;
var ua = rE;
const nE = Lu, iE = Uu, oE = _i, aE = ca, sE = la, lE = ua, cE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return nE(e, r, n);
    case "!=":
      return iE(e, r, n);
    case ">":
      return oE(e, r, n);
    case ">=":
      return aE(e, r, n);
    case "<":
      return sE(e, r, n);
    case "<=":
      return lE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var ku = cE;
const uE = Fe, fE = Er, { safeRe: kn, t: Mn } = cn, dE = (e, t) => {
  if (e instanceof uE)
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
  return fE(`${n}.${i}.${o}${a}${s}`, t);
};
var hE = dE;
class pE {
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
var mE = pE, to, Ms;
function Xe() {
  if (Ms) return to;
  Ms = 1;
  const e = /\s+/g;
  class t {
    constructor(R, O) {
      if (O = i(O), R instanceof t)
        return R.loose === !!O.loose && R.includePrerelease === !!O.includePrerelease ? R : new t(R.raw, O);
      if (R instanceof o)
        return this.raw = R.value, this.set = [[R]], this.formatted = void 0, this;
      if (this.options = O, this.loose = !!O.loose, this.includePrerelease = !!O.includePrerelease, this.raw = R.trim().replace(e, " "), this.set = this.raw.split("||").map((b) => this.parseRange(b.trim())).filter((b) => b.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const b = this.set[0];
        if (this.set = this.set.filter((N) => !E(N[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const N of this.set)
            if (N.length === 1 && A(N[0])) {
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
        for (let R = 0; R < this.set.length; R++) {
          R > 0 && (this.formatted += "||");
          const O = this.set[R];
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
    parseRange(R) {
      const b = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + R, N = n.get(b);
      if (N)
        return N;
      const I = this.options.loose, k = I ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      R = R.replace(k, M(this.options.includePrerelease)), a("hyphen replace", R), R = R.replace(l[d.COMPARATORTRIM], c), a("comparator trim", R), R = R.replace(l[d.TILDETRIM], f), a("tilde trim", R), R = R.replace(l[d.CARETTRIM], h), a("caret trim", R);
      let G = R.split(" ").map((U) => T(U, this.options)).join(" ").split(/\s+/).map((U) => B(U, this.options));
      I && (G = G.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[d.COMPARATORLOOSE])))), a("range list", G);
      const j = /* @__PURE__ */ new Map(), K = G.map((U) => new o(U, this.options));
      for (const U of K) {
        if (E(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const he = [...j.values()];
      return n.set(b, he), he;
    }
    intersects(R, O) {
      if (!(R instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => S(b, O) && R.set.some((N) => S(N, O) && b.every((I) => N.every((k) => I.intersects(k, O)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(R) {
      if (!R)
        return !1;
      if (typeof R == "string")
        try {
          R = new s(R, this.options);
        } catch {
          return !1;
        }
      for (let O = 0; O < this.set.length; O++)
        if (X(this.set[O], R, this.options))
          return !0;
      return !1;
    }
  }
  to = t;
  const r = mE, n = new r(), i = aa, o = Ai(), a = vi, s = Fe, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = cn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = wi, E = (P) => P.value === "<0.0.0-0", A = (P) => P.value === "", S = (P, R) => {
    let O = !0;
    const b = P.slice();
    let N = b.pop();
    for (; O && b.length; )
      O = b.every((I) => N.intersects(I, R)), N = b.pop();
    return O;
  }, T = (P, R) => (P = P.replace(l[d.BUILD], ""), a("comp", P, R), P = se(P, R), a("caret", P), P = x(P, R), a("tildes", P), P = Ue(P, R), a("xrange", P), P = q(P, R), a("stars", P), P), D = (P) => !P || P.toLowerCase() === "x" || P === "*", x = (P, R) => P.trim().split(/\s+/).map((O) => ee(O, R)).join(" "), ee = (P, R) => {
    const O = R.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return P.replace(O, (b, N, I, k, G) => {
      a("tilde", P, b, N, I, k, G);
      let j;
      return D(N) ? j = "" : D(I) ? j = `>=${N}.0.0 <${+N + 1}.0.0-0` : D(k) ? j = `>=${N}.${I}.0 <${N}.${+I + 1}.0-0` : G ? (a("replaceTilde pr", G), j = `>=${N}.${I}.${k}-${G} <${N}.${+I + 1}.0-0`) : j = `>=${N}.${I}.${k} <${N}.${+I + 1}.0-0`, a("tilde return", j), j;
    });
  }, se = (P, R) => P.trim().split(/\s+/).map((O) => V(O, R)).join(" "), V = (P, R) => {
    a("caret", P, R);
    const O = R.loose ? l[d.CARETLOOSE] : l[d.CARET], b = R.includePrerelease ? "-0" : "";
    return P.replace(O, (N, I, k, G, j) => {
      a("caret", P, N, I, k, G, j);
      let K;
      return D(I) ? K = "" : D(k) ? K = `>=${I}.0.0${b} <${+I + 1}.0.0-0` : D(G) ? I === "0" ? K = `>=${I}.${k}.0${b} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.0${b} <${+I + 1}.0.0-0` : j ? (a("replaceCaret pr", j), I === "0" ? k === "0" ? K = `>=${I}.${k}.${G}-${j} <${I}.${k}.${+G + 1}-0` : K = `>=${I}.${k}.${G}-${j} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.${G}-${j} <${+I + 1}.0.0-0`) : (a("no pr"), I === "0" ? k === "0" ? K = `>=${I}.${k}.${G}${b} <${I}.${k}.${+G + 1}-0` : K = `>=${I}.${k}.${G}${b} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.${G} <${+I + 1}.0.0-0`), a("caret return", K), K;
    });
  }, Ue = (P, R) => (a("replaceXRanges", P, R), P.split(/\s+/).map((O) => y(O, R)).join(" ")), y = (P, R) => {
    P = P.trim();
    const O = R.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return P.replace(O, (b, N, I, k, G, j) => {
      a("xRange", P, b, N, I, k, G, j);
      const K = D(I), he = K || D(k), U = he || D(G), Je = U;
      return N === "=" && Je && (N = ""), j = R.includePrerelease ? "-0" : "", K ? N === ">" || N === "<" ? b = "<0.0.0-0" : b = "*" : N && Je ? (he && (k = 0), G = 0, N === ">" ? (N = ">=", he ? (I = +I + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : N === "<=" && (N = "<", he ? I = +I + 1 : k = +k + 1), N === "<" && (j = "-0"), b = `${N + I}.${k}.${G}${j}`) : he ? b = `>=${I}.0.0${j} <${+I + 1}.0.0-0` : U && (b = `>=${I}.${k}.0${j} <${I}.${+k + 1}.0-0`), a("xRange return", b), b;
    });
  }, q = (P, R) => (a("replaceStars", P, R), P.trim().replace(l[d.STAR], "")), B = (P, R) => (a("replaceGTE0", P, R), P.trim().replace(l[R.includePrerelease ? d.GTE0PRE : d.GTE0], "")), M = (P) => (R, O, b, N, I, k, G, j, K, he, U, Je) => (D(b) ? O = "" : D(N) ? O = `>=${b}.0.0${P ? "-0" : ""}` : D(I) ? O = `>=${b}.${N}.0${P ? "-0" : ""}` : k ? O = `>=${O}` : O = `>=${O}${P ? "-0" : ""}`, D(K) ? j = "" : D(he) ? j = `<${+K + 1}.0.0-0` : D(U) ? j = `<${K}.${+he + 1}.0-0` : Je ? j = `<=${K}.${he}.${U}-${Je}` : P ? j = `<${K}.${he}.${+U + 1}-0` : j = `<=${j}`, `${O} ${j}`.trim()), X = (P, R, O) => {
    for (let b = 0; b < P.length; b++)
      if (!P[b].test(R))
        return !1;
    if (R.prerelease.length && !O.includePrerelease) {
      for (let b = 0; b < P.length; b++)
        if (a(P[b].semver), P[b].semver !== o.ANY && P[b].semver.prerelease.length > 0) {
          const N = P[b].semver;
          if (N.major === R.major && N.minor === R.minor && N.patch === R.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return to;
}
var ro, Bs;
function Ai() {
  if (Bs) return ro;
  Bs = 1;
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
  ro = t;
  const r = aa, { safeRe: n, t: i } = cn, o = ku, a = vi, s = Fe, l = Xe();
  return ro;
}
const gE = Xe(), yE = (e, t, r) => {
  try {
    t = new gE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ti = yE;
const EE = Xe(), wE = (e, t) => new EE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var vE = wE;
const _E = Fe, AE = Xe(), TE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new AE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new _E(n, r));
  }), n;
};
var SE = TE;
const CE = Fe, bE = Xe(), RE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new bE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new CE(n, r));
  }), n;
};
var $E = RE;
const no = Fe, PE = Xe(), js = _i, IE = (e, t) => {
  e = new PE(e, t);
  let r = new no("0.0.0");
  if (e.test(r) || (r = new no("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new no(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || js(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || js(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var OE = IE;
const DE = Xe(), NE = (e, t) => {
  try {
    return new DE(e, t).range || "*";
  } catch {
    return null;
  }
};
var FE = NE;
const xE = Fe, Mu = Ai(), { ANY: LE } = Mu, UE = Xe(), kE = Ti, Hs = _i, qs = la, ME = ua, BE = ca, jE = (e, t, r, n) => {
  e = new xE(e, n), t = new UE(t, n);
  let i, o, a, s, l;
  switch (r) {
    case ">":
      i = Hs, o = ME, a = qs, s = ">", l = ">=";
      break;
    case "<":
      i = qs, o = BE, a = Hs, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (kE(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let f = null, h = null;
    if (c.forEach((g) => {
      g.semver === LE && (g = new Mu(">=0.0.0")), f = f || g, h = h || g, i(g.semver, f.semver, n) ? f = g : a(g.semver, h.semver, n) && (h = g);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var fa = jE;
const HE = fa, qE = (e, t, r) => HE(e, t, ">", r);
var GE = qE;
const WE = fa, VE = (e, t, r) => WE(e, t, "<", r);
var YE = VE;
const Gs = Xe(), zE = (e, t, r) => (e = new Gs(e, r), t = new Gs(t, r), e.intersects(t, r));
var XE = zE;
const KE = Ti, JE = ze;
var QE = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((c, f) => JE(c, f, r));
  for (const c of a)
    KE(c, t, r) ? (o = c, i || (i = c)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, f] of n)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const Ws = Xe(), da = Ai(), { ANY: io } = da, $r = Ti, ha = ze, ZE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Ws(e, r), t = new Ws(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = tw(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, ew = [new da(">=0.0.0-0")], Vs = [new da(">=0.0.0")], tw = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === io) {
    if (t.length === 1 && t[0].semver === io)
      return !0;
    r.includePrerelease ? e = ew : e = Vs;
  }
  if (t.length === 1 && t[0].semver === io) {
    if (r.includePrerelease)
      return !0;
    t = Vs;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Ys(i, g, r) : g.operator === "<" || g.operator === "<=" ? o = zs(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = ha(i.semver, o.semver, r), a > 0)
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
        if (s = Ys(i, g, r), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !$r(i.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = zs(o, g, r), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !$r(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && d && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, Ys = (e, t, r) => {
  if (!e)
    return t;
  const n = ha(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, zs = (e, t, r) => {
  if (!e)
    return t;
  const n = ha(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var rw = ZE;
const oo = cn, Xs = wi, nw = Fe, Ks = xu, iw = Er, ow = fy, aw = py, sw = gy, lw = Ey, cw = _y, uw = Sy, fw = Ry, dw = Iy, hw = ze, pw = Fy, mw = Uy, gw = sa, yw = jy, Ew = Gy, ww = _i, vw = la, _w = Lu, Aw = Uu, Tw = ca, Sw = ua, Cw = ku, bw = hE, Rw = Ai(), $w = Xe(), Pw = Ti, Iw = vE, Ow = SE, Dw = $E, Nw = OE, Fw = FE, xw = fa, Lw = GE, Uw = YE, kw = XE, Mw = QE, Bw = rw;
var Bu = {
  parse: iw,
  valid: ow,
  clean: aw,
  inc: sw,
  diff: lw,
  major: cw,
  minor: uw,
  patch: fw,
  prerelease: dw,
  compare: hw,
  rcompare: pw,
  compareLoose: mw,
  compareBuild: gw,
  sort: yw,
  rsort: Ew,
  gt: ww,
  lt: vw,
  eq: _w,
  neq: Aw,
  gte: Tw,
  lte: Sw,
  cmp: Cw,
  coerce: bw,
  Comparator: Rw,
  Range: $w,
  satisfies: Pw,
  toComparators: Iw,
  maxSatisfying: Ow,
  minSatisfying: Dw,
  minVersion: Nw,
  validRange: Fw,
  outside: xw,
  gtr: Lw,
  ltr: Uw,
  intersects: kw,
  simplifyRange: Mw,
  subset: Bw,
  SemVer: nw,
  re: oo.re,
  src: oo.src,
  tokens: oo.t,
  SEMVER_SPEC_VERSION: Xs.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Xs.RELEASE_TYPES,
  compareIdentifiers: Ks.compareIdentifiers,
  rcompareIdentifiers: Ks.rcompareIdentifiers
}, un = {}, ai = { exports: {} };
ai.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", w = "[object GeneratorFunction]", E = "[object Map]", A = "[object Number]", S = "[object Null]", T = "[object Object]", D = "[object Promise]", x = "[object Proxy]", ee = "[object RegExp]", se = "[object Set]", V = "[object String]", Ue = "[object Symbol]", y = "[object Undefined]", q = "[object WeakMap]", B = "[object ArrayBuffer]", M = "[object DataView]", X = "[object Float32Array]", P = "[object Float64Array]", R = "[object Int8Array]", O = "[object Int16Array]", b = "[object Int32Array]", N = "[object Uint8Array]", I = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, K = /^\[object .+?Constructor\]$/, he = /^(?:0|[1-9]\d*)$/, U = {};
  U[X] = U[P] = U[R] = U[O] = U[b] = U[N] = U[I] = U[k] = U[G] = !0, U[s] = U[l] = U[B] = U[c] = U[M] = U[f] = U[h] = U[g] = U[E] = U[A] = U[T] = U[ee] = U[se] = U[V] = U[q] = !1;
  var Je = typeof $e == "object" && $e && $e.Object === Object && $e, p = typeof self == "object" && self && self.Object === Object && self, u = Je || p || Function("return this")(), C = t && !t.nodeType && t, _ = C && !0 && e && !e.nodeType && e, Y = _ && _.exports === C, te = Y && Je.process, oe = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), ye = oe && oe.isTypedArray;
  function _e(m, v) {
    for (var $ = -1, F = m == null ? 0 : m.length, Z = 0, H = []; ++$ < F; ) {
      var ae = m[$];
      v(ae, $, m) && (H[Z++] = ae);
    }
    return H;
  }
  function st(m, v) {
    for (var $ = -1, F = v.length, Z = m.length; ++$ < F; )
      m[Z + $] = v[$];
    return m;
  }
  function fe(m, v) {
    for (var $ = -1, F = m == null ? 0 : m.length; ++$ < F; )
      if (v(m[$], $, m))
        return !0;
    return !1;
  }
  function He(m, v) {
    for (var $ = -1, F = Array(m); ++$ < m; )
      F[$] = v($);
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
  function _r(m, v) {
    return m == null ? void 0 : m[v];
  }
  function mn(m) {
    var v = -1, $ = Array(m.size);
    return m.forEach(function(F, Z) {
      $[++v] = [Z, F];
    }), $;
  }
  function af(m, v) {
    return function($) {
      return m(v($));
    };
  }
  function sf(m) {
    var v = -1, $ = Array(m.size);
    return m.forEach(function(F) {
      $[++v] = F;
    }), $;
  }
  var lf = Array.prototype, cf = Function.prototype, gn = Object.prototype, Fi = u["__core-js_shared__"], _a = cf.toString, Qe = gn.hasOwnProperty, Aa = function() {
    var m = /[^.]+$/.exec(Fi && Fi.keys && Fi.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Ta = gn.toString, uf = RegExp(
    "^" + _a.call(Qe).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Sa = Y ? u.Buffer : void 0, yn = u.Symbol, Ca = u.Uint8Array, ba = gn.propertyIsEnumerable, ff = lf.splice, $t = yn ? yn.toStringTag : void 0, Ra = Object.getOwnPropertySymbols, df = Sa ? Sa.isBuffer : void 0, hf = af(Object.keys, Object), xi = Yt(u, "DataView"), Ar = Yt(u, "Map"), Li = Yt(u, "Promise"), Ui = Yt(u, "Set"), ki = Yt(u, "WeakMap"), Tr = Yt(Object, "create"), pf = Ot(xi), mf = Ot(Ar), gf = Ot(Li), yf = Ot(Ui), Ef = Ot(ki), $a = yn ? yn.prototype : void 0, Mi = $a ? $a.valueOf : void 0;
  function Pt(m) {
    var v = -1, $ = m == null ? 0 : m.length;
    for (this.clear(); ++v < $; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function wf() {
    this.__data__ = Tr ? Tr(null) : {}, this.size = 0;
  }
  function vf(m) {
    var v = this.has(m) && delete this.__data__[m];
    return this.size -= v ? 1 : 0, v;
  }
  function _f(m) {
    var v = this.__data__;
    if (Tr) {
      var $ = v[m];
      return $ === n ? void 0 : $;
    }
    return Qe.call(v, m) ? v[m] : void 0;
  }
  function Af(m) {
    var v = this.__data__;
    return Tr ? v[m] !== void 0 : Qe.call(v, m);
  }
  function Tf(m, v) {
    var $ = this.__data__;
    return this.size += this.has(m) ? 0 : 1, $[m] = Tr && v === void 0 ? n : v, this;
  }
  Pt.prototype.clear = wf, Pt.prototype.delete = vf, Pt.prototype.get = _f, Pt.prototype.has = Af, Pt.prototype.set = Tf;
  function rt(m) {
    var v = -1, $ = m == null ? 0 : m.length;
    for (this.clear(); ++v < $; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Sf() {
    this.__data__ = [], this.size = 0;
  }
  function Cf(m) {
    var v = this.__data__, $ = wn(v, m);
    if ($ < 0)
      return !1;
    var F = v.length - 1;
    return $ == F ? v.pop() : ff.call(v, $, 1), --this.size, !0;
  }
  function bf(m) {
    var v = this.__data__, $ = wn(v, m);
    return $ < 0 ? void 0 : v[$][1];
  }
  function Rf(m) {
    return wn(this.__data__, m) > -1;
  }
  function $f(m, v) {
    var $ = this.__data__, F = wn($, m);
    return F < 0 ? (++this.size, $.push([m, v])) : $[F][1] = v, this;
  }
  rt.prototype.clear = Sf, rt.prototype.delete = Cf, rt.prototype.get = bf, rt.prototype.has = Rf, rt.prototype.set = $f;
  function It(m) {
    var v = -1, $ = m == null ? 0 : m.length;
    for (this.clear(); ++v < $; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Pf() {
    this.size = 0, this.__data__ = {
      hash: new Pt(),
      map: new (Ar || rt)(),
      string: new Pt()
    };
  }
  function If(m) {
    var v = vn(this, m).delete(m);
    return this.size -= v ? 1 : 0, v;
  }
  function Of(m) {
    return vn(this, m).get(m);
  }
  function Df(m) {
    return vn(this, m).has(m);
  }
  function Nf(m, v) {
    var $ = vn(this, m), F = $.size;
    return $.set(m, v), this.size += $.size == F ? 0 : 1, this;
  }
  It.prototype.clear = Pf, It.prototype.delete = If, It.prototype.get = Of, It.prototype.has = Df, It.prototype.set = Nf;
  function En(m) {
    var v = -1, $ = m == null ? 0 : m.length;
    for (this.__data__ = new It(); ++v < $; )
      this.add(m[v]);
  }
  function Ff(m) {
    return this.__data__.set(m, n), this;
  }
  function xf(m) {
    return this.__data__.has(m);
  }
  En.prototype.add = En.prototype.push = Ff, En.prototype.has = xf;
  function lt(m) {
    var v = this.__data__ = new rt(m);
    this.size = v.size;
  }
  function Lf() {
    this.__data__ = new rt(), this.size = 0;
  }
  function Uf(m) {
    var v = this.__data__, $ = v.delete(m);
    return this.size = v.size, $;
  }
  function kf(m) {
    return this.__data__.get(m);
  }
  function Mf(m) {
    return this.__data__.has(m);
  }
  function Bf(m, v) {
    var $ = this.__data__;
    if ($ instanceof rt) {
      var F = $.__data__;
      if (!Ar || F.length < r - 1)
        return F.push([m, v]), this.size = ++$.size, this;
      $ = this.__data__ = new It(F);
    }
    return $.set(m, v), this.size = $.size, this;
  }
  lt.prototype.clear = Lf, lt.prototype.delete = Uf, lt.prototype.get = kf, lt.prototype.has = Mf, lt.prototype.set = Bf;
  function jf(m, v) {
    var $ = _n(m), F = !$ && rd(m), Z = !$ && !F && Bi(m), H = !$ && !F && !Z && Ua(m), ae = $ || F || Z || H, pe = ae ? He(m.length, String) : [], Ee = pe.length;
    for (var re in m)
      Qe.call(m, re) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (re == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Z && (re == "offset" || re == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (re == "buffer" || re == "byteLength" || re == "byteOffset") || // Skip index properties.
      Jf(re, Ee))) && pe.push(re);
    return pe;
  }
  function wn(m, v) {
    for (var $ = m.length; $--; )
      if (Na(m[$][0], v))
        return $;
    return -1;
  }
  function Hf(m, v, $) {
    var F = v(m);
    return _n(m) ? F : st(F, $(m));
  }
  function Sr(m) {
    return m == null ? m === void 0 ? y : S : $t && $t in Object(m) ? Xf(m) : td(m);
  }
  function Pa(m) {
    return Cr(m) && Sr(m) == s;
  }
  function Ia(m, v, $, F, Z) {
    return m === v ? !0 : m == null || v == null || !Cr(m) && !Cr(v) ? m !== m && v !== v : qf(m, v, $, F, Ia, Z);
  }
  function qf(m, v, $, F, Z, H) {
    var ae = _n(m), pe = _n(v), Ee = ae ? l : ct(m), re = pe ? l : ct(v);
    Ee = Ee == s ? T : Ee, re = re == s ? T : re;
    var ke = Ee == T, qe = re == T, Ae = Ee == re;
    if (Ae && Bi(m)) {
      if (!Bi(v))
        return !1;
      ae = !0, ke = !1;
    }
    if (Ae && !ke)
      return H || (H = new lt()), ae || Ua(m) ? Oa(m, v, $, F, Z, H) : Yf(m, v, Ee, $, F, Z, H);
    if (!($ & i)) {
      var Be = ke && Qe.call(m, "__wrapped__"), je = qe && Qe.call(v, "__wrapped__");
      if (Be || je) {
        var ut = Be ? m.value() : m, nt = je ? v.value() : v;
        return H || (H = new lt()), Z(ut, nt, $, F, H);
      }
    }
    return Ae ? (H || (H = new lt()), zf(m, v, $, F, Z, H)) : !1;
  }
  function Gf(m) {
    if (!La(m) || Zf(m))
      return !1;
    var v = Fa(m) ? uf : K;
    return v.test(Ot(m));
  }
  function Wf(m) {
    return Cr(m) && xa(m.length) && !!U[Sr(m)];
  }
  function Vf(m) {
    if (!ed(m))
      return hf(m);
    var v = [];
    for (var $ in Object(m))
      Qe.call(m, $) && $ != "constructor" && v.push($);
    return v;
  }
  function Oa(m, v, $, F, Z, H) {
    var ae = $ & i, pe = m.length, Ee = v.length;
    if (pe != Ee && !(ae && Ee > pe))
      return !1;
    var re = H.get(m);
    if (re && H.get(v))
      return re == v;
    var ke = -1, qe = !0, Ae = $ & o ? new En() : void 0;
    for (H.set(m, v), H.set(v, m); ++ke < pe; ) {
      var Be = m[ke], je = v[ke];
      if (F)
        var ut = ae ? F(je, Be, ke, v, m, H) : F(Be, je, ke, m, v, H);
      if (ut !== void 0) {
        if (ut)
          continue;
        qe = !1;
        break;
      }
      if (Ae) {
        if (!fe(v, function(nt, Dt) {
          if (!pn(Ae, Dt) && (Be === nt || Z(Be, nt, $, F, H)))
            return Ae.push(Dt);
        })) {
          qe = !1;
          break;
        }
      } else if (!(Be === je || Z(Be, je, $, F, H))) {
        qe = !1;
        break;
      }
    }
    return H.delete(m), H.delete(v), qe;
  }
  function Yf(m, v, $, F, Z, H, ae) {
    switch ($) {
      case M:
        if (m.byteLength != v.byteLength || m.byteOffset != v.byteOffset)
          return !1;
        m = m.buffer, v = v.buffer;
      case B:
        return !(m.byteLength != v.byteLength || !H(new Ca(m), new Ca(v)));
      case c:
      case f:
      case A:
        return Na(+m, +v);
      case h:
        return m.name == v.name && m.message == v.message;
      case ee:
      case V:
        return m == v + "";
      case E:
        var pe = mn;
      case se:
        var Ee = F & i;
        if (pe || (pe = sf), m.size != v.size && !Ee)
          return !1;
        var re = ae.get(m);
        if (re)
          return re == v;
        F |= o, ae.set(m, v);
        var ke = Oa(pe(m), pe(v), F, Z, H, ae);
        return ae.delete(m), ke;
      case Ue:
        if (Mi)
          return Mi.call(m) == Mi.call(v);
    }
    return !1;
  }
  function zf(m, v, $, F, Z, H) {
    var ae = $ & i, pe = Da(m), Ee = pe.length, re = Da(v), ke = re.length;
    if (Ee != ke && !ae)
      return !1;
    for (var qe = Ee; qe--; ) {
      var Ae = pe[qe];
      if (!(ae ? Ae in v : Qe.call(v, Ae)))
        return !1;
    }
    var Be = H.get(m);
    if (Be && H.get(v))
      return Be == v;
    var je = !0;
    H.set(m, v), H.set(v, m);
    for (var ut = ae; ++qe < Ee; ) {
      Ae = pe[qe];
      var nt = m[Ae], Dt = v[Ae];
      if (F)
        var ka = ae ? F(Dt, nt, Ae, v, m, H) : F(nt, Dt, Ae, m, v, H);
      if (!(ka === void 0 ? nt === Dt || Z(nt, Dt, $, F, H) : ka)) {
        je = !1;
        break;
      }
      ut || (ut = Ae == "constructor");
    }
    if (je && !ut) {
      var An = m.constructor, Tn = v.constructor;
      An != Tn && "constructor" in m && "constructor" in v && !(typeof An == "function" && An instanceof An && typeof Tn == "function" && Tn instanceof Tn) && (je = !1);
    }
    return H.delete(m), H.delete(v), je;
  }
  function Da(m) {
    return Hf(m, od, Kf);
  }
  function vn(m, v) {
    var $ = m.__data__;
    return Qf(v) ? $[typeof v == "string" ? "string" : "hash"] : $.map;
  }
  function Yt(m, v) {
    var $ = _r(m, v);
    return Gf($) ? $ : void 0;
  }
  function Xf(m) {
    var v = Qe.call(m, $t), $ = m[$t];
    try {
      m[$t] = void 0;
      var F = !0;
    } catch {
    }
    var Z = Ta.call(m);
    return F && (v ? m[$t] = $ : delete m[$t]), Z;
  }
  var Kf = Ra ? function(m) {
    return m == null ? [] : (m = Object(m), _e(Ra(m), function(v) {
      return ba.call(m, v);
    }));
  } : ad, ct = Sr;
  (xi && ct(new xi(new ArrayBuffer(1))) != M || Ar && ct(new Ar()) != E || Li && ct(Li.resolve()) != D || Ui && ct(new Ui()) != se || ki && ct(new ki()) != q) && (ct = function(m) {
    var v = Sr(m), $ = v == T ? m.constructor : void 0, F = $ ? Ot($) : "";
    if (F)
      switch (F) {
        case pf:
          return M;
        case mf:
          return E;
        case gf:
          return D;
        case yf:
          return se;
        case Ef:
          return q;
      }
    return v;
  });
  function Jf(m, v) {
    return v = v ?? a, !!v && (typeof m == "number" || he.test(m)) && m > -1 && m % 1 == 0 && m < v;
  }
  function Qf(m) {
    var v = typeof m;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? m !== "__proto__" : m === null;
  }
  function Zf(m) {
    return !!Aa && Aa in m;
  }
  function ed(m) {
    var v = m && m.constructor, $ = typeof v == "function" && v.prototype || gn;
    return m === $;
  }
  function td(m) {
    return Ta.call(m);
  }
  function Ot(m) {
    if (m != null) {
      try {
        return _a.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function Na(m, v) {
    return m === v || m !== m && v !== v;
  }
  var rd = Pa(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Pa : function(m) {
    return Cr(m) && Qe.call(m, "callee") && !ba.call(m, "callee");
  }, _n = Array.isArray;
  function nd(m) {
    return m != null && xa(m.length) && !Fa(m);
  }
  var Bi = df || sd;
  function id(m, v) {
    return Ia(m, v);
  }
  function Fa(m) {
    if (!La(m))
      return !1;
    var v = Sr(m);
    return v == g || v == w || v == d || v == x;
  }
  function xa(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= a;
  }
  function La(m) {
    var v = typeof m;
    return m != null && (v == "object" || v == "function");
  }
  function Cr(m) {
    return m != null && typeof m == "object";
  }
  var Ua = ye ? Ni(ye) : Wf;
  function od(m) {
    return nd(m) ? jf(m) : Vf(m);
  }
  function ad() {
    return [];
  }
  function sd() {
    return !1;
  }
  e.exports = id;
})(ai, ai.exports);
var jw = ai.exports;
Object.defineProperty(un, "__esModule", { value: !0 });
un.DownloadedUpdateHelper = void 0;
un.createTempUpdateFile = Vw;
const Hw = en, qw = St, Js = jw, Ft = bt, Ur = ie;
class Gw {
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
      return Js(this.versionInfo, r) && Js(this.fileInfo.info, n.info) && await (0, Ft.pathExists)(t) ? t : null;
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
    const l = await Ww(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Ur.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
un.DownloadedUpdateHelper = Gw;
function Ww(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, Hw.createHash)(t);
    a.on("error", o).setEncoding(r), (0, qw.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function Vw(e, t, r) {
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
var Si = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.getAppCacheDir = zw;
const ao = ie, Yw = ci;
function zw() {
  const e = (0, Yw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || ao.join(e, "AppData", "Local") : process.platform === "darwin" ? t = ao.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || ao.join(e, ".cache"), t;
}
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.ElectronAppAdapter = void 0;
const Qs = ie, Xw = pa;
class Kw {
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
    return this.isPackaged ? Qs.join(process.resourcesPath, "app-update.yml") : Qs.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Xw.getAppCacheDir)();
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
Si.ElectronAppAdapter = Kw;
var ju = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = de;
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
})(ju);
var fn = {}, Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.newBaseUrl = Jw;
Ke.newUrlFromBase = Qw;
Ke.getChannelFilename = Zw;
const Hu = Ct;
function Jw(e) {
  const t = new Hu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Qw(e, t, r = !1) {
  const n = new Hu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Zw(e) {
  return `${e}.yml`;
}
var ue = {}, ev = "[object Symbol]", qu = /[\\^$.*+?()[\]{}|]/g, tv = RegExp(qu.source), rv = typeof $e == "object" && $e && $e.Object === Object && $e, nv = typeof self == "object" && self && self.Object === Object && self, iv = rv || nv || Function("return this")(), ov = Object.prototype, av = ov.toString, Zs = iv.Symbol, el = Zs ? Zs.prototype : void 0, tl = el ? el.toString : void 0;
function sv(e) {
  if (typeof e == "string")
    return e;
  if (cv(e))
    return tl ? tl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function lv(e) {
  return !!e && typeof e == "object";
}
function cv(e) {
  return typeof e == "symbol" || lv(e) && av.call(e) == ev;
}
function uv(e) {
  return e == null ? "" : sv(e);
}
function fv(e) {
  return e = uv(e), e && tv.test(e) ? e.replace(qu, "\\$&") : e;
}
var Gu = fv;
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.Provider = void 0;
ue.findFile = gv;
ue.parseUpdateInfo = yv;
ue.getFileList = Wu;
ue.resolveFiles = Ev;
const At = de, dv = ve, hv = Ct, si = Ke, pv = Gu;
class mv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const o = (0, si.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, si.newUrlFromBase)(`${t.pathname.replace(new RegExp(pv(n), "g"), r)}.blockmap`, i ? new hv.URL(i) : t), o];
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, At.configureRequestUrl)(t, n), n;
  }
}
ue.Provider = mv;
function gv(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, At.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (n = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return o || (r == null ? e[0] : e.find((a) => !r.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function yv(e, t, r) {
  if (e == null)
    throw (0, At.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, dv.load)(e);
  } catch (i) {
    throw (0, At.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Wu(e) {
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
  throw (0, At.newError)(`No files provided: ${(0, At.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Ev(e, t, r = (n) => n) {
  const i = Wu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, At.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, At.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
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
const rl = de, so = Ke, lo = ue;
class wv extends lo.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, so.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, so.getChannelFilename)(this.channel), r = (0, so.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, lo.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof rl.HttpError && i.statusCode === 404)
          throw (0, rl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, lo.resolveFiles)(t, this.baseUrl);
  }
}
fn.GenericProvider = wv;
var Ci = {}, bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.BitbucketProvider = void 0;
const nl = de, co = Ke, uo = ue;
class vv extends uo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, co.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new nl.CancellationToken(), r = (0, co.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, co.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, uo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, nl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, uo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
bi.BitbucketProvider = vv;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.GitHubProvider = Tt.BaseGitHubProvider = void 0;
Tt.computeReleaseNotes = Yu;
const it = de, Ut = Bu, _v = Ct, ir = Ke, Lo = ue, fo = /\/tag\/([^/]+)$/;
class Vu extends Lo.Provider {
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
Tt.BaseGitHubProvider = Vu;
class Av extends Vu {
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
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Ut.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (A === null)
          c = fo.exec(d.element("link").attribute("href"))[1];
        else
          for (const S of l.getElements("entry")) {
            const T = fo.exec(S.element("link").attribute("href"));
            if (T === null)
              continue;
            const D = T[1], x = ((n = Ut.prerelease(D)) === null || n === void 0 ? void 0 : n[0]) || null, ee = !A || ["alpha", "beta"].includes(A), se = x !== null && !["alpha", "beta"].includes(String(x));
            if (ee && !se && !(A === "beta" && x === "alpha")) {
              c = D;
              break;
            }
            if (x && x === A) {
              c = D;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const A of l.getElements("entry"))
          if (fo.exec(A.element("link").attribute("href"))[1] === c) {
            d = A;
            break;
          }
      }
    } catch (A) {
      throw (0, it.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, it.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", g = "";
    const w = async (A) => {
      h = (0, ir.getChannelFilename)(A), g = (0, ir.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const S = this.createRequestOptions(g);
      try {
        return await this.executor.request(S, a);
      } catch (T) {
        throw T instanceof it.HttpError && T.statusCode === 404 ? (0, it.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Ut.prerelease(c)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = Ut.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await w(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await w(this.getDefaultChannelName());
      else
        throw A;
    }
    const E = (0, Lo.parseUpdateInfo)(f, h, g);
    return E.releaseName == null && (E.releaseName = d.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = Yu(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...E
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, ir.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new _v.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
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
    return (0, Lo.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Tt.GitHubProvider = Av;
function il(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Yu(e, t, r, n) {
  if (!t)
    return il(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Ut.valid(a) && Ut.lt(e, a) && i.push({
      version: a,
      note: il(o)
    });
  }
  return i.sort((o, a) => Ut.rcompare(o.version, a.version));
}
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.GitLabProvider = void 0;
const Ce = de, ho = Ct, Tv = Gu, Bn = Ke, po = ue;
class Sv extends po.Provider {
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
    const t = new Ce.CancellationToken(), r = (0, Bn.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, g = await this.httpRequest(r, h, t);
      if (!g)
        throw (0, Ce.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(g);
    } catch (h) {
      throw (0, Ce.newError)(`Unable to find latest release on GitLab (${r}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let o = null, a = "", s = null;
    const l = async (h) => {
      a = (0, Bn.getChannelFilename)(h);
      const g = n.assets.links.find((E) => E.name === a);
      if (!g)
        throw (0, Ce.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new ho.URL(g.direct_asset_url);
      const w = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const E = await this.httpRequest(s, w, t);
        if (!E)
          throw (0, Ce.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return E;
      } catch (E) {
        throw E instanceof Ce.HttpError && E.statusCode === 404 ? (0, Ce.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
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
      throw (0, Ce.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const d = (0, po.parseUpdateInfo)(o, a, s);
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
        return new ho.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new Ce.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const o = (0, Bn.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, r);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof Ce.HttpError && a.statusCode === 404)
          continue;
        throw (0, Ce.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Ce.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
        throw (0, Ce.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, Ce.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, po.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, Ce.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ho.URL(o),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Ri.GitLabProvider = Sv;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.KeygenProvider = void 0;
const ol = de, mo = Ke, go = ue;
class Cv extends go.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, mo.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new ol.CancellationToken(), r = (0, mo.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, mo.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, go.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, ol.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, go.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
$i.KeygenProvider = Cv;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.PrivateGitHubProvider = void 0;
const Kt = de, bv = ve, Rv = ie, al = Ct, sl = Ke, $v = Tt, Pv = ue;
class Iv extends $v.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Kt.CancellationToken(), r = (0, sl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, Kt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new al.URL(i.url);
    let a;
    try {
      a = (0, bv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, sl.newUrlFromBase)(n, this.baseUrl);
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
    return (0, Pv.getFileList)(t).map((r) => {
      const n = Rv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, Kt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new al.URL(i.url),
        info: r
      };
    });
  }
}
Pi.PrivateGitHubProvider = Iv;
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.isUrlProbablySupportMultiRangeRequests = zu;
Ci.createClient = Lv;
const jn = de, Ov = bi, ll = fn, Dv = Tt, Nv = Ri, Fv = $i, xv = Pi;
function zu(e) {
  return !e.includes("s3.amazonaws.com");
}
function Lv(e, t, r) {
  if (typeof e == "string")
    throw (0, jn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Dv.GitHubProvider(i, t, r) : new xv.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new Ov.BitbucketProvider(e, t, r);
    case "gitlab":
      return new Nv.GitLabProvider(e, t, r);
    case "keygen":
      return new Fv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new ll.GenericProvider({
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
      return new ll.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && zu(i.url)
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
var Ii = {}, dn = {}, wr = {}, Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.OperationKind = void 0;
Vt.computeOperations = Uv;
var kt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(kt || (Vt.OperationKind = kt = {}));
function Uv(e, t, r) {
  const n = ul(e.files), i = ul(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = Mv(n.get(l), d.offset, r);
  let w = a.offset;
  for (let E = 0; E < c.checksums.length; w += c.sizes[E], E++) {
    const A = c.sizes[E], S = c.checksums[E];
    let T = h.get(S);
    T != null && g.get(S) !== A && (r.warn(`Checksum ("${S}") matches, but size differs (old: ${g.get(S)}, new: ${A})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === kt.DOWNLOAD && o.end === w ? o.end += A : (o = {
      kind: kt.DOWNLOAD,
      start: w,
      end: w + A
      // oldBlocks: null,
    }, cl(o, s, S, E))) : o != null && o.kind === kt.COPY && o.end === T ? o.end += A : (o = {
      kind: kt.COPY,
      start: T,
      end: T + A
      // oldBlocks: [checksum]
    }, cl(o, s, S, E));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const kv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function cl(e, t, r, n) {
  if (kv && t.length !== 0) {
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
function Mv(e, t, r) {
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
function ul(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.DataSplitter = void 0;
wr.copyData = Xu;
const Hn = de, Bv = St, jv = Zr, Hv = Vt, fl = Buffer.from(`\r
\r
`);
var dt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(dt || (dt = {}));
function Xu(e, t, r, n, i) {
  const o = (0, Bv.createReadStream)("", {
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
class qv extends jv.Writable {
  constructor(t, r, n, i, o, a, s, l) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = l, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = dt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      if (this.readState === dt.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = dt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === dt.BODY)
          this.readState = dt.INIT;
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
            this.readState = dt.HEADER;
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
        if (a.kind !== Hv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Xu(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(fl, r);
    if (n !== -1)
      return n + fl.length;
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
wr.DataSplitter = qv;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.executeTasksUsingMultipleRangeRequests = Gv;
Oi.checkIsRangesSupported = ko;
const Uo = de, dl = wr, hl = Vt;
function Gv(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    Wv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function Wv(e, t, r, n, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), d = [];
  for (let h = t.start; h < t.end; h++) {
    const g = t.tasks[h];
    g.kind === hl.OperationKind.DOWNLOAD && (o += `${g.start}-${g.end - 1}, `, l.set(a, h), a++, d.push(g.end - g.start), s += g.end - g.start);
  }
  if (a <= 1) {
    const h = (g) => {
      if (g >= t.end) {
        n();
        return;
      }
      const w = t.tasks[g++];
      if (w.kind === hl.OperationKind.COPY)
        (0, dl.copyData)(w, r, t.oldFileFd, i, () => h(g));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${w.start}-${w.end - 1}`;
        const A = e.httpExecutor.createRequest(E, (S) => {
          S.on("error", i), ko(S, i) && (S.pipe(r, {
            end: !1
          }), S.once("end", () => h(g)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(A, i), A.end();
      }
    };
    h(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (h) => {
    if (!ko(h, i))
      return;
    const g = (0, Uo.safeGetHeader)(h, "content-type"), w = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(g);
    if (w == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${g}"`));
      return;
    }
    const E = new dl.DataSplitter(r, t, l, w[1] || w[2], d, n, s, e.options.onProgress);
    E.on("error", i), h.pipe(E), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function ko(e, t) {
  if (e.statusCode >= 400)
    return t((0, Uo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Uo.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.ProgressDifferentialDownloadCallbackTransform = void 0;
const Vv = Zr;
var or;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(or || (or = {}));
class Yv extends Vv.Transform {
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
Di.ProgressDifferentialDownloadCallbackTransform = Yv;
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.DifferentialDownloader = void 0;
const Pr = de, yo = bt, zv = St, Xv = wr, Kv = Ct, qn = Vt, pl = Oi, Jv = Di;
class Qv {
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
    return (0, Pr.configureRequestUrl)(this.options.newUrl, t), (0, Pr.configureRequestOptions)(t), t;
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
    return n.info(`Full: ${ml(s)}, To download: ${ml(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, yo.close)(i.descriptor).catch((o) => {
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
    const n = await (0, yo.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, yo.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, zv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const S = [];
        let T = 0;
        for (const x of t)
          x.kind === qn.OperationKind.DOWNLOAD && (S.push(x.end - x.start), T += x.end - x.start);
        const D = {
          expectedByteCounts: S,
          grandTotal: T
        };
        d = new Jv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new Pr.DigestTransform(this.blockAwareFileInfo.sha512);
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
        g = (0, pl.executeTasksUsingMultipleRangeRequests)(this, t, h, n, s), g(0);
        return;
      }
      let w = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", g = (S) => {
        var T, D;
        if (S >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const x = t[S++];
        if (x.kind === qn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, Xv.copyData)(x, h, n, s, () => g(S));
          return;
        }
        const ee = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = ee, (D = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || D === void 0 || D.call(T, `download range: ${ee}`), d && d.beginRangeDownload();
        const se = this.httpExecutor.createRequest(A, (V) => {
          V.on("error", s), V.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && s((0, Pr.createHttpError)(V)), V.pipe(h, {
            end: !1
          }), V.once("end", () => {
            d && d.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => g(S), 1e3)) : g(S);
          });
        });
        se.on("redirect", (V, Ue, y) => {
          this.logger.info(`Redirect to ${Zv(y)}`), E = y, (0, Pr.configureRequestUrl)(new Kv.URL(E), A), se.followRedirect();
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
        (0, pl.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
dn.DifferentialDownloader = Qv;
function ml(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Zv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.GenericDifferentialDownloader = void 0;
const e_ = dn;
class t_ extends e_.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Ii.GenericDifferentialDownloader = t_;
var Rt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = de;
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
})(Rt);
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.NoOpLogger = wt.AppUpdater = void 0;
const be = de, r_ = en, n_ = ci, i_ = jl, Ge = bt, o_ = ve, Eo = Ei, We = ie, xt = Bu, gl = un, a_ = Si, yl = ju, s_ = fn, wo = Ci, vo = ql, l_ = Ii, Jt = Rt;
class ma extends i_.EventEmitter {
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
        throw (0, be.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, be.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, yl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Ku();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Eo.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Jt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new Eo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Eo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new a_.ElectronAppAdapter(), this.httpExecutor = new yl.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, xt.parse)(n);
    if (i == null)
      throw (0, be.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = c_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new s_.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, wo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, wo.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = ma.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
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
    const i = await this.stagingUserIdPromise.value, a = be.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, xt.parse)(t.version);
    if (r == null)
      throw (0, be.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, xt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, xt.gt)(r, n), a = (0, xt.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, n_.release)();
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
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, wo.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new be.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, be.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new be.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, be.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof be.CancellationError))
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
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, o_.load)(await (0, Ge.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = We.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Ge.readFile)(t, "utf-8");
      if (be.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = be.UUID.v5((0, r_.randomBytes)(4096), be.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Ge.outputFile)(t, r);
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
      const i = We.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new gl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (T) => this.emit(Jt.DOWNLOAD_PROGRESS, T));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const T = decodeURIComponent(t.fileInfo.url.pathname);
      return T.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? We.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, Ge.mkdir)(d, { recursive: !0 });
    const c = s();
    let f = We.join(d, c);
    const h = a == null ? null : We.join(d, `package-${o}${We.extname(a.path) || ".7z"}`), g = async (T) => {
      await l.setDownloadedFile(f, h, i, r, c, T), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = We.join(d, "current.blockmap");
      return await (0, Ge.pathExists)(D) && await (0, Ge.copyFile)(D, We.join(l.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, w = this._logger, E = await l.validateDownloadedPath(f, i, r, w);
    if (E != null)
      return f = E, await g(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, Ge.unlink)(f).catch(() => {
    })), S = await (0, gl.createTempUpdateFile)(`temp-${c}`, d, w);
    try {
      await t.task(S, n, h, A), await (0, be.retry)(() => (0, Ge.rename)(S, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (T) => T instanceof Error && /^EBUSY:/.test(T.message) ? !0 : (w.warn(`Cannot rename temp file to final file: ${T.message || T.stack}`), !1)
      });
    } catch (T) {
      throw await A(), T instanceof be.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), T;
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
          return JSON.parse((0, vo.gunzipSync)(E).toString());
        } catch (A) {
          throw new Error(`Cannot parse blockmap "${w.href}", error: ${A}`);
        }
      }, d = {
        newUrl: t.url,
        oldFile: We.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (d.onProgress = (w) => this.emit(Jt.DOWNLOAD_PROGRESS, w));
      const c = async (w, E) => {
        const A = We.join(E, "current.blockmap");
        await (0, Ge.outputFile)(A, (0, vo.gzipSync)(JSON.stringify(w)));
      }, f = async (w) => {
        const E = We.join(w, "current.blockmap");
        try {
          if (await (0, Ge.pathExists)(E))
            return JSON.parse((0, vo.gunzipSync)(await (0, Ge.readFile)(E)).toString());
        } catch (A) {
          this._logger.warn(`Cannot parse blockmap "${E}", error: ${A}`);
        }
        return null;
      }, h = await l(s[1]);
      await c(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let g = await f(this.downloadedUpdateHelper.cacheDir);
      return g == null && (g = await l(s[0])), await new l_.GenericDifferentialDownloader(t.info, this.httpExecutor, d).download(g, h), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
wt.AppUpdater = ma;
function c_(e) {
  const t = (0, xt.prerelease)(e);
  return t != null && t.length > 0;
}
class Ku {
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
wt.NoOpLogger = Ku;
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.BaseUpdater = void 0;
const El = li, u_ = wt;
class f_ extends u_.AppUpdater {
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
    const i = (0, El.spawnSync)(t, r, {
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
        const s = { stdio: i, env: n, detached: !0 }, l = (0, El.spawn)(t, r, s);
        l.on("error", (d) => {
          a(d);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
Wt.BaseUpdater = f_;
var Yr = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Qt = bt, d_ = dn, h_ = ql;
class p_ extends d_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Ju(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await m_(this.options.oldFile), i);
  }
}
hn.FileWithEmbeddedBlockMapDifferentialDownloader = p_;
function Ju(e) {
  return JSON.parse((0, h_.inflateRawSync)(e).toString());
}
async function m_(e) {
  const t = await (0, Qt.open)(e, "r");
  try {
    const r = (await (0, Qt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Qt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Qt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Qt.close)(t), Ju(i);
  } catch (r) {
    throw await (0, Qt.close)(t), r;
  }
}
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.AppImageUpdater = void 0;
const wl = de, vl = li, g_ = bt, y_ = St, Ir = ie, E_ = Wt, w_ = hn, v_ = ue, _l = Rt;
class __ extends E_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, v_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, wl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, g_.chmod)(i, 493);
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
      return this.listenerCount(_l.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(_l.DOWNLOAD_PROGRESS, s)), await new w_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, wl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, y_.unlinkSync)(r);
    let n;
    const i = Ir.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Ir.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Ir.join(Ir.dirname(r), Ir.basename(o)), (0, vl.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, vl.execFileSync)(n, [], { env: a })), !0;
  }
}
Yr.AppImageUpdater = __;
var zr = {}, vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.LinuxUpdater = void 0;
const A_ = Wt;
class T_ extends A_.BaseUpdater {
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
vr.LinuxUpdater = T_;
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.DebUpdater = void 0;
const S_ = ue, Al = Rt, C_ = vr;
class ga extends C_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, S_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
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
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      ga.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
zr.DebUpdater = ga;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.PacmanUpdater = void 0;
const Tl = Rt, b_ = ue, R_ = vr;
class ya extends R_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, b_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
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
      ya.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Xr.PacmanUpdater = ya;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.RpmUpdater = void 0;
const Sl = Rt, $_ = ue, P_ = vr;
class Ea extends P_.LinuxUpdater {
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
        this.listenerCount(Sl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Sl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      Ea.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Kr.RpmUpdater = Ea;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.MacUpdater = void 0;
const Cl = de, _o = bt, I_ = St, bl = ie, O_ = gd, D_ = wt, N_ = ue, Rl = li, $l = en;
class F_ extends D_.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, Rl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Rl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const l = (0, N_.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Cl.newError)(`ZIP file not provided: ${(0, Cl.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const g = bl.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, _o.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let E = !0;
        w() && (E = await this.differentialDownloadInstaller(l, t, f, d, c)), E && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = bl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, _o.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, _o.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, O_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const f = (0, $l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, $l.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, E) => {
        const A = w.url;
        if (a.info(`${A} requested`), A === "/") {
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
        if (!A.startsWith(g)) {
          a.warn(`${A} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        a.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let S = !1;
        E.on("finish", () => {
          S || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const T = (0, I_.createReadStream)(i);
        T.on("error", (D) => {
          try {
            E.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          S = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${D}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), T.pipe(E);
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
Jr.MacUpdater = F_;
var Qr = {}, wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
wa.verifySignature = L_;
const Pl = de, Qu = li, x_ = ci, Il = ie;
function Zu(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function L_(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, Qu.execFile)(...Zu(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var d;
      try {
        if (a != null || l) {
          Ao(r, a, l, i), n(null);
          return;
        }
        const c = U_(s);
        if (c.Status === 0) {
          try {
            const w = Il.normalize(c.Path), E = Il.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${E}`), w !== E) {
              Ao(r, new Error(`LiteralPath of ${w} is different than ${E}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = w.message) !== null && d !== void 0 ? d : w.stack}`);
          }
          const h = (0, Pl.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const w of e) {
            const E = (0, Pl.parseDn)(w);
            if (E.size ? g = Array.from(E.keys()).every((S) => E.get(S) === h.get(S)) : w === h.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, g) => h === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (c) {
        Ao(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function U_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Ao(e, t, r, n) {
  if (k_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Qu.execFileSync)(...Zu("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function k_() {
  const e = x_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.NsisUpdater = void 0;
const Gn = de, Ol = ie, M_ = Wt, B_ = hn, Dl = Rt, j_ = ue, H_ = bt, q_ = wa, Nl = Ct;
class G_ extends M_.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, q_.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, j_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
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
            await this.httpExecutor.download(new Nl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, H_.unlink)(a);
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
      this.spawnLog(Ol.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
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
        newUrl: new Nl.URL(r.path),
        oldFile: Ol.join(this.downloadedUpdateHelper.cacheDir, Gn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Dl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Dl.DOWNLOAD_PROGRESS, a)), await new B_.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Qr.NsisUpdater = G_;
(function(e) {
  var t = $e && $e.__createBinding || (Object.create ? function(A, S, T, D) {
    D === void 0 && (D = T);
    var x = Object.getOwnPropertyDescriptor(S, T);
    (!x || ("get" in x ? !S.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return S[T];
    } }), Object.defineProperty(A, D, x);
  } : function(A, S, T, D) {
    D === void 0 && (D = T), A[D] = S[T];
  }), r = $e && $e.__exportStar || function(A, S) {
    for (var T in A) T !== "default" && !Object.prototype.hasOwnProperty.call(S, T) && t(S, A, T);
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
  var s = ue;
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
  } }), r(Rt, e);
  let w;
  function E() {
    if (process.platform === "win32")
      w = new Qr.NsisUpdater();
    else if (process.platform === "darwin")
      w = new Jr.MacUpdater();
    else {
      w = new Yr.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(A))
          return w;
        switch ((0, n.readFileSync)(A).toString().trim()) {
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
      } catch (A) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", A.message);
      }
    }
    return w;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => w || E()
  });
})(Me);
Me.autoUpdater.autoDownload = !1;
Me.autoUpdater.autoInstallOnAppQuit = !0;
Me.autoUpdater.autoRunAppAfterInstall = !0;
function W_() {
  Me.autoUpdater.on("error", (e) => {
    console.log("[AutoUpdater] Error:", e.message);
  }), Me.autoUpdater.on("checking-for-update", () => {
    console.log("[AutoUpdater] Checking for updates...");
  }), Me.autoUpdater.on("update-available", (e) => {
    console.log("[AutoUpdater] Update available:", e.version);
    const t = ot.getFocusedWindow();
    Xn.showMessageBox(t || {}, {
      type: "info",
      title: "Update Available",
      message: `A new version (v${e.version}) is available!`,
      detail: "Would you like to download and install it? The update will be applied when you restart the app.",
      buttons: ["Update", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then(({ response: r }) => {
      r === 0 && (Me.autoUpdater.downloadUpdate(), ot.getAllWindows().forEach((i) => {
        i.isDestroyed() || i.webContents.send("update-downloading");
      }));
    });
  }), Me.autoUpdater.on("update-not-available", () => {
    console.log("[AutoUpdater] App is up to date.");
  }), Me.autoUpdater.on("download-progress", (e) => {
    console.log(`[AutoUpdater] Download: ${Math.round(e.percent)}%`);
  }), Me.autoUpdater.on("update-downloaded", (e) => {
    console.log("[AutoUpdater] Update downloaded:", e.version);
    const t = ot.getFocusedWindow();
    Xn.showMessageBox(t || {}, {
      type: "info",
      title: "Update Ready",
      message: "Update has been downloaded!",
      detail: "The update will be installed when you restart the app. Restart now?",
      buttons: ["Restart Now", "Later"],
      defaultId: 0,
      cancelId: 1
    }).then(({ response: r }) => {
      r === 0 && Me.autoUpdater.quitAndInstall(!1, !0);
    });
  }), setTimeout(() => {
    Me.autoUpdater.checkForUpdates().catch((e) => {
      console.log("[AutoUpdater] Check failed (offline?):", e.message);
    });
  }, 5e3);
}
const V_ = z.dirname(Ml(import.meta.url));
Ul.registerSchemesAsPrivileged([
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
me.setName("Velo Studio");
const Fl = "velostudio";
process.defaultApp && process.argv.length >= 2 ? me.setAsDefaultProtocolClient(Fl, process.execPath, [z.resolve(process.argv[1])]) : me.setAsDefaultProtocolClient(Fl);
let ar = null;
function ef(e) {
  console.log("[Deep Link] Received:", e);
  try {
    const t = new URL(e), r = t.searchParams.get("code"), n = t.searchParams.get("access_token"), i = t.searchParams.get("refresh_token");
    r ? (console.log("[Deep Link] Got auth code, sending to auth window"), le && !le.isDestroyed() ? (le.webContents.send("oauth-callback", { code: r }), le.focus()) : ar = e) : n && i && (console.log("[Deep Link] Got auth tokens, sending to auth window"), le && !le.isDestroyed() ? (le.webContents.send("deep-link-auth", { accessToken: n, refreshToken: i }), le.focus()) : ar = e);
  } catch (t) {
    console.error("[Deep Link] Failed to parse URL:", t);
  }
}
me.on("open-url", (e, t) => {
  e.preventDefault(), ef(t);
});
const sr = z.join(me.getPath("userData"), "recordings");
async function Y_() {
  try {
    await Zt.mkdir(sr, { recursive: !0 }), console.log("RECORDINGS_DIR:", sr), console.log("User Data Path:", me.getPath("userData"));
  } catch (e) {
    console.error("Failed to create recordings directory:", e);
  }
}
process.env.APP_ROOT = z.join(V_, "..");
const z_ = process.env.VITE_DEV_SERVER_URL, yA = z.join(process.env.APP_ROOT, "dist-electron"), tf = z.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = z_ ? z.join(process.env.APP_ROOT, "public") : tf;
let Re = null, le = null, Nr = null, lr = null, rf = "";
const nf = of("openscreen.png"), X_ = of("rec-button.png");
function va() {
  Re = Ed();
}
function xl() {
  lr = new fd(nf);
}
function of(e) {
  return kl.createFromPath(z.join(process.env.VITE_PUBLIC || tf, e)).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function Ll(e = !1) {
  if (!lr) return;
  const t = e ? X_ : nf, r = e ? `Recording: ${rf}` : "Velo Studio", n = e ? [
    {
      label: "Stop Recording",
      click: () => {
        Re && !Re.isDestroyed() && Re.webContents.send("stop-recording-from-tray");
      }
    }
  ] : [
    {
      label: "Open",
      click: () => {
        Re && !Re.isDestroyed() ? Re.isMinimized() && Re.restore() : va();
      }
    },
    {
      label: "Quit",
      click: () => {
        me.quit();
      }
    }
  ];
  lr.setImage(t), lr.setToolTip(r), lr.setContextMenu(dd.buildFromTemplate(n));
}
function K_() {
  Re && (Re.close(), Re = null), Re = wd();
}
function J_() {
  return Nr = vd(), Nr.on("closed", () => {
    Nr = null;
  }), Nr;
}
me.on("window-all-closed", () => {
});
me.on("activate", () => {
  ot.getAllWindows().length === 0 && va();
});
me.whenReady().then(async () => {
  if (Ul.handle("velo-asset", (t) => {
    const r = new URL(t.url), n = decodeURIComponent(r.pathname).replace(/^\//, "");
    let i;
    me.isPackaged ? i = z.join(process.resourcesPath, "assets") : i = z.join(process.env.APP_ROOT || "", "public");
    const o = z.join(i, n);
    return console.log("[velo-asset protocol] Resolving:", t.url, "->", o), ud.fetch(hd(o).href);
  }), process.platform === "darwin" && !me.isPackaged) {
    const t = z.join(process.env.APP_ROOT || "", "icons", "icons", "mac", "icon.icns");
    try {
      const r = kl.createFromPath(t);
      !r.isEmpty() && me.dock && me.dock.setIcon(r);
    } catch (r) {
      console.warn("Failed to set dock icon:", r);
    }
  }
  const { ipcMain: e } = await import("electron");
  e.on("hud-overlay-close", () => {
    me.quit();
  }), e.on("auth-ready", () => {
    le && !le.isDestroyed() && (le.close(), le = null), va();
  }), e.handle("open-oauth-window", (t, r) => {
    const n = new ot({
      width: 500,
      height: 700,
      title: "Sign in - Velo Studio",
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0,
        partition: "oauth"
        // isolated session so interceptor doesn't affect main windows
      }
    });
    n.webContents.session.webRequest.onBeforeRequest(
      { urls: ["https://velostudio.app/auth/callback*"] },
      (i, o) => {
        try {
          const s = new URL(i.url).searchParams.get("code");
          if (s) {
            console.log("[OAuth Window] Intercepted auth code, sending to auth window"), le && !le.isDestroyed() && le.webContents.send("oauth-callback", { code: s }), setImmediate(() => {
              n.isDestroyed() || n.close();
            }), o({ cancel: !0 });
            return;
          }
        } catch (a) {
          console.error("[OAuth Window] Failed to parse callback URL:", a);
        }
        o({});
      }
    ), n.webContents.on("did-navigate", (i, o) => {
      if (o.startsWith("https://velostudio.app/auth/callback"))
        try {
          const s = new URL(o).searchParams.get("code");
          s && (console.log("[OAuth Window] Fallback: caught auth code via did-navigate"), le && !le.isDestroyed() && le.webContents.send("oauth-callback", { code: s }), n.isDestroyed() || n.close());
        } catch (a) {
          console.error("[OAuth Window] did-navigate error:", a);
        }
    }), n.loadURL(r);
  }), e.handle("check-screen-permission", () => process.platform === "darwin" ? ji.getMediaAccessStatus("screen") : "granted"), e.handle("check-microphone-permission", async () => {
    if (process.platform === "darwin") {
      const t = ji.getMediaAccessStatus("microphone");
      return t === "not-determined" ? await ji.askForMediaAccess("microphone") ? "granted" : "denied" : t;
    }
    return "granted";
  }), xl(), Ll(), await Y_(), Ad(
    K_,
    J_,
    () => Re,
    () => Nr,
    (t, r) => {
      rf = r, lr || xl(), Ll(t), t || Re && Re.restore();
    }
  ), le = _d(), le.on("closed", () => {
    le = null;
  }), ar && setTimeout(() => {
    ar && (ef(ar), ar = null);
  }, 1500), W_();
});
export {
  yA as MAIN_DIST,
  sr as RECORDINGS_DIR,
  tf as RENDERER_DIST,
  z_ as VITE_DEV_SERVER_URL
};
