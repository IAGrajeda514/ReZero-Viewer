import type { PropsWithChildren } from 'react'

interface ReaderProps extends PropsWithChildren {
  label?: string
}

export function Reader({ children, label = 'Novel reader' }: ReaderProps) {
  return <section className="reader" aria-label={label}>{children}</section>
}
