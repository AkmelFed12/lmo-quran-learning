"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ShieldCheck, Trash2, Search, UserCog, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRoleLabel, roleOptions, type UserRole } from "@/lib/admin-roles";

type AdminUser = {
  id: string;
  displayName?: string;
  email?: string;
  role?: UserRole;
  createdAt?: unknown;
};

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((entry) => ({ id: entry.id, ...entry.data() } as AdminUser)));
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const writeAudit = async (targetId: string, summary: string, metadata?: Record<string, unknown>) => {
    await addDoc(collection(db, "adminAuditLogs"), {
      action: "user.role_changed",
      targetType: "user",
      targetId,
      summary,
      actorEmail: currentAdmin?.email || "administrateur",
      actorId: currentAdmin?.uid || "unknown",
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    });
  };

  const updateRole = async (targetUser: AdminUser, nextRole: UserRole) => {
    const previousRole = targetUser.role || "user";
    if (previousRole === nextRole) return;

    setSavingId(targetUser.id);
    setUsers((current) => current.map((entry) => (entry.id === targetUser.id ? { ...entry, role: nextRole } : entry)));

    try {
      await setDoc(
        doc(db, "users", targetUser.id),
        {
          role: nextRole,
          roleUpdatedAt: serverTimestamp(),
          roleUpdatedBy: currentAdmin?.email || "administrateur",
        },
        { merge: true }
      );
      await writeAudit(
        targetUser.id,
        `${targetUser.email || targetUser.displayName || targetUser.id} : ${getRoleLabel(previousRole)} vers ${getRoleLabel(nextRole)}.`,
        { previousRole, nextRole }
      );
      toast.success("Rôle mis à jour.");
    } catch (error) {
      console.error(error);
      setUsers((current) => current.map((entry) => (entry.id === targetUser.id ? { ...entry, role: previousRole } : entry)));
      toast.error("Impossible de modifier le rôle.");
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Supprimer cet utilisateur du profil Firestore ?")) return;
    await deleteDoc(doc(db, "users", userId));
    toast.success("Profil utilisateur supprimé.");
    void fetchUsers();
  };

  const filtered = useMemo(
    () =>
      users.filter((entry) =>
        [entry.displayName || "", entry.email || "", entry.id, getRoleLabel(entry.role)].some((value) =>
          value.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [search, users]
  );

  const roleCounts = roleOptions.map((role) => ({
    ...role,
    count: users.filter((entry) => (entry.role || "user") === role.value).length,
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Utilisateurs</p>
          <h1 className="mt-2 text-3xl font-heading font-bold">Rôles et accès</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Attribuez les rôles d'administration sans exposer l'interface au public. Les changements sont tracés dans le journal d'audit.
          </p>
        </div>
        <Button onClick={() => void fetchUsers()} className="min-h-12">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCog className="mr-2 h-4 w-4" />}
          Actualiser
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {roleCounts.map((role) => (
          <Card key={role.value}>
            <CardHeader>
              <CardTitle className="text-base">{role.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{role.count}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un nom, un e-mail, un UID ou un rôle..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-scroll">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                  <th className="p-4">Nom</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">UID</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">Aucun utilisateur trouvé.</td></tr>
                ) : (
                  filtered.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-4 font-semibold">{entry.displayName || "-"}</td>
                      <td className="p-4">{entry.email || "-"}</td>
                      <td className="p-4 font-mono text-xs">{entry.id.substring(0, 12)}...</td>
                      <td className="p-4">
                        <select
                          value={entry.role || "user"}
                          disabled={savingId === entry.id}
                          onChange={(event) => void updateRole(entry, event.target.value as UserRole)}
                          className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                        >
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {entry.role && entry.role !== "user" && <ShieldCheck className="mt-2 h-4 w-4 text-emerald-600" />}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void deleteUser(entry.id)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
