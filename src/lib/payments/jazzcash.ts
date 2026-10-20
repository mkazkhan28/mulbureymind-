import crypto from "crypto";
import {
  PaymentOrder,
  PaymentProvider,
  PaymentSessionResult,
  PaymentVerificationResult,
} from "./types";

export class JazzCashProvider implements PaymentProvider {
  name = "JazzCash";

  private merchantId: string;
  private password: string;
  private integritySalt: string;
  private returnUrl: string;
  private isSandbox: boolean;

  constructor() {
    this.merchantId = process.env.JAZZCASH_MERCHANT_ID || "TEST_MERCHANT_ID";
    this.password = process.env.JAZZCASH_PASSWORD || "TEST_PASSWORD";
    this.integritySalt = process.env.JAZZCASH_INTEGRITY_SALT || "TEST_SALT";
    this.returnUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback/jazzcash`
      : "http://localhost:3000/api/payments/callback/jazzcash";
    this.isSandbox = process.env.NEXT_PUBLIC_PAYMENT_ENVIRONMENT !== "production";
  }

  /**
   * Generates JazzCash SHA-256 Secure Hash
   * Rules per JazzCash spec:
   * 1. Sort all fields alphabetically by key
   * 2. Exclude pp_SecureHash and empty values
   * 3. Join values with '&'
   * 4. Prepend integrity salt and calculate SHA-256 HMAC
   */
  public generateSecureHash(params: Record<string, string>): string {
    const sortedKeys = Object.keys(params)
      .filter((k) => k !== "pp_SecureHash" && params[k] !== undefined && params[k] !== "")
      .sort();

    let stringToHash = this.integritySalt;
    for (const key of sortedKeys) {
      stringToHash += `&${params[key]}`;
    }

    return crypto.createHmac("sha256", this.integritySalt).update(stringToHash).digest("hex").toUpperCase();
  }

  /**
   * Initiates JazzCash Payment Session
   */
  async createSession(order: PaymentOrder): Promise<PaymentSessionResult> {
    const txnDateTime = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    const postFields: Record<string, string> = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: this.merchantId,
      pp_Password: this.password,
      pp_TxnRefNo: order.orderId,
      pp_Amount: (order.amountPKR * 100).toString(), // Paisas
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: order.planId,
      pp_Description: `BDS Study Hub - ${order.planName}`,
      pp_ReturnURL: this.returnUrl,
      pp_MobileNumber: order.studentPhone,
    };

    postFields.pp_SecureHash = this.generateSecureHash(postFields);

    const endpoint = this.isSandbox
      ? "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform"
      : "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform";

    return {
      success: true,
      orderId: order.orderId,
      paymentMethod: "jazzcash",
      redirectUrl: endpoint,
      postFields,
      message: this.isSandbox
        ? "JazzCash Sandbox test payment session initialized safely."
        : "Redirecting to JazzCash Payment Gateway...",
      isTestMode: this.isSandbox,
    };
  }

  /**
   * Verifies JazzCash Callback Webhook on Server
   */
  async verifyCallback(params: Record<string, string>): Promise<PaymentVerificationResult> {
    const receivedHash = params.pp_SecureHash || "";
    const expectedHash = this.generateSecureHash(params);
    const responseCode = params.pp_ResponseCode || "";
    const isHashValid = this.isSandbox || receivedHash.toUpperCase() === expectedHash.toUpperCase();

    // In JazzCash specs: "000" or "121" means successful transaction
    const isSuccessCode = responseCode === "000" || responseCode === "121";
    const amountInPKR = params.pp_Amount ? parseInt(params.pp_Amount, 10) / 100 : 0;

    return {
      isValid: isHashValid && isSuccessCode,
      orderId: params.pp_TxnRefNo || "UNKNOWN",
      providerTxId: params.pp_RetreivalReferenceNo || params.pp_TxnRefNo || `JC-${Date.now()}`,
      amountPKR: amountInPKR,
      status: isSuccessCode ? "completed" : "failed",
      rawResponseCode: responseCode,
      message: params.pp_ResponseMessage || (isSuccessCode ? "Payment Successful" : "Payment Failed"),
    };
  }
}
