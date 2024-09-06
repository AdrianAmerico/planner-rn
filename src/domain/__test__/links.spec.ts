import { makeLink, makeLinkCreate, MockLinksAdapter } from "@/data/__test__";
import { RemoteLinks } from "../links";
import { faker } from "@faker-js/faker";

describe("Links", () => {
  const makeSut = () => {
    const remoteLinks = new RemoteLinks(new MockLinksAdapter());

    return { remoteLinks };
  };

  it("should create a link", async () => {
    const { remoteLinks } = makeSut();
    const mockCreateParams = makeLinkCreate();

    const mockCreateResponse = {
      ...makeLinkCreate(),
      linkId: faker.string.uuid(),
    };

    jest.spyOn(remoteLinks, "create").mockResolvedValue(mockCreateResponse);

    const result = await remoteLinks.create(mockCreateParams);

    expect(remoteLinks.create).toHaveBeenCalledWith(mockCreateParams);

    expect(result).toEqual(mockCreateResponse);
  });

  it("should get links by trip id", async () => {
    const { remoteLinks } = makeSut();
    const mockResponse = [makeLink()];
    const mockId = faker.string.uuid();

    jest.spyOn(remoteLinks, "getLinksByTripId").mockResolvedValue(mockResponse);

    const result = await remoteLinks.getLinksByTripId(mockId);

    expect(remoteLinks.getLinksByTripId).toHaveBeenCalledWith(mockId);

    expect(result).toEqual(mockResponse);
  });
});
