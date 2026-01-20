import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

import { useEthosConfig } from "../components/EthosProvider";

const SIGN_MESSAGE_PREFIX = "EthosGate Score Check\nAddress: ";

export interface AccessTokenData {
  token: string | null;
  score: number;
  tier: string;
  loading: boolean;
  error: string | null;
}

export function useEthosAccessToken(address?: string): AccessTokenData {
  const { apiUrl } = useEthosConfig();
  const { address: connectedAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState<string | null>(null);
  const [signingMessage, setSigningMessage] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [issuedAt, setIssuedAt] = useState<string | null>(null);
  const [data, setData] = useState<AccessTokenData>({
    token: null,
    score: 0,
    tier: "NEW",
    loading: true,
    error: null
  });

  useEffect(() => {
    setSignature(null);
    setSigningMessage(null);
    setNonce(null);
    setIssuedAt(null);
  }, [address]);

  useEffect(() => {
    if (!address) {
      setData({ token: null, score: 0, tier: "NEW", loading: false, error: "No address provided" });
      return;
    }

    async function fetchToken() {
      try {
        if (address !== connectedAddress) {
          throw new Error("Connected wallet does not match the requested address");
        }

        let signedMessage = signingMessage;
        let signedSignature = signature;
        let currentNonce = nonce;
        let currentIssuedAt = issuedAt;

        if (!currentNonce) {
          currentNonce = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
          setNonce(currentNonce);
        }

        if (!currentIssuedAt) {
          currentIssuedAt = new Date().toISOString();
          setIssuedAt(currentIssuedAt);
        }

        if (!signedMessage) {
          signedMessage = `${SIGN_MESSAGE_PREFIX}${address}\nNonce: ${currentNonce}\nIssued At: ${currentIssuedAt}`;
          setSigningMessage(signedMessage);
        }

        if (!signedSignature) {
          signedSignature = await signMessageAsync({ message: signedMessage });
          setSignature(signedSignature);
        }

        const response = await fetch(`${apiUrl ?? "http://localhost:8000"}/api/access-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            signature: signedSignature,
            nonce: currentNonce,
            issuedAt: currentIssuedAt
          })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch access token");
        }

        const result = await response.json();

        setData({
          token: result.token || null,
          score: result.score || 0,
          tier: result.tier || "NEW",
          loading: false,
          error: null
        });
      } catch (err) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error"
        }));
      }
    }

    fetchToken();
  }, [address, apiUrl, connectedAddress, signMessageAsync, signature, signingMessage, nonce, issuedAt]);

  return data;
}
