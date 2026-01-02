import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { appRoutes } from '@/utils/navigation';

/**
 * InviteMatch Screen
 *
 * Send match invitation form with date/time and location selection.
 */
const InviteMatch: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header title="Gửi lời mời giao lưu" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {/* Opponent Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-white/5 shadow-sm mb-6">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="relative">
              <div className="size-20 rounded-full bg-gray-100 dark:bg-black/30 border-2 border-primary p-1">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdSvJy9n3m4nDJboxMNyYIffoPOU-q_PGbSpEtCD7oZ3QLnawTx_1DEjQVzWpwzx6GI0HV0JsCpXaMYDzdOusm7IV8SDt-tv7lcvKkU9jgDe0q4JLtzD9NXRWWP0gualfKFckerrNu7uXjyLayhLsD4LPOLodvjUQxqIKDw0C25gTjlVsjebdqgrT6zpzHAJNBdjD7Sf8i6GBSnDq9Gn6J1kwtIiNbLUTGWhLS8YzzlBfZQNtaxu43uCkI2p3Y1JZYeAdvo81iUYE7" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-surface-dark">LV.5</div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">FC Sài Gòn Phủi</h2>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-gray-500 dark:text-text-secondary text-sm">
                <Icon name="verified" className="text-primary text-sm" filled />
                <span>Trình độ: Trung bình - Khá</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div className="flex gap-4">
            <Input label="Ngày dự kiến" type="date" className="flex-1" />
            <Input label="Giờ dự kiến" type="time" defaultValue="19:30" className="flex-1" />
          </div>

          <Input label="Sân dự kiến" placeholder="Nhập tên sân hoặc địa chỉ..." icon="location_on" />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">Ghi chú (Tùy chọn)</label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] resize-none"
              placeholder="Nhắn tin cho đội bạn về áo đấu, kèo nước..."
            ></textarea>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300">
            <Icon name="info" className="shrink-0" />
            <p className="text-xs leading-relaxed">Lời mời sẽ được gửi đến quản trị viên của đội bạn. Họ có thể chấp nhận hoặc đề xuất thay đổi.</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5">
        <Button
          fullWidth
          icon="send"
          onClick={() => navigate(appRoutes.matchSchedule)}
        >
          GỬI LỜI MỜI GIAO LƯU
        </Button>
      </div>
    </div>
  );
};

export default InviteMatch;
