import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, Input, Button } from '@/components/ui';

/**
 * EditProfile Screen
 *
 * Edit user profile with avatar upload, form fields, and skill stats.
 */
const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState('Tiền vệ');
  const [stats, setStats] = useState({ attack: 8.5, defense: 6.0, technique: 9.0 });
  const [isEditingStats, setIsEditingStats] = useState(false);

  const updateStat = (key: keyof typeof stats, val: number) => {
    setStats((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Chỉnh sửa hồ sơ" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="size-32 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden bg-gray-200 dark:bg-white/5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcZGCgosiZhitSLhxeXNSiZQtDcPB3OM3HOGwTPBVAKaNYIyYAO2AV7PfhJi3SQ0lDg3HuSHtt4LSvGU-krS5yrGyODyEGFUzWY4zJBhboEmEJkKGjNFsAiBkQEEcTQRK87uPMXNdAJ7fAZkYCX5KYjr1Ud6Mr09lydz1UPjarDbEg16DkNVAqKA-uCgEOvwgepT1Uy6FrBwB0a_RYF0hq47bG4Fzxr0yFXC3qMp7XOgWuy_S6ilPS3AJFyWW1bIJrx0ib9fHrAbuK"
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="camera_alt" className="text-white text-3xl" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm">
              <Icon name="edit" className="text-sm" />
            </div>
          </div>
          <p className="mt-3 text-sm text-primary font-bold cursor-pointer">
            Thay đổi ảnh đại diện
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-4 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <Input label="Họ và tên" defaultValue="Minh Nguyễn" icon="person" />
            <Input label="Số điện thoại" defaultValue="0912 345 678" icon="phone" type="tel" />

            {/* Custom Select for Position */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">
                Vị trí sở trường
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <Icon name="sports_soccer" />
                </div>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl h-12 pl-12 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                >
                  <option>Thủ môn</option>
                  <option>Hậu vệ</option>
                  <option>Tiền vệ</option>
                  <option>Tiền đạo</option>
                </select>
                <div className="absolute right-4 text-gray-400 pointer-events-none">
                  <Icon name="expand_more" />
                </div>
              </div>
            </div>

            <Input label="Số áo yêu thích" defaultValue="10" icon="tag" type="number" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">
              Giới thiệu bản thân
            </label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none shadow-sm"
              placeholder="Giới thiệu về phong cách đá, kinh nghiệm..."
              defaultValue="Đá vui vẻ, giao lưu là chính. Có thể đá tốt 2 chân."
            ></textarea>
          </div>

          {/* Stats Editing Section */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
            <button
              onClick={() => setIsEditingStats(!isEditingStats)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <div className="p-1 bg-primary/10 rounded-md text-primary">
                  <Icon name="bar_chart" className="text-lg" />
                </div>
                <span>Chỉ số kỹ năng (Tự đánh giá)</span>
              </div>
              <Icon name={isEditingStats ? 'expand_less' : 'expand_more'} className="text-gray-400" />
            </button>

            {isEditingStats && (
              <div className="p-4 space-y-4 border-t border-gray-100 dark:border-white/5 animate-fade-in">
                {/* Attack */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                      <Icon name="flash_on" className="text-sm" /> Tấn công
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.attack}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={stats.attack}
                    onChange={(e) => updateStat('attack', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* Defense */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                      <Icon name="shield" className="text-sm" /> Phòng thủ
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.defense}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={stats.defense}
                    onChange={(e) => updateStat('defense', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Technique */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Icon name="sports_soccer" className="text-sm" /> Kỹ thuật
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.technique}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={stats.technique}
                    onChange={(e) => updateStat('technique', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur border-t border-gray-200 dark:border-white/5">
        <Button fullWidth onClick={() => navigate(-1)}>
          LƯU THAY ĐỔI
        </Button>
      </div>
    </div>
  );
};

export default EditProfileScreen;
