import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const CharacterDetailScreen = ({ route }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacter();
  }, [characterId]);

  const loadCharacter = async () => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
      const data = await response.json();
      setCharacter(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Personagem não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <Text style={styles.name}>{character.name}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{character.status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Espécie:</Text>
          <Text style={styles.value}>{character.species}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gênero:</Text>
          <Text style={styles.value}>{character.gender}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Localização</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Origem:</Text>
          <Text style={styles.value}>{character.origin.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Atual:</Text>
          <Text style={styles.value}>{character.location.name}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#00ff00',
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#2d2d2d',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    color: '#00ff00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    color: '#888',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CharacterDetailScreen;