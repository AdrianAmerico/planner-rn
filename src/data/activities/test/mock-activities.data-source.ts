import { Activity, ActivityCreate, ActivityResponse } from "../activities";
import { ActivitiesDataSource } from "../activities.data-source";

export class MockActivitiesDataSource implements ActivitiesDataSource {
  private activities: Activity[] = [];

  async create(props: ActivityCreate): Promise<{ activityId: string }> {
    const activityId = "activity-id";

    this.activities.push({
      ...props,
      id: activityId,
    });

    return { activityId };
  }

  async getActivitiesByTripId(tripId: string): Promise<ActivityResponse> {
    return {
      activities: [
        {
          date: "2021-01-01",
          activities: [
            {
              id: tripId,
              title: "Activity Title",
              occurs_at: "2021-01-01T12:00:00Z",
            },
          ],
        },
      ],
    };
  }
}
