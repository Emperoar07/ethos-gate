import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, getTrustTier, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

const ETH_USDC_RATE = 2500;

interface LoanOffer {
  id: string;
  lender: string;
  amount: number;
  apr: number;
  duration: number;
  minScore: number;
  collateralRatio: number;
}

const LOAN_OFFERS: LoanOffer[] = [
  { id: "1", lender: "0x1a2b...3c4d", amount: 500, apr: 8, duration: 30, minScore: 1200, collateralRatio: 150 },
  { id: "2", lender: "0x5e6f...7g8h", amount: 1000, apr: 6, duration: 60, minScore: 1400, collateralRatio: 130 },
  { id: "3", lender: "0x9i0j...1k2l", amount: 2500, apr: 5, duration: 90, minScore: 1600, collateralRatio: 120 },
  { id: "4", lender: "0x3m4n...5o6p", amount: 5000, apr: 4, duration: 180, minScore: 1800, collateralRatio: 110 },
];

export function P2PLendingDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [loanAccepted, setLoanAccepted] = useState(false);
  const [mode, setMode] = useState<"borrow" | "lend">("borrow");

  const eligibleOffers = LOAN_OFFERS.filter((offer) => score >= offer.minScore);
  const collateralRatio = tier.name === "ELITE" ? 110 : tier.name === "TRUSTED" ? 120 : tier.name === "EMERGING" ? 140 : 150;

  const selectedCollateral = useMemo(() => {
    if (!selectedOffer) return 0;
    return Number(((selectedOffer.amount * selectedOffer.collateralRatio) / 100 / ETH_USDC_RATE).toFixed(4));
  }, [selectedOffer]);

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-emerald-700">P2P</span>
        <div>
          <h2 className="text-2xl font-bold">Peer-to-Peer Lending</h2>
          <p className="text-gray-600">Reputation-backed crypto loans</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("borrow")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            mode === "borrow"
              ? "glass-card border-2 border-emerald-500/50 text-emerald-700"
              : "glass-pill text-gray-600 hover:text-gray-900"
          }`}
        >
          Borrow
        </button>
        <button
          onClick={() => setMode("lend")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            mode === "lend"
              ? "glass-card border-2 border-blue-500/50 text-blue-700"
              : "glass-pill text-gray-600 hover:text-gray-900"
          }`}
        >
          Lend
        </button>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Your Credit Score:</span>
            <TrustBadge score={score} showScore />
          </div>
          <div className="glass-pill rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Collateral Required:</span>
                <span className="font-semibold ml-2">{collateralRatio}%</span>
              </div>
              <div>
                <span className="text-gray-600">Eligible Loans:</span>
                <span className="font-semibold ml-2">{eligibleOffers.length} of {LOAN_OFFERS.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "borrow" ? (
        <>
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4">Available Loan Offers</h3>
            <div className="space-y-3">
              {LOAN_OFFERS.map((offer) => {
                const isEligible = score >= offer.minScore;
                return (
                  <div
                    key={offer.id}
                    onClick={() => isEligible && setSelectedOffer(offer)}
                    className={`glass-pill rounded-xl p-4 transition-all ${
                      isEligible
                        ? "cursor-pointer hover:scale-[1.02]"
                        : "opacity-50 cursor-not-allowed"
                    } ${selectedOffer?.id === offer.id ? "border-2 border-emerald-500/50 shadow-lg" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">${offer.amount} USDC</span>
                      <span className={`text-sm font-medium ${isEligible ? "text-emerald-600" : "text-gray-400"}`}>
                        {offer.apr}% APR
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{offer.duration} days</span>
                      <span>Min score: {offer.minScore}</span>
                      <span>Collateral: {offer.collateralRatio}%</span>
                    </div>
                    {!isEligible && (
                      <div className="mt-2 text-xs text-red-500">
                        Requires {offer.minScore - score} more reputation points
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedOffer && !loanAccepted && (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h3 className="font-semibold mb-4">Loan Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">${selectedOffer.amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{selectedOffer.apr}% APR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedOffer.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collateral Required:</span>
                  <span className="font-semibold">{selectedCollateral} ETH</span>
                </div>
                <div className="flex justify-between border-t border-white/40 pt-3">
                  <span className="text-gray-600">Total Repayment:</span>
                  <span className="font-bold text-emerald-700">
                    ${(selectedOffer.amount * (1 + (selectedOffer.apr / 100) * (selectedOffer.duration / 365))).toFixed(2)} USDC
                  </span>
                </div>
              </div>

              <TrustGate minScore={selectedOffer.minScore} userScore={score}>
                <PayButton
                  amount={selectedCollateral}
                  amounts={{ ETH: selectedCollateral }}
                  tokens={["ETH"]}
                  recipient={TREASURY_ADDRESS}
                  label={() => `Deposit ${selectedCollateral} ETH Collateral`}
                  onSuccess={() => {
                    setLoanAccepted(true);
                    toast.success("Loan accepted! Funds will be sent to your wallet.");
                  }}
                  onError={(error) => {
                    toast.error(`Failed: ${error.message}`);
                  }}
                  className="w-full"
                />
              </TrustGate>
            </div>
          )}

          {loanAccepted && (
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="text-2xl mb-2">OK</div>
              <h4 className="font-bold text-emerald-900 mb-2">Loan Active!</h4>
              <p className="text-emerald-700 text-sm mb-4">
                ${selectedOffer?.amount} USDC has been sent to your wallet.
              </p>
              <div className="glass-pill rounded-xl p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold">
                    {new Date(Date.now() + (selectedOffer?.duration || 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collateral Locked:</span>
                  <span className="font-semibold">{selectedCollateral} ETH</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Create Lending Offer</h3>
          <p className="text-gray-600 text-sm mb-6">
            Set your terms and let qualified borrowers find your offer. Higher reputation borrowers get better rates.
          </p>
          <div className="space-y-4 mb-6">
            <div className="glass-pill rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">Loan Amount (USDC)</label>
              <input
                type="number"
                placeholder="1000"
                className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-pill rounded-xl p-4">
                <label className="text-sm text-gray-600 block mb-2">APR (%)</label>
                <input
                  type="number"
                  placeholder="8"
                  className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
                />
              </div>
              <div className="glass-pill rounded-xl p-4">
                <label className="text-sm text-gray-600 block mb-2">Duration (days)</label>
                <input
                  type="number"
                  placeholder="30"
                  className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
                />
              </div>
            </div>
            <div className="glass-pill rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">Minimum Borrower Score</label>
              <input
                type="number"
                placeholder="1200"
                className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
              />
            </div>
          </div>
          <TrustGate minScore={1400} userScore={score}>
            <button
              onClick={() => toast.success("Offer created! (Demo)")}
              className="w-full glass-cta rounded-xl py-4 font-semibold text-slate-900 hover:scale-[1.02] transition-all"
            >
              Create Lending Offer
            </button>
          </TrustGate>
        </div>
      )}

      <div className="mt-6 glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">INFO</span>
          <span>How it works:</span>
        </h4>
        <p className="text-xs text-gray-600">
          Your Ethos score determines your creditworthiness. Higher scores unlock better loan terms with lower collateral requirements.
          ELITE users need only <span className="font-bold text-emerald-600">110% collateral</span> vs 150% for new users.
        </p>
      </div>
    </div>
  );
}
