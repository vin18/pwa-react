import { useEffect, useRef, useState } from 'react';
import { useSessionCall, useSIPProvider } from 'react-sipjs';
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
import { getCallsApi } from '@/services/apiCalls';

const intialState = {
  state: '',
  message: '',
  payload: {},
};

enum TabState {
  RECENT_CALLS = 'recent-calls',
  CLIENTS = 'clients',
}

export function DashboardLayout() {
  const [calls, setCalls] = useState([]);
  const [callStatus, setCallStatus] = useState(intialState);
  const [activeTab, setActiveTab] = useState(TabState.RECENT_CALLS);
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);

  const { registerStatus, sessionManager } = useSIPProvider();
  const { dealer } = useAuth();
  useCallManager();

  // useEffect(() => {
  //   setCallStatus(intialState);
  // }, [sessionManager?.managedSessions]);

  const activeSessionId = sessionManager?.managedSessions[0]?.session?.id;

  async function fetchCalls() {
    const data = await getCallsApi();
    setCalls(data);
  }

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
          CallType,
        };

        switch (CallStatus) {
          case CallStatusState.INCOMING: {
            if (CallType == 1) {
              callMsg['state'] = 'Initial';
              callMsg['message'] = `Incoming call`;
            } else if (CallType == 2) {
              callMsg['state'] = 'Initial';
              callMsg['message'] = `Outgoing call`;
            }
            break;
          }

          case CallStatusState.ANSWERED:
            callMsg['state'] = 'Established';
            callMsg['message'] = `Call is in progress`;
            break;

          case CallStatusState.UNANSWERED:
            callMsg['state'] = 'Missed';
            callMsg['message'] = `Missed call`;
            break;

          case CallStatusState.HANGUP:
            callMsg['state'] = 'Terminated';
            callMsg['message'] = `Call completed`;
            break;
        }

        console.log('Banner packet formed', callMsg);
        setCallStatus(callMsg);

        // Push socket payload to the recent dashboard table record
        if (
          CallStatus == CallStatusState.HANGUP ||
          CallStatus == CallStatusState.UNANSWERED
        ) {
          // Update dashboard table via API call
          fetchCalls();

          // TODO: Update dashboard table from socket payload
          // const callPayload = {
          //   sessionid: SessionId,
          //   starttime: StartTime,
          //   endtime: EndTime,
          //   callstatus: CallStatus,
          //   clientid: ClientId,
          //   remarks: '',
          //   phonenumber: ClientNumber,
          //   createdat: '',
          //   dealerid: DealerId,
          //   recording: Recording,
          //   answered: Answered,
          //   dealernumber: DealerNumber,
          //   calltype: CallType,
          // };

          // if (calls?.length > 0) {
          //   setCalls((prevCalls) => [callPayload, ...prevCalls]);
          // } else {
          //   setCalls([callPayload]);
          // }
        }
      }
    });

    return () => {
      socket.off(VTS_SOCKET_MESSAGE_CHANNEL);
    };
  }, [dealer?.dealerid]);

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

      <Tabs
        defaultValue="recent-calls"
        className="mt-4"
        onValueChange={(t: TabState) => setActiveTab(t)}
      >
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
