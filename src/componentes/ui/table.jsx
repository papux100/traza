import { cn } from '@/lib/utils'

function Table({ className, ...props }) {
  return (
    <div data-slot="table-container" className="facetado w-full overflow-x-auto border">
      <table data-slot="table" className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }) {
  return <thead className={cn('bg-card text-left text-muted-foreground', className)} {...props} />
}

function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

function TableRow({ className, ...props }) {
  return <tr className={cn('border-b transition-colors hover:bg-card/60', className)} {...props} />
}

function TableHead({ className, ...props }) {
  return <th scope="col" className={cn('px-4 py-2.5 font-medium whitespace-nowrap', className)} {...props} />
}

function TableCell({ className, ...props }) {
  return <td className={cn('px-4 py-3 align-middle whitespace-nowrap', className)} {...props} />
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
