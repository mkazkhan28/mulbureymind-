import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const verification = await verifyPayment("easypaisa", params);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (verification.isValid && verification.status === "completed") {
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

export async function GET(request: NextRequest) {
  // Support GET redirect return from hosted checkout
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const verification = await verifyPayment("easypaisa", params);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (verification.isValid) {
    return NextResponse.redirect(
      `${baseUrl}/checkout?status=success&txId=${verification.providerTxId}`,
      { status: 303 }
    );
  } else {
    return NextResponse.redirect(`${baseUrl}/checkout?status=failed`, { status: 303 });
  }
}
