import { useSessionCall } from 'react-sipjs';
import { useRef, useEffect, useState } from 'react';

import { Button } from './ui/button';
import { toast } from 'sonner';
import { PhoneCallIcon, RocketIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertTitle } from './ui/alert';
import { getCallTypeColor } from './CallLogDesktop';

function CallCenterItem({
  sessionId,
  callStatus = { state: '', message: '' },
}) {
  const {
    isHeld,
    isMuted,
    decline,
    hangup,
    hold,
    mute,
    answer,
    session,
    unhold,
    unmute,
    direction,
    timer,
  } = useSessionCall(sessionId);

  const [progress, setProgress] = useState('');
  const ringtoneRef = useRef(null);

  useEffect(() => {
    console.log('Sesssionnn state', session.state);
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

    if (session.state === 'Initial') {
      toast.custom((t) => (
        <div className="bg-gray-100  p-4  border border-gray-200 rounded shadow">
          Alice
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
      ));
    }

    if (session?.state === 'Initial') {
      setProgress('Incoming call..');
    } else if (session?.state === 'Established') {
      setProgress('Call is in progress..');
    } else if (session?.state === 'Terminated') {
      setProgress('Call ended..');
      setTimeout(() => {
        setProgress('');
      }, 3000);
    } else {
      setProgress('');
    }
  }, [session.state]);

  return (
    <div>
      {/* <p>Session - {sessionId}</p> */}

      {/* Call state from socket */}
      {Object.keys(callStatus)?.length > 0 && (
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

      {/* {progress && (
        <div
          className={`flex items-center ${getCallTypeColor(
            session?.state?.toLowerCase()
          )} text-xs font-bold px-3 py-2 mb-4 shadow`}
          role="alert"
        >
          <PhoneCallIcon className="h-4 w-4 mr-2" />
          <p>{progress}</p>
        </div>
      )} */}

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

      {/* 
      {!['Terminating', 'Terminated'].includes(session.state) && (
        <Button onClick={hangup}>Hang Up</Button>
      )} */}

      <audio ref={ringtoneRef} src="/sounds/ringtone.wav" preload="auto" loop />
    </div>
  );
}

export default CallCenterItem;
