"use client";
import { useEffect, useState } from "react";
import {
  collection, getDocs, deleteDoc, doc, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Mail, Phone, User } from "lucide-react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const deleteContact = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await deleteDoc(doc(db, "contacts", id));
    toast.success("Message supprimé.");
    fetchContacts();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Messages de contact</h2>
      <div className="grid gap-4">
        {contacts.map(msg => (
          <Card key={msg.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${msg.email}`} className="text-emerald-600 hover:underline">{msg.email}</a>
                  </div>
                  {msg.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${msg.phone}`} className="text-emerald-600 hover:underline">{msg.phone}</a>
                    </div>
                  )}
                  <p className="text-slate-600 dark:text-slate-300 mt-2">{msg.message}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteContact(msg.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && contacts.length === 0 && (
          <p className="text-center text-slate-500">Aucun message.</p>
        )}
      </div>
    </div>
  );
}