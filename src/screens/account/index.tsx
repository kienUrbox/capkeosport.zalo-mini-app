import { useNavigate } from 'react-router-dom'

import { Avatar, SectionHeader, Typography } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'

const personalStats = [
  { label: 'Tấn công', value: 75 },
  { label: 'Phòng ngự', value: 60 },
  { label: 'Kỹ thuật', value: 85 },
]

const teamMemberships = [
  { id: '1', name: 'Slayers FC', role: 'Quản lý' },
  { id: '2', name: 'The Wolves', role: 'Đội trưởng' },
  { id: '3', name: 'Gryffindor', role: 'Thành viên' },
]

const toggles = [
  { id: 'noti', label: 'Thông báo', enabled: true },
  { id: 'match', label: 'Nhắc lịch trận đấu', enabled: true },
  { id: 'newsletter', label: 'Nhận tips luyện tập', enabled: false },
]

const AccountScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 px-4 pb-28 pt-6">
      <div className="flex flex-col items-center gap-3">
        <Avatar size="lg" initials="NA" />
        <div className="text-center">
          <Typography variant="heading">Nguyễn Văn An</Typography>
          <Typography variant="body-sm" className="text-muted">
            zalo.me/99887766
          </Typography>
        </div>
        <PrimaryButton className="w-full" onClick={() => navigate('/profile/edit')}>
          Chỉnh sửa hồ sơ
        </PrimaryButton>
      </div>

      <section className="rounded-3xl bg-card p-4">
        <Typography variant="subtitle">Chỉ số cá nhân</Typography>
        <div className="mt-3 space-y-3">
          {personalStats.map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center justify-between text-sm">
                <span>{stat.label}</span>
                <span>{stat.value}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Đội của bạn" />
        <div className="space-y-3 rounded-3xl bg-card p-4">
          {teamMemberships.map((team) => (
            <div key={team.id} className="flex items-center justify-between">
              <div>
                <Typography variant="body">{team.name}</Typography>
                <Typography variant="body-sm" className="text-muted">
                  {team.role}
                </Typography>
              </div>
              <button
                className="text-sm font-semibold text-primary"
                onClick={() => navigate(`/team/${team.id}`)}
              >
                Xem đội
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Quyền & Thông báo" />
        <div className="space-y-4 rounded-3xl bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body">Quyền vị trí</Typography>
              <Typography variant="body-sm" className="text-muted">
                Đã cấp
              </Typography>
            </div>
            <SecondaryButton className="w-auto px-4 py-2 text-sm" onClick={() => undefined}>
              Cấp lại
            </SecondaryButton>
          </div>
          <div className="space-y-3">
            {toggles.map((toggle) => (
              <label
                key={toggle.id}
                className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3"
              >
                <span>{toggle.label}</span>
                <input type="checkbox" defaultChecked={toggle.enabled} className="h-5 w-5" />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-4">
        <Typography variant="subtitle">Hỗ trợ</Typography>
        <div className="mt-3 space-y-3">
          <button className="w-full rounded-2xl bg-surface px-4 py-3 text-left">
            Trợ giúp &amp; hỗ trợ
          </button>
          <button className="w-full rounded-2xl bg-surface px-4 py-3 text-left">
            Về CapKeoSport · v1.0.0
          </button>
          <button className="w-full rounded-2xl border border-red-500/40 px-4 py-3 text-left text-red-400">
            Đăng xuất
          </button>
        </div>
      </section>
    </div>
  )
}

export default AccountScreen

