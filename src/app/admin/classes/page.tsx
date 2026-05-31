"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import type { TeacherClass } from "@/lib/teacher-groups";

type UserOption = {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
};

const emptyClass: TeacherClass = {
  id: "",
  name: "",
  teacherId: "",
  teacherEmail: "",
  studentIds: [],
  objective: "",
  level: "Débutant",
};

export default function AdminClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [draft, setDraft] = useState<TeacherClass>(emptyClass);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classesSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, "teacherClasses")),
        getDocs(collection(db, "users")),
      ]);
      setClasses(classesSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as TeacherClass)));
      setUsers(usersSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as UserOption)));
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const teachers = users.filter((entry) => entry.role === "teacher" || entry.role === "admin");
  const students = users.filter((entry) => !entry.role || entry.role === "user" || entry.role === "learner");

  const saveClass = async () => {
    if (!draft.name.trim()) {
      toast.error("Le nom de la classe est obligatoire.");
      return;
    }

    const selectedTeacher = users.find((entry) => entry.id === draft.teacherId);
    const classId = draft.id || `classe-${Date.now()}`;

    await setDoc(
      doc(db, "teacherClasses", classId),
      {
        ...draft,
        id: classId,
        teacherEmail: selectedTeacher?.email || draft.teacherEmail || user?.email || "enseignant",
        teacherId: draft.teacherId || user?.uid || "unknown",
        updatedAt: serverTimestamp(),
        createdAt: draft.id ? draft.createdAt || serverTimestamp() : serverTimestamp(),
      },
      { merge: true }
    );

    await addDoc(collection(db, "adminAuditLogs"), {
      action: draft.id ? "class.updated" : "class.created",
      targetType: "class",
      targetId: classId,
      summary: `${draft.id ? "Mise à jour" : "Création"} de la classe ${draft.name}.`,
      actorEmail: user?.email || "administrateur",
      actorId: user?.uid || "unknown",
      createdAt: serverTimestamp(),
    });

    toast.success("Classe sauvegardée.");
    setDraft(emptyClass);
    void loadData();
  };

  const toggleStudent = (studentId: string) => {
    setDraft((current) => ({
      ...current,
      studentIds: current.studentIds.includes(studentId)
        ? current.studentIds.filter((id) => id !== studentId)
        : [...current.studentIds, studentId],
    }));
  };

  const studentNames = useMemo(() => new Map(users.map((entry) => [entry.id, entry.displayName || entry.email || entry.id])), [users]);

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Classes</p>
        <h1 className="mt-2 text-3xl font-heading font-bold">Groupes d'apprentissage</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Créez des groupes d'élèves, rattachez un enseignant et fixez un objectif pédagogique clair.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Classes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{classes.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Enseignants</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{teachers.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Apprenants</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{students.length}</p></CardContent></Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-emerald-600" /> {draft.id ? "Modifier une classe" : "Nouvelle classe"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <input aria-label="Nom de la classe" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nom de la classe" className="rounded-xl border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
            <select aria-label="Enseignant de la classe" value={draft.teacherId} onChange={(event) => setDraft({ ...draft, teacherId: event.target.value })} className="rounded-xl border px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
              <option value="">Choisir un enseignant</option>
              {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.displayName || teacher.email || teacher.id}</option>)}
            </select>
            <select aria-label="Niveau de la classe" value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value as TeacherClass["level"] })} className="rounded-xl border px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Mixte">Mixte</option>
            </select>
          </div>
          <textarea aria-label="Objectif pédagogique de la classe" value={draft.objective} onChange={(event) => setDraft({ ...draft, objective: event.target.value })} placeholder="Objectif pédagogique" rows={3} className="rounded-xl border px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="mb-3 text-sm font-semibold">Élèves</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => toggleStudent(student.id)}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${draft.studentIds.includes(student.id) ? "border-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100" : "border-slate-200 dark:border-slate-800"}`}
                >
                  {student.displayName || student.email || student.id}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => void saveClass()} className="w-fit min-h-11">
            <Users className="mr-2 h-4 w-4" />
            Sauvegarder la classe
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? (
          <Card><CardContent className="p-6 text-sm text-slate-500"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Chargement…</CardContent></Card>
        ) : classes.length === 0 ? (
          <Card><CardContent className="p-6 text-sm text-slate-500">Aucune classe créée.</CardContent></Card>
        ) : (
          classes.map((classe) => (
            <Card key={classe.id}>
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold">{classe.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{classe.level} · {classe.teacherEmail}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{classe.objective || "Objectif à préciser."}</p>
                  <p className="mt-3 text-xs text-slate-400">{classe.studentIds.length} élève(s) : {classe.studentIds.map((id) => studentNames.get(id)).filter(Boolean).join(", ") || "-"}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setDraft(classe)}>
                  Modifier
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
