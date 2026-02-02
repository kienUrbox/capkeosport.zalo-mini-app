import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon, Button, AddMemberBottomSheet } from '@/components/ui';
import { TeamDetailSkeleton } from '@/components/ui/Skeleton';
import { AddMemberBottomSheet as PhoneInviteBottomSheet } from '@/screens/teams/add-member';
import { appRoutes } from '@/utils/navigation';
import { useMyTeams, isAdmin } from '@/stores/team.store';
import { useTeamDetail } from '@/hooks/useTeamDetail';
import { getLevelColor, LEVEL_ICON, STAT_COLORS, STAT_ICONS } from '@/constants/design';

/**
 * TeamDetail Screen
 *
 * Display team information with cover, logo, stats, and members.
 */
const TeamDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  // Use hook for team detail with caching
  const { team, isLoading, error, isRefreshing, refresh } = useTeamDetail(teamId);

  // Local UI state only
  const [showAddMemberSheet, setShowAddMemberSheet] = useState(false);
  const [showPhoneInviteSheet, setShowPhoneInviteSheet] = useState(false);

  // Pull-to-refresh state
  const [touchStart, setTouchStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart && window.scrollY === 0) {
      const distance = e.touches[0].clientY - touchStart;
      if (distance > 0) {
        // Limit pull distance to 120px
        setPullDistance(Math.min(distance, 120));
      }
    }
  };

  const handleTouchEnd = async () => {
    // Trigger refresh if pulled more than 80px
    if (pullDistance > 80) {
      await refresh();
    }
    setTouchStart(0);
    setPullDistance(0);
  };

  // Check user role in this team
  const myTeams = useMyTeams();
  const currentTeam = myTeams.find(t => t.id === teamId);
  const hasAdminPermission = isAdmin(currentTeam);

  // Rename variable to avoid conflict with function name
  const isAdminTeam = hasAdminPermission;

  // Helper function to format gender display
  const formatGender = (gender: string) => {
    if (gender === 'MALE' || gender === 'Nam') return 'Nam';
    if (gender === 'FEMALE' || gender === 'Nữ') return 'Nữ';
    return 'Mixed'; // Changed from 'Nam/Nữ' to 'Mixed'
  };

  // Helper function to get gender icon
  const getGenderIcon = (gender: string) => {
    if (gender === 'MALE' || gender === 'Nam') return 'male';
    if (gender === 'FEMALE' || gender === 'Nữ') return 'female';
    return 'wc';
  };

  if (isLoading && !isRefreshing) {
    return (
      <>
        <Header title="Chi tiết đội bóng" onBack={() => navigate(-1)} />
        <TeamDetailSkeleton />
      </>
    );
  }

  if (error || !team) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
        <Header title="Chi tiết đội bóng" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Icon name="error" className="text-4xl mb-2 text-red-500" />
            <p className="text-sm text-red-500 mb-4">{error || 'Không tìm thấy đội bóng'}</p>
            <Button variant="ghost" onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        </div>
      </div>
    );
  }

  // Get first 3 member avatars for display
  const memberAvatars = team.members?.slice(0, 3).map(m => m.user?.avatar).filter(Boolean) || [];
  const remainingCount = Math.max(0, (team.membersCount || 0) - (team.members?.length || 0));

  return (
    <div
      className={`flex flex-col min-h-screen bg-background-light dark:bg-background-dark ${isAdminTeam ? 'pb-24' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header title="Chi tiết đội bóng" onBack={() => navigate(-1)} />

      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed top-16 left-0 right-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-200"
          style={{
            opacity: Math.min(pullDistance / 80, 1),
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
          }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isRefreshing ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : pullDistance > 80 ? (
              <>
                <Icon name="refresh" className="text-primary" />
                <span>Thả để tải</span>
              </>
            ) : (
              <>
                <Icon name="arrow_downward" />
                <span>Kéo để tải</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cover & Header Info */}
      <div className="relative">
        <div className="h-40 w-full overflow-hidden">
          {team.banner ? (
            <img src={team.banner} className="w-full h-full object-cover" alt="Team Banner" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-green-600/20" />
          )}
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="size-24 rounded-full border-4 border-background-light dark:border-background-dark bg-surface-dark overflow-hidden shadow-lg">
            {team.logo ? (
              <img className="w-full h-full object-cover" src={team.logo} alt={team.name} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                {team.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center px-4">
        {/* Team name with edit icon button */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{team.name}</h1>
          {isAdminTeam && (
            <button
              onClick={() => navigate(appRoutes.teamEdit(teamId!), { state: { team } })}
              className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 active:bg-gray-200 dark:active:bg-white/20 transition-colors"
            >
              <Icon name="edit" className="text-lg text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-xs font-medium flex items-center gap-1">
            <Icon name={getGenderIcon(team.gender)} className="text-sm" /> {formatGender(team.gender)}
          </span>
          {(() => {
            const levelColor = getLevelColor(team.level);
            return (
              <span className={`px-3 py-1 rounded-full ${levelColor.bg} ${levelColor.main} text-xs font-medium flex items-center gap-1`}>
                <Icon name={LEVEL_ICON} className="text-sm" /> {team.level}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5 space-y-4 shadow-sm">
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon name="location_on" className="text-lg" /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Khu vực</p>
              <p className="text-sm font-medium">{team.location?.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
          {team.pitch && team.pitch.length > 0 && (
            <>
              <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon name="sports_soccer" className="text-lg" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Loại sân</p>
                  <p className="text-sm font-medium">{team.pitch.join(' • ')}</p>
                </div>
              </div>
            </>
          )}
          {team.description && (
            <>
              <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon name="info" className="text-lg" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Giới thiệu</p>
                  <p className="text-sm font-normal text-gray-600 dark:text-gray-300">{team.description}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      {team.stats && (team.stats.attack || team.stats.defense || team.stats.technique) && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Chỉ số đội</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {team.stats.attack !== undefined && (
              <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
                <div className={`size-10 ${STAT_COLORS.attack.bg} ${STAT_COLORS.attack.main} rounded-full flex items-center justify-center`}><Icon name={STAT_ICONS.attack} /></div>
                <span className="text-xs font-medium text-gray-500">Tấn công</span>
                <span className="font-bold text-lg">{(team.stats.attack / 10).toFixed(1)}</span>
              </div>
            )}
            {team.stats.defense !== undefined && (
              <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
                <div className={`size-10 ${STAT_COLORS.defense.bg} ${STAT_COLORS.defense.main} rounded-full flex items-center justify-center`}><Icon name={STAT_ICONS.defense} /></div>
                <span className="text-xs font-medium text-gray-500">Phòng thủ</span>
                <span className="font-bold text-lg">{(team.stats.defense / 10).toFixed(1)}</span>
              </div>
            )}
            {team.stats.technique !== undefined && (
              <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
                <div className={`size-10 ${STAT_COLORS.technique.bg} ${STAT_COLORS.technique.main} rounded-full flex items-center justify-center`}><Icon name={STAT_ICONS.technique} /></div>
                <span className="text-xs font-medium text-gray-500">Kỹ thuật</span>
                <span className="font-bold text-lg">{(team.stats.technique / 10).toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Members Summary Link */}
      <div className="px-4 mt-6 pb-32">
        <h3 className="font-bold text-lg mb-3">Thành viên ({team.membersCount || 0})</h3>
        <div
          onClick={() => teamId && navigate(appRoutes.teamMembers(teamId))}
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm active:bg-gray-50 dark:active:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {memberAvatars.map((avatar, i) => (
                <div key={i} className="size-10 rounded-full border-2 border-white dark:border-surface-dark overflow-hidden bg-gray-200">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" alt={`Member ${i + 1}`} />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <Icon name="person" className="text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="size-10 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                  +{remainingCount}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Xem tất cả</span>
              <span className="text-xs text-gray-500">Quản lý thành viên</span>
            </div>
          </div>
          <div className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
            <Icon name="arrow_forward" className="text-gray-400 text-lg" />
          </div>
        </div>
      </div>

      {/* Floating Action - Only for admins */}
      {isAdminTeam && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button
              variant="secondary"
              className="flex-1"
              icon="person_add"
              onClick={() => setShowAddMemberSheet(true)}
            >
              Thêm TV
            </Button>
            <Button variant="primary" className="flex-[1.2]" icon="sports" onClick={() => navigate(appRoutes.matchFind)}>Cáp kèo</Button>
          </div>
        </div>
      )}

      {/* Add Member Bottom Sheet - Menu */}
      <AddMemberBottomSheet
        isOpen={showAddMemberSheet}
        onClose={() => setShowAddMemberSheet(false)}
        teamId={teamId}
        onAddByPhone={() => {
          setShowAddMemberSheet(false);
          setShowPhoneInviteSheet(true);
        }}
      />

      {/* Phone Invite Bottom Sheet - Form */}
      <PhoneInviteBottomSheet
        isOpen={showPhoneInviteSheet}
        onClose={() => setShowPhoneInviteSheet(false)}
        teamId={teamId}
      />
    </div>
  );
};

export default TeamDetailScreen;
