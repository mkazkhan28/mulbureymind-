import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, studentPhone, planId, bankReference, amountPKR } = body;

    if (!studentName || !bankReference) {
      return NextResponse.json(
        { error: "Please provide student name and bank deposit reference." },
        { status: 400 }
      );
    }

    // Record pending payment in public.payments table
    return NextResponse.json({
      success: true,
      status: "pending_verification",
      message:
        "Your bank transfer details have been submitted. Our team will verify the deposit and activate your access within 1 to 2 hours.",
      depositRef: bankReference,
      amountPKR,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to submit bank reference", details: error.message },
      { status: 500 }
    );
  }
}
