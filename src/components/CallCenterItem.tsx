import { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PhoneCallIcon } from 'lucide-react';

import { Button } from './ui/button';
import { getCallTypeColor } from './CallLogDesktop';
import { CallSessionDirection } from '@/utils/callStatus';
import { convertCallDurationSeconds } from '@/utils/dateHelpers';
import { intialState } from '@/pages/DashboardLayout';
import { useSessionCall } from './SipProvider';

function CallCenterItem({
  sessionId,
  callStatus = { state: '', message: '', payload: {} },
  setCallStatus,
}) {
  const {
    decline,
    hangup,
    answer,
    session,
    direction = '',
  } = useSessionCall(sessionId);

  const [timer, setTimer] = useState(0);
  const ringtoneRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    // Ringtone
    if (session.state === 'Initial') {
      if (ringtoneRef?.current) {
        ringtoneRef.current.autoPlay = true;
        ringtoneRef.current.play();
      }
    } else {
      if (ringtoneRef?.current) {
        ringtoneRef.current.autoPlay = true;
        ringtoneRef.current.pause();
        toast.dismiss();
      }
    }

    // Start call duration
    if (session.state === 'Established') {
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }

    // Show call notification
    // TODO: Uncomment after testing
    // if (
    //   session.state === 'Initial' &&
    //   direction === CallSessionDirection.INCOMING
    // ) {
    //   toast.custom(
    //     (t) => {
    //       return (
    //         <div className="bg-gray-100  p-4  border border-gray-200 rounded shadow">
    //           {callStatus?.payload?.ClientId ??
    //             callStatus?.payload?.ClientNumber}
    //           <div className="flex">
    //             <PhoneCallIcon className="w-4 mr-2" />
    //             <p>Incoming call..</p>
    //           </div>
    //           <div className="space-x-4 mt-2 ">
    //             <Button
    //               variant="success"
    //               onClick={() => {
    //                 if (!session) {
    //                   toast.info('Invalid session');
    //                   toast.dismiss(t.id);
    //                   return;
    //                 }
    //                 answer();
    //                 ringtoneRef.current.pause();
    //                 toast.dismiss();
    //               }}
    //             >
    //               Accept
    //             </Button>
    //             <Button
    //               variant="destructive"
    //               onClick={() => {
    //                 if (!session) {
    //                   toast.info('Invalid session');
    //                   toast.dismiss(t.id);
    //                   return;
    //                 }
    //                 decline();
    //                 ringtoneRef.current.pause();
    //                 toast.dismiss();
    //               }}
    //             >
    //               Decline
    //             </Button>
    //           </div>
    //         </div>
    //       );
    //     },

    //     { duration: 20000 }
    //   );
    // }

    // Hide status banner after certain interval
    if (session?.state === 'Terminated') {
      setTimeout(() => {
        // setCallStatus({ state: '', message: '', payload: {} });
        setCallStatus(intialState);
      }, 100000);
    }

    return () => {
      clearInterval(countRef.current);
      // setCallStatus(intialState);
    };
  }, [session.state, callStatus.state]);

  console.log('Call Status', callStatus);
  console.log('Active state', session.state);
  console.log('Active Session', session);
  // console.log('Call duration', convertCallDurationSeconds(timer));

  const isIncomingCall =
    session.state === 'Initial' && direction === CallSessionDirection.INCOMING;
  const isOutgoingCall = direction === CallSessionDirection.OUTGOING;
  const isConnectingCall =
    session?.state === 'Initial' || session?.state === 'Establishing';
  const isCallConnected =
    'Established' === session.state ||
    (direction === CallSessionDirection.OUTGOING &&
      (('Initial' === session.state && 'Established' === session.state) ||
        'Establishing' === session.state));

  return (
    <div>
      {/* <p>Session - {sessionId}</p> */}

      {/* {session?.state === 'Establishing' && (
        <div
          className={`items-center ${getCallTypeColor(
            callStatus?.state?.toLowerCase()
          )} text-sm font-bold px-3 py-2 mb-4 shadow`}
          role="alert"
        >
          <div className="flex">Connecting call..</div>
        </div>
      )} */}

      {/* {isOutgoingCall && isConnectingCall && (
        <div
          className={`items-center ${getCallTypeColor(
            'incoming'
          )} text-sm font-bold px-3 py-2 mb-4 shadow`}
          role="alert"
        >
          <div className="flex">Connecting call..</div>
        </div>
      )} */}

      {/* Call state from socket */}
      {callStatus?.state && (
        <div
          className={`items-center ${getCallTypeColor(
            callStatus?.state?.toLowerCase()
          )} text-sm font-bold px-3 py-2 mb-4 shadow`}
          role="alert"
        >
          <div className="flex">
            <PhoneCallIcon className="h-4 w-4 mr-2" />
            {callStatus.message}
          </div>
          <div>
            <span>Client ID: </span>
            <span>{callStatus?.payload?.ClientId}</span>
          </div>
          <div>
            <span>Client Number: </span>
            <span>{callStatus?.payload?.ClientNumber}</span>
          </div>

          {session?.state === 'Established' && (
            <div>
              <span>Call Duration: </span>
              <span>{convertCallDurationSeconds(timer)}</span>
            </div>
          )}
        </div>
      )}

      {isIncomingCall && (
        <>
          <Button variant="success" className="mr-4" onClick={answer}>
            Answer
          </Button>
          <Button variant="destructive" onClick={decline}>
            Decline
          </Button>
        </>
      )}

      {isCallConnected && (
        <>
          <Button variant="destructive" onClick={hangup}>
            Hangup
          </Button>
        </>
      )}

      {direction === CallSessionDirection.INCOMING && (
        <audio
          ref={ringtoneRef}
          src="/sounds/ringtone.wav"
          preload="auto"
          loop
        />
      )}
    </div>
  );
}

export default CallCenterItem;
