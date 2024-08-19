import { Link, LinkCreate, LinksDataSource } from "../links";
import { HttpClient } from "../protocols";

export class LinksAdapter implements LinksDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  public async create(props: LinkCreate) {
    try {
      const { data } = await this.httpClient.request<{ linkId: string }>({
        method: "post",
        url: `/trips/${props.tripId}/links`,
        body: {
          title: props.title,
          url: props.url,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getLinksByTripId(tripId: string): Promise<Link[]> {
    try {
      const { data } = await this.httpClient.request<{ links: Link[] }>({
        method: "get",
        url: `/trips/${tripId}/links`,
      });

      return data.links;
    } catch (error) {
      throw error;
    }
  }
}
