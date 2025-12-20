import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { Badge, PrimaryButton, TeamStats } from '../../components/ui'
import { ICONS } from '../../constants/design'
import type { Team } from '../../types'

const TeamDetailScreen = () => {
  const navigate = useNavigate()
  const { teamId } = useParams<{ teamId: string }>()

  // Mock data - sẽ thay bằng API call
  // Check if this is user's team or opponent team
  const isMyTeam = false // TODO: Check from API
  const team: Team = {
    id: teamId || '1',
    name: 'Dragon Fire FC',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rYRwHku5jgTQl3n1J4g0jGgAHJy7dus7Ln2V06_MTeSBEFdI1N2H37GY2FvRHByWqegqHDA_LxMKGPoihYRIcvDL9bimIYucHHNuR_t3KU3H3g8xGIZYlH3SdL8NBBwsulXw3kVNPa8nFdldgHoWmzUJo9ij9Kjan_YI7outh0Z4zE1JMleZRJR2YK0BEuFCQqnuzA03zUZ5ZNl_v1UppCO_r3cJKgSdJum46BAUaMBfB8p9-NVmwphmiATSWenNafDr_PAC22o',
    level: 'Intermediate',
    gender: 'Mixed',
    stats: {
      attack: 80,
      defense: 65,
      technique: 75,
    },
    location: 'Quận 1, TP.HCM',
    pitch: ['Sân 5', 'Sân 7'],
    members: 12,
  }

  const members = useMemo(
    () => [
      {
        id: 'player-1',
        name: 'Nguyễn Văn A',
        role: 'Đội trưởng',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8h7cGOxCU0MaMeYuJN5NrW8U39j1L_d5bvipSwprEvzTVuoXwHEUxXSzgu9p8TH6-yNZmk76pAoRyMO7cNVQgEsNftbY5KWoOvStDLBpzJ5hRc5p0D1HYEbDvnr2DFVUmiHwRPf1jXfGlVLxT3Fp0fG8hnIAj6wLP99ST7SDgwM7e_oQ_Qcbpt41IgR-eJcDDysauWWqI6kb86hnsPPsvwGWwBHiPaTNQLfUHpi095zjbcZcjV5m0rg_kLV1v_H45q_5vb05Rc0',
      },
      {
        id: 'player-2',
        name: 'Trần Thị B',
        role: 'Hậu vệ',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rYRwHku5jgTQl3n1J4g0jGgAHJy7dus7Ln2V06_MTeSBEFdI1N2H37GY2FvRHByWqegqHDA_LxMKGPoihYRIcvDL9bimIYucHHNuR_t3KU3H3g8xGIZYlH3SdL8NBBwsulXw3kVNPa8nFdldgHoWmzUJo9ij9Kjan_YI7outh0Z4zE1JMleZRJR2YK0BEuFCQqnuzA03zUZ5ZNl_v1UppCO_r3cJKgSdJum46BAUaMBfB8p9-NVmwphmiATSWenNafDr_PAC22o',
      },
      {
        id: 'player-3',
        name: 'Lê Văn C',
        role: 'Thủ môn',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ULB_rfmknB1OYihh-C8-ib1gNbaPASnktTE4nm7OyoXkBRUfLa9hBnIILgxd1OSEiVEQs1X27HL5xjrUUxjSFgWXxASzeze7e2BsBo3gSy6W3f7zL8qhpqsmpCujGedhcdjUkugebZM8IRdWKgJdiy5XicB77cYsiMEvv90fXVS8swwu_59ypyZbuc8YA90BojsDQWUiG8u7HON225k5hQLgvhsQ9v5z5GTS0lfSRdkuXDfEWnGpZA6P-7psUG61ci0CDWFCd_5z',
      },
      {
        id: 'player-4',
        name: 'Phạm Văn D',
        role: 'Tiền vệ',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDGix741elSgSBnUm1tPwPFtCQB1q7JfFqzxOcYB5pKula73SbogenCArMB-6Fj9pqhaCbooo8n7lRBiCd4tzfyaL9KPJDaR1AWebG3vg-2JvKpdp4lbsXfyGyjquDZBWFpiI57NP612v-L0Bjv9tm3jxhnFiSw5iZF7LjGvyEVQunGI0CtJ-fUctsyv3wDC8u5GYjVr0DZSTultv8RpgVFxbiqb3CsHAqHLQN0EPO4Uh0E8JYScGRR8t7bp6TUcCVQNYHG3abcwt9o',
      },
      {
        id: 'player-5',
        name: 'Đinh Minh E',
        role: 'Tiền đạo',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD_VMYcTUSwu8TfK10STl6U3B8RwLKwogy0xDzYNFr06Xnh_w17MXlsvoftrgljz925z5dsMaB_b0-ncaLXBxYIkC-POSUsw3SYWgJXzA64GElrzXDwaMNqm3o-12lBor5zmhI0gmxrt9YDlMu44jjDryH80E5RG8NFpWT1AinjDFLbxpbutNDuQqhaS3vX9cuVYo740BUGEqyX-Aw0d7I2o0934XetiFMYJmk2-4Huda7Y7kMWCd_iDCQVpvHh1sr7A',
      },
    ],
    [teamId],
  )

  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-background-dark text-white">
      <StandardHeader title="Chi tiết đội" />
      {/* Header with Banner */}
      <header className="relative h-64 w-full">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPCtwAnWXBDFbVMRn5yn6fPQNHGbMEOjdC4r9qpea9yLzGJh6eV44PzBg2V2NxCRi8N7btISaxwVYPzoh1_yeW7Ju3b1CJWFqYOBRjkgc7Os6RdC3yEWX8Cun684edc-rXe1n444ewbxwha01h97rOewfH0QGDvkhNR7gbjlfMS3uzJ2OgwSp_Hhb0L_898c1R4ZweH5btCSHgnUBKJl0-xGbyJovy1ilAklm81w9WNOGi0Wq-vfBp3KkYU6zEEY89OoUSfO2K2eI")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent"></div>
        <div className="absolute bottom-0 w-full translate-y-[40%] px-4">
          <div className="mx-auto flex w-full max-w-md flex-col items-center">
            <div className="size-28 rounded-full border-4 border-background-dark bg-surface-dark shadow-lg">
              <img alt="Team logo" className="h-full w-full rounded-full object-cover" src={team.logo} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pb-4 pt-16">
        <div className="mx-auto max-w-md">
          {/* Team Name & Badges */}
          <section className="text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">{team.name}</h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Badge
                label={team.gender}
                variant="default"
                icon={<span className={`material-symbols-outlined text-base`}>{ICONS.groups}</span>}
              />
              <Badge
                label={team.level}
                variant="default"
                icon={<span className={`material-symbols-outlined text-base`}>{ICONS.signal_cellular_alt}</span>}
              />
            </div>
          </section>

          {/* Location & Pitch Info */}
          <section className="mt-6 rounded bg-surface-dark p-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className={`material-symbols-outlined text-xl`}>{ICONS.location_on}</span>
              <p className="text-sm">{team.location} (cách 2.5 km)</p>
            </div>
            {team.pitch && team.pitch.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-zinc-300">
                <span className={`material-symbols-outlined text-xl`}>{ICONS.sports_soccer}</span>
                <p className="text-sm">Sân cỏ nhân tạo: {team.pitch.join(', ')}</p>
              </div>
            )}
          </section>

          {/* Team Stats */}
          {team.stats && (
            <section className="mt-6">
              <h2 className="text-lg font-bold">Chỉ số đội</h2>
              <div className="mt-4">
                <TeamStats
                  stats={[
                    { label: 'Tấn công', value: team.stats.attack },
                    { label: 'Phòng ngự', value: team.stats.defense },
                    { label: 'Kỹ thuật', value: team.stats.technique },
                  ]}
                />
              </div>
            </section>
          )}

          {/* Members */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Thành viên ({team.members})</h2>
              <button
                className="text-sm font-medium text-primary"
                onClick={() => navigate(`/my-team/${team.id}?tab=members`)}
              >
                Xem tất cả
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => navigate(`/player/${member.id}`)}
                  className="flex items-center gap-3 rounded-2xl bg-surface-dark/80 px-3 py-3 text-left"
                >
                  <div
                    className="h-14 w-14 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${member.avatar})` }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{member.name}</span>
                    <span className="text-sm text-zinc-400">{member.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Previous Encounters */}
          <section className="mt-6">
            <h2 className="text-lg font-bold">Lịch sử đối đầu</h2>
            <div className="mt-4 flex flex-col items-center justify-center rounded bg-surface-dark p-6 text-center">
              <span className={`material-symbols-outlined text-4xl text-zinc-400`}>{ICONS.history}</span>
              <p className="mt-2 text-sm text-zinc-400">Chưa có trận đấu nào giữa hai đội.</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Actions */}
      {!isMyTeam && (
        <footer className="sticky bottom-0 z-10 w-full bg-background-dark/80 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto flex max-w-md flex-col gap-3">
            <PrimaryButton
              className="w-full"
              onClick={() => navigate(`/request-match/${teamId}`)}
            >
              Gửi lời mời
            </PrimaryButton>
            <button
              className="w-full rounded-full bg-surface-dark py-3.5 text-base font-bold text-zinc-300"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

export default TeamDetailScreen
