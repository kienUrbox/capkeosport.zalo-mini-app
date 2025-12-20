import { useNavigate } from 'react-router-dom'

import { ScreenWrapper, Typography } from '../../components/common'
import { PrimaryButton, ProgressBar } from '../../components/ui'

const OnboardingStepTwoScreen = () => {
  const navigate = useNavigate()

  return (
    <ScreenWrapper title="Cáp kèo tức thì" subtitle="Hẹn lịch nhanh chóng">
      <div className="flex flex-1 flex-col justify-between gap-8 py-4">
        <div className="space-y-4">
          <ProgressBar value={66} />
          <Typography variant="heading">Quẹt trái phải để ghép kèo</Typography>
          <Typography variant="body">
            Đội bạn sẽ được đề xuất dựa trên phong cách chơi, lịch rảnh và địa điểm yêu thích.
          </Typography>
        </div>
        <PrimaryButton onClick={() => navigate('/onboarding/3')}>
          Tiếp tục
        </PrimaryButton>
      </div>
    </ScreenWrapper>
  )
}

export default OnboardingStepTwoScreen

