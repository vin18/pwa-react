export enum CallStatusState {
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

export function getCallStatus(state: CallStatusState) {
  switch (state) {
    case CallStatusState.INCOMING:
    case CallStatusState.ATTEMPTING:
      return 'incoming';

    case CallStatusState.CONNECTED:
      return 'established';

    case CallStatusState.MISSED:
      return 'missed';

    case CallStatusState.HANGUP:
      return 'terminated';
  }
}

export function getCallStatusDisplayText(
  state: CallStatusState,
  answered: number
) {
  if (state == 5 && answered === 0) {
    return 'Unanswered';
  } else if (state == 5 && answered === 1) {
    return 'Answered';
  }

  return 'Missed';
}
