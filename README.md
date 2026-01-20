# <p align="center">Velo Studio</p>

<p align="center"><strong>Intelligent video post-production tool with auto-zoom and privacy protection</strong></p>

---

## 🎯 About Velo Studio

Velo Studio is a powerful desktop application for creating professional screen recordings with intelligent features:

- **🔍 Auto-Zoom** - Automatically follows cursor movement (coming soon)
- **🔒 Privacy Protection** - Automatically detects and redacts sensitive information like API keys, emails, and faces (coming soon)
- **✨ Beautiful UI** - Modern, clean interface inspired by Cap.so
- **🎨 Rich Editing** - Manual zoom, crop, annotations, motion blur, and more
- **📦 Export Options** - Multiple aspect ratios, resolutions, and formats (MP4, GIF)

**Built on OpenScreen** - This project is a fork of [OpenScreen](https://github.com/siddharthvaddem/openscreen) with enhanced features focused on automation and privacy.

**⚠️ BETA**: Core features from OpenScreen work well. Auto-zoom and privacy protection features are under development.

## 🎯 Core Features (from OpenScreen base)
- Record your whole screen or specific apps
- Add manual zooms (customizable depth levels)
- Customize the duration and position of zooms
- Crop video recordings to hide parts
- Choose between wallpapers, solid colors, gradients or your own picture for background
- Motion blur for smoother pan and zoom effects
- Add annotations (text, arrows, images)
- Trim sections of the clip
- Export in different aspect ratios and resolutions

## 🚀 Planned Features (Velo Studio enhancements)
- [ ] **Auto-Zoom** - Automatically follow cursor movement and clicks
- [ ] **OCR-based Privacy Protection** - Detect and redact API keys, emails, phone numbers
- [ ] **Face Detection** - Automatically blur faces in recordings
- [ ] **Enhanced Cursor Effects** - Beautiful cursor trails and click animations

## 📦 Installation

### Desktop App (Electron)

**Coming Soon** - Desktop builds will be available for:
- macOS (Apple Silicon & Intel)
- Windows (x64)
- Linux (AppImage)

For now, you can build from source (see Development section below).

### Web Preview (Limited Features)

Try the web version at **velo-studio.vercel.app** (after deployment).  
**Note**: Web version only includes UI preview. Recording and export require the desktop app.

### macOS

If you encounter issues with macOS Gatekeeper blocking the app (since it does not come with a developer certificate), you can bypass this by running the following command in your terminal after installation:

```bash
xattr -rd com.apple.quarantine /Applications/Openscreen.app
```

After running this command, proceed to **System Preferences > Security & Privacy** to grant the necessary permissions for "screen recording" and "accessibility". Once permissions are granted, you can launch the app.

### Linux

Download the `.AppImage` file from the releases page. Make it executable and run:

```bash
chmod +x Openscreen-Linux-*.AppImage
./Openscreen-Linux-*.AppImage
```

You may need to grant screen recording permissions depending on your desktop environment.
```markdown
# <p align="center">Velo Studio</p>

<p align="center"><strong>Intelligent video post-production tool with auto-zoom and privacy protection</strong></p>

---

## About Velo Studio

Velo Studio is a powerful desktop application for creating professional screen recordings with intelligent features:

- **Auto-Zoom** - Automatically follows cursor movement (coming soon)
- **Privacy Protection** - Automatically detects and redacts sensitive information like API keys, emails, and faces (coming soon)
- **Beautiful UI** - Modern, clean interface inspired by Cap.so
- **Rich Editing** - Manual zoom, crop, annotations, motion blur, and more
- **Export Options** - Multiple aspect ratios, resolutions, and formats (MP4, GIF)

**Built on OpenScreen** - This project is a fork of [OpenScreen](https://github.com/siddharthvaddem/openscreen) with enhanced features focused on automation and privacy.

**BETA**: Core features from OpenScreen work well. Auto-zoom and privacy protection features are under development.

## Core Features (from OpenScreen base)
- Record your whole screen or specific apps
- Add manual zooms (customizable depth levels)
- Customize the duration and position of zooms
- Crop video recordings to hide parts
- Choose between wallpapers, solid colors, gradients or your own picture for background
- Motion blur for smoother pan and zoom effects
- Add annotations (text, arrows, images)
- Trim sections of the clip
- Export in different aspect ratios and resolutions

## Planned Features (Velo Studio enhancements)
- [ ] **Auto-Zoom** - Automatically follow cursor movement and clicks
- [ ] **OCR-based Privacy Protection** - Detect and redact API keys, emails, phone numbers
- [ ] **Face Detection** - Automatically blur faces in recordings
- [ ] **Enhanced Cursor Effects** - Cursor trails and click animations

## Installation

### Desktop App (Electron)

**Coming Soon** - Desktop builds will be available for:
- macOS (Apple Silicon & Intel)
- Windows (x64)
- Linux (AppImage)

For now, you can build from source (see Development section below).

### Web Preview (Limited Features)

Try the web version at **velo-studio.vercel.app** (after deployment).  
**Note**: Web version only includes UI preview. Recording and export require the desktop app.

### macOS

If you encounter issues with macOS Gatekeeper blocking the app (since it does not come with a developer certificate), you can bypass this by running the following command in your terminal after installation:

```bash
xattr -rd com.apple.quarantine /Applications/Openscreen.app
```

After running this command, proceed to **System Preferences > Security & Privacy** to grant the necessary permissions for "screen recording" and "accessibility". Once permissions are granted, you can launch the app.

### Linux

Download the `.AppImage` file from the releases page. Make it executable and run:

```bash
chmod +x Openscreen-Linux-*.AppImage
./Openscreen-Linux-*.AppImage
```

You may need to grant screen recording permissions depending on your desktop environment.

## Built with
- Electron
- React
- TypeScript
- Vite
- PixiJS
- dnd-timeline

## Development

### Run Electron app locally
```bash
npm install
npm run dev
```

### Build web version (for Vercel)
```bash
npm run build:web
```

### Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Build command: `npm run build:web`
4. Output directory: `dist`

---


_I'm new to open source, idk what I'm doing lol. If something is wrong please raise an issue._

## Contributing

Contributions are welcome! If you’d like to help out or see what’s currently being worked on, take a look at the open issues and the [project roadmap](https://github.com/users/siddharthvaddem/projects/3) to understand the current direction of the project and find ways to contribute.


## License


This project is licensed under the [MIT License](./LICENSE). By using this software, you agree that the authors are not liable for any issues, damages, or claims arising from its use.
 
````

