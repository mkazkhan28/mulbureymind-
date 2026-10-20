import { StudyResource } from "./bds-content";

export interface StudentEntitlement {
  userId: string;
  isLoggedIn: boolean;
  planId: string;
  planName: string;
  isPremium: boolean;
  expiresAt: string | null;
  daysRemaining: number;
}

/**
 * Server-side membership entitlement validator
 * Checks whether user has an active paid pass (Annual or Semester)
 */
export function checkUserEntitlement(userMembership?: {
  planId: string;
  status: string;
  expiresAt: string;
}): StudentEntitlement {
  if (!userMembership || userMembership.status !== "active") {
    return {
      userId: "guest",
      isLoggedIn: false,
      planId: "plan-free",
      planName: "Free Student Starter",
      isPremium: false,
      expiresAt: null,
      daysRemaining: 0,
    };
  }

  const isPaidPlan = userMembership.planId === "plan-annual" || userMembership.planId === "plan-semester";
  const now = new Date();
  const expiry = new Date(userMembership.expiresAt);
  const isExpired = expiry < now;

  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    userId: "authenticated-user",
    isLoggedIn: true,
    planId: userMembership.planId,
    planName: userMembership.planId === "plan-annual" ? "Full Academic Year Pass" : "Semester Pass",
    isPremium: isPaidPlan && !isExpired,
    expiresAt: userMembership.expiresAt,
    daysRemaining,
  };
}

/**
 * Server-side check: Can student access specific study resource?
 */
export function canAccessResource(entitlement: StudentEntitlement, resource: StudyResource): boolean {
  if (!resource.isPremium) return true;
  return entitlement.isPremium;
}

/**
 * Server-side check: Can student take unlimited mock tests?
 */
export function canAccessFullMockExam(entitlement: StudentEntitlement): boolean {
  return entitlement.isPremium;
}
