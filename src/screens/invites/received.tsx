import React, { useState, useEffect } from 'react';
import { Header, InviteCard, DeclineInviteModal, InvitationSkeleton, EmptyState } from '@/components/ui';
import { FilterBar } from '@/components/ui/FilterBar';
import { useReceivedInvites, useTeamActions } from '@/stores/team.store';
import type { InviteStatus, TeamInvite } from '@/types/api.types';

/**
 * MyInvitesScreen
 *
 * Screen displaying all team invitations received by current user.
 * Supports filtering by status, accepting/declining invitations.
 */
const MyInvitesScreen: React.FC = () => {
  const { fetchReceivedInvites, respondInvite } = useTeamActions();
  const receivedInvites = useReceivedInvites();

  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvite, setSelectedInvite] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load invites on mount
  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    setIsLoading(true);
    try {
      await fetchReceivedInvites();
    } catch (error) {
      console.error('Failed to load invites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter invites by status
  const filteredInvites = receivedInvites.filter((invite) => {
    if (statusFilter === 'Tất cả') return true;
    const statusMap: Record<string, InviteStatus> = {
      'Chờ xử lý': 'pending',
      'Đã chấp nhận': 'accepted',
      'Đã từ chối': 'declined',
      'Hết hạn': 'expired',
    };
    return invite.status === statusMap[statusFilter];
  });

  const handleAccept = async (inviteId: string) => {
    setIsProcessing(true);
    try {
      await respondInvite(inviteId, 'accept');
    } catch (error) {
      console.error('Failed to accept invite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = (inviteId: string) => {
    setSelectedInvite(inviteId);
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = async (message?: string) => {
    if (!selectedInvite) return;

    setIsProcessing(true);
    setShowDeclineModal(false);
    try {
      await respondInvite(selectedInvite, 'decline', message);
    } catch (error) {
      console.error('Failed to decline invite:', error);
    } finally {
      setIsProcessing(false);
      setSelectedInvite(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Lời mời tham gia" />

      {/* Filter Bar */}
      <FilterBar
        options={['Tất cả', 'Chờ xử lý', 'Đã chấp nhận', 'Đã từ chối', 'Hết hạn']}
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
              icon="mail_outline"
              title="Không có lời mời"
              description={
                statusFilter === 'Tất cả'
                  ? 'Bạn chưa có lời mời tham gia đội nào'
                  : `Không có lời mời ${statusFilter.toLowerCase()}`
              }
            />
          </div>
        ) : (
          // Invite cards
          <div className="space-y-3">
            {filteredInvites.map((invite) => (
              <InviteCard
                key={invite.id}
                invite={invite}
                onAccept={() => handleAccept(invite.id)}
                onDecline={() => handleDecline(invite.id)}
                isLoading={isProcessing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      <DeclineInviteModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={handleDeclineConfirm}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default MyInvitesScreen;
