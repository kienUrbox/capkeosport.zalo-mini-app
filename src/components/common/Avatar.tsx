import clsx from 'clsx'

type AvatarProps = {
  size?: 'sm' | 'md' | 'lg'
  imageUrl?: string
  initials?: string
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
}

const Avatar = ({ size = 'md', imageUrl, initials = 'CT' }: AvatarProps) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="avatar"
        className={clsx('rounded-full object-cover', sizeMap[size])}
      />
    )
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-card font-semibold text-white',
        sizeMap[size],
      )}
    >
      {initials}
    </div>
  )
}

export default Avatar

