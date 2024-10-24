import { useSessionCall } from 'react-sipjs';
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { PhoneCallIcon } from 'lucide-react';
import { useStopwatch } from 'react-timer-hook';

import { Button } from './ui/button';
import { getCallTypeColor } from './CallLogDesktop';
import { CallSessionDirection } from '@/utils/callStatus';

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
  // const {
  //   totalSeconds,
  //   seconds,
  //   minutes,
  //   hours,
  //   days,
  //   isRunning,
  //   start,
  //   pause,
  //   reset,
  // } = useStopwatch({
  //   autoStart: true,
  //   // offsetTimestamp: sessionId ? new Date() : null,
  // });

  const ringtoneRef = useRef(null);

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

    // Show call notification
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
        setCallStatus({ state: '', message: '', payload: {} });
      }, 10000);
    }
  }, [session.state, callStatus.state]);

  console.log('Call Status', callStatus);

  return (
    <div>
      {/* <p>Session - {sessionId}</p> */}

      {/* Call state from socket */}
      {callStatus?.state && (
        <div
          className={`items-center ${getCallTypeColor(
            callStatus?.state?.toLowerCase()
          )} text-xs font-bold px-3 py-2 mb-4 shadow`}
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

          {/* <div>
            <span>Call Duration: </span>
            <span>
              {minutes}:{seconds}
            </span>
          </div> */}
        </div>
      )}

      {session.state === 'Initial' &&
        direction === CallSessionDirection.INCOMING && (
          <>
            <Button variant="success" className="mr-4" onClick={answer}>
              Answer
            </Button>
            <Button variant="destructive" onClick={decline}>
              Decline
            </Button>
          </>
        )}

      {('Established' === session.state ||
        direction === CallSessionDirection.OUTGOING) && (
        <>
          <Button variant="destructive" onClick={hangup}>
            Hangup
          </Button>
        </>
      )}

      <audio ref={ringtoneRef} src="/sounds/ringtone.wav" preload="auto" loop />
    </div>
  );
}

export default CallCenterItem;
