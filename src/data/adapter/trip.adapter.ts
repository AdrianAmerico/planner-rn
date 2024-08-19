import { HttpClient } from "../protocols";
import {
  TripCreate,
  TripDataSource,
  TripDetails,
  TripUpateParams,
} from "../trip";

export class TripAdapter implements TripDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async create(trip: TripCreate) {
    try {
      const { data } = await this.httpClient.request<{ tripId: string }>({
        method: "post",
        url: "/trips",
        body: {
          ...trip,
          owner_name: "Adrian Américo",
          owner_email: "1fnadrian1@gmail.com",
        },
      });

      return data;
    } catch (error) {
      throw new Error("Failed to create trip");
    }
  }

  async getById(id: string) {
    try {
      const { data } = await this.httpClient.request<{ trip: TripDetails }>({
        method: "get",
        url: `/trips/${id}`,
      });

      return data.trip;
    } catch (error) {
      throw new Error("Failed to fetch trip details");
    }
  }

  async update(trip: TripUpateParams) {
    try {
      const { data } = await this.httpClient.request<{ trip: TripDetails }>({
        method: "put",
        url: `/trips/${trip.id}`,
        body: trip,
      });

      return data.trip;
    } catch (error) {
      throw new Error("Failed to update trip");
    }
  }
}
