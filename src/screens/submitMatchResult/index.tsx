import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { FormInput, ImageUploader, PrimaryButton } from '../../components/ui'
import { BORDER_RADIUS, CARD, HEADER, ICONS, ICON_SIZES, PADDING, SPACING, SPACE_Y, TYPOGRAPHY } from '../../constants/design'
import type { Match } from '../../types'

const SubmitMatchResultScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [scoreA, setScoreA] = useState('2')
  const [scoreB, setScoreB] = useState('1')
  const [notes, setNotes] = useState('')
  const [images, setImages] = useState<string[]>([])

  // Mock data - sẽ thay bằng API call
  const match: Match = {
    id: id || '1',
    status: 'FINISHED',
    teamA: {
      id: 'team-a',
      name: 'Đội Rực Lửa',
      logo: 'https://via.placeholder.com/100',
      level: '4',
      gender: 'Nam',
    },
    teamB: {
      id: 'team-b',
      name: 'CLB Cây Khế',
      logo: 'https://via.placeholder.com/100',
      level: '4',
      gender: 'Nam',
    },
    date: '28/05/2024',
    time: '20:00',
    location: 'Sân bóng Thống Nhất',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const handleSubmit = () => {
    // TODO: API call to submit match result
    console.log('Submitting match result:', { id, scoreA, scoreB, notes, images })
    navigate(`/match/${id}/finished`)
  }

  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col bg-[#121212] overflow-x-hidden">
      <StandardHeader title="Cập nhật kết quả" />

      {/* Main Content */}
      <main className="flex-1 px-4">
        {/* Match Info Card */}
        <div className={`mt-4 flex items-center justify-between ${SPACING.lg} ${BORDER_RADIUS.lg} bg-[#1E1E1E] ${CARD.padding}`}>
          <div className={`flex flex-col ${SPACING.xs}`}>
            <p className={`${TYPOGRAPHY.body.base} font-bold text-[#E0E0E0]`}>
              {match.teamA.name} vs. {match.teamB.name}
            </p>
            <p className={`${TYPOGRAPHY.body.sm} text-[#888888]`}>
              {match.location}, {match.time} - {match.date}
            </p>
          </div>
          <img
            className="h-14 w-14 shrink-0 rounded-lg object-cover"
            alt="Match venue"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeVi7suKA2YsvInUfQaLyFDJxPcTTUk6J7uCrMUGthkxClK3Jxsn43M9barSLa2jRBpBKjF35gVqbUw7Ln4Vs2smRC-G9VvakzFMwwzSYVIj0_z-xbE1-cCUSOB6v4l6UEuvzNp9JDdJjSt8R3mHekkjRTkQ6nhawkNlFRH5gAzP-C4WJKMwhggVa5i0a3LhqSY8gTXFIOSYcA5sgyrKNbgnb8I63nOoY_5pCXkEr4YtFQPvyT4COfTMmaZBsf4psHUl_0yNk3MzA"
          />
        </div>

        {/* Score Input Section */}
        <section className="mt-6">
          <h2 className={`${TYPOGRAPHY.heading['4']} text-[#E0E0E0]`}>Tỷ số trận đấu</h2>
          <div className={`mt-3 flex items-end ${SPACING.lg}`}>
            <label className="flex flex-1 flex-col">
              <p className={`pb-2 ${TYPOGRAPHY.body.base} font-medium text-[#E0E0E0]`}>{match.teamA.name}</p>
              <input
                className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#333] bg-[#1E1E1E] p-[15px] text-center text-2xl font-bold leading-normal text-[#E0E0E0] placeholder:text-[#888888] focus:border-[#006AF6] focus:outline-0 focus:ring-1 focus:ring-[#006AF6]"
                placeholder="0"
                type="number"
                value={scoreA}
                onChange={(e) => setScoreA(e.target.value)}
              />
            </label>
            <span className="mb-4 text-2xl font-bold text-[#888888]">-</span>
            <label className="flex flex-1 flex-col">
              <p className={`pb-2 ${TYPOGRAPHY.body.base} font-medium text-[#E0E0E0]`}>{match.teamB.name}</p>
              <input
                className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#333] bg-[#1E1E1E] p-[15px] text-center text-2xl font-bold leading-normal text-[#E0E0E0] placeholder:text-[#888888] focus:border-[#006AF6] focus:outline-0 focus:ring-1 focus:ring-[#006AF6]"
                placeholder="0"
                type="number"
                value={scoreB}
                onChange={(e) => setScoreB(e.target.value)}
              />
            </label>
          </div>
        </section>

        {/* Image Uploader Section */}
        <section className="mt-6">
          <ImageUploader maxImages={5} images={images} onImagesChange={setImages} />
        </section>

        {/* Notes Section */}
        <section className="mt-6">
          <label className="flex w-full flex-col">
            <p className={`pb-2 ${TYPOGRAPHY.heading['4']} text-[#E0E0E0]`}>Ghi chú</p>
            <textarea
              className="form-textarea w-full resize-none rounded-lg border border-[#333] bg-[#1E1E1E] p-4 text-base text-[#E0E0E0] placeholder:text-[#888888] focus:border-[#006AF6] focus:outline-0 focus:ring-1 focus:ring-[#006AF6]"
              placeholder="Ghi chú thêm về trận đấu..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </section>
      </main>

      {/* CTA Button */}
      <footer className={`sticky bottom-0 bg-[#121212] ${PADDING.md} pt-2`}>
        <PrimaryButton className="w-full" onClick={handleSubmit}>
          Lưu kết quả
        </PrimaryButton>
      </footer>
    </div>
  )
}

export default SubmitMatchResultScreen
