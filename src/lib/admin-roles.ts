export type UserRole = "user" | "teacher" | "editor" | "moderator" | "admin";

export const roleOptions: Array<{ value: UserRole; label: string; description: string }> = [
  { value: "user", label: "Utilisateur", description: "Accès apprenant standard." },
  { value: "teacher", label: "Enseignant", description: "Suit les élèves, classes et résultats pédagogiques." },
  { value: "editor", label: "Éditeur", description: "Prépare et relit les contenus pédagogiques." },
  { value: "moderator", label: "Modérateur", description: "Traite les signalements et messages communautaires." },
  { value: "admin", label: "Administrateur", description: "Accès complet à l'administration." },
];

export const staffRoles: UserRole[] = ["admin", "teacher", "editor", "moderator"];

export function isStaffRole(role: unknown): role is UserRole {
  return typeof role === "string" && staffRoles.includes(role as UserRole);
}

export function getRoleLabel(role: unknown) {
  return roleOptions.find((option) => option.value === role)?.label || "Utilisateur";
}
