"use client";
import { useCallback, useEffect, useState } from "react";
import {
  collection, addDoc, query, orderBy, getDocs,
  serverTimestamp, doc, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RefreshCw, Send, MessageCircle, Eye, EyeOff, ShieldCheck, Users } from "lucide-react";
import MessageBubble from "@/components/forum/MessageBubble";

type FirestoreDate = {
  toDate?: () => Date;
};

interface Reply {
  id: string;
  author: string;
  uid: string;
  content: string;
  createdAt: FirestoreDate | Date;
}

interface Post {
  id: string;
  author: string;
  uid: string;
  content: string;
  createdAt: FirestoreDate | Date;
  hidden?: boolean;
  replies?: Reply[];
}

const forumGuidelines = [
  {
    icon: ShieldCheck,
    title: "Respect",
    text: "Posez une question claire et évitez les réponses tranchées sur les sujets sensibles.",
  },
  {
    icon: Users,
    title: "Entraide",
    text: "Partagez une expérience courte, une difficulté précise ou une ressource utile.",
  },
];

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const trimmedPostLength = newPost.trim().length;

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setLoadError(false);
    try {
      const q = query(collection(db, "forum"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)).filter((post) => post.hidden !== true));
    } catch {
      setLoadError(true);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

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
      void fetchPosts();
    } catch {
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
    } catch {
      toast.error("Impossible de masquer ce message pour le moment.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="card-premium overflow-hidden p-0">
        <div className="grid gap-5 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 p-5 text-white sm:p-6 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold">
              <MessageCircle className="h-4 w-4" />
              Forum
            </div>
            <h1 className="mt-4 text-3xl font-heading font-bold sm:text-4xl">Questions et entraide</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80">
              Un espace simple pour poser une question, partager une difficulté ou encourager un autre apprenant.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {forumGuidelines.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold text-emerald-950">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="font-bold">{item.title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-emerald-50/75">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Nouveau message */}
      <Card className="border-emerald-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/75">
        <CardHeader><CardTitle>Nouvelle discussion</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez une question, une réflexion…"
            rows={3}
            maxLength={700}
            className="min-h-28 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-gold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Conseil : une question précise reçoit souvent une meilleure réponse.</span>
            <span>{newPost.length}/700 caractères</span>
          </div>

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
            disabled={loading || trimmedPostLength === 0}
            className="min-h-11 shrink-0 self-end rounded-full bg-emerald-900 px-5 text-white hover:bg-emerald-800"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Envoi…" : "Publier"}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des messages */}
      <div className="space-y-4">
        {loadingPosts && (
          <div className="grid gap-4">
            <div className="skeleton-block h-28 rounded-[1.5rem]" />
            <div className="skeleton-block h-28 rounded-[1.5rem]" />
          </div>
        )}
        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-100">
            <p>Forum indisponible pour le moment. Vos données ne sont pas supprimées, réessayez dans quelques instants.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => void fetchPosts()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        )}
        {!loadingPosts && !loadError && posts.length === 0 && (
          <p className="text-center text-slate-500">Aucune discussion pour le moment. Soyez le premier à écrire !</p>
        )}
        {!loadError && posts.map((post) => (
          <MessageBubble key={post.id} post={post} onDelete={handleDelete} onReplySaved={() => void fetchPosts()} />
        ))}
      </div>
    </div>
  );
}
