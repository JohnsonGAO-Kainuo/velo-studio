import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoInteractionOverlayProps {
  containerWidth: number;
  containerHeight: number;
  currentTimeMs: number;
  onAddZoom?: (timeMs: number) => void;
  onAddBlur?: (timeMs: number, position: { x: number; y: number }) => void;
}

export function VideoInteractionOverlay({
  containerWidth,
  containerHeight,
  currentTimeMs,
  onAddZoom,
  onAddBlur,
}: VideoInteractionOverlayProps) {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<'top' | 'bottom' | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // Divide screen into top 40% and bottom 60%
    if (y < containerHeight * 0.4) {
      setHoveredQuadrant('top');
    } else {
      setHoveredQuadrant('bottom');
    }
  }, [containerHeight]);

  const handleMouseLeave = useCallback(() => {
    setHoveredQuadrant(null);
    setMousePosition(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize position to 0-1 range
    const normalizedX = x / containerWidth;
    const normalizedY = y / containerHeight;
    
    if (hoveredQuadrant === 'top' && onAddZoom) {
      onAddZoom(currentTimeMs);
    } else if (hoveredQuadrant === 'bottom' && onAddBlur) {
      onAddBlur(currentTimeMs, {
        x: normalizedX * 100, // Convert to percentage (0-100)
        y: normalizedY * 100,
      });
    }
  }, [hoveredQuadrant, containerWidth, containerHeight, currentTimeMs, onAddZoom, onAddBlur]);

  return (
    <div
      className="absolute inset-0 select-none transition-all duration-200"
      style={{ pointerEvents: hoveredQuadrant ? 'auto' : 'none' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Top 40% - Zoom Region */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 transition-all duration-200",
          hoveredQuadrant === 'top' && "bg-[#34B27B]/10 backdrop-blur-[2px]"
        )}
        style={{ height: '40%' }}
      >
        {hoveredQuadrant === 'top' && mousePosition && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
            style={{ left: mousePosition.x, top: mousePosition.y }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#34B27B] flex items-center justify-center shadow-lg ring-2 ring-white/50">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="px-2 py-0.5 rounded-full bg-[#34B27B] text-white text-[10px] font-semibold shadow-md">
                Add Zoom
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom 60% - Blur Region */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 transition-all duration-200",
          hoveredQuadrant === 'bottom' && "bg-blue-500/10 backdrop-blur-[2px]"
        )}
        style={{ height: '60%' }}
      >
        {hoveredQuadrant === 'bottom' && mousePosition && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
            style={{ left: mousePosition.x, top: mousePosition.y }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg ring-2 ring-white/50">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-semibold shadow-md">
                Add Blur
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
