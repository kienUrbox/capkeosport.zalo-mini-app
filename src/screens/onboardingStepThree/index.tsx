import { useNavigate } from 'react-router-dom'

import { ScreenWrapper, Typography } from '../../components/common'
import { PrimaryButton, ProgressBar } from '../../components/ui'

const OnboardingStepThreeScreen = () => {
  const navigate = useNavigate()

  return (
    <ScreenWrapper title="Chat & chốt lịch" subtitle="Tối ưu cho đội phong trào">
      <div className="flex flex-1 flex-col justify-between gap-8 py-4">
        <div className="space-y-4">
          <ProgressBar value={100} />
          <Typography variant="heading">Mở phòng chat để cáp kèo</Typography>
          <Typography variant="body">
            Trao đổi trong Match Room, lock sân và xác nhận kết quả ngay trên mini app.
          </Typography>
        </div>
        <PrimaryButton onClick={() => navigate('/login/success')}>
          Bắt đầu ngay
        </PrimaryButton>
      </div>
    </ScreenWrapper>
  )
}

export default OnboardingStepThreeScreen

