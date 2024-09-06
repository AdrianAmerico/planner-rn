import { ActivityCreate, ActivityResponse } from "./activities";

export interface ActivitiesDataSource {
  create(props: ActivityCreate): Promise<{ activityId: string }>;
  getActivitiesByTripId(tripId: string): Promise<ActivityResponse>;
}
