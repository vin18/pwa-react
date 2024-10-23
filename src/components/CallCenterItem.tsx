import { useSessionCall } from 'react-sipjs';
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { PhoneCallIcon } from 'lucide-react';

import { Button } from './ui/button';
import { getCallTypeColor } from './CallLogDesktop';
import { CallSessionDirection } from '@/utils/callStatus';

function CallCenterItem({
  sessionId,
  callStatus = { state: '', message: '', payload: {} },
  setCallStatus,
}) {
  const { decline, hangup, answer, session, direction } =
    useSessionCall(sessionId);

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
    if (
      session.state === 'Initial' &&
      direction === CallSessionDirection.INCOMING
    ) {
      toast.custom(
        (t) => {
          return (
            <div className="bg-gray-100  p-4  border border-gray-200 rounded shadow">
              {callStatus?.payload?.ClientId ??
                callStatus?.payload?.ClientNumber}
              <div className="flex">
                <PhoneCallIcon className="w-4 mr-2" />
                <p>Incoming call..</p>
              </div>
              <div className="space-x-4 mt-2 ">
                <Button
                  variant="success"
                  onClick={() => {
                    console.log('Clicked on answer');
                    answer();
                    ringtoneRef.current.pause();
                    toast.dismiss();
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    console.log('Clicked on decline');
                    decline();
                    ringtoneRef.current.pause();
                    toast.dismiss();
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          );
        },

        { duration: 20000 }
      );
    }

    // Hide status banner after certain interval
    if (session?.state === 'Terminated') {
      setTimeout(() => {
        setCallStatus({ state: '', message: '' });
      }, 10000);
    }
  }, [session.state, callStatus.state]);

  return (
    <div>
      {/* <p>Session - {sessionId}</p> */}

      {/* Call state from socket */}
      {callStatus?.state && (
        <div
          className={`flex items-center ${getCallTypeColor(
            callStatus?.state?.toLowerCase()
          )} text-xs font-bold px-3 py-2 mb-4 shadow`}
          role="alert"
        >
          <PhoneCallIcon className="h-4 w-4 mr-2" />
          <p>{callStatus.message}</p>
        </div>
      )}

      {/* {session.state === 'Initial' && (
        <>
          <Button onClick={answer}>Answer</Button>
          <Button onClick={decline}>Decline</Button>
        </>
      )} */}

      {/* {'Established' === session.state && (
        <>
          <Button onClick={isHeld ? unhold : hold}>
            {isHeld ? 'Unhold' : 'Hold'}
          </Button>
          <Button onClick={isMuted ? unmute : mute}>
            {isMuted ? 'Ummute' : 'Mute'}
          </Button>
        </>
      )} */}

      {'Established' === session.state && (
        <>
          <Button variant="destructive" onClick={hangup}>
            Hangup
          </Button>
        </>
      )}

      {/* { 'Established' === session.state) && (
        <Button className="mb-4 mt-2" onClick={hangup}>
          Hang Up
        </Button>
      )} */}

      <audio ref={ringtoneRef} src="/sounds/ringtone.wav" preload="auto" loop />
    </div>
  );
}

export default CallCenterItem;
