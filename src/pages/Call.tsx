import { SIPProvider } from 'react-sipjs';
import { CallCenter } from '@/components/CallCenter';

const sipProviderConfig = {
  domain: '172.18.1.194:8089',
  webSocketServer: 'wss://172.18.1.194:8089/asterisk/ws',
};

function Call() {
  return null;
  // return (
  //   <SIPProvider
  //     options={{
  //       domain: sipProviderConfig.domain,
  //       webSocketServer: sipProviderConfig.webSocketServer,
  //     }}
  //   >
  //     <CallCenter />
  //   </SIPProvider>
  // );
}

export default Call;
