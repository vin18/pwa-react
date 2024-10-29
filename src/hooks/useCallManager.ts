import { useSIPProvider } from '@/components/SipProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

function useCallManager() {
  const { dealer } = useAuth();
  const { connectAndRegister, sessionManager } = useSIPProvider();
  // console.log('managedSessions', sessionManager?.managedSessions);
  // console.log('sessions', sessions);
  // console.log('sessionManager', sessionManager);
  // console.log('connectStatus', sessionManager);
  // console.log('registerStatus', sessionManager);
  const WEBRTC_PASSWORD = import.meta.env.VITE_WEBRTC_PASSWORD;

  useEffect(() => {
    if (dealer) {
      connectAndRegister({
        username: dealer.phonenumber,
        password: WEBRTC_PASSWORD,
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
