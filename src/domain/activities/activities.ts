import { ActivityCreate } from "@/data/activities/activities";
import { ActivitiesDataSource } from "@/data/activities";
import { injectable } from "tsyringe";

@injectable()
export class RemoteActivities {
  constructor(private dataSource: ActivitiesDataSource) {}

  async create({ tripId, occurs_at, title }: ActivityCreate) {
    return await this.dataSource.create({ tripId, occurs_at, title });
  }

  async getActivitiesByTripId(tripId: string) {
    return await this.dataSource.getActivitiesByTripId(tripId);
  }
}
