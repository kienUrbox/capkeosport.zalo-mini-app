import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, SentInviteCard, InvitationSkeleton, EmptyState, Icon } from '@/components/ui';
import { FilterBar } from '@/components/ui/FilterBar';
import { useTeamActions } from '@/stores/team.store';
import type { InviteStatus, TeamInvite } from '@/types/api.types';

/**
 * SentInvitesScreen
 *
 * Screen displaying all team invitations sent by team admin.
 * Supports filtering by status, canceling/resending invitations.
 */
const SentInvitesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { fetchSentInvites, cancelInvite, resendInvite } = useTeamActions();

  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load invites on mount
  useEffect(() => {
    loadInvites();
  }, [teamId]);

  const loadInvites = async () => {
    if (!teamId) return;

    setIsLoading(true);
    try {
      await fetchSentInvites(teamId);
    } catch (error) {
      console.error('Failed to load sent invites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Note: We'll need to update the store to return the invites
  // For now, this is a placeholder that would be connected to the store
  // In a real implementation, we'd use: const sentInvites = useSentInvites();

  // Filter invites by status
  const filteredInvites = invites.filter((invite) => {
    if (statusFilter === 'Tất cả') return true;
    const statusMap: Record<string, InviteStatus> = {
      'Chờ xử lý': 'pending',
      'Đã chấp nhận': 'accepted',
      'Đã từ chối': 'declined',
      'Đã hủy': 'cancelled',
      'Hết hạn': 'expired',
    };
    return invite.status === statusMap[statusFilter];
  });

  const handleCancel = async (inviteId: string) => {
    if (!confirm('Bạn có chắc muốn hủy lời mời này?')) return;

    setIsProcessing(true);
    try {
      await cancelInvite(inviteId);
      // Refresh the list
      await loadInvites();
    } catch (error) {
      console.error('Failed to cancel invite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResend = async (inviteId: string) => {
    setIsProcessing(true);
    try {
      await resendInvite(inviteId);
      // Refresh the list
      await loadInvites();
    } catch (error) {
      console.error('Failed to resend invite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Lời mời đã gửi" onBack={() => navigate(-1)} />

      {/* Filter Bar */}
      <FilterBar
        options={['Tất cả', 'Chờ xử lý', 'Đã chấp nhận', 'Đã từ chối', 'Đã hủy', 'Hết hạn']}
        selected={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-3">
            <InvitationSkeleton />
            <InvitationSkeleton />
            <InvitationSkeleton />
          </div>
        ) : filteredInvites.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon="send"
              title="Chưa gửi lời mời"
              description={
                statusFilter === 'Tất cả'
                  ? 'Bạn chưa gửi lời mời tham gia đội nào'
                  : `Không có lời mời ${statusFilter.toLowerCase()}`
              }
              action={{
                label: 'Mời thành viên',
                onClick: () => navigate(-1),
              }}
            />
          </div>
        ) : (
          // Invite cards
          <div className="space-y-3">
            {filteredInvites.map((invite) => (
              <SentInviteCard
                key={invite.id}
                invite={invite}
                onCancel={() => handleCancel(invite.id)}
                onResend={() => handleResend(invite.id)}
                isLoading={isProcessing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentInvitesScreen;
