import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Header, Icon, Input } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * CreateTeam Screen
 *
 * Form for creating a new team with images, info, level, gender, pitch types, and stats.
 */
const CreateTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState('Trung bình');
  const [gender, setGender] = useState('Nam');
  const [pitchTypes, setPitchTypes] = useState<string[]>(['5', '7']);
  const [stats, setStats] = useState({ attack: 7, defense: 6.5, technique: 8 });

  const togglePitch = (type: string) => {
    setPitchTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const updateStat = (key: keyof typeof stats, val: number) => {
    setStats(prev => ({ ...prev, [key]: val }));
  };

  const handleCreate = () => {
    // TODO: Implement create team logic
    navigate(appRoutes.teams);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Tạo đội bóng mới" onBack={() => navigate(appRoutes.teams)} />

      <div className="p-4 flex flex-col gap-6 overflow-y-auto pb-24">

        {/* Images Section */}
        <div className="flex flex-col gap-4">
          {/* Banner Upload */}
          <div className="relative w-full h-36 rounded-xl bg-gray-100 dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/5 transition-colors group overflow-hidden">
            <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
              <Icon name="add_photo_alternate" className="text-3xl" />
              <span className="text-xs font-bold uppercase tracking-wide">Ảnh bìa (Banner)</span>
            </div>
          </div>

          {/* Logo Upload - Overlapping or separate */}
          <div className="flex items-center gap-4 px-2">
            <div className="relative size-24 rounded-full bg-gray-100 dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/5 transition-colors group shrink-0">
              <Icon name="add_a_photo" className="text-2xl text-gray-400 group-hover:text-primary transition-colors" />
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 shadow-lg border-2 border-background-light dark:border-background-dark">
                <Icon name="edit" className="text-white text-xs" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Logo đội bóng</p>
              <p className="text-xs text-gray-500">Nên dùng ảnh vuông, tối đa 5MB</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-5">
          <Input label="Tên đội bóng" placeholder="VD: FC Sài Gòn" icon="groups" />

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
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Chỉ số đội bóng (Thang 10)</label>

            {/* Attack */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-red-500">
                  <div className="p-1.5 bg-red-500/10 rounded-lg"><Icon name="flash_on" className="text-lg" /></div>
                  <span className="font-bold text-sm">Tấn công</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">{stats.attack}</span>
              </div>
              <input
                type="range" min="1" max="10" step="0.5"
                value={stats.attack}
                onChange={(e) => updateStat('attack', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Defense */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-blue-500">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg"><Icon name="shield" className="text-lg" /></div>
                  <span className="font-bold text-sm">Phòng thủ</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">{stats.defense}</span>
              </div>
              <input
                type="range" min="1" max="10" step="0.5"
                value={stats.defense}
                onChange={(e) => updateStat('defense', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Technique */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-primary">
                  <div className="p-1.5 bg-primary/10 rounded-lg"><Icon name="sports_soccer" className="text-lg" /></div>
                  <span className="font-bold text-sm">Kỹ thuật</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">{stats.technique}</span>
              </div>
              <input
                type="range" min="1" max="10" step="0.5"
                value={stats.technique}
                onChange={(e) => updateStat('technique', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <Input label="Khu vực hoạt động" placeholder="VD: Quận 7, TP.HCM" icon="location_on" />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Giới thiệu ngắn</label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
              placeholder="Mô tả về đội bóng, tiêu chí giao lưu..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur z-20">
        <Button fullWidth onClick={handleCreate}>
          TẠO ĐỘI BÓNG
        </Button>
      </div>
    </div>
  );
};

export default CreateTeamScreen;
