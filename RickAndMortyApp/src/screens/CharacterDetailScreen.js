import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { getCharacterById } from '../service/api';

const CharacterDetailScreen = ({ route }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCharacterDetails();
  }, [characterId]);

  const loadCharacterDetails = async () => {
    try {
      setLoading(true);
      const characterData = await getCharacterById(characterId);
      setCharacter(characterData);
    } catch (err) {
      setError('Erro ao carregar detalhes do personagem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'alive':
        return '#4CAF50';
      case 'dead':
        return '#f44336';
      default:
        return '#9E9E9E';
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return '♂';
      case 'female':
        return '♀';
      case 'genderless':
        return '⚧';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error || !character) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Personagem não encontrado'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagem do Personagem */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: character.image }} style={styles.characterImage} />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(character.status) }]}>
            <Text style={styles.statusText}>{character.status}</Text>
          </View>
        </View>

        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.characterName}>{character.name}</Text>
          <View style={styles.basicInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Espécie</Text>
              <Text style={styles.infoValue}>{character.species}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gênero</Text>
              <View style={styles.genderContainer}>
                <Text style={styles.genderIcon}>{getGenderIcon(character.gender)}</Text>
                <Text style={styles.infoValue}>{character.gender}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Localização de Origem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Origem</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>
              {character.origin.name === 'unknown' ? 'Desconhecida' : character.origin.name}
            </Text>
            <Text style={styles.locationType}>
              {character.origin.name === 'unknown' ? 'Local de origem não identificado' : 'Planeta de origem'}
            </Text>
          </View>
        </View>

        {/* Localização Atual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização Atual</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>
              {character.location.name === 'unknown' ? 'Desconhecida' : character.location.name}
            </Text>
            <Text style={styles.locationType}>
              {character.location.name === 'unknown' ? 'Localização atual não identificada' : 'Localização atual do personagem'}
            </Text>
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <View style={styles.additionalInfo}>
            <View style={styles.additionalItem}>
              <Text style={styles.additionalLabel}>Episódios</Text>
              <Text style={styles.additionalValue}>{character.episode?.length || 0}</Text>
            </View>
            <View style={styles.additionalItem}>
              <Text style={styles.additionalLabel}>Tipo</Text>
              <Text style={styles.additionalValue}>
                {character.type || 'Comum'}
              </Text>
            </View>
          </View>
        </View>

        {/* ID do Personagem */}
        <View style={styles.idContainer}>
          <Text style={styles.idText}>ID: #{character.id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    paddingBottom: 20,
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
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#00ff00',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    backgroundColor: '#2d2d2d',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff00',
  },
  characterName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderIcon: {
    color: '#00ff00',
    fontSize: 16,
    marginRight: 4,
  },
  sectionTitle: {
    color: '#00ff00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: '#3d3d3d',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  locationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationType: {
    color: '#888',
    fontSize: 12,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  additionalItem: {
    alignItems: 'center',
  },
  additionalLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  additionalValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  idContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  idText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default CharacterDetailScreen;