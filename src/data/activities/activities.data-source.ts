import { Activity, ActivityCreate } from "./activities";

export interface ActivitiesDataSource {
  create(props: ActivityCreate): Promise<{ activityId: string }>;
  getActivitiesByTripId(
    tripId: string
  ): Promise<{ date: string; activities: Activity[] }[]>;
}
