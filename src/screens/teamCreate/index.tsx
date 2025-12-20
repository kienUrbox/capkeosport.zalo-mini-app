import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { FormInput, PrimaryButton } from '../../components/ui'
import {
  BORDER_RADIUS,
  BUTTON,
  ICONS,
  ICON_SIZES,
  INPUT,
  PADDING,
  SPACING,
  SPACE_Y,
  TYPOGRAPHY,
} from '../../constants/design'

const CreateTeamScreen = () => {
  const navigate = useNavigate()
  const [teamName, setTeamName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [banners, setBanners] = useState<string[]>([])
  const [level, setLevel] = useState<'Gà' | 'Trung bình' | 'Khá' | 'Mạnh'>('Trung bình')
  const [attack, setAttack] = useState(85)
  const [defense, setDefense] = useState(70)
  const [technique, setTechnique] = useState(78)

  const handleLogoUpload = () => {
    // TODO: Implement image upload
    console.log('Upload logo')
    setLogo('https://lh3.googleusercontent.com/aida-public/AB6AXuB9rUj745_jVTuPSs_PV40GM7o7oLvU-5D2ISbYtwy23W2UOFQpVtpuUBpkCGpFMPX-UXa0hjzESLFKKjUuzfCMmlgRub_6URER_SFlfBT9HmPVmTnyzs3Nu5pb9DNrTQ9zbeYalJnZ9Jp9G8Zai9nlwCT1UwsVhBJUlBNOGUbx1pKaQKl_PWWs7zs1QEJMQ84yursTxjsRO9Ut_GJdzfnfapqIJbtgLjo62WqEm1OV1757A8umyhPVRkLtOXv4BTjc804knSavytA')
  }

  const handleBannerUpload = () => {
    // TODO: Implement banner upload
    if (banners.length < 5) {
      console.log('Upload banner')
      setBanners([...banners, 'https://via.placeholder.com/400x300'])
    }
  }

  const handleSubmit = () => {
    // TODO: API call to create team
    console.log('Creating team:', {
      teamName,
      location,
      description,
      logo,
      banners,
      level,
      stats: { attack, defense, technique },
    })
    navigate('/teams')
  }

  const levels: Array<'Gà' | 'Trung bình' | 'Khá' | 'Mạnh'> = ['Gà', 'Trung bình', 'Khá', 'Mạnh']

  return (
    <div className="relative flex min-h-screen w-full flex-col text-text-primary-dark bg-background-dark">
      <StandardHeader title="Tạo đội bóng" />

      {/* Main Content */}
      <main className={`flex flex-col ${SPACING.xl} ${PADDING.md} pb-28`}>
        {/* Section 1: Basic Info */}
        <section className="flex w-full flex-col items-center gap-4">
          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-28 w-28">
              <div
                className={`h-full w-full ${BORDER_RADIUS.full} bg-[#2A2A2A] bg-cover bg-center bg-no-repeat`}
                style={{
                  backgroundImage: logo
                    ? `url(${logo})`
                    : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9rUj745_jVTuPSs_PV40GM7o7oLvU-5D2ISbYtwy23W2UOFQpVtpuUBpkCGpFMPX-UXa0hjzESLFKKjUuzfCMmlgRub_6URER_SFlfBT9HmPVmTnyzs3Nu5pb9DNrTQ9zbeYalJnZ9Jp9G8Zai9nlwCT1UwsVhBJUlBNOGUbx1pKaQKl_PWWs7zs1QEJMQ84yursTxjsRO9Ut_GJdzfnfapqIJbtgLjo62WqEm1OV1757A8umyhPVRkLtOXv4BTjc804knSavytA")',
                }}
              />
              <button
                className={`absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center ${BORDER_RADIUS.full} border-2 border-background-dark bg-primary text-white`}
                onClick={handleLogoUpload}
              >
                <span className={`material-symbols-outlined ${ICON_SIZES.sm}`}>{ICONS.edit}</span>
              </button>
            </div>
            <p className={`${TYPOGRAPHY.body.sm} text-text-secondary-dark`}>Tải lên logo</p>
          </div>

          {/* Team Name */}
          <div className="w-full">
            <FormInput
              label="Tên đội bóng"
              placeholder="Nhập tên đội bóng"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="h-14 border-none bg-[#2A2A2A] focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Banners Upload */}
          <div className="w-full">
            <p className={`pb-2 ${TYPOGRAPHY.body.base} font-medium`}>Banners đội (tối đa 5 ảnh)</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
              {banners.map((banner, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div
                    className="w-full aspect-video rounded-lg bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${banner})` }}
                  />
                </div>
              ))}
              {banners.length < 5 && (
                <button
                  className={`flex w-full items-center justify-center ${BORDER_RADIUS.md} border-2 border-dashed border-[#2A2A2A] aspect-video`}
                  onClick={handleBannerUpload}
                >
                  <span className={`material-symbols-outlined ${ICON_SIZES['2xl']} text-text-secondary-dark`}>
                    {ICONS.add_photo_alternate}
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Details */}
        <section className={`flex flex-col ${SPACING.lg}`}>
          <h2 className={`${TYPOGRAPHY.heading['4']} font-semibold`}>Chi tiết</h2>
          <div className="w-full">
            <FormInput
              label="Địa điểm hoạt động"
              placeholder="Ví dụ: Quận 7, TP.HCM"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-14 border-none bg-[#2A2A2A] focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-full">
            <label className="flex flex-col">
              <p className={`pb-2 ${TYPOGRAPHY.body.base} font-medium`}>Mô tả đội</p>
              <textarea
                className={`form-textarea w-full min-w-0 flex-1 resize-none overflow-hidden ${BORDER_RADIUS.md} border-none bg-[#2A2A2A] ${PADDING.md} ${TYPOGRAPHY.body.base} text-text-primary-dark placeholder:text-text-secondary-dark focus:border-none focus:outline-0 focus:ring-2 focus:ring-primary`}
                placeholder="Giới thiệu về đội bóng của bạn..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
        </section>

        {/* Section 3: Team Rating */}
        <section className={`flex flex-col ${SPACING.xl} ${BORDER_RADIUS.md} bg-[#1E1E1E] ${PADDING.md}`}>
          <h2 className={`${TYPOGRAPHY.heading['4']} font-semibold`}>Đánh giá đội</h2>
          {/* Overall Level */}
          <div className={`flex flex-col ${SPACING.md}`}>
            <p className={`${TYPOGRAPHY.body.base} font-medium`}>Level tổng quan</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  className={`flex ${BUTTON.height.md} cursor-pointer items-center justify-center overflow-hidden ${BORDER_RADIUS.md} px-4 ${TYPOGRAPHY.body.sm} font-bold transition-colors ${
                    level === lvl
                      ? 'bg-primary text-white'
                      : 'bg-[#2A2A2A] text-text-primary-dark hover:bg-primary/20'
                  }`}
                  onClick={() => setLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          {/* Attribute Sliders */}
          <div className={`flex flex-col ${SPACING.xl}`}>
            {[
              { label: 'Tấn công', value: attack, setValue: setAttack, id: 'attack-slider' },
              { label: 'Phòng thủ', value: defense, setValue: setDefense, id: 'defense-slider' },
              { label: 'Kỹ thuật', value: technique, setValue: setTechnique, id: 'technique-slider' },
            ].map((stat) => (
              <div key={stat.id} className="w-full">
                <div className="flex justify-between pb-2">
                  <label className={`${TYPOGRAPHY.body.base} font-medium`} htmlFor={stat.id}>
                    {stat.label}
                  </label>
                  <span className={`font-semibold text-primary`}>{stat.value}</span>
                </div>
                <input
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#2A2A2A] accent-primary"
                  id={stat.id}
                  max={100}
                  min={1}
                  type="range"
                  value={stat.value}
                  onChange={(e) => stat.setValue(Number(e.target.value))}
                />
              </div>
            ))}
      </div>
        </section>
      </main>

      {/* Fixed CTA Button */}
      <footer className={`fixed bottom-0 left-0 right-0 z-10 bg-background-dark/80 ${PADDING.md} backdrop-blur-sm`}>
        <PrimaryButton className={`${BUTTON.height.lg} w-full ${TYPOGRAPHY.heading['4']}`} onClick={handleSubmit}>
          Tạo đội ngay
        </PrimaryButton>
      </footer>
      </div>
  )
}

export default CreateTeamScreen
