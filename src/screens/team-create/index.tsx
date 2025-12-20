import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Typography } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { ICON_SIZES, ICONS } from '../../constants/design'
import { Team } from '../../types'

type TeamCreationStep = 'basic-info' | 'team-logo' | 'team-members' | 'team-settings'

interface TeamCreationWizardProps {
  onComplete?: (team: Team) => void
}

const steps = [
  {
    id: 'basic-info' as TeamCreationStep,
    title: 'Thông tin cơ bản',
    icon: ICONS.info,
  },
  {
    id: 'team-logo' as TeamCreationStep,
    title: 'Logo đội',
    icon: ICONS.image,
  },
  {
    id: 'team-members' as TeamCreationStep,
    title: 'Thêm thành viên',
    icon: ICONS.group_add,
  },
  {
    id: 'team-settings' as TeamCreationStep,
    title: 'Cài đặt đội',
    icon: ICONS.settings,
  }
]

const TeamCreationWizard: React.FC<TeamCreationWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const [teamData, setTeamData] = useState<Partial<Team>>({
    name: '',
    logo: '',
    level: 'Level 5',
    gender: 'Nam',
    location: '',
    pitch: ['Sân 5'],
    members: []
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Validate current step
      if (currentStep === 0) {
        if (!teamData.name?.trim()) {
          alert('Vui lòng nhập tên đội')
          return
        }
      }

      setCurrentStep(currentStep + 1)
    }
  }

  const renderStepFields = (step: typeof steps[0]) => {
    switch (step.id) {
      case 'basic-info':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tên đội *</label>
              <input
                type="text"
                value={teamData.name || ''}
                onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nhập tên đội của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Cấp độ</label>
              <select
                value={teamData.level || 'Level 5'}
                onChange={(e) => setTeamData({ ...teamData, level: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Level 5">Cầu 5</option>
                <option value="Level 4">Cầu 4</option>
                <option value="Level 3">Cầu 3</option>
                <option value="Level 2">Cầu 2</option>
                <option value="Level 1">Cầu 1</option>
                <option value="Tập bóng">Tập bóng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Giới tính</label>
              <select
                value={teamData.gender || 'Nam'}
                onChange={(e) => setTeamData({ ...teamData, gender: e.target.value as 'Nam' | 'Nữ' | 'Mixed' })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Khu vực</label>
              <input
                type="text"
                value={teamData.location || ''}
                onChange={(e) => setTeamData({ ...teamData, location: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Quận 1, TP.HCM"
              />
            </div>
          </div>
        )
      case 'team-logo':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Avatar
                src={teamData.logo || ''}
                size={120}
                alt="Team Logo"
                className="border-4 border-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">URL Logo</label>
              <input
                type="url"
                value={teamData.logo || ''}
                onChange={(e) => setTeamData({ ...teamData, logo: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        )
      case 'team-members':
        return (
          <div className="space-y-4">
            <Typography variant="body" className="text-white/80">
              Tính năng thêm thành viên sẽ sớm có sẵn! Bạn có thể thêm thành viên sau khi tạo đội.
            </Typography>
            <div className="bg-white/5 rounded-lg p-4">
              <Typography variant="body-sm" className="text-white/60">
                • Mời thành viên qua link Zalo
              </Typography>
              <Typography variant="body-sm" className="text-white/60">
                • Quản lý quyền thành viên
              </Typography>
              <Typography variant="body-sm" className="text-white/60">
                • Theo dõi thống kê cá nhân
              </Typography>
            </div>
          </div>
        )
      case 'team-settings':
        return (
          <div className="space-y-4">
            <div>
              <Typography variant="h6" className="text-white mb-3">Cài đặt thông báo</Typography>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                <Typography variant="body" className="text-white/80">Nhận thông báo khi có lời mời đấu</Typography>
              </label>
            </div>
            <div>
              <Typography variant="h6" className="text-white mb-3">Quyền riêng tư</Typography>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                <Typography variant="body" className="text-white/80">Hiển thị trong danh sách đội gần đây</Typography>
              </label>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderStep = () => {
    const step = steps[currentStep]

    return (
      <div className="min-h-screen w-full bg-background text-text-primary flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-8 gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    index <= currentStep ? 'border-primary bg-primary text-white' : 'border-gray-500 bg-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{step.icon}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${index < currentStep ? 'bg-primary' : 'bg-gray-500'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-surface rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className={`material-symbols-outlined ${ICON_SIZES.xl} text-primary`}>{step.icon}</span>
              <Typography variant="h3" className="text-white">
                {step.title}
              </Typography>
            </div>

            {/* Step Fields */}
            {renderStepFields(step)}

            {/* Navigation */}
            <div className={`flex ${currentStep > 0 ? 'justify-between' : 'justify-end'} mt-8`}>
              {currentStep > 0 && (
                <SecondaryButton onClick={() => setCurrentStep(currentStep - 1)}>
                  Trở về
                </SecondaryButton>
              )}
              {currentStep < steps.length - 1 ? (
                <PrimaryButton
                  onClick={handleNext}
                  disabled={
                    currentStep === 0 && !teamData.name?.trim()
                  }
                  className="w-auto"
                >
                  Tiếp theo
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  onClick={() => {
                    if (teamData.name?.trim()) {
                      onComplete?.(teamData as Team)
                      navigate('/team')
                    }
                  }}
                  disabled={!teamData.name?.trim()}
                  className="w-auto"
                >
                  Hoàn tất
                </PrimaryButton>
              )}
            </div>
          </div>

          {/* Team Preview */}
          {currentStep === 1 && teamData.name && (
            <div className="mt-8 bg-surface/50 rounded-lg p-6">
              <Typography variant="h4" className="text-white mb-4">
                Xem trước đội mới
              </Typography>
              <div className="flex items-center gap-4">
                <Avatar
                  src={teamData.logo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwWYL437-AK5yOluzRDTckum_YBigB4xWzcvDdOuHq2ZKiiCFVFQI6uMprCv0O8-aAE98O4dhoFRSEmeVHdVhy6apxDuBO6Ov3vvLDjsUsYuRSeI_DZkcsYC6InxAo1TKFMKC33soOFrRRgD5zdlhFAb-elv4f2xdiBL2YaVfwmHY5jqpilsJvh_p990lZA2TZCkOL3X640lWAReazHhIt320N9N02YZ0N2aMPMH0FKHFq9yWCkKxW5C-vXlmxYsCSn3_6Z4KD8Ac'}
                  size={60}
                  alt="Team Logo"
                />
                <div>
                  <Typography variant="h3" className="text-white">{teamData.name}</Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <Typography variant="caption" className="text-white/80">{teamData.level}</Typography>
                    <span className="text-white/40">•</span>
                    <Typography variant="caption" className="text-white/80">{teamData.gender}</Typography>
                    <span className="text-white/40">•</span>
                    <Typography variant="caption" className="text-white/80">{teamData.location || 'Chưa có khu vực'}</Typography>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Typography variant="caption" className="text-white/60">{teamData.members?.length || 0} thành viên</Typography>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return renderStep()
}

export default TeamCreationWizard