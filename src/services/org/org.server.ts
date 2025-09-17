import { prisma } from "@/services/prisma/prisma.server.ts";
import { getSession } from "@/services/auth/auth.server.ts";
import { normalizeSlug, validateSlug } from "@/lib/utils/slug.ts";
import { now } from "@/lib/utils/time.ts";
import { newId, newToken } from "@/lib/utils/id.ts";
import { getActiveOrgIdCookie, setActiveOrgIdCookie } from "./cookies.server.ts";
import { requireRole, requireSession } from "./guards.server.ts";
import type { OrgRole } from "./types.ts";

async function resolveOrgId(input: { orgId?: string; slug?: string }) {
  if (input.orgId) return input.orgId;
  if (input.slug) {
    const org = await prisma.organization.findUnique({ where: { slug: input.slug } });
    if (!org) throw new Error("Organization not found");
    return org.id;
  }
  const cookieOrgId = getActiveOrgIdCookie();
  if (cookieOrgId) return cookieOrgId;
  throw new Error("Organization context required");
}

export async function listUserOrgs() {
  const session = await getSession();
  if (!session || !session.user) return [] as Array<{ id: string; name: string; slug: string; image?: string; role: OrgRole }>;
  const userId = session.user.id;
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: { org: true },
    orderBy: { joinedAt: "asc" },
  });
  return memberships.map((m) => ({
    id: m.org.id,
    name: m.org.name,
    slug: m.org.slug,
    image: m.org.image ?? undefined,
    role: m.role as OrgRole,
  }));
}

export async function getOrgBySlug(slug: string) {
  const session = await requireSession();
  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) throw new Error("Organization not found");
  await requireRole(org.id, session.user.id, "member");
  return org;
}

export async function listMembers(ref: { orgId?: string; slug?: string }) {
  const session = await requireSession();
  const orgId = await resolveOrgId(ref);
  await requireRole(orgId, session.user.id, "member");
  const members = await prisma.organizationMember.findMany({
    where: { orgId },
    include: { user: true },
    orderBy: { joinedAt: "asc" },
  });
  return members.map((m) => ({
    user: { id: m.user.id, name: m.user.name, image: m.user.image ?? undefined },
    role: m.role as OrgRole,
    joinedAt: m.joinedAt.toISOString(),
  }));
}

export async function listInvites(ref: { orgId?: string; slug?: string }) {
  const session = await requireSession();
  const orgId = await resolveOrgId(ref);
  await requireRole(orgId, session.user.id, "admin");
  const invites = await prisma.organizationInvite.findMany({
    where: { orgId, revokedAt: null, acceptedAt: null, expiresAt: { gt: now() } },
    orderBy: { expiresAt: "asc" },
  });
  return invites.map((i) => ({
    id: i.id,
    role: i.role as OrgRole,
    token: i.token,
    expiresAt: i.expiresAt.toISOString(),
    invitedByUserId: i.invitedByUserId,
  }));
}

export async function createOrg(input: { name: string; slug: string; image?: string }) {
  const session = await requireSession();
  const createdAt = now();
  const slug = normalizeSlug(input.slug);
  validateSlug(slug);
    const org = await prisma.organization.create({
      data: {
      id: newId(),
      name: input.name.trim(),
      slug,
      image: input.image,
      createdByUserId: session.user.id,
      createdAt,
      updatedAt: createdAt,
    },
  });
  await prisma.organizationMember.create({
    data: {
      id: newId(),
      orgId: org.id,
      userId: session.user.id,
      role: "owner",
      joinedAt: createdAt,
    },
  });
  return org;
}

export async function updateOrg(input: { orgId: string; name?: string; image?: string }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "admin");
  const updated = await prisma.organization.update({
    where: { id: input.orgId },
    data: {
      name: input.name?.trim(),
      image: input.image,
      updatedAt: now(),
    },
  });
  return updated;
}

export async function deleteOrg(input: { orgId: string; confirmName: string }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "owner");
  const org = await prisma.organization.findUnique({ where: { id: input.orgId } });
  if (!org) throw new Error("Organization not found");
  if (org.name !== input.confirmName) throw new Error("Confirmation name mismatch");
  const memberCount = await prisma.organizationMember.count({ where: { orgId: input.orgId } });
  if (memberCount > 1) throw new Error("Cannot delete an organization with multiple members");
  await prisma.organization.delete({ where: { id: input.orgId } });
  return { ok: true } as const;
}

export async function switchOrg(input: { orgId: string }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "member");
  setActiveOrgIdCookie(input.orgId);
  return { ok: true } as const;
}

export async function createInvite(input: { orgId: string; role: Exclude<OrgRole, "owner">; expiresInMinutes?: number }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "admin");
  const createdAt = now();
  const ttl = typeof input.expiresInMinutes === "number" ? input.expiresInMinutes : 60 * 24; // default 24h
  const invite = await prisma.organizationInvite.create({
    data: {
      id: newId(),
      orgId: input.orgId,
      role: input.role,
      token: newToken(),
      invitedByUserId: session.user.id,
      expiresAt: new Date(createdAt.getTime() + ttl * 60 * 1000),
    },
  });
  return invite;
}

export async function revokeInvite(input: { orgId: string; inviteId: string }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "admin");
  const invite = await prisma.organizationInvite.findUnique({ where: { id: input.inviteId } });
  if (!invite || invite.orgId !== input.orgId) throw new Error("Invite not found");
  if (invite.revokedAt || invite.acceptedAt) return { ok: true } as const;
  await prisma.organizationInvite.update({ where: { id: input.inviteId }, data: { revokedAt: now() } });
  return { ok: true } as const;
}

export async function acceptInvite(input: { token: string }) {
  const session = await requireSession();
  const invite = await prisma.organizationInvite.findUnique({ where: { token: input.token } });
  if (!invite) throw new Error("Invalid invite");
  if (invite.revokedAt) throw new Error("Invite revoked");
  if (invite.acceptedAt) throw new Error("Invite already used");
  if (invite.expiresAt <= now()) throw new Error("Invite expired");
  const existing = await prisma.organizationMember.findFirst({ where: { orgId: invite.orgId, userId: session.user.id } });
  if (existing) throw new Error("Already a member");
  await prisma.$transaction([
    prisma.organizationMember.create({
      data: { id: newId(), orgId: invite.orgId, userId: session.user.id, role: invite.role as OrgRole, joinedAt: now() },
    }),
    prisma.organizationInvite.update({ where: { id: invite.id }, data: { acceptedAt: now(), acceptedByUserId: session.user.id } }),
  ]);
  return { ok: true } as const;
}

export async function addMember(input: { orgId: string; userId: string; role: Exclude<OrgRole, "owner"> }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "admin");
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!user) throw new Error("User not found");
  const existing = await prisma.organizationMember.findFirst({ where: { orgId: input.orgId, userId: input.userId } });
  if (existing) throw new Error("User already a member");
  const member = await prisma.organizationMember.create({
    data: { id: newId(), orgId: input.orgId, userId: input.userId, role: input.role, joinedAt: now() },
  });
  return member;
}

export async function removeMember(input: { orgId: string; userId: string }) {
  const session = await requireSession();
  // Admin+ action; but cannot remove owner
  await requireRole(input.orgId, session.user.id, "admin");
  const target = await prisma.organizationMember.findFirst({ where: { orgId: input.orgId, userId: input.userId } });
  if (!target) return { ok: true } as const;
  if (target.role === "owner") throw new Error("Cannot remove an owner");
  await prisma.organizationMember.delete({ where: { id: target.id } });
  return { ok: true } as const;
}

export async function changeMemberRole(input: { orgId: string; userId: string; role: Exclude<OrgRole, "owner"> }) {
  const session = await requireSession();
  await requireRole(input.orgId, session.user.id, "admin");
  const target = await prisma.organizationMember.findFirst({ where: { orgId: input.orgId, userId: input.userId } });
  if (!target) throw new Error("Membership not found");
  if (target.role === "owner") throw new Error("Cannot change owner role");
  await prisma.organizationMember.update({ where: { id: target.id }, data: { role: input.role } });
  return { ok: true } as const;
}
