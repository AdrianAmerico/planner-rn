import { ActivitiesDataSource, ActivityCreate } from "@/data/activities";
import { makeActivityResponse } from "@/data/__test__/activities";
import { faker } from "@faker-js/faker";

export class MockActivitiesAdapter implements ActivitiesDataSource {
  async create(_props: ActivityCreate) {
    return Promise.resolve({ activityId: faker.string.uuid() });
  }

  async getActivitiesByTripId(_tripId: string) {
    return Promise.resolve(makeActivityResponse());
  }
}
