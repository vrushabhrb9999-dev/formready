/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BLOG_POSTS } from "../data/blog";
import { BlogPost } from "../types";
import { BookOpen, Calendar, User, Search, ArrowLeft, Clock } from "lucide-react";

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = ["All", "Government Exams", "Photo Upload Guides", "PDF Guides", "Online Form Tutorials"];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedPost) {
    return (
      <article className="max-w-3xl mx-auto py-10 px-4" id="blog-reading-view">
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-6 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides Library
        </button>

        <header className="space-y-4 mb-8">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-650 dark:text-indigo-400 rounded-full font-mono">
            {selectedPost.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> By {selectedPost.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Published {selectedPost.publishedAt}
            </span>
            <span className="flex items-center gap-1 text-indigo-500">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> {selectedPost.readTime}
            </span>
          </div>
        </header>

        {/* Structured Readable Body containing high density markup */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed space-y-6">
          {selectedPost.content.split("\n\n").map((para, idx) => {
            if (para.startsWith("###")) {
              return (
                <h3 key={idx} className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-8 mb-2 font-sans tracking-tight">
                  {para.replace("###", "").trim()}
                </h3>
              );
            }
            if (para.startsWith("-") || para.startsWith("*")) {
              return (
                <ul key={idx} className="list-disc pl-5 space-y-2 text-xs md:text-sm">
                  {para.split("\n").map((li, liIdx) => (
                    <li key={liIdx}>{li.replace(/^[-*]\s*/, "").trim()}</li>
                  ))}
                </ul>
              );
            }
            if (para.match(/^\d+\./)) {
              return (
                <ol key={idx} className="list-decimal pl-5 space-y-2 text-xs md:text-sm">
                  {para.split("\n").map((li, liIdx) => (
                    <li key={liIdx}>{li.replace(/^\d+\.\s*/, "").trim()}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="font-sans leading-relaxed text-slate-705 dark:text-slate-250">
                {para}
              </p>
            );
          })}
        </div>

        {/* Disclaimer signature for candidate safety */}
        <div className="mt-12 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            <strong>Disclosure:</strong> Requirements vary. Make sure you cross reference latest exam board declarations before hitting final submission gates on government registers.
          </p>
        </div>
      </article>
    );
  }

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto" id="blog-catalog-view">
      {/* Title */}
      <div className="text-center mb-10 max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-500" /> Guides, Spec Libraries & Articles
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Unlock standard sizes, scan strategies, contrast modifiers, and biometric alignment guides easily.
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-650"
                  : "bg-white border-slate-200 text-slate-650 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fast Search input */}
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs tracking-wide focus:outline-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Blog Posts Card layout */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-500">No guides matching your description. Check other categories!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wide rounded font-mono">
                  {post.category}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedPost(post)}>
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {post.readTime}
                </span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-450 hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Read spec guide →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
