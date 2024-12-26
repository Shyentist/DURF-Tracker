import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';

import { CharacterType } from '@/types/CharacterType';

export default function Index() {
  const [characters, setCharacters] = useState<CharacterType[]>([]);

  /* for testing purposes, button to delete all characters 
  
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully!');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }}

    this is to be put in the view area

      <View>
        <Button title="Clear All Characters" onPress={clearStorage} />
      </View>
      
  */

  const loadCharacters = async () => {
    try {
      setCharacters([]);
      const savedCharacters = await AsyncStorage.getItem('characters');
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters));
      }
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCharacters();
    }, [])
  );

  // the + button creates a default character and saves it (adds to other saved characters)
  const handlePress = async () => {    
    const newCharacter: CharacterType = {
      id: `${Date.now()}`,
      name: 'New Character',
      hitdice: 1,
      xp: 0,
      strength: 1,
      dexterity: 1,
      will: 1,
      description: "",
      biography: "",
      inventory: [],
      spells: [],
      gold: 0
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
  const renderItem = ({ item }: { item: CharacterType }) => (
    <View style={styles.characterCard}>
      <Link href={`./character/${item.id}`}>
        <View>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={30} color="black" />
          </View>
          <Text style={styles.characterName}>{item.name}</Text>
        </View>
      </Link>
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
        numColumns={2}
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
    width: '45%',
    justifyContent: 'center',
    //borderRadius: 10, // I'm not sure about this, maybe with other colors
    //backgroundColor: '#f5f5f5', // as above
    padding: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFDE21',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    paddingBottom: 3 // sub-optimal vertical centering
  }
});
