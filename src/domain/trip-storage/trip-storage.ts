import { TripStorageDataSource } from "@/data/trip-storage";

export class RemoteTripStorage implements TripStorageDataSource {
  constructor(private dataSource: TripStorageDataSource) {}

  async save(tripId: string) {
    return await this.dataSource.save(tripId);
  }
  async get() {
    return await this.dataSource.get();
  }
  async remove() {
    return await this.dataSource.remove();
  }
}
