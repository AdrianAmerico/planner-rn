import { ActivityCreate, ActivityResponse } from "@/data/activities/activities";

async function create({ tripId, occurs_at, title }: ActivityCreate) {
  try {
    const { data } = await api.post<{ activityId: string }>(
      `/trips/${tripId}/activities`,
      { occurs_at, title }
    );

    return data;
  } catch (error) {
    throw error;
  }
}

async function getActivitiesByTripId(tripId: string) {
  try {
    const { data } = await api.get<ActivityResponse>(
      `/trips/${tripId}/activities`
    );
    return data.activities;
  } catch (error) {
    throw error;
  }
}

export const activitiesServer = { create, getActivitiesByTripId };
