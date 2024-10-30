import { useEffect, useRef, useState } from 'react';
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
import { useSIPProvider } from '@/components/SipProvider';
import UserNav from '@/components/UserNav';
import logo from '/public/nb-logo.svg';
import { LightbulbIcon } from 'lucide-react';

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
  const [incomingCall, setIncomingCall] = useState(false);

  const { registerStatus, sessionManager, connectStatus } = useSIPProvider();
  const { onOpen: handleMakeCallModalOpen, isOpen } = useMakeCallModal();
  const { dealer, logout } = useAuth();
  useCallManager();

  const activeSessionId = sessionManager?.managedSessions[0]?.session?.id;

  async function fetchCalls() {
    const data = await getCallsApi(dealer.dealerid);
    setCalls(data);
  }

  useEffect(() => {
    socket.on(VTS_SOCKET_MESSAGE_CHANNEL, (data) => {
      if (data.code === 'logout-event') {
        logout();
      } else if (data.code === VTS_SOCKET_CALL_CHANNEL) {
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
      <div className="flex justify-between mt-4 md:mt-0">
        <img className="w-36" src={logo} alt="Logo" />

        <div className="flex items-center">
          <p className="mr-2">
            Welcome, <span className="font-semibold">{dealer?.dealerid}</span>
          </p>
          <div
            className={`rounded-full  h-2 w-2 mr-2 ${
              registerStatus === RegisterStatus.REGISTERED
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          ></div>
          <UserNav />
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
        className="mt-8 p-0"
        onValueChange={(t: TabState) => setActiveTab(t)}
      >
        <TabsList className="grid grid-cols-2 p-0 md:w-1/4">
          <TabsTrigger value="recent-calls" className="p-0">
            <Button
              variant={activeTab === 'recent-calls' ? `default` : `ghost`}
              className="w-full p-0 border"
            >
              Recent calls
            </Button>
            {/* Recent Calls */}
          </TabsTrigger>
          <TabsTrigger value="clients" className="p-0">
            <Button
              variant={activeTab === 'clients' ? `default` : `ghost`}
              className="w-full border"
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
