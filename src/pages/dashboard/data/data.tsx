import {
  CheckCircledIcon,
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';

export const callStatuses = [
  {
    value: 'incoming',
    label: 'Incoming',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'outgoing',
    label: 'Outgoing',
    icon: CheckCircledIcon,
  },
  {
    value: 'accepted',
    label: 'Accepted',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: StopwatchIcon,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: CheckCircledIcon,
  },
];
