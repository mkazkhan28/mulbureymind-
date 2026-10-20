import { JazzCashProvider } from "./jazzcash";
import { EasypaisaProvider } from "./easypaisa";
import { ManualIBFTProvider } from "./manual-ibft";
import {
  PaymentMethodType,
  PaymentOrder,
  PaymentProvider,
  PaymentSessionResult,
  PaymentVerificationResult,
} from "./types";

export * from "./types";

/**
 * Returns the configured payment provider instance
 */
export function getPaymentProvider(method: PaymentMethodType): PaymentProvider {
  switch (method) {
    case "jazzcash":
      return new JazzCashProvider();
    case "easypaisa":
      return new EasypaisaProvider();
    case "ibft":
      return new ManualIBFTProvider();
    case "card":
    default:
      // In Pakistan, card acquirers (e.g. Paymob or JazzCash Card) route through same gateway
      return new JazzCashProvider();
  }
}

/**
 * Initiates an order across any Pakistan payment provider
 */
export async function initiatePayment(order: PaymentOrder): Promise<PaymentSessionResult> {
  const provider = getPaymentProvider(order.paymentMethod);
  return await provider.createSession(order);
}

/**
 * Verifies callback from provider
 */
export async function verifyPayment(
  method: PaymentMethodType,
  params: Record<string, string>
): Promise<PaymentVerificationResult> {
  const provider = getPaymentProvider(method);
  return await provider.verifyCallback(params);
}
