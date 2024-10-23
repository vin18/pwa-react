import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useSIPProvider } from 'react-sipjs';

function useCallManager() {
  const { dealer } = useAuth();
  console.log('Dealer from call manager', dealer);

  // const dealerConfig = {
  //   username: dealer?.phonenumber,
  //   password: dealer?.phonenumber,
  // };

  const { connectAndRegister, sessionManager } = useSIPProvider();
  console.log('managedSessions', sessionManager?.managedSessions);

  useEffect(() => {
    if (dealer) {
      connectAndRegister({
        username: dealer.phonenumber,
        password: dealer.phonenumber,
      });
    }

    return () => {
      sessionManager?.disconnect();
      // .then(() => toast.success('Dealer disconnected..'));
      sessionManager?.unregister();
      // .then(() => toast.success('Dealer unregistered..'));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealer]);
}

export default useCallManager;
