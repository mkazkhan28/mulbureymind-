import { NextRequest, NextResponse } from "next/server";
import { initiatePayment, PaymentMethodType, PaymentOrder } from "@/lib/payments";
import { MEMBERSHIP_PLANS } from "@/lib/bds-content";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, studentPhone, studentEmail, planId, paymentMethod } = body;

    if (!studentName || !studentPhone || !planId) {
      return NextResponse.json(
        { error: "Missing required student details or plan selection." },
        { status: 400 }
      );
    }

    const selectedPlan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Invalid membership plan selected." },
        { status: 400 }
      );
    }

    const orderId = `ORD-BDS-${Date.now()}`;
    const order: PaymentOrder = {
      orderId,
      userId: "temp-student-id",
      studentName,
      studentPhone,
      studentEmail,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amountPKR: selectedPlan.pricePKR,
      paymentMethod: (paymentMethod as PaymentMethodType) || "jazzcash",
    };

    const sessionResult = await initiatePayment(order);

    return NextResponse.json({
      success: true,
      orderId,
      session: sessionResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to initiate payment session", details: error.message },
      { status: 500 }
    );
  }
}
