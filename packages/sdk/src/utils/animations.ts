/**
 * Shared animation utilities for EthosGate SDK components
 * Prevents duplicate keyframe injection across components
 */

const INJECTED_STYLES = new Set<string>();

/**
 * Inject CSS keyframes into the document head (only once per styleId)
 * @param styleId - Unique identifier for this style block
 * @param keyframes - CSS keyframe definitions
 */
export function injectKeyframes(styleId: string, keyframes: string): void {
  if (typeof document === "undefined") return;
  if (INJECTED_STYLES.has(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = keyframes;
  document.head.appendChild(style);
  INJECTED_STYLES.add(styleId);
}

// Common keyframes used across components
export const KEYFRAMES = {
  pulseGlow: `
    @keyframes ethos-pulse-glow {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
  `,
  scoreCount: `
    @keyframes ethos-score-count {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeIn: `
    @keyframes ethos-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes ethos-slide-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  spin: `
    @keyframes ethos-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  shimmer: `
    @keyframes ethos-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  bounce: `
    @keyframes ethos-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `,
  ripple: `
    @keyframes ethos-ripple {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(2); opacity: 0; }
    }
  `,
  progress: `
    @keyframes ethos-progress {
      from { width: 0%; }
    }
  `,
  check: `
    @keyframes ethos-check {
      0% { stroke-dashoffset: 24; }
      100% { stroke-dashoffset: 0; }
    }
  `
};

/**
 * Inject all common keyframes at once
 */
export function injectCommonKeyframes(): void {
  const allKeyframes = Object.values(KEYFRAMES).join("\n");
  injectKeyframes("ethos-common-keyframes", allKeyframes);
}

/**
 * Hook to inject keyframes on component mount
 */
export function useInjectKeyframes(styleId: string, keyframes: string): void {
  if (typeof window !== "undefined") {
    injectKeyframes(styleId, keyframes);
  }
}
