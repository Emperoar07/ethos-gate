import { useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, getTrustTier, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

export function NFTAllowlistDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [hasMinted, setHasMinted] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);

  const pricing = {
    ELITE: { eth: 0.01, usd: 1 },
    TRUSTED: { eth: 0.05, usd: 5 },
    EMERGING: { eth: 0.1, usd: 10 },
    NEW: { eth: 0.15, usd: 15 }
  };

  const mintPrice = pricing[tier.name as keyof typeof pricing] || pricing.NEW;

  const calculateDiscount = (tierName: string) => {
    const tierPrice = pricing[tierName as keyof typeof pricing];
    const basePrice = pricing.NEW;
    return Math.round((1 - tierPrice.eth / basePrice.eth) * 100);
  };

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-xs font-semibold text-purple-700 mb-2">COLLECTION</div>
        <h2 className="text-3xl font-bold mb-2">Based Apes NFT</h2>
        <p className="text-gray-600">Exclusive collection on Base</p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">10,000</div>
            <div className="text-xs text-gray-600">Total Supply</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">3,247</div>
            <div className="text-xs text-gray-600">Minted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">6,753</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Your Tier:</span>
            <TrustBadge score={score} showScore />
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-4 text-center">Reputation-Based Pricing</h3>

        <div className="space-y-3 mb-6">
          <div
            className={`flex justify-between items-center p-4 rounded-xl transition-all ${
              tier.name === "ELITE"
                ? "bg-white/60 border-2 border-yellow-300/60 scale-105 shadow-sm"
                : "glass-pill border border-white/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-yellow-700">ELITE</span>
              <div>
                <div className="font-medium">ELITE (1600+)</div>
                <div className="text-xs text-gray-500">{calculateDiscount("ELITE")}% discount</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-yellow-600">{pricing.ELITE.eth} ETH</div>
              <div className="text-xs text-gray-500">Approx ${pricing.ELITE.usd}</div>
            </div>
          </div>

          <div
            className={`flex justify-between items-center p-4 rounded-xl transition-all ${
              tier.name === "TRUSTED"
                ? "bg-white/60 border-2 border-white/60 scale-105 shadow-sm"
                : "glass-pill border border-white/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-700">TRUSTED</span>
              <div>
                <div className="font-medium">TRUSTED (1200-1599)</div>
                <div className="text-xs text-gray-500">{calculateDiscount("TRUSTED")}% discount</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">{pricing.TRUSTED.eth} ETH</div>
              <div className="text-xs text-gray-500">Approx ${pricing.TRUSTED.usd}</div>
            </div>
          </div>

          <div
            className={`flex justify-between items-center p-4 rounded-xl transition-all ${
              tier.name === "EMERGING"
                ? "bg-white/60 border-2 border-emerald-300/60 scale-105 shadow-sm"
                : "glass-pill border border-white/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-green-700">EMERGING</span>
              <div>
                <div className="font-medium">EMERGING (700-1199)</div>
                <div className="text-xs text-gray-500">{calculateDiscount("EMERGING")}% discount</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600">{pricing.EMERGING.eth} ETH</div>
              <div className="text-xs text-gray-500">Approx ${pricing.EMERGING.usd}</div>
            </div>
          </div>

          <div
            className={`flex justify-between items-center p-4 rounded-xl transition-all ${
              tier.name === "NEW"
                ? "bg-white/60 border-2 border-white/60 scale-105 shadow-sm"
                : "glass-pill border border-white/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">NEW</span>
              <div>
                <div className="font-medium">NEW (0-699)</div>
                <div className="text-xs text-gray-500">Public price</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-600">{pricing.NEW.eth} ETH</div>
              <div className="text-xs text-gray-500">Approx ${pricing.NEW.usd}</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-sm text-gray-600 mb-2">Your Mint Price</div>
          <div className="text-4xl font-bold text-purple-600 mb-1">{mintPrice.eth} ETH</div>
          <div className="text-sm text-gray-500 mb-3">Approx ${mintPrice.usd} USDC</div>

          {tier.name !== "NEW" && (
            <div className="inline-block glass-pill border border-emerald-300/50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
              You save {calculateDiscount(tier.name)}% with {tier.name} tier
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 mb-6">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-700">INFO</span>
          <span>Why Reputation-Based Pricing?</span>
        </h4>
        <p className="text-xs text-gray-700">
          High-reputation collectors are less likely to bot-mint and more likely to hold long-term. We reward proven
          community members with better pricing to build a quality holder base.
        </p>
      </div>

      <div className="border-t border-white/40 pt-6">
        {hasMinted ? (
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-2xl mb-3">OK</div>
            <h4 className="font-bold text-green-900 mb-2">Mint Successful!</h4>
            <p className="text-green-700 text-sm mb-4">
              Your Based Ape #{Math.floor(Math.random() * 10000)} has been minted to your wallet
            </p>

            <div className="glass-card rounded-2xl p-4 mb-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="font-mono font-semibold">#{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mint price:</span>
                  <span className="font-semibold">{mintPrice.eth} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your tier:</span>
                  <span className="font-semibold">{tier.name}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center text-sm">
              <a
                href={
                  mintTxHash
                    ? `https://sepolia.basescan.org/tx/${mintTxHash}`
                    : "https://sepolia.basescan.org/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                View on Base Sepolia Scan
              </a>
            </div>
          </div>
        ) : (
          <TrustGate minScore={700} userScore={score}>
            <div className="mb-4 glass-pill border border-white/40 rounded-xl p-3">
              <p className="text-xs text-yellow-800 text-center">
                Demo mode: Using USDC or ETH equivalent. Real version would mint an NFT on Base.
              </p>
            </div>

            <PayButton
              amount={mintPrice.usd}
              amounts={{ USDC: mintPrice.usd, ETH: mintPrice.eth }}
              tokens={["USDC", "ETH"]}
              recipient={TREASURY_ADDRESS}
              label={(selectedToken, amount) => `Mint NFT - ${amount} ${selectedToken}`}
              onHash={(hash) => {
                setMintTxHash(hash);
              }}
              onSuccess={() => {
                setHasMinted(true);
                toast.success("NFT minted successfully!");
              }}
              onError={(error) => {
                toast.error(`Mint failed: ${error.message}`);
              }}
              className="w-full"
            />

            <p className="text-xs text-gray-500 text-center mt-3">Payments on Base Sepolia testnet</p>
          </TrustGate>
        )}
      </div>

      <div className="mt-6 glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2">Collection Benefits:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>- Exclusive holder Discord access</li>
          <li>- Airdrops for future collections</li>
          <li>- Governance rights for treasury</li>
          <li>- Commercial usage rights</li>
        </ul>
      </div>
    </div>
  );
}
