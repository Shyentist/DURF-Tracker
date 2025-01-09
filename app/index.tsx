import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CharacterType } from '@/types/CharacterType';

export default function Index() {

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

  const { t } = useTranslation();

  const [characters, setCharacters] = useState<CharacterType[]>([]);

  const loadCharacters = async () => {
    try {
      setCharacters([]);
      const savedCharacters = await AsyncStorage.getItem('characters');
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters));
      }
    } catch (error) {
      console.error(t('errorLoadingCharacters'), error);
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
      name: t('defaultCharacterName'),
      hitdice: 1,
      xp: 0,
      strength: 1,
      dexterity: 1,
      will: 1,
      description: "",
      biography: "",
      inventory: [],
      spells: [],
      gold: 0,
      img: "@/assets/images/newCharacter.jpg"
    };

    try {
      const savedCharacters = await AsyncStorage.getItem('characters');
      let charactersArray = savedCharacters ? JSON.parse(savedCharacters) : [];

      charactersArray.push(newCharacter);

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));

      setCharacters(charactersArray);
    } catch (error) {
      console.error(t('errorSavingCharacter'), error);
    }
  };

  // render a list containing each character to be loaded in the view
  const renderItem = ({ item }: { item: CharacterType }) => (
    <Link href={`./character/${item.id}`} asChild>
      <TouchableOpacity style={styles.characterCard}>
        <Image
          source={require('@/assets/images/newCharacter.png')}
          style={styles.characterImage}
          resizeMode="contain"
        />
        <Text style={styles.characterName}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  const renderNoCharacters = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.text}>
        <Text style={styles.text}>{t('noCharacters')}</Text>
      </Text>
    </View>
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
    padding: 6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'RobotoSlab',
    fontSize: 16,
    textAlign: 'center'
  },
  characterList: {
    width: '100%'
  },
  row: {
    justifyContent: 'space-between',
    marginVertical: 3,
    width: '100%'
  },
  characterCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ddd',
    width: '49%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  characterName: {
    marginTop: 6,
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
    elevation: 5 // for Android shadow
  },
  plusText: {
    fontSize: 32,
    color: 'black',
    paddingBottom: 3 // sub-optimal vertical centering
  },
  characterImage: {
    height: 90,
    width: 90,
    borderRadius: 10
  },
  emptyContainer: {
    marginTop: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
