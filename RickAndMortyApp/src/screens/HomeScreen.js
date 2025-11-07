import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async (url = 'https://rickandmortyapi.com/api/character') => {
    try {
      setError(null);
      const response = await fetch(url);
      const data = await response.json();
      
      if (url.includes('page=')) {
        // Carregando mais personagens
        setCharacters(prev => [...prev, ...data.results]);
      } else {
        // Primeira carga
        setCharacters(data.results);
      }
      
      setNextPage(data.info.next);
    } catch (error) {
      console.error(error);
      setError('Erro ao carregar personagens');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreCharacters = () => {
    if (nextPage && !loadingMore) {
      setLoadingMore(true);
      loadCharacters(nextPage);
    }
  };

  const handleCharacterPress = (character) => {
    navigation.navigate('CharacterDetail', { 
      characterId: character.id 
    });
  };

  const renderCharacter = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleCharacterPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: getStatusColor(item.status) }
            ]} 
          />
          <Text style={styles.status}>{item.status} - {item.species}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#00ff00" />
        <Text style={styles.footerText}>Carregando mais personagens...</Text>
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'alive': return '#4CAF50';
      case 'dead': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Carregando personagens...</Text>
      </View>
    );
  }

  if (error && characters.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCharacters}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacter}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreCharacters}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum personagem encontrado</Text>
          </View>
        }
      />
      {error && characters.length > 0 && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a1a' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#1a1a1a' 
  },
  loadingText: { 
    color: '#fff', 
    fontSize: 18,
    marginTop: 10
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#2d2d2d', 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 30 
  },
  info: { 
    flex: 1,
    marginLeft: 15, 
    justifyContent: 'center' 
  },
  name: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: { 
    color: '#ccc', 
    fontSize: 14 
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#888',
    marginLeft: 10,
  },
  retryButton: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: '#ff4444',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorBannerText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomeScreen;