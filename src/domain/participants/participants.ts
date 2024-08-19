import {
  ConfirmParticipantByIdParams,
  ParticipantsDataSource,
} from "@/data/participants";

export class RemoteParticipants implements ParticipantsDataSource {
  constructor(private dataSource: ParticipantsDataSource) {}

  async getByTripId(tripId: string) {
    return await this.dataSource.getByTripId(tripId);
  }

  async confirmTripByParticipantId(props: ConfirmParticipantByIdParams) {
    return await this.dataSource.confirmTripByParticipantId(props);
  }
}
