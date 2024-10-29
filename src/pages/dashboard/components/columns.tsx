import { ColumnDef } from '@tanstack/react-table';

import { Call } from '../../../schemas/call';
import { DataTableColumnHeader } from '../../clients/components/data-table-column-header';
import { DataTableRowActions } from '../../clients/components/data-table-row-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react';
import { getCallStatus } from '@/utils/callStatus';
import PlayAudio from '@/components/PlayAudio';
import HandleCall from '@/components/HandleCall';
import { Badge } from '@/components/ui/badge';
import { convertDateTime, formatDuration } from '@/utils/dateHelpers';

const getCallIcon = (
  callStatus: string,
  callType: string,
  textColor: string
) => {
  callType = Number(callType);
  if (callType == 1 && callStatus == 3) {
    return <PhoneMissed className={`h-4 w-4 ${textColor}`} />;
  } else if (callType == 1) {
    return <PhoneIncoming className={`h-4 w-4 ${textColor}`} />;
  } else if (callType == 2) {
    return <PhoneOutgoing className={`h-4 w-4 ${textColor}`} />;
  }
};

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: 'call-status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const callStatus = getCallStatus(
        row.original.callstatus,
        row.original.calltype
      );
      const callTypeIcon = getCallIcon(
        row.original.callstatus,
        row.original.calltype,
        callStatus.textColor
      );

      return (
        <div className="flex">
          <HandleCall call={row.original} />

          <Badge variant="secondary" className={callStatus.bgColor}>
            <span className="flex items-center space-x-1">
              {callTypeIcon}
              <span>{callStatus.statusText}</span>
            </span>
          </Badge>
        </div>
      );
    },
  },
  // {
  //   id: 'call-actions',
  //   // header: ({ column }) => (
  //   //   <DataTableColumnHeader column={column} title="Click to call" />
  //   // ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex">
  //         <HandleCall call={row.original} />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'dealerId',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Dealer ID" />
  //   ),
  //   cell: ({ row }) => {
  //     const dealerid = row.original.dealerid;
  //     return <p>{dealerid}</p>;
  //   },
  // },
  {
    accessorKey: 'clientid',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="ml-14"
        column={column}
        title="Client ID"
      />
    ),
    cell: ({ row }) => {
      const clientid = row.getValue('clientid');
      return (
        <div className="flex items-center ml-14">
          {/* {clientid && (
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
          )} */}
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
        <div className="flex ml-5">
          {/* <span>{callType != 1 ? <ArrowDownRight /> : <ArrowUpRight />}</span> */}
          <span className="font-medium">{row.getValue('phonenumber')}</span>
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
    accessorKey: 'starttime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      if (Number(row.getValue('starttime')) <= 0) return null;
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
      if (Number(row.getValue('endtime')) <= 0) return null;
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
    accessorKey: 'remarks',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('remarks')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Call Recording" />
    ),
    cell: ({ row }) => {
      return <PlayAudio row={row.original} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
