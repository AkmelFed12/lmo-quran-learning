"use client";
import { useEffect, useState } from "react";
import {
  collection, getDocs, doc, query, orderBy, serverTimestamp, setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Archive, Mail, Phone, User } from "lucide-react";
import { requestConfirmation } from "@/lib/confirm-action";

type ContactMessage = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  archived?: boolean;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage)).filter((message) => message.archived !== true));
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const archiveContact = async (id: string) => {
    await setDoc(
      doc(db, "contacts", id),
      {
        archived: true,
        archivedAt: serverTimestamp(),
      },
      { merge: true }
    );
    toast.success("Message archivé sans suppression.");
    void fetchContacts();
  };

  const requestArchiveContact = (id: string) => {
    requestConfirmation({
      title: "Archiver ce message ?",
      description: "Il ne sera plus affiché dans la liste active, sans être supprimé.",
      confirmLabel: "Archiver",
      onConfirm: () => archiveContact(id),
    });
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
                  onClick={() => requestArchiveContact(msg.id)}
                  className="text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 shrink-0"
                  aria-label="Archiver ce message"
                >
                  <Archive className="w-4 h-4" />
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
