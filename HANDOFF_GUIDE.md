# Velo Studio - 新模型接手指南

> 本文档用于帮助新的 AI 模型快速了解项目状态和继续开发

---

## 🎯 项目简介

**Velo Studio** 是一款类似 [Cap.so](https://cap.so) 的 macOS 桌面应用，用于：
1. 屏幕录制
2. 录制后添加视觉效果（壁纸、缩放、注释）
3. 自动检测并模糊敏感信息
4. 导出为 MP4/GIF

**技术栈**: Electron + React + TypeScript + PixiJS + Tailwind CSS

---

## 📂 关键文件位置

| 需求 | 文件 |
|------|------|
| 录制启动界面 | `src/components/launch/LaunchWindow.tsx` |
| 视频编辑主界面 | `src/components/video-editor/VideoEditor.tsx` |
| 时间轴编辑 | `src/components/video-editor/timeline/TimelineEditor.tsx` |
| 类型定义 | `src/components/video-editor/types.ts` |
| Auto-Zoom 算法 | `src/lib/cursorTracker.ts` |
| 敏感词检测 | `src/lib/sensitiveDetector.ts` |
| OCR 扫描 | `src/lib/videoOcrScanner.ts` |
| 视频导出 | `src/lib/exporter/videoExporter.ts` |
| 注释渲染 | `src/lib/exporter/annotationRenderer.ts` |
| Electron 主进程 | `electron/main.ts` |

---

## ✅ 已完成功能

1. **屏幕录制** - 区域/全屏，含光标追踪
2. **视频编辑器** - PixiJS 渲染，支持预览
3. **手动缩放** - 6 级深度，可拖拽焦点
4. **Auto-Zoom** - 基于点击和停留自动生成
5. **注释系统** - 文字/图片/箭头/模糊 4 种类型
6. **隐私扫描** - OCR + 正则匹配敏感词
7. **视频导出** - MP4 和 GIF 导出

---

## 🔄 待优化功能

### Privacy Blur (优先级高)
- OCR 准确率不稳定
- 缺少自定义敏感词 UI
- 缺少检测结果审查界面
- 未实现人脸检测

### Auto-Zoom (优先级中)
- 可加用户参数调节 UI
- 焦点准确性可提升

---

## 📋 待开发功能

### 后端 (PocketBase)
- 用户注册/登录
- OAuth (Google/GitHub)
- 项目云存储
- 多设备同步

### 增强功能
- 光标美化效果
- 点击高亮
- 水印添加
- 字幕支持

---

## 🚀 常用命令

```bash
# 进入项目
cd "/Users/johnson/Desktop/开发/Web/Velo Studio"

# 开发模式
npm run dev

# 构建 Mac 应用
npm run build:web && npx electron-builder --mac --dir -c.mac.identity=null

# 应用位置
release/1.0.0/mac-arm64/Velo Studio.app
```

---

## ⚠️ 注意事项

1. **Tesseract.js 是动态加载的** - 在 `videoOcrScanner.ts` 中使用 `await import('tesseract.js')`，不要改成静态导入，否则会导致启动卡顿

2. **壁纸资源路径** - 使用 `velo-asset://` 协议，在 `assetPath.ts` 中处理

3. **ZoomDepth 是整数 1-6** - 不要使用浮点数

4. **BlurStyle 类型** - 是独立类型，不要和 TextStyle 混淆，使用 `isBlurStyle()` 类型守卫

---

## 📊 完整路线图

详见 [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)

---

*创建时间: 2026年1月22日*
