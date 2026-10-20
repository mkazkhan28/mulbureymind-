import {
  PaymentOrder,
  PaymentProvider,
  PaymentSessionResult,
  PaymentVerificationResult,
} from "./types";

export class EasypaisaProvider implements PaymentProvider {
  name = "Easypaisa";

  private storeId: string;
  private isSandbox: boolean;

  constructor() {
    this.storeId = process.env.EASYPAISA_STORE_ID || "TEST_STORE_ID";
    this.isSandbox = process.env.NEXT_PUBLIC_PAYMENT_ENVIRONMENT !== "production";
  }

  async createSession(order: PaymentOrder): Promise<PaymentSessionResult> {
    const postFields: Record<string, string> = {
      storeId: this.storeId,
      orderId: order.orderId,
      transactionAmount: order.amountPKR.toFixed(2),
      mobileAccountNo: order.studentPhone,
      emailAddress: order.studentEmail || "student@bdsstudyhub.pk",
    };

    const endpoint = this.isSandbox
      ? "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf"
      : "https://easypay.easypaisa.com.pk/easypay/Index.jsf";

    return {
      success: true,
      orderId: order.orderId,
      paymentMethod: "easypaisa",
      redirectUrl: endpoint,
      postFields,
      message: this.isSandbox
        ? "Easypaisa Sandbox checkout session initialized."
        : "Redirecting to Easypaisa Gateway...",
      isTestMode: this.isSandbox,
    };
  }

  async verifyCallback(params: Record<string, string>): Promise<PaymentVerificationResult> {
    const responseCode = params.responseCode || params.status || "";
    // In Easypaisa specs: "0000" means Success
    const isSuccess = responseCode === "0000" || responseCode === "00" || responseCode === "SUCCESS" || this.isSandbox;

    return {
      isValid: isSuccess,
      orderId: params.orderRefNum || params.orderId || "UNKNOWN",
      providerTxId: params.transactionId || `EP-${Date.now()}`,
      amountPKR: params.transactionAmount ? parseFloat(params.transactionAmount) : 0,
      status: isSuccess ? "completed" : "failed",
      rawResponseCode: responseCode,
      message: params.desc || (isSuccess ? "Easypaisa Payment Verified" : "Easypaisa Transaction Incomplete"),
    };
  }
}
