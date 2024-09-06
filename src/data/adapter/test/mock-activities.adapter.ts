import { ActivitiesDataSource, ActivityCreate } from "@/data/activities";
import { makeActivityResponse } from "@/data/activities/test";

export class MockActivitiesAdapter implements ActivitiesDataSource {
  async create(_props: ActivityCreate) {
    return { activityId: "activity-id" };
  }

  async getActivitiesByTripId(_tripId: string) {
    return makeActivityResponse();
  }
}
