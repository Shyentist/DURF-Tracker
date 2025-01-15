import React, { useEffect, useState } from 'react';
import { 
  Text, 
  StyleSheet, 
  View, ScrollView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { CharacterType } from '@/types/CharacterType';
import { ItemType } from '@/types/ItemType';
import { SpellType } from '@/types/SpellType';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../../src/hooks/useLanguage";

export default function CharacterDetail() {
  useLanguage();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedCharacter, setUpdatedCharacter] = useState<CharacterType | null>(null);
  const [updatedInventory, setUpdatedInventory] = useState<ItemType[] | null>(null);
  const [updatedSpellbook, setUpdatedSpellbook] = useState<SpellType[] | null>(null);
  const router = useRouter();
  
  const emptySpell: SpellType = { id: `${Date.now()}`, name: "", notes: ""};
  const emptyItem: ItemType = { id: `${Date.now()}`, name: "", notes: "", slots: 0, price: 0 };
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
      console.error(t('errotFetchingCharacter'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const resetCharacter = async () => {
    fetchCharacter()
  };
  
  const validateAndSave = async () => {
    console.log("here")

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
      Alert.alert(t('errorValidation'), t('fillInRequiredFields'));
      return;
    }

    if (isNaN(Number(hitdice)) || isNaN(Number(strength)) || isNaN(Number(dexterity)) || isNaN(Number(will)) || isNaN(Number(xp)) || isNaN(Number(gold))) {
      Alert.alert(t('errorValidation'), t('fieldsMustBeNumbers'));
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

        router.replace('/');
      }
    } catch (error) {
      console.error(t('errorSavingCharacter'), error);
    }
  };

  const deleteCharacter = async () => {
    Alert.alert(
      t('deleteCharacter'),
      t('areYouSure'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const savedCharacters = await AsyncStorage.getItem('characters');
              if (savedCharacters) {
                const characters: CharacterType[] = JSON.parse(savedCharacters);
                const updatedCharacters = characters.filter((char) => char.id !== id);
                await AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
              }
              router.replace('/');
            } catch (error) {
              console.error(t('errorDeletingCharacter'), error);
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
        <Text style={styles.header}>{t('characterNotFound')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
      <View style={styles.row}>
          <View style={styles.column}>
            <View style={[styles.row, {justifyContent: 'space-around'}]}>
              <TextInput
                    style={styles.header}
                    value={updatedCharacter?.name || ''}
                    onChangeText={(value) => handleInputChange('name', value)}
                    placeholder={t('emptyField')}
              />
              <Image
                source={require('@/assets/images/newCharacter.png')}
                style={styles.characterImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('description')}</Text>
              <TextInput
                style={[styles.input, {height: 42}]}
                multiline={true}
                value={updatedCharacter?.description || ''}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder={t('emptyField')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('biography')}</Text>
              <TextInput
                style={[styles.input, {height: 42}]}
                multiline={true}
                value={updatedCharacter?.biography || ''}
                onChangeText={(value) => handleInputChange('biography', value)}
                placeholder={t('emptyField')}
              />
            </View>
          </View>
        </View>

        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={[styles.column, {width:'49.5%'}]}> 
            <Text style={styles.sectionHeader}>{t('attributes')}</Text>
            <View style={styles.row}> 
              <Text style={styles.label}>{t('str')}</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.strength.toString()}
                onChangeText={(value) => handleInputChange('strength', value)}
                keyboardType="numeric"
                placeholder={t('emptyField')}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('dex')}</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.dexterity.toString()}
                onChangeText={(value) => handleInputChange('dexterity', value)}
                keyboardType="numeric"
                placeholder={t('emptyField')}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('wil')}</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.will.toString()}
                onChangeText={(value) => handleInputChange('will', value)}
                keyboardType="numeric"
                placeholder={t('emptyField')}
              />
            </View>
          </View>
          <View style={[styles.column, {width:'49.5%'}]}>
            <Text style={styles.sectionHeader}>{t('progress')}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{t('hd')}</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.hitdice.toString()}
                onChangeText={(value) => handleInputChange('hitdice', value)}
                keyboardType="numeric"
                placeholder={t('emptyField')}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('xp')}</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.xp.toString()}
                onChangeText={(value) => handleInputChange('xp', value)}
                keyboardType="numeric"
                placeholder={t('emptyField')}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('gp')}</Text>
              <TextInput
                style={styles.input}
                value={updatedCharacter?.gold.toString()}
                onChangeText={(value) => handleInputChange('gold', value)}
                keyboardType="numeric"
                placeholder={t('emptyField')}
              />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>
              {t('inventory')} ({
              updatedInventory.reduce((sum, item) => sum + (item.slots || 0), 0)}/{10 + updatedCharacter?.strength
              })
            </Text>
            <View style={styles.row}>
              <Text style={[styles.label, { width: '36%' }]}>{t('name')}</Text>
              <Text style={[styles.label, { width: '36%' }]}>{t('notes')}</Text>
              <Text style={[styles.label, { width: '12%' }]}>{t('slots')}</Text>
              <Text style={[styles.label, { width: '12%' }]}>{t('price')}</Text>
            </View>
            {updatedInventory.map((item, index) => (
              <View key={item.id} style={styles.row}>
                <TextInput
                  style={[styles.input, { width: '36%' }]}
                  value={item.name}
                  onChangeText={(value) => handleInventoryChange('name', value, item.id)}
                  placeholder={t('emptyField')}
                />
                <TextInput
                  style={[styles.input, { width: '36%' }]}
                  value={item.notes}
                  onChangeText={(value) => handleInventoryChange('notes', value, item.id)}
                  placeholder={t('emptyField')}
                />
                <TextInput
                  style={[styles.input, { width: '12%' }]}
                  value={item.slots.toString()}
                  onChangeText={(value) => handleInventoryChange('slots', value, item.id)}
                  keyboardType="numeric"
                  placeholder={t('emptyField')}
                />
                <TextInput
                  style={[styles.input, { width: '12%' }]}
                  value={item.price.toString()}
                  onChangeText={(value) => handleInventoryChange('price', value, item.id)}
                  keyboardType="numeric"
                  placeholder={t('emptyField')}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>
              {t('spellbook')}
            </Text>
            <View style={styles.row}>
              <Text style={[styles.label, { width: '36%' }]}>{t('name')}</Text>
              <Text style={[styles.label, { width: '62%' }]}>{t('notes')}</Text>
            </View>
            {updatedSpellbook.map((spell, index) => (
              <View key={spell.id} style={styles.row}>
                <TextInput
                  style={[styles.input, { width: '36%' }]}
                  value={spell.name}
                  onChangeText={(value) => handleSpellbookChange('name', value, spell.id)}
                  placeholder={t('emptyField')}
                />
                <TextInput
                  style={[styles.input, { width: '62%' }]}
                  value={spell.notes}
                  onChangeText={(value) => handleSpellbookChange('notes', value, spell.id)}
                  placeholder={t('emptyField')}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.saveResetDeleteButton, { backgroundColor: '#FFDE21' }]} onPress={validateAndSave}>
            <Ionicons name="save" size={20} color="black" />
            <Text style={styles.saveResetDeleteButtonText}>{t('save')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveResetDeleteButton, { backgroundColor: '#FFDE21' }]} onPress={resetCharacter}>
            <Ionicons name="return-up-back-outline" size={20} color="black" />
            <Text style={styles.saveResetDeleteButtonText}>{t('reset')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveResetDeleteButton, { backgroundColor: '#ddd' }]} onPress={deleteCharacter}>
            <Ionicons name="trash" size={20} color="black" />
            <Text style={[styles.saveResetDeleteButtonText, { color: 'black' }]}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  header: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
    borderColor: '#ddd',
    borderBottomWidth: 1
  },
  characterImage: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    justifyContent: 'space-between'
  },
  column: {
    width: '100%',
    paddingHorizontal:8,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ddd',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    width: '25%',
    fontSize: 12
  },
  input: {
    width: '65%',
    padding: 0,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    fontSize: 12
  },
  saveResetDeleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
    flexDirection: 'row', 
    justifyContent: 'space-evenly'
  },
  saveResetDeleteButtonText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold'
  }
  
});
