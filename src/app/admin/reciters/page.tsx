"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Save, Mic } from "lucide-react";

interface Reciter {
  id: string;
  name: string;
  style: string;
  providerId?: string;
  status?: "actif" | "à vérifier";
}

const STORAGE_KEY = "admin_reciters";

export default function AdminRecitersPage() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [edit, setEdit] = useState<Reciter | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setReciters(JSON.parse(saved));
    } else {
      const defaults = [
        { id: "ar.abdurrahmaansudais", providerId: "ar.abdurrahmaansudais", name: "Abdul Rahman Al-Sudais", style: "Murattal", status: "actif" as const },
        { id: "ar.alafasy", providerId: "ar.alafasy", name: "Mishary Rashid Al-Afasy", style: "Murattal", status: "actif" as const },
        { id: "ar.husary", providerId: "ar.husary", name: "Mahmoud Khalil Al-Hussary", style: "Apprentissage", status: "actif" as const },
      ];
      setReciters(defaults);
    }
  }, []);

  const saveReciters = (list: Reciter[]) => {
    setReciters(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    toast.success("Liste sauvegardée.");
  };

  const handleSave = () => {
    if (!edit) return;
    const updated = edit.id
      ? reciters.map(r => r.id === edit.id ? edit : r)
      : [...reciters, { ...edit, id: edit.providerId || Date.now().toString(), status: edit.status || "à vérifier" }];
    saveReciters(updated);
    setEdit(null);
  };

  const handleDelete = (id: string) => {
    saveReciters(reciters.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Récitateurs</h2>
        <Button onClick={() => setEdit({ id: "", name: "", style: "", providerId: "", status: "à vérifier" })}><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
      </div>

      {edit && (
        <Card>
          <CardHeader><CardTitle>{edit.id ? "Modifier" : "Nouveau"} récitateur</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <input placeholder="Nom" value={edit.name} onChange={e => setEdit({...edit, name: e.target.value})} className="w-full rounded-lg border px-3 py-2" />
            <input placeholder="Style" value={edit.style} onChange={e => setEdit({...edit, style: e.target.value})} className="w-full rounded-lg border px-3 py-2" />
            <input placeholder="Identifiant API, ex. ar.alafasy" value={edit.providerId || ""} onChange={e => setEdit({...edit, providerId: e.target.value})} className="w-full rounded-lg border px-3 py-2" />
            <select value={edit.status || "à vérifier"} onChange={e => setEdit({...edit, status: e.target.value as Reciter["status"]})} className="w-full rounded-lg border px-3 py-2">
              <option value="actif">Actif</option>
              <option value="à vérifier">À vérifier</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-1" /> Enregistrer</Button>
              <Button variant="outline" onClick={() => setEdit(null)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {reciters.map(r => (
          <Card key={r.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-slate-500">{r.style} · {r.providerId || r.id}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${r.status === "actif" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>{r.status || "à vérifier"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEdit({...r})}>Modifier</Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
