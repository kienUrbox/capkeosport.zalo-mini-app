type QuickActionCardProps = {
  icon: string
  label: string
  onClick?: () => void
}

const QuickActionCard = ({ icon, label, onClick }: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-border bg-card/60 p-4 text-center text-white transition hover:border-primary/40 hover:bg-card/80"
    >
      <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}

export default QuickActionCard

