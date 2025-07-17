'use client';

import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/organisms/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/organisms/data-table/data-table-view-options';
import { X } from 'lucide-react';
import { StatusOptions } from '@/types/status-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  options?: StatusOptions[];
  searchColumn?: string;
}

export function DataTableToolbar<TData>({
  table,
  options,
  searchColumn,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumn && (
          <Input
            placeholder="Search..."
            value={(table.getColumn(searchColumn ?? '')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchColumn ?? '')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {options &&
          options.map((option, index) => (
            <DataTableFacetedFilter
              column={table.getColumn(option.column)}
              title={option.title}
              options={option.options}
              key={index}
            />
          ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 cursor-pointer"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
