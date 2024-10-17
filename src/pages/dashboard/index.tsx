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
import { getCallsApi } from '@/services/apiCalls';

function Dashboard() {
  useCallManager();
  const { sessionManager, sessions } = useSIPProvider();
  const [calls, setCalls] = useState([]);

  console.log('Session manager', sessionManager?.managedSessions);
  console.log('Sessions', sessions);

  useEffect(() => {
    async function fetchCalls() {
      const data = await getCallsApi();
      setCalls(data);
    }
    fetchCalls();
  }, []);

  const activeSessionId =
    Object.keys(sessions)[Object.keys(sessions)?.length - 1];

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

        {activeSessionId && <CallCenterItem sessionId={activeSessionId} />}
        <DataTable data={calls} columns={columns} />
      </div>
    </>
  );
}

export default Dashboard;
