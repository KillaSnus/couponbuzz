import React, { useState } from 'react';
import { AppDatabase, Store } from '../data/types';
import { Search, ChevronRight, Tag } from 'lucide-react';

interface StoresViewProps {
  db: AppDatabase;
  navigate: (path: string) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({ db, navigate }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');

  const publishedStores = db.stores.filter(s => s.status === 'published');
  const filtered = publishedStores.filter(s => 
    s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.domain.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Group by first letter
  const groups: { [key: string]: Store[] } = {};
  filtered.forEach(s => {
    const firstChar = s.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  const availableLetters = Object.keys(groups).sort();
  const allAlphabet = ['ALL', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const getInitials = (name: string) => {
    return name
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('') || '?';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
          Store Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          All Stores A–Z
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl">
          Browse {publishedStores.length} verified stores alphabetically to find active promo codes, voucher codes, and saving tips.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Filter stores by name or domain..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Letter Pills */}
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {allAlphabet.map(letter => {
            const hasStores = letter === 'ALL' || groups[letter]?.length > 0;
            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                disabled={!hasStores}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                  selectedLetter === letter
                    ? 'bg-indigo-600 text-white'
                    : hasStores
                    ? 'bg-slate-100 hover:bg-indigo-50 text-slate-700'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stores List grouped by letter */}
      <div className="space-y-10">
        {availableLetters
          .filter(letter => selectedLetter === 'ALL' || selectedLetter === letter)
          .map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2 mb-4">
                <span className="text-2xl font-black text-indigo-600">{letter}</span>
                <span className="text-xs font-semibold text-slate-400">
                  ({groups[letter].length} {groups[letter].length === 1 ? 'store' : 'stores'})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groups[letter].map(store => {
                  const offerCount = db.coupons.filter(c => c.storeSlug === store.slug && c.status === 'published').length;
                  return (
                    <button
                      key={store.slug}
                      onClick={() => navigate(`/coupons/${store.slug}`)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md p-4 text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold text-sm shrink-0 transition-colors">
                          {getInitials(store.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 truncate">
                            {store.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {store.domain}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {offerCount}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another keyword or browse all categories.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
