import { useState, useEffect } from "react";
import styles from "./LaunchWindow.module.css";
import { useScreenRecorder } from "../../hooks/useScreenRecorder";
import { PushButton } from "../ui/push-button";
import { ToggleSwitch } from "../ui/toggle-switch";
import { BsRecordCircle } from "react-icons/bs";
import { FaRegStopCircle } from "react-icons/fa";
import { MdMonitor } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaFolderMinus } from "react-icons/fa6";
import { FiMinus, FiX } from "react-icons/fi";
import { Wand2, ShieldCheck } from "lucide-react";

export function LaunchWindow() {
  const [autoZoomEnabled, setAutoZoomEnabled] = useState(true);
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(true);
  const { recording, toggleRecording } = useScreenRecorder({ autoZoomEnabled });
  const [recordingStart, setRecordingStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (recording) {
      if (!recordingStart) setRecordingStart(Date.now());
      timer = setInterval(() => {
        if (recordingStart) {
          setElapsed(Math.floor((Date.now() - recordingStart) / 1000));
        }
      }, 1000);
    } else {
      setRecordingStart(null);
      setElapsed(0);
      if (timer) clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recording, recordingStart]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Translate common Chinese source names to English
  const translateSourceName = (name: string): string => {
    const translations: Record<string, string> = {
      '整个屏幕': 'Entire Screen',
      '屏幕': 'Screen',
      '窗口': 'Window',
    };
    return translations[name] || name;
  };

  const [selectedSource, setSelectedSource] = useState("Screen");
  const [hasSelectedSource, setHasSelectedSource] = useState(false);

  useEffect(() => {
    const checkSelectedSource = async () => {
      if (window.electronAPI) {
        const source = await window.electronAPI.getSelectedSource();
        if (source) {
          setSelectedSource(translateSourceName(source.name));
          setHasSelectedSource(true);
        } else {
          setSelectedSource("Screen");
          setHasSelectedSource(false);
        }
      }
    };

    checkSelectedSource();
    
    const interval = setInterval(checkSelectedSource, 500);
    return () => clearInterval(interval);
  }, []);

  const openSourceSelector = () => {
    if (window.electronAPI) {
      window.electronAPI.openSourceSelector();
    }
  };

  const openVideoFile = async () => {
    const result = await window.electronAPI.openVideoFilePicker();
    
    if (result.cancelled) {
      return;
    }
    
    if (result.success && result.path) {
      await window.electronAPI.setCurrentVideoPath(result.path);
      await window.electronAPI.switchToEditor();
    }
  };

  // IPC events for hide/close
  const sendHudOverlayHide = () => {
    if (window.electronAPI && window.electronAPI.hudOverlayHide) {
      window.electronAPI.hudOverlayHide();
    }
  };
  const sendHudOverlayClose = () => {
    if (window.electronAPI && window.electronAPI.hudOverlayClose) {
      window.electronAPI.hudOverlayClose();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      {/* Velo Studio HUD - Redesigned with 3D push button panel */}
      <div
        className={`w-full max-w-[1000px] flex items-center gap-4 px-5 py-3 ${styles.electronDrag}`}
        style={{
          borderRadius: 32,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,0.95) 100%)',
          backdropFilter: 'blur(35px) saturate(220%)',
          WebkitBackdropFilter: 'blur(35px) saturate(220%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10)',
          border: '1px solid rgba(0,0,0,0.1)',
          height: 70,
        }}
      >
        <div className={`flex items-center gap-2 ${styles.electronDrag}`}>
          <RxDragHandleDots2 size={18} className="text-[#9a9a9a]" />
          <PushButton
            variant="ghost"
            size="sm"
            className={`${styles.electronNoDrag} gap-1.5`}
            onClick={openSourceSelector}
            disabled={recording}
          >
            <MdMonitor size={13} />
            <span className="text-xs max-w-[80px] truncate">{selectedSource}</span>
          </PushButton>
        </div>

        <div className={`flex-1 flex items-center justify-center gap-4 ${styles.electronNoDrag}`}>
          <div className="flex items-center gap-1.5">
            <ToggleSwitch
              checked={autoZoomEnabled}
              onCheckedChange={setAutoZoomEnabled}
              disabled={recording}
              size="sm"
              activeColor="#34B27B"
              inactiveColor="#cfd1d4"
            />
            <div className="flex items-center gap-0.5">
              <Wand2 size={13} className={autoZoomEnabled ? "text-[#34B27B]" : "text-[#b3b3b3]"} />
              <span className={`text-[11px] font-semibold ${autoZoomEnabled ? "text-[#34B27B]" : "text-[#b3b3b3]"}`}>
                Zoom
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ToggleSwitch
              checked={privacyModeEnabled}
              onCheckedChange={setPrivacyModeEnabled}
              disabled={recording}
              size="sm"
              activeColor="#3b82f6"
              inactiveColor="#cfd1d4"
            />
            <div className="flex items-center gap-0.5">
              <ShieldCheck size={13} className={privacyModeEnabled ? "text-[#3b82f6]" : "text-[#b3b3b3]"} />
              <span className={`text-[11px] font-semibold ${privacyModeEnabled ? "text-[#3b82f6]" : "text-[#b3b3b3]"}`}>
                Privacy
              </span>
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${styles.electronNoDrag}`}>
          <PushButton
            variant="danger"
            size="md"
            onClick={hasSelectedSource ? toggleRecording : openSourceSelector}
            disabled={!hasSelectedSource && !recording}
            className="gap-1.5 min-w-[140px]"
            style={recording ? { boxShadow: '0 4px 0 rgba(139, 16, 20, 0.85)' } : undefined}
          >
            {recording ? (
              <>
                <FaRegStopCircle size={15} />
                <span className="tabular-nums font-bold text-sm">{formatTime(elapsed)}</span>
              </>
            ) : (
              <>
                <BsRecordCircle size={15} />
                <span className="font-bold text-sm">Record</span>
              </>
            )}
          </PushButton>
          <PushButton
            variant="ghost"
            size="sm"
            onClick={openVideoFile}
            className="gap-1 w-[70px]"
            disabled={recording}
          >
            <FaFolderMinus size={13} />
            <span className="text-xs">Open</span>
          </PushButton>
          <div className="flex items-center gap-1.5 ml-1">
            <button
              className="w-6 h-6 rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] active:scale-95 transition-all flex items-center justify-center border border-[#d0d0d0]"
              title="Hide"
              onClick={sendHudOverlayHide}
            >
              <FiMinus size={13} className="text-[#555555]" />
            </button>
            <button
              className="w-6 h-6 rounded-full bg-[#fee2e2] hover:bg-[#fecaca] active:scale-95 transition-all flex items-center justify-center border border-[#fca5a5]"
              title="Close"
              onClick={sendHudOverlayClose}
            >
              <FiX size={13} className="text-[#ef4444]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
