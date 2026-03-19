import jt, { ipcMain as Q, screen as ht, BrowserWindow as ot, desktopCapturer as ud, shell as fd, app as me, dialog as Kn, protocol as kl, nativeImage as Ml, net as dd, systemPreferences as Hi, Tray as hd, Menu as pd } from "electron";
import { fileURLToPath as Bl, pathToFileURL as md } from "node:url";
import z from "node:path";
import Zt from "node:fs/promises";
import St from "fs";
import gd from "constants";
import en from "stream";
import jo from "util";
import jl from "assert";
import oe from "path";
import ci from "child_process";
import Hl from "events";
import tn from "crypto";
import ql from "tty";
import ui from "os";
import Ct from "url";
import yd from "string_decoder";
import Gl from "zlib";
import Ed from "http";
const rn = z.dirname(Bl(import.meta.url)), wd = z.join(rn, ".."), Et = process.env.VITE_DEV_SERVER_URL, fi = z.join(wd, "dist");
let cr = null;
Q.on("hud-overlay-hide", () => {
  cr && !cr.isDestroyed() && cr.minimize();
});
function vd() {
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
      preload: z.join(rn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      backgroundThrottling: !1
    }
  });
  return a.setContentProtection(!0), a.webContents.on("did-finish-load", () => {
    a == null || a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), cr = a, a.on("closed", () => {
    cr === a && (cr = null);
  }), Et ? a.loadURL(Et + "?windowType=hud-overlay") : a.loadFile(z.join(fi, "index.html"), {
    query: { windowType: "hud-overlay" }
  }), a;
}
function _d() {
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
      preload: z.join(rn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      backgroundThrottling: !1
    }
  });
  return t.maximize(), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), t == null || t.webContents.openDevTools();
  }), Et ? t.loadURL(Et + "?windowType=editor") : t.loadFile(z.join(fi, "index.html"), {
    query: { windowType: "editor" }
  }), t;
}
function Ad() {
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
      preload: z.join(rn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return Et ? r.loadURL(Et + "?windowType=source-selector") : r.loadFile(z.join(fi, "index.html"), {
    query: { windowType: "source-selector" }
  }), r;
}
function Td() {
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
      preload: z.join(rn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return Et ? r.loadURL(Et + "?windowType=electron-auth") : r.loadFile(z.join(fi, "index.html"), {
    query: { windowType: "electron-auth" }
  }), r;
}
let Cn = null, bn = !1, br = [], $n = 0, Rn = null, $r = null;
function Sd(e, t, r, n, i) {
  Q.handle("get-sources", async (a, s) => (await ud.getSources(s)).map((h) => ({
    id: h.id,
    name: h.name,
    display_id: h.display_id,
    thumbnail: h.thumbnail ? h.thumbnail.toDataURL() : null,
    appIcon: h.appIcon ? h.appIcon.toDataURL() : null
  }))), Q.handle("select-source", (a, s) => {
    Cn = s;
    const l = n();
    return l && l.close(), Cn;
  }), Q.handle("get-selected-source", () => Cn), Q.handle("open-source-selector", () => {
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
      const h = z.join(sr, l);
      return await Zt.writeFile(h, Buffer.from(s)), o = h, {
        success: !0,
        path: h,
        message: "Video stored successfully"
      };
    } catch (h) {
      return console.error("Failed to store video:", h), {
        success: !1,
        message: "Failed to store video",
        error: String(h)
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
    i && i(s, (Cn || { name: "Screen" }).name);
  }), Q.handle("open-external-url", async (a, s) => {
    try {
      return await fd.openExternal(s), { success: !0 };
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
      const h = r(), c = l.toLowerCase().endsWith(".gif"), f = c ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }];
      if (!h)
        throw new Error("Main window not available");
      const d = await Kn.showSaveDialog(h, {
        title: c ? "Save Exported GIF" : "Save Exported Video",
        defaultPath: z.join(me.getPath("downloads"), l),
        filters: f,
        properties: ["createDirectory", "showOverwriteConfirmation"]
      });
      return d.canceled || !d.filePath ? {
        success: !1,
        cancelled: !0,
        message: "Export cancelled"
      } : (await Zt.writeFile(d.filePath, Buffer.from(s)), {
        success: !0,
        path: d.filePath,
        message: "Video exported successfully"
      });
    } catch (h) {
      return console.error("Failed to save exported video:", h), {
        success: !1,
        message: "Failed to save exported video",
        error: String(h)
      };
    }
  }), Q.handle("open-video-file-picker", async () => {
    try {
      const a = await Kn.showOpenDialog({
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
  Q.handle("set-current-video-path", (a, s) => (o = s, { success: !0 })), Q.handle("get-current-video-path", () => o ? { success: !0, path: o } : { success: !1 }), Q.handle("clear-current-video-path", () => (o = null, { success: !0 })), Q.handle("get-platform", () => process.platform), Q.handle("start-cursor-tracking", (a, s) => {
    const l = ht.getPrimaryDisplay(), { width: h, height: c } = l.size;
    if (br = [], $n = Date.now(), bn = !0, $r = null, s && s.startsWith("window:"))
      try {
        const { execSync: d } = require("child_process"), m = s.split(":")[1], w = parseInt(m, 10);
        if (!isNaN(w)) {
          const y = `python3 -c "
import json, subprocess, sys
import Quartz
wins = Quartz.CGWindowListCopyWindowInfo(Quartz.kCGWindowListOptionIncludingWindow, ${w})
if wins and len(wins) > 0:
    b = wins[0].get('kCGWindowBounds', {})
    print(json.dumps({'x': b.get('X',0), 'y': b.get('Y',0), 'width': b.get('Width',0), 'height': b.get('Height',0)}))
else:
    print('null')
"`, A = d(y, { timeout: 3e3, encoding: "utf-8" }).trim();
          if (A && A !== "null") {
            const T = JSON.parse(A);
            T.width > 0 && T.height > 0 && ($r = T, console.log("[Cursor Tracking] Window bounds:", $r));
          }
        }
      } catch (d) {
        console.warn("[Cursor Tracking] Could not get window bounds, using full screen:", d);
      }
    const f = $r;
    return Rn = setInterval(() => {
      if (!bn) return;
      const d = ht.getCursorScreenPoint(), m = Date.now() - $n;
      let w, y;
      f ? (w = (d.x - f.x) / f.width, y = (d.y - f.y) / f.height) : (w = d.x / h, y = d.y / c), br.push({
        x: w,
        y,
        timestamp: m,
        type: "move"
      });
    }, 33), { success: !0, screenWidth: (f == null ? void 0 : f.width) || h, screenHeight: (f == null ? void 0 : f.height) || c };
  }), Q.handle("stop-cursor-tracking", () => {
    bn = !1, Rn && (clearInterval(Rn), Rn = null);
    const a = Date.now() - $n, s = ht.getPrimaryDisplay(), { width: l, height: h } = s.size, c = {
      events: br,
      screenWidth: l,
      screenHeight: h,
      duration: a
    };
    return br = [], c;
  }), Q.handle("record-cursor-click", (a, s) => {
    if (!bn) return { success: !1 };
    const l = ht.getPrimaryDisplay(), { width: h, height: c } = l.size, f = ht.getCursorScreenPoint(), d = Date.now() - $n, m = $r;
    let w, y;
    return m ? (w = (f.x - m.x) / m.width, y = (f.y - m.y) / m.height) : (w = f.x / h, y = f.y / c), br.push({
      x: w,
      y,
      timestamp: d,
      type: "click",
      button: s
    }), { success: !0 };
  }), Q.handle("save-cursor-data", async (a, s, l) => {
    try {
      const h = s.replace(/\.\w+$/, ".cursor.json");
      return await Zt.writeFile(h, l, "utf-8"), { success: !0, path: h };
    } catch (h) {
      return console.error("Failed to save cursor data:", h), { success: !1, error: String(h) };
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
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Me = {}, qt = {}, Oe = {};
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
var ft = gd, Cd = process.cwd, Vn = null, bd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Vn || (Vn = Cd.call(process)), Vn;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ja = process.chdir;
  process.chdir = function(e) {
    Vn = null, ja.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ja);
}
var $d = Rd;
function Rd(e) {
  ft.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, d, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), bd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(d, m, w) {
      var y = Date.now(), A = 0;
      c(d, m, function T(S) {
        if (S && (S.code === "EACCES" || S.code === "EPERM" || S.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(m, function(D, x) {
              D && D.code === "ENOENT" ? c(d, m, T) : w(S);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        w && w(S);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(d, m, w, y, A, T) {
      var S;
      if (T && typeof T == "function") {
        var D = 0;
        S = function(x, te, le) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, c.call(e, d, m, w, y, A, S);
          T.apply(this, arguments);
        };
      }
      return c.call(e, d, m, w, y, A, S);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, d, m, w, y) {
      for (var A = 0; ; )
        try {
          return c.call(e, f, d, m, w, y);
        } catch (T) {
          if (T.code === "EAGAIN" && A < 10) {
            A++;
            continue;
          }
          throw T;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, d, m) {
      c.open(
        f,
        ft.O_WRONLY | ft.O_SYMLINK,
        d,
        function(w, y) {
          if (w) {
            m && m(w);
            return;
          }
          c.fchmod(y, d, function(A) {
            c.close(y, function(T) {
              m && m(A || T);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, d) {
      var m = c.openSync(f, ft.O_WRONLY | ft.O_SYMLINK, d), w = !0, y;
      try {
        y = c.fchmodSync(m, d), w = !1;
      } finally {
        if (w)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return y;
    };
  }
  function r(c) {
    ft.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, d, m, w) {
      c.open(f, ft.O_SYMLINK, function(y, A) {
        if (y) {
          w && w(y);
          return;
        }
        c.futimes(A, d, m, function(T) {
          c.close(A, function(S) {
            w && w(T || S);
          });
        });
      });
    }, c.lutimesSync = function(f, d, m) {
      var w = c.openSync(f, ft.O_SYMLINK), y, A = !0;
      try {
        y = c.futimesSync(w, d, m), A = !1;
      } finally {
        if (A)
          try {
            c.closeSync(w);
          } catch {
          }
        else
          c.closeSync(w);
      }
      return y;
    }) : c.futimes && (c.lutimes = function(f, d, m, w) {
      w && process.nextTick(w);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(f, d, m) {
      return c.call(e, f, d, function(w) {
        h(w) && (w = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, d) {
      try {
        return c.call(e, f, d);
      } catch (m) {
        if (!h(m)) throw m;
      }
    };
  }
  function o(c) {
    return c && function(f, d, m, w) {
      return c.call(e, f, d, m, function(y) {
        h(y) && (y = null), w && w.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, d, m) {
      try {
        return c.call(e, f, d, m);
      } catch (w) {
        if (!h(w)) throw w;
      }
    };
  }
  function s(c) {
    return c && function(f, d, m) {
      typeof d == "function" && (m = d, d = null);
      function w(y, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return d ? c.call(e, f, d, w) : c.call(e, f, w);
    };
  }
  function l(c) {
    return c && function(f, d) {
      var m = d ? c.call(e, f, d) : c.call(e, f);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function h(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Ha = en.Stream, Pd = Id;
function Id(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Ha.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var h = a[s];
      this[h] = i[h];
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
    Ha.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Od = Nd, Dd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Nd(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Dd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ie = St, Fd = $d, xd = Pd, Ld = Od, Pn = jo, ve, Jn;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ve = Symbol.for("graceful-fs.queue"), Jn = Symbol.for("graceful-fs.previous")) : (ve = "___graceful-fs.queue", Jn = "___graceful-fs.previous");
function Ud() {
}
function Wl(e, t) {
  Object.defineProperty(e, ve, {
    get: function() {
      return t;
    }
  });
}
var Mt = Ud;
Pn.debuglog ? Mt = Pn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Mt = function() {
  var e = Pn.format.apply(Pn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ie[ve]) {
  var kd = Re[ve] || [];
  Wl(ie, kd), ie.close = function(e) {
    function t(r, n) {
      return e.call(ie, r, function(i) {
        i || qa(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Jn, {
      value: e
    }), t;
  }(ie.close), ie.closeSync = function(e) {
    function t(r) {
      e.apply(ie, arguments), qa();
    }
    return Object.defineProperty(t, Jn, {
      value: e
    }), t;
  }(ie.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Mt(ie[ve]), jl.equal(ie[ve].length, 0);
  });
}
Re[ve] || Wl(Re, ie[ve]);
var De = Ho(Ld(ie));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ie.__patched && (De = Ho(ie), ie.__patched = !0);
function Ho(e) {
  Fd(e), e.gracefulify = Ho, e.createReadStream = te, e.createWriteStream = le;
  var t = e.readFile;
  e.readFile = r;
  function r(E, q, B) {
    return typeof q == "function" && (B = q, q = null), M(E, q, B);
    function M(X, P, $, O) {
      return t(X, P, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? zt([M, [X, P, $], b, O || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(E, q, B, M);
    function X(P, $, O, b, N) {
      return n(P, $, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(E, q, B, M);
    function X(P, $, O, b, N) {
      return o(P, $, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(E, q, B, M) {
    return typeof B == "function" && (M = B, B = 0), X(E, q, B, M);
    function X(P, $, O, b, N) {
      return s(P, $, O, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var h = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(E, q, B) {
    typeof q == "function" && (B = q, q = null);
    var M = c.test(process.version) ? function($, O, b, N) {
      return h($, X(
        $,
        O,
        b,
        N
      ));
    } : function($, O, b, N) {
      return h($, O, X(
        $,
        O,
        b,
        N
      ));
    };
    return M(E, q, B);
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
    var d = xd(e);
    T = d.ReadStream, D = d.WriteStream;
  }
  var m = e.ReadStream;
  m && (T.prototype = Object.create(m.prototype), T.prototype.open = S);
  var w = e.WriteStream;
  w && (D.prototype = Object.create(w.prototype), D.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return T;
    },
    set: function(E) {
      T = E;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return D;
    },
    set: function(E) {
      D = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = T;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return y;
    },
    set: function(E) {
      y = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var A = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(E) {
      A = E;
    },
    enumerable: !0,
    configurable: !0
  });
  function T(E, q) {
    return this instanceof T ? (m.apply(this, arguments), this) : T.apply(Object.create(T.prototype), arguments);
  }
  function S() {
    var E = this;
    Ue(E.path, E.flags, E.mode, function(q, B) {
      q ? (E.autoClose && E.destroy(), E.emit("error", q)) : (E.fd = B, E.emit("open", B), E.read());
    });
  }
  function D(E, q) {
    return this instanceof D ? (w.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
    var E = this;
    Ue(E.path, E.flags, E.mode, function(q, B) {
      q ? (E.destroy(), E.emit("error", q)) : (E.fd = B, E.emit("open", B));
    });
  }
  function te(E, q) {
    return new e.ReadStream(E, q);
  }
  function le(E, q) {
    return new e.WriteStream(E, q);
  }
  var V = e.open;
  e.open = Ue;
  function Ue(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(E, q, B, M);
    function X(P, $, O, b, N) {
      return V(P, $, O, function(I, k) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? zt([X, [P, $, O, b], I, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function zt(e) {
  Mt("ENQUEUE", e[0].name, e[1]), ie[ve].push(e), qo();
}
var In;
function qa() {
  for (var e = Date.now(), t = 0; t < ie[ve].length; ++t)
    ie[ve][t].length > 2 && (ie[ve][t][3] = e, ie[ve][t][4] = e);
  qo();
}
function qo() {
  if (clearTimeout(In), In = void 0, ie[ve].length !== 0) {
    var e = ie[ve].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Mt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Mt("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), h = Math.min(l * 1.2, 100);
      s >= h ? (Mt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ie[ve].push(e);
    }
    In === void 0 && (In = setTimeout(qo, 0));
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
  }, e.read = function(i, o, a, s, l, h) {
    return typeof h == "function" ? r.read(i, o, a, s, l, h) : new Promise((c, f) => {
      r.read(i, o, a, s, l, (d, m, w) => {
        if (d) return f(d);
        c({ bytesRead: m, buffer: w });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, o, ...a) : new Promise((s, l) => {
      r.write(i, o, ...a, (h, c, f) => {
        if (h) return l(h);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, o, ...a) : new Promise((s, l) => {
      r.writev(i, o, ...a, (h, c, f) => {
        if (h) return l(h);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(qt);
var Go = {}, Vl = {};
const Md = oe;
Vl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Md.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Yl = qt, { checkPath: zl } = Vl, Xl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Go.makeDir = async (e, t) => (zl(e), Yl.mkdir(e, {
  mode: Xl(t),
  recursive: !0
}));
Go.makeDirSync = (e, t) => (zl(e), Yl.mkdirSync(e, {
  mode: Xl(t),
  recursive: !0
}));
const Bd = Oe.fromPromise, { makeDir: jd, makeDirSync: qi } = Go, Gi = Bd(jd);
var tt = {
  mkdirs: Gi,
  mkdirsSync: qi,
  // alias
  mkdirp: Gi,
  mkdirpSync: qi,
  ensureDir: Gi,
  ensureDirSync: qi
};
const Hd = Oe.fromPromise, Kl = qt;
function qd(e) {
  return Kl.access(e).then(() => !0).catch(() => !1);
}
var Gt = {
  pathExists: Hd(qd),
  pathExistsSync: Kl.existsSync
};
const ur = De;
function Gd(e, t, r, n) {
  ur.open(e, "r+", (i, o) => {
    if (i) return n(i);
    ur.futimes(o, t, r, (a) => {
      ur.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function Wd(e, t, r) {
  const n = ur.openSync(e, "r+");
  return ur.futimesSync(n, t, r), ur.closeSync(n);
}
var Jl = {
  utimesMillis: Gd,
  utimesMillisSync: Wd
};
const dr = qt, ge = oe, Vd = jo;
function Yd(e, t, r) {
  const n = r.dereference ? (i) => dr.stat(i, { bigint: !0 }) : (i) => dr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function zd(e, t, r) {
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
function Xd(e, t, r, n, i) {
  Vd.callbackify(Yd)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (nn(s, l)) {
        const h = ge.basename(e), c = ge.basename(t);
        return r === "move" && h !== c && h.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && Wo(e, t) ? i(new Error(di(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function Kd(e, t, r, n) {
  const { srcStat: i, destStat: o } = zd(e, t, n);
  if (o) {
    if (nn(i, o)) {
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
  if (i.isDirectory() && Wo(e, t))
    throw new Error(di(e, t, r));
  return { srcStat: i, destStat: o };
}
function Ql(e, t, r, n, i) {
  const o = ge.resolve(ge.dirname(e)), a = ge.resolve(ge.dirname(r));
  if (a === o || a === ge.parse(a).root) return i();
  dr.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : nn(t, l) ? i(new Error(di(e, r, n))) : Ql(e, t, a, n, i));
}
function Zl(e, t, r, n) {
  const i = ge.resolve(ge.dirname(e)), o = ge.resolve(ge.dirname(r));
  if (o === i || o === ge.parse(o).root) return;
  let a;
  try {
    a = dr.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (nn(t, a))
    throw new Error(di(e, r, n));
  return Zl(e, t, o, n);
}
function nn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Wo(e, t) {
  const r = ge.resolve(e).split(ge.sep).filter((i) => i), n = ge.resolve(t).split(ge.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function di(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var gr = {
  checkPaths: Xd,
  checkPathsSync: Kd,
  checkParentPaths: Ql,
  checkParentPathsSync: Zl,
  isSrcSubdir: Wo,
  areIdentical: nn
};
const xe = De, Mr = oe, Jd = tt.mkdirs, Qd = Gt.pathExists, Zd = Jl.utimesMillis, Br = gr;
function eh(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Br.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    Br.checkParentPaths(e, a, t, "copy", (l) => l ? n(l) : r.filter ? ec(Ga, s, e, t, r, n) : Ga(s, e, t, r, n));
  });
}
function Ga(e, t, r, n, i) {
  const o = Mr.dirname(r);
  Qd(o, (a, s) => {
    if (a) return i(a);
    if (s) return Qn(e, t, r, n, i);
    Jd(o, (l) => l ? i(l) : Qn(e, t, r, n, i));
  });
}
function ec(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function th(e, t, r, n, i) {
  return n.filter ? ec(Qn, e, t, r, n, i) : Qn(e, t, r, n, i);
}
function Qn(e, t, r, n, i) {
  (n.dereference ? xe.stat : xe.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? lh(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? rh(s, e, t, r, n, i) : s.isSymbolicLink() ? fh(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function rh(e, t, r, n, i, o) {
  return t ? nh(e, r, n, i, o) : tc(e, r, n, i, o);
}
function nh(e, t, r, n, i) {
  if (n.overwrite)
    xe.unlink(r, (o) => o ? i(o) : tc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function tc(e, t, r, n, i) {
  xe.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? ih(e.mode, t, r, i) : hi(r, e.mode, i));
}
function ih(e, t, r, n) {
  return oh(e) ? ah(r, e, (i) => i ? n(i) : Wa(e, t, r, n)) : Wa(e, t, r, n);
}
function oh(e) {
  return (e & 128) === 0;
}
function ah(e, t, r) {
  return hi(e, t | 128, r);
}
function Wa(e, t, r, n) {
  sh(t, r, (i) => i ? n(i) : hi(r, e, n));
}
function hi(e, t, r) {
  return xe.chmod(e, t, r);
}
function sh(e, t, r) {
  xe.stat(e, (n, i) => n ? r(n) : Zd(t, i.atime, i.mtime, r));
}
function lh(e, t, r, n, i, o) {
  return t ? rc(r, n, i, o) : ch(e.mode, r, n, i, o);
}
function ch(e, t, r, n, i) {
  xe.mkdir(r, (o) => {
    if (o) return i(o);
    rc(t, r, n, (a) => a ? i(a) : hi(r, e, i));
  });
}
function rc(e, t, r, n) {
  xe.readdir(e, (i, o) => i ? n(i) : nc(o, e, t, r, n));
}
function nc(e, t, r, n, i) {
  const o = e.pop();
  return o ? uh(e, o, t, r, n, i) : i();
}
function uh(e, t, r, n, i, o) {
  const a = Mr.join(r, t), s = Mr.join(n, t);
  Br.checkPaths(a, s, "copy", i, (l, h) => {
    if (l) return o(l);
    const { destStat: c } = h;
    th(c, a, s, i, (f) => f ? o(f) : nc(e, r, n, i, o));
  });
}
function fh(e, t, r, n, i) {
  xe.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = Mr.resolve(process.cwd(), a)), e)
      xe.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? xe.symlink(a, r, i) : i(s) : (n.dereference && (l = Mr.resolve(process.cwd(), l)), Br.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Br.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : dh(a, r, i)));
    else
      return xe.symlink(a, r, i);
  });
}
function dh(e, t, r) {
  xe.unlink(t, (n) => n ? r(n) : xe.symlink(e, t, r));
}
var hh = eh;
const Se = De, jr = oe, ph = tt.mkdirsSync, mh = Jl.utimesMillisSync, Hr = gr;
function gh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Hr.checkPathsSync(e, t, "copy", r);
  return Hr.checkParentPathsSync(e, n, t, "copy"), yh(i, e, t, r);
}
function yh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = jr.dirname(r);
  return Se.existsSync(i) || ph(i), ic(e, t, r, n);
}
function Eh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return ic(e, t, r, n);
}
function ic(e, t, r, n) {
  const o = (n.dereference ? Se.statSync : Se.lstatSync)(t);
  if (o.isDirectory()) return Ch(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return wh(o, e, t, r, n);
  if (o.isSymbolicLink()) return Rh(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function wh(e, t, r, n, i) {
  return t ? vh(e, r, n, i) : oc(e, r, n, i);
}
function vh(e, t, r, n) {
  if (n.overwrite)
    return Se.unlinkSync(r), oc(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function oc(e, t, r, n) {
  return Se.copyFileSync(t, r), n.preserveTimestamps && _h(e.mode, t, r), Vo(r, e.mode);
}
function _h(e, t, r) {
  return Ah(e) && Th(r, e), Sh(t, r);
}
function Ah(e) {
  return (e & 128) === 0;
}
function Th(e, t) {
  return Vo(e, t | 128);
}
function Vo(e, t) {
  return Se.chmodSync(e, t);
}
function Sh(e, t) {
  const r = Se.statSync(e);
  return mh(t, r.atime, r.mtime);
}
function Ch(e, t, r, n, i) {
  return t ? ac(r, n, i) : bh(e.mode, r, n, i);
}
function bh(e, t, r, n) {
  return Se.mkdirSync(r), ac(t, r, n), Vo(r, e);
}
function ac(e, t, r) {
  Se.readdirSync(e).forEach((n) => $h(n, e, t, r));
}
function $h(e, t, r, n) {
  const i = jr.join(t, e), o = jr.join(r, e), { destStat: a } = Hr.checkPathsSync(i, o, "copy", n);
  return Eh(a, i, o, n);
}
function Rh(e, t, r, n) {
  let i = Se.readlinkSync(t);
  if (n.dereference && (i = jr.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Se.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Se.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (o = jr.resolve(process.cwd(), o)), Hr.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Se.statSync(r).isDirectory() && Hr.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Ph(i, r);
  } else
    return Se.symlinkSync(i, r);
}
function Ph(e, t) {
  return Se.unlinkSync(t), Se.symlinkSync(e, t);
}
var Ih = gh;
const Oh = Oe.fromCallback;
var Yo = {
  copy: Oh(hh),
  copySync: Ih
};
const Va = De, sc = oe, J = jl, qr = process.platform === "win32";
function lc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Va[r], r = r + "Sync", e[r] = e[r] || Va[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function zo(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J.strictEqual(typeof r, "function", "rimraf: callback function required"), J(t, "rimraf: invalid options argument provided"), J.strictEqual(typeof t, "object", "rimraf: options should be object"), lc(t), Ya(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => Ya(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function Ya(e, t, r) {
  J(e), J(t), J(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && qr)
      return za(e, t, n, r);
    if (i && i.isDirectory())
      return Yn(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return qr ? za(e, t, o, r) : Yn(e, t, o, r);
        if (o.code === "EISDIR")
          return Yn(e, t, o, r);
      }
      return r(o);
    });
  });
}
function za(e, t, r, n) {
  J(e), J(t), J(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? Yn(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Xa(e, t, r) {
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
  n.isDirectory() ? zn(e, t, r) : t.unlinkSync(e);
}
function Yn(e, t, r, n) {
  J(e), J(t), J(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Dh(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Dh(e, t, r) {
  J(e), J(t), J(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      zo(sc.join(e, s), t, (l) => {
        if (!a) {
          if (l) return r(a = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function cc(e, t) {
  let r;
  t = t || {}, lc(t), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J(t, "rimraf: missing options"), J.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && qr && Xa(e, t, n);
  }
  try {
    r && r.isDirectory() ? zn(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return qr ? Xa(e, t, n) : zn(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    zn(e, t, n);
  }
}
function zn(e, t, r) {
  J(e), J(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Nh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Nh(e, t) {
  if (J(e), J(t), t.readdirSync(e).forEach((r) => cc(sc.join(e, r), t)), qr) {
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
var Fh = zo;
zo.sync = cc;
const Zn = De, xh = Oe.fromCallback, uc = Fh;
function Lh(e, t) {
  if (Zn.rm) return Zn.rm(e, { recursive: !0, force: !0 }, t);
  uc(e, t);
}
function Uh(e) {
  if (Zn.rmSync) return Zn.rmSync(e, { recursive: !0, force: !0 });
  uc.sync(e);
}
var pi = {
  remove: xh(Lh),
  removeSync: Uh
};
const kh = Oe.fromPromise, fc = qt, dc = oe, hc = tt, pc = pi, Ka = kh(async function(t) {
  let r;
  try {
    r = await fc.readdir(t);
  } catch {
    return hc.mkdirs(t);
  }
  return Promise.all(r.map((n) => pc.remove(dc.join(t, n))));
});
function Ja(e) {
  let t;
  try {
    t = fc.readdirSync(e);
  } catch {
    return hc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = dc.join(e, r), pc.removeSync(r);
  });
}
var Mh = {
  emptyDirSync: Ja,
  emptydirSync: Ja,
  emptyDir: Ka,
  emptydir: Ka
};
const Bh = Oe.fromCallback, mc = oe, mt = De, gc = tt;
function jh(e, t) {
  function r() {
    mt.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  mt.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = mc.dirname(e);
    mt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? gc.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(a);
      s.isDirectory() ? r() : mt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Hh(e) {
  let t;
  try {
    t = mt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = mc.dirname(e);
  try {
    mt.statSync(r).isDirectory() || mt.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") gc.mkdirsSync(r);
    else throw n;
  }
  mt.writeFileSync(e, "");
}
var qh = {
  createFile: Bh(jh),
  createFileSync: Hh
};
const Gh = Oe.fromCallback, yc = oe, pt = De, Ec = tt, Wh = Gt.pathExists, { areIdentical: wc } = gr;
function Vh(e, t, r) {
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
      if (o && wc(s, o)) return r(null);
      const l = yc.dirname(t);
      Wh(l, (h, c) => {
        if (h) return r(h);
        if (c) return n(e, t);
        Ec.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function Yh(e, t) {
  let r;
  try {
    r = pt.lstatSync(t);
  } catch {
  }
  try {
    const o = pt.lstatSync(e);
    if (r && wc(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = yc.dirname(t);
  return pt.existsSync(n) || Ec.mkdirsSync(n), pt.linkSync(e, t);
}
var zh = {
  createLink: Gh(Vh),
  createLinkSync: Yh
};
const gt = oe, xr = De, Xh = Gt.pathExists;
function Kh(e, t, r) {
  if (gt.isAbsolute(e))
    return xr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = gt.dirname(t), i = gt.join(n, e);
    return Xh(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : xr.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: gt.relative(n, e)
    })));
  }
}
function Jh(e, t) {
  let r;
  if (gt.isAbsolute(e)) {
    if (r = xr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = gt.dirname(t), i = gt.join(n, e);
    if (r = xr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = xr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: gt.relative(n, e)
    };
  }
}
var Qh = {
  symlinkPaths: Kh,
  symlinkPathsSync: Jh
};
const vc = De;
function Zh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  vc.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function ep(e, t) {
  let r;
  if (t) return t;
  try {
    r = vc.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var tp = {
  symlinkType: Zh,
  symlinkTypeSync: ep
};
const rp = Oe.fromCallback, _c = oe, Ve = qt, Ac = tt, np = Ac.mkdirs, ip = Ac.mkdirsSync, Tc = Qh, op = Tc.symlinkPaths, ap = Tc.symlinkPathsSync, Sc = tp, sp = Sc.symlinkType, lp = Sc.symlinkTypeSync, cp = Gt.pathExists, { areIdentical: Cc } = gr;
function up(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ve.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ve.stat(e),
      Ve.stat(t)
    ]).then(([a, s]) => {
      if (Cc(a, s)) return n(null);
      Qa(e, t, r, n);
    }) : Qa(e, t, r, n);
  });
}
function Qa(e, t, r, n) {
  op(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, sp(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const l = _c.dirname(t);
      cp(l, (h, c) => {
        if (h) return n(h);
        if (c) return Ve.symlink(e, t, s, n);
        np(l, (f) => {
          if (f) return n(f);
          Ve.symlink(e, t, s, n);
        });
      });
    });
  });
}
function fp(e, t, r) {
  let n;
  try {
    n = Ve.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = Ve.statSync(e), l = Ve.statSync(t);
    if (Cc(s, l)) return;
  }
  const i = ap(e, t);
  e = i.toDst, r = lp(i.toCwd, r);
  const o = _c.dirname(t);
  return Ve.existsSync(o) || ip(o), Ve.symlinkSync(e, t, r);
}
var dp = {
  createSymlink: rp(up),
  createSymlinkSync: fp
};
const { createFile: Za, createFileSync: es } = qh, { createLink: ts, createLinkSync: rs } = zh, { createSymlink: ns, createSymlinkSync: is } = dp;
var hp = {
  // file
  createFile: Za,
  createFileSync: es,
  ensureFile: Za,
  ensureFileSync: es,
  // link
  createLink: ts,
  createLinkSync: rs,
  ensureLink: ts,
  ensureLinkSync: rs,
  // symlink
  createSymlink: ns,
  createSymlinkSync: is,
  ensureSymlink: ns,
  ensureSymlinkSync: is
};
function pp(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function mp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Xo = { stringify: pp, stripBom: mp };
let hr;
try {
  hr = De;
} catch {
  hr = St;
}
const mi = Oe, { stringify: bc, stripBom: $c } = Xo;
async function gp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || hr, n = "throws" in t ? t.throws : !0;
  let i = await mi.fromCallback(r.readFile)(e, t);
  i = $c(i);
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
const yp = mi.fromPromise(gp);
function Ep(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || hr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = $c(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function wp(e, t, r = {}) {
  const n = r.fs || hr, i = bc(t, r);
  await mi.fromCallback(n.writeFile)(e, i, r);
}
const vp = mi.fromPromise(wp);
function _p(e, t, r = {}) {
  const n = r.fs || hr, i = bc(t, r);
  return n.writeFileSync(e, i, r);
}
var Ap = {
  readFile: yp,
  readFileSync: Ep,
  writeFile: vp,
  writeFileSync: _p
};
const On = Ap;
var Tp = {
  // jsonfile exports
  readJson: On.readFile,
  readJsonSync: On.readFileSync,
  writeJson: On.writeFile,
  writeJsonSync: On.writeFileSync
};
const Sp = Oe.fromCallback, Lr = De, Rc = oe, Pc = tt, Cp = Gt.pathExists;
function bp(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Rc.dirname(e);
  Cp(i, (o, a) => {
    if (o) return n(o);
    if (a) return Lr.writeFile(e, t, r, n);
    Pc.mkdirs(i, (s) => {
      if (s) return n(s);
      Lr.writeFile(e, t, r, n);
    });
  });
}
function $p(e, ...t) {
  const r = Rc.dirname(e);
  if (Lr.existsSync(r))
    return Lr.writeFileSync(e, ...t);
  Pc.mkdirsSync(r), Lr.writeFileSync(e, ...t);
}
var Ko = {
  outputFile: Sp(bp),
  outputFileSync: $p
};
const { stringify: Rp } = Xo, { outputFile: Pp } = Ko;
async function Ip(e, t, r = {}) {
  const n = Rp(t, r);
  await Pp(e, n, r);
}
var Op = Ip;
const { stringify: Dp } = Xo, { outputFileSync: Np } = Ko;
function Fp(e, t, r) {
  const n = Dp(t, r);
  Np(e, n, r);
}
var xp = Fp;
const Lp = Oe.fromPromise, Ie = Tp;
Ie.outputJson = Lp(Op);
Ie.outputJsonSync = xp;
Ie.outputJSON = Ie.outputJson;
Ie.outputJSONSync = Ie.outputJsonSync;
Ie.writeJSON = Ie.writeJson;
Ie.writeJSONSync = Ie.writeJsonSync;
Ie.readJSON = Ie.readJson;
Ie.readJSONSync = Ie.readJsonSync;
var Up = Ie;
const kp = De, Co = oe, Mp = Yo.copy, Ic = pi.remove, Bp = tt.mkdirp, jp = Gt.pathExists, os = gr;
function Hp(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  os.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    os.checkParentPaths(e, s, t, "move", (h) => {
      if (h) return n(h);
      if (qp(t)) return as(e, t, i, l, n);
      Bp(Co.dirname(t), (c) => c ? n(c) : as(e, t, i, l, n));
    });
  });
}
function qp(e) {
  const t = Co.dirname(e);
  return Co.parse(t).root === t;
}
function as(e, t, r, n, i) {
  if (n) return Wi(e, t, r, i);
  if (r)
    return Ic(t, (o) => o ? i(o) : Wi(e, t, r, i));
  jp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Wi(e, t, r, i));
}
function Wi(e, t, r, n) {
  kp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Gp(e, t, r, n) : n());
}
function Gp(e, t, r, n) {
  Mp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : Ic(e, n));
}
var Wp = Hp;
const Oc = De, bo = oe, Vp = Yo.copySync, Dc = pi.removeSync, Yp = tt.mkdirpSync, ss = gr;
function zp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ss.checkPathsSync(e, t, "move", r);
  return ss.checkParentPathsSync(e, i, t, "move"), Xp(t) || Yp(bo.dirname(t)), Kp(e, t, n, o);
}
function Xp(e) {
  const t = bo.dirname(e);
  return bo.parse(t).root === t;
}
function Kp(e, t, r, n) {
  if (n) return Vi(e, t, r);
  if (r)
    return Dc(t), Vi(e, t, r);
  if (Oc.existsSync(t)) throw new Error("dest already exists.");
  return Vi(e, t, r);
}
function Vi(e, t, r) {
  try {
    Oc.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Jp(e, t, r);
  }
}
function Jp(e, t, r) {
  return Vp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Dc(e);
}
var Qp = zp;
const Zp = Oe.fromCallback;
var em = {
  move: Zp(Wp),
  moveSync: Qp
}, bt = {
  // Export promiseified graceful-fs:
  ...qt,
  // Export extra methods:
  ...Yo,
  ...Mh,
  ...hp,
  ...Up,
  ...tt,
  ...em,
  ...Ko,
  ...Gt,
  ...pi
}, Wt = {}, wt = {}, de = {}, vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.CancellationError = vt.CancellationToken = void 0;
const tm = Hl;
class rm extends tm.EventEmitter {
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
      return Promise.reject(new $o());
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
          o(new $o());
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
vt.CancellationToken = rm;
class $o extends Error {
  constructor() {
    super("cancelled");
  }
}
vt.CancellationError = $o;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.newError = nm;
function nm(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Pe = {}, Ro = { exports: {} }, Dn = { exports: {} }, Yi, ls;
function im() {
  if (ls) return Yi;
  ls = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Yi = function(c, f) {
    f = f || {};
    var d = typeof c;
    if (d === "string" && c.length > 0)
      return a(c);
    if (d === "number" && isFinite(c))
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
        var d = parseFloat(f[1]), m = (f[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * o;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
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
    return f >= n ? h(c, f, n, "day") : f >= r ? h(c, f, r, "hour") : f >= t ? h(c, f, t, "minute") : f >= e ? h(c, f, e, "second") : c + " ms";
  }
  function h(c, f, d, m) {
    var w = f >= d * 1.5;
    return Math.round(c / d) + " " + m + (w ? "s" : "");
  }
  return Yi;
}
var zi, cs;
function Nc() {
  if (cs) return zi;
  cs = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = h, n.disable = s, n.enable = o, n.enabled = l, n.humanize = im(), n.destroy = c, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let d = 0;
      for (let m = 0; m < f.length; m++)
        d = (d << 5) - d + f.charCodeAt(m), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let d, m = null, w, y;
      function A(...T) {
        if (!A.enabled)
          return;
        const S = A, D = Number(/* @__PURE__ */ new Date()), x = D - (d || D);
        S.diff = x, S.prev = d, S.curr = D, d = D, T[0] = n.coerce(T[0]), typeof T[0] != "string" && T.unshift("%O");
        let te = 0;
        T[0] = T[0].replace(/%([a-zA-Z%])/g, (V, Ue) => {
          if (V === "%%")
            return "%";
          te++;
          const E = n.formatters[Ue];
          if (typeof E == "function") {
            const q = T[te];
            V = E.call(S, q), T.splice(te, 1), te--;
          }
          return V;
        }), n.formatArgs.call(S, T), (S.log || n.log).apply(S, T);
      }
      return A.namespace = f, A.useColors = n.useColors(), A.color = n.selectColor(f), A.extend = i, A.destroy = n.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (w !== n.namespaces && (w = n.namespaces, y = n.enabled(f)), y),
        set: (T) => {
          m = T;
        }
      }), typeof n.init == "function" && n.init(A), A;
    }
    function i(f, d) {
      const m = n(this.namespace + (typeof d > "u" ? ":" : d) + f);
      return m.log = this.log, m;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const d = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of d)
        m[0] === "-" ? n.skips.push(m.slice(1)) : n.names.push(m);
    }
    function a(f, d) {
      let m = 0, w = 0, y = -1, A = 0;
      for (; m < f.length; )
        if (w < d.length && (d[w] === f[m] || d[w] === "*"))
          d[w] === "*" ? (y = w, A = m, w++) : (m++, w++);
        else if (y !== -1)
          w = y + 1, A++, m = A;
        else
          return !1;
      for (; w < d.length && d[w] === "*"; )
        w++;
      return w === d.length;
    }
    function s() {
      const f = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const d of n.skips)
        if (a(f, d))
          return !1;
      for (const d of n.names)
        if (a(f, d))
          return !0;
      return !1;
    }
    function h(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return zi = e, zi;
}
var us;
function om() {
  return us || (us = 1, function(e, t) {
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
      const h = "color: " + this.color;
      l.splice(1, 0, h, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (c++, d === "%c" && (f = c));
      }), l.splice(f, 0, h);
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
    e.exports = Nc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (h) {
        return "[UnexpectedJSONParseError]: " + h.message;
      }
    };
  }(Dn, Dn.exports)), Dn.exports;
}
var Nn = { exports: {} }, Xi, fs;
function am() {
  return fs || (fs = 1, Xi = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Xi;
}
var Ki, ds;
function sm() {
  if (ds) return Ki;
  ds = 1;
  const e = ui, t = ql, r = am(), { env: n } = process;
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
  function a(l, h) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !h && i === void 0)
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
    const h = a(l, l && l.isTTY);
    return o(h);
  }
  return Ki = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Ki;
}
var hs;
function lm() {
  return hs || (hs = 1, function(e, t) {
    const r = ql, n = jo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = h, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = sm();
      d && (d.stderr || d).level >= 2 && (t.colors = [
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
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, m) => {
      const w = m.substring(6).toLowerCase().replace(/_([a-z])/g, (A, T) => T.toUpperCase());
      let y = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), d[w] = y, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(d) {
      const { namespace: m, useColors: w } = this;
      if (w) {
        const y = this.color, A = "\x1B[3" + (y < 8 ? y : "8;5;" + y), T = `  ${A};1m${m} \x1B[0m`;
        d[0] = T + d[0].split(`
`).join(`
` + T), d.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = a() + m + " " + d[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...d) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function l(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function h() {
      return process.env.DEBUG;
    }
    function c(d) {
      d.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let w = 0; w < m.length; w++)
        d.inspectOpts[m[w]] = t.inspectOpts[m[w]];
    }
    e.exports = Nc()(t);
    const { formatters: f } = e.exports;
    f.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  }(Nn, Nn.exports)), Nn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Ro.exports = om() : Ro.exports = lm();
var cm = Ro.exports, on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.ProgressCallbackTransform = void 0;
const um = en;
class fm extends um.Transform {
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
on.ProgressCallbackTransform = fm;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.DigestTransform = Pe.HttpExecutor = Pe.HttpError = void 0;
Pe.createHttpError = Io;
Pe.parseJson = wm;
Pe.configureRequestOptionsFromUrl = xc;
Pe.configureRequestUrl = Qo;
Pe.safeGetHeader = fr;
Pe.configureRequestOptions = ei;
Pe.safeStringifyJson = ti;
const dm = tn, hm = cm, pm = St, mm = en, Po = Ct, gm = vt, ps = yr, ym = on, Nt = (0, hm.default)("electron-builder");
function Io(e, t = null) {
  return new Jo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ti(e.headers), t);
}
const Em = /* @__PURE__ */ new Map([
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
class Jo extends Error {
  constructor(t, r = `HTTP error: ${Em.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Pe.HttpError = Jo;
function wm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class tr {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new gm.CancellationToken(), n) {
    ei(t);
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
    return Nt.enabled && Nt(`Request: ${ti(t)}`), r.createPromise((o, a, s) => {
      const l = this.createRequest(t, (h) => {
        try {
          this.handleResponse(h, t, r, o, a, i, n);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (h) => {
        this.doApiRequest(h, r, n, i).then(o).catch(a);
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
    if (Nt.enabled && Nt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ti(r)}`), t.statusCode === 404) {
      o(Io(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const h = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = h >= 300 && h < 400, f = fr(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(tr.prepareRedirectUrlOptions(f, r), n, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", o), t.on("data", (m) => d += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = fr(t, "content-type"), w = m != null && (Array.isArray(m) ? m.find((y) => y.includes("json")) != null : m.includes("json"));
          o(Io(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(d)) : d}
          `));
        } else
          i(d.length === 0 ? null : d);
      } catch (m) {
        o(m);
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
      Qo(t, s), ei(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (l) => {
          l == null ? n(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, h) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              h(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            h(null);
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
      r.responseHandler == null ? _m(r, o) : r.responseHandler(o, r.callback);
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
    const n = xc(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = tr.reconstructOriginalUrl(r), a = Fc(t, r);
      tr.isCrossOriginRedirect(o, a) && (Nt.enabled && Nt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new Po.URL(`${r}//${n}${i}${o}`);
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
        if (n < r && (i instanceof Jo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Pe.HttpExecutor = tr;
function Fc(e, t) {
  try {
    return new Po.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${n}//${r}${i}`;
    return new Po.URL(e, o);
  }
}
function xc(e, t) {
  const r = ei(t), n = Fc(e, t);
  return Qo(n, r), r;
}
function Qo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Oo extends mm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, dm.createHash)(r);
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
      throw (0, ps.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ps.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Pe.DigestTransform = Oo;
function vm(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function fr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function _m(e, t) {
  if (!vm(fr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = fr(t, "content-length");
    a != null && r.push(new ym.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Oo(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Oo(e.options.sha2, "sha256", "hex"));
  const i = (0, pm.createWriteStream)(e.destination);
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
function ei(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ti(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.MemoLazy = void 0;
class Am {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Lc(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
gi.MemoLazy = Am;
function Lc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Lc(e[a], t[a]));
  }
  return e === t;
}
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.githubUrl = Tm;
an.githubTagPrefix = Sm;
an.getS3LikeProviderBaseUrl = Cm;
function Tm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Sm(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Cm(e) {
  const t = e.provider;
  if (t === "s3")
    return bm(e);
  if (t === "spaces")
    return $m(e);
  throw new Error(`Not supported provider: ${t}`);
}
function bm(e) {
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
  return Uc(t, e.path);
}
function Uc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function $m(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Uc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.retry = kc;
const Rm = vt;
async function kc(e, t) {
  var r;
  const { retries: n, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Rm.CancellationToken() } = t;
  try {
    return await e();
  } catch (h) {
    if (await Promise.resolve((r = s == null ? void 0 : s(h)) !== null && r !== void 0 ? r : !0) && n > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await kc(e, { ...t, retries: n - 1, attempt: a + 1 });
    throw h;
  }
}
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.parseDn = Pm;
function Pm(e) {
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
const Mc = tn, Bc = yr, Im = "options.name must be either a string or a Buffer", ms = (0, Mc.randomBytes)(16);
ms[0] = ms[0] | 1;
const Xn = {}, W = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Xn[t] = e, W[e] = t;
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
    return Om(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Dm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Xn[t[14] + t[15]] & 240) >> 4,
        variant: gs((Xn[t[19] + t[20]] & 224) >> 5),
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
        variant: gs((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Bc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Xn[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
pr.UUID = Ht;
Ht.OID = Ht.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function gs(e) {
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
var Ur;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Ur || (Ur = {}));
function Om(e, t, r, n, i = Ur.ASCII) {
  const o = (0, Mc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Bc.newError)(Im, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Ur.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Ur.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new Ht(s);
      break;
    default:
      l = W[s[0]] + W[s[1]] + W[s[2]] + W[s[3]] + "-" + W[s[4]] + W[s[5]] + "-" + W[s[6] & 15 | r] + W[s[7]] + "-" + W[s[8] & 63 | 128] + W[s[9]] + "-" + W[s[10]] + W[s[11]] + W[s[12]] + W[s[13]] + W[s[14]] + W[s[15]];
      break;
  }
  return l;
}
function Dm(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
pr.nil = new Ht("00000000-0000-0000-0000-000000000000");
var sn = {}, jc = {};
(function(e) {
  (function(t) {
    t.parser = function(p, u) {
      return new n(p, u);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = h, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = u || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!p, C.noscript = !!(p || C.opt.noscript), C.state = E.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(y)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !p), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), B(C, "onready");
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
        var re = p[r[_]].length;
        if (re > u)
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
        C = Math.max(C, re);
      }
      var ae = t.MAX_BUFFER_LENGTH - C;
      p.bufferCheckPosition = ae + p.position;
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
    function h(p, u) {
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
          var u = yd.StringDecoder;
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
    var f = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", y = { xml: m, xmlns: w }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function te(p) {
      return p === '"' || p === "'";
    }
    function le(p) {
      return p === ">" || x(p);
    }
    function V(p, u) {
      return p.test(u);
    }
    function Ue(p, u) {
      return !V(p, u);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
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
    E = t.STATE;
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
      return p.sawRoot && !p.closedRoot && b(p, "Unclosed root tag"), p.state !== E.BEGIN && p.state !== E.BEGIN_WHITESPACE && p.state !== E.TEXT && $(p, "Unexpected end"), X(p), p.c = "", p.closed = !0, B(p, "onend"), n.call(p, p.strict, p.opt), p;
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
      var C = p.indexOf(":"), _ = C < 0 ? ["", p] : p.split(":"), Y = _[0], re = _[1];
      return u && p === "xmlns" && (Y = "xmlns", re = ""), { prefix: Y, local: re };
    }
    function k(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var u = I(p.attribName, !0), C = u.prefix, _ = u.local;
        if (C === "xmlns")
          if (_ === "xml" && p.attribValue !== m)
            b(
              p,
              "xml: prefix must be bound to " + m + `
Actual: ` + p.attribValue
            );
          else if (_ === "xmlns" && p.attribValue !== w)
            b(
              p,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + p.attribValue
            );
          else {
            var Y = p.tag, re = p.tags[p.tags.length - 1] || p;
            Y.ns === re.ns && (Y.ns = Object.create(re.ns)), Y.ns[_] = p.attribValue;
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
        C.ns && Y.ns !== C.ns && Object.keys(C.ns).forEach(function(gn) {
          M(p, "onopennamespace", {
            prefix: gn,
            uri: C.ns[gn]
          });
        });
        for (var re = 0, ae = p.attribList.length; re < ae; re++) {
          var ye = p.attribList[re], Ae = ye[0], st = ye[1], fe = I(Ae, !0), He = fe.prefix, Fi = fe.local, mn = He === "" ? "" : C.ns[He] || "", _r = {
            name: Ae,
            value: st,
            prefix: He,
            local: Fi,
            uri: mn
          };
          He && He !== "xmlns" && !mn && (b(p, "Unbound namespace prefix: " + JSON.stringify(He)), _r.uri = He), p.tag.attributes[Ae] = _r, M(p, "onattribute", _r);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!u, p.sawRoot = !0, p.tags.push(p.tag), M(p, "onopentag", p.tag), u || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = E.SCRIPT : p.state = E.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function j(p) {
      if (!p.tagName) {
        b(p, "Weird empty close tag."), p.textNode += "</>", p.state = E.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = E.SCRIPT;
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
        b(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = E.TEXT;
        return;
      }
      p.tagName = C;
      for (var re = p.tags.length; re-- > u; ) {
        var ae = p.tag = p.tags.pop();
        p.tagName = p.tag.name, M(p, "onclosetag", p.tagName);
        var ye = {};
        for (var Ae in ae.ns)
          ye[Ae] = ae.ns[Ae];
        var st = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && ae.ns !== st.ns && Object.keys(ae.ns).forEach(function(fe) {
          var He = ae.ns[fe];
          M(p, "onclosenamespace", { prefix: fe, uri: He });
        });
      }
      u === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = E.TEXT;
    }
    function K(p) {
      var u = p.entity, C = u.toLowerCase(), _, Y = "";
      return p.ENTITIES[u] ? p.ENTITIES[u] : p.ENTITIES[C] ? p.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), Y = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), Y = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || Y.toLowerCase() !== u ? (b(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(_));
    }
    function he(p, u) {
      u === "<" ? (p.state = E.OPEN_WAKA, p.startTagPosition = p.position) : x(u) || (b(p, "Non-whitespace before first tag."), p.textNode = u, p.state = E.TEXT);
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
          case E.BEGIN:
            if (u.state = E.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            he(u, _);
            continue;
          case E.BEGIN_WHITESPACE:
            he(u, _);
            continue;
          case E.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var Y = C - 1; _ && _ !== "<" && _ !== "&"; )
                _ = U(p, C++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += p.substring(Y, C - 1);
            }
            _ === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : (!x(_) && (!u.sawRoot || u.closedRoot) && b(u, "Text data outside of root node."), _ === "&" ? u.state = E.TEXT_ENTITY : u.textNode += _);
            continue;
          case E.SCRIPT:
            _ === "<" ? u.state = E.SCRIPT_ENDING : u.script += _;
            continue;
          case E.SCRIPT_ENDING:
            _ === "/" ? u.state = E.CLOSE_TAG : (u.script += "<" + _, u.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (_ === "!")
              u.state = E.SGML_DECL, u.sgmlDecl = "";
            else if (!x(_)) if (V(A, _))
              u.state = E.OPEN_TAG, u.tagName = _;
            else if (_ === "/")
              u.state = E.CLOSE_TAG, u.tagName = "";
            else if (_ === "?")
              u.state = E.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (b(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var re = u.position - u.startTagPosition;
                _ = new Array(re).join(" ") + _;
              }
              u.textNode += "<" + _, u.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (u.sgmlDecl + _ === "--") {
              u.state = E.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = E.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + _, u.sgmlDecl = "") : (u.sgmlDecl + _).toUpperCase() === f ? (M(u, "onopencdata"), u.state = E.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + _).toUpperCase() === d ? (u.state = E.DOCTYPE, (u.doctype || u.sawRoot) && b(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : _ === ">" ? (M(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = E.TEXT) : (te(_) && (u.state = E.SGML_DECL_QUOTED), u.sgmlDecl += _);
            continue;
          case E.SGML_DECL_QUOTED:
            _ === u.q && (u.state = E.SGML_DECL, u.q = ""), u.sgmlDecl += _;
            continue;
          case E.DOCTYPE:
            _ === ">" ? (u.state = E.TEXT, M(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += _, _ === "[" ? u.state = E.DOCTYPE_DTD : te(_) && (u.state = E.DOCTYPE_QUOTED, u.q = _));
            continue;
          case E.DOCTYPE_QUOTED:
            u.doctype += _, _ === u.q && (u.q = "", u.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            _ === "]" ? (u.doctype += _, u.state = E.DOCTYPE) : _ === "<" ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : te(_) ? (u.doctype += _, u.state = E.DOCTYPE_DTD_QUOTED, u.q = _) : u.doctype += _;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            u.doctype += _, _ === u.q && (u.state = E.DOCTYPE_DTD, u.q = "");
            continue;
          case E.COMMENT:
            _ === "-" ? u.state = E.COMMENT_ENDING : u.comment += _;
            continue;
          case E.COMMENT_ENDING:
            _ === "-" ? (u.state = E.COMMENT_ENDED, u.comment = P(u.opt, u.comment), u.comment && M(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + _, u.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            _ !== ">" ? (b(u, "Malformed comment"), u.comment += "--" + _, u.state = E.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = E.DOCTYPE_DTD : u.state = E.TEXT;
            continue;
          case E.CDATA:
            _ === "]" ? u.state = E.CDATA_ENDING : u.cdata += _;
            continue;
          case E.CDATA_ENDING:
            _ === "]" ? u.state = E.CDATA_ENDING_2 : (u.cdata += "]" + _, u.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            _ === ">" ? (u.cdata && M(u, "oncdata", u.cdata), M(u, "onclosecdata"), u.cdata = "", u.state = E.TEXT) : _ === "]" ? u.cdata += "]" : (u.cdata += "]]" + _, u.state = E.CDATA);
            continue;
          case E.PROC_INST:
            _ === "?" ? u.state = E.PROC_INST_ENDING : x(_) ? u.state = E.PROC_INST_BODY : u.procInstName += _;
            continue;
          case E.PROC_INST_BODY:
            if (!u.procInstBody && x(_))
              continue;
            _ === "?" ? u.state = E.PROC_INST_ENDING : u.procInstBody += _;
            continue;
          case E.PROC_INST_ENDING:
            _ === ">" ? (M(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = E.TEXT) : (u.procInstBody += "?" + _, u.state = E.PROC_INST_BODY);
            continue;
          case E.OPEN_TAG:
            V(T, _) ? u.tagName += _ : (N(u), _ === ">" ? G(u) : _ === "/" ? u.state = E.OPEN_TAG_SLASH : (x(_) || b(u, "Invalid character in tag name"), u.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            _ === ">" ? (G(u, !0), j(u)) : (b(u, "Forward-slash in opening tag not followed by >"), u.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (x(_))
              continue;
            _ === ">" ? G(u) : _ === "/" ? u.state = E.OPEN_TAG_SLASH : V(A, _) ? (u.attribName = _, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            _ === "=" ? u.state = E.ATTRIB_VALUE : _ === ">" ? (b(u, "Attribute without value"), u.attribValue = u.attribName, k(u), G(u)) : x(_) ? u.state = E.ATTRIB_NAME_SAW_WHITE : V(T, _) ? u.attribName += _ : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              u.state = E.ATTRIB_VALUE;
            else {
              if (x(_))
                continue;
              b(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", M(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", _ === ">" ? G(u) : V(A, _) ? (u.attribName = _, u.state = E.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (x(_))
              continue;
            te(_) ? (u.q = _, u.state = E.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || $(u, "Unquoted attribute value"), u.state = E.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            k(u), u.q = "", u.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            x(_) ? u.state = E.ATTRIB : _ === ">" ? G(u) : _ === "/" ? u.state = E.OPEN_TAG_SLASH : V(A, _) ? (b(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!le(_)) {
              _ === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            k(u), _ === ">" ? G(u) : u.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? j(u) : V(T, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = E.SCRIPT) : (x(_) || b(u, "Invalid tagname in closing tag"), u.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(_))
                continue;
              Ue(A, _) ? u.script ? (u.script += "</" + _, u.state = E.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (x(_))
              continue;
            _ === ">" ? j(u) : b(u, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var ae, ye;
            switch (u.state) {
              case E.TEXT_ENTITY:
                ae = E.TEXT, ye = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                ae = E.ATTRIB_VALUE_QUOTED, ye = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                ae = E.ATTRIB_VALUE_UNQUOTED, ye = "attribValue";
                break;
            }
            if (_ === ";") {
              var Ae = K(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ae) ? (u.entity = "", u.state = ae, u.write(Ae)) : (u[ye] += Ae, u.entity = "", u.state = ae);
            } else V(u.entity.length ? D : S, _) ? u.entity += _ : (b(u, "Invalid character in entity name"), u[ye] += "&" + u.entity + _, u.entity = "", u.state = ae);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, u = Math.floor, C = function() {
        var _ = 16384, Y = [], re, ae, ye = -1, Ae = arguments.length;
        if (!Ae)
          return "";
        for (var st = ""; ++ye < Ae; ) {
          var fe = Number(arguments[ye]);
          if (!isFinite(fe) || // `NaN`, `+Infinity`, or `-Infinity`
          fe < 0 || // not a valid Unicode code point
          fe > 1114111 || // not a valid Unicode code point
          u(fe) !== fe)
            throw RangeError("Invalid code point: " + fe);
          fe <= 65535 ? Y.push(fe) : (fe -= 65536, re = (fe >> 10) + 55296, ae = fe % 1024 + 56320, Y.push(re, ae)), (ye + 1 === Ae || Y.length > _) && (st += p.apply(null, Y), Y.length = 0);
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
})(jc);
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.XElement = void 0;
sn.parseXml = Lm;
const Nm = jc, Fn = yr;
class Hc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Fn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!xm(t))
      throw (0, Fn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Fn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Fn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (ys(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => ys(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
sn.XElement = Hc;
const Fm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function xm(e) {
  return Fm.test(e);
}
function ys(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Lm(e) {
  let t = null;
  const r = Nm.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new Hc(i.name);
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
  var i = gi;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = on;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = an;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var s = Zo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = ea;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var h = pr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return h.UUID;
  } });
  var c = sn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(d) {
    return d == null ? [] : Array.isArray(d) ? d : [d];
  }
})(de);
var _e = {}, ta = {}, Ye = {};
function qc(e) {
  return typeof e > "u" || e === null;
}
function Um(e) {
  return typeof e == "object" && e !== null;
}
function km(e) {
  return Array.isArray(e) ? e : qc(e) ? [] : [e];
}
function Mm(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function Bm(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function jm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ye.isNothing = qc;
Ye.isObject = Um;
Ye.toArray = km;
Ye.repeat = Bm;
Ye.isNegativeZero = jm;
Ye.extend = Mm;
function Gc(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Gr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Gc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Gr.prototype = Object.create(Error.prototype);
Gr.prototype.constructor = Gr;
Gr.prototype.toString = function(t) {
  return this.name + ": " + Gc(this, t);
};
var ln = Gr, Dr = Ye;
function Ji(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function Qi(e, t) {
  return Dr.repeat(" ", t - e.length) + e;
}
function Hm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", l, h, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    h = Ji(
      e.buffer,
      n[a - l],
      i[a - l],
      e.position - (n[a] - n[a - l]),
      f
    ), s = Dr.repeat(" ", t.indent) + Qi((e.line - l + 1).toString(), c) + " | " + h.str + `
` + s;
  for (h = Ji(e.buffer, n[a], i[a], e.position, f), s += Dr.repeat(" ", t.indent) + Qi((e.line + 1).toString(), c) + " | " + h.str + `
`, s += Dr.repeat("-", t.indent + c + 3 + h.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    h = Ji(
      e.buffer,
      n[a + l],
      i[a + l],
      e.position - (n[a] - n[a + l]),
      f
    ), s += Dr.repeat(" ", t.indent) + Qi((e.line + l + 1).toString(), c) + " | " + h.str + `
`;
  return s.replace(/\n$/, "");
}
var qm = Hm, Es = ln, Gm = [
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
], Wm = [
  "scalar",
  "sequence",
  "mapping"
];
function Vm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Ym(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Gm.indexOf(r) === -1)
      throw new Es('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Vm(t.styleAliases || null), Wm.indexOf(this.kind) === -1)
    throw new Es('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Ne = Ym, Rr = ln, Zi = Ne;
function ws(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function zm() {
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
function Do(e) {
  return this.extend(e);
}
Do.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof Zi)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Rr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof Zi))
      throw new Rr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Rr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Rr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof Zi))
      throw new Rr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Do.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = ws(i, "implicit"), i.compiledExplicit = ws(i, "explicit"), i.compiledTypeMap = zm(i.compiledImplicit, i.compiledExplicit), i;
};
var Wc = Do, Xm = Ne, Vc = new Xm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Km = Ne, Yc = new Km("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Jm = Ne, zc = new Jm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Qm = Wc, Xc = new Qm({
  explicit: [
    Vc,
    Yc,
    zc
  ]
}), Zm = Ne;
function eg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function tg() {
  return null;
}
function rg(e) {
  return e === null;
}
var Kc = new Zm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: eg,
  construct: tg,
  predicate: rg,
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
}), ng = Ne;
function ig(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function og(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function ag(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Jc = new ng("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: ig,
  construct: og,
  predicate: ag,
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
}), sg = Ye, lg = Ne;
function cg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ug(e) {
  return 48 <= e && e <= 55;
}
function fg(e) {
  return 48 <= e && e <= 57;
}
function dg(e) {
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
          if (!cg(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ug(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!fg(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function hg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function pg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !sg.isNegativeZero(e);
}
var Qc = new lg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: dg,
  construct: hg,
  predicate: pg,
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
}), Zc = Ye, mg = Ne, gg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function yg(e) {
  return !(e === null || !gg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Eg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var wg = /^[-+]?[0-9]+e/;
function vg(e, t) {
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
  else if (Zc.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), wg.test(r) ? r.replace("e", ".e") : r;
}
function _g(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Zc.isNegativeZero(e));
}
var eu = new mg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: yg,
  construct: Eg,
  predicate: _g,
  represent: vg,
  defaultStyle: "lowercase"
}), tu = Xc.extend({
  implicit: [
    Kc,
    Jc,
    Qc,
    eu
  ]
}), ru = tu, Ag = Ne, nu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), iu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Tg(e) {
  return e === null ? !1 : nu.exec(e) !== null || iu.exec(e) !== null;
}
function Sg(e) {
  var t, r, n, i, o, a, s, l = 0, h = null, c, f, d;
  if (t = nu.exec(e), t === null && (t = iu.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), h = (c * 60 + f) * 6e4, t[9] === "-" && (h = -h)), d = new Date(Date.UTC(r, n, i, o, a, s, l)), h && d.setTime(d.getTime() - h), d;
}
function Cg(e) {
  return e.toISOString();
}
var ou = new Ag("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Tg,
  construct: Sg,
  instanceOf: Date,
  represent: Cg
}), bg = Ne;
function $g(e) {
  return e === "<<" || e === null;
}
var au = new bg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: $g
}), Rg = Ne, ra = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Pg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = ra;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Ig(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = ra, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Og(e) {
  var t = "", r = 0, n, i, o = e.length, a = ra;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function Dg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var su = new Rg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Pg,
  construct: Ig,
  predicate: Dg,
  represent: Og
}), Ng = Ne, Fg = Object.prototype.hasOwnProperty, xg = Object.prototype.toString;
function Lg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, xg.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Fg.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Ug(e) {
  return e !== null ? e : [];
}
var lu = new Ng("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Lg,
  construct: Ug
}), kg = Ne, Mg = Object.prototype.toString;
function Bg(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], Mg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function jg(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var cu = new kg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Bg,
  construct: jg
}), Hg = Ne, qg = Object.prototype.hasOwnProperty;
function Gg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (qg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Wg(e) {
  return e !== null ? e : {};
}
var uu = new Hg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Gg,
  construct: Wg
}), na = ru.extend({
  implicit: [
    ou,
    au
  ],
  explicit: [
    su,
    lu,
    cu,
    uu
  ]
}), Lt = Ye, fu = ln, Vg = qm, Yg = na, _t = Object.prototype.hasOwnProperty, ri = 1, du = 2, hu = 3, ni = 4, eo = 1, zg = 2, vs = 3, Xg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Kg = /[\x85\u2028\u2029]/, Jg = /[,\[\]\{\}]/, pu = /^(?:!|!!|![a-z\-]+!)$/i, mu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _s(e) {
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
function Qg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Zg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function e0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function As(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function t0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function gu(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var yu = new Array(256), Eu = new Array(256);
for (var Xt = 0; Xt < 256; Xt++)
  yu[Xt] = As(Xt) ? 1 : 0, Eu[Xt] = As(Xt);
function r0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Yg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function wu(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Vg(r), new fu(t, r);
}
function L(e, t) {
  throw wu(e, t);
}
function ii(e, t) {
  e.onWarning && e.onWarning.call(null, wu(e, t));
}
var Ts = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && ii(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], pu.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), _t.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), mu.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
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
    else Xg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function Ss(e, t, r, n) {
  var i, o, a, s;
  for (Lt.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], _t.call(t, o) || (gu(t, o, r[o]), n[o] = !0);
}
function nr(e, t, r, n, i, o, a, s, l) {
  var h, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), h = 0, c = i.length; h < c; h += 1)
      Array.isArray(i[h]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && _s(i[h]) === "[object Object]" && (i[h] = "[object Object]");
  if (typeof i == "object" && _s(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (h = 0, c = o.length; h < c; h += 1)
        Ss(e, t, o[h], r);
    else
      Ss(e, t, o, r);
  else
    !e.json && !_t.call(r, i) && _t.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), gu(t, i, o), delete r[i];
  return t;
}
function ia(e) {
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
      for (ia(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && ii(e, "deficient indentation"), n;
}
function yi(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Le(r)));
}
function oa(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Lt.repeat(`
`, t - 1));
}
function n0(e, t, r) {
  var n, i, o, a, s, l, h, c, f = e.kind, d = e.result, m;
  if (m = e.input.charCodeAt(e.position), Le(m) || rr(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), Le(i) || r && rr(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Le(i) || r && rr(i))
        break;
    } else if (m === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Le(n))
        break;
    } else {
      if (e.position === e.lineStart && yi(e) || r && rr(m))
        break;
      if (et(m))
        if (l = e.line, h = e.lineStart, c = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          s = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = h, e.lineIndent = c;
          break;
        }
    }
    s && (yt(e, o, a, !1), oa(e, e.line - l), o = a = e.position, s = !1), Bt(m) || (a = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return yt(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = d, !1);
}
function i0(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (yt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else et(r) ? (yt(e, n, i, !0), oa(e, ce(e, !1, t)), n = i = e.position) : e.position === e.lineStart && yi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function o0(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return yt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (yt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), et(s))
        ce(e, !1, t);
      else if (s < 256 && yu[s])
        e.result += Eu[s], e.position++;
      else if ((a = Zg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Qg(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += t0(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else et(s) ? (yt(e, r, n, !0), oa(e, ce(e, !1, t)), r = n = e.position) : e.position === e.lineStart && yi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function a0(e, t) {
  var r = !0, n, i, o, a = e.tag, s, l = e.anchor, h, c, f, d, m, w = /* @__PURE__ */ Object.create(null), y, A, T, S;
  if (S = e.input.charCodeAt(e.position), S === 91)
    c = 93, m = !1, s = [];
  else if (S === 123)
    c = 125, m = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), S = e.input.charCodeAt(++e.position); S !== 0; ) {
    if (ce(e, !0, t), S = e.input.charCodeAt(e.position), S === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = s, !0;
    r ? S === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), A = y = T = null, f = d = !1, S === 63 && (h = e.input.charCodeAt(e.position + 1), Le(h) && (f = d = !0, e.position++, ce(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, mr(e, t, ri, !1, !0), A = e.tag, y = e.result, ce(e, !0, t), S = e.input.charCodeAt(e.position), (d || e.line === n) && S === 58 && (f = !0, S = e.input.charCodeAt(++e.position), ce(e, !0, t), mr(e, t, ri, !1, !0), T = e.result), m ? nr(e, s, w, A, y, T, n, i, o) : f ? s.push(nr(e, null, w, A, y, T, n, i, o)) : s.push(y), ce(e, !0, t), S = e.input.charCodeAt(e.position), S === 44 ? (r = !0, S = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function s0(e, t) {
  var r, n, i = eo, o = !1, a = !1, s = t, l = 0, h = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      eo === i ? i = f === 43 ? vs : zg : L(e, "repeat of a chomping mode identifier");
    else if ((c = e0(f)) >= 0)
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
    for (ia(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), et(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === vs ? e.result += Lt.repeat(`
`, o ? 1 + l : l) : i === eo && o && (e.result += `
`);
      break;
    }
    for (n ? Bt(f) ? (h = !0, e.result += Lt.repeat(`
`, o ? 1 + l : l)) : h ? (h = !1, e.result += Lt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Lt.repeat(`
`, l) : e.result += Lt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, r = e.position; !et(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    yt(e, r, e.position, !1);
  }
  return !0;
}
function Cs(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Le(a)))); ) {
    if (s = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, mr(e, t, hu, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function l0(e, t, r) {
  var n, i, o, a, s, l, h = e.tag, c = e.anchor, f = {}, d = /* @__PURE__ */ Object.create(null), m = null, w = null, y = null, A = !1, T = !1, S;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), S = e.input.charCodeAt(e.position); S !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (S === 63 || S === 58) && Le(n))
      S === 63 ? (A && (nr(e, f, d, m, w, null, a, s, l), m = w = y = null), T = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, S = n;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !mr(e, r, du, !1, !0))
        break;
      if (e.line === o) {
        for (S = e.input.charCodeAt(e.position); Bt(S); )
          S = e.input.charCodeAt(++e.position);
        if (S === 58)
          S = e.input.charCodeAt(++e.position), Le(S) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (nr(e, f, d, m, w, null, a, s, l), m = w = y = null), T = !0, A = !1, i = !1, m = e.tag, w = e.result;
        else if (T)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = h, e.anchor = c, !0;
      } else if (T)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = h, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), mr(e, t, ni, !0, i) && (A ? w = e.result : y = e.result), A || (nr(e, f, d, m, w, y, a, s, l), m = w = y = null), ce(e, !0, -1), S = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && S !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && nr(e, f, d, m, w, null, a, s, l), T && (e.tag = h, e.anchor = c, e.kind = "mapping", e.result = f), T;
}
function c0(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Le(a); )
      a === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), pu.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Jg.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !mu.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : _t.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function u0(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Le(r) && !rr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function f0(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Le(n) && !rr(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), _t.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], ce(e, !0, -1), !0;
}
function mr(e, t, r, n, i) {
  var o, a, s, l = 1, h = !1, c = !1, f, d, m, w, y, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = ni === r || hu === r, n && ce(e, !0, -1) && (h = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; c0(e) || u0(e); )
      ce(e, !0, -1) ? (h = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = h || i), (l === 1 || ni === r) && (ri === r || du === r ? y = t : y = t + 1, A = e.position - e.lineStart, l === 1 ? s && (Cs(e, A) || l0(e, A, y)) || a0(e, y) ? c = !0 : (a && s0(e, y) || i0(e, y) || o0(e, y) ? c = !0 : f0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : n0(e, y, ri === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Cs(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, d = e.implicitTypes.length; f < d; f += 1)
      if (w = e.implicitTypes[f], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (_t.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, m = e.typeMap.multi[e.kind || "fallback"], f = 0, d = m.length; f < d; f += 1)
        if (e.tag.slice(0, m[f].tag.length) === m[f].tag) {
          w = m[f];
          break;
        }
    w || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function d0(e) {
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
    a !== 0 && ia(e), _t.call(Ts, n) ? Ts[n](e, n, i) : ii(e, 'unknown document directive "' + n + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && L(e, "directives end mark is expected"), mr(e, e.lineIndent - 1, ni, !1, !0), ce(e, !0, -1), e.checkLineBreaks && Kg.test(e.input.slice(t, e.position)) && ii(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && yi(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function vu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new r0(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    d0(r);
  return r.documents;
}
function h0(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = vu(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function p0(e, t) {
  var r = vu(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new fu("expected a single document in the stream, but found more");
  }
}
ta.loadAll = h0;
ta.load = p0;
var _u = {}, Ei = Ye, cn = ln, m0 = na, Au = Object.prototype.toString, Tu = Object.prototype.hasOwnProperty, aa = 65279, g0 = 9, Wr = 10, y0 = 13, E0 = 32, w0 = 33, v0 = 34, No = 35, _0 = 37, A0 = 38, T0 = 39, S0 = 42, Su = 44, C0 = 45, oi = 58, b0 = 61, $0 = 62, R0 = 63, P0 = 64, Cu = 91, bu = 93, I0 = 96, $u = 123, O0 = 124, Ru = 125, Ce = {};
Ce[0] = "\\0";
Ce[7] = "\\a";
Ce[8] = "\\b";
Ce[9] = "\\t";
Ce[10] = "\\n";
Ce[11] = "\\v";
Ce[12] = "\\f";
Ce[13] = "\\r";
Ce[27] = "\\e";
Ce[34] = '\\"';
Ce[92] = "\\\\";
Ce[133] = "\\N";
Ce[160] = "\\_";
Ce[8232] = "\\L";
Ce[8233] = "\\P";
var D0 = [
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
], N0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function F0(e, t) {
  var r, n, i, o, a, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Tu.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[a] = s;
  return r;
}
function x0(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new cn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + Ei.repeat("0", n - t.length) + t;
}
var L0 = 1, Vr = 2;
function U0(e) {
  this.schema = e.schema || m0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Ei.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = F0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Vr : L0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function bs(e, t) {
  for (var r = Ei.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function Fo(e, t) {
  return `
` + Ei.repeat(" ", e.indent * t);
}
function k0(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function ai(e) {
  return e === E0 || e === g0;
}
function Yr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== aa || 65536 <= e && e <= 1114111;
}
function $s(e) {
  return Yr(e) && e !== aa && e !== y0 && e !== Wr;
}
function Rs(e, t, r) {
  var n = $s(e), i = n && !ai(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Su && e !== Cu && e !== bu && e !== $u && e !== Ru) && e !== No && !(t === oi && !i) || $s(t) && !ai(t) && e === No || t === oi && i
  );
}
function M0(e) {
  return Yr(e) && e !== aa && !ai(e) && e !== C0 && e !== R0 && e !== oi && e !== Su && e !== Cu && e !== bu && e !== $u && e !== Ru && e !== No && e !== A0 && e !== S0 && e !== w0 && e !== O0 && e !== b0 && e !== $0 && e !== T0 && e !== v0 && e !== _0 && e !== P0 && e !== I0;
}
function B0(e) {
  return !ai(e) && e !== oi;
}
function Nr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Pu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Iu = 1, xo = 2, Ou = 3, Du = 4, er = 5;
function j0(e, t, r, n, i, o, a, s) {
  var l, h = 0, c = null, f = !1, d = !1, m = n !== -1, w = -1, y = M0(Nr(e, 0)) && B0(Nr(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = Nr(e, l), !Yr(h))
        return er;
      y = y && Rs(h, c, s), c = h;
    }
  else {
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = Nr(e, l), h === Wr)
        f = !0, m && (d = d || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!Yr(h))
        return er;
      y = y && Rs(h, c, s), c = h;
    }
    d = d || m && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !f && !d ? y && !a && !i(e) ? Iu : o === Vr ? er : xo : r > 9 && Pu(e) ? er : a ? o === Vr ? er : xo : d ? Du : Ou;
}
function H0(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Vr ? '""' : "''";
    if (!e.noCompatMode && (D0.indexOf(t) !== -1 || N0.test(t)))
      return e.quotingType === Vr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(h) {
      return k0(e, h);
    }
    switch (j0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Iu:
        return t;
      case xo:
        return "'" + t.replace(/'/g, "''") + "'";
      case Ou:
        return "|" + Ps(t, e.indent) + Is(bs(t, o));
      case Du:
        return ">" + Ps(t, e.indent) + Is(bs(q0(t, a), o));
      case er:
        return '"' + G0(t) + '"';
      default:
        throw new cn("impossible error: invalid scalar style");
    }
  }();
}
function Ps(e, t) {
  var r = Pu(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function Is(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function q0(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var h = e.indexOf(`
`);
    return h = h !== -1 ? h : e.length, r.lastIndex = h, Os(e.slice(0, h), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", n += s + (!i && !o && l !== "" ? `
` : "") + Os(l, t), i = o;
  }
  return n;
}
function Os(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function G0(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Nr(e, i), n = Ce[r], !n && Yr(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || x0(r);
  return t;
}
function W0(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (at(e, t, s, !1, !1) || typeof s > "u" && at(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Ds(e, t, r, n) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = r.length; a < s; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (at(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && at(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Fo(e, t)), e.dump && Wr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function V0(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, l, h, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], h = r[l], e.replacer && (h = e.replacer.call(r, l, h)), at(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), at(e, t, h, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function Y0(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, l, h, c, f, d;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new cn("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    d = "", (!n || i !== "") && (d += Fo(e, t)), h = a[s], c = r[h], e.replacer && (c = e.replacer.call(r, h, c)), at(e, t + 1, h, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Wr === e.dump.charCodeAt(0) ? d += "?" : d += "? "), d += e.dump, f && (d += Fo(e, t)), at(e, t + 1, c, !0, f) && (e.dump && Wr === e.dump.charCodeAt(0) ? d += ":" : d += ": ", d += e.dump, i += d));
  e.tag = o, e.dump = i || "{}";
}
function Ns(e, t, r) {
  var n, i, o, a, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Au.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (Tu.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new cn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function at(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, Ns(e, r, !1) || Ns(e, r, !0);
  var s = Au.call(e.dump), l = n, h;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, d;
  if (c && (f = e.duplicates.indexOf(r), d = f !== -1), (e.tag !== null && e.tag !== "?" || d || e.indent !== 2 && t > 0) && (i = !1), d && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && d && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (Y0(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (V0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Ds(e, t - 1, e.dump, i) : Ds(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (W0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && H0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new cn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (h = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? h = "!" + h : h.slice(0, 18) === "tag:yaml.org,2002:" ? h = "!!" + h.slice(18) : h = "!<" + h + ">", e.dump = h + " " + e.dump);
  }
  return !0;
}
function z0(e, t) {
  var r = [], n = [], i, o;
  for (Lo(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function Lo(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Lo(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        Lo(e[n[i]], t, r);
}
function X0(e, t) {
  t = t || {};
  var r = new U0(t);
  r.noRefs || z0(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), at(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
_u.dump = X0;
var Nu = ta, K0 = _u;
function sa(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
_e.Type = Ne;
_e.Schema = Wc;
_e.FAILSAFE_SCHEMA = Xc;
_e.JSON_SCHEMA = tu;
_e.CORE_SCHEMA = ru;
_e.DEFAULT_SCHEMA = na;
_e.load = Nu.load;
_e.loadAll = Nu.loadAll;
_e.dump = K0.dump;
_e.YAMLException = ln;
_e.types = {
  binary: su,
  float: eu,
  map: zc,
  null: Kc,
  pairs: cu,
  set: uu,
  timestamp: ou,
  bool: Jc,
  int: Qc,
  merge: au,
  omap: lu,
  seq: Yc,
  str: Vc
};
_e.safeLoad = sa("safeLoad", "load");
_e.safeLoadAll = sa("safeLoadAll", "loadAll");
_e.safeDump = sa("safeDump", "dump");
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.Lazy = void 0;
class J0 {
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
wi.Lazy = J0;
var Uo = { exports: {} };
const Q0 = "2.0.0", Fu = 256, Z0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, ey = 16, ty = Fu - 6, ry = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var vi = {
  MAX_LENGTH: Fu,
  MAX_SAFE_COMPONENT_LENGTH: ey,
  MAX_SAFE_BUILD_LENGTH: ty,
  MAX_SAFE_INTEGER: Z0,
  RELEASE_TYPES: ry,
  SEMVER_SPEC_VERSION: Q0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ny = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var _i = ny;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = vi, o = _i;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], h = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const d = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [d, n]
  ], w = (A) => {
    for (const [T, S] of m)
      A = A.split(`${T}*`).join(`${T}{0,${S}}`).split(`${T}+`).join(`${T}{1,${S}}`);
    return A;
  }, y = (A, T, S) => {
    const D = w(T), x = f++;
    o(A, x, T), c[A] = x, l[x] = T, h[x] = D, a[x] = new RegExp(T, S ? "g" : void 0), s[x] = new RegExp(D, S ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${d}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Uo, Uo.exports);
var un = Uo.exports;
const iy = Object.freeze({ loose: !0 }), oy = Object.freeze({}), ay = (e) => e ? typeof e != "object" ? iy : e : oy;
var la = ay;
const Fs = /^[0-9]+$/, xu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Fs.test(e), n = Fs.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, sy = (e, t) => xu(t, e);
var Lu = {
  compareIdentifiers: xu,
  rcompareIdentifiers: sy
};
const xn = _i, { MAX_LENGTH: xs, MAX_SAFE_INTEGER: Ln } = vi, { safeRe: Un, t: kn } = un, ly = la, { compareIdentifiers: to } = Lu;
let cy = class Ze {
  constructor(t, r) {
    if (r = ly(r), t instanceof Ze) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > xs)
      throw new TypeError(
        `version is longer than ${xs} characters`
      );
    xn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Un[kn.LOOSE] : Un[kn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ln || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ln || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ln || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Ln)
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
    if (xn("SemVer.compare", this.version, this.options, t), !(t instanceof Ze)) {
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
      if (xn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return to(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ze || (t = new Ze(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (xn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return to(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Un[kn.PRERELEASELOOSE] : Un[kn.PRERELEASE]);
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
          n === !1 && (o = [r]), to(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Fe = cy;
const Ls = Fe, uy = (e, t, r = !1) => {
  if (e instanceof Ls)
    return e;
  try {
    return new Ls(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Er = uy;
const fy = Er, dy = (e, t) => {
  const r = fy(e, t);
  return r ? r.version : null;
};
var hy = dy;
const py = Er, my = (e, t) => {
  const r = py(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var gy = my;
const Us = Fe, yy = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Us(
      e instanceof Us ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var Ey = yy;
const ks = Er, wy = (e, t) => {
  const r = ks(e, null, !0), n = ks(t, null, !0), i = r.compare(n);
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
var vy = wy;
const _y = Fe, Ay = (e, t) => new _y(e, t).major;
var Ty = Ay;
const Sy = Fe, Cy = (e, t) => new Sy(e, t).minor;
var by = Cy;
const $y = Fe, Ry = (e, t) => new $y(e, t).patch;
var Py = Ry;
const Iy = Er, Oy = (e, t) => {
  const r = Iy(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Dy = Oy;
const Ms = Fe, Ny = (e, t, r) => new Ms(e, r).compare(new Ms(t, r));
var ze = Ny;
const Fy = ze, xy = (e, t, r) => Fy(t, e, r);
var Ly = xy;
const Uy = ze, ky = (e, t) => Uy(e, t, !0);
var My = ky;
const Bs = Fe, By = (e, t, r) => {
  const n = new Bs(e, r), i = new Bs(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var ca = By;
const jy = ca, Hy = (e, t) => e.sort((r, n) => jy(r, n, t));
var qy = Hy;
const Gy = ca, Wy = (e, t) => e.sort((r, n) => Gy(n, r, t));
var Vy = Wy;
const Yy = ze, zy = (e, t, r) => Yy(e, t, r) > 0;
var Ai = zy;
const Xy = ze, Ky = (e, t, r) => Xy(e, t, r) < 0;
var ua = Ky;
const Jy = ze, Qy = (e, t, r) => Jy(e, t, r) === 0;
var Uu = Qy;
const Zy = ze, eE = (e, t, r) => Zy(e, t, r) !== 0;
var ku = eE;
const tE = ze, rE = (e, t, r) => tE(e, t, r) >= 0;
var fa = rE;
const nE = ze, iE = (e, t, r) => nE(e, t, r) <= 0;
var da = iE;
const oE = Uu, aE = ku, sE = Ai, lE = fa, cE = ua, uE = da, fE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return oE(e, r, n);
    case "!=":
      return aE(e, r, n);
    case ">":
      return sE(e, r, n);
    case ">=":
      return lE(e, r, n);
    case "<":
      return cE(e, r, n);
    case "<=":
      return uE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Mu = fE;
const dE = Fe, hE = Er, { safeRe: Mn, t: Bn } = un, pE = (e, t) => {
  if (e instanceof dE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Mn[Bn.COERCEFULL] : Mn[Bn.COERCE]);
  else {
    const l = t.includePrerelease ? Mn[Bn.COERCERTLFULL] : Mn[Bn.COERCERTL];
    let h;
    for (; (h = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || h.index + h[0].length !== r.index + r[0].length) && (r = h), l.lastIndex = h.index + h[1].length + h[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return hE(`${n}.${i}.${o}${a}${s}`, t);
};
var mE = pE;
class gE {
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
var yE = gE, ro, js;
function Xe() {
  if (js) return ro;
  js = 1;
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
        if (this.set = this.set.filter((N) => !y(N[0])), this.set.length === 0)
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
      const b = ((this.options.includePrerelease && m) | (this.options.loose && w)) + ":" + $, N = n.get(b);
      if (N)
        return N;
      const I = this.options.loose, k = I ? l[h.HYPHENRANGELOOSE] : l[h.HYPHENRANGE];
      $ = $.replace(k, M(this.options.includePrerelease)), a("hyphen replace", $), $ = $.replace(l[h.COMPARATORTRIM], c), a("comparator trim", $), $ = $.replace(l[h.TILDETRIM], f), a("tilde trim", $), $ = $.replace(l[h.CARETTRIM], d), a("caret trim", $);
      let G = $.split(" ").map((U) => S(U, this.options)).join(" ").split(/\s+/).map((U) => B(U, this.options));
      I && (G = G.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[h.COMPARATORLOOSE])))), a("range list", G);
      const j = /* @__PURE__ */ new Map(), K = G.map((U) => new o(U, this.options));
      for (const U of K) {
        if (y(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const he = [...j.values()];
      return n.set(b, he), he;
    }
    intersects($, O) {
      if (!($ instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => T(b, O) && $.set.some((N) => T(N, O) && b.every((I) => N.every((k) => I.intersects(k, O)))));
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
  ro = t;
  const r = yE, n = new r(), i = la, o = Ti(), a = _i, s = Fe, {
    safeRe: l,
    t: h,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = un, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: w } = vi, y = (P) => P.value === "<0.0.0-0", A = (P) => P.value === "", T = (P, $) => {
    let O = !0;
    const b = P.slice();
    let N = b.pop();
    for (; O && b.length; )
      O = b.every((I) => N.intersects(I, $)), N = b.pop();
    return O;
  }, S = (P, $) => (P = P.replace(l[h.BUILD], ""), a("comp", P, $), P = le(P, $), a("caret", P), P = x(P, $), a("tildes", P), P = Ue(P, $), a("xrange", P), P = q(P, $), a("stars", P), P), D = (P) => !P || P.toLowerCase() === "x" || P === "*", x = (P, $) => P.trim().split(/\s+/).map((O) => te(O, $)).join(" "), te = (P, $) => {
    const O = $.loose ? l[h.TILDELOOSE] : l[h.TILDE];
    return P.replace(O, (b, N, I, k, G) => {
      a("tilde", P, b, N, I, k, G);
      let j;
      return D(N) ? j = "" : D(I) ? j = `>=${N}.0.0 <${+N + 1}.0.0-0` : D(k) ? j = `>=${N}.${I}.0 <${N}.${+I + 1}.0-0` : G ? (a("replaceTilde pr", G), j = `>=${N}.${I}.${k}-${G} <${N}.${+I + 1}.0-0`) : j = `>=${N}.${I}.${k} <${N}.${+I + 1}.0-0`, a("tilde return", j), j;
    });
  }, le = (P, $) => P.trim().split(/\s+/).map((O) => V(O, $)).join(" "), V = (P, $) => {
    a("caret", P, $);
    const O = $.loose ? l[h.CARETLOOSE] : l[h.CARET], b = $.includePrerelease ? "-0" : "";
    return P.replace(O, (N, I, k, G, j) => {
      a("caret", P, N, I, k, G, j);
      let K;
      return D(I) ? K = "" : D(k) ? K = `>=${I}.0.0${b} <${+I + 1}.0.0-0` : D(G) ? I === "0" ? K = `>=${I}.${k}.0${b} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.0${b} <${+I + 1}.0.0-0` : j ? (a("replaceCaret pr", j), I === "0" ? k === "0" ? K = `>=${I}.${k}.${G}-${j} <${I}.${k}.${+G + 1}-0` : K = `>=${I}.${k}.${G}-${j} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.${G}-${j} <${+I + 1}.0.0-0`) : (a("no pr"), I === "0" ? k === "0" ? K = `>=${I}.${k}.${G}${b} <${I}.${k}.${+G + 1}-0` : K = `>=${I}.${k}.${G}${b} <${I}.${+k + 1}.0-0` : K = `>=${I}.${k}.${G} <${+I + 1}.0.0-0`), a("caret return", K), K;
    });
  }, Ue = (P, $) => (a("replaceXRanges", P, $), P.split(/\s+/).map((O) => E(O, $)).join(" ")), E = (P, $) => {
    P = P.trim();
    const O = $.loose ? l[h.XRANGELOOSE] : l[h.XRANGE];
    return P.replace(O, (b, N, I, k, G, j) => {
      a("xRange", P, b, N, I, k, G, j);
      const K = D(I), he = K || D(k), U = he || D(G), Je = U;
      return N === "=" && Je && (N = ""), j = $.includePrerelease ? "-0" : "", K ? N === ">" || N === "<" ? b = "<0.0.0-0" : b = "*" : N && Je ? (he && (k = 0), G = 0, N === ">" ? (N = ">=", he ? (I = +I + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : N === "<=" && (N = "<", he ? I = +I + 1 : k = +k + 1), N === "<" && (j = "-0"), b = `${N + I}.${k}.${G}${j}`) : he ? b = `>=${I}.0.0${j} <${+I + 1}.0.0-0` : U && (b = `>=${I}.${k}.0${j} <${I}.${+k + 1}.0-0`), a("xRange return", b), b;
    });
  }, q = (P, $) => (a("replaceStars", P, $), P.trim().replace(l[h.STAR], "")), B = (P, $) => (a("replaceGTE0", P, $), P.trim().replace(l[$.includePrerelease ? h.GTE0PRE : h.GTE0], "")), M = (P) => ($, O, b, N, I, k, G, j, K, he, U, Je) => (D(b) ? O = "" : D(N) ? O = `>=${b}.0.0${P ? "-0" : ""}` : D(I) ? O = `>=${b}.${N}.0${P ? "-0" : ""}` : k ? O = `>=${O}` : O = `>=${O}${P ? "-0" : ""}`, D(K) ? j = "" : D(he) ? j = `<${+K + 1}.0.0-0` : D(U) ? j = `<${K}.${+he + 1}.0-0` : Je ? j = `<=${K}.${he}.${U}-${Je}` : P ? j = `<${K}.${he}.${+U + 1}-0` : j = `<=${j}`, `${O} ${j}`.trim()), X = (P, $, O) => {
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
  return ro;
}
var no, Hs;
function Ti() {
  if (Hs) return no;
  Hs = 1;
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
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = c.match(f);
      if (!d)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new s(d[2], this.options.loose) : this.semver = e;
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
  no = t;
  const r = la, { safeRe: n, t: i } = un, o = Mu, a = _i, s = Fe, l = Xe();
  return no;
}
const EE = Xe(), wE = (e, t, r) => {
  try {
    t = new EE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Si = wE;
const vE = Xe(), _E = (e, t) => new vE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var AE = _E;
const TE = Fe, SE = Xe(), CE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new SE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new TE(n, r));
  }), n;
};
var bE = CE;
const $E = Fe, RE = Xe(), PE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new RE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new $E(n, r));
  }), n;
};
var IE = PE;
const io = Fe, OE = Xe(), qs = Ai, DE = (e, t) => {
  e = new OE(e, t);
  let r = new io("0.0.0");
  if (e.test(r) || (r = new io("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new io(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || qs(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || qs(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var NE = DE;
const FE = Xe(), xE = (e, t) => {
  try {
    return new FE(e, t).range || "*";
  } catch {
    return null;
  }
};
var LE = xE;
const UE = Fe, Bu = Ti(), { ANY: kE } = Bu, ME = Xe(), BE = Si, Gs = Ai, Ws = ua, jE = da, HE = fa, qE = (e, t, r, n) => {
  e = new UE(e, n), t = new ME(t, n);
  let i, o, a, s, l;
  switch (r) {
    case ">":
      i = Gs, o = jE, a = Ws, s = ">", l = ">=";
      break;
    case "<":
      i = Ws, o = HE, a = Gs, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (BE(e, t, n))
    return !1;
  for (let h = 0; h < t.set.length; ++h) {
    const c = t.set[h];
    let f = null, d = null;
    if (c.forEach((m) => {
      m.semver === kE && (m = new Bu(">=0.0.0")), f = f || m, d = d || m, i(m.semver, f.semver, n) ? f = m : a(m.semver, d.semver, n) && (d = m);
    }), f.operator === s || f.operator === l || (!d.operator || d.operator === s) && o(e, d.semver))
      return !1;
    if (d.operator === l && a(e, d.semver))
      return !1;
  }
  return !0;
};
var ha = qE;
const GE = ha, WE = (e, t, r) => GE(e, t, ">", r);
var VE = WE;
const YE = ha, zE = (e, t, r) => YE(e, t, "<", r);
var XE = zE;
const Vs = Xe(), KE = (e, t, r) => (e = new Vs(e, r), t = new Vs(t, r), e.intersects(t, r));
var JE = KE;
const QE = Si, ZE = ze;
var ew = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((c, f) => ZE(c, f, r));
  for (const c of a)
    QE(c, t, r) ? (o = c, i || (i = c)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, f] of n)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), h = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < h.length ? l : t;
};
const Ys = Xe(), pa = Ti(), { ANY: oo } = pa, Pr = Si, ma = ze, tw = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Ys(e, r), t = new Ys(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = nw(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, rw = [new pa(">=0.0.0-0")], zs = [new pa(">=0.0.0")], nw = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === oo) {
    if (t.length === 1 && t[0].semver === oo)
      return !0;
    r.includePrerelease ? e = rw : e = zs;
  }
  if (t.length === 1 && t[0].semver === oo) {
    if (r.includePrerelease)
      return !0;
    t = zs;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = Xs(i, m, r) : m.operator === "<" || m.operator === "<=" ? o = Ks(o, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = ma(i.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const m of n) {
    if (i && !Pr(m, String(i), r) || o && !Pr(m, String(o), r))
      return null;
    for (const w of t)
      if (!Pr(m, String(w), r))
        return !1;
    return !0;
  }
  let s, l, h, c, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, d = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", h = h || m.operator === "<" || m.operator === "<=", i) {
      if (d && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === d.major && m.semver.minor === d.minor && m.semver.patch === d.patch && (d = !1), m.operator === ">" || m.operator === ">=") {
        if (s = Xs(i, m, r), s === m && s !== i)
          return !1;
      } else if (i.operator === ">=" && !Pr(i.semver, String(m), r))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = Ks(o, m, r), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !Pr(o.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && h && !o && a !== 0 || o && c && !i && a !== 0 || d || f);
}, Xs = (e, t, r) => {
  if (!e)
    return t;
  const n = ma(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Ks = (e, t, r) => {
  if (!e)
    return t;
  const n = ma(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var iw = tw;
const ao = un, Js = vi, ow = Fe, Qs = Lu, aw = Er, sw = hy, lw = gy, cw = Ey, uw = vy, fw = Ty, dw = by, hw = Py, pw = Dy, mw = ze, gw = Ly, yw = My, Ew = ca, ww = qy, vw = Vy, _w = Ai, Aw = ua, Tw = Uu, Sw = ku, Cw = fa, bw = da, $w = Mu, Rw = mE, Pw = Ti(), Iw = Xe(), Ow = Si, Dw = AE, Nw = bE, Fw = IE, xw = NE, Lw = LE, Uw = ha, kw = VE, Mw = XE, Bw = JE, jw = ew, Hw = iw;
var ju = {
  parse: aw,
  valid: sw,
  clean: lw,
  inc: cw,
  diff: uw,
  major: fw,
  minor: dw,
  patch: hw,
  prerelease: pw,
  compare: mw,
  rcompare: gw,
  compareLoose: yw,
  compareBuild: Ew,
  sort: ww,
  rsort: vw,
  gt: _w,
  lt: Aw,
  eq: Tw,
  neq: Sw,
  gte: Cw,
  lte: bw,
  cmp: $w,
  coerce: Rw,
  Comparator: Pw,
  Range: Iw,
  satisfies: Ow,
  toComparators: Dw,
  maxSatisfying: Nw,
  minSatisfying: Fw,
  minVersion: xw,
  validRange: Lw,
  outside: Uw,
  gtr: kw,
  ltr: Mw,
  intersects: Bw,
  simplifyRange: jw,
  subset: Hw,
  SemVer: ow,
  re: ao.re,
  src: ao.src,
  tokens: ao.t,
  SEMVER_SPEC_VERSION: Js.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Js.RELEASE_TYPES,
  compareIdentifiers: Qs.compareIdentifiers,
  rcompareIdentifiers: Qs.rcompareIdentifiers
}, fn = {}, si = { exports: {} };
si.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", h = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", d = "[object Error]", m = "[object Function]", w = "[object GeneratorFunction]", y = "[object Map]", A = "[object Number]", T = "[object Null]", S = "[object Object]", D = "[object Promise]", x = "[object Proxy]", te = "[object RegExp]", le = "[object Set]", V = "[object String]", Ue = "[object Symbol]", E = "[object Undefined]", q = "[object WeakMap]", B = "[object ArrayBuffer]", M = "[object DataView]", X = "[object Float32Array]", P = "[object Float64Array]", $ = "[object Int8Array]", O = "[object Int16Array]", b = "[object Int32Array]", N = "[object Uint8Array]", I = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, K = /^\[object .+?Constructor\]$/, he = /^(?:0|[1-9]\d*)$/, U = {};
  U[X] = U[P] = U[$] = U[O] = U[b] = U[N] = U[I] = U[k] = U[G] = !0, U[s] = U[l] = U[B] = U[c] = U[M] = U[f] = U[d] = U[m] = U[y] = U[A] = U[S] = U[te] = U[le] = U[V] = U[q] = !1;
  var Je = typeof Re == "object" && Re && Re.Object === Object && Re, p = typeof self == "object" && self && self.Object === Object && self, u = Je || p || Function("return this")(), C = t && !t.nodeType && t, _ = C && !0 && e && !e.nodeType && e, Y = _ && _.exports === C, re = Y && Je.process, ae = function() {
    try {
      return re && re.binding && re.binding("util");
    } catch {
    }
  }(), ye = ae && ae.isTypedArray;
  function Ae(g, v) {
    for (var R = -1, F = g == null ? 0 : g.length, Z = 0, H = []; ++R < F; ) {
      var se = g[R];
      v(se, R, g) && (H[Z++] = se);
    }
    return H;
  }
  function st(g, v) {
    for (var R = -1, F = v.length, Z = g.length; ++R < F; )
      g[Z + R] = v[R];
    return g;
  }
  function fe(g, v) {
    for (var R = -1, F = g == null ? 0 : g.length; ++R < F; )
      if (v(g[R], R, g))
        return !0;
    return !1;
  }
  function He(g, v) {
    for (var R = -1, F = Array(g); ++R < g; )
      F[R] = v(R);
    return F;
  }
  function Fi(g) {
    return function(v) {
      return g(v);
    };
  }
  function mn(g, v) {
    return g.has(v);
  }
  function _r(g, v) {
    return g == null ? void 0 : g[v];
  }
  function gn(g) {
    var v = -1, R = Array(g.size);
    return g.forEach(function(F, Z) {
      R[++v] = [Z, F];
    }), R;
  }
  function lf(g, v) {
    return function(R) {
      return g(v(R));
    };
  }
  function cf(g) {
    var v = -1, R = Array(g.size);
    return g.forEach(function(F) {
      R[++v] = F;
    }), R;
  }
  var uf = Array.prototype, ff = Function.prototype, yn = Object.prototype, xi = u["__core-js_shared__"], Ta = ff.toString, Qe = yn.hasOwnProperty, Sa = function() {
    var g = /[^.]+$/.exec(xi && xi.keys && xi.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Ca = yn.toString, df = RegExp(
    "^" + Ta.call(Qe).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ba = Y ? u.Buffer : void 0, En = u.Symbol, $a = u.Uint8Array, Ra = yn.propertyIsEnumerable, hf = uf.splice, Rt = En ? En.toStringTag : void 0, Pa = Object.getOwnPropertySymbols, pf = ba ? ba.isBuffer : void 0, mf = lf(Object.keys, Object), Li = Yt(u, "DataView"), Ar = Yt(u, "Map"), Ui = Yt(u, "Promise"), ki = Yt(u, "Set"), Mi = Yt(u, "WeakMap"), Tr = Yt(Object, "create"), gf = Ot(Li), yf = Ot(Ar), Ef = Ot(Ui), wf = Ot(ki), vf = Ot(Mi), Ia = En ? En.prototype : void 0, Bi = Ia ? Ia.valueOf : void 0;
  function Pt(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.clear(); ++v < R; ) {
      var F = g[v];
      this.set(F[0], F[1]);
    }
  }
  function _f() {
    this.__data__ = Tr ? Tr(null) : {}, this.size = 0;
  }
  function Af(g) {
    var v = this.has(g) && delete this.__data__[g];
    return this.size -= v ? 1 : 0, v;
  }
  function Tf(g) {
    var v = this.__data__;
    if (Tr) {
      var R = v[g];
      return R === n ? void 0 : R;
    }
    return Qe.call(v, g) ? v[g] : void 0;
  }
  function Sf(g) {
    var v = this.__data__;
    return Tr ? v[g] !== void 0 : Qe.call(v, g);
  }
  function Cf(g, v) {
    var R = this.__data__;
    return this.size += this.has(g) ? 0 : 1, R[g] = Tr && v === void 0 ? n : v, this;
  }
  Pt.prototype.clear = _f, Pt.prototype.delete = Af, Pt.prototype.get = Tf, Pt.prototype.has = Sf, Pt.prototype.set = Cf;
  function rt(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.clear(); ++v < R; ) {
      var F = g[v];
      this.set(F[0], F[1]);
    }
  }
  function bf() {
    this.__data__ = [], this.size = 0;
  }
  function $f(g) {
    var v = this.__data__, R = vn(v, g);
    if (R < 0)
      return !1;
    var F = v.length - 1;
    return R == F ? v.pop() : hf.call(v, R, 1), --this.size, !0;
  }
  function Rf(g) {
    var v = this.__data__, R = vn(v, g);
    return R < 0 ? void 0 : v[R][1];
  }
  function Pf(g) {
    return vn(this.__data__, g) > -1;
  }
  function If(g, v) {
    var R = this.__data__, F = vn(R, g);
    return F < 0 ? (++this.size, R.push([g, v])) : R[F][1] = v, this;
  }
  rt.prototype.clear = bf, rt.prototype.delete = $f, rt.prototype.get = Rf, rt.prototype.has = Pf, rt.prototype.set = If;
  function It(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.clear(); ++v < R; ) {
      var F = g[v];
      this.set(F[0], F[1]);
    }
  }
  function Of() {
    this.size = 0, this.__data__ = {
      hash: new Pt(),
      map: new (Ar || rt)(),
      string: new Pt()
    };
  }
  function Df(g) {
    var v = _n(this, g).delete(g);
    return this.size -= v ? 1 : 0, v;
  }
  function Nf(g) {
    return _n(this, g).get(g);
  }
  function Ff(g) {
    return _n(this, g).has(g);
  }
  function xf(g, v) {
    var R = _n(this, g), F = R.size;
    return R.set(g, v), this.size += R.size == F ? 0 : 1, this;
  }
  It.prototype.clear = Of, It.prototype.delete = Df, It.prototype.get = Nf, It.prototype.has = Ff, It.prototype.set = xf;
  function wn(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.__data__ = new It(); ++v < R; )
      this.add(g[v]);
  }
  function Lf(g) {
    return this.__data__.set(g, n), this;
  }
  function Uf(g) {
    return this.__data__.has(g);
  }
  wn.prototype.add = wn.prototype.push = Lf, wn.prototype.has = Uf;
  function lt(g) {
    var v = this.__data__ = new rt(g);
    this.size = v.size;
  }
  function kf() {
    this.__data__ = new rt(), this.size = 0;
  }
  function Mf(g) {
    var v = this.__data__, R = v.delete(g);
    return this.size = v.size, R;
  }
  function Bf(g) {
    return this.__data__.get(g);
  }
  function jf(g) {
    return this.__data__.has(g);
  }
  function Hf(g, v) {
    var R = this.__data__;
    if (R instanceof rt) {
      var F = R.__data__;
      if (!Ar || F.length < r - 1)
        return F.push([g, v]), this.size = ++R.size, this;
      R = this.__data__ = new It(F);
    }
    return R.set(g, v), this.size = R.size, this;
  }
  lt.prototype.clear = kf, lt.prototype.delete = Mf, lt.prototype.get = Bf, lt.prototype.has = jf, lt.prototype.set = Hf;
  function qf(g, v) {
    var R = An(g), F = !R && id(g), Z = !R && !F && ji(g), H = !R && !F && !Z && Ma(g), se = R || F || Z || H, pe = se ? He(g.length, String) : [], Ee = pe.length;
    for (var ne in g)
      Qe.call(g, ne) && !(se && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ne == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Z && (ne == "offset" || ne == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (ne == "buffer" || ne == "byteLength" || ne == "byteOffset") || // Skip index properties.
      Zf(ne, Ee))) && pe.push(ne);
    return pe;
  }
  function vn(g, v) {
    for (var R = g.length; R--; )
      if (xa(g[R][0], v))
        return R;
    return -1;
  }
  function Gf(g, v, R) {
    var F = v(g);
    return An(g) ? F : st(F, R(g));
  }
  function Sr(g) {
    return g == null ? g === void 0 ? E : T : Rt && Rt in Object(g) ? Jf(g) : nd(g);
  }
  function Oa(g) {
    return Cr(g) && Sr(g) == s;
  }
  function Da(g, v, R, F, Z) {
    return g === v ? !0 : g == null || v == null || !Cr(g) && !Cr(v) ? g !== g && v !== v : Wf(g, v, R, F, Da, Z);
  }
  function Wf(g, v, R, F, Z, H) {
    var se = An(g), pe = An(v), Ee = se ? l : ct(g), ne = pe ? l : ct(v);
    Ee = Ee == s ? S : Ee, ne = ne == s ? S : ne;
    var ke = Ee == S, qe = ne == S, Te = Ee == ne;
    if (Te && ji(g)) {
      if (!ji(v))
        return !1;
      se = !0, ke = !1;
    }
    if (Te && !ke)
      return H || (H = new lt()), se || Ma(g) ? Na(g, v, R, F, Z, H) : Xf(g, v, Ee, R, F, Z, H);
    if (!(R & i)) {
      var Be = ke && Qe.call(g, "__wrapped__"), je = qe && Qe.call(v, "__wrapped__");
      if (Be || je) {
        var ut = Be ? g.value() : g, nt = je ? v.value() : v;
        return H || (H = new lt()), Z(ut, nt, R, F, H);
      }
    }
    return Te ? (H || (H = new lt()), Kf(g, v, R, F, Z, H)) : !1;
  }
  function Vf(g) {
    if (!ka(g) || td(g))
      return !1;
    var v = La(g) ? df : K;
    return v.test(Ot(g));
  }
  function Yf(g) {
    return Cr(g) && Ua(g.length) && !!U[Sr(g)];
  }
  function zf(g) {
    if (!rd(g))
      return mf(g);
    var v = [];
    for (var R in Object(g))
      Qe.call(g, R) && R != "constructor" && v.push(R);
    return v;
  }
  function Na(g, v, R, F, Z, H) {
    var se = R & i, pe = g.length, Ee = v.length;
    if (pe != Ee && !(se && Ee > pe))
      return !1;
    var ne = H.get(g);
    if (ne && H.get(v))
      return ne == v;
    var ke = -1, qe = !0, Te = R & o ? new wn() : void 0;
    for (H.set(g, v), H.set(v, g); ++ke < pe; ) {
      var Be = g[ke], je = v[ke];
      if (F)
        var ut = se ? F(je, Be, ke, v, g, H) : F(Be, je, ke, g, v, H);
      if (ut !== void 0) {
        if (ut)
          continue;
        qe = !1;
        break;
      }
      if (Te) {
        if (!fe(v, function(nt, Dt) {
          if (!mn(Te, Dt) && (Be === nt || Z(Be, nt, R, F, H)))
            return Te.push(Dt);
        })) {
          qe = !1;
          break;
        }
      } else if (!(Be === je || Z(Be, je, R, F, H))) {
        qe = !1;
        break;
      }
    }
    return H.delete(g), H.delete(v), qe;
  }
  function Xf(g, v, R, F, Z, H, se) {
    switch (R) {
      case M:
        if (g.byteLength != v.byteLength || g.byteOffset != v.byteOffset)
          return !1;
        g = g.buffer, v = v.buffer;
      case B:
        return !(g.byteLength != v.byteLength || !H(new $a(g), new $a(v)));
      case c:
      case f:
      case A:
        return xa(+g, +v);
      case d:
        return g.name == v.name && g.message == v.message;
      case te:
      case V:
        return g == v + "";
      case y:
        var pe = gn;
      case le:
        var Ee = F & i;
        if (pe || (pe = cf), g.size != v.size && !Ee)
          return !1;
        var ne = se.get(g);
        if (ne)
          return ne == v;
        F |= o, se.set(g, v);
        var ke = Na(pe(g), pe(v), F, Z, H, se);
        return se.delete(g), ke;
      case Ue:
        if (Bi)
          return Bi.call(g) == Bi.call(v);
    }
    return !1;
  }
  function Kf(g, v, R, F, Z, H) {
    var se = R & i, pe = Fa(g), Ee = pe.length, ne = Fa(v), ke = ne.length;
    if (Ee != ke && !se)
      return !1;
    for (var qe = Ee; qe--; ) {
      var Te = pe[qe];
      if (!(se ? Te in v : Qe.call(v, Te)))
        return !1;
    }
    var Be = H.get(g);
    if (Be && H.get(v))
      return Be == v;
    var je = !0;
    H.set(g, v), H.set(v, g);
    for (var ut = se; ++qe < Ee; ) {
      Te = pe[qe];
      var nt = g[Te], Dt = v[Te];
      if (F)
        var Ba = se ? F(Dt, nt, Te, v, g, H) : F(nt, Dt, Te, g, v, H);
      if (!(Ba === void 0 ? nt === Dt || Z(nt, Dt, R, F, H) : Ba)) {
        je = !1;
        break;
      }
      ut || (ut = Te == "constructor");
    }
    if (je && !ut) {
      var Tn = g.constructor, Sn = v.constructor;
      Tn != Sn && "constructor" in g && "constructor" in v && !(typeof Tn == "function" && Tn instanceof Tn && typeof Sn == "function" && Sn instanceof Sn) && (je = !1);
    }
    return H.delete(g), H.delete(v), je;
  }
  function Fa(g) {
    return Gf(g, sd, Qf);
  }
  function _n(g, v) {
    var R = g.__data__;
    return ed(v) ? R[typeof v == "string" ? "string" : "hash"] : R.map;
  }
  function Yt(g, v) {
    var R = _r(g, v);
    return Vf(R) ? R : void 0;
  }
  function Jf(g) {
    var v = Qe.call(g, Rt), R = g[Rt];
    try {
      g[Rt] = void 0;
      var F = !0;
    } catch {
    }
    var Z = Ca.call(g);
    return F && (v ? g[Rt] = R : delete g[Rt]), Z;
  }
  var Qf = Pa ? function(g) {
    return g == null ? [] : (g = Object(g), Ae(Pa(g), function(v) {
      return Ra.call(g, v);
    }));
  } : ld, ct = Sr;
  (Li && ct(new Li(new ArrayBuffer(1))) != M || Ar && ct(new Ar()) != y || Ui && ct(Ui.resolve()) != D || ki && ct(new ki()) != le || Mi && ct(new Mi()) != q) && (ct = function(g) {
    var v = Sr(g), R = v == S ? g.constructor : void 0, F = R ? Ot(R) : "";
    if (F)
      switch (F) {
        case gf:
          return M;
        case yf:
          return y;
        case Ef:
          return D;
        case wf:
          return le;
        case vf:
          return q;
      }
    return v;
  });
  function Zf(g, v) {
    return v = v ?? a, !!v && (typeof g == "number" || he.test(g)) && g > -1 && g % 1 == 0 && g < v;
  }
  function ed(g) {
    var v = typeof g;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? g !== "__proto__" : g === null;
  }
  function td(g) {
    return !!Sa && Sa in g;
  }
  function rd(g) {
    var v = g && g.constructor, R = typeof v == "function" && v.prototype || yn;
    return g === R;
  }
  function nd(g) {
    return Ca.call(g);
  }
  function Ot(g) {
    if (g != null) {
      try {
        return Ta.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function xa(g, v) {
    return g === v || g !== g && v !== v;
  }
  var id = Oa(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Oa : function(g) {
    return Cr(g) && Qe.call(g, "callee") && !Ra.call(g, "callee");
  }, An = Array.isArray;
  function od(g) {
    return g != null && Ua(g.length) && !La(g);
  }
  var ji = pf || cd;
  function ad(g, v) {
    return Da(g, v);
  }
  function La(g) {
    if (!ka(g))
      return !1;
    var v = Sr(g);
    return v == m || v == w || v == h || v == x;
  }
  function Ua(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function ka(g) {
    var v = typeof g;
    return g != null && (v == "object" || v == "function");
  }
  function Cr(g) {
    return g != null && typeof g == "object";
  }
  var Ma = ye ? Fi(ye) : Yf;
  function sd(g) {
    return od(g) ? qf(g) : zf(g);
  }
  function ld() {
    return [];
  }
  function cd() {
    return !1;
  }
  e.exports = ad;
})(si, si.exports);
var qw = si.exports;
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.DownloadedUpdateHelper = void 0;
fn.createTempUpdateFile = zw;
const Gw = tn, Ww = St, Zs = qw, Ft = bt, kr = oe;
class Vw {
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
    return kr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Zs(this.versionInfo, r) && Zs(this.fileInfo.info, n.info) && await (0, Ft.pathExists)(t) ? t : null;
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
    } catch (h) {
      let c = "No cached update info available";
      return h.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${h.message})`), r.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = kr.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Ft.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await Yw(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return kr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
fn.DownloadedUpdateHelper = Vw;
function Yw(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, Gw.createHash)(t);
    a.on("error", o).setEncoding(r), (0, Ww.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function zw(e, t, r) {
  let n = 0, i = kr.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Ft.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = kr.join(t, `${n++}-${e}`);
    }
  return i;
}
var Ci = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
ga.getAppCacheDir = Kw;
const so = oe, Xw = ui;
function Kw() {
  const e = (0, Xw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || so.join(e, "AppData", "Local") : process.platform === "darwin" ? t = so.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || so.join(e, ".cache"), t;
}
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.ElectronAppAdapter = void 0;
const el = oe, Jw = ga;
class Qw {
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
    return this.isPackaged ? el.join(process.resourcesPath, "app-update.yml") : el.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Jw.getAppCacheDir)();
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
Ci.ElectronAppAdapter = Qw;
var Hu = {};
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
      return await s.cancellationToken.createPromise((l, h, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (d) => {
            d == null ? l(a) : h(d);
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
    addRedirectHandlers(o, a, s, l, h) {
      o.on("redirect", (c, f, d) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : h(t.HttpExecutor.prepareRedirectUrlOptions(d, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Hu);
var dn = {}, Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.newBaseUrl = Zw;
Ke.newUrlFromBase = ev;
Ke.getChannelFilename = tv;
const qu = Ct;
function Zw(e) {
  const t = new qu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function ev(e, t, r = !1) {
  const n = new qu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function tv(e) {
  return `${e}.yml`;
}
var ue = {}, rv = "[object Symbol]", Gu = /[\\^$.*+?()[\]{}|]/g, nv = RegExp(Gu.source), iv = typeof Re == "object" && Re && Re.Object === Object && Re, ov = typeof self == "object" && self && self.Object === Object && self, av = iv || ov || Function("return this")(), sv = Object.prototype, lv = sv.toString, tl = av.Symbol, rl = tl ? tl.prototype : void 0, nl = rl ? rl.toString : void 0;
function cv(e) {
  if (typeof e == "string")
    return e;
  if (fv(e))
    return nl ? nl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function uv(e) {
  return !!e && typeof e == "object";
}
function fv(e) {
  return typeof e == "symbol" || uv(e) && lv.call(e) == rv;
}
function dv(e) {
  return e == null ? "" : cv(e);
}
function hv(e) {
  return e = dv(e), e && nv.test(e) ? e.replace(Gu, "\\$&") : e;
}
var Wu = hv;
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.Provider = void 0;
ue.findFile = Ev;
ue.parseUpdateInfo = wv;
ue.getFileList = Vu;
ue.resolveFiles = vv;
const At = de, pv = _e, mv = Ct, li = Ke, gv = Wu;
class yv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const o = (0, li.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, li.newUrlFromBase)(`${t.pathname.replace(new RegExp(gv(n), "g"), r)}.blockmap`, i ? new mv.URL(i) : t), o];
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
ue.Provider = yv;
function Ev(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, At.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (n = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return o || (r == null ? e[0] : e.find((a) => !r.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function wv(e, t, r) {
  if (e == null)
    throw (0, At.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, pv.load)(e);
  } catch (i) {
    throw (0, At.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Vu(e) {
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
function vv(e, t, r = (n) => n) {
  const i = Vu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, At.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, At.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, li.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, li.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.GenericProvider = void 0;
const il = de, lo = Ke, co = ue;
class _v extends co.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, lo.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, lo.getChannelFilename)(this.channel), r = (0, lo.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, co.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof il.HttpError && i.statusCode === 404)
          throw (0, il.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, co.resolveFiles)(t, this.baseUrl);
  }
}
dn.GenericProvider = _v;
var bi = {}, $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.BitbucketProvider = void 0;
const ol = de, uo = Ke, fo = ue;
class Av extends fo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, uo.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new ol.CancellationToken(), r = (0, uo.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, uo.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, fo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, ol.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, fo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
$i.BitbucketProvider = Av;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.GitHubProvider = Tt.BaseGitHubProvider = void 0;
Tt.computeReleaseNotes = zu;
const it = de, Ut = ju, Tv = Ct, ir = Ke, ko = ue, ho = /\/tag\/([^/]+)$/;
class Yu extends ko.Provider {
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
Tt.BaseGitHubProvider = Yu;
class Sv extends Yu {
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
    let h = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Ut.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (A === null)
          c = ho.exec(h.element("link").attribute("href"))[1];
        else
          for (const T of l.getElements("entry")) {
            const S = ho.exec(T.element("link").attribute("href"));
            if (S === null)
              continue;
            const D = S[1], x = ((n = Ut.prerelease(D)) === null || n === void 0 ? void 0 : n[0]) || null, te = !A || ["alpha", "beta"].includes(A), le = x !== null && !["alpha", "beta"].includes(String(x));
            if (te && !le && !(A === "beta" && x === "alpha")) {
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
          if (ho.exec(A.element("link").attribute("href"))[1] === c) {
            h = A;
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
    let f, d = "", m = "";
    const w = async (A) => {
      d = (0, ir.getChannelFilename)(A), m = (0, ir.newUrlFromBase)(this.getBaseDownloadPath(String(c), d), this.baseUrl);
      const T = this.createRequestOptions(m);
      try {
        return await this.executor.request(T, a);
      } catch (S) {
        throw S instanceof it.HttpError && S.statusCode === 404 ? (0, it.newError)(`Cannot find ${d} in the latest release artifacts (${m}): ${S.stack || S.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : S;
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
    const y = (0, ko.parseUpdateInfo)(f, d, m);
    return y.releaseName == null && (y.releaseName = h.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = zu(this.updater.currentVersion, this.updater.fullChangelog, l, h)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, ir.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Tv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
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
    return (0, ko.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Tt.GitHubProvider = Sv;
function al(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function zu(e, t, r, n) {
  if (!t)
    return al(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Ut.valid(a) && Ut.lt(e, a) && i.push({
      version: a,
      note: al(o)
    });
  }
  return i.sort((o, a) => Ut.rcompare(o.version, a.version));
}
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.GitLabProvider = void 0;
const be = de, po = Ct, Cv = Wu, jn = Ke, mo = ue;
class bv extends mo.Provider {
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
    this.baseApiUrl = (0, jn.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new be.CancellationToken(), r = (0, jn.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const d = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, m = await this.httpRequest(r, d, t);
      if (!m)
        throw (0, be.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(m);
    } catch (d) {
      throw (0, be.newError)(`Unable to find latest release on GitLab (${r}): ${d.stack || d.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let o = null, a = "", s = null;
    const l = async (d) => {
      a = (0, jn.getChannelFilename)(d);
      const m = n.assets.links.find((y) => y.name === a);
      if (!m)
        throw (0, be.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new po.URL(m.direct_asset_url);
      const w = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const y = await this.httpRequest(s, w, t);
        if (!y)
          throw (0, be.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return y;
      } catch (y) {
        throw y instanceof be.HttpError && y.statusCode === 404 ? (0, be.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
    };
    try {
      o = await l(this.channel);
    } catch (d) {
      if (this.channel !== this.getDefaultChannelName())
        o = await l(this.getDefaultChannelName());
      else
        throw d;
    }
    if (!o)
      throw (0, be.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const h = (0, mo.parseUpdateInfo)(o, a, s);
    h.releaseName == null && (h.releaseName = n.name), h.releaseNotes == null && (h.releaseNotes = n.description || null);
    const c = /* @__PURE__ */ new Map();
    for (const d of n.assets.links)
      c.set(this.normalizeFilename(d.name), d.direct_asset_url);
    const f = {
      tag: i,
      assets: c,
      ...h
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
        return new po.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new be.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const o = (0, jn.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, r);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof be.HttpError && a.statusCode === 404)
          continue;
        throw (0, be.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, be.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const l = n.replace(new RegExp(Cv(r), "g"), t);
      o = this.findBlockMapInAssets(s, l);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [a, s] = await this.findBlockMapUrlsFromAssets(r, n, o);
      if (!s)
        throw (0, be.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, be.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, mo.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, be.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new po.URL(o),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Ri.GitLabProvider = bv;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.KeygenProvider = void 0;
const sl = de, go = Ke, yo = ue;
class $v extends yo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, go.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new sl.CancellationToken(), r = (0, go.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, go.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, yo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, sl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, yo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Pi.KeygenProvider = $v;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.PrivateGitHubProvider = void 0;
const Kt = de, Rv = _e, Pv = oe, ll = Ct, cl = Ke, Iv = Tt, Ov = ue;
class Dv extends Iv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Kt.CancellationToken(), r = (0, cl.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, Kt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ll.URL(i.url);
    let a;
    try {
      a = (0, Rv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, cl.newUrlFromBase)(n, this.baseUrl);
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
    return (0, Ov.getFileList)(t).map((r) => {
      const n = Pv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, Kt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ll.URL(i.url),
        info: r
      };
    });
  }
}
Ii.PrivateGitHubProvider = Dv;
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.isUrlProbablySupportMultiRangeRequests = Xu;
bi.createClient = kv;
const Hn = de, Nv = $i, ul = dn, Fv = Tt, xv = Ri, Lv = Pi, Uv = Ii;
function Xu(e) {
  return !e.includes("s3.amazonaws.com");
}
function kv(e, t, r) {
  if (typeof e == "string")
    throw (0, Hn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Fv.GitHubProvider(i, t, r) : new Uv.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new Nv.BitbucketProvider(e, t, r);
    case "gitlab":
      return new xv.GitLabProvider(e, t, r);
    case "keygen":
      return new Lv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new ul.GenericProvider({
        provider: "generic",
        url: (0, Hn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new ul.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Xu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Hn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, Hn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Oi = {}, hn = {}, wr = {}, Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.OperationKind = void 0;
Vt.computeOperations = Mv;
var kt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(kt || (Vt.OperationKind = kt = {}));
function Mv(e, t, r) {
  const n = dl(e.files), i = dl(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, h = n.get(l);
  if (h == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: d, checksumToOldSize: m } = jv(n.get(l), h.offset, r);
  let w = a.offset;
  for (let y = 0; y < c.checksums.length; w += c.sizes[y], y++) {
    const A = c.sizes[y], T = c.checksums[y];
    let S = d.get(T);
    S != null && m.get(T) !== A && (r.warn(`Checksum ("${T}") matches, but size differs (old: ${m.get(T)}, new: ${A})`), S = void 0), S === void 0 ? (f++, o != null && o.kind === kt.DOWNLOAD && o.end === w ? o.end += A : (o = {
      kind: kt.DOWNLOAD,
      start: w,
      end: w + A
      // oldBlocks: null,
    }, fl(o, s, T, y))) : o != null && o.kind === kt.COPY && o.end === S ? o.end += A : (o = {
      kind: kt.COPY,
      start: S,
      end: S + A
      // oldBlocks: [checksum]
    }, fl(o, s, T, y));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Bv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function fl(e, t, r, n) {
  if (Bv && t.length !== 0) {
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
function jv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], h = i.get(s);
    if (h === void 0)
      n.set(s, o), i.set(s, l);
    else if (r.debug != null) {
      const c = h === l ? "(same size)" : `(size: ${h}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function dl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.DataSplitter = void 0;
wr.copyData = Ku;
const qn = de, Hv = St, qv = en, Gv = Vt, hl = Buffer.from(`\r
\r
`);
var dt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(dt || (dt = {}));
function Ku(e, t, r, n, i) {
  const o = (0, Hv.createReadStream)("", {
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
class Wv extends qv.Writable {
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
      throw (0, qn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
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
              throw (0, qn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, qn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
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
        if (a.kind !== Gv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Ku(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(hl, r);
    if (n !== -1)
      return n + hl.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, qn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
wr.DataSplitter = Wv;
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.executeTasksUsingMultipleRangeRequests = Vv;
Di.checkIsRangesSupported = Bo;
const Mo = de, pl = wr, ml = Vt;
function Vv(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    Yv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function Yv(e, t, r, n, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), h = [];
  for (let d = t.start; d < t.end; d++) {
    const m = t.tasks[d];
    m.kind === ml.OperationKind.DOWNLOAD && (o += `${m.start}-${m.end - 1}, `, l.set(a, d), a++, h.push(m.end - m.start), s += m.end - m.start);
  }
  if (a <= 1) {
    const d = (m) => {
      if (m >= t.end) {
        n();
        return;
      }
      const w = t.tasks[m++];
      if (w.kind === ml.OperationKind.COPY)
        (0, pl.copyData)(w, r, t.oldFileFd, i, () => d(m));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${w.start}-${w.end - 1}`;
        const A = e.httpExecutor.createRequest(y, (T) => {
          T.on("error", i), Bo(T, i) && (T.pipe(r, {
            end: !1
          }), T.once("end", () => d(m)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(A, i), A.end();
      }
    };
    d(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (d) => {
    if (!Bo(d, i))
      return;
    const m = (0, Mo.safeGetHeader)(d, "content-type"), w = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(m);
    if (w == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const y = new pl.DataSplitter(r, t, l, w[1] || w[2], h, n, s, e.options.onProgress);
    y.on("error", i), d.pipe(y), d.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Bo(e, t) {
  if (e.statusCode >= 400)
    return t((0, Mo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Mo.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.ProgressDifferentialDownloadCallbackTransform = void 0;
const zv = en;
var or;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(or || (or = {}));
class Xv extends zv.Transform {
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
Ni.ProgressDifferentialDownloadCallbackTransform = Xv;
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.DifferentialDownloader = void 0;
const Ir = de, Eo = bt, Kv = St, Jv = wr, Qv = Ct, Gn = Vt, gl = Di, Zv = Ni;
class e_ {
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
    return (0, Ir.configureRequestUrl)(this.options.newUrl, t), (0, Ir.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Gn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const h = l.end - l.start;
      l.kind === Gn.OperationKind.DOWNLOAD ? o += h : a += h;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return n.info(`Full: ${yl(s)}, To download: ${yl(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Eo.close)(i.descriptor).catch((o) => {
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
    const n = await (0, Eo.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Eo.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Kv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let h;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const T = [];
        let S = 0;
        for (const x of t)
          x.kind === Gn.OperationKind.DOWNLOAD && (T.push(x.end - x.start), S += x.end - x.start);
        const D = {
          expectedByteCounts: T,
          grandTotal: S
        };
        h = new Zv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(h);
      }
      const c = new Ir.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (T) {
            s(T);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const T of l)
        T.on("error", s), f == null ? f = T : f = f.pipe(T);
      const d = l[0];
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, gl.executeTasksUsingMultipleRangeRequests)(this, t, d, n, s), m(0);
        return;
      }
      let w = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", m = (T) => {
        var S, D;
        if (T >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const x = t[T++];
        if (x.kind === Gn.OperationKind.COPY) {
          h && h.beginFileCopy(), (0, Jv.copyData)(x, d, n, s, () => m(T));
          return;
        }
        const te = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = te, (D = (S = this.logger) === null || S === void 0 ? void 0 : S.debug) === null || D === void 0 || D.call(S, `download range: ${te}`), h && h.beginRangeDownload();
        const le = this.httpExecutor.createRequest(A, (V) => {
          V.on("error", s), V.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && s((0, Ir.createHttpError)(V)), V.pipe(d, {
            end: !1
          }), V.once("end", () => {
            h && h.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => m(T), 1e3)) : m(T);
          });
        });
        le.on("redirect", (V, Ue, E) => {
          this.logger.info(`Redirect to ${t_(E)}`), y = E, (0, Ir.configureRequestUrl)(new Qv.URL(y), A), le.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(le, s), le.end();
      }, m(0);
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
        (0, gl.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
hn.DifferentialDownloader = e_;
function yl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function t_(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.GenericDifferentialDownloader = void 0;
const r_ = hn;
class n_ extends r_.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Oi.GenericDifferentialDownloader = n_;
var $t = {};
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
})($t);
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.NoOpLogger = wt.AppUpdater = void 0;
const $e = de, i_ = tn, o_ = ui, a_ = Hl, Ge = bt, s_ = _e, wo = wi, We = oe, xt = ju, El = fn, l_ = Ci, wl = Hu, c_ = dn, vo = bi, _o = Gl, u_ = Oi, Jt = $t;
class ya extends a_.EventEmitter {
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
        throw (0, $e.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, $e.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, wl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Ju();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new wo.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Jt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new wo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new wo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new l_.ElectronAppAdapter(), this.httpExecutor = new wl.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, xt.parse)(n);
    if (i == null)
      throw (0, $e.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = f_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new c_.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, vo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, vo.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = ya.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
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
    const i = await this.stagingUserIdPromise.value, a = $e.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, xt.parse)(t.version);
    if (r == null)
      throw (0, $e.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, xt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, xt.gt)(r, n), a = (0, xt.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, o_.release)();
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
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, vo.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new $e.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, $e.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new $e.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, $e.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof $e.CancellationError))
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
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, s_.load)(await (0, Ge.readFile)(this._appUpdateConfigPath, "utf-8"));
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
      if ($e.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = $e.UUID.v5((0, i_.randomBytes)(4096), $e.UUID.OID);
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
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new El.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (S) => this.emit(Jt.DOWNLOAD_PROGRESS, S));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const S = decodeURIComponent(t.fileInfo.url.pathname);
      return S.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? We.basename(S) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), h = l.cacheDirForPendingUpdate;
    await (0, Ge.mkdir)(h, { recursive: !0 });
    const c = s();
    let f = We.join(h, c);
    const d = a == null ? null : We.join(h, `package-${o}${We.extname(a.path) || ".7z"}`), m = async (S) => {
      await l.setDownloadedFile(f, d, i, r, c, S), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = We.join(h, "current.blockmap");
      return await (0, Ge.pathExists)(D) && await (0, Ge.copyFile)(D, We.join(l.cacheDir, "current.blockmap")), d == null ? [f] : [f, d];
    }, w = this._logger, y = await l.validateDownloadedPath(f, i, r, w);
    if (y != null)
      return f = y, await m(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, Ge.unlink)(f).catch(() => {
    })), T = await (0, El.createTempUpdateFile)(`temp-${c}`, h, w);
    try {
      await t.task(T, n, d, A), await (0, $e.retry)(() => (0, Ge.rename)(T, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (S) => S instanceof Error && /^EBUSY:/.test(S.message) ? !0 : (w.warn(`Cannot rename temp file to final file: ${S.message || S.stack}`), !1)
      });
    } catch (S) {
      throw await A(), S instanceof $e.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), S;
    }
    return w.info(`New version ${o} has been downloaded to ${f}`), await m(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = r.updateInfoAndProvider.provider, s = await a.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const l = async (w) => {
        const y = await this.httpExecutor.downloadToBuffer(w, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (y == null || y.length === 0)
          throw new Error(`Blockmap "${w.href}" is empty`);
        try {
          return JSON.parse((0, _o.gunzipSync)(y).toString());
        } catch (A) {
          throw new Error(`Cannot parse blockmap "${w.href}", error: ${A}`);
        }
      }, h = {
        newUrl: t.url,
        oldFile: We.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (h.onProgress = (w) => this.emit(Jt.DOWNLOAD_PROGRESS, w));
      const c = async (w, y) => {
        const A = We.join(y, "current.blockmap");
        await (0, Ge.outputFile)(A, (0, _o.gzipSync)(JSON.stringify(w)));
      }, f = async (w) => {
        const y = We.join(w, "current.blockmap");
        try {
          if (await (0, Ge.pathExists)(y))
            return JSON.parse((0, _o.gunzipSync)(await (0, Ge.readFile)(y)).toString());
        } catch (A) {
          this._logger.warn(`Cannot parse blockmap "${y}", error: ${A}`);
        }
        return null;
      }, d = await l(s[1]);
      await c(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let m = await f(this.downloadedUpdateHelper.cacheDir);
      return m == null && (m = await l(s[0])), await new u_.GenericDifferentialDownloader(t.info, this.httpExecutor, h).download(m, d), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
wt.AppUpdater = ya;
function f_(e) {
  const t = (0, xt.prerelease)(e);
  return t != null && t.length > 0;
}
class Ju {
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
wt.NoOpLogger = Ju;
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.BaseUpdater = void 0;
const vl = ci, d_ = wt;
class h_ extends d_.AppUpdater {
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
    const i = (0, vl.spawnSync)(t, r, {
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
        const s = { stdio: i, env: n, detached: !0 }, l = (0, vl.spawn)(t, r, s);
        l.on("error", (h) => {
          a(h);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
Wt.BaseUpdater = h_;
var zr = {}, pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Qt = bt, p_ = hn, m_ = Gl;
class g_ extends p_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Qu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await y_(this.options.oldFile), i);
  }
}
pn.FileWithEmbeddedBlockMapDifferentialDownloader = g_;
function Qu(e) {
  return JSON.parse((0, m_.inflateRawSync)(e).toString());
}
async function y_(e) {
  const t = await (0, Qt.open)(e, "r");
  try {
    const r = (await (0, Qt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Qt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Qt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Qt.close)(t), Qu(i);
  } catch (r) {
    throw await (0, Qt.close)(t), r;
  }
}
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.AppImageUpdater = void 0;
const _l = de, Al = ci, E_ = bt, w_ = St, Or = oe, v_ = Wt, __ = pn, A_ = ue, Tl = $t;
class T_ extends v_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, A_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, _l.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, E_.chmod)(i, 493);
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
      return this.listenerCount(Tl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Tl.DOWNLOAD_PROGRESS, s)), await new __.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, _l.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, w_.unlinkSync)(r);
    let n;
    const i = Or.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Or.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Or.join(Or.dirname(r), Or.basename(o)), (0, Al.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Al.execFileSync)(n, [], { env: a })), !0;
  }
}
zr.AppImageUpdater = T_;
var Xr = {}, vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.LinuxUpdater = void 0;
const S_ = Wt;
class C_ extends S_.BaseUpdater {
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
vr.LinuxUpdater = C_;
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.DebUpdater = void 0;
const b_ = ue, Sl = $t, $_ = vr;
class Ea extends $_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, b_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
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
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      Ea.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Xr.DebUpdater = Ea;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.PacmanUpdater = void 0;
const Cl = $t, R_ = ue, P_ = vr;
class wa extends P_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, R_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Cl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Cl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      wa.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Kr.PacmanUpdater = wa;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.RpmUpdater = void 0;
const bl = $t, I_ = ue, O_ = vr;
class va extends O_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, I_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(bl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(bl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      va.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Jr.RpmUpdater = va;
var Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.MacUpdater = void 0;
const $l = de, Ao = bt, D_ = St, Rl = oe, N_ = Ed, F_ = wt, x_ = ue, Pl = ci, Il = tn;
class L_ extends F_.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, Pl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const d = (0, Pl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${d}`), a = a || d;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var d;
      return f.url.pathname.includes("arm64") || ((d = f.info.url) === null || d === void 0 ? void 0 : d.includes("arm64"));
    };
    a && r.some(s) ? r = r.filter((f) => a === s(f)) : r = r.filter((f) => !s(f));
    const l = (0, x_.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, $l.newError)(`ZIP file not provided: ${(0, $l.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const h = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, d) => {
        const m = Rl.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, Ao.pathExistsSync)(m) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        w() && (y = await this.differentialDownloadInstaller(l, t, f, h, c)), y && await this.httpExecutor.download(l.url, f, d);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const d = Rl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Ao.copyFile)(f.downloadedFile, d);
          } catch (d) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${d.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ao.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, N_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (h) => {
      const c = h.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((h, c) => {
      const f = (0, Il.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, Il.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, y) => {
        const A = w.url;
        if (a.info(`${A} requested`), A === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const D = w.headers.authorization.split(" ")[1], x = Buffer.from(D, "base64").toString("ascii"), [te, le] = x.split(":");
          if (te !== "autoupdater" || le !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const V = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": V.length }), y.end(V);
          return;
        }
        if (!A.startsWith(m)) {
          a.warn(`${A} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let T = !1;
        y.on("finish", () => {
          T || (this.nativeUpdater.removeListener("error", c), h([]));
        });
        const S = (0, D_.createReadStream)(i);
        S.on("error", (D) => {
          try {
            y.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          T = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${D}`));
        }), y.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), S.pipe(y);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${d.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : h([]);
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
Qr.MacUpdater = L_;
var Zr = {}, _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
_a.verifySignature = k_;
const Ol = de, Zu = ci, U_ = ui, Dl = oe;
function ef(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function k_(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, Zu.execFile)(...ef(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var h;
      try {
        if (a != null || l) {
          To(r, a, l, i), n(null);
          return;
        }
        const c = M_(s);
        if (c.Status === 0) {
          try {
            const w = Dl.normalize(c.Path), y = Dl.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${y}`), w !== y) {
              To(r, new Error(`LiteralPath of ${w} is different than ${y}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(h = w.message) !== null && h !== void 0 ? h : w.stack}`);
          }
          const d = (0, Ol.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const w of e) {
            const y = (0, Ol.parseDn)(w);
            if (y.size ? m = Array.from(y.keys()).every((T) => y.get(T) === d.get(T)) : w === d.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (d, m) => d === "RawData" ? void 0 : m, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (c) {
        To(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function M_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function To(e, t, r, n) {
  if (B_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Zu.execFileSync)(...ef("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function B_() {
  const e = U_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.NsisUpdater = void 0;
const Wn = de, Nl = oe, j_ = Wt, H_ = pn, Fl = $t, q_ = ue, G_ = bt, W_ = _a, xl = Ct;
class V_ extends j_.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, W_.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, q_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, a, s) => {
        const l = n.packageInfo, h = l != null && a != null;
        if (h && t.disableWebInstaller)
          throw (0, Wn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !h && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (h || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Wn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Wn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (h && await this.differentialDownloadWebPackage(t, l, a, r))
          try {
            await this.httpExecutor.download(new xl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, G_.unlink)(a);
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
      this.spawnLog(Nl.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
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
        newUrl: new xl.URL(r.path),
        oldFile: Nl.join(this.downloadedUpdateHelper.cacheDir, Wn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Fl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Fl.DOWNLOAD_PROGRESS, a)), await new H_.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Zr.NsisUpdater = V_;
(function(e) {
  var t = Re && Re.__createBinding || (Object.create ? function(A, T, S, D) {
    D === void 0 && (D = S);
    var x = Object.getOwnPropertyDescriptor(T, S);
    (!x || ("get" in x ? !T.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return T[S];
    } }), Object.defineProperty(A, D, x);
  } : function(A, T, S, D) {
    D === void 0 && (D = S), A[D] = T[S];
  }), r = Re && Re.__exportStar || function(A, T) {
    for (var S in A) S !== "default" && !Object.prototype.hasOwnProperty.call(T, S) && t(T, A, S);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = bt, i = oe;
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
  var l = zr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var h = Xr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return h.DebUpdater;
  } });
  var c = Kr;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = Jr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var d = Qr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var m = Zr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
  } }), r($t, e);
  let w;
  function y() {
    if (process.platform === "win32")
      w = new Zr.NsisUpdater();
    else if (process.platform === "darwin")
      w = new Qr.MacUpdater();
    else {
      w = new zr.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(A))
          return w;
        switch ((0, n.readFileSync)(A).toString().trim()) {
          case "deb":
            w = new Xr.DebUpdater();
            break;
          case "rpm":
            w = new Jr.RpmUpdater();
            break;
          case "pacman":
            w = new Kr.PacmanUpdater();
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
    get: () => w || y()
  });
})(Me);
Me.autoUpdater.autoDownload = !1;
Me.autoUpdater.autoInstallOnAppQuit = !0;
Me.autoUpdater.autoRunAppAfterInstall = !0;
function Y_() {
  Me.autoUpdater.on("error", (e) => {
    console.log("[AutoUpdater] Error:", e.message);
  }), Me.autoUpdater.on("checking-for-update", () => {
    console.log("[AutoUpdater] Checking for updates...");
  }), Me.autoUpdater.on("update-available", (e) => {
    console.log("[AutoUpdater] Update available:", e.version);
    const t = ot.getFocusedWindow();
    Kn.showMessageBox(t || {}, {
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
    Kn.showMessageBox(t || {}, {
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
const z_ = z.dirname(Bl(import.meta.url));
kl.registerSchemesAsPrivileged([
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
const Ll = "velostudio";
process.defaultApp && process.argv.length >= 2 ? me.setAsDefaultProtocolClient(Ll, process.execPath, [z.resolve(process.argv[1])]) : me.setAsDefaultProtocolClient(Ll);
let ar = null;
function tf(e) {
  console.log("[Deep Link] Received:", e);
  try {
    const t = new URL(e), r = t.searchParams.get("code"), n = t.searchParams.get("access_token"), i = t.searchParams.get("refresh_token");
    r ? (console.log("[Deep Link] Got auth code, sending to auth window"), ee && !ee.isDestroyed() ? (ee.webContents.send("oauth-callback", { code: r }), ee.focus()) : ar = e) : n && i && (console.log("[Deep Link] Got auth tokens, sending to auth window"), ee && !ee.isDestroyed() ? (ee.webContents.send("deep-link-auth", { accessToken: n, refreshToken: i }), ee.focus()) : ar = e);
  } catch (t) {
    console.error("[Deep Link] Failed to parse URL:", t);
  }
}
me.on("open-url", (e, t) => {
  e.preventDefault(), tf(t);
});
const sr = z.join(me.getPath("userData"), "recordings");
async function X_() {
  try {
    await Zt.mkdir(sr, { recursive: !0 }), console.log("RECORDINGS_DIR:", sr), console.log("User Data Path:", me.getPath("userData"));
  } catch (e) {
    console.error("Failed to create recordings directory:", e);
  }
}
process.env.APP_ROOT = z.join(z_, "..");
const K_ = process.env.VITE_DEV_SERVER_URL, wA = z.join(process.env.APP_ROOT, "dist-electron"), rf = z.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = K_ ? z.join(process.env.APP_ROOT, "public") : rf;
let we = null, ee = null, Fr = null, lr = null, nf = "", of = !1;
const af = sf("openscreen.png"), J_ = sf("rec-button.png");
function Aa() {
  we = vd();
}
function Ul() {
  lr = new hd(af);
}
function sf(e) {
  return Ml.createFromPath(z.join(process.env.VITE_PUBLIC || rf, e)).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function So(e = !1) {
  if (!lr) return;
  const t = e ? J_ : af, r = e ? `Recording: ${nf}` : "Velo Studio", n = e ? [
    {
      label: "Stop Recording",
      click: () => {
        we && !we.isDestroyed() && we.webContents.send("stop-recording-from-tray");
      }
    }
  ] : [
    {
      label: "Open",
      click: () => {
        if (!of) {
          ee && !ee.isDestroyed() && (ee.show(), ee.focus());
          return;
        }
        we && !we.isDestroyed() ? we.isMinimized() && we.restore() : Aa();
      }
    },
    {
      label: "Quit",
      click: () => {
        me.quit();
      }
    }
  ];
  lr.setImage(t), lr.setToolTip(r), lr.setContextMenu(pd.buildFromTemplate(n));
}
function Q_() {
  we && (we.close(), we = null), we = _d();
}
function Z_() {
  return Fr = Ad(), Fr.on("closed", () => {
    Fr = null;
  }), Fr;
}
me.on("window-all-closed", () => {
});
me.on("activate", () => {
  ot.getAllWindows().length === 0 && Aa();
});
me.whenReady().then(async () => {
  if (kl.handle("velo-asset", (t) => {
    const r = new URL(t.url), n = decodeURIComponent(r.pathname).replace(/^\//, "");
    let i;
    me.isPackaged ? i = z.join(process.resourcesPath, "assets") : i = z.join(process.env.APP_ROOT || "", "public");
    const o = z.join(i, n);
    return console.log("[velo-asset protocol] Resolving:", t.url, "->", o), dd.fetch(md(o).href);
  }), process.platform === "darwin" && !me.isPackaged) {
    const t = z.join(process.env.APP_ROOT || "", "icons", "icons", "mac", "icon.icns");
    try {
      const r = Ml.createFromPath(t);
      !r.isEmpty() && me.dock && me.dock.setIcon(r);
    } catch (r) {
      console.warn("Failed to set dock icon:", r);
    }
  }
  const { ipcMain: e } = await import("electron");
  e.on("hud-overlay-close", () => {
    me.quit();
  }), e.on("auth-ready", () => {
    console.log("[Auth] auth-ready received, switching to HUD overlay"), of = !0, ee && !ee.isDestroyed() && (ee.close(), ee = null), setTimeout(() => {
      (!we || we.isDestroyed()) && Aa(), So();
    }, 300);
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
            console.log("[OAuth Window] Intercepted auth code, sending to auth window"), ee && !ee.isDestroyed() && ee.webContents.send("oauth-callback", { code: s }), setImmediate(() => {
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
          s && (console.log("[OAuth Window] Fallback: caught auth code via did-navigate"), ee && !ee.isDestroyed() && ee.webContents.send("oauth-callback", { code: s }), n.isDestroyed() || n.close());
        } catch (a) {
          console.error("[OAuth Window] did-navigate error:", a);
        }
    }), n.loadURL(r);
  }), e.handle("check-screen-permission", () => process.platform === "darwin" ? Hi.getMediaAccessStatus("screen") : "granted"), e.handle("check-microphone-permission", async () => {
    if (process.platform === "darwin") {
      const t = Hi.getMediaAccessStatus("microphone");
      return t === "not-determined" ? await Hi.askForMediaAccess("microphone") ? "granted" : "denied" : t;
    }
    return "granted";
  }), Ul(), So(), await X_(), Sd(
    Q_,
    Z_,
    () => we,
    () => Fr,
    (t, r) => {
      nf = r, lr || Ul(), So(t), t || we && we.restore();
    }
  ), ee = Td(), ee.on("closed", () => {
    ee = null;
  }), ar && setTimeout(() => {
    ar && (tf(ar), ar = null);
  }, 1500), Y_();
});
export {
  wA as MAIN_DIST,
  sr as RECORDINGS_DIR,
  rf as RENDERER_DIST,
  K_ as VITE_DEV_SERVER_URL
};
