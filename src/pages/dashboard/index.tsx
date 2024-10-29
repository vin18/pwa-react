import { useEffect } from 'react';

import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { getCallsApi } from '@/services/apiCalls';
import usePageRefresh from '@/hooks/usePageRefresh';
import { EditCallerInfoDialog } from '@/components/EditCallerInfoDialog';

function Dashboard({ calls, setCalls }) {
  useEffect(() => {
    async function fetchCalls() {
      const data = await getCallsApi();
      setCalls(data);
    }
    fetchCalls();
  }, []);

  return (
    <>
      <div className="h-full flex-1 flex-col p-8 pt-0 mb-4 flex overflow-auto">
        <DataTable data={calls} columns={columns} />
        <EditCallerInfoDialog setCalls={setCalls} />
      </div>
    </>
  );
}

export default Dashboard;
