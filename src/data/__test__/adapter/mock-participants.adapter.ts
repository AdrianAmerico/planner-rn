import {
  ConfirmParticipantByIdParams,
  Participant,
  ParticipantsDataSource,
} from "@/data/participants";
import { makeParticipant } from "../participants";

export class MockParticipantsAdapter implements ParticipantsDataSource {
  async getByTripId(_tripId: string): Promise<Participant[]> {
    return Promise.resolve([makeParticipant()]);
  }

  async confirmTripByParticipantId(_props: ConfirmParticipantByIdParams) {
    return Promise.resolve();
  }
}
