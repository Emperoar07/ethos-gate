import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

export interface EthosConfigContextType {
  defaultMinScore?: number;
  defaultMinVouches?: number;
  defaultMinReviews?: number;
  showBadges?: boolean;
  showRequirements?: boolean;
  theme?: "light" | "dark";
  apiUrl?: string;
  treasuryAddress?: string;
}

const EthosConfigContext = createContext<EthosConfigContextType>({});

export function useEthosConfig() {
  return useContext(EthosConfigContext);
}

export function EthosProvider({
  children,
  config = {}
}: {
  children: ReactNode;
  config?: EthosConfigContextType;
}) {
  return <EthosConfigContext.Provider value={config}>{children}</EthosConfigContext.Provider>;
}
