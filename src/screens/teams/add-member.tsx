import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Icon, Input } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * AddMember Screen
 *
 * Add member by phone number with optional display name.
 */
const AddMemberScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock function to simulate picking from contacts
  const handlePickContact = () => {
    // In a real app, this would open navigator.contacts
    setPhone('0909123456');
    setName('Nguyễn Văn C');
  };

  const handleAdd = (action: 'finish' | 'continue') => {
    if (!phone) return;

    // Logic to save member would go here

    if (action === 'continue') {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2000);
      setPhone('');
      setName('');
    } else {
      navigate(appRoutes.teamMembers(teamId));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe relative">
      <Header title="Thêm bằng số điện thoại" onBack={() => navigate(-1)} />

      <div className="p-4 flex flex-col gap-6 overflow-y-auto pb-32">

        {/* Avatar Placeholder */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="size-24 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center border-4 border-white dark:border-surface-dark shadow-sm mb-3">
            <Icon name="person" className="text-4xl text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 text-center max-w-[200px]">
            Nhập số điện thoại để tìm kiếm thành viên trên hệ thống
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4 bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          {/* Phone Input with Contact Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Số điện thoại <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Icon name="phone" />
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Nhập SĐT..."
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl h-12 pl-12 pr-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
              <button
                onClick={handlePickContact}
                className="aspect-square h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                title="Chọn từ danh bạ"
              >
                <Icon name="contacts" />
              </button>
            </div>
          </div>

          {/* Name Input */}
          <Input
            label="Tên hiển thị (Tùy chọn)"
            icon="badge"
            placeholder="VD: Tuấn Tiền Đạo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Helper Text */}
        <div className="flex gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 text-primary-dark dark:text-primary">
          <Icon name="info" className="shrink-0" />
          <p className="text-xs leading-relaxed">
            Nếu số điện thoại chưa đăng ký Football Connect, một tin nhắn SMS mời tham gia sẽ được soạn sẵn cho bạn.
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium animate-fade-in z-50">
          <Icon name="check_circle" className="text-green-500" />
          Đã thêm thành công!
        </div>
      )}

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleAdd('finish')}
            disabled={!phone}
          >
            Hoàn tất
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => handleAdd('continue')}
            disabled={!phone}
          >
            Thêm thành viên khác
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberScreen;
