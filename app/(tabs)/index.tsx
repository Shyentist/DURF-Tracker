import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text 
        style={{ fontFamily: 'RobotoSlab' }}
      >Edit app/(tabs)/index.tsx to edit this screen.
      </Text>
    </SafeAreaView>
  );
}
