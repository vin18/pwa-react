import { useEffect, useState } from 'react';
import { useSIPProvider } from 'react-sipjs';

import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { getCallsApi } from '@/services/apiCalls';
import usePageRefresh from '@/hooks/usePageRefresh';
import { EditCallerInfoDialog } from '@/components/EditCallerInfoDialog';

function Dashboard() {
  const [calls, setCalls] = useState([]);
  const { sessionManager, sessions } = useSIPProvider();
  usePageRefresh();

  console.log('Session manager', sessionManager?.managedSessions);
  console.log('Sessions', sessions);

  useEffect(() => {
    async function fetchCalls() {
      const data = await getCallsApi();
      setCalls(data);
    }
    fetchCalls();
  }, []);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col p-8 pt-0 mb-4 md:flex">
        {/* <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of recent calls.
            </p>
          </div>
        </div>

        <p
          className={`mb-2 ${
            registerStatus === RegisterStatus.UNREGISTERED
              ? 'text-red-500'
              : 'text-green-500'
          }`}
        >
          Dealer is&nbsp;
          {registerStatus === RegisterStatus.UNREGISTERED
            ? 'unregistered'
            : 'registered'}{' '}
        </p> */}

        <DataTable data={calls} columns={columns} />
        <EditCallerInfoDialog setCalls={setCalls} />
      </div>
    </>
  );
}

export default Dashboard;
