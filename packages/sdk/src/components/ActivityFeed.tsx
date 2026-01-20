import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";

interface Activity {
  id: string;
  type: "verification" | "payment" | "access_granted" | "access_denied";
  address: string;
  score?: number;
  amount?: number;
  token?: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  maxItems?: number;
  showDemo?: boolean;
}

const injectKeyframes = () => {
  if (typeof document !== "undefined") {
    const styleId = "ethos-activity-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes ethos-slide-in {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes ethos-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

// Generate mock activity for demo
function generateMockActivity(): Activity {
  const types: Activity["type"][] = ["verification", "payment", "access_granted", "access_denied"];
  const tokens = ["ETH", "USDC"];
  const addresses = [
    "0x742d...8f2a", "0xf39F...2266", "0x70997...8E10", "0x3C44...f09B",
    "0x90F7...2e93", "0x15d3...7b99", "0xBc75...6a98", "0x1CBd...9f7A"
  ];

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    address: addresses[Math.floor(Math.random() * addresses.length)],
    score: Math.floor(Math.random() * 1800) + 200,
    amount: Math.round(Math.random() * 100 * 100) / 100,
    token: tokens[Math.floor(Math.random() * tokens.length)],
    timestamp: new Date()
  };
}

export function ActivityFeed({ maxItems = 5, showDemo = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    injectKeyframes();
  }, []);

  // Generate demo activities
  useEffect(() => {
    if (!showDemo) return;

    // Initial activities
    const initial = Array.from({ length: 3 }, () => ({
      ...generateMockActivity(),
      timestamp: new Date(Date.now() - Math.random() * 60000)
    }));
    setActivities(initial);

    // Add new activities periodically
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = generateMockActivity();
        return [newActivity, ...prev].slice(0, maxItems);
      });
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [maxItems, showDemo]);

  const containerStyle: CSSProperties = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "verification": return "\uD83D\uDD0D";
      case "payment": return "\uD83D\uDCB0";
      case "access_granted": return "\u2705";
      case "access_denied": return "\u274C";
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "verification": return "#3B82F6";
      case "payment": return "#10B981";
      case "access_granted": return "#22C55E";
      case "access_denied": return "#EF4444";
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "verification":
        return `Score: ${activity.score}`;
      case "payment":
        return `Paid ${activity.amount?.toFixed(2)} ${activity.token}`;
      case "access_granted":
        return "Access granted";
      case "access_denied":
        return "Access denied";
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 700,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            background: "#EF4444",
            borderRadius: "50%",
            animation: "ethos-live-pulse 1.5s ease-in-out infinite",
          }}
        />
        <span>Live Activity</span>
      </h3>

      {/* Activity List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "rgba(248,250,252,0.8)",
              borderRadius: "12px",
              animation: "ethos-slide-in 0.4s ease-out",
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "both",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${getActivityColor(activity.type)}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1E293B",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activity.address}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: getActivityColor(activity.type),
                  fontWeight: 500,
                }}
              >
                {getActivityText(activity)}
              </div>
            </div>

            {/* Time */}
            <div
              style={{
                fontSize: "11px",
                color: "#94A3B8",
                whiteSpace: "nowrap",
              }}
            >
              {getTimeAgo(activity.timestamp)}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "#94A3B8" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{"\uD83D\uDC40"}</div>
            <p style={{ fontSize: "14px", margin: 0 }}>Waiting for activity...</p>
          </div>
        )}
      </div>
    </div>
  );
}
