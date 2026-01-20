// Treasury address for receiving payments
// Set VITE_TREASURY_ADDRESS in .env file
// For demo purposes, falls back to a warning message if not set
export const TREASURY_ADDRESS = import.meta.env.VITE_TREASURY_ADDRESS;

if (!TREASURY_ADDRESS) {
  console.warn(
    "⚠️  TREASURY_ADDRESS not set! Set VITE_TREASURY_ADDRESS in your .env file. " +
    "Payments will fail without a valid treasury address."
  );
}
