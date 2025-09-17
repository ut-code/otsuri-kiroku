# Organization Feature Spec

This spec introduces multi-organization (multi-tenant) capabilities. It defines scope, data model, access rules, Remote Functions, routes, UI, and testing. There is no email concept in this system; invitations are handled without email.

## Goals
- Allow a user to create and join multiple organizations.
- Provide role-based access within an organization (Owner, Admin, Member).
- Enable joining via shareable invite tokens (no email), and direct add by userId.
- Provide an Organization Switcher and basic settings/members management UI.

## Non-Goals (initial phase)
- Billing/subscriptions, audit logs, SSO/SAML, custom domains.

## Data Model (Prisma)
Add the following models:

- Organization
  - id: String @id
  - name: String (1–100)
  - slug: String @unique (kebab-case; immutable after creation)
  - image: String?
  - createdByUserId: String
  - createdAt: DateTime
  - updatedAt: DateTime

- OrganizationMember
  - id: String @id
  - orgId: String
  - userId: String
  - role: String ("owner" | "admin" | "member")
  - joinedAt: DateTime
  - @@unique([orgId, userId])

- OrganizationInvite
  - id: String @id
  - orgId: String
  - role: String ("admin" | "member")
  - token: String @unique (single-use)
  - expiresAt: DateTime
  - invitedByUserId: String
  - acceptedByUserId: String?
  - acceptedAt: DateTime?
  - revokedAt: DateTime?

Notes:
- Keep role as String for simplicity; validate via Valibot at the API boundary.
- Deleting an org cascades memberships and invites.

## Access Control & Org Context
- All operations require a valid session (Better Auth).
- Org context:
  - Preferred: URL prefix "/org/[slug]" for organization-scoped pages.
  - Additionally: `switchOrg` command sets a cookie `org_id` used as a default when a slug/ID isn’t provided.
- Roles:
  - Owner: Full control, including delete org.
  - Admin: Manage members (invite/remove/change role, except owner), edit org profile.
  - Member: Read-only org and members; cannot manage.
- Guards implemented in services to assert membership and minimum role.

## Remote Functions (API)
Co-locate under `src/services/org/*.remote.ts` alongside service logic in `src/services/org/*.server.ts`. Validate inputs with Valibot. Queries return objects with `.current` and `.refresh()`.

Queries
- listUserOrgs(): organizations the current user belongs to.
- getOrgBySlug({ slug }): org profile if the user is a member.
- listMembers({ orgId | slug }): members with role and basic user info.
- listInvites({ orgId | slug }): Owner/Admin only; pending invite tokens (show copyable links).

Commands
- createOrg({ name, slug, image? }): creates org; creator becomes Owner.
- updateOrg({ orgId, name?, image? }): Admin+.
- deleteOrg({ orgId, confirmName }): Owner only; block if multiple members (initially).
- switchOrg({ orgId }): sets active org cookie.
- createInvite({ orgId, role, expiresInMinutes? }): Admin+; returns single-use token.
- revokeInvite({ orgId, inviteId }): Admin+.
- acceptInvite({ token }): adds current session user as the invite role; single-use.
- addMember({ orgId, userId, role }): Admin+; direct add by known user id.
- removeMember({ orgId, userId }): Admin+; cannot remove Owner (unless transfer flow exists).
- changeMemberRole({ orgId, userId, role }): Admin+; cannot demote last Owner.

Validation (Valibot)
- name: 1–100 chars; slug: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, 3–50 chars.
- role: enum("owner" | "admin" | "member") with server-side constraints.

## Services
`src/services/org/org.server.ts`
- Methods mirror commands/queries.
- Guard helpers: `requireSession`, `requireMembership(orgId)`, `requireRole(orgId, minRole)`.
- Slug normalization/uniqueness, ID/token generation.

Helper modules
- `guards.server.ts` — role comparison, membership fetch.
- `slug.server.ts` — normalization/validation.
- `cookies.server.ts` — read/write `org_id`.

## Routes & UI
Pages (scoped under `/org/[slug]`):
- `/org/new` — create organization.
- `/org/[slug]` — org home.
- `/org/[slug]/settings` — profile settings (Admin+).
- `/org/[slug]/members` — members list and role management (Admin+).
- `/org/[slug]/invites` — create/revoke invite links (Admin+).
- `/invites/accept/[token]` — accept invite; requires login.

Components (place under `src/services/org/components/`)
- OrgSwitcher.svelte — lists `listUserOrgs()`; uses `switchOrg`.
- CreateInviteDialog.svelte — role picker; shows copyable invite link; updates lists via `.updates(...)`.

## Security Considerations
- All remote functions require session.
- Read operations require membership in the target org.
- Admin+ required for write operations; some actions Owner-only.
- Single-use invite tokens; mark acceptedByUserId and acceptedAt.
- Prevent destructive or privilege-escalation paths (e.g., last Owner demotion/removal).

## Edge Cases
- User with no orgs: show prompt to create an org.
- Slug collisions: surface clear error; suggest alternatives in UI.
- Deletion: block when multiple members exist (initially).

## Testing
- Storybook interactions for OrgSwitcher and invite creation/acceptance.
- Members page reflects accept/remove/role-change actions.
