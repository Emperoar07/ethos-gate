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
  currency: "USDC" | "ETH";
  apr: number;
  duration: number;
  minScore: number;
  collateralRatio: number;
}

const LOAN_OFFERS: LoanOffer[] = [
  { id: "1", lender: "0x1a2b...3c4d", amount: 500, currency: "USDC", apr: 8, duration: 30, minScore: 1200, collateralRatio: 150 },
  { id: "2", lender: "0x5e6f...7g8h", amount: 1000, currency: "USDC", apr: 6, duration: 60, minScore: 1400, collateralRatio: 130 },
  { id: "3", lender: "0x9i0j...1k2l", amount: 0.5, currency: "ETH", apr: 5, duration: 90, minScore: 1400, collateralRatio: 125 },
  { id: "4", lender: "0x3m4n...5o6p", amount: 2500, currency: "USDC", apr: 5, duration: 90, minScore: 1600, collateralRatio: 120 },
  { id: "5", lender: "0x7q8r...9s0t", amount: 1, currency: "ETH", apr: 4, duration: 120, minScore: 1600, collateralRatio: 115 },
  { id: "6", lender: "0xu1v2...w3x4", amount: 5000, currency: "USDC", apr: 4, duration: 180, minScore: 1800, collateralRatio: 110 },
];

export function P2PLendingDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [loanAccepted, setLoanAccepted] = useState(false);
  const [mode, setMode] = useState<"borrow" | "lend">("borrow");
  const [filterCurrency, setFilterCurrency] = useState<"all" | "USDC" | "ETH">("all");
  const [collateralToken, setCollateralToken] = useState<"USDC" | "ETH">("ETH");

  // Lend form state
  const [lendAmount, setLendAmount] = useState("");
  const [lendCurrency, setLendCurrency] = useState<"USDC" | "ETH">("USDC");
  const [lendApr, setLendApr] = useState("8");
  const [lendDuration, setLendDuration] = useState("30");
  const [lendMinScore, setLendMinScore] = useState("1200");

  const eligibleOffers = LOAN_OFFERS.filter((offer) => score >= offer.minScore);
  const filteredOffers = filterCurrency === "all"
    ? LOAN_OFFERS
    : LOAN_OFFERS.filter((o) => o.currency === filterCurrency);

  const collateralRatio = tier.name === "ELITE" ? 110 : tier.name === "TRUSTED" ? 120 : tier.name === "EMERGING" ? 140 : 150;

  // Calculate collateral needed based on selected offer and collateral token
  const collateralAmount = useMemo(() => {
    if (!selectedOffer) return { amount: 0, display: "0" };

    const loanValueUsd = selectedOffer.currency === "USDC"
      ? selectedOffer.amount
      : selectedOffer.amount * ETH_USDC_RATE;

    const collateralValueUsd = (loanValueUsd * selectedOffer.collateralRatio) / 100;

    if (collateralToken === "USDC") {
      return { amount: collateralValueUsd, display: collateralValueUsd.toFixed(2) };
    } else {
      const ethAmount = collateralValueUsd / ETH_USDC_RATE;
      return { amount: ethAmount, display: ethAmount.toFixed(4) };
    }
  }, [selectedOffer, collateralToken]);

  // Calculate repayment
  const repaymentAmount = useMemo(() => {
    if (!selectedOffer) return "0";
    const interest = selectedOffer.amount * (selectedOffer.apr / 100) * (selectedOffer.duration / 365);
    return (selectedOffer.amount + interest).toFixed(selectedOffer.currency === "ETH" ? 4 : 2);
  }, [selectedOffer]);

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-emerald-700">P2P</span>
        <div>
          <h2 className="text-2xl font-bold">Peer-to-Peer Lending</h2>
          <p className="text-gray-600">Reputation-backed crypto loans on Base Sepolia</p>
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
          {/* Currency Filter */}
          <div className="flex gap-2 mb-4">
            {(["all", "USDC", "ETH"] as const).map((currency) => (
              <button
                key={currency}
                onClick={() => setFilterCurrency(currency)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterCurrency === currency
                    ? "glass-card border border-emerald-500/50 text-emerald-700"
                    : "glass-pill text-gray-600 hover:text-gray-900"
                }`}
              >
                {currency === "all" ? "All" : currency}
              </button>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4">Available Loan Offers</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredOffers.map((offer) => {
                const isEligible = score >= offer.minScore;
                const displayValue = offer.currency === "USDC"
                  ? `$${offer.amount.toLocaleString()}`
                  : `${offer.amount} ETH`;

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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{displayValue}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          offer.currency === "USDC" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {offer.currency}
                        </span>
                      </div>
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

              {/* Collateral Token Selector */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-2">Pay Collateral With:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCollateralToken("ETH")}
                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                      collateralToken === "ETH"
                        ? "glass-card border-2 border-purple-500/50 text-purple-700"
                        : "glass-pill text-gray-600"
                    }`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => setCollateralToken("USDC")}
                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                      collateralToken === "USDC"
                        ? "glass-card border-2 border-blue-500/50 text-blue-700"
                        : "glass-pill text-gray-600"
                    }`}
                  >
                    USDC
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">
                    {selectedOffer.currency === "USDC" ? "$" : ""}{selectedOffer.amount} {selectedOffer.currency}
                  </span>
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
                  <span className="font-semibold text-orange-600">
                    {collateralAmount.display} {collateralToken}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/40 pt-3">
                  <span className="text-gray-600">Total Repayment:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedOffer.currency === "USDC" ? "$" : ""}{repaymentAmount} {selectedOffer.currency}
                  </span>
                </div>
              </div>

              <TrustGate minScore={selectedOffer.minScore} userScore={score}>
                <PayButton
                  amount={collateralAmount.amount}
                  amounts={collateralToken === "ETH"
                    ? { ETH: collateralAmount.amount }
                    : { USDC: collateralAmount.amount }
                  }
                  tokens={[collateralToken]}
                  recipient={TREASURY_ADDRESS}
                  label={() => `Deposit ${collateralAmount.display} ${collateralToken} Collateral`}
                  onSuccess={() => {
                    setLoanAccepted(true);
                    toast.success(`Loan accepted! ${selectedOffer.amount} ${selectedOffer.currency} sent to your wallet.`);
                  }}
                  onError={(error) => {
                    toast.error(`Failed: ${error.message}`);
                  }}
                  className="w-full"
                />
              </TrustGate>
            </div>
          )}

          {loanAccepted && selectedOffer && (
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="text-2xl mb-2">OK</div>
              <h4 className="font-bold text-emerald-900 mb-2">Loan Active!</h4>
              <p className="text-emerald-700 text-sm mb-4">
                {selectedOffer.currency === "USDC" ? "$" : ""}{selectedOffer.amount} {selectedOffer.currency} has been sent to your wallet.
              </p>
              <div className="glass-pill rounded-xl p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold">
                    {new Date(Date.now() + selectedOffer.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collateral Locked:</span>
                  <span className="font-semibold">{collateralAmount.display} {collateralToken}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setLoanAccepted(false);
                  setSelectedOffer(null);
                }}
                className="mt-4 text-sm text-emerald-600 hover:underline"
              >
                Browse More Loans
              </button>
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
            {/* Currency Selection */}
            <div className="glass-pill rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">Lending Currency</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLendCurrency("USDC")}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    lendCurrency === "USDC"
                      ? "glass-card border border-blue-500/50 text-blue-700"
                      : "bg-white/50 text-gray-600"
                  }`}
                >
                  USDC
                </button>
                <button
                  onClick={() => setLendCurrency("ETH")}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    lendCurrency === "ETH"
                      ? "glass-card border border-purple-500/50 text-purple-700"
                      : "bg-white/50 text-gray-600"
                  }`}
                >
                  ETH
                </button>
              </div>
            </div>

            <div className="glass-pill rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">
                Loan Amount ({lendCurrency})
              </label>
              <input
                type="number"
                value={lendAmount}
                onChange={(e) => setLendAmount(e.target.value)}
                placeholder={lendCurrency === "USDC" ? "1000" : "0.5"}
                className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-pill rounded-xl p-4">
                <label className="text-sm text-gray-600 block mb-2">APR (%)</label>
                <input
                  type="number"
                  value={lendApr}
                  onChange={(e) => setLendApr(e.target.value)}
                  placeholder="8"
                  className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
                />
              </div>
              <div className="glass-pill rounded-xl p-4">
                <label className="text-sm text-gray-600 block mb-2">Duration (days)</label>
                <input
                  type="number"
                  value={lendDuration}
                  onChange={(e) => setLendDuration(e.target.value)}
                  placeholder="30"
                  className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
                />
              </div>
            </div>

            <div className="glass-pill rounded-xl p-4">
              <label className="text-sm text-gray-600 block mb-2">Minimum Borrower Score</label>
              <input
                type="number"
                value={lendMinScore}
                onChange={(e) => setLendMinScore(e.target.value)}
                placeholder="1200"
                className="w-full bg-white/50 rounded-lg px-4 py-2 border border-white/40"
              />
            </div>

            {/* Preview */}
            {lendAmount && (
              <div className="glass-pill rounded-xl p-4 border border-emerald-200/50">
                <h4 className="text-sm font-semibold mb-2">Offer Preview</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{lendAmount} {lendCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Return:</span>
                    <span className="font-medium text-emerald-600">
                      {(parseFloat(lendAmount || "0") * (1 + (parseFloat(lendApr || "0") / 100) * (parseFloat(lendDuration || "0") / 365))).toFixed(lendCurrency === "ETH" ? 4 : 2)} {lendCurrency}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <TrustGate minScore={1400} userScore={score}>
            <PayButton
              amount={parseFloat(lendAmount) || 0}
              amounts={lendCurrency === "USDC"
                ? { USDC: parseFloat(lendAmount) || 0 }
                : { ETH: parseFloat(lendAmount) || 0 }
              }
              tokens={[lendCurrency]}
              recipient={TREASURY_ADDRESS}
              label={() => `Create Offer - Deposit ${lendAmount || "0"} ${lendCurrency}`}
              onSuccess={() => toast.success("Lending offer created! Waiting for borrowers.")}
              onError={(error) => toast.error(`Failed: ${error.message}`)}
              className="w-full"
              disabled={!lendAmount || parseFloat(lendAmount) <= 0}
            />
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
          Borrow in USDC or ETH on Base Sepolia testnet.
        </p>
      </div>
    </div>
  );
}
