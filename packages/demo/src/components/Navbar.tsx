import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShieldGateLogo } from "./Logo";

export function Navbar() {
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
                href="https://github.com/ethos/reputation-gate"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill px-4 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
