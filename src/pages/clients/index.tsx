import { useEffect, useState } from 'react';
import { DataTable } from '../dashboard/components/data-table';
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

  return <DataTable data={clients} columns={columns} />;
}

export default Clients;
