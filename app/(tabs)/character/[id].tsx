import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharacterType } from '@/types/CharacterType';

export default function CharacterDetail() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const savedCharacters = await AsyncStorage.getItem('characters');
        if (savedCharacters) {
          const characters: CharacterType[] = JSON.parse(savedCharacters);
          const foundCharacter = characters.find((char) => char.id === id);
          setCharacter(foundCharacter || null);
        }
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Character not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>{character.name}</Text>
        <Text>Level: {character.level}</Text>
        <Text>Strength: {character.strength}</Text>
        <Text>Dexterity: {character.dexterity}</Text>
        <Text>Will: {character.will}</Text>
        <Text>Description: {character.description}</Text>
        <Text>Biography: {character.biography}</Text>
        <Text>Inventory Slots: {character.inventorySlots}</Text>
        <Text>Inventory: {character.inventory}</Text>
        <Text>Spells: {character.spells}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
