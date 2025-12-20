import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { FormInput, FormSelect, PrimaryButton } from '../../components/ui'
import type { Team } from '../../types'

const RematchRequestScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [selectedTeam, setSelectedTeam] = useState('one')
  const [dateTime, setDateTime] = useState('19:00, Thứ Bảy, 25/05/2024')
  const [pitchType, setPitchType] = useState('Sân 7')
  const [notes, setNotes] = useState('')

  // Mock data - sẽ thay bằng API call
  const opponentTeam: Team = {
    id: id || '1',
    name: 'The Legends',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXPRtAL_CNPE8ST1j45YfuZTnaNRY3jtO_lpu9X5vXj-Bsn4QM26vAgXA2bOw97eRpu25WEd8p9Ng0Has_cPYtupglCb0SBDGyCJDZOgLGQ6L8dGvxsmgbfw6rv7CqHn-Q2qq9FjMtaazKYgZdw1Zgcnwax09e_teScGXLoBTio7EHMy0cvfmQw3mZwHRVzYARIYaWktGs47DomkLub10yl5uTeXVKqqfpaxWNaMAcMhHAPjaxJ1vh10mu5LvdwFk3s9bAQtClF4w',
    level: '4',
    gender: 'Nam',
  }

  const yourTeams = [
    { value: 'one', label: 'Ironmen FC' },
    { value: 'two', label: 'Warriors United' },
  ]

  const pitchTypes = ['Sân 5', 'Sân 7', 'Sân 11']

  const handleSubmit = () => {
    // TODO: API call to send rematch request
    console.log('Sending rematch request:', { id, selectedTeam, dateTime, pitchType, notes })
    navigate(`/match/${id}`)
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden bg-background-dark">
      <StandardHeader title="Tạo Kèo Rematch" />

      <main className="flex flex-1 flex-col p-4 pt-4">
        {/* Opponent Display Card */}
        <div className="mb-6">
          <p className="text-text-secondary-dark text-base font-medium leading-normal pb-2 px-1">Đối thủ</p>
          <div className="flex items-center gap-4 bg-component-dark px-4 min-h-16 justify-between rounded">
            <div className="flex items-center gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10"
                style={{ backgroundImage: `url(${opponentTeam.logo})` }}
              />
              <p className="text-text-primary-dark text-base font-normal leading-normal flex-1 truncate">
                {opponentTeam.name}
              </p>
            </div>
            <div className="shrink-0">
              <div className="flex size-7 items-center justify-center">
                <div className="size-3 rounded-full bg-[#0bda5e]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Selector */}
        <div className="mb-6">
          <FormSelect
            label="Đội của bạn"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            options={yourTeams}
          />
        </div>

        {/* Date & Time Picker */}
        <div className="mb-6">
          <FormInput
            label="Thời gian"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            placeholder="Chọn ngày & giờ"
            icon={<span className={`material-symbols-outlined text-2xl`}>{ICONS.calendar_month}</span>}
          />
        </div>

        {/* Pitch Type */}
        <div className="mb-6">
          <p className="text-text-primary-dark text-base font-medium leading-normal pb-2 px-1">Loại sân</p>
          <div className="flex gap-3 flex-wrap">
            {pitchTypes.map((pitch) => (
              <button
                key={pitch}
                onClick={() => setPitchType(pitch)}
                className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full px-4 border ${
                  pitchType === pitch
                    ? 'bg-primary/20 border-primary'
                    : 'bg-component-dark border-border-dark'
                }`}
              >
                <p
                  className={`text-sm font-medium leading-normal ${
                    pitchType === pitch ? 'text-primary' : 'text-text-secondary-dark'
                  }`}
                >
                  {pitch}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Field */}
        <div className="mb-8">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-primary-dark text-base font-medium leading-normal pb-2 px-1">
              Ghi chú (tùy chọn)
            </p>
            <textarea
              className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-component-dark focus:border-primary h-28 placeholder:text-text-secondary-dark p-4 text-base font-normal leading-normal"
              placeholder="Thêm ghi chú cho đối thủ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
      </main>

      {/* CTA Button */}
      <div className="sticky bottom-0 w-full bg-background-dark p-4 pt-2">
        <PrimaryButton className="w-full h-14" onClick={handleSubmit}>
          Gửi Rematch
        </PrimaryButton>
      </div>
    </div>
  )
}

export default RematchRequestScreen
