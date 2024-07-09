import { Text, View } from "react-native";

interface TripActivitiesProps {
  tripId: string;
}

export const TripDetailsTab = ({ tripId }: TripActivitiesProps) => {
  return (
    <View className="flex-1">
      <Text className="text-white">TripDetails</Text>
    </View>
  );
};
