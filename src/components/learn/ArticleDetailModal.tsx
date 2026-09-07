import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Share2, Lightbulb } from 'lucide-react';
import { Article } from '../../types';
import { BottomSheet } from '../common/BottomSheet';
import { shareService } from '../../services/shareService';
import { useApp } from '../../context/AppContext';

interface ArticleDetailModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();

  if (!article) return null;

  const handleShare = async () => {
    const success = await shareService.share({
      title: article.title,
      text: `Read this helpful article on MamaNest: ${article.title}\n\n${article.shortDescription}`,
    });
    if (success) {
      showToast('Article shared!');
    } else {
      showToast('Copied to clipboard');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="max-h-[92vh]">
      <div className="space-y-4">
        {article.imageUrl && (
          <div className="relative h-44 -mx-5 -mt-4 mb-3 overflow-hidden bg-stone-100">
            <img
              src={article.imageUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-xs text-stone-800 shadow-2xs">
              {article.category}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min read
            </span>
            {article.medicalReviewed && (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Pediatric Reviewed
              </span>
            )}
          </div>

          <button
            id="share-article-btn"
            onClick={handleShare}
            className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            title="Share article"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-stone-900 font-display leading-snug">
          {article.title}
        </h2>

        {/* Content Paragraphs */}
        <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
          {article.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Actionable Tips Box */}
        {article.tips?.length > 0 && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 font-display">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Practical Tips for Mom</span>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {article.tips.map((t, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medical disclaimer */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-2.5 text-stone-500">
          <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            This educational content is for informational purposes and does not constitute medical advice. If you suspect an emergency or serious postpartum health concern, contact your healthcare provider or call emergency services immediately.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
};
