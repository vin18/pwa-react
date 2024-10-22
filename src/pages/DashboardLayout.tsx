import { useEffect, useState } from 'react';
import { useSIPProvider } from 'react-sipjs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Dashboard from './dashboard';
import Clients from './clients';
import { CallStatusState, RegisterStatus } from '@/utils/callStatus';
import useCallManager from '@/hooks/useCallManager';
import {
  VTS_SOCKET_CALL_CHANNEL,
  VTS_SOCKET_MESSAGE_CHANNEL,
} from '@/utils/constants';
import { socket } from '@/utils/socket';
import CallCenterItem from '@/components/CallCenterItem';

export function DashboardLayout() {
  const [callStatus, setCallStatus] = useState({ state: '', message: '' });
  const { registerStatus, sessionManager, sessions } = useSIPProvider();
  useCallManager();

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
          case CallStatusState.INCOMING:
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
      <div className="flex items-center justify-between mb-4">
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
      </p>

      {activeSessionId && (
        <CallCenterItem
          sessionId={activeSessionId}
          callStatus={callStatus}
          setCallStatus={setCallStatus}
        />
      )}

      <Tabs defaultValue="recent-calls" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent-calls">Recent Calls</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        <TabsContent value="recent-calls">
          <Card>
            <Dashboard />
          </Card>
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <Clients />
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
