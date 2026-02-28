import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Header, Icon, Input } from '@/components/ui';
import { StadiumAutocomplete } from '@/components/ui/StadiumAutocomplete';
import type {
  StadiumAutocompleteDto,
  GoongPlaceDetailDto,
  StadiumSource
} from '@/services/api/stadium.service';
import { appRoutes } from '@/utils/navigation';
import { TeamService } from '@/services/api/team.service';
import { FileService } from '@/services/api/file.service';
import type { Team, UpdateTeamDto } from '@/services/api/team.service';
import { useTeamStore } from '@/stores/team.store';
import {
  PITCH_TYPE_VALUES,
  TEAM_LEVELS,
  formatGenderFromApi,
  formatGenderForApi,
} from '@/constants/design';

// Define location state type
interface LocationState {
  team?: Team;
}

/**
 * EditTeam Screen
 *
 * Edit team information with images, info, level, gender, pitch types, and stats.
 */
const EditTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | undefined;
  const { teamId } = useParams<{ teamId: string }>();
  const fetchTeamDetail = useTeamStore((state) => state.fetchTeamDetail);

  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image uploads
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [bannerUploading, setBannerUploading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Mới chơi');
  const [gender, setGender] = useState('Nam'); // Must be 'Nam', 'Nữ', or 'Mixed'
  const [pitchTypes, setPitchTypes] = useState<string[]>(['5', '7']);
  const [stats, setStats] = useState({ attack: 7.5, defense: 6.0, technique: 8.5 });
  const [selectedStadium, setSelectedStadium] = useState<StadiumAutocompleteDto | null>(null);
  const [confirmedCoordinates, setConfirmedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [stadiumSource, setStadiumSource] = useState<StadiumSource | 'custom' | null>(null);
  const [placeDetail, setPlaceDetail] = useState<GoongPlaceDetailDto | null>(null);
  const [description, setDescription] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch team data on mount - check state first, only call API if needed
  useEffect(() => {
    const initTeamData = async () => {
      if (!teamId) return;

      // Check if team data is passed from navigation state
      if (locationState?.team) {
        const data = locationState.team;
        setTeam(data);
        setName(data.name);
        setLevel(data.level);
        setGender(formatGenderFromApi(data.gender));
        setPitchTypes(data.pitch || []);
        setStats({
          attack: (data.stats?.attack || 75) / 10,
          defense: (data.stats?.defense || 70) / 10,
          technique: (data.stats?.technique || 72) / 10,
        });
        // Load home stadium if exists
        if (data.homeStadium) {
          setSelectedStadium({
            id: data.homeStadium.id,
            name: data.homeStadium.name,
            source: 'database', // Existing stadium from database
            mapUrl: data.homeStadium.mapUrl,
            address: data.homeStadium.address,
            district: data.homeStadium.district,
            city: data.homeStadium.city,
            matchCount: data.homeStadium.matchCount || 0,
            homeTeamCount: 0,
            description: data.homeStadium.address || '',
          });
          setStadiumSource('database');
        }
        setDescription(data.description || '');
        setIsLoading(false);
        return;
      }

      // No state passed, fetch from API
      try {
        setIsLoading(true);
        const response = await TeamService.getTeamById(teamId);

        if (response.success && response.data) {
          const data = response.data;
          setTeam(data);
          setName(data.name);
          setLevel(data.level);
          setGender(formatGenderFromApi(data.gender));
          setPitchTypes(data.pitch || []);
          setStats({
            attack: (data.stats?.attack || 75) / 10,
            defense: (data.stats?.defense || 70) / 10,
            technique: (data.stats?.technique || 72) / 10,
          });
          // Load home stadium if exists
          if (data.homeStadium) {
            setSelectedStadium({
              id: data.homeStadium.id,
              name: data.homeStadium.name,
              source: 'database', // Existing stadium from database
              mapUrl: data.homeStadium.mapUrl,
              address: data.homeStadium.address,
              district: data.homeStadium.district,
              city: data.homeStadium.city,
              matchCount: data.homeStadium.matchCount || 0,
              homeTeamCount: 0,
              description: data.homeStadium.address || '',
            });
            setStadiumSource('database');
          }
          setDescription(data.description || '');
        } else {
          setError('Không thể tải thông tin đội');
        }
      } catch (err: unknown) {
        console.error('Failed to fetch team:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    initTeamData();
  }, [teamId, locationState]);

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

  const calculateAverageStats = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setStats({
        attack: 8.2,
        defense: 7.1,
        technique: 7.9,
      });
      setIsCalculating(false);
    }, 1000);
  };

  const handleSave = async () => {
    if (!teamId) return;

    try {
      setIsSaving(true);
      setError(null);

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
          stadiumData.homeStadium = {
            name: selectedStadium.name,
            mapUrl: selectedStadium.mapUrl || '',
            address: selectedStadium.address,
            district: selectedStadium.district,
            city: selectedStadium.city,
            lat: confirmedCoordinates?.lat,
            lng: confirmedCoordinates?.lng,
          };
        }
      }

      const updateData: UpdateTeamDto = {
        name,
        gender: formatGenderForApi(gender),
        level,
        pitch: pitchTypes,
        stats: {
          attack: Math.round(stats.attack * 10),
          defense: Math.round(stats.defense * 10),
          technique: Math.round(stats.technique * 10),
        },
        description: description || undefined,
        logo: logoUrl || team?.logo, // Use new uploaded URL or existing
        banner: bannerUrl || team?.banner, // Use new uploaded URL or existing
        ...stadiumData,     // Spread stadium data (homeStadiumId, goongPlaceId, homeStadium, etc.)
      };

      const response = await TeamService.updateTeam(teamId, updateData);

      if (response.success) {
        // Refresh team detail cache to get updated data
        await fetchTeamDetail(teamId, true);
        // Navigate back to previous screen
        navigate(-1);
      } else {
        setError('Không thể cập nhật thông tin đội');
      }
    } catch (err: unknown) {
      console.error('Failed to update team:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
        <Header title="Chỉnh sửa thông tin đội" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4" />
            <p className="text-sm text-gray-500">Đang tải thông tin đội...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
        <Header title="Chỉnh sửa thông tin đội" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Icon name="error" className="text-4xl mb-2 text-red-500" />
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button variant="ghost" onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="Chỉnh sửa thông tin đội" onBack={() => navigate(-1)} />

      {/* Scrollable content area */}
      <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto pb-4">

        {/* Images Section */}
        <div className="flex flex-col gap-4">
          {/* Banner Upload */}
          <div
            className="relative w-full h-36 rounded-xl bg-gray-100 dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/5 transition-colors group overflow-hidden"
            onClick={() => !isSaving && !bannerUploading && bannerInputRef.current?.click()}
          >
            {bannerPreview || team?.banner ? (
              <>
                <img src={bannerPreview || team?.banner} alt="Banner" className="w-full h-full object-cover" />
                {bannerUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin block mx-auto mb-2"></span>
                      <p className="text-white text-xs font-bold">Đang tải lên...</p>
                    </div>
                  </div>
                )}
                {(bannerUrl || team?.banner) && !bannerUploading && (
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
              disabled={isSaving || bannerUploading}
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
                onClick={() => !isSaving && !logoUploading && logoInputRef.current?.click()}
              >
                {logoPreview || team?.logo ? (
                  <>
                    <img src={logoPreview || team?.logo} alt="Logo" className="w-full h-full object-cover" />
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
              {(logoUrl || team?.logo) && !logoUploading && (
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
                disabled={isSaving || logoUploading}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon="groups"
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
                    onClick={() => setLevel(l)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-background-dark border-primary'
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
              {PITCH_TYPE_VALUES.map((p) => (
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
                  <span>{p}</span>
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

          {/* Sân nhà - Home Stadium (Optional) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">
              Sân nhà
            </label>
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
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 ml-1">
              Chọn sân nơi đội bóng thường xuyên hoạt động (Optional)
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Giới thiệu ngắn</label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
              placeholder="Mô tả về đội bóng, tiêu chí giao lưu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

        {/* Button */}
        <div className="p-4">
          <Button
            fullWidth
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamScreen;
