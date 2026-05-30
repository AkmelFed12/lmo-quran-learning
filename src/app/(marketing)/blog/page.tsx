import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import posts from "@/../public/data/blog.json";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold text-center mb-8 text-slate-800 dark:text-white">
          Actualités
        </h1>
        <div className="grid gap-6">
          {posts.map((post: any) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-premium p-6 hover:border-emerald-500 transition group"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition">
                {post.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{post.excerpt}</p>
              <span className="text-emerald-600 flex items-center gap-1 text-sm font-medium">
                Lire la suite <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}