export type PaymentMethodType = "jazzcash" | "easypaisa" | "card" | "ibft";
export type PaymentStatusType = "pending" | "completed" | "failed" | "refunded";

export interface PaymentOrder {
  orderId: string;
  userId: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  planId: string;
  planName: string;
  amountPKR: number;
  paymentMethod: PaymentMethodType;
}

export interface PaymentSessionResult {
  success: boolean;
  orderId: string;
  paymentMethod: PaymentMethodType;
  redirectUrl?: string;
  postFields?: Record<string, string>;
  message: string;
  isTestMode: boolean;
}

export interface PaymentVerificationResult {
  isValid: boolean;
  orderId: string;
  providerTxId: string;
  amountPKR: number;
  status: PaymentStatusType;
  rawResponseCode: string;
  message: string;
}

export interface PaymentProvider {
  name: string;
  createSession(order: PaymentOrder): Promise<PaymentSessionResult>;
  verifyCallback(params: Record<string, string>): Promise<PaymentVerificationResult>;
}
