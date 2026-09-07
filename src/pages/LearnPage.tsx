import React, { useState } from 'react';
import { Search, BookOpen, AlertCircle, PhoneCall, Sparkles } from 'lucide-react';
import { DEMO_ARTICLES } from '../data/demoData';
import { Article } from '../types';
import { PageHeader } from '../components/common/PageHeader';
import { ArticleCard } from '../components/learn/ArticleCard';
import { ArticleDetailModal } from '../components/learn/ArticleDetailModal';

const CATEGORIES = ['All', 'Newborn Care', 'Sleep Tips', 'Feeding', 'Mom Recovery', 'Development'];

export const LearnPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filteredArticles = DEMO_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="learn-screen" className="min-h-screen pb-24 max-w-md mx-auto">
      <PageHeader
        title="Learn & Guide"
        subtitle="Pediatric & Postpartum Articles"
        showBabyPill={false}
        showMamaAIButton={true}
        showWellbeingButton={true}
      />

      <main className="px-4 py-3 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search care tips, sleep, recovery..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200/80 rounded-2xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-2xs"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Maternal Health Emergency Support Banner */}
        <div className="p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 rounded-2xl flex items-start gap-3">
          <PhoneCall className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-rose-900 font-display">
              Need to talk? Free 24/7 Support
            </h2>
            <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">
              Call or text <strong>1-833-943-5746</strong> (National Maternal Mental Health Hotline). English & Spanish.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="p-8 bg-white border border-stone-200/80 rounded-2xl text-center">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-stone-700">No guides match your search</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Try searching for sleep, latch, or postpartum healing
              </p>
            </div>
          ) : (
            filteredArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                onClick={() => setActiveArticle(art)}
              />
            ))
          )}
        </div>

        {/* Medical disclaimer note */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-2 text-stone-500">
          <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            All educational content on MamaNest is for guidance and parental reference only. If your baby displays fever, lethargy, dehydration, or breathing distress, seek immediate emergency medical care.
          </p>
        </div>
      </main>

      {/* Article Detail BottomSheet */}
      <ArticleDetailModal
        article={activeArticle}
        isOpen={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
      />
    </div>
  );
};
