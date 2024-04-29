import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  pagesAroundCurrent: number;
};

const Paginator = ({ currentPage, totalPages, pagesAroundCurrent }: PaginatorProps) => {
  const pageArray = Array.from({ length: pagesAroundCurrent * 2 + 1 }, (_, i) => currentPage - pagesAroundCurrent + i)
    .filter((page) => page > 1)
    .filter((page) => page < totalPages);

  const hasHiddenLeft = (pageArray.length > 0 ? pageArray[0] - 1 - 1 : 0) > 0;
  const hasHiddenRight = (pageArray.length > 0 ? totalPages - pageArray[pageArray.length - 1] - 1 : 0) > 0;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <div
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'hover: pointer-events-none gap-1 pl-2.5 text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </div>
          ) : (
            <Link
              to="/posts"
              search={{ page: currentPage - 1 }}
              className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Link>
          )}
        </PaginationItem>
        <PaginationItem>
          <Link
            to="/posts"
            search={{ page: 1 }}
            className={cn(buttonVariants({ variant: currentPage === 1 ? 'outline' : 'ghost', size: 'icon' }))}
            aria-current={currentPage === 1 ? 'page' : undefined}
          >
            1
          </Link>
        </PaginationItem>

        {hasHiddenLeft && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pageArray.map((page) => (
          <PaginationItem key={page}>
            <Link
              to="/posts"
              search={{ page: page }}
              className={cn(buttonVariants({ variant: currentPage === page ? 'outline' : 'ghost', size: 'icon' }))}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Link>
          </PaginationItem>
        ))}

        {hasHiddenRight && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages !== 1 && (
          <PaginationItem>
            <Link
              to="/posts"
              search={{ page: totalPages }}
              className={cn(
                buttonVariants({ variant: currentPage === totalPages ? 'outline' : 'ghost', size: 'icon' }),
              )}
              aria-current={currentPage === totalPages ? 'page' : undefined}
            >
              {totalPages}
            </Link>
          </PaginationItem>
        )}

        <PaginationItem>
          {currentPage === totalPages ? (
            <div
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'gap-1 pl-2.5 text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
              )}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          ) : (
            <Link
              to="/posts"
              search={{ page: currentPage + 1 }}
              className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
              aria-label="Go to next page"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
