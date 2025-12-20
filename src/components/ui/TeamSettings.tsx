import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'
import { PrimaryButton, SecondaryButton, Switch } from '../../components/ui'
import { useUnreadCount } from '../../hooks/useUnreadCount'
import { Team, TeamSettings } from '../../types'

interface TeamSettingsProps {
  team: Team
  settings?: TeamSettings
  onBack?: () => void
  onSave?: (settings: TeamSettings) => void
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ team, settings, onBack, onSave }) => {
  const navigate = useNavigate()
  const { simulateNewNotification } = useUnreadCount()
  const [localSettings, setLocalSettings] = useState<TeamSettings>(settings || {})

  const handleSave = (newSettings: TeamSettings) => {
    setLocalSettings(newSettings)
    onSave?.(newSettings)
    simulateNewNotification('settings', 1)
  }

  const toggleSetting = (key: keyof TeamSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getNotificationStatus = (key: keyof TeamSettings) => {
    const current = localSettings[key]
    if (current) return 'bg-green-500/20 text-green-400'
    if (!current) return 'bg-gray-500/20 text-gray-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  const notificationSettings = [
    {
      id: 'matchNotifications',
      label: 'Thông báo trận đấu',
      description: 'Nhận thông báo khi có trận đấu mới',
      icon: 'sports_soccer',
      key: 'matchNotifications'
    },
    {
      id: 'teamNotifications',
      label: 'Thông báo đội',
      description: 'Nhận thông báo về hoạt động đội',
      icon: 'groups',
      key: 'teamNotifications'
    },
    {
      id: 'generalNotifications',
      label: 'Thông báo chung',
      description: 'Các thông báo hệ thống',
      icon: 'notifications',
      key: 'generalNotifications'
    },
    {
      id: 'locationSharing',
      label: 'Chia sẻ vị trí',
      description: 'Cho phép chia sẻ vị trí đội',
      icon: 'location_on',
      key: 'locationSharing'
    },
    {
      id: 'dataPrivacy',
      label: 'Quyền riêng dữ liệu',
      description: 'Cài đặt quyền riêng tư dữ liệu',
      icon: 'security',
      key: 'dataPrivacy'
    }
  ]

  return (
    <div className="min-h-screen w-full bg-background text-text-primary">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-surface/95 px-4 py-3 border-b border-border backdrop-blur safe-area-top">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 text-muted hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>

        <Typography variant="subtitle" className="text-white truncate text-center px-3">
          Cài đặt
        </Typography>
      </div>

      {/* Settings Header */}
      <div className="sticky top-16 z-10 bg-surface/95 backdrop-blur">
        <div className="px-4 py-6 border-b border-border">
          <Typography variant="h3" className="text-white text-center mb-6">
            Cài đặt
          </Typography>

          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between py-4 border-b border-border hover:bg-surface/50">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`material-symbols-outlined ${ICON_SIZES.sm} ${getNotificationStatus(setting.key)}`}>
                      {setting.icon}
                    </span>
                    <Typography variant="body-sm" className="text-white text-current/80 truncate">
                      {setting.label}
                    </Typography>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-current/60 px-2 py-1 bg-white rounded-lg">
                      {setting.description}
                    </span>
                  </div>
                  <Switch
                    checked={localSettings[setting.key]}
                    onChange={() => toggleSetting(setting.key)}
                    className="ml-2"
                  />
                </div>
              </div>
            ))}
          </div>

        {/* Save Button */}
        <div className="p-6">
          <PrimaryButton
            onClick={() => handleSave(localSettings)}
            className="w-full justify-center"
          >
            Lưu thay đổi
          </PrimaryButton>
        </div>
      </div>

      {/* Notification List */}
      <div className="p-6">
        {localSettings.matchNotifications && (
          <div className="bg-green-500/10 text-green-400 border-2 border-green-500/20 px-4 py-3 rounded-lg flex items-center justify-between">
            <Typography variant="body-sm" className="text-white">
              <span className="material-symbols-outlined">sports_soccer</span>
              <span className="ml-2">Thông báo trận đấu</span>
            </Typography>
            <SecondaryButton
              onClick={() => toggleSetting('matchNotifications')}
              className="p-2 rounded-lg bg-surface/80 hover:bg-surface/70"
            >
              {localSettings.matchNotifications ? 'Tắt' : 'Bật'}
            </SecondaryButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamSettings