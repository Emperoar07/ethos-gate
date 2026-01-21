import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ShieldGateLogo } from "./Logo";

// Base Sepolia USDC contract address
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export function Navbar() {
  const { address, isConnected } = useAccount();
  const account = address as `0x${string}` | undefined;
  const balanceEnabled = Boolean(account);

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: account,
    query: { enabled: balanceEnabled },
  });

  // Get USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [account ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: balanceEnabled },
  });

  const formattedEth = ethBalance ? parseFloat(formatUnits(ethBalance.value, 18)).toFixed(2) : "0.00";
  const formattedUsdc = usdcBalance ? parseFloat(formatUnits(usdcBalance, 6)).toFixed(2) : "0.00";

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="glass-card rounded-2xl px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <ShieldGateLogo size="sm" showText />
            </Link>

            <div className="hidden md:flex gap-3">
              <Link
                to="/demos"
                className="glass-pill px-4 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
              >
                Demos
              </Link>
              <Link
                to="/examples"
                className="glass-pill px-4 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
              >
                Examples
              </Link>
              <Link
                to="/docs"
                className="glass-pill px-4 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
              >
                Docs
              </Link>
              <a
                href="https://github.com/Emperoar07/ethos-gate"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill px-4 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="hidden sm:flex items-center gap-2 glass-pill px-4 py-2 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-700">{formattedEth}</span>
                  <span className="text-xs text-slate-500">ETH</span>
                </div>
                <div className="w-px h-4 bg-slate-300" />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-blue-600">{formattedUsdc}</span>
                  <span className="text-xs text-slate-500">USDC</span>
                </div>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
