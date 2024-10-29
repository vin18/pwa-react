import { useEffect, useState } from 'react';
// import { DataTable } from '../dashboard/components/data-table';
import { DataTable } from '../clients/components/data-table';
import { getClientsApi } from '@/services/apiClientDetails';
import { columns } from './components/columns';

function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const data = await getClientsApi();
      setClients(data);
    }
    fetchClients();
  }, []);

  return (
    <div className=" h-full flex-1 flex-col p-8 pt-0 mb-4 flex overflow-auto">
      <DataTable data={clients} columns={columns} />
    </div>
  );
}

export default Clients;
