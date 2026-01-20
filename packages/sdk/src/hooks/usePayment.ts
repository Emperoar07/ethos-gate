import { useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { parseEther, parseUnits } from "viem";

import { ERC20_ABI, USDC_ADDRESS_BASE_SEPOLIA, ZERO_ADDRESS, isValidTreasuryAddress } from "../utils/constants";
import { useEthosConfig } from "../components/EthosProvider";

export interface PaymentOptions {
  amount: number;
  token?: "USDC" | "ETH";
  recipient?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const BASE_SEPOLIA_CHAIN_ID = 84532;

export function usePayment() {
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });
  const config = useEthosConfig();

  function reset() {
    setError(undefined);
    setTxHash(undefined);
    setIsPaying(false);
  }

  async function pay(options: PaymentOptions) {
    const { amount, token = "USDC", recipient: providedRecipient, onSuccess, onError } = options;

    // Resolve recipient: prefer provided, fallback to config, never use zero address
    const recipient = providedRecipient || config.treasuryAddress;

    // Reset previous error state
    setError(undefined);

    // Validate treasury address - must be configured and not zero address
    if (!isValidTreasuryAddress(recipient)) {
      const err = new Error(
        recipient === ZERO_ADDRESS
          ? "Treasury address not configured. Set treasuryAddress in EthosGateProvider."
          : "Invalid recipient address. Provide a valid Ethereum address."
      );
      setError(err);
      onError?.(err);
      return;
    }

    setIsPaying(true);

    try {
      if (!address) {
        throw new Error("Connect your wallet to continue");
      }

      if (chainId && chainId !== BASE_SEPOLIA_CHAIN_ID) {
        throw new Error("Switch your wallet to Base Sepolia");
      }

      if (!publicClient) {
        throw new Error("Wallet provider not ready");
      }

      if (amount <= 0) {
        throw new Error("Payment amount must be greater than zero");
      }

      if (token === "USDC") {
        const decimals = 6;
        const amountInUnits = parseUnits(amount.toString(), decimals);
        const balance = await publicClient.readContract({
          address: USDC_ADDRESS_BASE_SEPOLIA,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`]
        });

        if (balance < amountInUnits) {
          throw new Error("Insufficient Base Sepolia USDC balance");
        }

        const hash = await writeContractAsync({
          address: USDC_ADDRESS_BASE_SEPOLIA,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipient as `0x${string}`, amountInUnits]
        });

        setTxHash(hash);
        await publicClient.waitForTransactionReceipt({ hash });
        onSuccess?.();
      } else {
        const amountInWei = parseEther(amount.toString());
        const balance = await publicClient.getBalance({ address: address as `0x${string}` });
        if (balance < amountInWei) {
          throw new Error("Insufficient Base Sepolia ETH balance");
        }

        const hash = await sendTransactionAsync({
          to: recipient as `0x${string}`,
          value: amountInWei
        });
        setTxHash(hash);
        await publicClient.waitForTransactionReceipt({ hash });
        onSuccess?.();
      }
    } catch (err) {
      const error = err as Error;
      console.error("Payment error:", error);
      setError(error);
      onError?.(error);
    } finally {
      setIsPaying(false);
    }
  }

  return {
    pay,
    isPaying: isPaying || isConfirming,
    hash: txHash,
    error,
    reset
  };
}
