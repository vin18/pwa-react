import { PhoneIncoming, PhoneMissed } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { columns } from '@/pages/dashboard/components/columns';

export const getCallIcon = (type: string) => {
  switch (type) {
    case 'incoming':
    case 'accepted':
    case 'outgoing':
    case 'initial':
      return <PhoneIncoming className="h-4 w-4 text-green-500" />;

    case 'missed':
    case 'rejected':
    case 'terminated':
      return <PhoneMissed className="h-4 w-4 text-red-500" />;

    case 'in progress':
    case 'established':
      return <PhoneMissed className="h-4 w-4 text-yellow-500" />;

    // default:
    //   return <Phone className="h-4 w-4" />;
  }
};

export const getCallTypeColor = (type: string) => {
  switch (type) {
    case 'incoming':
    case 'accepted':
    case 'outgoing':
    case 'initial':
      return 'bg-yellow-100 text-yellow-800';

    case 'missed':
    case 'rejected':
    case 'terminated':
      return 'bg-red-100 text-red-800';

    case 'in progress':
    case 'established':
      return 'bg-green-100 text-green-800';

    // default:
    //   return 'bg-gray-100 text-gray-800';
  }
};

export default function CallLogDesktop({ table }) {
  return (
    <div className="py-10">
      {/* <h1 className="text-2xl font-bold mb-2">Recent calls</h1>
      <Input
        className="max-w-sm mb-4"
        placeholder="Search calls..."
        type="search"
      /> */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
