import { useNavigate } from 'react-router-dom'

import { ScreenWrapper, Typography, Divider, SectionHeader } from '../../components/common'
import { SecondaryButton } from '../../components/ui'

const SettingsScreen = () => {
  const navigate = useNavigate()
  const settings = [
    { label: 'Thông báo kèo mới', value: 'Bật' },
    { label: 'Nhắc lịch thi đấu', value: '30 phút trước' },
    { label: 'Chế độ tối', value: 'Luôn bật' },
  ]

  return (
    <ScreenWrapper title="Cài đặt" subtitle="Điều chỉnh trải nghiệm">
      <SectionHeader title="Hệ thống" />
      <div className="space-y-4 rounded-3xl bg-card p-4">
        {settings.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between">
              <Typography variant="body">{item.label}</Typography>
              <Typography variant="body-sm" className="text-muted">
                {item.value}
              </Typography>
            </div>
            <Divider />
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <SecondaryButton onClick={() => navigate('/login/success')}>
          Đăng xuất
        </SecondaryButton>
      </div>
    </ScreenWrapper>
  )
}

export default SettingsScreen

