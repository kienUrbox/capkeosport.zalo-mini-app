import React, { useState, useEffect } from 'react'
import { PrimaryButton, SecondaryButton, Badge, Switch, Typography, Collapse } from '../../components/ui'
import { Team } from '../../types'
import { ION_SIZES, ICONS } from '../../constants/design'

interface FilterOption {
  label: string
  value: string | number | boolean
  icon?: string
  count?: number
}

interface FilterSection {
  title: string
  options: FilterOption[]
  isExpanded?: boolean
  onToggle?: () => void
}

interface AdvancedFiltersProps {
  onApplyFilters?: (filters: Record<string, any>) => void
  onClearFilters?: () => void
  onSearch?: (query: string) => void
  teamCount?: number
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onApplyFilters,
  onClearFilters,
  onSearch,
  teamCount
}) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({
    gender: 'all',
    level: 'all',
    location: 'all',
    distance: 50,
    experience: 'all',
    teamSize: 'all',
    pitchTypes: ['all']
  })

  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({
    'all': 0,
    'matches': 0,
    'teams': 0,
    'requests': 0,
    'notifications': 0
  })

  const clearAllFilters = () => {
    setSelectedFilters({})
    setFilterCounts(prev => ({ ...prev, all: 0 }))
    // Show notification
    onClearFilters?.()
  }

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(prev => !prev)
  }

  const handleFilterToggle = (key: string, value: string | number | boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: prev[key] ? value : !prev[key]
    }))
  }

  const handleSearch = (query: string) => {
    // Simulate search
    console.log(`Searching for: ${query}`)
    // Show notification
    if (onSearch) {
      simulateNewNotification('search', 1)
    }
  }

  const getFilteredTeams = () => {
    // Simulate API call
    const filteredTeams = mockTeams.filter(team => {
      // Apply filters
      let matchesFilter = true
      if (selectedFilters.level !== 'all' && team.level !== 'all') {
        matchesFilter = team.level <= 5
      }
      if (selectedFilters.experience !== 'all' && team.experience !== 'all') {
        matchesFilter = team.experience <= 2
      }
      if (selectedFilters.teamSize !== 'all' && team.teamSize !== 'all') {
        matchesFilter = team.teamSize === 'amateur' ? 10 : 5
      }
    }

    // Combine filters
    const filteredTeams = mockTeams.filter(team => {
      let passesAllFilters = true
      let passesLevelFilter = matchesFilter
      let passesExperienceFilter = matchesFilter
      let passesDistanceFilter = matchesFilter

      // Apply current filters to check if team passes
      passesAllFilters = passesLevelFilter && passesExperienceFilter && passesDistanceFilter
    }

    // Simulate API response
    const searchResults = filteredTeams.length === 0 ? [] : filteredTeams.map((team, index) => ({
        key: team.id,
        team
        distance: selectedFilters.distance
      }))

    if (onSearch) {
      simulateNewNotification('search', searchResults.length)
    }

    return (
      <div className="min-h-screen w-full bg-background text-text-primary p-6">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-surface/95 px-4 py-3 border-b border-border backdrop-blur">
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface/80 hover:bg-surface/70 transition-colors"
          >
            <span className="text-sm text-primary">
              {isAdvancedMode ? 'Thử cơ bản' : 'Tìm nâng cao'}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
            </span>
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-6 space-y-4">
        {/* Gender Filter */}
        <FilterSection
          title="Giới tính"
          isExpanded={selectedFilters.gender !== 'all'}
          options={[
            { label: 'Tất cả', value: 'all', count: filterCounts.teams },
            { label: 'Nam', value: 'men', count: filterCounts.teams },
            { label: 'Nữ', value: 'women', count: filterCounts.teams },
            { label: 'Mixed', value: 'mixed', count: filterCounts.teams }
          ]}
          isExpanded={false}
          onToggle={() => toggleFilter('gender')}
        />
      </FilterSection>

        {/* Level Filter */}
        <FilterSection
          title="Trình độ"
          isExpanded={selectedFilters.level !== 'all'}
          options={[
            { label: 'Cầu 5', value: '5', count: Math.floor(mockTeams.filter(t => t.level === 5) / 10), icon: 'sports_soccer' },
            { label: 'Cầu 4', value: '4', count: Math.floor(mockTeams.filter(t => t.level === 4) / 10), icon: 'military_tech' },
            { label: 'Cầu 3', value: '3', count: Math.floor(mockTeams.filter(t => t.level === 3) / 10), icon: ICONS.school },
            { label: 'Cầu 2', value: '2', count: Math.floor(mockTeams.filter(t => t.level === 2) / 10), icon: 'sports_handball' },
            { label: 'Cầu 1', value: '1', count: Math.floor(mockTeams.filter(t => t.level === 1) / 10), icon: ICONS.star },
            { label: 'Tập bóng', value: '0', count: mockTeams.filter(t => t.level === 0) / 10), icon: 'sports_soccer' },
            { label: 'Non-bóng', value: '-1', count: mockTeams.filter(t => t.level === 0 || !t.level) / 10), icon: ICONS.not_interested },
            { label: 'Kinh doanh', value: '1', count: mockTeams.filter(t => t.level === 1 || !t.level || t.level === '0') / 10), icon: ICONS.business_center }
          ]}
          isExpanded={false}
          onToggle={() => toggleFilter('level')}
        />
      </FilterSection>

        {/* Experience Filter */}
        <FilterSection
          title="Kinh nghiệm"
          isExpanded={selectedFilters.experience !== 'all'}
          options={[
            { label: 'Người chuyên nghiệp', value: 'professional', count: filterCounts.teams },
            { label: 'Sân bóng', value: 'casual', count: filterCounts.teams },
            { label: 'Tấu thủ', value: 'amateur', count: filterCounts.teams },
            { label: 'Học sinh', value: 'beginner', count: filterCounts.teams },
          }
          isExpanded={false}
          onToggle={() => toggleFilter('experience')}
        />
      </FilterSection>

        {/* Team Size Filter */}
        <FilterSection
          title="Quy mô đội"
          isExpanded={selectedFilters.teamSize !== 'all'}
          options={[
            { label: '11 người', value: 11, max: 15 },
            { label: '7 người', value: 7, max: 20 },
            { label: '15 người', value: 7, max: 25 },
            { label: '5 người', value: 5, max: 25 },
            { label: 'Không giới hạn', value: 5, max: 12 },
          { label: 'Đội nghiệp', value: 3, max: 8 },
            { label: '15+ người', value: 20, max: 30 },
            { label: '25+ người', value: 25, max: 30 },
            { label: '30+ người', value: 30, max: 35 },
            { label: 'Không giới hạn', value: 50, max: 50 }
          ]
          isExpanded={false}
          onToggle={() => toggleFilter('teamSize')}
        />
      </FilterSection>

        {/* Pitch Type Filter */}
        <FilterSection
          title="Loại sân"
          isExpanded={selectedFilters.pitchTypes !== 'all'}
          options={[
            { label: '5 người', value: '5', count: 3 },
            { label: '7 người', value: '7', count: 5 },
            { label: '11 người', value: '11', count: 7 },
            { label: 'Sân 11', value: '11', count: 5 },
            { label: 'Đội nghiệp', value: '1', count: 4 },
            { label: 'Lao nghiệp', value: '1', count: 2 },
            { label: 'Thành viên', value: '2', count: 1 },
            { label: 'Giáo dạy', value: '0', count: 1 },
            { label: 'HLV Cấp', value: '0', count: 0 }
          ]
          isExpanded={false}
          onToggle={() => toggleFilter('pitchTypes')}
        />
      </FilterSection>

        {/* Available Filters */}
        <FilterSection
          title="Tình trạng"
          isExpanded={selectedFilters.pitchTypes !== 'all'}
          options={[
            { label: 'Sẵn có sân', value: true },
            { label: 'Không có sân', value: false },
            { label: 'Sân công', value: 'Công cộng', count: filterCounts.teams },
            { label: 'Sân tự do', value: true, count: filterCounts.teams },
            { label: 'Sân trống', value: 'false', count: 1 },
            { label: 'Tin tối', value: 'true', count: filterCounts.teams },
            { label: 'Yếu', value: 'true', count: filterCounts.teams },
          ]
          isExpanded={false}
          onToggle={() => toggleFilter('availability')}
        />
      </FilterSection>

        <div className="flex justify-center gap-4 mt-6">
          <PrimaryButton
            onClick={() => onApplyFilters({
              ...selectedFilters,
              pitchTypes: ['all']
            })}
            className="w-full px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-md transition-colors"
          >
            Áp dụng bộ lọc
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilters