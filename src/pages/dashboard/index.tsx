import { useEffect, useState } from 'react';
import { useSIPProvider } from 'react-sipjs';

import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import useCallManager from '@/hooks/useCallManager';
import CallCenterItem from '@/components/CallCenterItem';
import { getCallsApi } from '@/services/apiCalls';
import { socket } from '@/utils/socket';
import {
  VTS_SOCKET_CALL_CHANNEL,
  VTS_SOCKET_MESSAGE_CHANNEL,
} from '@/utils/constants';
import usePageRefresh from '@/hooks/usePageRefresh';
import CallStatusState from '@/utils/callStatus';

function Dashboard() {
  const [callStatus, setCallStatus] = useState({ state: '', message: '' });
  useCallManager();
  const { sessionManager, sessions } = useSIPProvider();
  const [calls, setCalls] = useState([]);

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

  const activeSessionId =
    Object.keys(sessions)[Object.keys(sessions)?.length - 1];

  useEffect(() => {
    socket.on(VTS_SOCKET_MESSAGE_CHANNEL, (data) => {
      if (data.code === VTS_SOCKET_CALL_CHANNEL) {
        console.log('Socket data received: ', data);
        const callMsg = { state: '', message: '' };
        const { CallStatus, ClientId, ClientNumber } = data.message;
        callMsg['payload'] = { CallStatus, ClientId, ClientNumber };
        switch (CallStatus) {
          // case CallStatusState.INCOMING:
          case CallStatusState.ATTEMPTING:
            callMsg['state'] = 'Initial';
            callMsg['message'] = `Incoming call from ${
              ClientId ? ClientId : ClientNumber
            }`;
            break;

          case CallStatusState.CONNECTED:
            callMsg['state'] = 'Established';
            callMsg['message'] = `Call is in progress with ${
              ClientId ? ClientId : ClientNumber
            }`;
            break;

          case CallStatusState.MISSED:
            callMsg['state'] = 'Established';
            callMsg['message'] = `Missed call from ${ClientId ?? ClientNumber}`;
            break;

          case CallStatusState.HANGUP:
            callMsg['state'] = 'Terminated';
            callMsg['message'] = `Call completed with ${
              ClientId ?? ClientNumber
            }`;
            break;
        }

        // // TODO:
        // const callMsg = {
        //   state: 'incoming',
        //   message: 'Incoming call from Sharad..',
        // };
        console.log('Packet formed', callMsg);
        setCallStatus(callMsg);
      }
    });

    return () => {
      socket.off(VTS_SOCKET_MESSAGE_CHANNEL);
    };
  }, []);

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

        {activeSessionId && (
          <CallCenterItem
            sessionId={activeSessionId}
            callStatus={callStatus}
            setCallStatus={setCallStatus}
          />
        )}

        <DataTable data={calls} columns={columns} />
      </div>
    </>
  );
}

export default Dashboard;
