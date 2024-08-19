import { Link, LinkCreate } from "./links";

export interface LinksDataSource {
  create: (props: LinkCreate) => Promise<{ linkId: string }>;
  getLinksByTripId: (tripId: string) => Promise<Link[]>;
}
