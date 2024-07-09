import { Text, View } from "react-native";
import { TripData } from "./[id]";

interface TripActivitiesProps {
  tripDetails: TripData;
}

export const TripActivities = ({ tripDetails }: TripActivitiesProps) => {
  return (
    <View className="flex-1">
      <Text className="text-white">{tripDetails.destination}</Text>
    </View>
  );
};
