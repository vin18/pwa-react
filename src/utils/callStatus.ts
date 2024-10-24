export enum CallStatusState {
  INCOMING = 1,
  ANSWERED = 2,
  UNANSWERED = 3,
  HANGUP = 4,
}

export enum CallStatusState1 {
  INCOMING = 1,
  ATTEMPTING = 2,
  CONNECTED = 3,
  MISSED = 4,
  HANGUP = 5,
}

export enum CallSessionDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export enum RegisterStatus {
  UNREGISTERED = 'UNREGISTERED',
  REGISTERED = 'REGISTERED',
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
        statusText: callType == 2 ? 'Missed' : 'Unanswered',
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

// export function getCallStatusDisplayText(
//   state: CallStatusState,
//   answered: number
// ) {
//   if (state == 5 && answered === 0) {
//     return 'Unanswered';
//   } else if (state == 5 && answered === 1) {
//     return 'Answered';
//   }

//   return 'Missed';
// }
