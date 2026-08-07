import type { PropsWithChildren } from 'react'

interface ReaderPageProps extends PropsWithChildren {
  pageNumber?: number
}

export function ReaderPage({ children, pageNumber }: ReaderPageProps) {
  return <article className="reader-page" data-page-number={pageNumber}>{children}</article>
}
