import { useEffect } from 'react';
import { useSIPProvider } from 'react-sipjs';

import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { getCallsApi } from '@/services/apiCalls';
import usePageRefresh from '@/hooks/usePageRefresh';
import { EditCallerInfoDialog } from '@/components/EditCallerInfoDialog';

function Dashboard({ calls, setCalls, setCallStatus }) {
  const { sessionManager, sessions } = useSIPProvider();
  usePageRefresh();

  // console.log('Session manager', sessionManager?.managedSessions);
  // console.log('Sessions', sessions);
  // console.log('calls', calls);

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
        <DataTable data={calls} columns={columns} />
        <EditCallerInfoDialog setCalls={setCalls} />
      </div>
    </>
  );
}

export default Dashboard;
