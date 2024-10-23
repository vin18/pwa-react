import {
  CheckCircledIcon,
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';
import { Phone, PhoneIncoming, PhoneMissed } from 'lucide-react';

export const callStatuses1 = [
  {
    value: 'rejected',
    label: 'Rejected',
    icon: <Phone className="h-4 w-4 text-yellow-500" />,
    callStatus: 5,
    answered: 0,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: <Phone className="h-4 w-4 text-green-500" />,
    callStatus: 5,
    answered: 1,
  },
];

export const callStatuses = [
  {
    value: 'incoming',
    label: 'Incoming',
    icon: <PhoneIncoming className="h-4 w-4 text-green-500" />,
    callStatus: 1,
  },
  {
    value: 'outgoing',
    label: 'Outgoing',
    icon: <PhoneIncoming className="h-4 w-4 text-green-500" />,
    callStatus: 1,
  },
  {
    value: 'accepted',
    label: 'Accepted',
    icon: <PhoneIncoming className="h-4 w-4 text-green-500" />,
    callStatus: 3,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: <PhoneIncoming className="h-4 w-4 text-green-500" />,
    callStatus: 3,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: <PhoneMissed className="h-4 w-4 text-yellow-500" />,
    callStatus: 5,
  },
];
