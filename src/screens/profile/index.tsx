import { useNavigate } from 'react-router-dom'

import { ScreenWrapper, Avatar, Typography, SectionHeader } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'

const ProfileScreen = () => {
  const navigate = useNavigate()

  return (
    <ScreenWrapper title="Trang cá nhân" subtitle="Cầu thủ Zalo ID">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-6 text-center">
        <Avatar size="lg" initials="NT" />
        <Typography variant="heading">Nguyễn Tiến</Typography>
        <Typography variant="body-sm" className="text-muted">
          Tiền đạo cánh · Cap Kèo FC
        </Typography>
      </div>
      <SectionHeader title="Thống kê cá nhân" />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border p-4 text-center">
          <Typography variant="caption">Kèo đã chơi</Typography>
          <Typography variant="heading">42</Typography>
        </div>
        <div className="rounded-2xl border border-border p-4 text-center">
          <Typography variant="caption">Chuỗi thắng</Typography>
          <Typography variant="heading">5</Typography>
        </div>
      </div>
      <div className="mt-auto space-y-3">
        <PrimaryButton onClick={() => navigate('/profile/edit')}>
          Chỉnh sửa hồ sơ
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate('/player/player-1')}>
          Xem hồ sơ công khai
        </SecondaryButton>
        <SecondaryButton onClick={() => navigate('/settings')}>
          Thiết lập
        </SecondaryButton>
      </div>
    </ScreenWrapper>
  )
}

export default ProfileScreen

