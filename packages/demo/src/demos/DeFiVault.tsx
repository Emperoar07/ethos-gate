import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, getTrustTier, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

const ETH_USDC_RATE = 2500;

interface VaultTier {
  name: string;
  minScore: number;
  baseApy: number;
  bonusApy: number;
  maxDeposit: number;
  color: string;
  bgColor: string;
}

const VAULT_TIERS: VaultTier[] = [
  { name: "Starter", minScore: 0, baseApy: 5, bonusApy: 0, maxDeposit: 1000, color: "text-gray-600", bgColor: "bg-gray-100" },
  { name: "Growth", minScore: 700, baseApy: 5, bonusApy: 2, maxDeposit: 5000, color: "text-green-600", bgColor: "bg-green-50" },
  { name: "Premium", minScore: 1200, baseApy: 5, bonusApy: 4, maxDeposit: 25000, color: "text-blue-600", bgColor: "bg-blue-50" },
  { name: "Elite", minScore: 1600, baseApy: 5, bonusApy: 7, maxDeposit: 100000, color: "text-yellow-600", bgColor: "bg-yellow-50" },
];

export function DeFiVaultDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [depositAmount, setDepositAmount] = useState<string>("1000");
  const [isDeposited, setIsDeposited] = useState(false);
  const [selectedToken, setSelectedToken] = useState<"USDC" | "ETH">("USDC");

  const userVaultTier = useMemo(() => {
    return [...VAULT_TIERS].reverse().find((t) => score >= t.minScore) || VAULT_TIERS[0];
  }, [score]);

  const totalApy = userVaultTier.baseApy + userVaultTier.bonusApy;
  const depositNum = parseFloat(depositAmount) || 0;
  const yearlyEarnings = (depositNum * totalApy) / 100;
  const monthlyEarnings = yearlyEarnings / 12;

  const ethAmount = useMemo(() => Number((depositNum / ETH_USDC_RATE).toFixed(4)), [depositNum]);
  const displayAmount = selectedToken === "ETH" ? ethAmount : depositNum;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-purple-700">DEFI</span>
        <div>
          <h2 className="text-2xl font-bold">Reputation Yield Vault</h2>
          <p className="text-gray-600">Higher trust = Higher APY</p>
        </div>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-pill rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">${(2.4).toFixed(1)}M</div>
          <div className="text-xs text-gray-600">Total Locked</div>
        </div>
        <div className="glass-pill rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{totalApy}%</div>
          <div className="text-xs text-gray-600">Your APY</div>
        </div>
        <div className="glass-pill rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">1,247</div>
          <div className="text-xs text-gray-600">Depositors</div>
        </div>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Your Vault Tier:</span>
            <TrustBadge score={score} showScore />
          </div>
        </div>
      )}

      {/* Tier Comparison */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Vault Tiers by Reputation</h3>
        <div className="space-y-3">
          {VAULT_TIERS.map((vaultTier) => {
            const isCurrentTier = userVaultTier.name === vaultTier.name;
            const isUnlocked = score >= vaultTier.minScore;
            return (
              <div
                key={vaultTier.name}
                className={`glass-pill rounded-xl p-4 transition-all ${
                  isCurrentTier ? "border-2 border-purple-500/50 shadow-lg scale-[1.02]" : ""
                } ${!isUnlocked ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isUnlocked ? vaultTier.bgColor : "bg-gray-200"}`}>
                      <div className={`w-3 h-3 rounded-full ${isUnlocked ? vaultTier.color.replace("text", "bg") : ""}`} />
                    </div>
                    <div>
                      <span className={`font-semibold ${vaultTier.color}`}>{vaultTier.name}</span>
                      {isCurrentTier && (
                        <span className="ml-2 text-xs glass-pill px-2 py-0.5 rounded-full text-purple-600">Your Tier</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{vaultTier.baseApy + vaultTier.bonusApy}% APY</div>
                    <div className="text-xs text-gray-500">
                      {vaultTier.bonusApy > 0 ? `+${vaultTier.bonusApy}% bonus` : "Base rate"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                  <span>Min Score: {vaultTier.minScore}</span>
                  <span>Max Deposit: ${vaultTier.maxDeposit.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit Section */}
      {!isDeposited ? (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Deposit to Vault</h3>

          {/* Token Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedToken("USDC")}
              className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                selectedToken === "USDC"
                  ? "glass-card border-2 border-blue-500/50 text-blue-700"
                  : "glass-pill text-gray-600"
              }`}
            >
              USDC
            </button>
            <button
              onClick={() => setSelectedToken("ETH")}
              className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                selectedToken === "ETH"
                  ? "glass-card border-2 border-purple-500/50 text-purple-700"
                  : "glass-pill text-gray-600"
              }`}
            >
              ETH
            </button>
          </div>

          <div className="glass-pill rounded-xl p-4 mb-4">
            <label className="text-sm text-gray-600 block mb-2">Deposit Amount (USDC equivalent)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              max={userVaultTier.maxDeposit}
              className="w-full bg-white/50 rounded-lg px-4 py-3 border border-white/40 text-xl font-semibold"
              placeholder="1000"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Max: ${userVaultTier.maxDeposit.toLocaleString()}</span>
              {selectedToken === "ETH" && <span>{ethAmount} ETH</span>}
            </div>
          </div>

          {depositNum > userVaultTier.maxDeposit && (
            <div className="glass-pill rounded-xl p-3 mb-4 border border-yellow-300/50">
              <p className="text-sm text-yellow-700">
                Your tier limit is ${userVaultTier.maxDeposit.toLocaleString()}. Increase your Ethos score to unlock higher limits.
              </p>
            </div>
          )}

          {/* Earnings Preview */}
          <div className="glass-pill rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold mb-3">Projected Earnings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">${monthlyEarnings.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">${yearlyEarnings.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Yearly</div>
              </div>
            </div>
          </div>

          <TrustGate minScore={0} userScore={score}>
            <PayButton
              amount={displayAmount}
              amounts={{ USDC: depositNum, ETH: ethAmount }}
              tokens={[selectedToken]}
              recipient={TREASURY_ADDRESS}
              label={() => `Deposit ${displayAmount} ${selectedToken}`}
              onSuccess={() => {
                setIsDeposited(true);
                toast.success("Deposit successful! Earning yield now.");
              }}
              onError={(error) => {
                toast.error(`Deposit failed: ${error.message}`);
              }}
              className="w-full"
              disabled={depositNum > userVaultTier.maxDeposit || depositNum <= 0}
            />
          </TrustGate>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center mb-6">
          <div className="text-2xl mb-2">OK</div>
          <h4 className="font-bold text-emerald-900 mb-2">Deposit Active!</h4>
          <p className="text-emerald-700 text-sm mb-4">
            Your ${depositNum.toLocaleString()} is now earning {totalApy}% APY
          </p>
          <div className="glass-pill rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Deposited:</span>
                <div className="font-semibold">${depositNum.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Projected Yearly:</span>
                <div className="font-semibold text-emerald-600">+${yearlyEarnings.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsDeposited(false);
              toast.success("Withdrawal initiated! (Demo)");
            }}
            className="mt-4 text-sm text-purple-600 hover:underline"
          >
            Withdraw Funds
          </button>
        </div>
      )}

      <div className="glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">BOOST</span>
          <span>Maximize Your Yield:</span>
        </h4>
        <p className="text-xs text-gray-600">
          Elite tier users earn <span className="font-bold text-purple-600">12% APY</span> (base 5% + 7% bonus)
          and can deposit up to $100,000. Build your Ethos score to unlock better rates!
        </p>
      </div>
    </div>
  );
}
