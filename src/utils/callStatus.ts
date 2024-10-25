export enum CallStatusState {
  INCOMING = 1,
  ANSWERED = 2,
  UNANSWERED = 3,
  HANGUP = 4,
}

export enum CallSessionDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export enum RegisterStatus {
  UNREGISTERED = 'UNREGISTERED',
  REGISTERED = 'REGISTERED',
}

export enum CONNECT_STATUS {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export function getCallStatus(state: CallStatusState, callType) {
  switch (Number(state)) {
    case CallStatusState.INCOMING: {
      return {
        statusText: 'Incoming',
        bgColor: 'bg-yellow-100 text-yellow-800',
        textColor: 'text-yellow-800',
      };
    }

    case CallStatusState.ANSWERED:
      return {
        statusText: 'Answered',
        bgColor: 'bg-green-100 text-green-800',
        textColor: 'text-green-800',
      };

    case CallStatusState.UNANSWERED:
      return {
        statusText: callType == 1 ? 'Missed' : 'Unanswered',
        bgColor: 'bg-red-100 text-red-800',
        textColor: 'text-red-800',
      };

    case CallStatusState.HANGUP:
      return {
        statusText: 'Completed',
        bgColor: 'bg-green-100 text-green-800',
        textColor: 'text-green-800',
      };

    default:
      return {
        statusText: '',
        bgColor: '',
        textColor: '',
      };
  }
}
