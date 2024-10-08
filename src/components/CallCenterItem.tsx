import { useSessionCall } from 'react-sipjs';
import { useRef, useEffect } from 'react';

function CallCenterItem({ sessionId }) {
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

  const ringtoneRef = useRef(null);

  useEffect(() => {
    console.log('Sesssionnn state', session.state);
    if (session.state === 'Initial') {
      if (ringtoneRef?.current) {
        ringtoneRef.current.autoPlay = true;
        ringtoneRef.current.play();
      }
    } else if (
      ['Terminating', 'Terminated'].includes(session.state) ||
      session.state === 'Established'
    ) {
      if (ringtoneRef?.current) {
        ringtoneRef.current.autoPlay = true;
        ringtoneRef.current.pause();
      }
    }
  }, [session?.state]);

  return (
    <div>
      <p>Session - {sessionId}</p>
      <p>{session.state}</p>

      {session.state === 'Initial' && (
        <>
          <button onClick={answer}>Answer</button>
          <button onClick={decline}>Decline</button>
        </>
      )}

      {'Established' === session.state && (
        <>
          <button onClick={isHeld ? unhold : hold}>
            {isHeld ? 'Unhold' : 'Hold'}
          </button>
          <button onClick={isMuted ? unmute : mute}>
            {isMuted ? 'Ummute' : 'Mute'}
          </button>
        </>
      )}

      {!['Terminating', 'Terminated'].includes(session.state) && (
        <button onClick={hangup}>Hang Up</button>
      )}

      <audio ref={ringtoneRef} src="/sounds/ringtone.wav" preload="auto" loop />
    </div>
  );
}

export default CallCenterItem;
