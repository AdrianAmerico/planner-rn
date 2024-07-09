import { isAxiosError } from "axios";
import { api } from "./api";

export type TripDetails = {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
};

type TripCreate = Omit<TripDetails, "id" | "is_confirmed"> & {
  emails_to_invite: string[];
};

const create = async (
  trip: TripCreate
): Promise<{
  tripId: string;
}> => {
  try {
    const { data } = await api.post<{ tripId: string }>("/trips", {
      ...trip,
      owner_name: "Adrian Américo",
      owner_email: "1fnadrian1@gmail.com",
    });

    return data;
  } catch (error) {
    throw new Error("Failed to create trip");
  }
};

const getById = async (id: string): Promise<TripDetails> => {
  try {
    const { data } = await api.get<{ trip: TripDetails }>(`/trips/${id}`);

    return data.trip;
  } catch (error) {
    throw new Error("Failed to fetch trip details");
  }
};

const update = async ({
  id,
  ...rest
}: Omit<TripDetails, "is_confirmed">): Promise<TripDetails> => {
  try {
    const { data } = await api.put<{ trip: TripDetails }>(`/trips/${id}`, rest);

    return data.trip;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }

    throw new Error("Failed to update trip");
  }
};

export const tripServer = {
  create,
  getById,
  update,
};
