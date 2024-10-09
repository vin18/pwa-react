import { useEffect } from 'react';
import { toast } from 'sonner';
import { faker } from '@faker-js/faker';

import CallLogDesktop from '@/components/CallLogDesktop';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { callStatuses } from './data/data';

function Dashboard() {
  useEffect(() => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Resolved, lol');
      }, 2000);
    });

    // toast.promise(promise, {
    //   loading: 'loading',
    //   success: (data) => {
    //     return `Toast has been added`;
    //   },
    //   error: 'Error',
    // });
  }, []);

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
  console.log(calls);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
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
        <DataTable data={calls} columns={columns} />
      </div>
      {/* <CallLogDesktop /> */}
    </>
  );
}

export default Dashboard;
