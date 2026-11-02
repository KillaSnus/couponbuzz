import React, { useState } from 'react';
import { AppDatabase } from '../data/types';
import { storage } from '../services/storage';
import { Send, CheckCircle2, Mail, MessageSquare } from 'lucide-react';

interface PageViewProps {
  slug: string;
  db: AppDatabase;
  navigate: (path: string) => void;
}

export const PageView: React.FC<PageViewProps> = ({ slug, db, navigate }) => {
  const page = db.pages.find(p => p.slug === slug);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">
          Return Home
        </button>
      </div>
    );
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactEmail && contactMsg) {
      storage.addSubmission({
        kind: 'contact',
        email: contactEmail.trim(),
        title: `Message from ${contactName.trim() || contactEmail}`,
        description: contactMsg.trim(),
        store: 'Contact Form',
        status: 'message'
      });
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
        <span>/</span>
        <span className="text-slate-700 font-bold">{page.title}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {page.title}
        </h1>

        <div className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4">
          {page.body}
        </div>

        {/* If Contact Page, show interactive Contact Form */}
        {slug === 'contact' && (
          <div className="mt-10 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Send us a direct message</h2>
            <p className="text-xs text-slate-500 mb-6">Our editorial and partnership desk responds within 24 hours.</p>

            {contactSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-emerald-950">Message Sent!</h3>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out. We have received your inquiry.
                </p>
                <button
                  onClick={() => setContactSent(false)}
                  className="mt-3 text-xs font-bold text-emerald-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what's on your mind or report an issue..."
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
