import { LinkCreate, LinksDataSource } from "@/data/links";
import { makeLink } from "../links";
import { faker } from "@faker-js/faker";

export class MockLinksAdapter implements LinksDataSource {
  async create(_props: LinkCreate) {
    return Promise.resolve({
      linkId: faker.string.uuid(),
    });
  }

  async getLinksByTripId(_tripId: string) {
    return Promise.resolve([makeLink()]);
  }
}
