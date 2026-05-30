import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import posts from "@/../public/data/blog.json";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p: any) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-emerald-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>
        <h1 className="text-4xl font-heading font-bold mb-4 text-slate-800 dark:text-white">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Calendar className="w-4 h-4" />
          {post.date}
        </div>
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </div>
  );
}