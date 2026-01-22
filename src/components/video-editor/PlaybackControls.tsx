import { PushButton } from "../ui/push-button";
import { Play, Pause } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayPause: () => void;
  onSeek: (time: number) => void;
}

export default function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  onTogglePlayPause,
  onSeek,
}: PlaybackControlsProps) {
  function formatTime(seconds: number) {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSeek(parseFloat(e.target.value));
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 px-1 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-sm transition-all duration-300 hover:bg-white hover:border-neutral-300">
      <PushButton
        onClick={onTogglePlayPause}
        variant={isPlaying ? "ghost" : "accent"}
        size="sm"
        className="w-8 h-8 !p-0 flex items-center justify-center"
        style={{ borderRadius: "50%" }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </PushButton>
      
      <span className="text-[9px] font-medium text-neutral-600 tabular-nums w-[30px] text-right">
        {formatTime(currentTime)}
      </span>
      
      <div className="flex-1 relative h-6 flex items-center group">
        {/* Custom Track Background */}
        <div className="absolute left-0 right-0 h-0.5 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#34B27B] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Interactive Input */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeekChange}
          step="0.01"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Custom Thumb (visual only, follows progress) */}
        <div 
          className="absolute w-2.5 h-2.5 bg-[#34B27B] rounded-full shadow-sm pointer-events-none group-hover:scale-125 transition-transform duration-100"
          style={{ 
            left: `${progress}%`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>
      
      <span className="text-[9px] font-medium text-neutral-400 tabular-nums w-[30px]">
        {formatTime(duration)}
      </span>
    </div>
  );
}
