import AsyncStorage from "@react-native-async-storage/async-storage";
import { TRIP_STORAGE_KEY, TripStorageDataSource } from "../trip-storage";

export class TripStorageAdapter implements TripStorageDataSource {
  async save(tripId: string) {
    await AsyncStorage.setItem(TRIP_STORAGE_KEY, tripId);
  }
  async get() {
    const tripId = await AsyncStorage.getItem(TRIP_STORAGE_KEY);
    return tripId;
  }
  async remove() {
    await AsyncStorage.removeItem(TRIP_STORAGE_KEY);
  }
}
