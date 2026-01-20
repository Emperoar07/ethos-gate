import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

// Configure custom RPC transports to avoid rate limits
const baseSepoliaWithRpc = {
  ...baseSepolia,
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
};

export const config = getDefaultConfig({
  appName: "Ethos Reputation Gate",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [baseSepoliaWithRpc],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  ssr: false
});
