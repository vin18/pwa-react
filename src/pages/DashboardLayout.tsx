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
import { useAuth } from '@/contexts/AuthContext';

export function DashboardLayout() {
  const [callStatus, setCallStatus] = useState({ state: '', message: '' });
  const [calls, setCalls] = useState([]);
  const { registerStatus, sessionManager } = useSIPProvider();
  const { dealer } = useAuth();
  useCallManager();

  const activeSessionId =
    sessionManager?.managedSessions[sessionManager?.managedSessions?.length - 1]
      ?.session?.id;

  useEffect(() => {
    setCallStatus([{ state: '', message: '' }]);
  }, [sessionManager?.managedSessions]);

  useEffect(() => {
    socket.on(VTS_SOCKET_MESSAGE_CHANNEL, (data) => {
      if (data.code === VTS_SOCKET_CALL_CHANNEL) {
        console.log('Socket data received: ', data);
        const callMsg = { state: '', message: '' };
        const {
          CallStatus,
          ClientId,
          ClientNumber,
          Answered,
          CallType,
          DealerId,
          DealerNumber,
          EndTime,
          Recording,
          SessionId,
          StartTime,
        } = data.message;

        if (DealerId !== dealer?.dealerid) return;

        callMsg['payload'] = {
          CallStatus,
          ClientId,
          ClientNumber,
        };

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

        // console.log('Packet formed', callMsg);
        setCallStatus(callMsg);

        if (
          CallStatus == CallStatusState.HANGUP ||
          CallStatus == CallStatusState.MISSED
        ) {
          const callPayload = {
            sessionid: SessionId,
            starttime: StartTime,
            endtime: EndTime,
            callstatus: CallStatus,
            clientid: ClientId,
            remarks: '',
            phonenumber: ClientNumber,
            createdat: '',
            dealerid: DealerId,
            recording: Recording,
            answered: Answered,
            dealernumber: DealerNumber,
            calltype: CallType,
          };
          setCalls((prevCalls) => [callPayload, ...prevCalls]);
        }
      }
    });

    return () => {
      socket.off(VTS_SOCKET_MESSAGE_CHANNEL);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between my-4">
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
        {dealer?.dealerid} is&nbsp;
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
            <Dashboard
              calls={calls}
              setCalls={setCalls}
              setCallStatus={setCallStatus}
            />
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
