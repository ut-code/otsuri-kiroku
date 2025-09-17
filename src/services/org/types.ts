export type OrgRole = "owner" | "admin" | "member";

export function roleRank(role: OrgRole): number {
  switch (role) {
    case "owner":
      return 3;
    case "admin":
      return 2;
    case "member":
    default:
      return 1;
  }
}

export function isValidRole(role: string): role is OrgRole {
  return role === "owner" || role === "admin" || role === "member";
}
