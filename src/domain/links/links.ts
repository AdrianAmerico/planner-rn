import { LinkCreate, LinksDataSource } from "@/data";

export class RemoteLinks {
  constructor(private dataSource: LinksDataSource) {}

  async create({ tripId, title, url }: LinkCreate) {
    return await this.dataSource.create({ tripId, title, url });
  }

  async getLinksByTripId(tripId: string) {
    return await this.dataSource.getLinksByTripId(tripId);
  }
}
