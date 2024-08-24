export interface TripStorageDataSource {
  save: (tripId: string) => Promise<void>;
  get: () => Promise<string | null>;
  remove: () => Promise<void>;
}
