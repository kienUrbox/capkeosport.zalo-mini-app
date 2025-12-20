import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import { PrimaryButton } from '../../components/ui'
import { BORDER_RADIUS, CARD, HEADER, ICONS, ICON_SIZES, PADDING, SPACING, TYPOGRAPHY } from '../../constants/design'

type Team = {
  id: string
  name: string
  logo: string
  role: 'Admin' | 'Member'
  level: string
  pitch: string
  location: string
}

const MyTeamsScreen = () => {
  const navigate = useNavigate()

  // Mock data - sẽ thay bằng API call
  const teams: Team[] = [
    {
      id: '1',
      name: 'Red Bull FC',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBduQnBiizHz1_nI2bbDrlX82IYdJylmeLRpzUq_L_KM5Ok2D4Dso8aiRF9FimuRlzyoWOcJwY9EGgaBX9Jftqf2-KqUbRLW_IAT8ie7mrCg0cug4HwwkbagA7UZUDhywPixck4T0X2NDplc7mUnNY0NJ1t3vxLUdIY0FZ3YoUohhWPDTAYDiuELlc26Ug7RKxpw0Y0q4WGX2P3dzXF3wlW4tQNRH66Mxw6jfaDW89ywRkbfGBXD5jxlu7l2fvQ2eA41plmaCRauE4',
      role: 'Admin',
      level: 'Level A',
      pitch: '5,7',
      location: 'Q7',
    },
    {
      id: '2',
      name: 'Saigon United',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjeSr5GcsjaWI8weHiqJbxmOF3q59U9B_KAueSBc6Cmoyob_LnWglRMZ8hKw-VuSyejDTmFVuFflEcDKvh7XQoVzzAURlv1nbacXTepLmly9Agvo5JrS2oBdD5BR_-kd785He01hcYCCnAEz3zBUhMMQAGaHBX5qbsqyfUUIVUe0Vu2ec7MT3WrNJPw5gvCJzKUNCO1W3wVJdjl_UQeLjcK2O69hl4k9ggQxHdBl3DAkcfoHjs9kDuNxWmgXZefcVRHrnirOA0xEw',
      role: 'Member',
      level: 'Level A',
      pitch: '5,7',
      location: 'Q7',
    },
    {
      id: '3',
      name: 'The Gunners Vietnam',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA16E-IVLTeZUDC3sLOrP7RPkSfcq7p26IewhxiHOvUNgFDBptFVvaCmvo7lKM5NL5jgssTbAhCBDZS7eaIEFp8uqvzNS9xeHVqMYtEvcu6TCMHqD0eqDHE0tjzDCeE8tQuht8vBLCBEadFiYsOOU7P9j1LgJ_9eUM319x7h8sd8e8FqvhPJouOJmN-kznA1bnbljEQyFjBK0tqSBPDDFWhXNBzkmIef4tJ4irYNyCtZUBERsJlsao0czswnmYZHBqt-ffj7NHGNaA',
      role: 'Member',
      level: 'Level A',
      pitch: '5,7',
      location: 'Q7',
    },
  ]

  if (teams.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <div className={`sticky top-0 z-10 flex items-center justify-between bg-background-dark/80 ${PADDING.md} py-3 backdrop-blur-sm`}>
          <h1 className={`${TYPOGRAPHY.heading['3']} text-white`}>Đội của tôi</h1>
          <button
            className={`flex items-center justify-center ${SPACING.xs} ${BORDER_RADIUS.full} h-8 px-3 bg-primary text-white ${TYPOGRAPHY.body.sm} font-semibold`}
            onClick={() => navigate('/team/create')}
          >
            <span className={`material-symbols-outlined ${ICON_SIZES.base}`}>{ICONS.add}</span>
            <span>Tạo đội mới</span>
          </button>
        </div>
        <div className={`mt-8 ${PADDING.md} py-6`}>
          <EmptyState
            icon={
              <img
                alt="Empty teams illustration"
                className="w-full max-w-[280px]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAARwZNYCRpmDY9PCsMiVLFls_t91X5XtI99akvfUc3TMEVL5Re27ZIFVQAvanFXq8cC-EpT22A7g8qGpda3P8Fqxdkh-WoBSVIs_t-kgR2y4w3AEgQyOj_WEIMhkWlijZmxDEIakRD6O46m5naSh0gyhHUNHXgRvvtpvddbhRbUifhcOiCBhHoo-DtXZnKoAnUR7SYUFZraPm__DmIjpd6_YD7m-dCBbRZkk35VvmGPPlUmMOcTzcCt6SpG-b7fHaSaertXjJ5KIE"
              />
            }
            title="Bạn chưa tham gia đội nào"
            description="Hãy tạo đội bóng của riêng bạn hoặc tham gia một đội có sẵn nhé!"
            actionLabel="Tạo đội mới"
            onAction={() => navigate('/team/create')}
          />
          <div className={`flex w-full max-w-xs flex-col ${SPACING.md} mt-6 mx-auto`}>
            <PrimaryButton className="w-full" onClick={() => navigate('/team/create')}>
              <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>{ICONS.add}</span>
              <span>Tạo đội mới</span>
            </PrimaryButton>
            <button
              className={`flex w-full cursor-pointer items-center justify-center ${SPACING.sm} overflow-hidden ${BORDER_RADIUS.full} h-12 px-6 bg-[#2A2A2A] text-white ${TYPOGRAPHY.body.base} font-bold`}
              onClick={() => {
                // TODO: Navigate to search teams
                console.log('Search teams')
              }}
            >
              <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>search</span>
              <span>Tìm đội tham gia</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Header */}
      <div className={`sticky top-0 z-10 flex items-center justify-between bg-background-dark/80 ${PADDING.md} py-3 backdrop-blur-sm`}>
        <h1 className={`${TYPOGRAPHY.heading['3']} text-white`}>Đội của tôi</h1>
        <button
          className={`flex items-center justify-center ${SPACING.xs} ${BORDER_RADIUS.full} h-8 px-3 bg-primary text-white ${TYPOGRAPHY.body.sm} font-semibold`}
          onClick={() => navigate('/team/create')}
        >
          <span className={`material-symbols-outlined ${ICON_SIZES.base}`}>{ICONS.add || 'add'}</span>
          <span>Tạo đội mới</span>
        </button>
      </div>

      {/* Teams List */}
      <div className={`flex flex-col ${SPACING.md} ${PADDING.md}`}>
        {teams.map((team) => (
          <button
            key={team.id}
            className={`flex cursor-pointer items-center ${SPACING.lg} ${BORDER_RADIUS.md} bg-[#2A2A2A] ${CARD.padding} transition-all hover:bg-white/10`}
            onClick={() => navigate(`/my-team/${team.id}`)}
          >
            <div
              className={`bg-center bg-no-repeat aspect-square bg-cover ${BORDER_RADIUS.full} h-14 w-14 shrink-0`}
              style={{ backgroundImage: `url(${team.logo})` }}
            />
            <div className="flex-1 overflow-hidden">
              <div className={`flex items-center ${SPACING.sm}`}>
                <p className={`text-white ${TYPOGRAPHY.body.base} font-medium truncate`}>{team.name}</p>
                <span
                  className={`${TYPOGRAPHY.caption} font-medium ${
                    team.role === 'Admin' ? 'text-primary bg-primary/20' : 'text-[#A9A9A9] bg-white/10'
                  } px-2 py-0.5 ${BORDER_RADIUS.full} shrink-0`}
                >
                  {team.role === 'Admin' ? 'Admin' : 'Member'}
                </span>
              </div>
              <p className={`text-[#A9A9A9] ${TYPOGRAPHY.body.sm} truncate mt-1`}>
                {team.level} • Sân: {team.pitch} • Khu vực: {team.location}
              </p>
            </div>
            <div className="shrink-0">
              <span className={`material-symbols-outlined text-[#A9A9A9] ${ICON_SIZES.base}`}>
                {ICONS.chevron_right}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MyTeamsScreen
