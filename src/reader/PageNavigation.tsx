interface PageNavigationProps {
  currentPage: number
  pageCount: number
  controlsVisible: boolean
  isTransitioning: boolean
  onNext: () => void
  onPrevious: () => void
  onOpenChapters: () => void
  onOpenSettings: () => void
}

export function PageNavigation({
  currentPage,
  pageCount,
  controlsVisible,
  isTransitioning,
  onNext,
  onPrevious,
  onOpenChapters,
  onOpenSettings,
}: PageNavigationProps) {
  const progress = pageCount === 0 ? 0 : ((currentPage + 1) / pageCount) * 100
  const isFirst = currentPage <= 0
  const isLast = currentPage >= pageCount - 1

  return (
    <nav className={`page-navigation${controlsVisible ? '' : ' reading-ui--quiet'}`} aria-label="Controles de lectura">
      <button className="control-icon" type="button" onClick={onOpenChapters} aria-label="Abrir índice" title="Índice">☰</button>
      <span className="control-separator control-desktop-only" />
      <button className="control-icon control-desktop-only" type="button" onClick={onPrevious} disabled={isFirst || isTransitioning} aria-label="Página anterior">‹</button>
      <span className="page-indicator">{pageCount === 0 ? 0 : currentPage + 1} / {pageCount}</span>
      <button className="control-icon control-desktop-only" type="button" onClick={onNext} disabled={isLast || isTransitioning} aria-label="Página siguiente">›</button>
      <span className="control-separator" />
      <span className="progress-mini" aria-label={`Progreso ${Math.round(progress)}%`} role="img">
        <i style={{ width: `${progress}%` }} />
      </span>
      <button className="control-icon control-icon--text" type="button" onClick={onOpenSettings} aria-label="Abrir ajustes" title="Ajustes">Aa</button>
    </nav>
  )
}
