import { Stack } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity
            onPress={() => alert("Ikon tryckt!")}
            style={{ marginRight: 15 }}
          >
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerTitle: "Things To Do",
      }}
    />
  );
}
