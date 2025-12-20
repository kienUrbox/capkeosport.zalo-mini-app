import type { ReactNode } from 'react'
import clsx from 'clsx'

type BottomSheetProps = {
  isOpen: boolean
  title?: string
  children: ReactNode
  onClose?: () => void
}

const BottomSheet = ({ isOpen, title, children, onClose }: BottomSheetProps) => {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-40 flex items-end bg-black/40 transition-opacity',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onClose}
    >
      <div
        className="w-full max-h-[90vh] overflow-y-auto rounded-t-3xl bg-surface p-4 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        {title ? (
          <h3 className="text-center text-lg font-semibold text-white">{title}</h3>
        ) : null}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

export default BottomSheet

