import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useEthosScore, TrustBadge } from "@ethos/reputation-gate";
import { ShieldGateLogo } from "../components/Logo";

export function Landing() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);

  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <div className="glass-orb glass-orb--one" />
          <div className="glass-orb glass-orb--two" />
          <div className="glass-orb glass-orb--three" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <ShieldGateLogo size="lg" showText={false} />
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6">
              Ethos Gate
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-4">
              Gate access and payments with reputation.
            </p>
            <p className="text-base md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Ethos Gate blends trust scores with Base payments so your product feels premium, safe,
              and frictionless for the right users.
            </p>

            {address && score > 0 ? (
              <div className="mb-8 flex justify-center">
                <TrustBadge score={score} showScore size="lg" variant="card" />
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demos"
                className="glass-pill px-8 py-3 text-slate-900 font-semibold hover:shadow-xl transition-all"
              >
                View Demos
              </Link>
              <Link
                to="/docs"
                className="glass-pill px-8 py-3 text-slate-900 font-semibold hover:shadow-xl transition-all"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Everything you need to build trust-based applications</p>
          </div>

            <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4 emoji">{"\uD83D\uDEE1\uFE0F"}</div>
              <h3 className="text-xl font-bold mb-2">Anti-Sybil Protection</h3>
              <p className="text-gray-600">Filter bots and scammers automatically with Ethos reputation scores</p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4 emoji">{"\uD83D\uDCB0"}</div>
              <h3 className="text-xl font-bold mb-2">Flexible Payments</h3>
              <p className="text-gray-600">Accept ETH and USDC on Base Sepolia with minimal gas fees</p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4 emoji">{"\uD83C\uDFAF"}</div>
              <h3 className="text-xl font-bold mb-2">Tiered Pricing</h3>
              <p className="text-gray-600">Reward high-reputation users with discounts and premium features</p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4 emoji">{"\u26A1"}</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Transactions confirm in 1-2 seconds on Base Network</p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4 emoji">{"\uD83D\uDD0C"}</div>
              <h3 className="text-xl font-bold mb-2">Drop-in Components</h3>
              <p className="text-gray-600">Works with any React app - no backend required</p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl mb-4 emoji">{"\uD83D\uDCCA"}</div>
              <h3 className="text-xl font-bold mb-2">40+ Presets</h3>
              <p className="text-gray-600">Pre-configured score requirements for common use cases</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
            <p className="text-xl text-gray-600">Three lines of code. Instant trust layer.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-6 mb-8">
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">{`npm install @ethos/reputation-gate

import { EthosGate, PayButton } from '@ethos/reputation-gate'

<EthosGate preset="VOTE">
  <PayButton amount={50} token="USDC" />
</EthosGate>`}</pre>
            </div>

            <div className="text-center">
              <Link to="/examples" className="text-blue-600 hover:underline font-semibold">
                View more examples &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="glass-card rounded-2xl py-6">
              <div className="text-4xl font-semibold text-slate-900 mb-2">4</div>
              <div className="text-slate-600">Trust Tiers</div>
            </div>
            <div className="glass-card rounded-2xl py-6">
              <div className="text-4xl font-semibold text-slate-900 mb-2">6</div>
              <div className="text-slate-600">Live Demos</div>
            </div>
            <div className="glass-card rounded-2xl py-6">
              <div className="text-4xl font-semibold text-slate-900 mb-2">5 min</div>
              <div className="text-slate-600">Setup Time</div>
            </div>
            <div className="glass-card rounded-2xl py-6">
              <div className="text-4xl font-semibold text-slate-900 mb-2">100%</div>
              <div className="text-slate-600">Production Ready</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-cta rounded-3xl px-8 py-12">
            <h2 className="text-4xl font-semibold mb-4 text-slate-900">Ready to Build?</h2>
            <p className="text-lg text-slate-700 mb-8">Install the SDK and start gating access in 5 minutes</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demos" className="glass-pill px-8 py-3 text-slate-900 font-semibold">
                Explore Demos
              </Link>
              <a
                href="https://github.com/Emperoar07/ethos-gate"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill px-8 py-3 text-slate-900 font-semibold"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
