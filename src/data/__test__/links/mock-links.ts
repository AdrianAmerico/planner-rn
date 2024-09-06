import { Link, LinkCreate } from "@/data/links";
import { faker } from "@faker-js/faker";

export const makeLink = (props?: Partial<Link>): Link => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(),
  url: faker.internet.url(),
  ...props,
});

export const makeLinkCreate = (props?: Partial<LinkCreate>): LinkCreate => ({
  tripId: faker.string.uuid(),
  title: faker.lorem.words(),
  url: faker.internet.url(),
  ...props,
});
