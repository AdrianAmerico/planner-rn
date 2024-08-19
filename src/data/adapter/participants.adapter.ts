import {
  ConfirmParticipantByIdParams,
  Participant,
  ParticipantsDataSource,
} from "../participants";
import { HttpClient } from "../protocols";

export class ParticipantsAdapter implements ParticipantsDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getByTripId(tripId: string) {
    try {
      const { data } = await this.httpClient.request<{
        participants: Participant[];
      }>({
        method: "get",
        url: `/trips/${tripId}/participants`,
      });

      return data.participants;
    } catch (error) {
      throw error;
    }
  }

  async confirmTripByParticipantId(props: ConfirmParticipantByIdParams) {
    try {
      await this.httpClient.request({
        method: "patch",
        url: `/participants/${props.participantId}/confirm`,
        body: { name: props.name, email: props.email },
      });
    } catch (error) {
      throw error;
    }
  }
}
