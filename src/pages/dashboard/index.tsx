import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { faker } from '@faker-js/faker';
import { useSessionCall, useSIPProvider } from 'react-sipjs';

import CallLogDesktop, {
  getCallIcon,
  getCallTypeColor,
} from '@/components/CallLogDesktop';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { callStatuses } from './data/data';
import { Button } from '@/components/ui/button';
import { Badge, PhoneCallIcon } from 'lucide-react';
import useCallManager from '@/hooks/useCallManager';
import CallCenterItem from '@/components/CallCenterItem';
import { Alert, AlertTitle } from '@/components/ui/alert';

function Dashboard() {
  const ringtoneRef = useRef(null);
  useCallManager();
  const { sessionManager, sessions } = useSIPProvider();
  const [progress, setProgress] = useState('');

  const calls = Array.from({ length: 100 }, () => {
    const date = new Date().toLocaleTimeString();
    const time = new Date().toLocaleTimeString('en-in', {
      hour: 'numeric',
      minute: 'numeric',
    });

    return {
      id: `CALL-${faker.number.int({ min: 1000, max: 9999 })}`,
      name: faker.person.firstName(),
      phoneNumber: faker.phone.number({ style: 'national' }),
      duration: `${time}`,
      type: faker.helpers.arrayElement(callStatuses).value,
      date: `${date} ${time}`,
      remarks: faker.hacker
        .phrase()
        .replace(/^./, (letter) => letter.toUpperCase()),
    };
  });

  console.log('Session manager', sessionManager?.managedSessions);
  console.log('Sessions', sessions);

  useEffect(() => {
    const { session: activeSession } =
      sessionManager?.managedSessions[
        sessionManager.managedSessions.length - 1
      ] ?? {};

    let p = '';
    if (activeSession?.state === 'Initial') {
      p = 'Incoming call..';
    } else if (activeSession?.state === 'Established') {
      p = 'Call is in progress..';
    } else if (activeSession?.state === 'Terminated') {
      p = 'Call ended..';
    } else {
      p = '';
    }

    setProgress(p);
  }, [sessionManager]);

  // progress = 'Call is in progress..';
  console.log('Progress', progress);
  console.log('sessionManager', sessionManager);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col p-8 pt-0 mb-4 md:flex">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of recent calls.
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <UserNav />
          </div> */}
        </div>

        {progress && (
          <div
            className=" flex items-center bg-blue-400 text-white text-xs font-bold px-3 py-2"
            role="alert"
          >
            <PhoneCallIcon className="h-4 w-4 mr-2" />
            <p>{progress}</p>
          </div>
        )}

        {/* {progress && (
          <Badge
            className={getCallTypeColor(activeSession?.state?.toLowerCase())}
          >
            <span className="flex items-center space-x-1">
              {getCallIcon(activeSession?.state?.toLowerCase())}
              <span>{progress}</span>
            </span>
          </Badge>
        )} */}

        {Object.keys(sessions)?.map((session) => {
          console.log('Map session', session);
          return (
            <div style={{ marginBottom: '20px' }}>
              <CallCenterItem sessionId={session} />
            </div>
          );
        })}

        <DataTable data={calls} columns={columns} />
      </div>
      {/* <CallLogDesktop /> */}
    </>
  );
}

export default Dashboard;
