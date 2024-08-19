import { ActivitiesDataSource, Activity } from "../activities";
import { HttpClient } from "../protocols/http";
import { injectable } from "tsyringe";

@injectable()
export class ActivitiesAdapter implements ActivitiesDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async create(props: {
    tripId: string;
    occurs_at: string;
    title: string;
  }): Promise<{ activityId: string }> {
    try {
      const { data } = await this.httpClient.request<{
        activityId: string;
      }>({
        url: `/trips/${props.tripId}/activities`,
        method: "post",
        body: {
          occurs_at: props.occurs_at,
          title: props.title,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getActivitiesByTripId(tripId: string) {
    const { data } = await this.httpClient
      .request<{ date: string; activities: Activity[] }[]>({
        url: `/trips/${tripId}/activities`,
        method: "get",
      })
      .then((response) => response)
      .catch((error) => {
        throw error;
      });

    return data;
  }
}
