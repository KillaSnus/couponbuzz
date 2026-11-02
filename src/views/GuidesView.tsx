import React from 'react';
import { AppDatabase } from '../data/types';
import { BookOpen, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';

interface GuidesViewProps {
  slug?: string;
  db: AppDatabase;
  navigate: (path: string) => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({
  slug,
  db,
  navigate
}) => {
  const publishedPosts = db.posts.filter(p => p.status === 'published');

  // If specific post slug
  if (slug) {
    const post = publishedPosts.find(p => p.slug === slug);
    if (!post) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">Guide Not Found</h1>
          <button onClick={() => navigate('/guides/')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">
            All Guides
          </button>
        </div>
      );
    }

    const relatedPosts = publishedPosts.filter(p => p.slug !== post.slug).slice(0, 2);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <button
          onClick={() => navigate('/guides/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all guides
        </button>

        <article className="space-y-6">
          <header className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              {post.excerpt}
            </p>
          </header>

          {post.image && (
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="w-full h-80 sm:h-96 object-cover rounded-3xl shadow-lg border border-slate-200"
            />
          )}

          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs text-slate-800 leading-relaxed space-y-4 text-base whitespace-pre-line">
            {post.body}
          </div>
        </article>

        {/* Related guides */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">More Saving Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(rel => (
                <div
                  key={rel.slug}
                  onClick={() => navigate(`/guides/${rel.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="text-xs text-slate-400 mb-1">{rel.date}</div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {rel.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // All Guides List
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Saving Guides & Shopping Advice
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Tested tips from our editorial team to help you save on clothes, electronics, software, and travel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedPosts.map(post => (
          <div
            key={post.slug}
            onClick={() => navigate(`/guides/${post.slug}`)}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-52 bg-indigo-50 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-indigo-300" />
                </div>
              )}
              <div className="p-6">
                <div className="text-xs text-slate-400 font-semibold mb-2">
                  {post.date} • By {post.author}
                </div>
                <h3 className="font-bold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
              <span>Read complete guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
