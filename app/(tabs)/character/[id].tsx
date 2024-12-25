import React, { useEffect, useState } from 'react';
import { 
  Text, 
  StyleSheet, 
  View, ScrollView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
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
        [field]: field === 'strength' || field === 'dexterity' || field === 'will' || field === 'hitdice' || field === 'gold' || field === 'xp'
          ? Number(value)
          : value,
      });
    }
  };

  const validateAndSave = async () => {
    if (!updatedCharacter) return;

    const { name, hitdice, strength, dexterity, will, description, biography, xp, gold } = updatedCharacter;

    if (
      !name || 
      hitdice == null || 
      strength == null || 
      dexterity == null || 
      will == null || 
      xp == null || 
      gold == null
    ) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (isNaN(Number(hitdice)) || isNaN(Number(strength)) || isNaN(Number(dexterity)) || isNaN(Number(will))) {
      Alert.alert('Validation Error', 'Hit Dice, Strength, Dexterity, and Will must be numbers.');
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

  if (!character || !updatedCharacter) {
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

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
        <Text style={styles.header}>{character.name}</Text>
        <View  style={styles.column}>
          <Text style={styles.sectionHeader}>Identity</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={updatedCharacter?.name || ''}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Character Name"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, {height: 80}]}
              multiline={true}
              value={updatedCharacter?.description || ''}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Your character's description"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Biography</Text>
            <TextInput
              style={[styles.input, {height: 80}]}
              multiline={true}
              value={updatedCharacter?.biography || ''}
              onChangeText={(value) => handleInputChange('biography', value)}
              placeholder="Your character's biography"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.column, {width:'49%'}]}> 
            <Text style={styles.sectionHeader}>Attributes</Text>
            <View style={styles.row}> 
              <Text style={styles.label}>STR</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.strength.toString()}
                onChangeText={(value) => handleInputChange('strength', value)}
                keyboardType="numeric"
                placeholder="Strength"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>DEX</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.dexterity.toString()}
                onChangeText={(value) => handleInputChange('dexterity', value)}
                keyboardType="numeric"
                placeholder="Dexterity"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>WIL</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.will.toString()}
                onChangeText={(value) => handleInputChange('will', value)}
                keyboardType="numeric"
                placeholder="Will"
              />
            </View>
          </View>
          <View style={[styles.column, {width:'49%'}]}>
            <Text style={styles.sectionHeader}>Progress</Text>
            <View style={styles.row}>
              <Text style={styles.label}>HD</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.hitdice.toString()}
                onChangeText={(value) => handleInputChange('hitdice', value)}
                keyboardType="numeric"
                placeholder="Hit Dice"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>XP</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.xp.toString()}
                onChangeText={(value) => handleInputChange('xp', value)}
                keyboardType="numeric"
                placeholder="Experience Points"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>GP</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.gold.toString()}
                onChangeText={(value) => handleInputChange('gold', value)}
                keyboardType="numeric"
                placeholder="Gold Pieces"
              />
            </View>
          </View>
        </View>

        <View style={[styles.column, {width:'100%'}]}>
          <Text style={styles.sectionHeader}>Inventory ({updatedCharacter?.inventory.length}/{10 + updatedCharacter?.strength})</Text>
          <View style={styles.row}>
            <Text style={[styles.label, {textAlign: 'center', width: '36%'}]}>Name</Text>
            <Text style={[styles.label, {textAlign: 'center', width: '36%'}]}>Notes</Text>
            <Text style={[styles.label, {textAlign: 'center', width: '12%'}]}>Slots</Text>
            <Text style={[styles.label, {textAlign: 'center', width: '15%'}]}>Price</Text>
          </View>
          {updatedCharacter?.inventory.length ? (
            updatedCharacter.inventory.map((item, index) => (
              <View key={item.id} style={styles.row}>
                  <TextInput style={[styles.input, { width: '36%' }]}>Name: {item.name}</TextInput>
                  <TextInput style={[styles.input, { width: '36%' }]}>Notes: {item.notes}</TextInput>
                  <TextInput style={[styles.input, { width: '12%' }]}>Slots: {item.slots}</TextInput>
                  <TextInput style={[styles.input, { width: '15%' }]}>Price: {item.price} GP</TextInput>
              </View>
            ))
          ) : (
            
        <View style={styles.row}>
          <TextInput
                style={[styles.input, { width: '36%' }]}
                placeholder="Name"
              />
          <TextInput
                style={[styles.input, { width: '36%' }]}
                placeholder="Notes"
              />
          <TextInput
                style={[styles.input, { width: '12%' }]}
                keyboardType="numeric"
                placeholder="Slots"
              />
          <TextInput
                style={[styles.input, { width: '15%' }]}
                keyboardType="numeric"
                placeholder="Price"
              />
        </View>
          )}
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
    padding: 10,
  },
  header: {
    fontSize: 20,
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    marginTop: 3,
    justifyContent: 'space-evenly'
  },
  column: {
    padding:4,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'darkgrey',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 3,
    marginTop: 3,
    justifyContent: 'space-around'
  },
  label: {
    fontWeight: 'bold',
    width: '25%',
    fontSize: 12
  },
  input: {
    width: '65%',
    paddingLeft: 4,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 12
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  deleteItemButton: {
    marginLeft: 10,
    padding: 5,
  }
  
});
