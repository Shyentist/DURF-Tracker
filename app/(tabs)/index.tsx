import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const handlePress = () => {
    console.log('Create New Character button pressed!');
    // placeholder for actual character creation
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        In this screen, all the user's characters' sheets will be listed. The + button creates a new character sheet.
      </Text>

      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'RobotoSlab',
    fontSize: 16,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute', // always on top of other elements on screen
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // attempt at making it round
    backgroundColor: '#FFDE21', // yellow (or customize as needed)
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  plusText: {
    fontSize: 32,
    color: 'black',
    paddingBottom: 8 // sub-optimal vertical centering
  },
});
