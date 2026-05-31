"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface Reply {
  id: string;
  author: string;
  uid: string;
  content: string;
  createdAt: any;
}

interface PostProps {
  post: {
    id: string;
    author: string;
    uid: string;
    content: string;
    createdAt: any;
    replies?: Reply[];
  };
  onDelete: (postId: string) => void;
}

export default function MessageBubble({ post, onDelete }: PostProps) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim() || !user) return;
    setSending(true);
    const newReply: Reply = {
      id: Date.now().toString(),
      author: user.displayName || "Anonyme",
      uid: user.uid,
      content: replyContent,
      createdAt: new Date(),
    };
    try {
      await updateDoc(doc(db, "forum", post.id), {
        replies: arrayUnion(newReply),
      });
      setReplyContent("");
      setShowReply(false);
      toast.success("Réponse ajoutée.");
    } catch {
      toast.error("Réponse non envoyée. Vérifiez votre connexion puis réessayez.");
    } finally {
      setSending(false);
    }
  };

  const timeAgo = post.createdAt?.toDate
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: fr })
    : "";

  return (
    <div className="card-premium p-4 hover:border-emerald-200 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-lg flex-shrink-0">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">{post.author}</span>
            <span className="text-xs text-slate-400">{timeAgo}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              Répondre
            </button>
            {user?.uid === post.uid && (
              <button
                onClick={() => onDelete(post.id)}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Masquer
              </button>
            )}
            {post.replies && post.replies.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-slate-500 hover:underline flex items-center gap-1"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {post.replies.length} réponse{post.replies.length > 1 ? "s" : ""}
              </button>
            )}
          </div>

          {/* Formulaire de réponse */}
          {showReply && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre réponse…"
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
              <Button size="sm" onClick={handleReply} disabled={sending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Réponses */}
          {expanded && post.replies && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800">
              {post.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {reply.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-xs">{reply.author}</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
