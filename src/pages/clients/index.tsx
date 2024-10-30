import { useEffect, useState } from 'react';
// import { DataTable } from '../dashboard/components/data-table';
import { DataTable } from '../clients/components/data-table';
import { getClientsApi } from '@/services/apiClientDetails';
import { columns } from './components/columns';
import { useAuth } from '@/contexts/AuthContext';

function Clients() {
  const [clients, setClients] = useState([]);
  const { dealer } = useAuth();

  useEffect(() => {
    async function fetchClients() {
      const data = await getClientsApi(dealer.dealerid);
      setClients(data);
    }

    if (dealer) fetchClients();
  }, [dealer]);

  return (
    <div className=" h-full flex-1 flex-col p-8 pt-0 mb-4 flex overflow-auto">
      <DataTable data={clients} columns={columns} />
    </div>
  );
}

export default Clients;
