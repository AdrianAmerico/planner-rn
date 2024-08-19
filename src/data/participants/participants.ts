export type Participant = {
  id: string;
  name: string;
  email: string;
  is_confirmed: boolean;
};

export type ParticipantConfirm = {
  participantId: string;
  name: string;
  email: string;
};

export type ConfirmParticipantByIdParams = {
  participantId: string;
  name: string;
  email: string;
};
