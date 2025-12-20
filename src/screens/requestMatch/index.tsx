import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { FormInput } from '../../components/ui'
import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { ICONS } from '../../constants/design'

const RequestMatchScreen = () => {
  const navigate = useNavigate()
  const { teamId } = useParams<{ teamId: string }>()
  const [date, setDate] = useState('Thứ Năm, 25/07/2024')
  const [time, setTime] = useState('19:30')
  const [location, setLocation] = useState('Sân bóng đá Tao Đàn, Quận 1')
  const [notes, setNotes] = useState('Team mình đá sân 7, trình độ trung bình...')

  // Mock data - sẽ thay bằng API call
  const yourTeam = {
    name: 'Your Team',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbdvvSPjC_mKUWzWEl1HOLVQH38TSgNaKir6UxjzKnGlbF39HgNxrY9dDkCvDqL9oB_osObTUJWZs-3gE_z-jaxtQTusYp0lrYMVKpBW6I2fL3qbDLgUj2_v011rshfMSVkJ-K_53uOnmZp8ccRanMR3s4_TzDMN4sinI_IfdzSEpZOOPMEvmEQilCZGxM3t__BwnNtqt7El4MeCcyz6x7wKzNcjyzIPTJrkUklFTcB99PsfO_iyVlE7y-a0CW_1OAFvQPNSEL1LU',
  }
  const opponentTeam = {
    name: 'Dragon Fire FC',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rYRwHku5jgTQl3n1J4g0jGgAHJy7dus7Ln2V06_MTeSBEFdI1N2H37GY2FvRHByWqegqHDA_LxMKGPoihYRIcvDL9bimIYucHHNuR_t3KU3H3g8xGIZYlH3SdL8NBBwsulXw3kVNPa8nFdldgHoWmzUJo9ij9Kjan_YI7outh0Z4zE1JMleZRJR2YK0BEuFCQqnuzA03zUZ5ZNl_v1UppCO_r3cJKgSdJum46BAUaMBfB8p9-NVmwphmiATSWenNafDr_PAC22o',
  }

  const handleSubmit = () => {
    // TODO: API call to send match request
    console.log('Sending match request:', { teamId, date, time, location, notes })
    // Navigate to matches tab with capping filter
    navigate('/matches?tab=capping')
  }

  return (
    <div className="flex h-screen flex-col bg-background-dark text-white">
      <StandardHeader title="Tạo Kèo Đấu" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Teams Display */}
        <section className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center gap-2">
              <img
                alt="User's team logo"
                className="size-16 rounded-full border-2 border-primary object-cover"
                src={yourTeam.logo}
              />
              <p className="text-sm font-medium text-white">{yourTeam.name}</p>
            </div>
            <span className="text-2xl font-semibold text-zinc-400">vs</span>
            <div className="flex flex-col items-center gap-2">
              <img
                alt="Opponent team logo"
                className="size-16 rounded-full border-2 border-zinc-600 object-cover"
                src={opponentTeam.logo}
              />
              <p className="text-sm font-medium text-white">{opponentTeam.name}</p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <FormInput
                label="Ngày đá"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Chọn ngày"
                icon={<span className={`material-symbols-outlined text-zinc-400`}>{ICONS.calendar_today}</span>}
              />
            </div>
            <div className="flex-1">
              <FormInput
                label="Giờ đá"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Chọn giờ"
                icon={<span className={`material-symbols-outlined text-zinc-400`}>{ICONS.schedule}</span>}
              />
            </div>
          </div>

          <div>
            <FormInput
              label="Địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nhập địa chỉ sân"
              icon={
                <button className="text-primary" onClick={() => console.log('Open map')}>
                  <span className="material-symbols-outlined">{ICONS.location_on}</span>
                </button>
              }
              onIconClick={() => console.log('Open map')}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Ghi chú</label>
            <textarea
              className="w-full rounded-lg border-zinc-600 bg-surface-dark p-4 text-white placeholder-zinc-500 focus:border-primary focus:ring-primary"
              placeholder="Ví dụ: Team mình đá sân 7, trình độ trung bình..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>

        {/* Preview Section */}
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-medium text-zinc-400">Xem trước lời mời</h2>
          <div className="rounded-lg border border-dashed border-zinc-600 bg-surface-dark/50 p-4">
            <p className="text-sm text-zinc-300">
              ⚽️ <span className="font-bold">{yourTeam.name}</span> muốn đá giao hữu với{' '}
              <span className="font-bold">{opponentTeam.name}</span>!
              <br />
              <br />
              🗓️ <span className="font-bold">Thời gian:</span> {time} - {date}
              <br />
              📍 <span className="font-bold">Địa điểm:</span> {location}
              <br />
              <br />
              <span className="italic">"{notes}"</span>
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
              <span className={`material-symbols-outlined text-base`}>{ICONS.notifications}</span>
              <p>Lời mời sẽ được gửi qua thông báo ứng dụng & Zalo.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-background-dark p-4">
        <div className="flex gap-4">
          <SecondaryButton className="w-1/3" onClick={() => navigate(-1)}>
            Hủy
          </SecondaryButton>
          <PrimaryButton className="w-2/3" onClick={handleSubmit}>
            Gửi lời mời
          </PrimaryButton>
        </div>
      </footer>
    </div>
  )
}

export default RequestMatchScreen

