"use client";
import { useEffect, useState } from "react";
import {
  collection, addDoc, query, orderBy, getDocs,
  serverTimestamp, doc, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, MessageCircle, Eye, EyeOff } from "lucide-react";
import MessageBubble from "@/components/forum/MessageBubble";

interface Post {
  id: string;
  author: string;
  uid: string;
  content: string;
  createdAt: any;
  hidden?: boolean;
  replies?: any[];
}

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  const fetchPosts = async () => {
    const q = query(collection(db, "forum"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)).filter((post) => post.hidden !== true));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async () => {
    if (!newPost.trim() || !user) {
      toast.error("Vous devez être connecté pour écrire.");
      return;
    }
    setLoading(true);
    try {
      const authorName = anonymous
        ? "Anonyme"
        : user.displayName || user.email?.split("@")[0] || "Utilisateur";

      await addDoc(collection(db, "forum"), {
        author: authorName,
        uid: user.uid,
        content: newPost,
        createdAt: serverTimestamp(),
        hidden: false,
        replies: [],
      });
      setNewPost("");
      toast.success("Message publié.");
      fetchPosts();
    } catch (err) {
      console.error("Erreur forum :", err);
      toast.error("Message non envoyé. Vérifiez votre connexion puis réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await updateDoc(doc(db, "forum", postId), {
        hidden: true,
        hiddenAt: serverTimestamp(),
        hiddenBy: user?.uid || "unknown",
      });
      toast.success("Message masqué sans suppression.");
      void fetchPosts();
    } catch (err) {
      console.error("Erreur suppression :", err);
      toast.error("Impossible de masquer ce message pour le moment.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-emerald-600" />
        Forum
      </h2>

      {/* Nouveau message */}
      <Card>
        <CardHeader><CardTitle>Nouvelle discussion</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez une question, une réflexion…"
            rows={3}
            className="flex-1 rounded-lg border px-3 py-2 resize-none"
          />

          {/* Option anonyme */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAnonymous(!anonymous)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                anonymous
                  ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                  : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {anonymous ? (
                <>
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">Anonyme</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {user?.displayName || "Moi"}
                  </span>
                </>
              )}
            </button>
            <span className="text-xs text-slate-400">
              {anonymous ? "Votre nom ne sera pas affiché" : "Votre prénom sera visible"}
            </span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="shrink-0 self-end"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Envoi…" : "Publier"}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des messages */}
      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-center text-slate-500">Aucune discussion pour le moment. Soyez le premier à écrire !</p>
        )}
        {posts.map((post) => (
          <MessageBubble key={post.id} post={post} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
