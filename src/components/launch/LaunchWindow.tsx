import { useState, useEffect } from "react";
import styles from "./LaunchWindow.module.css";
import { useScreenRecorder } from "../../hooks/useScreenRecorder";
import { Button } from "../ui/button";
import { BsRecordCircle } from "react-icons/bs";
import { FaRegStopCircle } from "react-icons/fa";
import { MdMonitor } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaFolderMinus } from "react-icons/fa6";
import { FiMinus, FiX } from "react-icons/fi";
import { ContentClamp } from "../ui/content-clamp";

export function LaunchWindow() {
  const { recording, toggleRecording } = useScreenRecorder();
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
  const [selectedSource, setSelectedSource] = useState("Screen");
  const [hasSelectedSource, setHasSelectedSource] = useState(false);

  useEffect(() => {
    const checkSelectedSource = async () => {
      if (window.electronAPI) {
        const source = await window.electronAPI.getSelectedSource();
        if (source) {
          setSelectedSource(source.name);
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
    <div className="w-full h-full flex items-center bg-transparent">
      {/* Velo Studio HUD - Clean, minimal design inspired by Cap */}
      <div
        className={`w-full max-w-[480px] mx-auto flex items-center justify-between px-3 py-2 ${styles.electronDrag}`}
        style={{
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(250,250,250,0.95) 0%, rgba(245,245,245,0.92) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
          border: '1px solid rgba(229,229,229,0.8)',
          minHeight: 48,
        }}
      >
        {/* Drag handle */}
        <div className={`flex items-center gap-1 ${styles.electronDrag}`}>
          <RxDragHandleDots2 size={16} className="text-[#a0a0a0]" />
        </div>

        {/* Source selector */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 text-[#5c5c5c] hover:text-[#3a3a3a] hover:bg-[#f0f0f0] px-3 flex-1 text-left text-xs font-medium ${styles.electronNoDrag}`}
          onClick={openSourceSelector}
          disabled={recording}
        >
          <MdMonitor size={14} className="text-[#6b6b6b]" />
          <ContentClamp truncateLength={8}>{selectedSource}</ContentClamp>
        </Button>

        <div className="w-px h-5 bg-[#e0e0e0]" />

        {/* Record button */}
        <Button
          variant={recording ? "recording" : "ghost"}
          size="sm"
          onClick={hasSelectedSource ? toggleRecording : openSourceSelector}
          disabled={!hasSelectedSource && !recording}
          className={`gap-2 px-4 flex-1 text-center text-xs font-semibold ${styles.electronNoDrag} ${
            recording 
              ? "bg-[#ef4444] text-white hover:bg-[#dc2626]" 
              : hasSelectedSource 
                ? "text-[#3a3a3a] hover:bg-[#e8e8e8]" 
                : "text-[#a0a0a0]"
          }`}
        >
          {recording ? (
            <>
              <FaRegStopCircle size={14} className="text-white" />
              <span className="tabular-nums">{formatTime(elapsed)}</span>
            </>
          ) : (
            <>
              <BsRecordCircle size={14} className={hasSelectedSource ? "text-[#ef4444]" : "text-[#c0c0c0]"} />
              <span>Record</span>
            </>
          )}
        </Button>

        <div className="w-px h-5 bg-[#e0e0e0]" />

        {/* Open file button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={openVideoFile}
          className={`gap-2 text-[#5c5c5c] hover:text-[#3a3a3a] hover:bg-[#f0f0f0] px-3 flex-1 text-right text-xs font-medium ${styles.electronNoDrag} ${styles.folderButton}`}
          disabled={recording}
        >
          <FaFolderMinus size={14} className="text-[#6b6b6b]" />
          <span className={styles.folderText}>Open</span>
        </Button>

        {/* Separator before window controls */}
        <div className="w-px h-5 bg-[#e0e0e0] mx-1" />
        
        {/* Minimize button */}
        <Button
          variant="ghost"
          size="icon"
          className={`w-7 h-7 rounded-full hover:bg-[#e8e8e8] ${styles.electronNoDrag}`}
          title="Hide"
          onClick={sendHudOverlayHide}
        >
          <FiMinus size={14} className="text-[#808080]" />
        </Button>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className={`w-7 h-7 rounded-full hover:bg-[#fee2e2] ${styles.electronNoDrag}`}
          title="Close"
          onClick={sendHudOverlayClose}
        >
          <FiX size={14} className="text-[#808080] hover:text-[#ef4444]" />
        </Button>
      </div>
    </div>
  );
}
