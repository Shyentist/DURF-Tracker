import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text 
        style={{
          fontFamily: 'RobotoSlab-Regular'
        }}
      >Edit app/(tabs)/settings.tsx to edit this screen.</Text>
    </View>
  );
}
