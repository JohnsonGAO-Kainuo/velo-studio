import { useEffect, useState } from "react";
import { LaunchWindow } from "./components/launch/LaunchWindow";
import { SourceSelector } from "./components/launch/SourceSelector";
import VideoEditor from "./components/video-editor/VideoEditor";
import { WebRoutes } from "./components/landing/WebRoutes";
import { ElectronAuth } from "./components/electron/ElectronAuth";
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  const [windowType, setWindowType] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('windowType') || '';
    setWindowType(type);
    if (type === 'hud-overlay' || type === 'source-selector') {
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
      document.getElementById('root')?.style.setProperty('background', 'transparent');
    }
  }, []);

  // For Electron app, handle different window types
  switch (windowType) {
    case 'hud-overlay':
      return <LaunchWindow />;
    case 'source-selector':
      return <SourceSelector />;
    case 'editor':
      return <VideoEditor />;
    case 'electron-auth':
      return <ElectronAuth />;
    default:
      // For web deployment (no windowType param), use Router
      return (
        <BrowserRouter>
           <WebRoutes />
        </BrowserRouter>
      );
  }
}
