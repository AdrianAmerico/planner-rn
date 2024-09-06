import { MockParticipantsAdapter } from "@/data/__test__/adapter/mock-participants.adapter";
import { RemoteParticipants } from "../participants/participants";
import { faker } from "@faker-js/faker";
import {
  makeConfirmParticipantByIdParams,
  makeParticipant,
} from "@/data/__test__/participants";

describe("Participants", () => {
  const makeSut = () => {
    const remoteParticipants = new RemoteParticipants(
      new MockParticipantsAdapter()
    );

    return { remoteParticipants };
  };

  // getByTripId, confirmTripByParticipantId

  it("should get participants by trip id", async () => {
    const { remoteParticipants } = makeSut();
    const mockResponse = [makeParticipant()];
    const mockId = faker.string.uuid();

    jest
      .spyOn(remoteParticipants, "getByTripId")
      .mockResolvedValue(mockResponse);

    const result = await remoteParticipants.getByTripId(mockId);

    expect(remoteParticipants.getByTripId).toHaveBeenCalledWith(mockId);

    expect(result).toEqual(mockResponse);
  });

  it("should confirm trip by participant id", async () => {
    const { remoteParticipants } = makeSut();
    const mockParams = makeConfirmParticipantByIdParams();
    const mockId = faker.string.uuid();

    jest
      .spyOn(remoteParticipants, "confirmTripByParticipantId")
      .mockResolvedValue();

    await remoteParticipants.confirmTripByParticipantId(mockParams);

    expect(remoteParticipants.confirmTripByParticipantId).toHaveBeenCalledWith(
      mockParams
    );
  });
});
