import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { PrimaryButton, SecondaryButton, TeamStats } from '../../components/ui'
import {
  BORDER_RADIUS,
  ICONS,
  ICON_SIZES,
  PADDING,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/design'
import type { Team } from '../../types'

const MyTeamDetailScreen = () => {
  const navigate = useNavigate()
  const { teamId } = useParams<{ teamId: string }>()
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'matches'>('overview')
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Mock data - sẽ thay bằng API call
  const team: Team & {
    banners?: string[]
    description?: string
    matchesPlayed?: number
  } = {
    id: teamId || '1',
    name: 'CapKeoSport FC',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8h7cGOxCU0MaMeYuJN5NrW8U39j1L_d5bvipSwprEvzTVuoXwHEUxXSzgu9p8TH6-yNZmk76pAoRyMO7cNVQgEsNftbY5KWoOvStDLBpzJ5hRc5p0D1HYEbDvnr2DFVUmiHwRPf1jXfGlVLxT3Fp0fG8hnIAj6wLP99ST7SDgwM7e_oQ_Qcbpt41IgR-eJcDDysauWWqI6kb86hnsPPsvwGWwBHiPaTNQLfUHpi095zjbcZcjV5m0rg_kLV1v_H45q_5vb05Rc0',
    level: 'Trình độ B',
    gender: 'Nam',
    stats: {
      attack: 85,
      defense: 70,
      technique: 92,
    },
    location: 'Quận 7, TP.HCM',
    pitch: ['Sân 5', 'Sân 7'],
    members: 12,
    banners: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-kwounSzaEGfWk6N61pX8getcaCmN-a4KY1J6fX-oqX87oTsLMXcVmKHw3P1d6deRDY4B2QKMMWwGSQZaPcRxClkeVv5YBLbKxpLY8lXqQjaIVZaUJckCl8W4xgj48jtz8zJqr2zxpZanIevvQcb-GLvxqoJT-XymqMEwsZKmf1eWm5EBZj3qqy_PvYnJFGqSvyiXEp2mr3Dweou-FPB_Sgqr5kR9Ss2zePXYxMbcWcF2HbG8JY2nVQPKFJzLed1FeFa9dYEdw3M',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKFY583HhjwjHHThbR9F6X5wN5tAOUjovHlggc2EXroLgFpFbf6dj8PZLQs4AjV4rgNIeCUOpoeQUVeEuMUMkbWU_X3qPX1-ZMwBdOrNxDdZnYKYOaCn_smW1iBnXjVtPdR-LrQ9q0p9CedLycm7GjxdPm1Cv0s03-tnPEJN6J0_-pY03I9nH6IbjFFG7XPKnhWIKQSt7wRYzy_N7sul07RP0S7NuqhH5_giwQeI-BNgcZJ8bmJyhQAc47JQJEQFD2cHyOnJigc4Q',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDH7gl125CEo2aqLTkyjVMmSo0Wvtx5uiCnDUSAzhpw-6rlsD4wPaIzify3SguPcY6rdqWH5O3-jRObnc6NRTgcURjVIrYoqMxX3b8pGJzThSka74GoEB0XMMRQnmitvnFf3XYcrGJ4h_xhLhnU5Di4ytc8ge3zo5zD9tJp4two-dX_cjAoEpIHzTtXQshJxTUMWDvnQYDL83LZMLw0_8ygi-ooPrsvAA4yTrqphekv3zaZhZ0ia6R962Q2hoGl6YQzqxgJf-QhGTE',
    ],
    description:
      'CapKeoSport FC là đội bóng đam mê, kỹ thuật và đoàn kết. Chúng tôi luôn chào đón các thành viên mới có cùng tinh thần thể thao và cống hiến. Tham gia cùng chúng tôi để chinh phục những trận cầu đỉnh cao!',
    matchesPlayed: 24,
  }

  const tabs = [
    { id: 'overview' as const, label: 'Tổng quan' },
    { id: 'members' as const, label: 'Thành viên' },
    { id: 'matches' as const, label: 'Lịch sử đấu' },
  ]

  // Mock data cho thành viên
  const mockMembers = [
    {
      id: 'player-1',
      name: 'Nguyễn Văn A',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8h7cGOxCU0MaMeYuJN5NrW8U39j1L_d5bvipSwprEvzTVuoXwHEUxXSzgu9p8TH6-yNZmk76pAoRyMO7cNVQgEsNftbY5KWoOvStDLBpzJ5hRc5p0D1HYEbDvnr2DFVUmiHwRPf1jXfGlVLxT3Fp0fG8hnIAj6wLP99ST7SDgwM7e_oQ_Qcbpt41IgR-eJcDDysauWWqI6kb86hnsPPsvwGWwBHiPaTNQLfUHpi095zjbcZcjV5m0rg_kLV1v_H45q_5vb05Rc0',
      position: 'Tiền đạo',
      isCaptain: true,
      isManager: false,
      isOnline: true,
      joinedDate: '01/2024',
      matchesPlayed: 20,
      goals: 15,
    },
    {
      id: 'player-2',
      name: 'Trần Thị B',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rYRwHku5jgTQl3n1J4g0jGgAHJy7dus7Ln2V06_MTeSBEFdI1N2H37GY2FvRHByWqegqHDA_LxMKGPoihYRIcvDL9bimIYucHHNuR_t3KU3H3g8xGIZYlH3SdL8NBBwsulXw3kVNPa8nFdldgHoWmzUJo9ij9Kjan_YI7outh0Z4zE1JMleZRJR2YK0BEuFCQqnuzA03zUZ5ZNl_v1UppCO_r3cJKgSdJum46BAUaMBfB8p9-NVmwphmiATSWenNafDr_PAC22o',
      position: 'Hậu vệ',
      isCaptain: false,
      isManager: true,
      isOnline: false,
      joinedDate: '02/2024',
      matchesPlayed: 18,
      goals: 2,
    },
    {
      id: 'player-3',
      name: 'Lê Văn C',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5WDMGPECPbmOgT0LA1SoGrWwWYhX6qmQE6oqcCX-J1Rk40ZbUESv8piyvf0Qq8RNUFQM2DNXhIGMkmhiW4-sip5bevcLKe3qgH_Et6bpCZVdaoGJ1l-FcDQpc4iGPMl9k3bYEIwI8ezIvNobZG3sOXJgiKue6bwX929pwv-vS96Qj-wSCBspuyD_VdTZj69ck7Qr-GH6oEkAIlW14e5NolI2nP1SPih0mdUEvuMPffTx9O0JPu9r9IUkQwMoU0QkFOIIcksrjQ5M',
      position: 'Thủ môn',
      isCaptain: false,
      isManager: false,
      isOnline: true,
      joinedDate: '03/2024',
      matchesPlayed: 22,
      goals: 0,
    },
    {
      id: 'player-4',
      name: 'Phạm Văn D',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDou4yV--QpYu7A-1zPqyxh5MzUxZFykXr9s4Uh1D8qMg2fMnrRwH8H0HlfhxHAQBilwqi9VbybApxKYzZcd4ijdxLyNY91H_K6kJh5zVJ-Bzy8NEFkmiNbG7ncMf4AUj-jYx4msw9Y8Cxe8jilon7GtOLctAhemuvUBHPaQpfLTnpnAdVAGyhIA1X1yizNcFBYGriQPvxkHqw63Lm1Dvg_ltexId8fUpfVHtK3Df5hGOOkSZ_Mj4lWK3OWRBtonrmV0eZ7MRcsgJ0',
      position: 'Tiền vệ',
      isCaptain: false,
      isManager: false,
      isOnline: false,
      joinedDate: '04/2024',
      matchesPlayed: 15,
      goals: 8,
    },
  ]

  // Mock data cho lịch sử đấu
  const mockMatchHistory = [
    {
      id: 'match-1',
      date: '15/10/2024',
      time: '19:00',
      location: 'Sân bóng Tao Đàn, Quận 1',
      teamA: {
        name: team.name,
        logo: team.logo,
      },
      teamB: {
        name: 'FC Winner',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdp0Vd4A5yO1O0ZLBCmZm9mYi9Prx2dkfbn70x3sGGhspZxYFhKRz4ARKS7vBuntYAiQ9Jeeu-bIPcBEuusq_nW-AkI1I0LnaeDCEYelEC2fXvZaDsomtMLUFRssxCDNGkH8dVyOjvmgX0vF0PFRj-wROFlNKL0bf-KR5aVhhwTW9Cg43dH42GxsHWUZkljtlqABTzLJ_lZlHRU-uHE_qJW8ehfskOUTrQBvUg_I8Uy7CopreDgS9wTRI-Kc4ruC_3ApNB_166Gc4',
      },
      score: {
        teamA: 3,
        teamB: 1,
      },
    },
    {
      id: 'match-2',
      date: '08/10/2024',
      time: '18:00',
      location: 'Sân bóng Mỹ Đình, Từ Liêm',
      teamA: {
        name: team.name,
        logo: team.logo,
      },
      teamB: {
        name: 'Dragon Fire FC',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rYRwHku5jgTQl3n1J4g0jGgAHJy7dus7Ln2V06_MTeSBEFdI1N2H37GY2FvRHByWqegqHDA_LxMKGPoihYRIcvDL9bimIYucHHNuR_t3KU3H3g8xGIZYlH3SdL8NBBwsulXw3kVNPa8nFdldgHoWmzUJo9ij9Kjan_YI7outh0Z4zE1JMleZRJR2YK0BEuFCQqnuzA03zUZ5ZNl_v1UppCO_r3cJKgSdJum46BAUaMBfB8p9-NVmwphmiATSWenNafDr_PAC22o',
      },
      score: {
        teamA: 2,
        teamB: 2,
      },
    },
    {
      id: 'match-3',
      date: '01/10/2024',
      time: '20:00',
      location: 'Sân bóng An Lộc, Quận 7',
      teamA: {
        name: team.name,
        logo: team.logo,
      },
      teamB: {
        name: 'Spartans United',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1N6NjUx7D6hrwZx394uJrqjKrChMpQKOXhZvcPkj4MlvXFoPsoxElP5m8kBgAfdmtbW9ilYQ1UdUgFUk0quG9RNBhYwe4i05Pw66lEh8oLkE_UALld32SbahPZJLWFR5UxC3a31mHiPaWUFGJMyKufH3Sw3EKxvWK1F0nHURPCYLCusjuTANtuatbIxncmfUnzPpEkL3UPV3pCH3Bp7OrfL_svGJSlOEDrxJxRRs6hDL9UkLLjtQLKSeC8ilURt6QuTN7coPcM8I',
      },
      score: {
        teamA: 1,
        teamB: 4,
      },
    },
  ]

  // Mock thống kê trận đấu
  const mockMatchStats = {
    wins: 12,
    draws: 5,
    losses: 7,
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col text-text-primary-dark group/design-root overflow-x-hidden bg-background-dark">
      <StandardHeader title={team.name} />
      {/* Banner Carousel */}
      <div className="relative w-full">
        <div
          className="relative h-48 w-full overflow-x-auto snap-x-mandatory"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft
            const width = e.currentTarget.clientWidth
            setCurrentBannerIndex(Math.round(scrollLeft / width))
          }}
        >
          <div className="flex h-full">
            {team.banners?.map((banner, index) => (
              <div key={index} className="w-full flex-shrink-0 snap-center">
                <div
                  className="bg-center bg-no-repeat h-full w-full bg-cover"
                  style={{ backgroundImage: `url(${banner})` }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Banner Indicators */}
        {team.banners && team.banners.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
            {team.banners.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 ${BORDER_RADIUS.full} ${currentBannerIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Team Logo & Info */}
      <div className={`relative -mt-12 ${PADDING.md}`}>
        <div className="flex flex-col items-center">
          <div
            className={`bg-center bg-no-repeat aspect-square bg-cover ${BORDER_RADIUS.full} h-24 w-24 border-4 border-background-dark`}
            style={{ backgroundImage: `url(${team.logo})` }}
          />
          <h1 className={`mt-3 ${TYPOGRAPHY.heading['2']}`}>{team.name}</h1>
          <div className={`mt-2 flex items-center ${SPACING.sm}`}>
            <span
              className={`${BORDER_RADIUS.full} bg-[#2C2C2E] px-2.5 py-0.5 ${TYPOGRAPHY.caption} font-medium text-text-secondary-dark`}
            >
              {team.gender}
            </span>
            <span
              className={`${BORDER_RADIUS.full} bg-[#2C2C2E] px-2.5 py-0.5 ${TYPOGRAPHY.caption} font-medium text-text-secondary-dark`}
            >
              {team.level}
            </span>
          </div>
        </div>
        {/* Stats Bar */}
        <div className={`mt-4 flex justify-around ${BORDER_RADIUS.md} bg-[#2C2C2E] p-3 text-center ${TYPOGRAPHY.body.sm}`}>
          <div className={`flex flex-col items-center ${SPACING.xs} text-text-secondary-dark`}>
            <span className={`material-symbols-outlined ${ICON_SIZES.xl}`}>{ICONS.location_on}</span>
            <span className={TYPOGRAPHY.caption}>{team.location}</span>
          </div>
          <div className={`flex flex-col items-center ${SPACING.xs} text-text-secondary-dark`}>
            <span className={`material-symbols-outlined ${ICON_SIZES.xl}`}>{ICONS.grass}</span>
            <span className={TYPOGRAPHY.caption}>{team.pitch?.join(', ')}</span>
          </div>
          <div className={`flex flex-col items-center ${SPACING.xs} text-text-secondary-dark`}>
            <span className={`material-symbols-outlined ${ICON_SIZES.xl}`}>{ICONS.sports_soccer}</span>
            <span className={TYPOGRAPHY.caption}>Đã đá {team.matchesPlayed} trận</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className={`flex border-b border-[#2C2C2E] ${PADDING.md}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === tab.id
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-text-secondary-dark'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <p className={`${TYPOGRAPHY.body.sm} font-bold tracking-[0.015em]`}>{tab.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`flex flex-col ${SPACING.xl} ${PADDING.md}`}>
        {activeTab === 'overview' && (
          <div className={`flex flex-col ${SPACING.xl}`}>
            {/* Description */}
            <div>
              <h3 className={`${TYPOGRAPHY.heading['4']}`}>Giới thiệu</h3>
              <p className={`mt-2 ${TYPOGRAPHY.body.sm} text-text-secondary-dark`}>{team.description}</p>
            </div>

            {/* Team Stats */}
            <div className="flex flex-col">
              <h3 className={`${TYPOGRAPHY.heading['4']} leading-tight tracking-[-0.015em] text-text-primary-dark`}>
                Chỉ số đội
              </h3>
              <div className={`mt-3 flex flex-col ${SPACING.lg}`}>
                {team.stats && (
                  <TeamStats
                    stats={[
                      { label: 'Tấn công', value: team.stats.attack },
                      { label: 'Phòng ngự', value: team.stats.defense },
                      { label: 'Kỹ thuật', value: team.stats.technique },
                    ]}
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex w-full ${SPACING.md}`}>
              <SecondaryButton className="flex-1" onClick={() => console.log('Edit team')}>
                Chỉnh sửa đội
              </SecondaryButton>
              <PrimaryButton
                className={`flex-1 ${SPACING.sm}`}
                onClick={() => console.log('Invite members')}
              >
                <span className={`material-symbols-outlined ${ICON_SIZES.xl}`}>{ICONS.share}</span>
                <span>Mời thành viên</span>
              </PrimaryButton>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className={`flex flex-col ${SPACING.lg}`}>
            {/* Header với số lượng thành viên */}
            <div className="flex items-center justify-between">
              <h3 className={`${TYPOGRAPHY.heading['4']}`}>
                Thành viên ({team.members || 0})
              </h3>
              <PrimaryButton
                className="h-10 px-4"
                onClick={() => console.log('Invite members')}
              >
                <span className={`material-symbols-outlined ${ICON_SIZES.sm}`}>{ICONS.group_add}</span>
                <span>Mời</span>
              </PrimaryButton>
            </div>

            {/* Danh sách thành viên */}
            <div className={`flex flex-col ${SPACING.md}`}>
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/player/${member.id}`)}
                  className={`flex items-center ${SPACING.md} ${BORDER_RADIUS.md} bg-[#2C2C2E] p-4 transition hover:bg-[#3a3b3d] focus:outline-none focus:ring-2 focus:ring-primary/30`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`bg-center bg-no-repeat aspect-square bg-cover ${BORDER_RADIUS.full} h-14 w-14`}
                      style={{ backgroundImage: `url(${member.avatar})` }}
                    />
                    {member.isOnline && (
                      <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 ${BORDER_RADIUS.full} bg-green-500 border-2 border-[#2C2C2E]`} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`${TYPOGRAPHY.body.base} font-semibold text-text-primary-dark truncate`}>
                        {member.name}
                      </p>
                      {member.isCaptain && (
                        <span className={`${BORDER_RADIUS.full} bg-primary/20 px-2 py-0.5 ${TYPOGRAPHY.caption} text-primary font-medium`}>
                          Đội trưởng
                        </span>
                      )}
                      {member.isManager && (
                        <span className={`${BORDER_RADIUS.full} bg-purple-500/20 px-2 py-0.5 ${TYPOGRAPHY.caption} text-purple-400 font-medium`}>
                          Quản lý
                        </span>
                      )}
                    </div>
                    <p className={`mt-0.5 ${TYPOGRAPHY.body.sm} text-text-secondary-dark`}>
                      {member.position} • Tham gia {member.joinedDate}
                    </p>
                    {/* Stats */}
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className={`material-symbols-outlined ${ICON_SIZES.xs} text-text-secondary-dark`}>
                          {ICONS.sports_soccer}
                        </span>
                        <span className={`${TYPOGRAPHY.caption} text-text-secondary-dark`}>
                          {member.matchesPlayed} trận
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`material-symbols-outlined ${ICON_SIZES.xs} text-text-secondary-dark`}>
                          {ICONS.scoreboard}
                        </span>
                        <span className={`${TYPOGRAPHY.caption} text-text-secondary-dark`}>
                          {member.goals} bàn
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!member.isCaptain && !member.isManager && (
                    <button
                      className={`flex items-center justify-center h-8 w-8 ${BORDER_RADIUS.full} bg-[#1A1A1A] text-text-secondary-dark hover:bg-[#2A2A2A]`}
                      onClick={(event) => {
                        event.stopPropagation()
                        console.log('More options for', member.id)
                      }}
                    >
                      <span className={`material-symbols-outlined ${ICON_SIZES.sm}`}>{ICONS.unfold_more}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className={`flex flex-col ${SPACING.lg}`}>
            {/* Header với thống kê */}
            <div className={`flex items-center justify-around ${BORDER_RADIUS.md} bg-[#2C2C2E] p-4`}>
              <div className="flex flex-col items-center">
                <p className={`${TYPOGRAPHY.heading['3']} text-primary`}>{mockMatchStats.wins}</p>
                <p className={`${TYPOGRAPHY.caption} text-text-secondary-dark mt-1`}>Thắng</p>
              </div>
              <div className="h-8 w-px bg-[#1A1A1A]"></div>
              <div className="flex flex-col items-center">
                <p className={`${TYPOGRAPHY.heading['3']} text-text-primary-dark`}>{mockMatchStats.draws}</p>
                <p className={`${TYPOGRAPHY.caption} text-text-secondary-dark mt-1`}>Hòa</p>
              </div>
              <div className="h-8 w-px bg-[#1A1A1A]"></div>
              <div className="flex flex-col items-center">
                <p className={`${TYPOGRAPHY.heading['3']} text-red-400`}>{mockMatchStats.losses}</p>
                <p className={`${TYPOGRAPHY.caption} text-text-secondary-dark mt-1`}>Thua</p>
              </div>
            </div>

            {/* Danh sách trận đấu */}
            <div className={`flex flex-col ${SPACING.md}`}>
              {mockMatchHistory.map((match) => {
                const isWin = match.score && match.score.teamA > match.score.teamB
                const isDraw = match.score && match.score.teamA === match.score.teamB
                const isLoss = match.score && match.score.teamA < match.score.teamB

                return (
                  <div
                    key={match.id}
                    className={`flex flex-col ${SPACING.sm} ${BORDER_RADIUS.md} bg-[#2C2C2E] p-4`}
                    onClick={() => navigate(`/match/${match.id}/finished`)}
                  >
                    {/* Header với ngày tháng */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined ${ICON_SIZES.sm} text-text-secondary-dark`}>
                          {ICONS.calendar_today}
                        </span>
                        <p className={`${TYPOGRAPHY.body.sm} text-text-secondary-dark`}>
                          {match.date} • {match.time}
                        </p>
                      </div>
                      <span
                        className={`${BORDER_RADIUS.full} px-2 py-0.5 ${TYPOGRAPHY.caption} font-medium ${
                          isWin
                            ? 'bg-green-500/20 text-green-400'
                            : isDraw
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {isWin ? 'Thắng' : isDraw ? 'Hòa' : 'Thua'}
                      </span>
                    </div>

                    {/* Đội bóng và tỷ số */}
                    <div className={`flex items-center ${SPACING.md} mt-2`}>
                      {/* Team A (Our Team) */}
                      <div className="flex-1 flex items-center gap-2">
                        <div
                          className={`bg-center bg-no-repeat aspect-square bg-cover ${BORDER_RADIUS.full} h-10 w-10`}
                          style={{ backgroundImage: `url(${match.teamA.logo})` }}
                        />
                        <p className={`${TYPOGRAPHY.body.base} font-semibold text-text-primary-dark truncate`}>
                          {match.teamA.name}
                        </p>
                      </div>

                      {/* Score */}
                      {match.score && (
                        <div className="flex items-center gap-2 px-3">
                          <p
                            className={`${TYPOGRAPHY.heading['3']} ${
                              isWin ? 'text-primary' : isLoss ? 'text-red-400' : 'text-text-primary-dark'
                            }`}
                          >
                            {match.score.teamA}
                          </p>
                          <p className={`${TYPOGRAPHY.body.base} text-text-secondary-dark`}>-</p>
                          <p
                            className={`${TYPOGRAPHY.heading['3']} ${
                              isLoss ? 'text-primary' : isWin ? 'text-red-400' : 'text-text-primary-dark'
                            }`}
                          >
                            {match.score.teamB}
                          </p>
                        </div>
                      )}

                      {/* Team B (Opponent) */}
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        <p className={`${TYPOGRAPHY.body.base} font-semibold text-text-primary-dark truncate text-right`}>
                          {match.teamB.name}
                        </p>
                        <div
                          className={`bg-center bg-no-repeat aspect-square bg-cover ${BORDER_RADIUS.full} h-10 w-10`}
                          style={{ backgroundImage: `url(${match.teamB.logo})` }}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    {match.location && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`material-symbols-outlined ${ICON_SIZES.xs} text-text-secondary-dark`}>
                          {ICONS.location_on}
                        </span>
                        <p className={`${TYPOGRAPHY.body.sm} text-text-secondary-dark`}>{match.location}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <div className="h-5"></div>
    </div>
  )
}

export default MyTeamDetailScreen

