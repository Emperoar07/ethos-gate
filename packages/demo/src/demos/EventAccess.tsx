import { useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, useEthosScore } from "@ethos/reputation-gate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";
import TrustGate from "../components/TrustGate";

export function EventAccessDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const [hasPaid, setHasPaid] = useState(false);
  const ethAmount = 0.01;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-purple-700">EVENT</span>
        <div>
          <h2 className="text-2xl font-bold">Exclusive Event Access</h2>
          <p className="text-gray-600">ETHDenver 2026 VIP Pass</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">Event Date:</span>
          <span className="font-semibold">Feb 28 - Mar 2, 2026</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">Location:</span>
          <span className="font-semibold">Denver, Colorado</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Price:</span>
          <span className="text-2xl font-bold text-purple-600">$25 USDC or {ethAmount} ETH</span>
        </div>
      </div>

      {address && (
        <div className="mb-6">
          <TrustBadge score={score} showScore />
        </div>
      )}

      <div className="border-t border-white/40 pt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">REQ</span>
          <span>Requirements</span>
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 mb-6">
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            Minimum Ethos score: 1200 (TRUSTED tier)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            Valid wallet connection
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">OK</span>
            Payment in USDC or ETH on Base Sepolia
          </li>
        </ul>

        {hasPaid ? (
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">OK</div>
            <h4 className="font-bold text-green-900 mb-2">Payment Successful!</h4>
            <p className="text-green-700 text-sm">
              Check your email for event details and QR code.
            </p>
          </div>
        ) : (
          <TrustGate minScore={1200} userScore={score}>
            <PayButton
              amount={25}
              amounts={{ USDC: 25, ETH: ethAmount }}
              tokens={["USDC", "ETH"]}
              recipient={TREASURY_ADDRESS}
              label={(selectedToken, amount) => `Purchase VIP Pass - ${amount} ${selectedToken}`}
              onSuccess={() => {
                setHasPaid(true);
                toast.success("Event pass purchased!");
              }}
              onError={(error) => {
                toast.error(`Payment failed: ${error.message}`);
              }}
              className="w-full"
            />
          </TrustGate>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Powered by Ethos Network - All payments on Base Sepolia
      </p>
    </div>
  );
}
