import { useState } from 'react'

import { BottomSheet, Typography } from '../../components/common'
import { PrimaryButton } from '../../components/ui'

type TeamSelectBottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (teamId: string) => void
}

const teams = [
  {
    id: 'slayers',
    name: 'Slayers FC',
    role: 'Quản lý',
    badge: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=facearea&w=200',
  },
  {
    id: 'wolves',
    name: 'The Wolves',
    role: 'Đội trưởng',
    badge: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=facearea&w=200',
  },
  {
    id: 'gryff',
    name: 'Gryffindor',
    role: 'Thành viên',
    badge: 'https://images.unsplash.com/photo-1508182311256-e3f9c5cf7a5e?auto=format&fit=facearea&w=200',
  },
]

const TeamSelectBottomSheet = ({
  isOpen,
  onClose,
  onSelect,
}: TeamSelectBottomSheetProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('slayers')

  return (
    <BottomSheet isOpen={isOpen} title="">
      <div
        className="h-44 rounded-2xl bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%), url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=60')",
        }}
      />
      <div className="mt-4 flex items-center justify-between px-2 text-white">
        <Typography variant="heading" className="text-white">
          Bạn muốn cáp kèo cho đội nào?
        </Typography>
        <button className="text-sm text-muted" onClick={onClose}>
          Hủy
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {teams.map((team) => {
          const selected = team.id === selectedTeam
          return (
            <button
              key={team.id}
              className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left ${
                selected ? 'border-primary bg-primary/10' : 'border-transparent bg-card/60'
              }`}
              onClick={() => setSelectedTeam(team.id)}
            >
              <img
                src={team.badge}
                alt={team.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-base font-semibold text-white">{team.name}</p>
                <p className="text-sm text-muted">{team.role}</p>
              </div>
              <span
                className={`h-6 w-6 rounded-full border ${
                  selected ? 'border-primary bg-primary' : 'border-muted'
                }`}
              />
            </button>
          )
        })}
      </div>
      <PrimaryButton className="mt-6" onClick={() => onSelect(selectedTeam)}>
        Chọn đội này
      </PrimaryButton>
    </BottomSheet>
  )
}

export default TeamSelectBottomSheet

