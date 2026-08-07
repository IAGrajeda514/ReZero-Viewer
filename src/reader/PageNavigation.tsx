interface PageNavigationProps {
  currentPage: number
  pageCount: number
  onNext: () => void
  onPrevious: () => void
}

export function PageNavigation({ currentPage, pageCount, onNext, onPrevious }: PageNavigationProps) {
  return (
    <nav className="page-navigation" aria-label="Page navigation">
      <button type="button" onClick={onPrevious} disabled={currentPage <= 0}>Previous</button>
      <span>{pageCount === 0 ? 0 : currentPage + 1} / {pageCount}</span>
      <button type="button" onClick={onNext} disabled={currentPage >= pageCount - 1}>Next</button>
    </nav>
  )
}
