import { PhoneIncoming, PhoneMissed, PhoneIcon } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCallStatus } from '@/utils/callStatus';
import { Button } from './ui/button';
import { SIP_URL } from '@/App';
import { useSIPProvider } from 'react-sipjs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { columns } from '@/pages/dashboard/components/columns';

// const callData = [
//   {
//     id: 1,
//     name: 'John Doe',
//     number: '+1 (555) 123-4567',
//     duration: '5:23',
//     type: 'incoming',
//     date: '2023-06-15 14:30',
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     number: '+1 (555) 987-6543',
//     duration: '2:45',
//     type: 'outgoing',
//     date: '2023-06-15 13:15',
//   },
//   {
//     id: 3,
//     name: 'Alice Johnson',
//     number: '+1 (555) 246-8135',
//     duration: '0:00',
//     type: 'missed',
//     date: '2023-06-15 11:50',
//   },
//   {
//     id: 4,
//     name: 'Bob Williams',
//     number: '+1 (555) 369-2580',
//     duration: '8:12',
//     type: 'incoming',
//     date: '2023-06-14 16:20',
//   },
//   {
//     id: 5,
//     name: 'Eva Brown',
//     number: '+1 (555) 147-2589',
//     duration: '3:37',
//     type: 'outgoing',
//     date: '2023-06-14 10:05',
//   },
// ];

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
      return 'bg-green-100 text-green-800';

    case 'missed':
    case 'rejected':
    case 'terminated':
      return 'bg-red-100 text-red-800';

    case 'in progress':
    case 'established':
      return 'bg-yellow-100 text-yellow-800';

    // default:
    //   return 'bg-gray-100 text-gray-800';
  }
};

interface ICall {
  sessionid: string;
  starttime: number;
  endtime: number;
  callstatus: string;
  duration: string;
  clientname: string;
  clientid: string;
  remarks: string;
  phonenumber: string;
  recordingpath: string;
  createdat: string;
}

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

export default function CallLogDesktop({ table }) {
  const { sessionManager } = useSIPProvider();
  const { dealerData } = useAuth();
  const rows = table.getRowModel().rows;

  const handleCall = async (receiver = {}) => {
    // 9379 - Jey G
    // 9384 - Sharad
    // console.log('Receiver', receiver);
    const { clientnumber, clientid } = receiver;

    const customHeaders = [
      `DI: ${dealerData.dealerid}`,
      `DN: ${dealerData.phonenumber}`,
      `CN: ${clientnumber}`,
      `CI: ${clientid}`,
    ];

    // const customHeaders = [
    //   'DI: DEALER2',
    //   'DN: 9386',
    //   'CN: 9384',
    //   'CI: DEALER1',
    // ];

    const inviterOptions = { extraHeaders: customHeaders };
    await sessionManager?.call(`sip:9384@${SIP_URL}`, inviterOptions);
    toast.success('Call connected!');
  };

  console.log('table.getRowModel()', table.getRowModel());

  return (
    <div className="container mx-auto py-10">
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
