import {
  PaymentOrder,
  PaymentProvider,
  PaymentSessionResult,
  PaymentVerificationResult,
} from "./types";

export class ManualIBFTProvider implements PaymentProvider {
  name = "Direct Bank Transfer (IBFT / Raast)";

  async createSession(order: PaymentOrder): Promise<PaymentSessionResult> {
    return {
      success: true,
      orderId: order.orderId,
      paymentMethod: "ibft",
      message:
        "Please transfer PKR " +
        order.amountPKR.toLocaleString() +
        " to designated Meezan Bank or Raast ID and enter your transaction reference.",
      isTestMode: false,
    };
  }

  async verifyCallback(params: Record<string, string>): Promise<PaymentVerificationResult> {
    const isApproved = params.adminApproved === "true" || params.status === "completed";

    return {
      isValid: isApproved,
      orderId: params.orderId || "UNKNOWN",
      providerTxId: params.bankReference || `IBFT-${Date.now()}`,
      amountPKR: params.amount ? parseFloat(params.amount) : 0,
      status: isApproved ? "completed" : "pending",
      rawResponseCode: isApproved ? "APPROVED" : "PENDING_REVIEW",
      message: isApproved ? "Bank deposit verified by admin." : "Pending admin verification.",
    };
  }
}
