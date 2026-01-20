interface ShieldGateLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function ShieldGateLogo({ size = "md", showText = true, className = "" }: ShieldGateLogoProps) {
  const dimensions = {
    sm: { svg: 140, icon: 32, textSize: 16, gap: 8 },
    md: { svg: 180, icon: 40, textSize: 20, gap: 10 },
    lg: { svg: 220, icon: 48, textSize: 24, gap: 12 }
  };

  const { svg, icon, textSize, gap } = dimensions[size];
  const svgHeight = icon + 16;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={showText ? svg : icon + 8}
        height={svgHeight}
        viewBox={`0 0 ${showText ? svg : icon + 8} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for shield */}
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* Gradient for inner glow */}
          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Shield background */}
        <g transform={`translate(4, ${(svgHeight - icon) / 2})`} filter="url(#dropShadow)">
          {/* Main shield shape */}
          <path
            d={`M ${icon/2} 2
                L ${icon - 4} 6
                L ${icon - 4} ${icon * 0.55}
                Q ${icon - 4} ${icon * 0.7} ${icon/2} ${icon - 2}
                Q 4 ${icon * 0.7} 4 ${icon * 0.55}
                L 4 6 Z`}
            fill="url(#shieldGradient)"
          />

          {/* Inner highlight */}
          <path
            d={`M ${icon/2} 6
                L ${icon - 8} 9
                L ${icon - 8} ${icon * 0.5}
                Q ${icon - 8} ${icon * 0.62} ${icon/2} ${icon - 8}
                Q 8 ${icon * 0.62} 8 ${icon * 0.5}
                L 8 9 Z`}
            fill="url(#innerGlow)"
            opacity="0.3"
          />

          {/* Gate bars - horizontal */}
          <g stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.95">
            <line x1={icon * 0.28} y1={icon * 0.35} x2={icon * 0.45} y2={icon * 0.35} />
            <line x1={icon * 0.28} y1={icon * 0.5} x2={icon * 0.45} y2={icon * 0.5} />
            <line x1={icon * 0.28} y1={icon * 0.65} x2={icon * 0.45} y2={icon * 0.65} />

            <line x1={icon * 0.55} y1={icon * 0.35} x2={icon * 0.72} y2={icon * 0.35} />
            <line x1={icon * 0.55} y1={icon * 0.5} x2={icon * 0.72} y2={icon * 0.5} />
            <line x1={icon * 0.55} y1={icon * 0.65} x2={icon * 0.72} y2={icon * 0.65} />
          </g>

          {/* Center vertical bar */}
          <line
            x1={icon/2} y1={icon * 0.22}
            x2={icon/2} y2={icon * 0.75}
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {showText && (
          <text
            x={icon + gap + 8}
            y={svgHeight / 2 + textSize * 0.35}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize={textSize}
            fontWeight="700"
            fill="#1e293b"
            letterSpacing="-0.02em"
          >
            Ethos Gate
          </text>
        )}
      </svg>
    </div>
  );
}

export function ShieldGateIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.25"/>
        </filter>
      </defs>

      <g filter="url(#iconShadow)">
        {/* Shield shape */}
        <path
          d="M 20 3 L 35 7 L 35 22 Q 35 30 20 37 Q 5 30 5 22 L 5 7 Z"
          fill="url(#iconGradient)"
        />

        {/* Inner glow */}
        <path
          d="M 20 7 L 31 10 L 31 21 Q 31 27 20 33 Q 9 27 9 21 L 9 10 Z"
          fill="white"
          opacity="0.15"
        />

        {/* Gate bars */}
        <g stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
          <line x1="11" y1="14" x2="17" y2="14" />
          <line x1="11" y1="20" x2="17" y2="20" />
          <line x1="11" y1="26" x2="17" y2="26" />

          <line x1="23" y1="14" x2="29" y2="14" />
          <line x1="23" y1="20" x2="29" y2="20" />
          <line x1="23" y1="26" x2="29" y2="26" />
        </g>

        {/* Center bar */}
        <line x1="20" y1="10" x2="20" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
      </g>
    </svg>
  );
}
