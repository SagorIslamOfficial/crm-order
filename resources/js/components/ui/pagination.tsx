import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  className,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = []
    const delta = 2 // Number of pages to show on each side of current page

    // Always show first page
    if (1 < currentPage - delta) {
      pages.push(1)
      if (2 < currentPage - delta) {
        pages.push('...')
      }
    }

    // Show pages around current page
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(lastPage, currentPage + delta);
      i++
    ) {
      pages.push(i)
    }

    // Always show last page
    if (lastPage > currentPage + delta) {
      if (lastPage - 1 > currentPage + delta) {
        pages.push('...')
      }
      pages.push(lastPage)
    }

    return pages
  }

  if (lastPage <= 1) return null

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-2 py-3 sm:px-6",
        className
      )}
      aria-label="Pagination Navigation"
    >
      <div className="flex justify-between flex-1 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{lastPage}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
            <Button
              variant="outline"
              size="sm"
              className="rounded-r-none"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>

            {generatePageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-none",
                      page === currentPage && "pointer-events-none"
                    )}
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="rounded-l-none"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= lastPage}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  )
}
