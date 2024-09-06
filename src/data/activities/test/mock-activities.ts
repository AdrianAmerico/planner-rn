import { faker } from "@faker-js/faker";
import { Activity, ActivityCreate, ActivityResponse } from "../activities";

export const makeActivity = (props?: Partial<Activity>): Activity => ({
  id: faker.string.uuid(),
  occurs_at: faker.date.recent().toISOString(),
  title: faker.lorem.words(),
  ...props,
});

export const mockActivityCreate = (
  props?: Partial<ActivityCreate>
): ActivityCreate => ({
  tripId: faker.string.uuid(),
  occurs_at: faker.date.recent().toISOString(),
  title: faker.lorem.words(),
  ...props,
});

export const mockActivityResponse = (
  props?: Partial<ActivityResponse>
): ActivityResponse => ({
  activities: [
    {
      date: faker.date.recent().toISOString(),
      activities: [makeActivity()],
    },
  ],
  ...props,
});
