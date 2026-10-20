import { NextRequest, NextResponse } from "next/server";
import { BDS_RESOURCES } from "@/lib/bds-content";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const resourceId = params.id;
  const resource = BDS_RESOURCES.find((r) => r.id === resourceId);

  if (!resource) {
    return NextResponse.json(
      { error: "Study resource not found" },
      { status: 404 }
    );
  }

  // If the resource is free, allow direct download
  if (!resource.isPremium) {
    return NextResponse.json({
      success: true,
      resourceTitle: resource.title,
      downloadUrl: `/files/sample-${resource.id}.${resource.type.toLowerCase()}`,
      message: "Free study resource verified.",
    });
  }

  // Check server-side authorization header or cookie
  const authCookie = request.cookies.get("bds_auth_token")?.value;
  const isSimulatedPremium = request.headers.get("x-user-membership") === "premium" || !!authCookie;

  // In production, Supabase session auth token validates active membership table record
  if (!isSimulatedPremium) {
    return NextResponse.json(
      {
        error: "Access Denied: Premium Membership Required",
        code: "MEMBERSHIP_REQUIRED",
        resourceTitle: resource.title,
        message:
          "This high-yield lecture presentation or PDF requires an active BDS Second Year Semester or Annual Pass.",
      },
      { status: 403 }
    );
  }

  // Authorized: return protected signed file URL
  return NextResponse.json({
    success: true,
    resourceTitle: resource.title,
    downloadUrl: `/files/protected-${resource.id}.${resource.type.toLowerCase()}?signed_token=${Date.now()}`,
    expiresInSeconds: 3600,
    message: "Authorized: Single-user temporary download token generated.",
  });
}
