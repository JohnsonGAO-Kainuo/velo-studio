import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { getAssetPath } from "@/lib/assetPath";
import { Slider } from "@/components/ui/slider";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PushButton } from "@/components/ui/push-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Block from '@uiw/react-color-block';
import { Trash2, Download, Crop, X, Bug, Upload, Star, Film, Image } from "lucide-react";
import { toast } from "sonner";
import type { ZoomDepth, CropRegion, AnnotationRegion, AnnotationType } from "./types";
import { CropControl } from "./CropControl";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { AnnotationSettingsPanel } from "./AnnotationSettingsPanel";
import { type AspectRatio } from "@/utils/aspectRatioUtils";
import type { ExportQuality, ExportFormat, GifFrameRate, GifSizePreset } from "@/lib/exporter";
import { GIF_FRAME_RATES, GIF_SIZE_PRESETS } from "@/lib/exporter";

const WALLPAPER_COUNT = 18;
const WALLPAPER_RELATIVE = Array.from({ length: WALLPAPER_COUNT }, (_, i) => `wallpapers/wallpaper${i + 1}.jpg`);
const GRADIENTS = [
  "linear-gradient( 111.6deg,  rgba(114,167,232,1) 9.4%, rgba(253,129,82,1) 43.9%, rgba(253,129,82,1) 54.8%, rgba(249,202,86,1) 86.3% )",
  "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
  "radial-gradient( circle farthest-corner at 3.2% 49.6%,  rgba(80,12,139,0.87) 0%, rgba(161,10,144,0.72) 83.6% )",
  "linear-gradient( 111.6deg,  rgba(0,56,68,1) 0%, rgba(163,217,185,1) 51.5%, rgba(231, 148, 6, 1) 88.6% )",
  "linear-gradient( 107.7deg,  rgba(235,230,44,0.55) 8.4%, rgba(252,152,15,1) 90.3% )",
  "linear-gradient( 91deg,  rgba(72,154,78,1) 5.2%, rgba(251,206,70,1) 95.9% )",
  "radial-gradient( circle farthest-corner at 10% 20%,  rgba(2,37,78,1) 0%, rgba(4,56,126,1) 19.7%, rgba(85,245,221,1) 100.2% )",
  "linear-gradient( 109.6deg,  rgba(15,2,2,1) 11.2%, rgba(36,163,190,1) 91.1% )",
  "linear-gradient(135deg, #FBC8B4, #2447B1)",
  "linear-gradient(109.6deg, #F635A6, #36D860)",
  "linear-gradient(90deg, #FF0101, #4DFF01)",
  "linear-gradient(315deg, #EC0101, #5044A9)",
  "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)",
  "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(to top, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%)",
  "linear-gradient(to right, #fa709a 0%, #fee140 100%)",
  "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
  "linear-gradient(to top, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
  "linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)",
  "linear-gradient(to right, #0acffe 0%, #495aff 100%)",
];

interface SettingsPanelProps {
  selected: string;
  onWallpaperChange: (path: string) => void;
  selectedZoomDepth?: ZoomDepth | null;
  onZoomDepthChange?: (depth: ZoomDepth) => void;
  selectedZoomId?: string | null;
  onZoomDelete?: (id: string) => void;
  selectedTrimId?: string | null;
  onTrimDelete?: (id: string) => void;
  shadowIntensity?: number;
  onShadowChange?: (intensity: number) => void;
  showBlur?: boolean;
  onBlurChange?: (showBlur: boolean) => void;
  motionBlurEnabled?: boolean;
  onMotionBlurChange?: (enabled: boolean) => void;
  borderRadius?: number;
  onBorderRadiusChange?: (radius: number) => void;
  padding?: number;
  onPaddingChange?: (padding: number) => void;
  cropRegion?: CropRegion;
  onCropChange?: (region: CropRegion) => void;
  aspectRatio: AspectRatio;
  videoElement?: HTMLVideoElement | null;
  exportQuality?: ExportQuality;
  onExportQualityChange?: (quality: ExportQuality) => void;
  // Export format settings
  exportFormat?: ExportFormat;
  onExportFormatChange?: (format: ExportFormat) => void;
  gifFrameRate?: GifFrameRate;
  onGifFrameRateChange?: (rate: GifFrameRate) => void;
  gifLoop?: boolean;
  onGifLoopChange?: (loop: boolean) => void;
  gifSizePreset?: GifSizePreset;
  onGifSizePresetChange?: (preset: GifSizePreset) => void;
  gifOutputDimensions?: { width: number; height: number };
  onExport?: () => void;
  selectedAnnotationId?: string | null;
  annotationRegions?: AnnotationRegion[];
  onAnnotationContentChange?: (id: string, content: string) => void;
  onAnnotationTypeChange?: (id: string, type: AnnotationType) => void;
  onAnnotationStyleChange?: (id: string, style: Partial<AnnotationRegion['style']>) => void;
  onAnnotationFigureDataChange?: (id: string, figureData: any) => void;
  onAnnotationDelete?: (id: string) => void;
}

export default SettingsPanel;

const ZOOM_DEPTH_OPTIONS: Array<{ depth: 1 | 2 | 3 | 4 | 5 | 6; label: string; scale: string }> = [
  { depth: 1, label: "1.25×", scale: "Small" },
  { depth: 2, label: "1.5×", scale: "Medium" },
  { depth: 3, label: "1.8×", scale: "Standard" },
  { depth: 4, label: "2.2×", scale: "Large" },
  { depth: 5, label: "3.5×", scale: "Extra" },
  { depth: 6, label: "5×", scale: "Max" },
];

export function SettingsPanel({ 
  selected, 
  onWallpaperChange, 
  selectedZoomDepth, 
  onZoomDepthChange, 
  selectedZoomId, 
  onZoomDelete, 
  selectedTrimId,
  onTrimDelete,
  shadowIntensity = 0, 
  onShadowChange, 
  showBlur, 
  onBlurChange, 
  motionBlurEnabled = true, 
  onMotionBlurChange, 
  borderRadius = 0, 
  onBorderRadiusChange, 
  padding = 50, 
  onPaddingChange, 
  cropRegion, 
  onCropChange, 
  aspectRatio, 
  videoElement, 
  exportQuality = 'good',
  onExportQualityChange,
  exportFormat = 'mp4',
  onExportFormatChange,
  gifFrameRate = 15,
  onGifFrameRateChange,
  gifLoop = true,
  onGifLoopChange,
  gifSizePreset = 'medium',
  onGifSizePresetChange,
  gifOutputDimensions = { width: 1280, height: 720 },
  onExport,
  selectedAnnotationId,
  annotationRegions = [],
  onAnnotationContentChange,
  onAnnotationTypeChange,
  onAnnotationStyleChange,
  onAnnotationFigureDataChange,
  onAnnotationDelete,
}: SettingsPanelProps) {
  const [wallpaperPaths, setWallpaperPaths] = useState<string[]>([]);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const resolved = await Promise.all(WALLPAPER_RELATIVE.map(p => getAssetPath(p)))
        if (mounted) setWallpaperPaths(resolved)
      } catch (err) {
        console.error('Failed to resolve wallpaper paths:', err)
        // Keep empty array on error - don't use hardcoded paths
        if (mounted) setWallpaperPaths([])
      }
    })()
    return () => { mounted = false }
  }, [])
  const colorPalette = [
    '#FF0000', '#FFD700', '#00FF00', '#FFFFFF', '#0000FF', '#FF6B00',
    '#9B59B6', '#E91E63', '#00BCD4', '#FF5722', '#8BC34A', '#FFC107',
    '#34B27B', '#000000', '#607D8B', '#795548',
  ];
  
  const [selectedColor, setSelectedColor] = useState('#ADADAD');
  const [gradient, setGradient] = useState<string>(GRADIENTS[0]);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  const zoomEnabled = Boolean(selectedZoomDepth);
  const trimEnabled = Boolean(selectedTrimId);
  
  const handleDeleteClick = () => {
    if (selectedZoomId && onZoomDelete) {
      onZoomDelete(selectedZoomId);
    }
  };

  const handleTrimDeleteClick = () => {
    if (selectedTrimId && onTrimDelete) {
      onTrimDelete(selectedTrimId);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type - only allow JPG/JPEG
    const validTypes = ['image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please upload a JPG or JPEG image file.',
      });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomImages(prev => [...prev, dataUrl]);
        onWallpaperChange(dataUrl);
        toast.success('Custom image uploaded successfully!');
      }
    };

    reader.onerror = () => {
      toast.error('Failed to upload image', {
        description: 'There was an error reading the file.',
      });
    };

    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  const handleRemoveCustomImage = (imageUrl: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCustomImages(prev => prev.filter(img => img !== imageUrl));
    // If the removed image was selected, use first resolved path or clear
    if (selected === imageUrl) {
      onWallpaperChange(wallpaperPaths[0] || '');
    }
  };

  // Find selected annotation
  const selectedAnnotation = selectedAnnotationId 
    ? annotationRegions.find(a => a.id === selectedAnnotationId)
    : null;

  // If an annotation is selected, show annotation settings instead
  if (selectedAnnotation && onAnnotationContentChange && onAnnotationTypeChange && onAnnotationStyleChange && onAnnotationDelete) {
    return (
      <AnnotationSettingsPanel
        annotation={selectedAnnotation}
        onContentChange={(content) => onAnnotationContentChange(selectedAnnotation.id, content)}
        onTypeChange={(type) => onAnnotationTypeChange(selectedAnnotation.id, type)}
        onStyleChange={(style) => onAnnotationStyleChange(selectedAnnotation.id, style)}
        onFigureDataChange={onAnnotationFigureDataChange ? (figureData) => onAnnotationFigureDataChange(selectedAnnotation.id, figureData) : undefined}
        onDelete={() => onAnnotationDelete(selectedAnnotation.id)}
      />
    );
  }

  return (
    <div className="flex-[2] min-w-0 bg-[#fafafa] border border-neutral-200 rounded-2xl p-4 flex flex-col shadow-sm h-full overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-neutral-800">Zoom Level</span>
          <div className="flex items-center gap-3">
            {zoomEnabled && selectedZoomDepth && (
              <span className="text-[10px] uppercase tracking-wider font-medium text-[#34B27B] bg-[#34B27B]/10 px-2 py-1 rounded-full">
                {ZOOM_DEPTH_OPTIONS.find(o => o.depth === selectedZoomDepth)?.label || `${selectedZoomDepth}x`} Active
              </span>
            )}
            <KeyboardShortcutsHelp />
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-1.5">
          {ZOOM_DEPTH_OPTIONS.map((option) => {
            const isActive = selectedZoomDepth === option.depth;
            return (
              <PushButton
                key={option.depth}
                disabled={!zoomEnabled}
                onClick={() => onZoomDepthChange?.(option.depth)}
                variant={isActive ? "accent" : "ghost"}
                size="sm"
                className={cn(
                  zoomEnabled ? "opacity-100" : "opacity-40"
                )}
              >
                {option.label}
              </PushButton>
            );
          })}
        </div>
        {zoomEnabled && (
          <PushButton
            onClick={handleDeleteClick}
            variant="danger"
            size="sm"
            className="mt-3 w-full gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Zoom Region
          </PushButton>
        )}
        {!zoomEnabled && (
          <p className="text-xs text-neutral-500 text-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 mt-3">
            Select a zoom region in the timeline to adjust depth.
          </p>
        )}
      </div>

      {/* Trim Delete Section */}
      <div className="mb-6">
        {trimEnabled && (
          <PushButton
            onClick={handleTrimDeleteClick}
            variant="danger"
            size="sm"
            className="w-full gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Trim Region
          </PushButton>
        )}
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Motion Blur Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200">
            <div className="text-xs font-medium text-neutral-700">Motion Blur</div>
            <ToggleSwitch
              checked={motionBlurEnabled ?? true}
              onCheckedChange={onMotionBlurChange ?? (() => {})}
              size="sm"
              activeColor="#34B27B"
              inactiveColor="#d4d4d4"
            />
          </div>
          {/* Blur Background Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200">
            <div className="text-xs font-medium text-neutral-700">Blur</div>
            <ToggleSwitch
              checked={showBlur ?? false}
              onCheckedChange={onBlurChange ?? (() => {})}
              size="sm"
              activeColor="#34B27B"
              inactiveColor="#d4d4d4"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Drop Shadow Slider */}
          <div className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-neutral-700">Shadow</div>
              <span className="text-[10px] text-neutral-500 font-mono">{Math.round(shadowIntensity * 100)}%</span>
            </div>
            <Slider
              value={[shadowIntensity]}
              onValueChange={(values) => onShadowChange?.(values[0])}
              min={0}
              max={1}
              step={0.01}
              className="w-full [&_[role=slider]]:bg-[#34B27B] [&_[role=slider]]:border-[#34B27B]"
            />
          </div>
          {/* Corner Roundness Slider */}
          <div className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-neutral-700">Roundness</div>
              <span className="text-[10px] text-neutral-500 font-mono">{borderRadius}px</span>
            </div>
            <Slider
              value={[borderRadius]}
              onValueChange={(values) => onBorderRadiusChange?.(values[0])}
              min={0}
              max={16}
              step={0.5}
              className="w-full [&_[role=slider]]:bg-[#34B27B] [&_[role=slider]]:border-[#34B27B]"
            />
          </div>
          {/* Padding Slider */}
          <div className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-neutral-700">Padding</div>
              <span className="text-[10px] text-neutral-500 font-mono">{padding}%</span>
            </div>
            <Slider
              value={[padding]}
              onValueChange={(values) => onPaddingChange?.(values[0])}
              min={0}
              max={100}
              step={1}
              className="w-full [&_[role=slider]]:bg-[#34B27B] [&_[role=slider]]:border-[#34B27B]"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <PushButton
          onClick={() => setShowCropDropdown(!showCropDropdown)}
          variant="default"
          size="md"
          className="w-full gap-2"
        >
          <Crop className="w-4 h-4" />
          Crop Video
        </PushButton>
      </div>
      
      {showCropDropdown && cropRegion && onCropChange && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setShowCropDropdown(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 w-[90vw] max-w-5xl max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xl font-bold text-neutral-800">Crop Video</span>
                <p className="text-sm text-neutral-500 mt-2">Drag on each side to adjust the crop area</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCropDropdown(false)}
                className="hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <CropControl
              videoElement={videoElement || null}
              cropRegion={cropRegion}
              onCropChange={onCropChange}
              aspectRatio={aspectRatio}
            />
            <div className="mt-6 flex justify-end">
              <PushButton
                onClick={() => setShowCropDropdown(false)}
                variant="accent"
                size="lg"
              >
                Done
              </PushButton>
            </div>
          </div>
        </>
      )}

      <Tabs defaultValue="image" className="flex-1 flex flex-col min-h-[200px]">
        <TabsList className="mb-4 bg-neutral-100 border border-neutral-200 p-1 w-full grid grid-cols-3 h-auto rounded-xl">
          <TabsTrigger value="image" className="data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow-sm text-neutral-500 py-2 rounded-lg transition-all">Image</TabsTrigger>
          <TabsTrigger value="color" className="data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow-sm text-neutral-500 py-2 rounded-lg transition-all">Color</TabsTrigger>
          <TabsTrigger value="gradient" className="data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow-sm text-neutral-500 py-2 rounded-lg transition-all">Gradient</TabsTrigger>
        </TabsList>
        
        <div className="min-h-[220px] max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          <TabsContent value="image" className="mt-0 space-y-3 px-2">
            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept=".jpg,.jpeg,image/jpeg"
              className="hidden"
            />
            <PushButton
              onClick={() => fileInputRef.current?.click()}
              variant="default"
              size="sm"
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Custom Image
            </PushButton>

            <div className="grid grid-cols-6 gap-2.5">
              {/* Custom Images */}
              {customImages.map((imageUrl, idx) => {
                const isSelected = selected === imageUrl;
                return (
                  <div
                    key={`custom-${idx}`}
                    className={cn(
                      "aspect-square w-12 h-12 rounded-md border-2 overflow-hidden cursor-pointer transition-all duration-200 relative group shadow-sm",
                      isSelected
                        ? "border-[#34B27B] ring-2 ring-[#34B27B]/30 scale-105 shadow-lg shadow-[#34B27B]/10"
                        : "border-neutral-200 hover:border-[#34B27B]/40 hover:scale-105 opacity-80 hover:opacity-100 bg-neutral-100"
                    )}
                    style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    aria-label={`Custom Image ${idx + 1}`}
                    onClick={() => onWallpaperChange(imageUrl)}
                    role="button"
                  >
                    <button
                      onClick={(e) => handleRemoveCustomImage(imageUrl, e)}
                      className="absolute top-1 right-1 w-4 h-4 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Remove custom image"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                );
              })}

              {/* Preset Wallpapers - only render if paths are resolved */}
              {wallpaperPaths.length > 0 && WALLPAPER_RELATIVE.map((relativePath, idx) => {
                const path = wallpaperPaths[idx];
                const isSelected = (() => {
                  if (!selected) return false;
                  if (selected === path) return true;
                  try {
                    const clean = (s: string) => s.replace(/^file:\/\//, '').replace(/^\//, '')
                    if (clean(selected).endsWith(clean(path))) return true;
                    if (clean(path).endsWith(clean(selected))) return true;
                  } catch {}
                  return false;
                })();
                return (
                  <div
                    key={`wallpaper-${idx}-${relativePath}`}
                    className={cn(
                      "aspect-square w-12 h-12 rounded-md border-2 overflow-hidden cursor-pointer transition-all duration-200 shadow-sm",
                      isSelected
                        ? "border-[#34B27B] ring-2 ring-[#34B27B]/30 scale-105 shadow-lg shadow-[#34B27B]/10"
                        : "border-neutral-200 hover:border-[#34B27B]/40 hover:scale-105 opacity-80 hover:opacity-100 bg-neutral-100"
                    )}
                    style={{ backgroundImage: `url(${path})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    aria-label={`Wallpaper ${idx + 1}`}
                    onClick={() => onWallpaperChange(path)}
                    role="button"
                  />
                )
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="color" className="mt-0 px-2">
            <div className="p-1">
              <Block
                color={selectedColor}
                colors={colorPalette}
                onChange={(color) => {
                  setSelectedColor(color.hex);
                  onWallpaperChange(color.hex);
                }}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="gradient" className="mt-0 px-2">
            <div className="grid grid-cols-6 gap-2.5">
              {GRADIENTS.map((g, idx) => (
                <div
                  key={g}
                  className={cn(
                    "aspect-square w-12 h-12 rounded-md border-2 overflow-hidden cursor-pointer transition-all duration-200 shadow-sm",
                    gradient === g 
                      ? "border-[#34B27B] ring-2 ring-[#34B27B]/30 scale-105 shadow-lg shadow-[#34B27B]/10" 
                      : "border-neutral-200 hover:border-[#34B27B]/40 hover:scale-105 opacity-80 hover:opacity-100 bg-neutral-100"
                  )}
                  style={{ background: g }}
                  aria-label={`Gradient ${idx + 1}`}
                  onClick={() => { setGradient(g); onWallpaperChange(g); }}
                  role="button"
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        {/* Format Selection */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">Export Format</div>
          <div className="grid grid-cols-2 gap-2">
            <PushButton
              onClick={() => onExportFormatChange?.('mp4')}
              variant={exportFormat === 'mp4' ? "accent" : "ghost"}
              size="md"
              className="gap-2"
            >
              <Film className="w-4 h-4" />
              MP4
            </PushButton>
            <PushButton
              onClick={() => onExportFormatChange?.('gif')}
              variant={exportFormat === 'gif' ? "accent" : "ghost"}
              size="md"
              className="gap-2"
            >
              <Image className="w-4 h-4" />
              GIF
            </PushButton>
          </div>
        </div>

        {/* MP4 Quality Options */}
        {exportFormat === 'mp4' && (
          <>
            <div className="mb-2 text-xs font-medium text-neutral-500">Export Quality</div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              <PushButton
                onClick={() => onExportQualityChange?.('medium')}
                variant={exportQuality === 'medium' ? "accent" : "ghost"}
                size="sm"
              >
                Low
              </PushButton>
              <PushButton
                onClick={() => onExportQualityChange?.('good')}
                variant={exportQuality === 'good' ? "accent" : "ghost"}
                size="sm"
              >
                Medium
              </PushButton>
              <PushButton
                onClick={() => onExportQualityChange?.('source')}
                variant={exportQuality === 'source' ? "accent" : "ghost"}
                size="sm"
              >
                High
              </PushButton>
            </div>
          </>
        )}

        {/* GIF Options */}
        {exportFormat === 'gif' && (
          <div className="mb-4 space-y-3">
            {/* Frame Rate */}
            <div>
              <div className="mb-1.5 text-xs font-medium text-neutral-500">Frame Rate</div>
              <div className="grid grid-cols-4 gap-1">
                {GIF_FRAME_RATES.map((rate) => (
                  <PushButton
                    key={rate.value}
                    onClick={() => onGifFrameRateChange?.(rate.value)}
                    variant={gifFrameRate === rate.value ? "accent" : "ghost"}
                    size="sm"
                  >
                    {rate.value}
                  </PushButton>
                ))}
              </div>
            </div>

            {/* Size Preset */}
            <div>
              <div className="mb-1.5 text-xs font-medium text-neutral-500">Output Size</div>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(GIF_SIZE_PRESETS).map(([key, _preset]) => (
                  <PushButton
                    key={key}
                    onClick={() => onGifSizePresetChange?.(key as GifSizePreset)}
                    variant={gifSizePreset === key ? "accent" : "ghost"}
                    size="sm"
                  >
                    {key === 'original' ? 'Orig' : key.charAt(0).toUpperCase() + key.slice(1, 3)}
                  </PushButton>
                ))}
              </div>
              <div className="mt-1 text-[10px] text-neutral-500">
                {gifOutputDimensions.width} × {gifOutputDimensions.height}px
              </div>
            </div>

            {/* Loop Toggle */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-medium text-neutral-700">Loop Animation</span>
              <ToggleSwitch
                checked={gifLoop}
                onCheckedChange={onGifLoopChange ?? (() => {})}
                size="sm"
                activeColor="#34B27B"
                inactiveColor="#d4d4d4"
              />
            </div>
          </div>
        )}
        
        <PushButton
          onClick={onExport}
          variant="accent"
          size="lg"
          className="w-full gap-2"
        >
          <Download className="w-5 h-5" />
          Export {exportFormat === 'gif' ? 'GIF' : 'Video'}
        </PushButton>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <PushButton
            onClick={() => {
              window.electronAPI?.openExternalUrl('https://github.com/siddharthvaddem/openscreen/issues/new/choose');
            }}
            variant="ghost"
            size="sm"
            className="gap-1.5"
          >
            <Bug className="w-3.5 h-3.5 text-[#34B27B]" />
            Report a Bug
          </PushButton>
          <PushButton
            onClick={() => {
              window.electronAPI?.openExternalUrl('https://github.com/siddharthvaddem/openscreen');
            }}
            variant="ghost"
            size="sm"
            className="gap-1.5"
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            Star on GitHub
          </PushButton>
        </div>
      </div>
    </div>
  );
}
