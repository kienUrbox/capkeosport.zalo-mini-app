import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, Input, Button } from '@/components/ui';
import { useUser, useAuthActions } from '@/stores/auth.store';
import { useFileActions } from '@/stores/file.store';
import type { FileEntity } from '@/types/api.types';
import { STAT_COLORS, STAT_ICONS } from '@/constants/design';

/**
 * EditProfile Screen
 *
 * Edit user profile with avatar/banner upload, form fields, and skill stats.
 */
const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const { updateProfile } = useAuthActions();
  const { uploadUserAvatar, uploadUserBanner } = useFileActions();

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    position: 'Tiền vệ',
    jerseyNumber: '',
    bio: '',
  });

  const [stats, setStats] = useState({ attack: 7.5, defense: 7.0, technique: 7.5 });
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload states
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(null);
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string | null>(null);

  // Load current user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        position: user.position || 'Tiền vệ',
        jerseyNumber: user.jerseyNumber?.toString() || '',
        bio: user.bio || '',
      });

      // Load stats if available - divide by 10 because DB stores max 100, UI shows max 10
      if (user.playerStats) {
        setStats({
          attack: user.playerStats.attack / 10,
          defense: user.playerStats.defense / 10,
          technique: user.playerStats.technique / 10,
        });
      }

      // Set initial avatar and banner URLs
      setUploadedAvatarUrl(user.avatar || null);
      setUploadedBannerUrl(user.banner || null);
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateStat = (key: keyof typeof stats, val: number) => {
    setStats((prev) => ({ ...prev, [key]: val }));
  };

  // Validate file before upload
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Chỉ chấp nhận file hình ảnh' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'Kích thước file không được vượt quá 5MB' };
    }

    return { valid: true };
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'File không hợp lệ');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setAvatarUploadProgress(0);
      setError(null);

      const result = await uploadUserAvatar(file, (progress) => {
        setAvatarUploadProgress(progress);
      });

      if (result.publicUrl) {
        setUploadedAvatarUrl(result.publicUrl);
      }
    } catch (err: any) {
      const errorMessage = err.error?.message || err.message || 'Không thể tải lên ảnh đại diện';
      setError(errorMessage);
    } finally {
      setIsUploadingAvatar(false);
      setAvatarUploadProgress(0);
      // Reset input
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
    }
  };

  // Handle banner upload
  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'File không hợp lệ');
      return;
    }

    try {
      setIsUploadingBanner(true);
      setBannerUploadProgress(0);
      setError(null);

      const result = await uploadUserBanner(file, (progress) => {
        setBannerUploadProgress(progress);
      });

      if (result.publicUrl) {
        setUploadedBannerUrl(result.publicUrl);
      }
    } catch (err: any) {
      const errorMessage = err.error?.message || err.message || 'Không thể tải lên ảnh bìa';
      setError(errorMessage);
    } finally {
      setIsUploadingBanner(false);
      setBannerUploadProgress(0);
      // Reset input
      if (bannerInputRef.current) {
        bannerInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      setError('Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call updateProfile from auth.store
      // Multiply stats by 10 because DB stores max 100, UI shows max 10
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
        jerseyNumber: formData.jerseyNumber ? parseInt(formData.jerseyNumber) : undefined,
        bio: formData.bio,
        avatar: uploadedAvatarUrl || undefined,
        banner: uploadedBannerUrl || undefined,
        playerStats: {
          attack: stats.attack * 10,
          defense: stats.defense * 10,
          technique: stats.technique * 10,
        },
      });

      // Navigate back on success
      navigate(-1);
    } catch (err: unknown) {
      console.error('Failed to update profile:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Chỉnh sửa hồ sơ" onBack={() => navigate(-1)} />

      {error && (
        <div className="mx-4 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Banner Upload */}
        <div className="relative group cursor-pointer -mx-4 -mt-4" onClick={handleBannerClick}>
          <div className="h-64 overflow-hidden bg-gradient-to-r from-primary to-green-600 relative">
            {uploadedBannerUrl ? (
              <>
                <img
                  src={uploadedBannerUrl}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="text-white text-center">
                    <Icon name="camera_alt" className="text-3xl mx-auto mb-1" />
                    <p className="text-sm font-medium">Thay đổi ảnh bìa</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/50 to-green-600/50">
                <div className="text-white text-center">
                  <Icon name="add_photo_alternate" className="text-4xl mx-auto mb-2" />
                  <p className="text-sm font-medium">Thêm ảnh bìa</p>
                </div>
              </div>
            )}

            {/* Upload progress */}
            {isUploadingBanner && bannerUploadProgress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${bannerUploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Upload icon overlay */}
          {!isUploadingBanner && (
            <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-surface-dark/90 text-primary p-2 rounded-full shadow-lg">
              <Icon name="edit" className="text-lg" />
            </div>
          )}
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center -mt-16 mb-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden bg-gray-200 dark:bg-white/5">
              {uploadedAvatarUrl ? (
                <img
                  src={uploadedAvatarUrl}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  alt={user.name}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-3xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <Icon name="camera_alt" className="text-white text-3xl" />
              </div>

              {/* Upload progress */}
              {isUploadingAvatar && avatarUploadProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${avatarUploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Upload icon */}
            {!isUploadingAvatar && (
              <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm">
                <Icon name="edit" className="text-sm" />
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-primary font-bold cursor-pointer" onClick={handleAvatarClick}>
            Thay đổi ảnh đại diện
          </p>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="hidden"
        />

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-4 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <Input
              label="Họ và tên"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              icon="person"
            />
            <Input
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              icon="phone"
              type="tel"
            />

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
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
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

            <Input
              label="Số áo yêu thích"
              value={formData.jerseyNumber}
              onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
              icon="tag"
              type="number"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">
              Giới thiệu bản thân
            </label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none shadow-sm"
              placeholder="Giới thiệu về phong cách đá, kinh nghiệm..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
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
                    <div className={`flex items-center gap-2 ${STAT_COLORS.attack.main} font-bold text-sm`}>
                      <Icon name={STAT_ICONS.attack} className="text-sm" /> Tấn công
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
                    className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer ${STAT_COLORS.attack.accent}`}
                  />
                </div>

                {/* Defense */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className={`flex items-center gap-2 ${STAT_COLORS.defense.main} font-bold text-sm`}>
                      <Icon name={STAT_ICONS.defense} className="text-sm" /> Phòng thủ
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
                    className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer ${STAT_COLORS.defense.accent}`}
                  />
                </div>

                {/* Technique */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className={`flex items-center gap-2 ${STAT_COLORS.technique.main} font-bold text-sm`}>
                      <Icon name={STAT_ICONS.technique} className="text-sm" /> Kỹ thuật
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
                    className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer ${STAT_COLORS.technique.accent}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur border-t border-gray-200 dark:border-white/5">
        <Button fullWidth onClick={handleSave} disabled={isLoading || isUploadingAvatar || isUploadingBanner}>
          {isLoading ? 'ĐANG LƯU...' : isUploadingAvatar || isUploadingBanner ? 'ĐANG TẢI LÊN...' : 'LƯU THAY ĐỔI'}
        </Button>
      </div>
    </div>
  );
};

export default EditProfileScreen;
