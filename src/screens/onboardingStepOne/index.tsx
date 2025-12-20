import { useNavigate } from 'react-router-dom'

import { ScreenWrapper, Typography } from '../../components/common'
import { PrimaryButton, ProgressBar } from '../../components/ui'

const OnboardingStepOneScreen = () => {
  const navigate = useNavigate()

  return (
    <ScreenWrapper title="Cáp Kèo Sport" subtitle="Kết nối đội phong trào">
      <div className="flex flex-1 flex-col justify-between gap-8 py-4">
        <div className="space-y-4">
          <ProgressBar value={33} />
          <Typography variant="heading">Tìm đội đấu phù hợp</Typography>
          <Typography variant="body">
            Lướt qua các đội gần bạn dựa trên trình độ, sân bãi &amp; lịch rảnh.
          </Typography>
        </div>
        <PrimaryButton onClick={() => navigate('/onboarding/2')}>
          Tiếp tục
        </PrimaryButton>
      </div>
    </ScreenWrapper>
  )
}

export default OnboardingStepOneScreen

