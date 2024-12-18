import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { CharacterType } from '@/types/CharacterType';

export default function CharacterDetail() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedCharacter, setUpdatedCharacter] = useState<CharacterType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const savedCharacters = await AsyncStorage.getItem('characters');
        if (savedCharacters) {
          const characters: CharacterType[] = JSON.parse(savedCharacters);
          const foundCharacter = characters.find((char) => char.id === id);
          setCharacter(foundCharacter || null);
          setUpdatedCharacter(foundCharacter || null);
        }
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    if (updatedCharacter) {
      setUpdatedCharacter({
        ...updatedCharacter,
        [field]: value,
      });
    }
  };

  const validateAndSave = async () => {
    if (!updatedCharacter) return;

    const { name, level, strength, dexterity, will, description, biography, inventory } = updatedCharacter;

    // for validation
    if (!name || !level || !strength || !dexterity || !will || !description || !biography) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (isNaN(Number(level)) || isNaN(Number(strength)) || isNaN(Number(dexterity)) || isNaN(Number(will))) {
      Alert.alert('Validation Error', 'Level, Strength, Dexterity, and Will must be numbers.');
      return;
    }

    try {
      const savedCharacters = await AsyncStorage.getItem('characters');
      if (savedCharacters) {
        const characters: CharacterType[] = JSON.parse(savedCharacters);
        const updatedCharacters = characters.map((char) =>
          char.id === id ? updatedCharacter : char
        );
        await AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  const deleteCharacter = async () => {
    Alert.alert(
      'Delete Character',
      `Are you sure you want to delete "${character?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const savedCharacters = await AsyncStorage.getItem('characters');
              if (savedCharacters) {
                const characters: CharacterType[] = JSON.parse(savedCharacters);
                const updatedCharacters = characters.filter((char) => char.id !== id);
                await AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
              }
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Error deleting character:', error);
            }
          },
        },
      ]
    );
  };

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
      <TouchableOpacity style={styles.deleteButton} onPress={deleteCharacter}>
        <Ionicons name="trash" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{character.name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.name || ''}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Character Name"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Level:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.level.toString() || ''}
            onChangeText={(value) => handleInputChange('level', value)}
            keyboardType="numeric"
            placeholder="Level"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>STR:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.strength.toString() || ''}
            onChangeText={(value) => handleInputChange('strength', value)}
            keyboardType="numeric"
            placeholder="Strength"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>DEX:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.dexterity.toString() || ''}
            onChangeText={(value) => handleInputChange('dexterity', value)}
            keyboardType="numeric"
            placeholder="Dexterity"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>WIL:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.will.toString() || ''}
            onChangeText={(value) => handleInputChange('will', value)}
            keyboardType="numeric"
            placeholder="Will"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.description || ''}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Description"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Biography:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.biography || ''}
            onChangeText={(value) => handleInputChange('biography', value)}
            placeholder="Biography"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Inventory:</Text>
          <Text style={styles.input}>
            {updatedCharacter?.inventory.join(', ') || 'No items in inventory'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gold:</Text>
          <TextInput
            style={styles.input}
            value={updatedCharacter?.gold.toString() || ''}
            onChangeText={(value) => handleInputChange('gold', value)}
            keyboardType="numeric"
            placeholder="Gold"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  deleteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFDE21',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // for Android shadow
    zIndex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#FFDE21',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
