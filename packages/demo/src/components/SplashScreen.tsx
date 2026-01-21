import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"buzz" | "split" | "done">("buzz");

  useEffect(() => {
    // Electric buzz phase
    const splitTimer = setTimeout(() => {
      setPhase("split");
    }, duration);

    // Complete after split animation
    const completeTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, duration + 800);

    return () => {
      clearTimeout(splitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`splash-screen ${phase === "split" ? "splash-screen--splitting" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background electric arcs */}
      <div className="splash-arcs">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="splash-arc"
            style={{
              position: "absolute",
              width: "200px",
              height: "2px",
              background: `linear-gradient(90deg, transparent, #3b82f6, #60a5fa, #3b82f6, transparent)`,
              borderRadius: "2px",
              opacity: 0,
              animation: `spark 0.8s ease-out ${i * 0.3}s infinite`,
              transform: `rotate(${i * 60}deg)`,
              transformOrigin: "center",
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Electric glow background */}
      <div
        className="splash-glow"
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)",
          animation: "electric-glow 0.5s ease-in-out infinite alternate",
          filter: "blur(40px)",
        }}
      />

      {/* Logo container with split effect */}
      <div
        className="splash-logo-container"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Left half of logo */}
        <div
          className="splash-logo-half splash-logo-left"
          style={{
            position: "absolute",
            clipPath: "inset(0 50% 0 0)",
            animation: phase === "split"
              ? "logo-split-left 0.8s ease-in-out forwards"
              : "electric-buzz 0.1s ease-in-out infinite",
          }}
        >
          <SplashLogo />
        </div>

        {/* Right half of logo */}
        <div
          className="splash-logo-right"
          style={{
            position: "absolute",
            clipPath: "inset(0 0 0 50%)",
            animation: phase === "split"
              ? "logo-split-right 0.8s ease-in-out forwards"
              : "electric-buzz 0.1s ease-in-out infinite reverse",
          }}
        >
          <SplashLogo />
        </div>

        {/* Electric particles around logo */}
        {phase === "buzz" && (
          <div className="splash-particles">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#60a5fa",
                  boxShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6",
                  animation: `particle-orbit 2s linear ${i * 0.15}s infinite`,
                  transformOrigin: "100px center",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* "Ethos Gate" text below logo */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          textAlign: "center",
          animation: phase === "split" ? "fade-out 0.5s ease-out forwards" : "text-pulse 2s ease-in-out infinite",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.1em",
            textShadow: "0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(99,102,241,0.3)",
          }}
        >
          ETHOS GATE
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(148,163,184,0.8)",
            marginTop: "0.5rem",
            letterSpacing: "0.2em",
          }}
        >
          INITIALIZING
        </p>
      </div>

      {/* Loading bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          width: "200px",
          height: "2px",
          background: "rgba(59,130,246,0.2)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)",
            animation: `loading-bar ${duration}ms ease-out forwards`,
            boxShadow: "0 0 10px #3b82f6",
          }}
        />
      </div>
    </div>
  );
}

// Larger logo specifically for splash screen
function SplashLogo() {
  const size = 120;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 30px rgba(59,130,246,0.5))" }}
    >
      <defs>
        <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="splashInnerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <filter id="splashGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(10, 10)" filter="url(#splashGlow)">
        {/* Main shield shape */}
        <path
          d="M 50 5
             L 95 15
             L 95 55
             Q 95 75 50 95
             Q 5 75 5 55
             L 5 15 Z"
          fill="url(#splashGradient)"
        />

        {/* Inner highlight */}
        <path
          d="M 50 15
             L 85 23
             L 85 52
             Q 85 68 50 85
             Q 15 68 15 52
             L 15 23 Z"
          fill="url(#splashInnerGlow)"
          opacity="0.3"
        />

        {/* Gate bars - left side */}
        <g stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.95">
          <line x1="25" y1="35" x2="42" y2="35" />
          <line x1="25" y1="50" x2="42" y2="50" />
          <line x1="25" y1="65" x2="42" y2="65" />
        </g>

        {/* Gate bars - right side */}
        <g stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.95">
          <line x1="58" y1="35" x2="75" y2="35" />
          <line x1="58" y1="50" x2="75" y2="50" />
          <line x1="58" y1="65" x2="75" y2="65" />
        </g>

        {/* Center vertical bar */}
        <line
          x1="50" y1="25"
          x2="50" y2="75"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}
