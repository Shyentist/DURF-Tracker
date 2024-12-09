import { Text, View } from "react-native";

export default function Manuals() {
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
      >Edit app/(tabs)/manuals.tsx to edit this screen.</Text>
    </View>
  );
}
