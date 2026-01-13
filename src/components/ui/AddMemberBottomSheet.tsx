import React from 'react';
import { Icon } from './Icon';
import { appRoutes } from '@/utils/navigation';
import { useNavigate } from 'react-router-dom';

export interface AddMemberBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  onAddByPhone?: () => void;
}

/**
 * AddMemberBottomSheet Component
 *
 * Quick action bottom sheet for adding members:
 * - Share QR code
 * - Add by phone number
 */
export const AddMemberBottomSheet: React.FC<AddMemberBottomSheetProps> = ({
  isOpen,
  onClose,
  teamId,
  onAddByPhone,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleShareQR = () => {
    onClose();
    if (teamId) {
      navigate(appRoutes.teamShare(teamId));
    }
  };

  const handleAddByPhone = () => {
    onClose();
    // Use callback if provided, otherwise navigate to add-member screen
    if (onAddByPhone) {
      onAddByPhone();
    } else if (teamId) {
      navigate(appRoutes.memberAdd(teamId));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
        {/* Drag indicator */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thêm thành viên</h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Action Options */}
        <div className="flex flex-col gap-3">
          {/* Share QR Option */}
          <button
            onClick={handleShareQR}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-98 transition-all border border-gray-100 dark:border-white/5"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="qr_code_2" className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-900 dark:text-white">Chia sẻ QR Code</p>
              <p className="text-xs text-gray-500 mt-0.5">Để thành viên quét tham gia đội</p>
            </div>
            <Icon name="arrow_forward_ios" className="text-gray-400 text-sm" />
          </button>

          {/* Add by Phone Option */}
          <button
            onClick={handleAddByPhone}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-98 transition-all border border-gray-100 dark:border-white/5"
          >
            <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Icon name="add_ic_call" className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-900 dark:text-white">Thêm bằng số điện thoại</p>
              <p className="text-xs text-gray-500 mt-0.5">Nhập SĐT để mời thành viên</p>
            </div>
            <Icon name="arrow_forward_ios" className="text-gray-400 text-sm" />
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
};

export default AddMemberBottomSheet;
