import { useEffect } from 'react';
import { useSIPProvider } from 'react-sipjs';

import CallCenterItem from './CallCenterItem';

const dealerConfig = {
  username: '1112',
  password: '1112',
};

export const CallCenter = () => {
  const { connectAndRegister } = useSIPProvider();
  const { sessionManager, sessions } = useSIPProvider();

  console.log('Session manager', sessionManager);
  console.log('Sessions', sessions);

  const handleCall = async (receiver) => {
    // 9379 - Jey G
    // 9384 - Sharad
    const res = await sessionManager?.call(receiver);
  };

  useEffect(() => {
    connectAndRegister({
      username: dealerConfig.username,
      password: dealerConfig.password,
    });
  }, []);

  useEffect(() => {
    // sessionManager
    //   ?.call('sip:9379@172.18.1.194:5060')
    //   // ?.call('sip:9384@172.18.1.194:5060')
    //   .then((res) => console.log(res));

    sessionManager?.register();
    sessionManager?.connect();

    return () => {
      sessionManager?.disconnect();
      sessionManager?.unregister();
    };
  }, [sessionManager]);

  // return null;

  const activeSessionId =
    Object.keys(sessions)[Object.keys(sessions)?.length - 1];

  return <CallCenterItem sessionId={activeSessionId} />;

  // return Object.keys(sessions)?.map((session) => {
  //   console.log('Map session', session);
  //   return (
  //     <div style={{ margin: '50px' }}>
  //       <CallCenterItem sessionId={session} />
  //     </div>
  //   );
  // });
};
