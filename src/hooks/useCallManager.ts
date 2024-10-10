import { useEffect } from 'react';
import { useSIPProvider } from 'react-sipjs';

const dealerConfig = {
  username: '1112',
  password: '1112',
};

function useCallManager() {
  const { connectAndRegister } = useSIPProvider();
  const { sessionManager } = useSIPProvider();

  // const handleCall = async (receiver) => {
  //   // 9379 - Jey G
  //   // 9384 - Sharad
  //   const res = await sessionManager?.call(receiver);
  // };

  // useEffect(() => {
  //   connectAndRegister({
  //     username: dealerConfig.username,
  //     password: dealerConfig.password,
  //   });
  // }, []);

  useEffect(() => {
    // sessionManager
    // ?.call('sip:9379@172.18.1.194:5060')
    // ?.call('sip:9390@172.18.1.194:5060');
    //   .then((res) => console.log(res));

    // sessionManager?.register();
    // sessionManager?.connect();

    connectAndRegister({
      username: dealerConfig.username,
      password: dealerConfig.password,
    });

    return () => {
      sessionManager?.disconnect();
      sessionManager?.unregister();
    };
  }, []);
}

export default useCallManager;
