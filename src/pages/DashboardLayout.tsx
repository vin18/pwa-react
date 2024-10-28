import { useEffect, useRef, useState } from 'react';
import { useSessionCall, useSIPProvider } from 'react-sipjs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Dashboard from './dashboard';
import Clients from './clients';
import {
  CallStatusState,
  CONNECT_STATUS,
  RegisterStatus,
} from '@/utils/callStatus';
import useCallManager from '@/hooks/useCallManager';
import {
  VTS_SOCKET_CALL_CHANNEL,
  VTS_SOCKET_MESSAGE_CHANNEL,
} from '@/utils/constants';
import { socket } from '@/utils/socket';
import CallCenterItem from '@/components/CallCenterItem';
import { useAuth } from '@/contexts/AuthContext';
import { getCallsApi } from '@/services/apiCalls';
import { Button } from '@/components/ui/button';
import { useMakeCallModal } from '@/hooks/useMakeCallModal';
import { MakeCallDialog } from '@/components/MakeCallDialog';

export const intialState = {
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

  const { registerStatus, sessionManager, connectStatus } = useSIPProvider();
  const { onOpen: handleMakeCallModalOpen, isOpen } = useMakeCallModal();
  const { dealer } = useAuth();
  useCallManager();

  // useEffect(() => {
  //   setCallStatus(intialState);
  // }, [sessionManager?.managedSessions]);

  const activeSessionId = sessionManager?.managedSessions[0]?.session?.id;

  // useEffect(() => {
  //   setCallStatus(intialState);
  // }, [sessionManager?.managedSessions[0]?.session?.id]);

  async function fetchCalls() {
    const data = await getCallsApi();
    setCalls(data);
  }

  useEffect(() => {
    socket.on(VTS_SOCKET_MESSAGE_CHANNEL, (data) => {
      if (data.code === VTS_SOCKET_CALL_CHANNEL) {
        console.log('Socket data received: ', data.message);
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
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            Welcome back,{' '}
            {registerStatus === RegisterStatus.REGISTERED
              ? dealer?.dealerid
              : ''}
          </h2>

          <p
            className={`mb-2 ${
              registerStatus === RegisterStatus.UNREGISTERED
                ? 'text-red-500'
                : 'text-green-500'
            }`}
          >
            {registerStatus === RegisterStatus.UNREGISTERED
              ? 'Unregistered'
              : 'Registered'}{' '}
            and{' '}
            {connectStatus === CONNECT_STATUS.CONNECTED
              ? 'connected'
              : 'not connected'}{' '}
          </p>

          <p className="text-muted-foreground">
            Here&apos;s a list of recent calls.
          </p>

          <div className="mt-4">
            <Button onClick={handleMakeCallModalOpen}>Make a call</Button>
          </div>
        </div>
      </div>

      {activeSessionId && (
        <CallCenterItem
          sessionId={activeSessionId}
          callStatus={callStatus}
          setCallStatus={setCallStatus}
        />
      )}

      <Tabs
        defaultValue="recent-calls"
        className="mt-4 p-0"
        onValueChange={(t: TabState) => setActiveTab(t)}
      >
        <TabsList className="grid w-full grid-cols-2 p-0">
          <TabsTrigger value="recent-calls" className="p-0">
            <Button
              variant={activeTab === 'recent-calls' ? `default` : `ghost`}
              className="w-full p-0 border-0"
            >
              Recent calls
            </Button>
            {/* Recent Calls */}
          </TabsTrigger>
          <TabsTrigger value="clients" className="p-0">
            <Button
              variant={activeTab === 'clients' ? `default` : `ghost`}
              className="w-full border-0"
            >
              Clients
            </Button>
          </TabsTrigger>
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

      <MakeCallDialog />
    </>
  );
}
