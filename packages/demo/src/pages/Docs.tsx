import { useState, type ReactNode } from "react";

export function Docs() {
  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="glass-orb glass-orb--one" />
      <div className="glass-orb glass-orb--two" />
      <div className="glass-orb glass-orb--three" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl px-6 sm:px-10 py-8 mb-10">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-600">
            Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold mt-4 text-slate-900">Ethos Gate Docs</h1>
          <p className="text-slate-600 mt-3 max-w-2xl">
            Everything you need to integrate reputation gating and payments on Base Sepolia.
          </p>
        </div>

        <Section title="Quick Start">
          <SubSection title="Installation">
            <CodeBlock language="bash">{"npm install @ethos/reputation-gate"}</CodeBlock>
          </SubSection>

          <SubSection title="Basic Usage">
            <CodeBlock language="tsx">{`import { EthosGate, PayButton } from '@ethos/reputation-gate'

function MyApp() {
  return (
    <EthosGate minScore={1400}>
      <PayButton amount={50} token="USDC" />
    </EthosGate>
  )
}`}</CodeBlock>
          </SubSection>
        </Section>

        <Section title="Components">
          <ComponentDoc
            name="EthosGate"
            description="Gate content based on Ethos reputation score"
            props={[
              { name: "minScore", type: "number", default: "0", description: "Minimum Ethos score required" },
              { name: "minVouches", type: "number", default: "0", description: "Minimum vouches required" },
              { name: "minReviews", type: "number", default: "0", description: "Minimum reviews required" },
              { name: "children", type: "ReactNode", required: true, description: "Content to show when access granted" },
              { name: "fallback", type: "ReactNode", description: "Content to show when access denied" },
              { name: "loadingComponent", type: "ReactNode", description: "Custom loading component" }
            ]}
            example={`<EthosGate minScore={1400} minVouches={3}>
  <PremiumFeature />
</EthosGate>`}
          />

          <ComponentDoc
            name="PayButton"
            description="Payment button with USDC/ETH support on Base"
            props={[
              { name: "amount", type: "number", required: true, description: "Payment amount" },
              { name: "token", type: '"USDC" | "ETH"', default: '"USDC"', description: "Token to use" },
              { name: "label", type: "string", description: "Button text" },
              { name: "onSuccess", type: "() => void", description: "Success callback" },
              { name: "onError", type: "(error: Error) => void", description: "Error callback" },
              { name: "disabled", type: "boolean", default: "false", description: "Disable button" }
            ]}
            example={`<PayButton
  amount={50}
  token="USDC"
  onSuccess={() => alert('Payment successful!')}
/>`}
          />

          <ComponentDoc
            name="TrustBadge"
            description="Display user's trust tier badge"
            props={[
              { name: "score", type: "number", required: true, description: "Ethos credibility score" },
              { name: "showScore", type: "boolean", default: "true", description: "Show numeric score" },
              { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Badge size" }
            ]}
            example={`<TrustBadge score={1847} showScore size="lg" />`}
          />
        </Section>

        <Section title="Hooks">
          <HookDoc
            name="useEthosScore"
            description="Fetch Ethos score and profile data for an address"
            params={[{ name: "address", type: "string | undefined", description: "Ethereum address to check" }]}
            returns="{ score, vouches, reviews, tier, loading, error }"
            example={`const { score, tier, loading } = useEthosScore(address)

if (loading) return <div>Loading...</div>
return <div>Score: {score} ({tier})</div>`}
          />

          <HookDoc
            name="usePayment"
            description="Handle USDC/ETH payments on Base"
            returns="{ pay, isPaying, hash }"
            example={`const { pay, isPaying } = usePayment()

const handlePay = async () => {
  await pay({
    amount: 50,
    token: 'USDC',
    onSuccess: () => console.log('Success!')
  })
}`}
          />

          <HookDoc
            name="useTrustTier"
            description="Get trust tier information for an address"
            params={[{ name: "address", type: "string | undefined", description: "Ethereum address" }]}
            returns="{ name, minScore, emoji, color, description, loading }"
            example={`const { name, emoji, color } = useTrustTier(address)

return (
  <div style={{ color }}>
    {emoji} {name} Tier
  </div>
)`}
          />
        </Section>

        <Section title="Score Presets">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Using Presets</h3>
            <p className="text-gray-600 mb-4">
              Ethos Gate includes pre-configured score requirements for common use cases.
            </p>

            <h4 className="font-semibold mt-6 mb-3">General Access Levels:</h4>
            <div className="space-y-2 mb-6">
              <PresetCard preset="PUBLIC" score={0} description="Open to everyone" />
              <PresetCard preset="BASIC" score={700} description="Basic verification" />
              <PresetCard preset="STANDARD" score={1200} description="Established users" />
              <PresetCard preset="PREMIUM" score={1600} description="High-trust users" />
              <PresetCard preset="ELITE" score={1800} description="Top-tier reputation" />
            </div>

            <h4 className="font-semibold mb-3">Use Case Presets:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <PresetCard preset="VOTE" score={1200} description="DAO voting" />
              <PresetCard preset="PROPOSE" score={1800} description="Submit proposals" />
              <PresetCard preset="BORROW" score={1500} description="DeFi borrowing" />
              <PresetCard preset="APPLY_JOB" score={1200} description="Job applications" />
              <PresetCard preset="POST_JOB" score={1600} description="Post jobs" />
              <PresetCard preset="MINT_NFT" score={1000} description="NFT minting" />
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Example Usage:</h4>
              <CodeBlock language="tsx">{`// Easy - just use a preset
<EthosGate preset="VOTE">
  <VotingInterface />
</EthosGate>

// Override specific requirements
<EthosGate preset="BORROW" minScore={2000}>
  <HighValueLoan />
</EthosGate>`}</CodeBlock>
            </div>
          </div>
        </Section>

        <Section title="Dynamic Score Calculation">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Risk-Based Scoring</h3>
            <p className="text-gray-600 mb-4">
              Calculate required scores dynamically based on risk factors.
            </p>

            <CodeBlock language="tsx">{`import { calculateRequiredScore } from '@ethos/reputation-gate'

const requiredScore = calculateRequiredScore({
  monetaryValue: 50000,
  sensitivity: 'high',
  reversibility: false,
  userImpact: 50
})

<EthosGate minScore={requiredScore}>
  <HighRiskAction />
</EthosGate>`}</CodeBlock>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Risk Factors:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  <code>monetaryValue</code> - Dollar value involved
                </li>
                <li>
                  <code>sensitivity</code> - low | medium | high | critical
                </li>
                <li>
                  <code>reversibility</code> - Can the action be undone?
                </li>
                <li>
                  <code>userImpact</code> - Number of users affected (0-100)
                </li>
                <li>
                  <code>dataAccess</code> - none | public | private | sensitive
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Trust Tiers">
          <div className="space-y-3">
            <TierCard
              emoji="🌟"
              name="ELITE"
              range="1600+"
              color="bg-yellow-50 border-yellow-500"
              description="Top 5% of Ethos users - Proven track record and high trust"
            />
            <TierCard
              emoji="✅"
              name="TRUSTED"
              range="1200-1599"
              color="bg-blue-50 border-blue-500"
              description="Established community member with solid reputation"
            />
            <TierCard
              emoji="🌱"
              name="EMERGING"
              range="700-1199"
              color="bg-green-50 border-green-500"
              description="Growing reputation - Actively building trust"
            />
            <TierCard
              emoji="⚠️"
              name="NEW"
              range="0-699"
              color="bg-gray-50 border-gray-400"
              description="New to Ethos - Build reputation through participation"
            />
          </div>
        </Section>

        <Section title="Common Patterns">
          <ExampleDoc
            title="Tiered Pricing"
            description="Offer different prices based on reputation tier"
            code={`function TieredPricing() {
  const { tier } = useTrustTier(address)
  
  const pricing = {
    ELITE: 10,
    TRUSTED: 25,
    EMERGING: 40,
    NEW: 50
  }
  
  return <PayButton amount={pricing[tier.name]} />
}`}
          />

          <ExampleDoc
            title="Multiple Requirements"
            description="Require both score and vouches/reviews"
            code={`<EthosGate 
  minScore={1400}
  minVouches={3}
  minReviews={5}
>
  <PremiumContent />
</EthosGate>`}
          />

          <ExampleDoc
            title="Custom Access Denied Message"
            description="Show helpful message when user doesn't meet requirements"
            code={`<EthosGate 
  minScore={1600}
  fallback={
    <div>
      <h3>ELITE tier required</h3>
      <p>You need 1600+ score to access this</p>
      <a href="https://ethos.network">
        Build your reputation ->
      </a>
    </div>
  }
>
  <EliteFeature />
</EthosGate>`}
          />

          <ExampleDoc
            title="Payment with Confirmation"
            description="Handle payment success and errors"
            code={`function PaymentExample() {
  const [paid, setPaid] = useState(false)
  
  return paid ? (
    <div>Payment successful!</div>
  ) : (
    <PayButton
      amount={50}
      token="USDC"
      onSuccess={() => setPaid(true)}
      onError={(err) => alert(err.message)}
    />
  )
}`}
          />
        </Section>

        <Section title="API Reference">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Backend API</h3>
            <p className="text-gray-600 mb-4">
              The SDK automatically connects to the Ethos Reputation Gate API. You can also use it directly:
            </p>

            <div className="mb-4">
              <CodeBlock language="bash">{"POST https://api.ethosgate.xyz/api/check-access"}</CodeBlock>
            </div>

            <div className="text-sm">
              <div className="font-semibold mb-2">Request:</div>
              <CodeBlock language="json">{`{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "minScore": 1400
}`}</CodeBlock>

              <div className="font-semibold mt-4 mb-2">Response:</div>
              <CodeBlock language="json">{`{
  "address": "0xd8dA...",
  "score": 1847,
  "tier": "ELITE",
  "hasAccess": true,
  "vouches": 12,
  "reviews": 34
}`}</CodeBlock>
            </div>
          </div>
        </Section>

        <Section title="Smart Contracts">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">ReputationPayments.sol</h3>
            <p className="text-gray-600 mb-4">Deployed on Base Sepolia for escrow and stake management.</p>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold">Address:</div>
                <CodeBlock language="text">{"0x... (deployed address)"}</CodeBlock>
              </div>

              <div>
                <div className="font-semibold mb-2">Key Functions:</div>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    <code>stake(amount)</code> - Stake USDC
                  </li>
                  <li>
                    <code>withdrawStake()</code> - Withdraw stake
                  </li>
                  <li>
                    <code>createPayment(recipient, amount)</code> - Create escrow
                  </li>
                  <li>
                    <code>completePayment(paymentId)</code> - Release payment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Support & Resources">
          <div className="grid md:grid-cols-2 gap-4">
            <ResourceCard
              icon="📚"
              title="Ethos API Docs"
              description="Full API documentation"
              link="https://developers.ethos.network"
            />
            <ResourceCard
              icon="💻"
              title="GitHub Repository"
              description="View source code and examples"
              link="https://github.com/ethos/reputation-gate"
            />
            <ResourceCard icon="🎮" title="Live Demos" description="Interactive demo applications" link="/demos" />
            <ResourceCard
              icon="🔐"
              title="Ethos Network"
              description="Build your reputation ->"
              link="https://ethos.network"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-white/40 text-slate-900">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copiedLine, setCopiedLine] = useState<number | null>(null);
  const lines = children.replace(/\n$/, "").split("\n");

  const handleCopy = async (text: string, lineIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLine(lineIndex);
      window.setTimeout(() => setCopiedLine(null), 1200);
    } catch {
      setCopiedLine(lineIndex);
      window.setTimeout(() => setCopiedLine(null), 1200);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b0f1a] shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-emerald-200/70">
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <span>{language}</span>
        </div>
        <span className="text-[11px] text-emerald-200/60">Terminal</span>
      </div>
      <div className="font-mono text-sm text-emerald-200">
        {lines.map((line, index) => (
          <div
            key={`${index}-${line}`}
            className="group flex items-start gap-3 px-4 py-2 hover:bg-emerald-500/5"
          >
            <span className="w-6 text-right text-emerald-300/40">{index + 1}</span>
            <pre className="flex-1 whitespace-pre-wrap break-words">{line || " "}</pre>
            <button
              type="button"
              onClick={() => handleCopy(line, index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-200/70 hover:text-emerald-200"
              aria-label={`Copy line ${index + 1}`}
              title="Copy line"
            >
              {copiedLine === index ? (
                <span className="text-[11px] uppercase tracking-widest">Copied</span>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentDoc({ name, description, props, example }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold font-mono mb-2">&lt;{name} /&gt;</h3>
      <p className="text-slate-600 mb-4">{description}</p>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Props:</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/40">
                <th className="text-left py-2 pr-4">Name</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2 pr-4">Default</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map((prop: any, i: number) => (
                <tr key={i} className="border-b border-white/40">
                  <td className="py-2 pr-4">
                    <code className="text-blue-600 font-mono text-xs">
                      {prop.name}
                      {prop.required && <span className="text-red-500">*</span>}
                    </code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-gray-600 font-mono text-xs">{prop.type}</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-gray-500 font-mono text-xs">{prop.default || "-"}</code>
                  </td>
                  <td className="py-2 text-slate-600">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {example && (
        <div>
          <h4 className="font-semibold mb-2">Example:</h4>
          <CodeBlock language="tsx">{example}</CodeBlock>
        </div>
      )}
    </div>
  );
}

function HookDoc({ name, description, params, returns, example }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold font-mono mb-2">{name}()</h3>
      <p className="text-slate-600 mb-4">{description}</p>

      {params && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Parameters:</h4>
          <ul className="space-y-2">
            {params.map((param: any, i: number) => (
              <li key={i} className="text-sm">
                <code className="text-blue-600 font-mono">{param.name}</code>
                <span className="text-gray-500"> ({param.type})</span>
                <span className="text-slate-600"> - {param.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Returns:</h4>
        <code className="text-sm bg-white/70 px-3 py-1 rounded">{returns}</code>
      </div>

      {example && (
        <div>
          <h4 className="font-semibold mb-2">Example:</h4>
          <CodeBlock language="tsx">{example}</CodeBlock>
        </div>
      )}
    </div>
  );
}

function TierCard({ emoji, name, range, color, description }: any) {
  return (
    <div className={`glass-card border ${color} rounded-2xl p-4 flex items-start gap-4`}>
      <div className="text-3xl">{emoji}</div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <div className="font-bold text-lg">{name}</div>
          <div className="font-mono text-sm text-gray-600">{range}</div>
        </div>
        <div className="text-sm text-slate-600">{description}</div>
      </div>
    </div>
  );
}

function ExampleDoc({ title, description, code }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-600 mb-4 text-sm">{description}</p>
      <CodeBlock language="tsx">{code}</CodeBlock>
    </div>
  );
}

function PresetCard({ preset, score, description }: { preset: string; score: number; description: string }) {
  return (
    <div className="glass-pill rounded-xl p-3 flex items-center justify-between">
      <div className="flex-1">
        <code className="text-sm font-mono text-blue-600">{preset}</code>
        <p className="text-xs text-slate-600 mt-1">{description}</p>
      </div>
      <div className="text-right">
        <div className="font-bold">{score}+</div>
        <div className="text-xs text-slate-500">min score</div>
      </div>
    </div>
  );
}

function ResourceCard({ icon, title, description, link }: any) {
  return (
    <a
      href={link}
      target={link.startsWith("http") ? "_blank" : undefined}
      rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
      className="glass-card rounded-2xl p-4 transition-transform hover:-translate-y-1"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </a>
  );
}
