import { TripCreate, TripDataSource, TripUpateParams } from "@/data/trip";

export class RemoteTrip implements TripDataSource {
  constructor(private dataSource: TripDataSource) {}

  async create(trip: TripCreate) {
    return await this.dataSource.create(trip);
  }

  async getById(id: string) {
    return await this.dataSource.getById(id);
  }

  async update(trip: TripUpateParams) {
    return await this.dataSource.update(trip);
  }
}
