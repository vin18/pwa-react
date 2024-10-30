import { ReactNode, useCallback, useContext, useRef, useState } from 'react';
import React from 'react';
import { Session } from 'sip.js/lib/api/session';
import { SessionManager } from 'sip.js/lib/platform/web';
import {
  RegisterStatus,
  SIPAccount,
  SIPProviderOptions,
  CONNECT_STATUS,
  SessionTimer,
} from '../components/type';
import { ProviderContext } from '@/components/SipProvider';

export enum ErrorMessageLevel1 {
  SIP_PROVIDER = 'sip-provider',
}

export enum ErrorMessageLevel2 {
  FAILED_CONNECT_SIP_USER = `Can't connect with SIP Server`,
}

export const SIPProvider = (props: {
  options: SIPProviderOptions;
  children: ReactNode | JSX.Element;
}): React.ReactNode => {
  const { options, children } = props;
  const refAudioRemote = useRef<HTMLAudioElement>(null);

  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [sessionTimer, setSessionTimer] = useState<SessionTimer>({});
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(
    null
  );
  const [connectStatus, setStatus] = useState<CONNECT_STATUS>(
    CONNECT_STATUS.WAIT_REQUEST_CONNECT
  );
  const [registerStatus, setRegisterStatus] = useState<RegisterStatus>(
    RegisterStatus.UNREGISTERED
  );

  const updateSession = useCallback(
    (session: Session) => {
      setSessions((sessions) => ({
        ...sessions,
        [session.id]: session,
      }));
    },
    [setSessions]
  );

  function setupRemoteMedia(session: Session) {
    const remoteStream = new MediaStream();
    session.sessionDescriptionHandler.peerConnection
      .getReceivers()
      .forEach((receiver) => {
        if (receiver.track) {
          remoteStream.addTrack(receiver.track);
        }
      });
    refAudioRemote.current.srcObject = remoteStream;
    refAudioRemote.current.play();
  }

  const connectAndRegister = useCallback((sipAccount: SIPAccount) => {
    const sessionManager = new SessionManager(options.webSocketServer, {
      aor: `sip:${sipAccount.username}@${options.domain}`,
      userAgentOptions: {
        authorizationUsername: sipAccount.username,
        authorizationPassword: sipAccount.password,
      },
      media: {
        constraints: {
          audio: true,
          video: false,
        },
        remote: {
          audio: refAudioRemote.current as HTMLAudioElement,
        },
      },
      rtcConfiguration: {
        iceServers: [
          // { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.ekiga.net' },
          // { urls: 'stun:stun.ideasip.com' },
        ],
      },

      delegate: {
        onCallCreated: (session) => {
          session.stateChange.addListener((state) => {
            console.info(
              ErrorMessageLevel1.SIP_PROVIDER,
              `Session ${session.id} changed to ${state}`
            );
            updateSession(session);
          });
          updateSession(session);
          setSessionTimer((timer) => ({
            ...timer,
            [session.id]: {
              createdAt: new Date(),
            },
          }));
        },
        onCallAnswered: (session) => {
          updateSession(session);
          // setupRemoteMedia(session);
          setSessionTimer((timer) => ({
            ...timer,
            [session.id]: {
              ...(timer[session.id] || {}),
              answeredAt: new Date(),
            },
          }));
        },
        onCallHangup: (session) => {
          updateSession(session);
          setSessionTimer((timer) => ({
            ...timer,
            [session.id]: {
              ...(timer[session.id] || {}),
              hangupAt: new Date(),
            },
          }));
        },
        onCallReceived: (session) => {
          updateSession(session);
          // setupRemoteMedia(session);
          setSessionTimer((timer) => ({
            ...timer,
            [session.id]: {
              ...(timer[session.id] || {}),
              receivedAt: new Date(),
            },
          }));
        },
        onRegistered: () => {
          setRegisterStatus(RegisterStatus.REGISTERED);
        },
        onUnregistered: () => {
          setRegisterStatus(RegisterStatus.UNREGISTERED);
        },
        onServerConnect() {
          setStatus(CONNECT_STATUS.CONNECTED);
          sessionManager.register();
        },
        onServerDisconnect(error) {
          console.error(
            ErrorMessageLevel1.SIP_PROVIDER,
            ErrorMessageLevel2.FAILED_CONNECT_SIP_USER,
            error
          );
          setStatus(CONNECT_STATUS.DISCONNECTED);
        },
      },
    });
    setSessionManager(sessionManager);
    sessionManager.connect();
  }, []);

  return (
    <>
      <ProviderContext.Provider
        value={{
          connectAndRegister,
          sessionManager,
          connectStatus,
          registerStatus,
          sessions,
          sessionTimer,
        }}
      >
        {children}
      </ProviderContext.Provider>

      <audio ref={refAudioRemote} />
    </>
  );
};
