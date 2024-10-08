import { SIPProvider } from 'react-sipjs';
import { CallCenter } from './components/CallCenter';

// TODO:
// 1. Handle reload confirmation
// 2. Add user on click event

const sipProviderConfig = {
  domain: '172.18.1.194:8089',
  webSocketServer: 'wss://172.18.1.194:8089/asterisk/ws',
};

function App() {
  return (
    <div className="p-5">
      <SIPProvider
        options={{
          domain: sipProviderConfig.domain,
          webSocketServer: sipProviderConfig.webSocketServer,
        }}
      >
        <CallCenter />
      </SIPProvider>
    </div>
  );
}

export default App;
