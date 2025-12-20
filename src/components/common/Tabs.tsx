import clsx from 'clsx'

type Tab = {
  id: string
  label: string
}

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background-dark pb-3">
      <div className="flex border-b border-[#2A2A2A] px-4 justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 transition-colors',
              activeTab === tab.id
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-[#A0A0A0]'
            )}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs

