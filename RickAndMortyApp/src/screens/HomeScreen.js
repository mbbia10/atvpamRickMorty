import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Keyboard
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  // Efeito para busca em tempo real
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Se a busca estiver vazia, recarrega a lista normal
      loadCharacters();
      return;
    }

    const delaySearch = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // Delay de 500ms para não sobrecarregar a API

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

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
        setCharacters(data.results || []);
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

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      setSearchLoading(true);
      setError(null);
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.error) {
        setCharacters([]);
        setError('Nenhum personagem encontrado');
      } else {
        setCharacters(data.results || []);
        setNextPage(data.info.next);
        setError(null);
      }
    } catch (error) {
      console.error(error);
      setCharacters([]);
      setError('Erro na busca');
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  };

  const loadMoreCharacters = () => {
    if (nextPage && !loadingMore && !searchQuery) {
      // Só carrega mais se não estiver em modo busca
      setLoadingMore(true);
      loadCharacters(nextPage);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setError(null);
    Keyboard.dismiss();
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
        <Text style={styles.origin}>Origem: {item.origin.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore && !searchLoading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#00ff00" />
        <Text style={styles.footerText}>
          {searchLoading ? 'Buscando...' : 'Carregando mais personagens...'}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Rick and Morty Explorer</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar personagem..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {searchQuery.length > 0 && (
        <Text style={styles.searchInfo}>
          Buscando por: "{searchQuery}"
        </Text>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'alive': return '#4CAF50';
      case 'dead': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  if (loading && !searchLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.loadingText}>Carregando personagens...</Text>
        </View>
      </SafeAreaView>
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
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading && !searchLoading && (
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {error || 'Nenhum personagem encontrado'}
              </Text>
              {error && (
                <TouchableOpacity style={styles.retryButton} onPress={() => loadCharacters()}>
                  <Text style={styles.retryText}>Recarregar</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        keyboardShouldPersistTaps="handled"
      />
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
    minHeight: 200,
  },
  header: {
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#666',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchInfo: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
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
    marginBottom: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#2d2d2d', 
    marginHorizontal: 15,
    marginBottom: 10, 
    padding: 12, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: { 
    width: 70, 
    height: 70, 
    borderRadius: 35 
  },
  info: { 
    flex: 1,
    marginLeft: 15, 
    justifyContent: 'center' 
  },
  name: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  origin: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
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
    marginTop: 10,
  },
  retryText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
});

export default HomeScreen;