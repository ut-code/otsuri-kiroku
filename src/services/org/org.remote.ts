import * as v from "valibot";
import { command, query } from "$app/server";
import {
  listUserOrgs as listUserOrgsServer,
  getOrgBySlug as getOrgBySlugServer,
  listMembers as listMembersServer,
  listInvites as listInvitesServer,
  createOrg as createOrgServer,
  updateOrg as updateOrgServer,
  deleteOrg as deleteOrgServer,
  switchOrg as switchOrgServer,
  createInvite as createInviteServer,
  revokeInvite as revokeInviteServer,
  acceptInvite as acceptInviteServer,
  addMember as addMemberServer,
  removeMember as removeMemberServer,
  changeMemberRole as changeMemberRoleServer,
} from "@/services/org/org.server.ts";

const Schemas = {
  create: v.object({
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    image: v.optional(v.string()),
  }),
  update: v.object({
    orgId: v.string(),
    name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
    image: v.optional(v.string()),
  }),
  delete: v.object({ orgId: v.string(), confirmName: v.string() }),
  switch: v.object({ orgId: v.string() }),
  listByRef: v.object({
    orgId: v.optional(v.string()),
    slug: v.optional(v.string()),
  }),
  createInvite: v.object({
    orgId: v.string(),
    role: v.picklist(["admin", "member"] as const),
    expiresInMinutes: v.optional(v.number()),
  }),
  revokeInvite: v.object({ orgId: v.string(), inviteId: v.string() }),
  acceptInvite: v.object({ token: v.string() }),
  addMember: v.object({
    orgId: v.string(),
    userId: v.string(),
    role: v.picklist(["admin", "member"] as const),
  }),
  removeMember: v.object({ orgId: v.string(), userId: v.string() }),
  changeRole: v.object({
    orgId: v.string(),
    userId: v.string(),
    role: v.picklist(["admin", "member"] as const),
  }),
} as const;

export const listUserOrgs = query(async () => listUserOrgsServer());

export const getOrgBySlug = query(v.string(), async (slug) =>
  getOrgBySlugServer(slug),
);

export const listMembers = query(Schemas.listByRef, async (ref) =>
  listMembersServer(ref),
);

export const listInvites = query(Schemas.listByRef, async (ref) =>
  listInvitesServer(ref),
);

export const createOrg = command(Schemas.create, async (input) =>
  createOrgServer(input),
);

export const updateOrg = command(Schemas.update, async (input) =>
  updateOrgServer(input),
);

export const deleteOrg = command(Schemas.delete, async (input) =>
  deleteOrgServer(input),
);

export const switchOrg = command(Schemas.switch, async (input) =>
  switchOrgServer(input),
);

export const createInvite = command(Schemas.createInvite, async (input) =>
  createInviteServer(input),
);

export const revokeInvite = command(Schemas.revokeInvite, async (input) =>
  revokeInviteServer(input),
);

export const acceptInvite = command(Schemas.acceptInvite, async (input) =>
  acceptInviteServer(input),
);

export const addMember = command(Schemas.addMember, async (input) =>
  addMemberServer(input),
);

export const removeMember = command(Schemas.removeMember, async (input) =>
  removeMemberServer(input),
);

export const changeMemberRole = command(Schemas.changeRole, async (input) =>
  changeMemberRoleServer(input),
);
