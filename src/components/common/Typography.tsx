import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type TypographyVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'body-sm'
  | 'caption'

const typographyMap: Record<TypographyVariant, string> = {
  display: 'text-3xl font-semibold font-display tracking-tight',
  heading: 'text-2xl font-semibold',
  title: 'text-xl font-semibold',
  subtitle: 'text-lg font-medium text-muted',
  body: 'text-base text-slate-100',
  'body-sm': 'text-sm text-slate-300',
  caption: 'text-xs uppercase tracking-wide text-muted',
}

type TypographyProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3'
  variant?: TypographyVariant
}

const Typography = ({
  as: Component = 'p',
  variant = 'body',
  className,
  ...props
}: TypographyProps) => {
  return (
    <Component className={clsx(typographyMap[variant], className)} {...props} />
  )
}

export default Typography

