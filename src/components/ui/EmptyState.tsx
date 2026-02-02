import React from 'react';
import { Icon } from './Icon';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 text-center ${className || 'py-12'}`}
    >
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-500">
          <Icon name={icon} className="text-5xl" filled />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-text-secondary mb-4 max-w-xs">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Empty States for Home Screen Sections

export const NoInvitations: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <div className="px-5 py-4">
    <EmptyState
      icon="mail_outline"
      title="Không có lời mời nào"
      description="Bạn chưa có lời mời tham gia đội nào mới"
      actionLabel={onRefresh ? 'Làm mới' : undefined}
      onAction={onRefresh}
    />
  </div>
);

export const NoMatches: React.FC<{ onRefresh?: () => void; onFindMatch?: () => void }> = ({ onRefresh, onFindMatch }) => (
  <EmptyState
    icon="sports_soccer"
    title="Chưa có trận đấu nào"
    description="Hãy cáp kèo với đội khác để có trận đấu thú vị"
    actionLabel={onFindMatch ? 'Cáp kèo ngay' : onRefresh ? 'Làm mới' : undefined}
    onAction={onFindMatch || onRefresh}
    className="py-6"
  />
);

export const NoNearbyTeams: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <div className="px-5 py-4">
    <EmptyState
      icon="location_off"
      title="Không tìm thấy đội nào"
      description="Không có đội nào gần khu vực của bạn. Hãy thử mở rộng phạm vi tìm kiếm."
      actionLabel={onRefresh ? 'Thử lại' : undefined}
      onAction={onRefresh}
    />
  </div>
);

export const NoTeams: React.FC<{ onCreateTeam?: () => void }> = ({ onCreateTeam }) => (
  <EmptyState
    icon="group_off"
    title="Chưa có đội bóng"
    description="Hãy tạo đội bóng đầu tiên của bạn để bắt đầu tìm kiếm đối thủ"
    actionLabel={onCreateTeam ? 'Tạo đội ngay' : undefined}
    onAction={onCreateTeam}
  />
);

export default EmptyState;
