import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Header, Icon, Input, StadiumLocationPermissionModal } from '@/components/ui';
import { StadiumAutocomplete } from '@/components/ui/StadiumAutocomplete';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useTeamActions } from '@/stores/team.store';
import type {
  StadiumAutocompleteDto,
  GoongPlaceDetailDto,
  StadiumSource
} from '@/services/api/stadium.service';
import type { CreateTeamDto } from '@/types/api.types';
import { appRoutes } from '@/utils/navigation';
import { FileService } from '@/services/api/file.service';
import {
  PITCH_TYPE_VALUES,
  TEAM_LEVELS,
  formatGenderForApi,
  getLevelColor,
} from '@/constants/design';

/**
 * CreateTeam Screen
 *
 * Flow: Create team → Upload logo → Upload banner → Update team with URLs
 */
const CreateTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const teamActions = useTeamActions();

  // Location permission for stadium search
  const {
    showPermissionModal: showLocationPermission,
    getLocation,
    handlePermissionResponse: handleLocationPermissionResponse,
  } = useLocationPermission({
    storageKey: 'create_team_location_permission',
    showExplanation: true,
  });

  // Request location on mount
  useEffect(() => {
    getLocation().catch(() => {
      // Silently fail - user can still search manually
    });
  }, []);

  // Form state
  const [teamName, setTeamName] = useState('');
  const [level, setLevel] = useState('Mới chơi');
  const [gender, setGender] = useState('Nam');
  const [pitchTypes, setPitchTypes] = useState<string[]>(['Sân 5']);
  const [stats, setStats] = useState({ attack: 7, defense: 6.5, technique: 8 });
  const [selectedStadium, setSelectedStadium] = useState<StadiumAutocompleteDto | null>(null);
  const [confirmedCoordinates, setConfirmedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [stadiumSource, setStadiumSource] = useState<StadiumSource | 'custom' | null>(null);
  const [placeDetail, setPlaceDetail] = useState<GoongPlaceDetailDto | null>(null);
  const [description, setDescription] = useState('');

  // Image uploads
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [bannerUploading, setBannerUploading] = useState(false);

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const togglePitch = (type: string) => {
    setPitchTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const updateStat = (key: keyof typeof stats, val: number) => {
    setStats(prev => ({ ...prev, [key]: val }));
  };

  // Handle logo file selection
  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Logo phải là file ảnh (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo không được vượt quá 5MB');
        return;
      }

      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload immediately
      setLogoUploading(true);
      try {
        const response = await FileService.uploadFile(
          {
            file,
            fileType: 'logo',
          },
          (progress: number) => {
            console.log(`Logo upload progress: ${progress}%`);
          }
        );

        if (response.success && response.data) {
          setLogoUrl(response.data.publicUrl);
          console.log('Logo uploaded successfully:', response.data.publicUrl);
        } else {
          setError('Không thể tải lên logo. Vui lòng thử lại.');
        }
      } catch (err) {
        console.error('Logo upload error:', err);
        setError('Không thể tải lên logo. Vui lòng thử lại.');
      } finally {
        setLogoUploading(false);
      }
    }
  };

  // Handle banner file selection
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Banner phải là file ảnh (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Banner không được vượt quá 5MB');
        return;
      }

      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload immediately
      setBannerUploading(true);
      try {
        const response = await FileService.uploadFile(
          {
            file,
            fileType: 'banner',
          },
          (progress: number) => {
            console.log(`Banner upload progress: ${progress}%`);
          }
        );

        if (response.success && response.data) {
          setBannerUrl(response.data.publicUrl);
          console.log('Banner uploaded successfully:', response.data.publicUrl);
        } else {
          setError('Không thể tải lên ảnh bìa. Vui lòng thử lại.');
        }
      } catch (err) {
        console.error('Banner upload error:', err);
        setError('Không thể tải lên ảnh bìa. Vui lòng thử lại.');
      } finally {
        setBannerUploading(false);
      }
    }
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!teamName.trim()) return 'Vui lòng nhập tên đội bóng';
    if (teamName.length < 3 || teamName.length > 100) {
      return 'Tên đội bóng phải từ 3-100 ký tự';
    }
    if (!selectedStadium) {
      return 'Vui lòng chọn sân nhà để các đội bóng khác có thể tìm đến bạn';
    }
    return null;
  };

  // Handle create team with proper flow
  const handleCreate = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if still uploading images
    if (logoUploading || bannerUploading) {
      setError('Vui lòng đợi tải lên ảnh hoàn tất.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadStatus('Đang tạo đội bóng...');

    try {
      const apiStats = {
        attack: Math.round(stats.attack * 10),
        defense: Math.round(stats.defense * 10),
        technique: Math.round(stats.technique * 10),
      };

      // Prepare home stadium data based on source
      let stadiumData: any = {};

      if (selectedStadium) {
        if (stadiumSource === 'database' && !selectedStadium.id.startsWith('goong_') && !selectedStadium.id.startsWith('custom-')) {
          // Option A: Database stadium with ID
          stadiumData.homeStadiumId = selectedStadium.id;
          // If user re-confirmed location, send the updated coordinates
          if (confirmedCoordinates?.lat && confirmedCoordinates?.lng) {
            stadiumData.confirmedLat = confirmedCoordinates.lat;
            stadiumData.confirmedLng = confirmedCoordinates.lng;
          }
        } else if (stadiumSource === 'goong_places') {
          // Option B: Goong Place
          stadiumData.goongPlaceId = selectedStadium.placeId;
          stadiumData.stadiumName = placeDetail?.name || selectedStadium.name;
          stadiumData.confirmedLat = confirmedCoordinates?.lat;
          stadiumData.confirmedLng = confirmedCoordinates?.lng;
          stadiumData.stadiumAddress = placeDetail?.formattedAddress || selectedStadium.address;
          stadiumData.stadiumDistrict = placeDetail?.district || selectedStadium.district;
          stadiumData.stadiumCity = placeDetail?.city || selectedStadium.city;
        } else {
          // Option C: Custom stadium (backward compatible)
          const mapUrl =
            confirmedCoordinates?.lat && confirmedCoordinates?.lng
              ? `https://www.google.com/maps?q=${confirmedCoordinates.lat},${confirmedCoordinates.lng}`
              : '';

          stadiumData.homeStadium = {
            name: selectedStadium.name,
            mapUrl,
            address: selectedStadium.address,
            district: selectedStadium.district,
            city: selectedStadium.city,
            lat: confirmedCoordinates?.lat,
            lng: confirmedCoordinates?.lng,
          };
        }
      }

      const teamData: CreateTeamDto = {
        name: teamName.trim(),
        gender: formatGenderForApi(gender),
        level: level,
        // Don't send location - backend will get it from stadium
        ...stadiumData,     // Spread stadium data (homeStadiumId, goongPlaceId, homeStadium, etc.)
        stats: apiStats,
        pitch: pitchTypes.length > 0 ? pitchTypes : undefined,
        description: description.trim() || undefined,
        logo: logoUrl,
        banner: bannerUrl,
      };

      // Create team using store (automatically adds to myTeams)
      await teamActions.createTeam(teamData);

      setUploadProgress(100);
      setUploadStatus('Hoàn tất!');

      // Refresh my teams list from server to ensure data is up-to-date
      await teamActions.fetchMyTeams(true);

      // Navigate back to previous screen
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err: any) {
      console.error('Create team error:', err);
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      setUploadProgress(0);
      setUploadStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="Tạo đội bóng mới" onBack={() => navigate(appRoutes.teams)} />

      {/* Error message */}
      {/* Scrollable content area */}
      <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto pb-4">

        {/* Images Section */}
        <div className="flex flex-col gap-4">
          {/* Banner Upload */}
          <div
            className="relative w-full h-36 rounded-xl bg-gray-100 dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/5 transition-colors group overflow-hidden"
            onClick={() => !isLoading && !bannerUploading && bannerInputRef.current?.click()}
          >
            {bannerPreview ? (
              <>
                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                {bannerUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin block mx-auto mb-2"></span>
                      <p className="text-white text-xs font-bold">Đang tải lên...</p>
                    </div>
                  </div>
                )}
                {bannerUrl && !bannerUploading && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg flex items-center justify-center">
                    <span className="material-icons text-white select-none leading-none" style={{ fontSize: '14px' }}>
                      check
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                <Icon name="add_photo_alternate" className="text-3xl" />
                <span className="text-xs font-bold uppercase tracking-wide">Ảnh bìa (Banner)</span>
              </div>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleBannerSelect}
              disabled={isLoading || bannerUploading}
            />
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-4 px-2">
            <div
              className="relative size-24 shrink-0"
            >
              {/* Logo container */}
              <div
                className="relative w-full h-full rounded-full bg-gray-100 dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden"
                onClick={() => !isLoading && !logoUploading && logoInputRef.current?.click()}
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    {logoUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
                      </div>
                    )}
                  </>
                ) : (
                  <Icon name="add_a_photo" className="text-2xl text-gray-400" />
                )}
              </div>

              {/* Edit button - positioned at bottom right, slightly outside */}
              {!logoUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    logoInputRef.current?.click();
                  }}
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark rounded-full p-1.5 shadow-lg border-2 border-background-light dark:border-background-dark transition-all z-10 flex items-center justify-center"
                  aria-label="Thay đổi logo"
                  type="button"
                >
                  <span className="material-icons text-white select-none leading-none" style={{ fontSize: '14px' }}>
                    edit
                  </span>
                </button>
              )}

              {/* Upload success indicator - positioned at top right */}
              {logoUrl && !logoUploading && (
                <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1 shadow-lg z-10 flex items-center justify-center" aria-hidden="true">
                  <span className="material-icons text-white select-none leading-none" style={{ fontSize: '12px' }}>
                    check
                  </span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleLogoSelect}
                disabled={isLoading || logoUploading}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Logo đội bóng</p>
              <p className="text-xs text-gray-500">
                {logoUploading ? 'Đang tải lên...' : 'Nên dùng ảnh vuông, tối đa 5MB'}
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-5">
          <Input
            label="Tên đội bóng"
            placeholder="VD: FC Sài Gòn"
            icon="groups"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={isLoading}
          />

          {/* Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Trình độ</label>
            <div className="grid grid-cols-2 gap-3">
              {TEAM_LEVELS.map((l) => {
                const isSelected = level === l;
                return (
                  <button
                    key={l}
                    onClick={() => !isLoading && setLevel(l)}
                    disabled={isLoading}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Giới tính</label>
            <div className="flex gap-3">
              {[
                { label: 'Nam', icon: 'male' },
                { label: 'Nữ', icon: 'female' },
                { label: 'Mixed', icon: 'wc' }
              ].map((g) => (
                <button
                  key={g.label}
                  onClick={() => !isLoading && setGender(g.label)}
                  disabled={isLoading}
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
              {PITCH_TYPE_VALUES.map((p) => (
                <button
                  key={p}
                  onClick={() => !isLoading && togglePitch(p)}
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    pitchTypes.includes(p)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Icon name="sports_soccer" className="text-lg" filled={pitchTypes.includes(p)} />
                  <span>{p}</span>
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Sân nhà - Home Stadium */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-1">
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                Sân nhà <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Info box explaining the purpose */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-1">
              <div className="flex items-start gap-2">
                <Icon name="info" className="text-blue-500 text-lg mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">
                    Để các đội bóng khác có thể tìm đến bạn
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                    Chọn sân nơi đội bóng thường xuyên hoạt động để các đội khác trong khu vực dễ dàng tìm thấy và gửi lời mời giao lưu.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed mt-1">
                    💡 <span className="font-medium">Chưa có sân nhà?</span> Hãy tìm và chọn 1 sân trong khu vực của bạn!
                  </p>
                </div>
              </div>
            </div>

            <StadiumAutocomplete
              value={selectedStadium}
              onChange={(stadium, coordinates, detail) => {
                setSelectedStadium(stadium);
                setStadiumSource(stadium?.source || 'custom');
                setPlaceDetail(detail || null);
                if (coordinates) {
                  setConfirmedCoordinates(coordinates);
                }
              }}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Giới thiệu ngắn</label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none disabled:opacity-50"
              placeholder="Mô tả về đội bóng, tiêu chí giao lưu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar with status messages and button */}
      <div className="mt-auto border-t border-gray-200 dark:border-white/5 bg-background-light dark:bg-background-dark pb-safe z-20">
        {/* Error message */}
        {error && (
          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Upload status */}
        {isLoading && uploadStatus && (
          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{uploadStatus}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Button */}
        <div className="p-4">
          <Button fullWidth onClick={handleCreate} disabled={isLoading}>
            {isLoading ? 'ĐANG TẠO...' : 'TẠO ĐỘI BÓNG'}
          </Button>
        </div>
      </div>

      {/* Location Permission Modal */}
      <StadiumLocationPermissionModal
        isOpen={showLocationPermission}
        onAllow={() => handleLocationPermissionResponse(true)}
        onDeny={() => handleLocationPermissionResponse(false)}
      />
    </div>
  );
};

export default CreateTeamScreen;
