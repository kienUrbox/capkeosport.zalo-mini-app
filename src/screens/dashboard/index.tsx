import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, TeamAvatar, BottomNav } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { SECTION, FONT_SIZES, SPACING, ICON_SIZES, SPACE_Y } from '@/constants/design';

interface Invitation {
  id: string;
  teamName: string;
  logo: string;
  inviter: string;
  time: string;
}

/**
 * Dashboard Screen
 *
 * Main hub showing pending invitations, quick actions, my matches, and nearby teams.
 */
const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      teamName: 'FC Anh Em',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBypvDsi-D_phTOtQVDsuko1_OaeLHOPwHmhVianjSwwv5eXiQ5TI7fie-VKOFm-iNPkFWxJww3Phok10XnM2xeMBaAhHiM6qPUAdUNYq5nf1AvtF-q24k4xmzXc1hWjuPlMOqQOniDFxVh0ZkHaooaQ4OYzSSuMP9u6TNYh0DkSG6liPhKWavxJG405PNn8issj3m_-RoaeJs2kPsmhV5S0nTTxwPAbxwfKAPtRPkzmjUDq4_45ql8q8y7Byllkt5Ou8PGPsisKYJp',
      inviter: 'Hoàng Nam',
      time: '15p trước',
    },
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        navigate(appRoutes.dashboard, { replace: true });
        break;
      case 'schedule':
        navigate(appRoutes.matchSchedule, { replace: true });
        break;
      case 'match':
        navigate(appRoutes.matchFind, { replace: true });
        break;
      case 'team':
        navigate(appRoutes.teams, { replace: true });
        break;
      case 'profile':
        navigate(appRoutes.profile, { replace: true });
        break;
    }
  };

  const handleRejectInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className={`flex flex-col ${SPACE_Y.xl} pb-safe-with-nav`}>
        {/* Header */}
        <header className={`${SECTION.padding} pt-8 flex items-start justify-between bg-gradient-to-b from-primary/10 to-transparent safe-area-top`}>
          <div className="flex flex-col">
            <span className={`font-bold tracking-widest text-text-secondary uppercase mb-1 ${FONT_SIZES.caption}`}>
              Trang quản lý
            </span>
            <h1 className={`font-extrabold text-slate-900 dark:text-white leading-tight ${FONT_SIZES['3xl']}`}>
              Xin chào, Minh <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className={`font-normal text-gray-500 dark:text-text-secondary mt-1 ${FONT_SIZES.small}`}>
              Sẵn sàng tìm kèo hôm nay?
            </p>
          </div>
          <button
            className="relative group"
            onClick={() => navigate(appRoutes.profile)}
          >
            <div className="size-11 rounded-full border-2 border-white dark:border-border-dark overflow-hidden shadow-lg">
              <img
                alt="User"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcZGCgosiZhitSLhxeXNSiZQtDcPB3OM3HOGwTPBVAKaNYIyYAO2AV7PfhJi3SQ0lDg3HuSHtt4LSvGU-krS5yrGyODyEGFUzWY4zJBhboEmEJkKGjNFsAiBkQEEcTQRK87uPMXNdAJ7fAZkYCX5KYjr1Ud6Mr09lydz1UPjarDbEg16DkNVAqKA-uCgEOvwgepT1Uy6FrBwB0a_RYF0hq47bG4Fzxr0yFXC3qMp7XOgWuy_S6ilPS3AJFyWW1bIJrx0ib9fHrAbuK"
              />
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-white dark:border-background-dark"></div>
          </button>
        </header>

        {/* --- PENDING INVITATIONS SECTION --- */}
        {invitations.length > 0 && (
          <section className={SECTION.padding}>
            <div className={`flex items-center justify-between ${SECTION.titleSpacing}`}>
              <div className={`flex items-center ${SPACING.sm}`}>
                <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                <h3 className={`font-bold text-slate-900 dark:text-white tracking-tight ${SECTION.titleSize}`}>
                  Lời mời tham gia
                </h3>
              </div>
              <button
                onClick={() => navigate(appRoutes.notifications)}
                className={`font-semibold text-primary py-1 px-3 rounded-full hover:bg-primary/10 transition-colors ${FONT_SIZES.small}`}
              >
                Xem tất cả
              </button>
            </div>

            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="bg-white dark:bg-surface-dark border-l-4 border-primary rounded-r-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden"
              >
                <div className={`flex items-center ${SPACING.md}`}>
                  <TeamAvatar src={invite.logo} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-gray-500 mb-0.5 ${FONT_SIZES.small}`}>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {invite.inviter}
                      </span>{' '}
                      đã mời bạn vào:
                    </p>
                    <h4 className={`font-bold text-slate-900 dark:text-white leading-none ${FONT_SIZES.lg}`}>
                      {invite.teamName}
                    </h4>
                    <p className={`text-gray-400 mt-1 ${FONT_SIZES.caption}`}>{invite.time}</p>
                  </div>
                </div>

                <div className={`flex ${SPACING.sm} mt-1`}>
                  <Button className="h-9 flex-1 text-xs">Chấp nhận</Button>
                  <Button
                    variant="secondary"
                    className="h-9 flex-1 text-xs bg-gray-50 dark:bg-white/5"
                    onClick={() => handleRejectInvite(invite.id)}
                  >
                    Từ chối
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 rounded-full"
                    onClick={() => navigate(appRoutes.teamDetail('1'))}
                  >
                    <Icon name="visibility" />
                  </Button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Main Actions */}
        <section className={`${SECTION.padding} flex flex-col ${SPACE_Y.md}`}>
          <button
            onClick={() => navigate(appRoutes.matchFind)}
            className="relative w-full group overflow-hidden rounded-2xl bg-primary text-background-dark shadow-[0_8px_20px_rgba(17,212,115,0.25)] transition-all hover:shadow-[0_12px_24px_rgba(17,212,115,0.35)] active:scale-[0.98] text-left"
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110">
              <Icon name="sports_soccer" className="text-[140px] leading-none" />
            </div>
            <div className="relative z-10 flex items-center justify-between p-5">
              <div className={`flex flex-col items-start ${SPACING.sm}`}>
                <div className={`flex items-center ${SPACING.sm}`}>
                  <Icon name="bolt" filled className={ICON_SIZES.xl} />
                  <h2 className={`font-bold leading-tight ${FONT_SIZES.xl}`}>Cáp kèo ngay</h2>
                </div>
                <p className={`font-medium opacity-80 ${FONT_SIZES.base}`}>
                  Tìm đối thủ phù hợp gần bạn
                </p>
              </div>
              <div className="size-10 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon name="arrow_forward" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(appRoutes.teamsCreate)}
            className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className={`flex flex-col items-start ${SPACING.sm}`}>
              <div className={`flex items-center ${SPACING.sm}`}>
                <span className={`text-slate-900 dark:text-white font-bold leading-tight ${FONT_SIZES.lg}`}>
                  Tạo đội bóng
                </span>
              </div>
              <p className={`text-gray-500 dark:text-text-secondary font-normal ${FONT_SIZES.base}`}>
                Lập đội mới & quản lý thành viên
              </p>
            </div>
            <div className="size-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-primary">
              <Icon name="add" />
            </div>
          </button>
        </section>

        {/* My Matches */}
        <section className={SECTION.padding}>
          <div className={`flex items-center justify-between ${SECTION.titleSpacing}`}>
            <h3 className={`font-bold text-slate-900 dark:text-white tracking-tight ${SECTION.titleSize}`}>
              Kèo của tôi
            </h3>
            <button
              onClick={() => navigate(appRoutes.matchHistory)}
              className={`font-semibold text-primary py-1 px-3 rounded-full hover:bg-primary/10 transition-colors ${FONT_SIZES.small}`}
            >
              Xem tất cả
            </button>
          </div>

          <div
            onClick={() => navigate(appRoutes.matchDetail('1'))}
            className="group relative rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-5 shadow-lg overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className={`font-bold text-primary uppercase tracking-wide ${FONT_SIZES.caption}`}>
                  Sắp diễn ra
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-lg">
                <Icon
                  name="notifications_active"
                  className={`text-gray-500 dark:text-text-secondary ${ICON_SIZES.lg}`}
                />
              </div>
            </div>

            <div className={`flex gap-4 items-start mb-5`}>
              <div className="size-16 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 border dark:border-white/5">
                <img
                  alt="Team Logo"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcRpzVATvqm79UVxfcHcJJjTw3ciLMSecggY6pCnev-q5FRBLlSwT29D4zACF-Ap-4PQCoXo3xRYTzvZiI2lhsaeH7VSMo5PUNawSo9HeevcKuWx2-6iXgrW2sDG8b_-iEq15DRFD_54IgBkNiAy5VrfW3Nf6XZV0f20ZIYb_sbtTRjUcqO0DEBYbQC2wXb7nIULR3_W73Y0r9a7Nk6i1PYsnIUIZh8kPd-4LAi9guuy5OoWQYsm03oHaER1oOefDEignei6HzhuF5"
                />
              </div>
              <div className="flex flex-col">
                <h4 className={`text-slate-900 dark:text-white font-bold leading-tight mb-1 ${FONT_SIZES.xl}`}>
                  Giao hữu vs FC Sài Gòn
                </h4>
                <div className={`flex items-center gap-1 text-primary mb-1`}>
                  <Icon name="schedule" className={ICON_SIZES.lg} />
                  <span className={`font-bold ${FONT_SIZES.base}`}>19:30 • Hôm nay</span>
                </div>
                <div className={`flex items-center gap-1 text-gray-500 dark:text-text-secondary`}>
                  <Icon name="location_on" className={ICON_SIZES.md} />
                  <span className={`font-normal truncate max-w-[180px] ${FONT_SIZES.small}`}>
                    Sân chảo lửa, Quận 7, TP.HCM
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex ${SPACING.md} pt-4 border-t border-gray-100 dark:border-white/5`}>
              <Button className="flex-1 h-10" variant="primary">
                Điểm danh
              </Button>
              <Button className="flex-1 h-10" variant="secondary">
                Chi tiết
              </Button>
            </div>
          </div>
        </section>

        {/* Nearby Teams */}
        <section className={`${SECTION.padding} pl-5 pb-4`}>
          <div className={`flex items-center justify-between ${SECTION.titleSpacing} pr-5`}>
            <h3 className={`font-bold text-slate-900 dark:text-white tracking-tight ${SECTION.titleSize}`}>
              Đội gần bạn
            </h3>
            <Icon name="tune" className="text-gray-500" />
          </div>
          <div className={`flex overflow-x-auto ${SPACING.md} pb-4 pr-5 no-scrollbar`}>
            {[
              {
                name: 'FC Anh Em',
                dist: '1.2km',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBypvDsi-D_phTOtQVDsuko1_OaeLHOPwHmhVianjSwwv5eXiQ5TI7fie-VKOFm-iNPkFWxJww3Phok10XnM2xeMBaAhHiM6qPUAdUNYq5nf1AvtF-q24k4xmzXc1hWjuPlMOqQOniDFxVh0ZkHaooaQ4OYzSSuMP9u6TNYh0DkSG6liPhKWavxJG405PNn8issj3m_-RoaeJs2kPsmhV5S0nTTxwPAbxwfKAPtRPkzmjUDq4_45ql8q8y7Byllkt5Ou8PGPsisKYJp',
              },
              {
                name: 'Storm FC',
                dist: '2.5km',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdPDVsU8HjXm7-BhSIWmJN6Ol7OqhYE-e1RWAMjoVIKjbNnq9dTvsofyF6O-IG9qZze4u9TELsdTw6yyQ0vM5hr4HG5UeAXrqppEiD9TXiHp8zXV3qkl3BjxK32D45DodzuIog1UC5VF1iK8OH_TX-Jfe2hwNZ0bINoK0E14pNsxl5jXu32L6N-r3L2I-pOD2FnpVliWPD6Fcb4DPQcf-ET4_XYzK_vs5HNlL1loJ7zsLl7Ra4JyZhj0n_i2Rt6F4OEDVLMo9k9Ucg',
              },
              {
                name: 'Tiger Utd',
                dist: '3.0km',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
              },
            ].map((team, idx) => (
              <div
                key={idx}
                className="min-w-[140px] flex flex-col items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 active:scale-95 transition-transform"
              >
                <TeamAvatar src={team.img} className="mb-3" />
                <span className={`text-slate-900 dark:text-white font-semibold truncate w-full text-center ${FONT_SIZES.small}`}>
                  {team.name}
                </span>
                <span className={`text-gray-500 mt-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full ${FONT_SIZES.caption}`}>
                  Cách {team.dist}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default DashboardScreen;
