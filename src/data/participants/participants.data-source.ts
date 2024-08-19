import { ConfirmParticipantByIdParams, Participant } from "./participants";

export interface ParticipantsDataSource {
  getByTripId: (tripId: string) => Promise<Participant[]>;
  confirmTripByParticipantId: (
    props: ConfirmParticipantByIdParams
  ) => Promise<void>;
}
