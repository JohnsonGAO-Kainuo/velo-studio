/**
 * Sensitive Information Detector
 * 
 * Detects and masks sensitive information in screen recordings
 * using pattern matching (no AI required).
 */

export interface SensitivePattern {
  id: string;
  name: string;
  pattern: RegExp;
  enabled: boolean;
  category: 'api-key' | 'credential' | 'personal' | 'custom';
  description: string;
}

export interface DetectedSensitive {
  id: string;
  patternId: string;
  patternName: string;
  matchedText: string;
  // Position in the frame (normalized 0-1)
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number; // ms from video start
  frameIndex: number;
}

export interface SensitiveDetectorConfig {
  patterns: SensitivePattern[];
  customKeywords: string[];
  blurIntensity: number; // 0-100
  maskType: 'blur' | 'pixelate' | 'blackout' | 'redact';
}

// Built-in patterns for common sensitive information
export const DEFAULT_PATTERNS: SensitivePattern[] = [
  // API Keys
  {
    id: 'openai-api-key',
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{20,}/g,
    enabled: true,
    category: 'api-key',
    description: 'OpenAI API keys starting with sk-',
  },
  {
    id: 'anthropic-api-key',
    name: 'Anthropic API Key',
    pattern: /sk-ant-[a-zA-Z0-9-]{20,}/g,
    enabled: true,
    category: 'api-key',
    description: 'Anthropic API keys',
  },
  {
    id: 'github-token',
    name: 'GitHub Token',
    pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g,
    enabled: true,
    category: 'api-key',
    description: 'GitHub personal access tokens',
  },
  {
    id: 'aws-access-key',
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    enabled: true,
    category: 'api-key',
    description: 'AWS Access Key IDs',
  },
  {
    id: 'aws-secret-key',
    name: 'AWS Secret Key',
    pattern: /[A-Za-z0-9/+=]{40}/g,
    enabled: false, // Too many false positives, disabled by default
    category: 'api-key',
    description: 'AWS Secret Access Keys (may have false positives)',
  },
  {
    id: 'stripe-api-key',
    name: 'Stripe API Key',
    pattern: /sk_(?:live|test)_[a-zA-Z0-9]{24,}/g,
    enabled: true,
    category: 'api-key',
    description: 'Stripe API keys',
  },
  {
    id: 'generic-api-key',
    name: 'Generic API Key',
    pattern: /(?:api[_-]?key|apikey|api_secret|access[_-]?token)[=:\s]["']?([a-zA-Z0-9_-]{20,})["']?/gi,
    enabled: true,
    category: 'api-key',
    description: 'Generic API key patterns',
  },
  
  // Credentials
  {
    id: 'password-field',
    name: 'Password Field',
    pattern: /(?:password|passwd|pwd)[=:\s]["']?[^\s"']{4,}["']?/gi,
    enabled: true,
    category: 'credential',
    description: 'Password fields and values',
  },
  {
    id: 'bearer-token',
    name: 'Bearer Token',
    pattern: /Bearer\s+[a-zA-Z0-9._-]{20,}/g,
    enabled: true,
    category: 'credential',
    description: 'Bearer authentication tokens',
  },
  {
    id: 'jwt-token',
    name: 'JWT Token',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    enabled: true,
    category: 'credential',
    description: 'JSON Web Tokens',
  },
  
  // Personal Information
  {
    id: 'email-address',
    name: 'Email Address',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    enabled: false, // Disabled by default
    category: 'personal',
    description: 'Email addresses',
  },
  {
    id: 'phone-number-cn',
    name: 'Phone Number (China)',
    pattern: /(?:1[3-9]\d{9})|(?:\+86\s?1[3-9]\d{9})/g,
    enabled: false,
    category: 'personal',
    description: 'Chinese phone numbers',
  },
  {
    id: 'phone-number-us',
    name: 'Phone Number (US)',
    pattern: /(?:\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    enabled: false,
    category: 'personal',
    description: 'US phone numbers',
  },
  {
    id: 'credit-card',
    name: 'Credit Card Number',
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    enabled: true,
    category: 'personal',
    description: 'Credit card numbers (Visa, MasterCard, Amex, Discover)',
  },
  {
    id: 'ip-address',
    name: 'IP Address',
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    enabled: false,
    category: 'personal',
    description: 'IPv4 addresses',
  },
];

export const DEFAULT_CONFIG: SensitiveDetectorConfig = {
  patterns: DEFAULT_PATTERNS,
  customKeywords: [],
  blurIntensity: 50,
  maskType: 'blur',
};

/**
 * Detect sensitive information in text content
 */
export function detectSensitiveInText(
  text: string,
  config: SensitiveDetectorConfig = DEFAULT_CONFIG
): Array<{ patternId: string; patternName: string; match: string; index: number }> {
  const results: Array<{ patternId: string; patternName: string; match: string; index: number }> = [];
  
  // Check built-in patterns
  for (const pattern of config.patterns) {
    if (!pattern.enabled) continue;
    
    // Reset regex lastIndex for global patterns
    pattern.pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.pattern.exec(text)) !== null) {
      results.push({
        patternId: pattern.id,
        patternName: pattern.name,
        match: match[0],
        index: match.index,
      });
    }
  }
  
  // Check custom keywords
  for (const keyword of config.customKeywords) {
    if (!keyword.trim()) continue;
    
    const keywordRegex = new RegExp(escapeRegExp(keyword), 'gi');
    let match;
    while ((match = keywordRegex.exec(text)) !== null) {
      results.push({
        patternId: 'custom-keyword',
        patternName: `Custom: ${keyword}`,
        match: match[0],
        index: match.index,
      });
    }
  }
  
  return results;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a custom keyword pattern
 */
export function createCustomPattern(keyword: string): SensitivePattern {
  return {
    id: `custom-${Date.now()}`,
    name: `Custom: ${keyword}`,
    pattern: new RegExp(escapeRegExp(keyword), 'gi'),
    enabled: true,
    category: 'custom',
    description: `User-defined keyword: ${keyword}`,
  };
}

/**
 * Serialize config for storage
 */
export function serializeConfig(config: SensitiveDetectorConfig): string {
  const serializable = {
    ...config,
    patterns: config.patterns.map(p => ({
      ...p,
      pattern: p.pattern.source,
      flags: p.pattern.flags,
    })),
  };
  return JSON.stringify(serializable);
}

/**
 * Deserialize config from storage
 */
export function deserializeConfig(json: string): SensitiveDetectorConfig | null {
  try {
    const parsed = JSON.parse(json);
    return {
      ...parsed,
      patterns: parsed.patterns.map((p: any) => ({
        ...p,
        pattern: new RegExp(p.pattern, p.flags || 'g'),
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Mask sensitive text with replacement characters
 */
export function maskText(text: string, maskChar = '•'): string {
  // Keep first and last 2 characters, mask the rest
  if (text.length <= 6) {
    return maskChar.repeat(text.length);
  }
  return text.slice(0, 2) + maskChar.repeat(text.length - 4) + text.slice(-2);
}

/**
 * Get all enabled pattern categories
 */
export function getEnabledCategories(config: SensitiveDetectorConfig): string[] {
  const categories = new Set<string>();
  for (const pattern of config.patterns) {
    if (pattern.enabled) {
      categories.add(pattern.category);
    }
  }
  if (config.customKeywords.length > 0) {
    categories.add('custom');
  }
  return Array.from(categories);
}
