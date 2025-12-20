import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'
import Tag from './Tag'
import Badge from './Badge'
import { Team, TeamStats, TeamAchievement } from '../../types'
import useUnreadCount from '../../hooks/useUnreadCount'
import { STAT_TYPES } from '../../constants/design'

interface TeamProfileProps {
  team: Team
  variant?: 'detailed' | 'compact' | 'minimal'
  showStats?: boolean
  showMembers?: boolean
  showActions?: boolean
  showAchievements?: boolean
  maxMembers?: number
  isLoading?: boolean
  onEdit?: () => void
  onInvite?: () => void
  onLeaveTeam?: () => void
  onSettings?: () => void
  onMemberAction?: (memberId: string, action: string) => void
}

interface TeamStatsProps {
  stats: NonNullableObject<TeamStats>
  compact?: boolean
}

interface TeamAchievementProps {
  achievement: TeamAchievement
  compact?: boolean
  isNew?: boolean
}

interface MemberCardProps {
  member: {
    id: string
    name: string
    initials: string
    avatar?: string
    position?: string
    isCaptain?: boolean
    isOnline?: boolean
  }
  variant?: 'detailed' | 'compact'
  showActions?: boolean
  onActionClick?: (memberId: string, action: string) => void
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  variant = 'detailed',
  showActions = true,
  onActionClick
}) => {
  const getStatusColor = (isCaptain?: boolean, isOnline?: boolean) => {
    if (isCaptain) return 'text-yellow-400'
    if (isOnline) return 'text-green-400'
    return 'text-gray-400'
  }

  const getPositionIcon = (position?: string) => {
    switch (position) {
      case 'Thủ môn': return ICONS.sports_soccer
      case 'Tiền đạo': return ICONS.military_tech
      case 'Hậu vệ': return ICONS.security
      default: return ICONS.shield_person
    }
  }

  const getPositionColor = (position?: string) => {
    switch (position) {
      case 'Thủ môn': return 'bg-amber-500/20 text-amber-400'
      case 'Tiền đạo': return 'bg-blue-500/20 text-blue-400'
      case 'Hậu vệ': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className={`relative border-border bg-surface rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${
      variant === 'compact' ? 'p-4' : 'p-6'
    }`}>
      {/* Captain Badge */}
      {member.isCaptain && (
        <div className="absolute top-2 right-2">
          <Badge count={1} variant="warning" size="sm" className="bg-amber-500/20 text-amber-400 border-amber-600" />
        </div>
      )}

      {/* Status Indicators */}
      {member.isOnline && (
        <div className="absolute bottom-2 left-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar
            src={member.avatar}
            size={variant === 'compact' ? 'sm' : 'lg'}
            initials={member.initials}
            className={`ring-2 ${getStatusColor(member.isCaptain, member.isOnline)}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start">
            <Typography variant="subtitle" className="text-white truncate font-medium leading-tight">
              {member.name}
            </Typography>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs text-muted px-2 py-1 rounded-full ${
                getPositionColor(member.position)
              }`}>
                {getPositionIcon(member.position)}
              </span>
              <Typography variant="body-sm" className="text-muted">
                {member.position}
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {variant !== 'minimal' && showStats && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <TeamStats stats={{
            attack: 80,
            defense: 75,
            technique: 85,
          }} compact={variant === 'compact'} />
        </div>
      )}

      {/* Members Section */}
      {variant !== 'minimal' && showMembers && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" className="text-white font-bold leading-tight tracking-[-0.015em]">
              Thành viên ({member.members?.length || 0}/{member.maxMembers || 999})
            </Typography>
            <button
              onClick={() => onInvite?.()}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined !text-base">person_add</span>
              <Typography variant="body-sm" className="text-white">Mời thành viên</Typography>
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {member.members?.slice(0, variant === 'compact' ? 3 : 6).map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                variant={variant}
                showActions={showActions}
                onActionClick={onMemberAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {variant !== 'minimal' && showAchievements && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" className="text-white font-bold leading-tight tracking-[-0.015em]">
              Thành tựu
            </Typography>
            <button
              onClick={() => onSettings?.()}
              className="p-2 rounded-lg bg-current/20 text-white hover:bg-current/30 transition-colors"
            >
              <span className="material-symbols-outlined !text-base">tune</span>
              <Typography variant="body-sm" className="text-white">Cài đặt</Typography>
            </button>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-3 gap-4">
            <TeamAchievement
              achievement={{
                title: 'First Match Win',
                description: 'Won first match',
                icon: 'emoji_events',
                date: '15/10/2024',
                variant: 'bronze'
              }}
              compact={variant === 'compact'}
            />
            <TeamAchievement
              achievement={{
                title: '5 Match Win Streak',
                description: 'Won 5 matches in a row',
                icon: 'local_fire_department',
                date: '20/10/2024',
                variant: 'silver'
              }}
              compact={variant === 'compact'}
              isNew
            />
            <TeamAchievement
              achievement={{
                title: 'Team of the Month',
                description: 'Best team in October 2024',
                icon: 'military_tech',
                date: '01/11/2024',
                variant: 'gold'
              }}
              compact={variant === 'compact'}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && variant !== 'minimal' && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEdit?.()}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined !text-base">edit</span>
            <Typography variant="body-sm" className="text-white">Chỉnh sửa</Typography>
          </button>
          <button
            onClick={() => onLeaveTeam?.()}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <span className="material-symbols-outlined !text-base">logout</span>
            <Typography variant="body-sm" className="text-white">Rời đội</Typography>
          </button>
        </div>
      )}
    </div>
  )
}

export default TeamProfile