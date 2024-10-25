import { PhoneIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { SIP_URL } from '@/App';
import { useSIPProvider } from 'react-sipjs';

function HandleCall({ call }) {
  const { dealer } = useAuth();
  const { sessionManager } = useSIPProvider();

  const handleCall = async (receiver = {}) => {
    // 9379 - Jey G
    // 9384 - Sharad
    // console.log('Receiver', receiver);
    const { phonenumber, registeredphonenumber, clientid } = receiver;

    const customHeaders = [
      `DI: ${dealer.dealerid}`,
      `DN: ${dealer.phonenumber}`,
      `CN: ${phonenumber ?? registeredphonenumber}`,
      `CI: ${clientid}`,
    ];

    // const customHeaders1 = [
    //   'DI: DEALER2',
    //   'DN: 9386',
    //   'CN: 9384',
    //   'CI: DEALER1',
    // ];

    console.log('Custom headers', customHeaders);
    // console.log('Custom headers 1', customHeaders1);

    const inviterOptions = { extraHeaders: customHeaders };
    // await sessionManager?.call(`sip:9386@${SIP_URL}`, inviterOptions);
    await sessionManager?.call(
      `sip:${dealer.phonenumber}@${SIP_URL}`,
      inviterOptions
    );
    // toast.success('Call connected!');
  };

  return (
    <Button onClick={() => handleCall(call)} className="p-2" variant="ghost">
      <PhoneIcon className="h-4 w-4 cursor-pointer" />
    </Button>
  );
}

export default HandleCall;
