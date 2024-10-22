import { ColumnDef } from '@tanstack/react-table';

import { Call } from '../../../schemas/call';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { callStatuses } from '../data/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Badge,
  CirclePause,
  PhoneIncoming,
  PhoneMissed,
  PlayIcon,
} from 'lucide-react';
import { getCallStatus } from '@/utils/callStatus';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import PlayAudio from '@/components/PlayAudio';
import HandleCall from '@/components/HandleCall';

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: 'call',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      // console.log('Handle call row', row);
      return <HandleCall call={row.original} />;
    },
  },
  {
    accessorKey: 'clientid',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="ml-8"
        column={column}
        title="Client ID"
      />
    ),
    cell: ({ row }) => {
      const clientid = row.getValue('clientid');

      return (
        <div className="flex items-center ml-8">
          {clientid && (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${clientid}`}
                alt={clientid}
                className="rounded-full"
              />
              <AvatarFallback>
                {clientid
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="ml-2">{clientid}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'clientname',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="ml-8"
        column={column}
        title="Client Name"
      />
    ),
    cell: ({ row }) => {
      const clientname = row.getValue('clientname');

      return (
        <div className="flex items-center ml-8">
          {clientname && (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${clientname}`}
                alt={clientname}
                className="rounded-full"
              />
              <AvatarFallback>
                {clientname
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="ml-2">{clientname}</span>
        </div>
      );
    },
  },
];
