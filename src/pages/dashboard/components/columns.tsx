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

function convertDateTime(dateTimeEpoch) {
  const dateTime = new Date(Number(dateTimeEpoch) * 1000);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1; // Months are zero-based, so add 1
  const day = dateTime.getDate();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600); // Calculate hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate remaining minutes
  const remainingSeconds = seconds % 60; // Calculate remaining seconds

  // Ensure two-digit formatting for minutes and seconds
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

const getCallIcon = (type: string) => {
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

const getCallTypeColor = (type: string) => {
  switch (type) {
    case 'incoming':
    case 'accepted':
    case 'outgoing':
    case 'initial':
      return 'bg-green-100 text-green-800';

    case 'missed':
    case 'rejected':
    case 'terminated':
      return 'bg-red-100 text-red-800';

    case 'in progress':
    case 'established':
      return 'bg-yellow-100 text-yellow-800';

    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: 'sessionid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue('sessionid')}</div>;
    },
    enableSorting: false,
    enableHiding: false,
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
    accessorKey: 'phonenumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('phonenumber')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const durationEpoch =
        Number(row.getValue('endtime')) - Number(row.getValue('starttime'));
      let duration = formatDuration(durationEpoch);

      if (
        Number(row.getValue('starttime')) <= 0 ||
        Number(row.getValue('endtime')) <= 0
      ) {
        duration = '0:00';
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{duration}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'callstatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const callStatus = Number(row.getValue('callstatus'));
      const callStatusText: string = getCallStatus(callStatus);
      const status = callStatuses.find(
        (status) => status.callStatus === Number(row.getValue('callstatus'))
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {/* {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{status.label}</span>
          {/* Incoming */}

          {/* <Badge
            variant="secondary"
            className={getCallTypeColor(callStatusText.toLowerCase())}
          >
            <span className="flex items-center space-x-1">
              {getCallIcon(callStatusText.toLowerCase())}&nbsp;
              <span>
                {callStatusText.charAt(0).toUpperCase() +
                  callStatusText.slice(1)}
              </span>
            </span>
          </Badge> */}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'starttime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      if (row.getValue('starttime') <= 0) return null;
      const formattedStartTime = convertDateTime(row.getValue('starttime'));

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedStartTime}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'endtime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      if (row.getValue('endtime') <= 0) return null;
      const formattedEndTime = convertDateTime(row.getValue('endtime'));

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedEndTime}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    // header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ row }) => {
      return <PlayAudio />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
