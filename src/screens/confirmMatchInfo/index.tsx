import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { FormInput, PrimaryButton } from '../../components/ui'
import type { Match } from '../../types'

const ConfirmMatchInfoScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [stadium, setStadium] = useState('')
  const [address, setAddress] = useState('')
  const [mapLink, setMapLink] = useState('')
  const [notes, setNotes] = useState('')

  // Mock data - sẽ thay bằng API call
  const match: Match = {
    id: id || '1',
    status: 'CONFIRMING',
    teamA: {
      id: 'team-a',
      name: 'Team Alpha',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz4Xz0Cx7Ecxlv6RCND9rdqTF19zQ_OTNAjK893PYO2pn5HYQav2b_W5xorMjGR83D74eL4Io7ZeJocYBlUpPGWMMdHgHs4yfS3u7A2PgQDwippSLp7UL_1wMxL7C5Jnq1ZqY3OLC2sQi6f9RInPUmbUbOoNNoe1Fu_cbAZGlPJLz-iMVuCMzFNCdH5D_4ipRkpqOkbAu9aSanX3onLVdG-Kt-0XaoU0wLmHNcNbULqiEgQLLO8PFnCZaCxn1fVUi_8uixmHmyH9U',
      level: '4',
      gender: 'Nam',
    },
    teamB: {
      id: 'team-b',
      name: 'Team Omega',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJ3BefC4qABkSFqARBmKWb7tzbT49Loh8qB0G0b42um-vIJj9h1NBCD6bevlI9sgI9Lm0LyKLmNYBonEoCyKzAo1BYYzvTeuPKp163XJpeLY1FsIcLWDyZjjMeJEn19WC3KMzovnuPyzfYQJC7BPrNDsRweAgd-PsXj3OfW8sL2vD51UpCY_pwi-kDBfQ4fBdHKoR7llbuHlmBTunApqIJXMoDxaAjX3YSvVFsSNhhocBLt3fitWN0my3E7nGoMHP13F15Qn1NgY',
      level: '4',
      gender: 'Nam',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const handleSubmit = () => {
    // TODO: API call to confirm match
    console.log('Confirming match:', { id, date, time, stadium, address, mapLink, notes })
    navigate(`/match/${id}`)
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <StandardHeader title="Xác nhận Thông tin Kèo" />
      <div className="flex-1 pb-24">

        {/* Match Summary Card */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 p-4">
            <div className="flex flex-1 items-center gap-3">
              <img
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                alt="Team Alpha logo"
                src={match.teamA.logo}
              />
              <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight">{match.teamA.name}</p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">VS</p>
            <div className="flex flex-1 items-center justify-end gap-3">
              <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight text-right">
                {match.teamB.name}
              </p>
              <img
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                alt="Team Omega logo"
                src={match.teamB.logo}
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-1 px-4">
          {/* Date and Time Inputs */}
          <div className="flex w-full flex-wrap items-end gap-4">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Ngày chốt</p>
              <div className="flex w-full flex-1 items-stretch rounded">
                <FormInput
                  className="rounded-r-none border-r-0 pr-2 h-14"
                  placeholder="Chọn ngày"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="text-slate-500 dark:text-slate-400 flex border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/50 items-center justify-center pr-[15px] rounded-r border-l-0">
                  <span className="material-symbols-outlined">{ICONS.calendar_today}</span>
                </div>
              </div>
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Giờ chốt</p>
              <div className="flex w-full flex-1 items-stretch rounded">
                <FormInput
                  className="rounded-r-none border-r-0 pr-2 h-14"
                  placeholder="Chọn giờ"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <div className="text-slate-500 dark:text-slate-400 flex border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/50 items-center justify-center pr-[15px] rounded-r border-l-0">
                  <span className="material-symbols-outlined">{ICONS.schedule}</span>
                </div>
              </div>
            </label>
          </div>

          {/* Stadium Name Input */}
          <div className="flex max-w-full flex-wrap items-end gap-4 pt-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Tên sân</p>
              <FormInput
                className="h-14"
                placeholder="Nhập tên sân vận động"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
              />
            </label>
          </div>

          {/* Address Input */}
          <div className="flex max-w-full flex-wrap items-end gap-4 pt-3">
            <label className="flex flex-col min-w-40 flex-1">
              <div className="flex justify-between items-center pb-2">
                <p className="text-slate-800 dark:text-white text-base font-medium leading-normal">Địa chỉ</p>
                <a
                  className="text-primary text-sm font-semibold"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Open map')
                  }}
                >
                  Mở bản đồ
                </a>
              </div>
              <FormInput
                className="h-14"
                placeholder="Nhập địa chỉ sân"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div>

          {/* Map Link Input */}
          <div className="flex max-w-full flex-wrap items-end gap-4 pt-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">Link bản đồ</p>
              <div className="flex w-full flex-1 items-stretch rounded">
                <FormInput
                  className="rounded-r-none border-r-0 pr-2 h-14"
                  placeholder="https://maps.google.com/..."
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                />
                <div className="text-slate-500 dark:text-slate-400 flex border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/50 items-center justify-center px-4 rounded-r border-l-0">
                  <span className="material-symbols-outlined">{ICONS.map}</span>
                </div>
              </div>
            </label>
          </div>

          {/* Optional Note Textarea */}
          <div className="flex max-w-full flex-wrap items-end gap-4 pt-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">
                Ghi chú (tùy chọn)
              </p>
              <textarea
                className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/50 focus:border-primary placeholder:text-slate-500 dark:placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
                placeholder="Ví dụ: Lệ phí sân 500k/team, ..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
        </div>
        </div>
      </div>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-slate-200/10 dark:border-slate-800/50">
        <PrimaryButton className="w-full h-14" onClick={handleSubmit}>
          Chốt kèo
        </PrimaryButton>
      </div>
    </div>
  )
}

export default ConfirmMatchInfoScreen
