import { faker } from "@faker-js/faker";
import { RemoteActivities } from "../activities";
import {
  makeActivityCreate,
  makeActivityResponse,
} from "@/data/activities/test";
import { MockActivitiesAdapter } from "@/data/adapter/test";

describe("Activities", () => {
  const makeSut = () => {
    const remoteActivities = new RemoteActivities(new MockActivitiesAdapter());

    return { remoteActivities };
  };

  it("should create an activity", async () => {
    const { remoteActivities } = makeSut();
    const mockCreateParams = makeActivityCreate();

    const mockCreateResponse = {
      ...makeActivityCreate(),
      activityId: faker.string.uuid(),
    };

    jest
      .spyOn(remoteActivities, "create")
      .mockResolvedValue(mockCreateResponse);

    const result = await remoteActivities.create(mockCreateParams);

    expect(remoteActivities.create).toHaveBeenCalledWith(mockCreateParams);

    expect(result).toEqual(mockCreateResponse);
  });

  it("should get activities by trip id", async () => {
    const { remoteActivities } = makeSut();
    const mockResponse = makeActivityResponse();
    const mockId = faker.string.uuid();

    jest
      .spyOn(remoteActivities, "getActivitiesByTripId")
      .mockResolvedValue(mockResponse);

    const result = await remoteActivities.getActivitiesByTripId(mockId);

    expect(remoteActivities.getActivitiesByTripId).toHaveBeenCalledWith(mockId);

    expect(result).toEqual(mockResponse);
  });
});
