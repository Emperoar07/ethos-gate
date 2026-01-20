import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, getTrustTier, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

// Demo exchange rate - In production, fetch from Chainlink oracle or DEX price feed
// Current rate is approximate and for demonstration purposes only
const ETH_USDC_RATE = 2500; // 1 ETH = 2500 USDC

export function SubscriptionDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const pricing = {
    ELITE: { amount: 10, discount: 80, color: "text-yellow-600" },
    TRUSTED: { amount: 25, discount: 50, color: "text-blue-600" },
    EMERGING: { amount: 40, discount: 20, color: "text-green-600" },
    NEW: { amount: 50, discount: 0, color: "text-gray-600" }
  };

  const userPricing = pricing[tier.name as keyof typeof pricing] || pricing.NEW;
  const ethAmount = useMemo(() => Number((userPricing.amount / ETH_USDC_RATE).toFixed(4)), [userPricing.amount]);

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-blue-700">PLAN</span>
        <div>
          <h2 className="text-2xl font-bold">Premium Subscription</h2>
          <p className="text-gray-600">DeFi Analytics Pro</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-4">What's Included:</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            <span>Real-time portfolio tracking across 10+ chains</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            <span>Advanced analytics and yield optimization</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            <span>Price alerts and automated strategies</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            <span>Priority customer support</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            <span>Exclusive alpha and research reports</span>
          </li>
        </ul>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Your Reputation Tier:</span>
            <TrustBadge score={score} showScore />
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-4 text-center">Pricing (Reputation-Based)</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {Object.entries(pricing).map(([tierName, info]) => (
            <div
              key={tierName}
              className={`text-center p-3 transition-all ${
                tier.name === tierName
                  ? "glass-card border-2 border-white/70 scale-105 shadow-sm"
                  : "glass-card border border-white/40"
              }`}
            >
              <div className="text-xs font-medium mb-1 text-gray-600">{tierName}</div>
              <div className={`text-lg font-bold ${info.color}`}>${info.amount}</div>
              {info.discount > 0 && <div className="text-xs text-green-600 font-medium">{info.discount}% off</div>}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-sm text-gray-600 mb-2">Your Monthly Price</div>
          <div className="text-5xl font-bold text-blue-600 mb-2">${userPricing.amount}</div>
          <div className="text-sm text-gray-500 mb-3">USDC per month (or {ethAmount} ETH)</div>

          {userPricing.discount > 0 ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 line-through">$50</span>
              <span className="text-sm font-semibold text-emerald-700 glass-pill border border-emerald-300/50 px-3 py-1 rounded-full">
                Save {userPricing.discount}% with {tier.name} tier
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Build your reputation to unlock discounts</div>
          )}
        </div>
      </div>

      {!address && (
        <div className="glass-card rounded-2xl p-4 mb-6">
          <p className="text-sm text-yellow-800 text-center">
            Connect your wallet to see your personalized pricing
          </p>
        </div>
      )}

      <div className="border-t border-white/40 pt-6">
        {isSubscribed ? (
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">OK</div>
            <h4 className="font-bold text-green-900 mb-2">Welcome to Premium!</h4>
            <p className="text-green-700 text-sm mb-4">
              Your subscription is now active. Next billing:{" "}
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
            <div className="glass-pill rounded-2xl p-4 mb-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">Premium ({tier.name} tier)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly cost:</span>
                  <span className="font-semibold">${userPricing.amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You save:</span>
                  <span className="font-semibold text-green-600">${50 - userPricing.amount}/month</span>
                </div>
              </div>
            </div>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline text-sm font-medium">
              Access Dashboard
            </a>
          </div>
        ) : (
          <TrustGate minScore={700} userScore={score}>
            <PayButton
              amount={userPricing.amount}
              amounts={{ USDC: userPricing.amount, ETH: ethAmount }}
              tokens={["USDC", "ETH"]}
              recipient={TREASURY_ADDRESS}
              label={(selectedToken, amount) => `Subscribe - ${amount} ${selectedToken}/month`}
              onSuccess={() => {
                setIsSubscribed(true);
                toast.success("Subscription activated!");
              }}
              onError={(error) => {
                toast.error(`Payment failed: ${error.message}`);
              }}
              className="w-full"
            />

            <p className="text-xs text-gray-500 text-center mt-3">
              Build your Ethos score to unlock better pricing. Cancel anytime.
            </p>
          </TrustGate>
        )}
      </div>

      <div className="mt-6 glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">TIP</span>
          <span>Pro Tip:</span>
        </h4>
        <p className="text-xs text-gray-600">
          Increase your Ethos score by getting vouches and positive reviews. ELITE tier users save{" "}
          <span className="font-bold text-green-600">$40/month</span> compared to new users.
        </p>
      </div>
    </div>
  );
}
