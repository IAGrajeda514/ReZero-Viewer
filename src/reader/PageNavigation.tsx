import { useEffect, useRef } from 'react'

interface PageNavigationProps {
  currentPage: number
  pageCount: number
  controlsVisible: boolean
  isTransitioning: boolean
  isPagePickerOpen: boolean
  onPagePickerOpenChange: (isOpen: boolean) => void
  onGoToPage: (pageIndex: number) => void
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
  isPagePickerOpen,
  onPagePickerOpenChange,
  onGoToPage,
  onNext,
  onPrevious,
  onOpenChapters,
  onOpenSettings,
}: PageNavigationProps) {
  const progress = pageCount === 0 ? 0 : ((currentPage + 1) / pageCount) * 100
  const isFirst = currentPage <= 0
  const isLast = currentPage >= pageCount - 1
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isPagePickerOpen) return

    const closeFromOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) {
        onPagePickerOpenChange(false)
      }
    }
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onPagePickerOpenChange(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeFromKeyboard)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeFromKeyboard)
    }
  }, [isPagePickerOpen, onPagePickerOpenChange])

  useEffect(() => {
    if (!isPagePickerOpen) return
    pickerRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus()
  }, [isPagePickerOpen])

  return (
    <nav className={`page-navigation${controlsVisible ? '' : ' reading-ui--quiet'}`} aria-label="Controles de lectura">
      <button className="control-icon" type="button" onClick={onOpenChapters} aria-label="Abrir índice" title="Índice">☰</button>
      <span className="control-separator control-desktop-only" />
      <button className="control-icon control-desktop-only" type="button" onClick={onPrevious} disabled={isFirst || isTransitioning} aria-label="Página anterior">‹</button>
      <div className="page-picker" ref={pickerRef}>
        <button
          ref={triggerRef}
          className="page-indicator page-indicator--button"
          type="button"
          disabled={pageCount === 0 || isTransitioning}
          aria-label={`Ir a una página. Página ${pageCount === 0 ? 0 : currentPage + 1} de ${pageCount}`}
          aria-haspopup="dialog"
          aria-expanded={isPagePickerOpen}
          onClick={() => onPagePickerOpenChange(!isPagePickerOpen)}
        >
          {pageCount === 0 ? 0 : currentPage + 1} / {pageCount}
        </button>
        {isPagePickerOpen && (
          <div className="page-picker__popover" role="dialog" aria-label="Seleccionar página">
            <p>Ir a la página</p>
            <div className="page-picker__list">
              {Array.from({ length: pageCount }, (_, pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  aria-current={pageIndex === currentPage ? 'page' : undefined}
                  onClick={() => {
                    onGoToPage(pageIndex)
                    onPagePickerOpenChange(false)
                  }}
                >
                  {pageIndex + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button className="control-icon control-desktop-only" type="button" onClick={onNext} disabled={isLast || isTransitioning} aria-label="Página siguiente">›</button>
      <span className="control-separator" />
      <span className="progress-mini" aria-label={`Progreso ${Math.round(progress)}%`} role="img">
        <i style={{ width: `${progress}%` }} />
      </span>
      <button className="control-icon control-icon--text" type="button" onClick={onOpenSettings} aria-label="Abrir ajustes" title="Ajustes">Aa</button>
    </nav>
  )
}
