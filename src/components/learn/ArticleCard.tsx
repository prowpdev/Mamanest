import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div
      id={`article-card-${article.id}`}
      onClick={onClick}
      className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col group active:scale-99"
    >
      {article.imageUrl && (
        <div className="relative h-36 w-full overflow-hidden bg-stone-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-stone-800 shadow-2xs">
            {article.category}
          </span>
          {article.medicalReviewed && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white shadow-2xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Reviewed
            </span>
          )}
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium mb-1.5">
            <Clock className="w-3 h-3" />
            <span>{article.readingTimeMinutes} min read</span>
          </div>

          <h3 className="text-sm font-bold text-stone-900 font-display leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {article.shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
