import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';

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

export default function CallLogDesktop({ table }) {
  const row = table.getRowModel().rows;

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
          <TableRow>
            <TableHead className="w-[250px]">ID</TableHead>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Date & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {row.map(({ original: call }) => {
            return (
              <TableRow key={call.id}>
                <TableCell>{call.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${call.name}`}
                        alt={call.name}
                      />
                      <AvatarFallback>
                        {call.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{call.name}</span>
                  </div>
                </TableCell>
                <TableCell>{call.phoneNumber}</TableCell>
                <TableCell>{call.duration}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getCallTypeColor(call.type)}
                  >
                    <span className="flex items-center space-x-1">
                      {getCallIcon(call.type)}
                      <span>
                        {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                      </span>
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{call.date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
