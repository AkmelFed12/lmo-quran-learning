export type AdminAuditAction =
  | "quality.seeded"
  | "quality.status_changed"
  | "quality.note_updated"
  | "quality.checklist_exported"
  | "user.role_changed"
  | "user.suspended"
  | "user.restored"
  | "content.seeded"
  | "content.created"
  | "content.updated"
  | "content.status_changed"
  | "content.archived"
  | "content.exported"
  | "class.created"
  | "class.updated"
  | "certificate.issued";

export type AdminAuditLog = {
  id: string;
  action: AdminAuditAction;
  targetType: string;
  targetId: string;
  summary: string;
  actorEmail: string;
  actorId: string;
  createdAt?: unknown;
  metadata?: Record<string, unknown>;
};

export const adminAuditActionLabels: Record<AdminAuditAction, string> = {
  "quality.seeded": "Initialisation qualité",
  "quality.status_changed": "Statut modifié",
  "quality.note_updated": "Note mise à jour",
  "quality.checklist_exported": "Checklist exportée",
  "user.role_changed": "Rôle modifié",
  "user.suspended": "Utilisateur suspendu",
  "user.restored": "Utilisateur réactivé",
  "content.seeded": "Contenus initialisés",
  "content.created": "Contenu créé",
  "content.updated": "Contenu modifié",
  "content.status_changed": "Statut contenu modifié",
  "content.archived": "Contenu archivé",
  "content.exported": "Contenu exporté",
  "class.created": "Classe créée",
  "class.updated": "Classe modifiée",
  "certificate.issued": "Attestation prête",
};

export function formatAdminAuditDate(value: unknown) {
  if (!value) return "à l'instant";

  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "date indisponible";

  return date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}
