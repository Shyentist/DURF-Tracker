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
      >It seemed like a good idea to have Settings, though I have no idea what Settings there will be.</Text>
    </View>
  );
}
