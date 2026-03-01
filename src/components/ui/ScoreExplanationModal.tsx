import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui';

export type ScoreType = 'quality' | 'activity' | 'compatibility';

export type ScoreExplanationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scoreType: ScoreType;
  scoreValue: number;
};

const SCORE_CONFIG = {
  quality: {
    title: 'Điểm chất lượng đội',
    icon: 'verified',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'Đánh giá độ hoàn thiện profile của đội bóng. Đội có profile đầy đủ sẽ dễ dàng được các đội khác tin tưởng hơn.',
    factors: [
      { icon: 'badge', title: 'Tên đội', desc: 'Có tên đội ≥ 3 ký tự' },
      { icon: 'image', title: 'Logo', desc: 'Có logo đội' },
      { icon: 'bar_chart', title: 'Trình độ', desc: 'Đã khai báo level' },
      { icon: 'place', title: 'Vị trí', desc: 'Có địa chỉ sân nhà' },
      { icon: 'emoji_events', title: 'Sức mạnh', desc: 'Có stats (Tấn công, Phòng thủ, Kỹ thuật)' },
      { icon: 'description', title: 'Giới thiệu', desc: 'Có mô tả ≥ 10 ký tự' },
      { icon: 'groups', title: 'Thành viên', desc: 'Đội có ≥ 5 thành viên' },
    ],
    color: 'primary',
  },
  activity: {
    title: 'Điểm hoạt động',
    icon: 'whatshot',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Mức độ hoạt động của đội dựa trên thời gian cập nhật thông tin gần đây.',
    factors: [
      { icon: 'flash_on', title: 'Rất hoạt động', desc: 'Cập nhật trong 7 ngày gần nhất' },
      { icon: 'trending_up', title: 'Hoạt động', desc: 'Cập nhật trong 14 ngày gần nhất' },
      { icon: 'schedule', title: 'Trung bình', desc: 'Cập nhật trong 30 ngày gần nhất' },
      { icon: 'hourglass_empty', title: 'Ít hoạt động', desc: 'Cập nhật trong 90 ngày gần nhất' },
    ],
    color: 'orange',
  },
  compatibility: {
    title: 'Điểm tương thích',
    icon: 'favorite',
    iconColor: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    description: 'Mức độ phù hợp giữa đội của bạn và đội đối thủ dựa trên các tiêu chí quan trọng.',
    factors: [
      { icon: 'bar_chart', title: 'Trình độ', desc: 'Cùng level càng cao điểm' },
      { icon: 'wc', title: 'Giới tính', desc: 'Khớp yêu cầu giới tính' },
      { icon: 'insights', title: 'Sức mạnh', desc: 'Stats tương đồng' },
      { icon: 'sports_soccer', title: 'Loại sân', desc: 'Cùng loại sân yêu thích' },
      { icon: 'location_on', title: 'Khoảng cách', desc: 'Cùng khu vực/quận' },
    ],
    color: 'pink',
  },
};

const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({
  isOpen,
  onClose,
  scoreType,
  scoreValue,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [mountedItems, setMountedItems] = useState<number[]>([]);
  const config = SCORE_CONFIG[scoreType];

  // Animate score counting and mount items
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      // Animate score
      let current = 0;
      const increment = scoreValue / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= scoreValue) {
          setScore(scoreValue);
          clearInterval(timer);
        } else {
          setScore(Math.floor(current));
        }
      }, 30);

      // Animate items mounting
      const items = config.factors.map((_, i) => i);
      items.forEach((itemIndex, i) => {
        setTimeout(() => {
          setMountedItems(prev => [...prev, itemIndex]);
        }, i * 100);
      });

      return () => {
        clearInterval(timer);
        setMountedItems([]);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, scoreValue, config.factors]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get score color
  const getScoreColor = () => {
    if (scoreValue >= 80) return 'text-green-500';
    if (scoreValue >= 60) return 'text-amber-500';
    return 'text-gray-500';
  };

  const getScoreBgColor = () => {
    if (scoreValue >= 80) return 'bg-green-500';
    if (scoreValue >= 60) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe transform transition-all duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div
          className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          onClick={onClose}
        />

        {/* Header with Score Circle */}
        <div className="flex items-center gap-4 mb-6">
          {/* Animated Score Circle */}
          <div className="relative w-24 h-24 shrink-0">
            {/* Outer glow effect */}
            <div className={`absolute inset-0 rounded-full ${getScoreBgColor()} opacity-10 animate-ping`} style={{ animationDuration: '2s' }} />

            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${getScoreColor()}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor()}`}>
                {score}
              </span>
            </div>
          </div>

          {/* Title & Icon */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center animate-bounce`} style={{ animationDuration: '1s' }}>
                <Icon name={config.icon as any} className={config.iconColor} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {config.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        {/* Score Level Badge */}
        <div className="mb-4 flex items-center justify-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            scoreValue >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
            scoreValue >= 60 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
          }`}>
            <Icon name={scoreValue >= 80 ? 'star' : scoreValue >= 60 ? 'trending_up' : 'info'} className="text-sm" />
            <span className="text-xs font-bold uppercase">
              {scoreValue >= 80 ? 'Xuất sắc' : scoreValue >= 60 ? 'Khá tốt' : 'Cần cải thiện'}
            </span>
          </div>
        </div>

        {/* Factors List */}
        <div className="mb-4 max-h-[40vh] overflow-y-auto overscroll-contain no-scrollbar rounded-xl">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <Icon name="checklist" className="text-text-secondary text-sm" />
            Tiêu chí đánh giá
          </h4>

          {scoreType === 'compatibility' && (
            <div className="mb-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white">Tiêu chí:</span> Cùng trình độ, Khớp giới tính, Sức mạnh tương đồng, Loại sân phù hợp, Cùng khu vực
              </p>
            </div>
          )}

          <div className="space-y-2 px-1">
            {config.factors.map((factor, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:scale-[1.01] transition-all duration-200 ${
                  mountedItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transition: 'all 0.3s ease' }}
              >
                <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon name={factor.icon as any} className={config.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">
                    {factor.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {factor.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip Box */}
        <div className="relative overflow-hidden rounded-2xl p-4 mb-4 bg-gradient-to-r from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 animate-pulse">
              <Icon name="lightbulb" className="text-white text-sm" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Mẹo tìm kèo tốt
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {scoreType === 'quality' && 'Đội có điểm chất lượng cao thường là đối thủ uy tín, hãy cân nhắc khi quyết định.'}
                {scoreType === 'activity' && 'Đội hoạt động gần đây sẽ phản hồi nhanh và dễ dàng sắp xếp lịch đấu.'}
                {scoreType === 'compatibility' && 'Điểm tương thích càng cao thì hai đội càng phù hợp, trận đấu sẽ thú vị hơn.'}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors active:scale-[0.98] border border-gray-200 dark:border-white/10"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
};

export default ScoreExplanationModal;
