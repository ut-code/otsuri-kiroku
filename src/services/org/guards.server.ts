import { getSession } from "@/services/auth/auth.server.ts";
import { prisma } from "@/services/prisma/prisma.server.ts";
import type { OrgRole } from "./types.ts";
import { roleRank } from "./types.ts";

export async function requireSession() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getMembership(orgId: string, userId: string) {
  return prisma.organizationMember.findFirst({
    where: { orgId, userId },
  });
}

export async function requireMembership(orgId: string, userId: string) {
  const membership = await getMembership(orgId, userId);
  if (!membership) throw new Error("Forbidden: not a member");
  return membership;
}

export async function requireRole(
  orgId: string,
  userId: string,
  minRole: OrgRole,
) {
  const membership = await requireMembership(orgId, userId);
  if (roleRank(membership.role as OrgRole) < roleRank(minRole)) {
    throw new Error("Forbidden: insufficient role");
  }
  return membership;
}
