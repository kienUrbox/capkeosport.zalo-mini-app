import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon, Button, EmptyState, ErrorState } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { TeamService } from '@/services/api/team.service';
import { useMyTeams } from '@/stores/team.store';
import type { TeamMember } from '@/services/api/team.service';

/**
 * TeamMembers Screen
 *
 * List of team members with admin management actions.
 * Floating "Thêm thành viên" button opens bottom sheet with 2 options:
 * - Add by phone
 * - Share link
 */
const TeamMembersScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddMethodSheet, setShowAddMethodSheet] = useState(false);

  // Check user role in this team
  const myTeams = useMyTeams();
  const currentTeam = myTeams.find(t => t.id === teamId);
  const isCurrentUserAdmin = currentTeam?.userRole === 'admin' || currentTeam?.userRole === 'captain';

  useEffect(() => {
    const fetchMembers = async () => {
      if (!teamId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await TeamService.getTeamMembers(teamId);

        if (response.success && response.data) {
          setMembers(response.data);
        } else {
          setError('Không thể tải danh sách thành viên');
        }
      } catch (err: unknown) {
        console.error('Failed to fetch team members:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  const openActionSheet = (e: React.MouseEvent, member: TeamMember) => {
    e.stopPropagation();
    setSelectedMember(member);
    setShowActionSheet(true);
  };

  const closeActionSheet = () => {
    setShowActionSheet(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  const handleDeleteMember = async () => {
    if (!selectedMember || !teamId) return;

    try {
      const response = await TeamService.removeMember(teamId, selectedMember.id);
      if (response.success) {
        setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
        closeActionSheet();
      } else {
        alert('Không thể xóa thành viên');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getRoleLabel = (member: TeamMember) => {
    // Priority: user.position > member.position > role
    if (member.user?.position) {
      return member.user.position;
    }
    if (member.position) {
      return member.position;
    }
    // Fallback to role
    switch (member.role) {
      case 'CAPTAIN':
        return 'Đội trưởng';
      case 'admin':
        return 'Cầu thủ';
      case 'PLAYER':
        return 'Cầu thủ';
      case 'member':
        return 'Cầu thủ';
      case 'SUBSTITUTE':
        return 'Dự bị';
      default:
        return 'Thành viên';
    }
  };

  const getRoleBadgeLabel = (member: TeamMember) => {
    // Check admin by role
    if (member.role === 'admin') return 'Quản trị viên';
    if (member.role === 'CAPTAIN') return 'Đội trưởng';
    if (member.position === 'Captain') return 'Đội trưởng';
    if (member.user?.position?.toLowerCase() === 'đội trưởng' || member.user?.position?.toLowerCase() === 'captain') {
      return 'Đội trưởng';
    }
    return 'Thành viên';
  };

  const isAdmin = (member: TeamMember) => {
    return member.role === 'CAPTAIN' ||
           member.role === 'admin' ||
           member.position === 'Captain' ||
           member.user?.position?.toLowerCase() === 'đội trưởng' ||
           member.user?.position?.toLowerCase() === 'captain';
  };

  const getJerseyNumber = (member: TeamMember) => {
    // Priority: user.jerseyNumber > member.jerseyNumber
    if (member.user?.jerseyNumber) return member.user.jerseyNumber;
    return member.jerseyNumber;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title={`Thành viên (${members.length})`} onBack={() => navigate(-1)} />

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4 mx-auto" />
            <p className="text-sm text-gray-500">Đang tải danh sách thành viên...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && members.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState icon="group_off" title="Chưa có thành viên nào" description="Team này chưa có thành viên. Hãy mời thêm thành viên!" />
        </div>
      )}

      {/* Members List */}
      {!isLoading && !error && members.length > 0 && (
        <div className="p-4 space-y-3 overflow-y-auto pb-24">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => navigate(appRoutes.memberProfile(teamId || '', member.id), { state: { member, team: currentTeam } })}
              className="flex items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
            >
              <div className="relative">
                <div className="size-12 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                  {member.user?.avatar ? (
                    <img src={member.user.avatar} alt={member.user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="person" className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {member.user?.name || 'Thành viên'}
                  </h4>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-text-secondary">
                    {getRoleLabel(member)}
                  </span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isAdmin(member)
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                    }`}
                  >
                    {getRoleBadgeLabel(member)}
                  </span>
                </div>
              </div>
              {isCurrentUserAdmin && (
                <button
                  onClick={(e) => openActionSheet(e, member)}
                  className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200"
                >
                  <Icon name="more_vert" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button - Admin only */}
      {isCurrentUserAdmin && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/80 dark:via-background-dark/80 to-transparent z-10 pointer-events-none flex justify-center pb-8">
          <button
            onClick={() => setShowAddMethodSheet(true)}
            className="pointer-events-auto h-12 px-6 rounded-full bg-primary text-black font-bold shadow-lg shadow-primary/30 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Icon name="person_add" />
            Thêm thành viên
          </button>
        </div>
      )}

      {/* --- BOTTOM SHEETS --- */}

      {/* 1. Member Actions Sheet */}
      {showActionSheet && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeActionSheet} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <div className="flex flex-col items-center mb-6">
              <div className="size-16 rounded-full overflow-hidden mb-3 border-2 border-white dark:border-white/10 shadow-sm">
                {selectedMember.user?.avatar ? (
                  <img src={selectedMember.user.avatar} className="w-full h-full object-cover" alt={selectedMember.user?.name} />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon name="person" className="text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedMember.user?.name || 'Thành viên'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{getRoleLabel(selectedMember)}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className={`text-xs font-bold ${isAdmin(selectedMember) ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {getRoleBadgeLabel(selectedMember)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate(appRoutes.memberProfile(teamId || '', selectedMember.id), { state: { member: selectedMember, team: currentTeam } });
                  closeActionSheet();
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Icon name="person" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Xem chi tiết</span>
              </button>

              {!isAdmin(selectedMember) && (
                <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="size-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                    <Icon name="security" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Thăng làm đội trưởng</span>
                </button>
              )}

              <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />

              <button
                onClick={handleDeleteMember}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
              >
                <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:bg-red-200 dark:group-hover:bg-red-900/40">
                  <Icon name="person_remove" />
                </div>
                <span className="font-semibold text-red-500">Xóa khỏi đội</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Method Sheet */}
      {showAddMethodSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddMethodSheet(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Thêm thành viên mới</h3>

            <div className="space-y-4">
              {/* Option 1: Phone */}
              <button
                onClick={() => {
                  setShowAddMethodSheet(false);
                  navigate(appRoutes.memberAdd(teamId || ''));
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Icon name="dialpad" className="text-2xl" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white">Thêm bằng số điện thoại</h4>
                  <p className="text-sm text-gray-500">Tìm kiếm và mời trực tiếp</p>
                </div>
                <Icon name="chevron_right" className="ml-auto text-gray-400" />
              </button>

              {/* Option 2: Share Link */}
              <button
                onClick={() => {
                  setShowAddMethodSheet(false);
                  navigate(appRoutes.teamShare(teamId || ''));
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
              >
                <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Icon name="share" className="text-2xl" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white">Chia sẻ liên kết</h4>
                  <p className="text-sm text-gray-500">Mời qua Zalo, Messenger...</p>
                </div>
                <Icon name="chevron_right" className="ml-auto text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TeamMembersScreen;
