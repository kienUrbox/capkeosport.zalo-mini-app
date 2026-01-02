import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon, Button } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

interface Member {
  id: string;
  name: string;
  role: string;
  number: string;
  image: string;
  isAdmin: boolean;
}

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

  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      role: 'Tiền đạo',
      number: '10',
      isAdmin: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVTbFbEVKyBAT5wyQDrv7lnWXESXkvb8eUj3e1kAsxwVEClkl8R16ZgndkQ5MiXIdQeQyikmJyFpSrs3gy7Nrh05FPLNvuUbee73ajLOhm2zbYP1u1G91fw5tAfKsZcyOiz-XpOxEqIYlOZH1F19lsDCgBqycoEm50-LjpGnmU3tjLRWzTOcS13En2OwxJErDMn8WYetuT0WKhCzhW4r4NVFR4y_ecMILTeqfpytlGSOu72Vbx0sSKpF6dfRg_nc69NMCY_Mtpsy9m',
    },
    {
      id: '2',
      name: 'Trần Văn B',
      role: 'Hậu vệ',
      number: '4',
      isAdmin: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDljyEJhi2zU-3QBVHfZ8QbZfKnazIoWQZAmqG7G1mNu8s6VsSJGYsnixLJaJTzhPxmh96DLuOiFNI1dhApZXHqobLdDAGMJ8S0abR7anNyvUa1FhvaUAKEa4EKyuvyXFWNuXksQRp__T-86x-LocMMsoVsxRdEV1tW9Ae2gRsreDNFbVDoY4TUev0aKDr6INDrJBmeXcL5K55IKacorRikenjrfUvZkE8bnSGxs3BMP1b6N6AUwZy8zBlI_B4Y6hsK8LoFmzlVF-al',
    },
    {
      id: '3',
      name: 'Lê Hoàng Nam',
      role: 'Thủ môn',
      number: '1',
      isAdmin: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA834-l0cKqY_4j-wZgqKqXlF3N5Qk7RjE1M4Xp8S6T2W9V0Z_L5H3Y_c7B6D1F9G2J8K4Lm0N3P5Q7R8S1T9V2W4X6Y0Z8L5K3M1N9P7Q4R2S6T8V0W3X5Y7Z9/avatar.png',
    },
  ]);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddMethodSheet, setShowAddMethodSheet] = useState(false);

  const openActionSheet = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    setSelectedMember(member);
    setShowActionSheet(true);
  };

  const closeActionSheet = () => {
    setShowActionSheet(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      closeActionSheet();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title={`Thành viên (${members.length})`} onBack={() => navigate(-1)} />

      {/* Member List */}
      <div className="p-4 space-y-3 overflow-y-auto pb-24">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => navigate(appRoutes.memberProfile(teamId || '', member.id))}
            className="flex items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="relative">
              <div className="size-12 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{member.name}</h4>
                {member.number && (
                  <span className="bg-gray-100 dark:bg-white/10 text-[10px] px-1.5 rounded font-mono text-gray-500">
                    {member.number}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-text-secondary truncate">{member.role}</span>
                <span className="text-[10px] text-gray-300">•</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    member.isAdmin
                      ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                  }`}
                >
                  {member.isAdmin ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => openActionSheet(e, member)}
              className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200"
            >
              <Icon name="more_vert" />
            </button>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/80 dark:via-background-dark/80 to-transparent z-10 pointer-events-none flex justify-center pb-8">
        <button
          onClick={() => setShowAddMethodSheet(true)}
          className="pointer-events-auto h-12 px-6 rounded-full bg-primary text-black font-bold shadow-lg shadow-primary/30 flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Icon name="person_add" />
          Thêm thành viên
        </button>
      </div>

      {/* --- BOTTOM SHEETS --- */}

      {/* 1. Member Actions Sheet */}
      {showActionSheet && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeActionSheet} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <div className="flex flex-col items-center mb-6">
              <div className="size-16 rounded-full overflow-hidden mb-3 border-2 border-white dark:border-white/10 shadow-sm">
                <img src={selectedMember.image} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedMember.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedMember.role}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className={`text-xs font-bold ${selectedMember.isAdmin ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {selectedMember.isAdmin ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate(appRoutes.memberProfile(teamId || '', selectedMember.id));
                  closeActionSheet();
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Icon name="person" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Xem chi tiết</span>
              </button>

              {!selectedMember.isAdmin && (
                <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="size-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                    <Icon name="security" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Thăng làm quản trị viên</span>
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
