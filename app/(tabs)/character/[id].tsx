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
import { ItemType } from '@/types/ItemType';
import { SpellType } from '@/types/SpellType';

export default function CharacterDetail() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedCharacter, setUpdatedCharacter] = useState<CharacterType | null>(null);
  const [updatedInventory, setUpdatedInventory] = useState<ItemType[] | null>(null);
  const [updatedSpellbook, setUpdatedSpellbook] = useState<SpellType[] | null>(null);
  const router = useRouter();
  
  const emptySpell: SpellType = { id: `${Date.now()}`, name: "", notes: ""};
  const emptyItem: ItemType = { id: `${Date.now()}`, name: "", notes: "", slots: 0, price: 0 };

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const savedCharacters = await AsyncStorage.getItem('characters');
        if (savedCharacters) {
          const characters: CharacterType[] = JSON.parse(savedCharacters);
          const foundCharacter = characters.find((char) => char.id === id);
          setCharacter(foundCharacter || null);
          setUpdatedCharacter(foundCharacter || null);

          if (Array.isArray(foundCharacter?.inventory) && foundCharacter?.inventory.length === 0) {
            setUpdatedInventory([emptyItem]);
          } else {
            setUpdatedInventory(foundCharacter?.inventory || null);
          }
          
          if (Array.isArray(foundCharacter?.spells) && foundCharacter?.spells.length === 0) {
            setUpdatedSpellbook([emptySpell]);
          } else {
            setUpdatedSpellbook(foundCharacter?.spells || null);
          }
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

  const handleInventoryChange = (field: string, value: string, id: string) => {
    if (!updatedCharacter) return;
  
    if (!updatedInventory || updatedInventory.length === 0) {
      setUpdatedInventory([emptyItem]);
      return;
    }

    let updatedItems = updatedInventory.map((item) =>
      item.id === id
        ? { ...item, [field]: field === 'slots' || field === 'price' ? Number(value) : value }
        : item
    );
    
    const totalSlotsUsed = updatedItems.reduce(
      (sum, item) => sum + (item.slots || 0),
      0
    );
  
    const maxCargo = 10 + (updatedCharacter.strength || 0);

    updatedItems = updatedItems.filter((item) => item.name);

    // add empty row if necessary
    if (totalSlotsUsed <= maxCargo) {
      updatedItems = [...updatedItems, emptyItem];
    } else {
      return;
    }

    updatedCharacter.inventory = updatedItems;

    setUpdatedInventory(updatedItems);
    setCharacter(updatedCharacter);
  };

  const handleSpellbookChange = (field: string, value: string, id: string) => {
    if (!updatedCharacter) return;
  
    if (!updatedSpellbook || updatedSpellbook.length === 0) {
      setUpdatedSpellbook([emptySpell]);
      return;
    }

    let updatedSpells = updatedSpellbook.map((spell) =>
      spell.id === id
        ? { ...spell, [field]: field === 'slots' || field === 'price' ? Number(value) : value }
        : spell
    );

    updatedSpells = updatedSpells.filter((item) => item.name);

    updatedSpells = [...updatedSpells, emptySpell];
    
    updatedCharacter.spells = updatedSpells;

    setUpdatedSpellbook(updatedSpells);
    setCharacter(updatedCharacter);
  };
  
  const validateAndSave = async () => {
    if (!updatedCharacter) return;

    const { name, hitdice, strength, dexterity, will, xp, gold } = updatedCharacter;

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

        setCharacter(updatedCharacter);

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

  if (!character || !updatedCharacter || !updatedInventory || !updatedSpellbook) {
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
      <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
                  style={styles.header}
                  value={updatedCharacter?.name || ''}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Character Name"
            />
            <View style={styles.row}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, {height: 50}]}
                multiline={true}
                value={updatedCharacter?.description || ''}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Your character's description"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Biography</Text>
              <TextInput
                style={[styles.input, {height: 50}]}
                multiline={true}
                value={updatedCharacter?.biography || ''}
                onChangeText={(value) => handleInputChange('biography', value)}
                placeholder="Your character's biography"
              />
            </View>
          </View>
        </View>

        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={[styles.column, {width:'49.5%'}]}> 
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
          <View style={[styles.column, {width:'49.5%'}]}>
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

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>
              Inventory ({
              updatedInventory.reduce((sum, item) => sum + (item.slots || 0), 0)}/{10 + updatedCharacter?.strength
              })
            </Text>
            <View style={styles.row}>
              <Text style={[styles.label, { textAlign: 'center', width: '36%' }]}>Name</Text>
              <Text style={[styles.label, { textAlign: 'center', width: '36%' }]}>Notes</Text>
              <Text style={[styles.label, { textAlign: 'center', width: '12%' }]}>Slots</Text>
              <Text style={[styles.label, { textAlign: 'center', width: '12%' }]}>Price</Text>
            </View>
            {updatedInventory.map((item, index) => (
              <View key={item.id} style={styles.row}>
                <TextInput
                  style={[styles.input, { width: '36%' }]}
                  value={item.name}
                  onChangeText={(value) => handleInventoryChange('name', value, item.id)}
                  placeholder="Name"
                />
                <TextInput
                  style={[styles.input, { width: '36%' }]}
                  value={item.notes}
                  onChangeText={(value) => handleInventoryChange('notes', value, item.id)}
                  placeholder="Notes"
                />
                <TextInput
                  style={[styles.input, { width: '12%' }]}
                  value={item.slots.toString()}
                  onChangeText={(value) => handleInventoryChange('slots', value, item.id)}
                  keyboardType="numeric"
                  placeholder="Slots"
                />
                <TextInput
                  style={[styles.input, { width: '12%' }]}
                  value={item.price.toString()}
                  onChangeText={(value) => handleInventoryChange('price', value, item.id)}
                  keyboardType="numeric"
                  placeholder="Price"
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>
              Spellbook
            </Text>
            <View style={styles.row}>
              <Text style={[styles.label, { textAlign: 'center', width: '40%' }]}>Name</Text>
              <Text style={[styles.label, { textAlign: 'center', width: '60%' }]}>Notes</Text>
            </View>
            {updatedSpellbook.map((spell, index) => (
              <View key={spell.id} style={styles.row}>
                <TextInput
                  style={[styles.input, { width: '40%' }]}
                  value={spell.name}
                  onChangeText={(value) => handleSpellbookChange('name', value, spell.id)}
                  placeholder="Name"
                />
                <TextInput
                  style={[styles.input, { width: '60%' }]}
                  value={spell.notes}
                  onChangeText={(value) => handleSpellbookChange('notes', value, spell.id)}
                  placeholder="Notes"
                />
              </View>
            ))}
          </View>
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
    padding: 6,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    borderColor: '#ddd',
    borderBottomWidth: 1,
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
    width: '100%',
    padding:4,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ddd',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 1
  },
  label: {
    fontWeight: 'bold',
    width: '25%',
    fontSize: 12,
    paddingBottom: 0
  },
  input: {
    width: '65%',
    paddingLeft: 4,
    height: 20,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    fontSize: 12,
    paddingBottom: 0,
    paddingTop: 0
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
  },
  editIcon: {
    marginLeft: 8,
  }
  
});
