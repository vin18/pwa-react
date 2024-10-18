import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useSIPProvider } from 'react-sipjs';

function useCallManager() {
  const { dealer } = useAuth();

  const dealerConfig = {
    username: dealer?.phonenumber,
    password: dealer?.phonenumber,
  };

  const { connectAndRegister, sessionManager } = useSIPProvider();

  useEffect(() => {
    connectAndRegister({
      username: dealerConfig.username,
      password: dealerConfig.password,
    });

    return () => {
      sessionManager?.disconnect();
      sessionManager?.unregister();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealer]);
}

export default useCallManager;
