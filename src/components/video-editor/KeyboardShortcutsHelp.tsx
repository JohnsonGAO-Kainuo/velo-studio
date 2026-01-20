import { HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { formatShortcut } from "@/utils/platformUtils";

export function KeyboardShortcutsHelp() {
  const [shortcuts, setShortcuts] = useState({
    delete: 'Ctrl + D',
    pan: 'Shift + Ctrl + Scroll',
    zoom: 'Ctrl + Scroll'
  });

  useEffect(() => {
    Promise.all([
      formatShortcut(['mod', 'D']),
      formatShortcut(['shift', 'mod', 'Scroll']),
      formatShortcut(['mod', 'Scroll'])
    ]).then(([deleteKey, panKey, zoomKey]) => {
      setShortcuts({
        delete: deleteKey,
        pan: panKey,
        zoom: zoomKey
      });
    });
  }, []);

  return (
    <div className="relative group">
      <HelpCircle className="w-4 h-4 text-neutral-400 hover:text-[#34B27B] transition-colors cursor-help" />
      <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-neutral-200 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
        <div className="text-xs font-semibold text-neutral-800 mb-2">Keyboard Shortcuts</div>
        <div className="space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Add Zoom</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">Z</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Add Annotation</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">A</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Add Keyframe</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">F</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Add Trim</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">T</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Delete Selected</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">{shortcuts.delete}</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Pan Timeline</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">{shortcuts.pan}</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Zoom Timeline</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">{shortcuts.zoom}</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Pause/Play</span>
            <kbd className="px-1 py-0.5 bg-white border border-neutral-200 rounded text-[#34B27B] font-mono">Space</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
