import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, Button, TeamAvatar } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

interface NotificationItem {
  id: string;
  type: 'team_invite' | 'match_invite' | 'system';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  data?: any;
}

/**
 * Notifications Screen
 *
 * List of notifications with tabs for All vs Invites.
 */
const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'invites'>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'team_invite',
      title: 'Lời mời tham gia đội',
      content: 'Hoàng Nam đã mời bạn tham gia đội bóng FC Anh Em.',
      time: '15 phút trước',
      isRead: false,
      data: {
        teamName: 'FC Anh Em',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBypvDsi-D_phTOtQVDsuko1_OaeLHOPwHmhVianjSwwv5eXiQ5TI7fie-VKOFm-iNPkFWxJww3Phok10XnM2xeMBaAhHiM6qPUAdUNYq5nf1AvtF-q24k4xmzXc1hWjuPlMOqQOniDFxVh0ZkHaooaQ4OYzSSuMP9u6TNYh0DkSG6liPhKWavxJG405PNn8issj3m_-RoaeJs2kPsmhV5S0nTTxwPAbxwfKAPtRPkzmjUDq4_45ql8q8y7Byllkt5Ou8PGPsisKYJp',
        inviter: 'Hoàng Nam',
      },
    },
    {
      id: '2',
      type: 'match_invite',
      title: 'Lời mời giao hữu',
      content: 'Tiger Utd muốn giao hữu với FC Sài Gòn vào tối mai.',
      time: '2 giờ trước',
      isRead: true,
      data: {
        teamName: 'Tiger Utd',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
      },
    },
    {
      id: '3',
      type: 'system',
      title: 'Cập nhật hệ thống',
      content: 'Phiên bản mới 2.0 đã sẵn sàng. Trải nghiệm ngay các tính năng quản lý đội bóng mới.',
      time: '1 ngày trước',
      isRead: true,
    },
  ]);

  const filteredNotifications =
    activeTab === 'all' ? notifications : notifications.filter((n) => n.type === 'team_invite');

  const handleRemove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header
        title="Thông báo"
        onBack={() => navigate(-1)}
        rightAction={<button className="text-primary text-sm font-bold p-2">Đọc tất cả</button>}
      />

      {/* Tabs */}
      <div className="px-4 pt-2 pb-4 border-b border-gray-200 dark:border-white/5">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              activeTab === 'invites'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            Lời mời
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredNotifications.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border ${
              item.isRead
                ? 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5'
                : 'bg-primary/5 border-primary/20 shadow-sm'
            }`}
          >
            <div className="flex gap-4">
              {/* Icon/Avatar */}
              <div className="shrink-0">
                {item.type === 'team_invite' || item.type === 'match_invite' ? (
                  <div className="relative">
                    <TeamAvatar src={item.data.logo} size="md" />
                    {item.type === 'team_invite' && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-surface-dark">
                        <Icon name="person_add" className="text-xs" />
                      </div>
                    )}
                    {item.type === 'match_invite' && (
                      <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1 rounded-full border-2 border-white dark:border-surface-dark">
                        <Icon name="flash_on" className="text-xs" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="size-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500">
                    <Icon name="notifications" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4
                    className={`text-sm ${
                      item.isRead
                        ? 'font-semibold text-slate-900 dark:text-white'
                        : 'font-bold text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                </div>
                <p
                  className={`text-sm ${
                    item.isRead ? 'text-gray-500' : 'text-slate-800 dark:text-gray-200'
                  } leading-relaxed mb-3`}
                >
                  {item.content}
                </p>

                {/* Actions for Invites */}
                {item.type === 'team_invite' && (
                  <div className="flex gap-3">
                    <Button className="h-9 px-4 text-xs flex-1">Chấp nhận</Button>
                    <Button
                      variant="secondary"
                      className="h-9 px-4 text-xs flex-1 bg-white dark:bg-white/5"
                      onClick={() => handleRemove(item.id)}
                    >
                      Từ chối
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-full"
                      onClick={() => navigate(appRoutes.teamDetail('1'))}
                    >
                      <Icon name="arrow_forward" />
                    </Button>
                  </div>
                )}

                {item.type === 'match_invite' && (
                  <Button variant="secondary" className="h-9 w-full text-xs">
                    Xem chi tiết
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="size-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Icon name="notifications_off" className="text-3xl" />
            </div>
            <p>Không có thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
