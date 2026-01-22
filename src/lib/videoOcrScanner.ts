/**
 * Video OCR Scanner
 * 
 * Scans video frames for text and detects sensitive information
 * using Tesseract.js (runs locally, no API needed).
 * 
 * NOTE: Tesseract is dynamically imported to avoid slow initial load
 */

import { detectSensitiveInText, type SensitiveDetectorConfig, DEFAULT_CONFIG } from './sensitiveDetector';

// Lazy-loaded Tesseract module
let TesseractModule: typeof import('tesseract.js') | null = null;

async function loadTesseract() {
  if (!TesseractModule) {
    TesseractModule = await import('tesseract.js');
  }
  return TesseractModule;
}

export interface ScanRegion {
  id: string;
  text: string;
  patternId: string;
  patternName: string;
  // Bounding box in video coordinates (normalized 0-1)
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // Time range where this was detected
  startMs: number;
  endMs: number;
  confidence: number;
}

export interface ScanProgress {
  phase: 'extracting' | 'scanning' | 'analyzing' | 'complete';
  current: number;
  total: number;
  message: string;
}

export interface ScanResult {
  regions: ScanRegion[];
  scannedFrames: number;
  totalText: number;
  duration: number;
}

/**
 * Extract frames from video at specified intervals
 */
async function extractFrames(
  video: HTMLVideoElement,
  intervalMs: number = 2000, // Sample every 2 seconds
  onProgress?: (progress: ScanProgress) => void
): Promise<Array<{ timestamp: number; imageData: ImageData; canvas: HTMLCanvasElement }>> {
  const frames: Array<{ timestamp: number; imageData: ImageData; canvas: HTMLCanvasElement }> = [];
  const duration = video.duration * 1000;
  const totalFrames = Math.ceil(duration / intervalMs);
  
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d')!;
  
  for (let i = 0; i < totalFrames; i++) {
    const timestamp = i * intervalMs;
    
    onProgress?.({
      phase: 'extracting',
      current: i + 1,
      total: totalFrames,
      message: `Extracting frame ${i + 1}/${totalFrames}...`,
    });
    
    // Seek to timestamp
    video.currentTime = timestamp / 1000;
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        resolve();
      };
      video.addEventListener('seeked', onSeeked);
    });
    
    // Draw frame to canvas
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create a copy of the canvas for this frame
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = canvas.width;
    frameCanvas.height = canvas.height;
    const frameCtx = frameCanvas.getContext('2d')!;
    frameCtx.putImageData(imageData, 0, 0);
    
    frames.push({ timestamp, imageData, canvas: frameCanvas });
  }
  
  return frames;
}

/**
 * Run OCR on a single frame
 */
async function scanFrame(
  canvas: HTMLCanvasElement,
  worker: any // Tesseract.Worker
): Promise<any> {
  return await worker.recognize(canvas);
}

/**
 * Scan video for sensitive information
 */
export async function scanVideoForSensitiveInfo(
  video: HTMLVideoElement,
  config: SensitiveDetectorConfig = DEFAULT_CONFIG,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const startTime = Date.now();
  const regions: ScanRegion[] = [];
  let totalText = 0;
  
  // Dynamically load Tesseract to avoid slowing down initial app load
  const Tesseract = await loadTesseract();
  
  // Initialize Tesseract worker
  onProgress?.({
    phase: 'scanning',
    current: 0,
    total: 1,
    message: 'Initializing OCR engine...',
  });
  
  const worker = await Tesseract.createWorker('eng+chi_sim', 1, {
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        // Progress update during recognition
      }
    },
  });
  
  try {
    // Extract frames
    const intervalMs = 2000; // Sample every 2 seconds
    const frames = await extractFrames(video, intervalMs, onProgress);
    
    // Scan each frame
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      
      onProgress?.({
        phase: 'scanning',
        current: i + 1,
        total: frames.length,
        message: `Scanning frame ${i + 1}/${frames.length} for text...`,
      });
      
      const result = await scanFrame(frame.canvas, worker);
      
      if (!result.data.text.trim()) continue;
      
      totalText += result.data.text.length;
      
      // Detect sensitive information in the text
      const sensitiveMatches = detectSensitiveInText(result.data.text, config);
      
      if (sensitiveMatches.length === 0) continue;
      
      onProgress?.({
        phase: 'analyzing',
        current: i + 1,
        total: frames.length,
        message: `Found ${sensitiveMatches.length} sensitive items in frame ${i + 1}...`,
      });
      
      // Find bounding boxes for each match
      for (const match of sensitiveMatches) {
        // Find the word(s) that contain this match
        // Use type assertion since Tesseract types may not include words
        const words = (result.data as any).words || [];
        
        for (const word of words) {
          if (word.text.includes(match.match) || match.match.includes(word.text)) {
            // Normalize coordinates to 0-1 range
            const bounds = {
              x: word.bbox.x0 / frame.canvas.width,
              y: word.bbox.y0 / frame.canvas.height,
              width: (word.bbox.x1 - word.bbox.x0) / frame.canvas.width,
              height: (word.bbox.y1 - word.bbox.y0) / frame.canvas.height,
            };
            
            // Check if we already have a similar region
            const existing = regions.find(r => 
              r.patternId === match.patternId &&
              Math.abs(r.bounds.x - bounds.x) < 0.05 &&
              Math.abs(r.bounds.y - bounds.y) < 0.05
            );
            
            if (existing) {
              // Extend the time range
              existing.endMs = Math.max(existing.endMs, frame.timestamp + intervalMs);
            } else {
              // Add new region
              regions.push({
                id: `sensitive-${Date.now()}-${regions.length}`,
                text: match.match,
                patternId: match.patternId,
                patternName: match.patternName,
                bounds,
                startMs: Math.max(0, frame.timestamp - intervalMs / 2),
                endMs: frame.timestamp + intervalMs,
                confidence: word.confidence,
              });
            }
          }
        }
      }
    }
    
    onProgress?.({
      phase: 'complete',
      current: frames.length,
      total: frames.length,
      message: `Scan complete. Found ${regions.length} sensitive regions.`,
    });
    
  } finally {
    await worker.terminate();
  }
  
  return {
    regions,
    scannedFrames: Math.ceil(video.duration * 1000 / 2000),
    totalText,
    duration: Date.now() - startTime,
  };
}

/**
 * Quick scan using fewer frames for faster results
 */
export async function quickScanVideo(
  video: HTMLVideoElement,
  config: SensitiveDetectorConfig = DEFAULT_CONFIG,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const startTime = Date.now();
  const regions: ScanRegion[] = [];
  let totalText = 0;
  
  // Dynamically load Tesseract to avoid slowing down initial app load
  const Tesseract = await loadTesseract();
  
  // Initialize Tesseract worker
  onProgress?.({
    phase: 'scanning',
    current: 0,
    total: 1,
    message: 'Initializing OCR engine...',
  });
  
  const worker = await Tesseract.createWorker('eng+chi_sim');
  
  try {
    // Quick scan: only check first, middle, and last frames + every 5 seconds
    const duration = video.duration * 1000;
    const timestamps = [
      0,
      duration / 4,
      duration / 2,
      duration * 3 / 4,
      duration - 100,
    ];
    
    // Add samples every 5 seconds
    for (let t = 5000; t < duration; t += 5000) {
      if (!timestamps.includes(t)) {
        timestamps.push(t);
      }
    }
    
    timestamps.sort((a, b) => a - b);
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];
      
      onProgress?.({
        phase: 'scanning',
        current: i + 1,
        total: timestamps.length,
        message: `Quick scanning frame ${i + 1}/${timestamps.length}...`,
      });
      
      // Seek to timestamp
      video.currentTime = timestamp / 1000;
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });
      
      // Draw and scan
      ctx.drawImage(video, 0, 0);
      const result = await worker.recognize(canvas);
      
      if (!result.data.text.trim()) continue;
      
      totalText += result.data.text.length;
      
      // Detect sensitive information
      const sensitiveMatches = detectSensitiveInText(result.data.text, config);
      
      for (const match of sensitiveMatches) {
        // Use type assertion since Tesseract types may not include words
        const words = (result.data as any).words || [];
        
        for (const word of words) {
          if (word.text.includes(match.match) || match.match.includes(word.text)) {
            const bounds = {
              x: word.bbox.x0 / canvas.width,
              y: word.bbox.y0 / canvas.height,
              width: (word.bbox.x1 - word.bbox.x0) / canvas.width,
              height: (word.bbox.y1 - word.bbox.y0) / canvas.height,
            };
            
            const existing = regions.find(r => 
              r.patternId === match.patternId &&
              Math.abs(r.bounds.x - bounds.x) < 0.05 &&
              Math.abs(r.bounds.y - bounds.y) < 0.05
            );
            
            if (existing) {
              existing.endMs = Math.max(existing.endMs, timestamp + 2000);
            } else {
              regions.push({
                id: `sensitive-${Date.now()}-${regions.length}`,
                text: match.match,
                patternId: match.patternId,
                patternName: match.patternName,
                bounds,
                startMs: Math.max(0, timestamp - 1000),
                endMs: timestamp + 2000,
                confidence: word.confidence,
              });
            }
          }
        }
      }
    }
    
    onProgress?.({
      phase: 'complete',
      current: timestamps.length,
      total: timestamps.length,
      message: `Quick scan complete. Found ${regions.length} sensitive regions.`,
    });
    
  } finally {
    await worker.terminate();
  }
  
  return {
    regions,
    scannedFrames: 5,
    totalText,
    duration: Date.now() - startTime,
  };
}
