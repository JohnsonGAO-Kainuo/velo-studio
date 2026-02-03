/**
 * Cursor Tracking System for Auto-Zoom
 * 
 * Records mouse movements and clicks during screen recording,
 * then analyzes the data to automatically generate zoom regions.
 */

export interface CursorEvent {
  x: number;          // X position (normalized 0-1)
  y: number;          // Y position (normalized 0-1)
  timestamp: number;  // Time since recording start (ms)
  type: 'move' | 'click' | 'scroll';
  button?: number;    // For clicks: 0=left, 1=middle, 2=right
  scrollDelta?: number; // For scroll events
}

export interface CursorTrackingData {
  events: CursorEvent[];
  screenWidth: number;
  screenHeight: number;
  duration: number;   // Total recording duration (ms)
}

export interface AutoZoomRegion {
  id: string;
  startTime: number;  // Start time (seconds)
  endTime: number;    // End time (seconds)  
  x: number;          // Center X (normalized 0-1)
  y: number;          // Center Y (normalized 0-1)
  depth: ZoomDepthLevel;  // Zoom depth level (1-6)
  reason: 'click' | 'focus' | 'scroll' | 'movement' | 'slowdown';
  confidence: number; // 0-1 confidence score
}

/**
 * Configuration for auto-zoom detection
 */
// ZoomDepth type: 1=1.25x, 2=1.5x, 3=1.8x, 4=2.2x, 5=3.5x, 6=5.0x
export type ZoomDepthLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface AutoZoomConfig {
  // Minimum time between zoom regions (seconds)
  minZoomInterval: number;
  // Default zoom duration (seconds)
  zoomDuration: number;
  // Click zoom depth level (1-6)
  clickZoomDepth: ZoomDepthLevel;
  // Focus/hover zoom depth level (1-6)
  focusZoomDepth: ZoomDepthLevel;
  // Minimum dwell time to trigger focus zoom (ms)
  dwellTimeThreshold: number;
  // Speed slowdown detection threshold (ratio)
  slowdownRatio: number;
  // Minimum click gap to consider as intentional (ms)
  minClickGap: number;
  // Maximum zooms per minute (to prevent over-zooming)
  maxZoomsPerMinute: number;
  // Cluster distance threshold (normalized)
  clusterThreshold: number;
}

const DEFAULT_CONFIG: AutoZoomConfig = {
  minZoomInterval: 1.0,      // 1.0 seconds between zooms (更频繁响应点击)
  zoomDuration: 3.0,         // Each zoom lasts 3.0 seconds (让用户看得更清楚)
  clickZoomDepth: 3,         // Depth level 3 = 1.8x zoom for clicks
  focusZoomDepth: 2,         // Depth level 2 = 1.5x zoom for focus/hover
  dwellTimeThreshold: 1500,  // 1.5 seconds dwell time (提高，减少误触)
  slowdownRatio: 0.15,       // Speed drops to 15% = important area (更严格)
  minClickGap: 250,          // 250ms minimum between clicks (识别更多有效点击)
  maxZoomsPerMinute: 30,     // Maximum 30 zooms per minute (点击优先，可以更多)
  clusterThreshold: 0.06,    // 6% of screen = same cluster (合并更紧密的点)
};

/**
 * Calculate cursor speed at a given point
 */
function calculateSpeed(events: CursorEvent[], index: number, windowMs: number = 100): number {
  if (index < 1) return 0;
  
  const current = events[index];
  let totalDistance = 0;
  let totalTime = 0;
  
  // Look back within the time window
  for (let i = index - 1; i >= 0; i--) {
    const prev = events[i];
    if (current.timestamp - prev.timestamp > windowMs) break;
    
    const dx = current.x - prev.x;
    const dy = current.y - prev.y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
    totalTime = current.timestamp - prev.timestamp;
  }
  
  return totalTime > 0 ? totalDistance / totalTime * 1000 : 0; // normalized units per second
}

/**
 * Filter rapid clicks that are likely unintentional (e.g., double-clicks)
 */
function filterIntentionalClicks(clickEvents: CursorEvent[], minGap: number): CursorEvent[] {
  if (clickEvents.length === 0) return [];
  
  const filtered: CursorEvent[] = [clickEvents[0]];
  
  for (let i = 1; i < clickEvents.length; i++) {
    const timeSinceLast = clickEvents[i].timestamp - clickEvents[i - 1].timestamp;
    
    // Keep click if enough time has passed OR if it's in a different location
    if (timeSinceLast >= minGap) {
      const dx = Math.abs(clickEvents[i].x - clickEvents[i - 1].x);
      const dy = Math.abs(clickEvents[i].y - clickEvents[i - 1].y);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Different location or enough time passed
      if (distance > 0.05 || timeSinceLast >= minGap * 2) {
        filtered.push(clickEvents[i]);
      }
    }
  }
  
  return filtered;
}

/**
 * Cluster nearby zoom candidates together
 */
interface ZoomCandidate {
  x: number;
  y: number;
  timestamp: number;
  reason: AutoZoomRegion['reason'];
  priority: number; // Higher = more important
}

function clusterCandidates(
  candidates: ZoomCandidate[],
  threshold: number,
  timeWindow: number = 3000 // 3 seconds
): ZoomCandidate[] {
  if (candidates.length === 0) return [];
  
  const clusters: ZoomCandidate[][] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < candidates.length; i++) {
    if (used.has(i)) continue;
    
    const cluster: ZoomCandidate[] = [candidates[i]];
    used.add(i);
    
    for (let j = i + 1; j < candidates.length; j++) {
      if (used.has(j)) continue;
      
      const dx = Math.abs(candidates[j].x - candidates[i].x);
      const dy = Math.abs(candidates[j].y - candidates[i].y);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDiff = Math.abs(candidates[j].timestamp - candidates[i].timestamp);
      
      // Cluster if close in space AND time
      if (distance < threshold && timeDiff < timeWindow) {
        cluster.push(candidates[j]);
        used.add(j);
      }
    }
    
    clusters.push(cluster);
  }
  
  // For each cluster, pick the best representative
  return clusters.map(cluster => {
    // Sort by priority (highest first)
    cluster.sort((a, b) => b.priority - a.priority);
    
    // Return the highest priority candidate with averaged position
    const avgX = cluster.reduce((sum, c) => sum + c.x, 0) / cluster.length;
    const avgY = cluster.reduce((sum, c) => sum + c.y, 0) / cluster.length;
    
    return {
      ...cluster[0],
      x: avgX,
      y: avgY,
      priority: cluster[0].priority + cluster.length * 0.1, // Boost priority for larger clusters
    };
  });
}

/**
 * Analyze cursor tracking data and generate auto-zoom regions
 */
export function generateAutoZoomRegions(
  data: CursorTrackingData,
  config: Partial<AutoZoomConfig> = {}
): AutoZoomRegion[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const regions: AutoZoomRegion[] = [];
  
  if (data.events.length === 0) {
    return regions;
  }

  // Sort events by timestamp
  const sortedEvents = [...data.events].sort((a, b) => a.timestamp - b.timestamp);
  const durationSeconds = data.duration / 1000;
  
  // Calculate maximum allowed zooms
  const maxZooms = Math.floor((durationSeconds / 60) * cfg.maxZoomsPerMinute);
  
  // Collect all zoom candidates
  const candidates: ZoomCandidate[] = [];
  
  // 1. Find click events - these are PRIMARY zoom targets (highest priority)
  const clickEvents = sortedEvents.filter(e => e.type === 'click');
  const filteredClicks = filterIntentionalClicks(clickEvents, cfg.minClickGap);
  
  for (const click of filteredClicks) {
    candidates.push({
      x: click.x,
      y: click.y,
      timestamp: click.timestamp,
      reason: 'click',
      priority: 100, // Significantly higher priority for clicks!
    });
  }
  
  // 2. Find dwell/focus areas (cursor stays in one place) - LOWER priority
  const dwellAreas = findDwellAreas(sortedEvents, cfg.dwellTimeThreshold);
  for (const dwell of dwellAreas) {
    candidates.push({
      x: dwell.x,
      y: dwell.y,
      timestamp: dwell.timestamp,
      reason: 'focus',
      priority: 30, // Medium priority
    });
  }
  
  // 3. Find speed slowdown areas - LOWEST priority
  const slowdowns = findSlowdownAreas(sortedEvents, cfg.slowdownRatio);
  for (const slowdown of slowdowns) {
    candidates.push({
      x: slowdown.x,
      y: slowdown.y,
      timestamp: slowdown.timestamp,
      reason: 'slowdown',
      priority: 10, // Low priority
    });
  }
  
  // 4. Cluster nearby candidates
  const clusteredCandidates = clusterCandidates(candidates, cfg.clusterThreshold);
  
  // 5. Sort by priority (descending) then by timestamp (ascending)
  clusteredCandidates.sort((a, b) => {
    if (Math.abs(a.priority - b.priority) > 0.5) {
      return b.priority - a.priority;
    }
    return a.timestamp - b.timestamp;
  });
  
  // 6. Select zoom regions respecting intervals and max count
  let lastZoomEnd = -cfg.minZoomInterval * 1000; // Allow first zoom immediately
  
  for (const candidate of clusteredCandidates) {
    if (regions.length >= maxZooms) break;
    
    // For clicks: start 0.8s before click, for others: start 0.3s before
    // This captures the approach movement before the click
    const preTime = candidate.reason === 'click' ? 0.8 : 0.3;
    const startTime = Math.max(candidate.timestamp / 1000 - preTime, 0);
    const endTime = startTime + cfg.zoomDuration;
    
    // Check minimum interval
    if (candidate.timestamp < lastZoomEnd + cfg.minZoomInterval * 1000) {
      continue;
    }
    
    // Check for overlaps with existing regions
    const overlaps = regions.some(r => 
      (startTime >= r.startTime && startTime <= r.endTime) ||
      (endTime >= r.startTime && endTime <= r.endTime) ||
      (startTime <= r.startTime && endTime >= r.endTime)
    );
    
    if (overlaps) continue;
    
    // Determine zoom depth based on reason and priority
    let depth: ZoomDepthLevel;
    let confidence: number;
    
    switch (candidate.reason) {
      case 'click':
        depth = cfg.clickZoomDepth;
        confidence = 0.9;
        break;
      case 'focus':
        depth = cfg.focusZoomDepth;
        confidence = 0.7;
        break;
      case 'slowdown':
        depth = Math.max(1, cfg.focusZoomDepth - 1) as ZoomDepthLevel;
        confidence = 0.5;
        break;
      default:
        depth = 2;
        confidence = 0.4;
    }
    
    // Boost confidence for clustered candidates
    confidence = Math.min(1.0, confidence + (candidate.priority - 10) * 0.02);
    
    regions.push({
      id: `auto-zoom-${candidate.reason}-${regions.length}`,
      startTime,
      endTime,
      x: candidate.x,
      y: candidate.y,
      depth,
      reason: candidate.reason,
      confidence,
    });
    
    lastZoomEnd = endTime * 1000;
  }
  
  // Sort by start time
  regions.sort((a, b) => a.startTime - b.startTime);
  
  console.log(`[AutoZoom] Generated ${regions.length} zoom regions from ${candidates.length} candidates (max: ${maxZooms})`);
  
  return regions;
}

/**
 * Find areas where cursor dwells (stays in one place)
 */
function findDwellAreas(
  events: CursorEvent[],
  dwellThreshold: number
): CursorEvent[] {
  const dwellAreas: CursorEvent[] = [];
  const positionThreshold = 0.03; // 3% of screen (slightly more lenient)
  
  let dwellStart = 0;
  let dwellX = 0;
  let dwellY = 0;
  let dwellCount = 0;
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    if (event.type !== 'move') continue;
    
    if (dwellCount === 0) {
      dwellStart = event.timestamp;
      dwellX = event.x;
      dwellY = event.y;
      dwellCount = 1;
      continue;
    }
    
    const dx = Math.abs(event.x - dwellX);
    const dy = Math.abs(event.y - dwellY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < positionThreshold) {
      // Still dwelling - update average position
      dwellCount++;
      dwellX = (dwellX * (dwellCount - 1) + event.x) / dwellCount;
      dwellY = (dwellY * (dwellCount - 1) + event.y) / dwellCount;
      
      const dwellDuration = event.timestamp - dwellStart;
      if (dwellDuration >= dwellThreshold && dwellCount >= 3) {
        // Found a dwell area
        dwellAreas.push({
          x: dwellX,
          y: dwellY,
          timestamp: dwellStart + dwellDuration / 2, // Center of dwell period
          type: 'move',
        });
        // Reset to prevent duplicate detections
        dwellCount = 0;
      }
    } else {
      // Moved away, reset dwell tracking
      dwellStart = event.timestamp;
      dwellX = event.x;
      dwellY = event.y;
      dwellCount = 1;
    }
  }
  
  return dwellAreas;
}

/**
 * Find areas where cursor speed significantly decreases (indicating attention)
 */
function findSlowdownAreas(
  events: CursorEvent[],
  slowdownRatio: number
): CursorEvent[] {
  const slowdowns: CursorEvent[] = [];
  const moveEvents = events.filter(e => e.type === 'move');
  
  if (moveEvents.length < 10) return slowdowns;
  
  // Calculate average speed
  let totalSpeed = 0;
  const speeds: number[] = [];
  
  for (let i = 1; i < moveEvents.length; i++) {
    const speed = calculateSpeed(moveEvents, i, 150);
    speeds.push(speed);
    totalSpeed += speed;
  }
  
  const avgSpeed = totalSpeed / speeds.length;
  if (avgSpeed < 0.01) return slowdowns; // Not enough movement
  
  const slowdownThreshold = avgSpeed * slowdownRatio;
  
  // Find significant slowdowns
  let inSlowdown = false;
  let slowdownStart = 0;
  let slowdownX = 0;
  let slowdownY = 0;
  
  for (let i = 0; i < speeds.length; i++) {
    const event = moveEvents[i + 1];
    
    if (speeds[i] < slowdownThreshold && !inSlowdown) {
      // Starting a slowdown
      inSlowdown = true;
      slowdownStart = event.timestamp;
      slowdownX = event.x;
      slowdownY = event.y;
    } else if (speeds[i] >= slowdownThreshold && inSlowdown) {
      // Ending a slowdown
      const duration = event.timestamp - slowdownStart;
      
      // Only count if slowdown lasted a meaningful amount of time
      if (duration >= 300) { // 300ms minimum
        slowdowns.push({
          x: slowdownX,
          y: slowdownY,
          timestamp: slowdownStart,
          type: 'move',
        });
      }
      
      inSlowdown = false;
    } else if (inSlowdown) {
      // Update slowdown position (weighted towards current)
      slowdownX = slowdownX * 0.7 + event.x * 0.3;
      slowdownY = slowdownY * 0.7 + event.y * 0.3;
    }
  }
  
  return slowdowns;
}

/**
 * Convert cursor tracking data to a storable format
 */
export function serializeCursorData(data: CursorTrackingData): string {
  return JSON.stringify(data);
}

/**
 * Parse stored cursor tracking data
 */
export function deserializeCursorData(json: string): CursorTrackingData | null {
  try {
    return JSON.parse(json) as CursorTrackingData;
  } catch {
    return null;
  }
}
