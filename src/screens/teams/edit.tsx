import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Header, Icon, Input } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { TeamService } from '@/services/api/team.service';
import type { Team, UpdateTeamDto } from '@/services/api/team.service';
import {
  PITCH_TYPE_UI_VALUES,
  TEAM_LEVELS,
  formatPitchFromApi,
  formatPitchForApi,
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

  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Mới chơi');
  const [gender, setGender] = useState('Nam'); // Must be 'Nam', 'Nữ', or 'Mixed'
  const [pitchTypes, setPitchTypes] = useState<string[]>(['5', '7']);
  const [stats, setStats] = useState({ attack: 7.5, defense: 6.0, technique: 8.5 });
  const [locationAddress, setLocationAddress] = useState('');
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
        setPitchTypes(formatPitchFromApi(data.pitch || []));
        setStats({
          attack: (data.stats?.attack || 75) / 10,
          defense: (data.stats?.defense || 70) / 10,
          technique: (data.stats?.technique || 72) / 10,
        });
        setLocationAddress(data.location?.address || '');
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
          setPitchTypes(formatPitchFromApi(data.pitch || []));
          setStats({
            attack: (data.stats?.attack || 75) / 10,
            defense: (data.stats?.defense || 70) / 10,
            technique: (data.stats?.technique || 72) / 10,
          });
          setLocationAddress(data.location?.address || '');
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

      const updateData: UpdateTeamDto = {
        name,
        gender: formatGenderForApi(gender),
        level,
        pitch: formatPitchForApi(pitchTypes),
        stats: {
          attack: Math.round(stats.attack * 10),
          defense: Math.round(stats.defense * 10),
          technique: Math.round(stats.technique * 10),
        },
        description: description || undefined,
        location: team?.location ? {
          ...team.location,
          address: locationAddress,
        } : undefined,
      };

      const response = await TeamService.updateTeam(teamId, updateData);

      if (response.success) {
        navigate(appRoutes.teamDetail(teamId));
      } else {
        setError('Không thể cập nhật thông tin đội');
      }
    } catch (err: any) {
      console.error('Failed to update team:', err);
      setError(err?.message || 'Có lỗi xảy ra');
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
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Chỉnh sửa thông tin đội" onBack={() => navigate(-1)} />

      <div className="p-4 flex flex-col gap-6 overflow-y-auto pb-24">

        {/* Images Section */}
        <div className="flex flex-col gap-4">
          {/* Banner Upload */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-800 border-2 border-gray-300 dark:border-gray-600 cursor-pointer group">
            {team?.banner ? (
              <img src={team.banner} className="w-full h-full object-cover opacity-75 group-hover:opacity-50 transition-opacity" alt="Banner" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-green-600/20" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 p-2 rounded-full border border-white/20">
                <Icon name="add_photo_alternate" className="text-white text-xl" />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-4 px-2 -mt-10 relative z-10">
            <div className="relative size-24 rounded-full bg-surface-dark border-4 border-background-light dark:border-background-dark shadow-xl overflow-hidden group cursor-pointer">
              {team?.logo ? (
                <img src={team.logo} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                  {name.charAt(0)}
                </div>
              )}
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
              {TEAM_LEVELS.map((l) => (
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
              {PITCH_TYPE_UI_VALUES.map((p) => (
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

          <Input
            label="Khu vực hoạt động"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            icon="location_on"
          />

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

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-white/5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur z-20">
        {error && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <Button
          fullWidth
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}
        </Button>
      </div>
    </div>
  );
};

export default EditTeamScreen;
