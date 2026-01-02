import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Icon, Input } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * EditTeam Screen
 *
 * Edit team information with images, info, level, gender, pitch types, and stats.
 */
const EditTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [level, setLevel] = useState('Trung bình');
  const [gender, setGender] = useState('Nam');
  const [pitchTypes, setPitchTypes] = useState<string[]>(['5', '7']);
  const [stats, setStats] = useState({ attack: 7.5, defense: 6.0, technique: 8.5 });
  const [isCalculating, setIsCalculating] = useState(false);

  const togglePitch = (type: string) => {
    setPitchTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const updateStat = (key: keyof typeof stats, val: number) => {
    setStats(prev => ({ ...prev, [key]: val }));
  };

  const calculateAverageStats = () => {
    setIsCalculating(true);
    // Simulate API call or calculation delay
    setTimeout(() => {
      // Mock result: "Calculated" averages
      setStats({
        attack: 8.2,
        defense: 7.1,
        technique: 7.9
      });
      setIsCalculating(false);
    }, 1000);
  };

  const handleSave = () => {
    // TODO: Implement save team logic
    navigate(appRoutes.teamDetail(teamId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Chỉnh sửa thông tin đội" onBack={() => navigate(-1)} />

      <div className="p-4 flex flex-col gap-6 overflow-y-auto pb-24">

        {/* Images Section */}
        <div className="flex flex-col gap-4">
          {/* Banner Upload */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-800 border-2 border-gray-300 dark:border-gray-600 cursor-pointer group">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmyUKbWlNoXecN8CHjDjXp5IddTXSZcP54Wsk-N5ToWcDBY3c0ajCtNHeKoxBtrQxx45dG68lIuAm3RfLR-EDZ34oN-empT027zV4qSqw-KP-LP29-k5zEGdKhbfBCpmC2SjktJZQF51194CD6Z2yLba-cu9x_2ZYymXZkxBWQyV7VoXMLrmmV9Rousy5Hg6cXZBppIM_t5rA-LOgv4IAtemyaXG1M0JWiKiLojEln5-wN9zaAwCASwfWb-EYF0qmb4KW_MnwhEhOQ" className="w-full h-full object-cover opacity-75 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 p-2 rounded-full border border-white/20">
                <Icon name="add_photo_alternate" className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-4 px-2 -mt-10 relative z-10">
            <div className="relative size-24 rounded-full bg-surface-dark border-4 border-background-light dark:border-background-dark shadow-xl overflow-hidden group cursor-pointer">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="edit" className="text-white text-lg" />
              </div>
            </div>
            <div className="pt-6">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Logo đội bóng</p>
              <p className="text-xs text-gray-500">Chạm để thay đổi</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-5">
          <Input label="Tên đội bóng" defaultValue="FC Sài Gòn" icon="groups" />

          {/* Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Trình độ</label>
            <div className="grid grid-cols-2 gap-3">
              {['Vui vẻ', 'Trung bình', 'Khá', 'Bán chuyên'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    level === l
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Giới tính</label>
            <div className="flex gap-3">
              {[
                { label: 'Nam', icon: 'male' },
                { label: 'Nữ', icon: 'female' },
                { label: 'Nam/Nữ', icon: 'wc' }
              ].map((g) => (
                <button
                  key={g.label}
                  onClick={() => setGender(g.label)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    gender === g.label
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Icon name={g.icon} className="text-lg" />
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pitch Types */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Loại sân thường đá</label>
            <div className="flex gap-3">
              {['5', '7', '11'].map((p) => (
                <button
                  key={p}
                  onClick={() => togglePitch(p)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    pitchTypes.includes(p)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Icon name="sports_soccer" className="text-lg" filled={pitchTypes.includes(p)} />
                  <span>Sân {p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Stats */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Chỉ số đội bóng (Thang 10)</label>

              {/* Auto Calculate Button */}
              <button
                onClick={calculateAverageStats}
                disabled={isCalculating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 active:bg-primary/30 text-primary rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {isCalculating ? (
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Icon name="auto_awesome" className="text-xs" />
                )}
                {isCalculating ? 'Đang tính...' : 'Tính từ thành viên'}
              </button>
            </div>

            {/* Attack */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-red-500">
                  <div className="p-1.5 bg-red-500/10 rounded-lg"><Icon name="flash_on" className="text-lg" /></div>
                  <span className="font-bold text-sm">Tấn công</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white transition-all">{stats.attack}</span>
              </div>
              <input
                type="range" min="1" max="10" step="0.1"
                value={stats.attack}
                onChange={(e) => updateStat('attack', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Defense */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-blue-500">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg"><Icon name="shield" className="text-lg" /></div>
                  <span className="font-bold text-sm">Phòng thủ</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white transition-all">{stats.defense}</span>
              </div>
              <input
                type="range" min="1" max="10" step="0.1"
                value={stats.defense}
                onChange={(e) => updateStat('defense', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Technique */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-primary">
                  <div className="p-1.5 bg-primary/10 rounded-lg"><Icon name="sports_soccer" className="text-lg" /></div>
                  <span className="font-bold text-sm">Kỹ thuật</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white transition-all">{stats.technique}</span>
              </div>
              <input
                type="range" min="1" max="10" step="0.1"
                value={stats.technique}
                onChange={(e) => updateStat('technique', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <Input label="Khu vực hoạt động" defaultValue="Quận 7, TP.HCM" icon="location_on" />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Giới thiệu ngắn</label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
              placeholder="Mô tả về đội bóng, tiêu chí giao lưu..."
              defaultValue="Đội bóng văn phòng, đá vui vẻ là chính, giao lưu học hỏi, không cay cú."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur z-20">
        <Button fullWidth onClick={handleSave}>
          LƯU THAY ĐỔI
        </Button>
      </div>
    </div>
  );
};

export default EditTeamScreen;
