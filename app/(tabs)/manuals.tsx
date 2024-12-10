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
      >On this screen, the pdfs of the manuals will be displayed.</Text>
    </View>
  );
}
