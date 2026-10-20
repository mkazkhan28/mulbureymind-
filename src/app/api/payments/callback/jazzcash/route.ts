import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const verification = await verifyPayment("jazzcash", params);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (verification.isValid && verification.status === "completed") {
      // Server-side database update:
      // In production, update public.payments table set status = 'completed'
      // and extend public.memberships record for the student idempotently.
      return NextResponse.redirect(
        `${baseUrl}/checkout?status=success&txId=${verification.providerTxId}&amount=${verification.amountPKR}`,
        { status: 303 }
      );
    } else {
      return NextResponse.redirect(
        `${baseUrl}/checkout?status=failed&reason=${encodeURIComponent(verification.message)}`,
        { status: 303 }
      );
    }
  } catch (error: any) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/checkout?status=error&reason=VerificationFailed`, {
      status: 303,
    });
  }
}
