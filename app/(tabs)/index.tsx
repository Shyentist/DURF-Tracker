import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type CharacterData = {
  name: string;
  level: number;
  strength: number;
  dexterity: number;
  will: number;
  description: string;
  biography: string;
};

export default function Index() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  useEffect(() => {
    // load saved characters when the component mounts
    const loadCharacters = async () => {
      try {
        const savedCharacters = await AsyncStorage.getItem('characters');
        if (savedCharacters) {
          setCharacters(JSON.parse(savedCharacters));
        }
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    loadCharacters();
  }, []);

  // the + button creates a default character and saves it (adds to other saved characters)
  const handlePress = async () => {
    console.log('Create New Character button pressed!');
    
    const newCharacter: CharacterData = {
      name: 'New Character',
      level: 1,
      strength: 1,
      dexterity: 1,
      will: 1,
      description: "Your character's description.",
      biography: "Your character's biography.",
    };

    try {
      const savedCharacters = await AsyncStorage.getItem('characters');
      let charactersArray = savedCharacters ? JSON.parse(savedCharacters) : [];

      charactersArray.push(newCharacter);

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));

      setCharacters(charactersArray);
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  // render a list containing each character to be loaded in the view
  const renderItem = ({ item }: { item: CharacterData }) => (
    <View style={styles.characterCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="person" size={30} color="black" />
      </View>
      <Text style={styles.characterName}>{item.name}</Text>
    </View>
  );

  const renderNoCharacters = () => (
    <Text>
      To create a new character, press the + button.
    </Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={renderNoCharacters} // display message when no characters exist
        style={styles.characterList}
      />
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
    paddingTop: 20,
  }
  ,
  text: {
    fontFamily: 'RobotoSlab',
    fontSize: 16,
    textAlign: 'center',
  },
  characterList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  characterCard: {
    alignItems: 'center',
    marginBottom: 20,
    width: '30%', // each card occupies 30% width of the row
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFDE21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute', // always on top of other elements on screen
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // attempt at making it round
    backgroundColor: '#FFDE21', // yellow
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // for Android shadow
  },
  plusText: {
    fontSize: 32,
    color: 'black',
    paddingBottom: 8 // sub-optimal vertical centering
  }
});
