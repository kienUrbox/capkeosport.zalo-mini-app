import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon, Button, TeamAvatar } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { MatchService, type MatchAttendance, type Attendee, type AttendanceStatus } from '@/services/api/match.service';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

/**
 * Match Attendance Screen
 *
 * Displays attendance for both teams with ability to update own attendance.
 */
const MatchAttendanceScreen: React.FC = () => {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const user = useAuthStore((state) => state.user);
  const showToast = useUIStore((state) => state.showToast);

  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<MatchAttendance | null>(null);
  const [myAttendance, setMyAttendance] = useState<Attendee | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      const [attendanceResponse, myAttendanceResponse] = await Promise.all([
        MatchService.getMatchAttendance(matchId),
        MatchService.getMyAttendance(matchId),
      ]);

      if (attendanceResponse.success && attendanceResponse.data) {
        setAttendanceData(attendanceResponse.data);
      }

      if (myAttendanceResponse.success) {
        setMyAttendance(myAttendanceResponse.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch attendance:', error);
      showToast(error.message || 'Không thể tải danh sách điểm danh', 'error');
    } finally {
      setLoading(false);
    }
  }, [matchId, showToast]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Determine which team the current user belongs to
  const userTeamKey = myAttendance ? (attendanceData?.teamA.teamId === myAttendance.teamId ? 'A' : 'B') : null;

  // Update attendance
  const updateAttendance = async (status: AttendanceStatus, reason?: string) => {
    if (!matchId) return;

    try {
      setIsUpdating(true);

      const response = await MatchService.updateAttendance(matchId, { status, reason });

      if (response.success && response.data) {
        setMyAttendance(response.data);

        // Show success message
        const messages = {
          PENDING: 'Đã hủy xác nhận',
          CONFIRMED: 'Đã xác nhận tham gia!',
          DECLINED: 'Đã báo bận',
        };
        showToast(messages[status], 'success');

        // Refresh attendance data
        await fetchAttendance();
      }
    } catch (error: any) {
      console.error('Failed to update attendance:', error);
      showToast(error.message || 'Không thể cập nhật điểm danh', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle confirm button
  const handleConfirm = () => {
    updateAttendance('CONFIRMED');
  };

  // Handle decline button with prompt
  const handleDecline = () => {
    const reason = prompt('Lý do báo bận:');
    if (reason) {
      updateAttendance('DECLINED', reason);
    }
  };

  // Handle pending button
  const handlePending = () => {
    updateAttendance('PENDING');
  };

  // Render status badge
  const renderStatusBadge = (status: AttendanceStatus, reason?: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-500 border border-gray-500/20">
            Chưa phản hồi
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            Có mặt
          </span>
        );
      case 'DECLINED':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Bận {reason && `(${reason})`}
          </span>
        );
    }
  };

  // Render action buttons based on current status
  const renderActionButtons = () => {
    if (!myAttendance) return null;

    const status = myAttendance.status;

    return (
      <div className="flex gap-3">
        {status === 'PENDING' && (
          <>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-sm"
              icon="person_off"
              disabled={isUpdating}
              onClick={handleDecline}
            >
              Báo bận
            </Button>
            <Button
              className="flex-1 h-10 text-sm"
              icon="check_circle"
              disabled={isUpdating}
              onClick={handleConfirm}
            >
              Sẽ tham gia
            </Button>
          </>
        )}

        {status === 'CONFIRMED' && (
          <>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-sm"
              icon="person_off"
              disabled={isUpdating}
              onClick={handleDecline}
            >
              Báo bận
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-sm border-gray-300"
              disabled={isUpdating}
              onClick={handlePending}
            >
              Chưa xác nhận
            </Button>
          </>
        )}

        {status === 'DECLINED' && (
          <>
            <Button
              className="flex-1 h-10 text-sm"
              icon="check_circle"
              disabled={isUpdating}
              onClick={handleConfirm}
            >
              Sẽ tham gia
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-sm border-gray-300"
              disabled={isUpdating}
              onClick={handlePending}
            >
              Chưa xác nhận
            </Button>
          </>
        )}
      </div>
    );
  };

  // Get current team data
  const currentTeamData = selectedTeam === 'A' ? attendanceData?.teamA : attendanceData?.teamB;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
        <Header title="Điểm danh" onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!attendanceData || !currentTeamData) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
        <Header title="Điểm danh" onBack={() => navigate(-1)} />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Icon name="event_busy" className="text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-center">Không thể tải thông tin điểm danh</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const otherTeamKey = selectedTeam === 'A' ? 'B' : 'A';
  const otherTeamData = selectedTeam === 'A' ? attendanceData.teamB : attendanceData.teamA;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-40">
      <Header title="Điểm danh" onBack={() => navigate(-1)} />

      {/* Team Toggle */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTeam === 'A'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setSelectedTeam('A')}
          >
            {attendanceData.teamA?.teamId ? 'Đội A' : 'Đội nhà'}
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTeam === 'B'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setSelectedTeam('B')}
          >
            {attendanceData.teamB?.teamId ? 'Đội B' : 'Đội khách'}
          </button>
        </div>
      </div>

      {/* Attendance Summary Card */}
      <div className="px-4 pt-4">
        <div className="bg-white dark:bg-[#1A2C23] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Tình trạng điểm danh</h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{currentTeamData.summary.confirmed}</span>
              <span className="text-gray-500">/{currentTeamData.summary.total}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${currentTeamData.summary.confirmedPercentage}%` }}
            />
          </div>

          {/* Stats breakdown */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Có mặt: {currentTeamData.summary.confirmed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600 dark:text-gray-400">Bận: {currentTeamData.summary.declined}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Chưa trả lời: {currentTeamData.summary.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="px-4 pt-6">
        <h3 className="font-bold text-base mb-3">Danh sách thành viên</h3>

        {currentTeamData.attendance.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="person_off" className="text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Chưa có dữ liệu điểm danh</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentTeamData.attendance.map((attendee) => {
              const isCurrentUser = user && attendee.userId === user.id;
              return (
                <div
                  key={attendee.id}
                  className={`bg-white dark:bg-[#1A2C23] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800/50 flex items-center gap-3 ${
                    isCurrentUser ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    {attendee.avatar ? (
                      <img
                        src={attendee.avatar}
                        alt={attendee.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Icon name="person" className="text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{attendee.fullName}</p>
                      {isCurrentUser && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                          Bạn
                        </span>
                      )}
                    </div>
                    {attendee.phone && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{attendee.phone}</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <div>{renderStatusBadge(attendee.status, attendee.reason)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed bottom action - User's attendance status */}
      {myAttendance && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-light dark:bg-background-dark p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-[#1A2C23] rounded-xl p-3 mb-3 border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="person" className="text-primary" />
                <p className="font-medium text-sm">Trạng thái của bạn</p>
              </div>
              <div className="flex items-center gap-2">
                {renderStatusBadge(myAttendance.status, myAttendance.reason)}
                {myAttendance.responseTime && (
                  <span className="text-xs text-gray-500">
                    {new Date(myAttendance.responseTime).toLocaleString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
            {renderActionButtons()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchAttendanceScreen;
