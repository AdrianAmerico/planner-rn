import { HttpRequest, HttpResponse, HttpClient } from "@/data/protocols/http";
import { injectable } from "tsyringe";
import { axiosInstance } from "./axios-instance";

@injectable()
export class AxiosHttpClient implements HttpClient {
  async request<T>(data: HttpRequest): Promise<HttpResponse<T>> {
    const axiosResponse = await axiosInstance.request({
      url: data.url,
      method: data.method,
      data: data.body,
      headers: data.headers,
    });

    return {
      statusCode: axiosResponse.status,
      data: axiosResponse.data,
    };
  }
}
