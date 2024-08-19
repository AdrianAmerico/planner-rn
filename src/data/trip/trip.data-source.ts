import { TripCreate, TripDetails, TripUpateParams } from "./trip";

export interface TripDataSource {
  create: (trip: TripCreate) => Promise<{
    tripId: string;
  }>;
  getById: (id: string) => Promise<TripDetails>;
  update: (trip: TripUpateParams) => Promise<TripDetails>;
}
