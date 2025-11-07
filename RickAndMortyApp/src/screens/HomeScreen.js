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

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      const data = await response.json();
      setCharacters(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
        <Text style={styles.status}>{item.status} - {item.species}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Carregando personagens...</Text>
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
    backgroundColor: '#1a1a1a' 
  },
  loadingText: { 
    color: '#fff', 
    fontSize: 18,
    marginTop: 10
  },
  listContent: {
    padding: 10,
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#2d2d2d', 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 10 
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 30 
  },
  info: { 
    marginLeft: 15, 
    justifyContent: 'center' 
  },
  name: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  status: { 
    color: '#ccc', 
    fontSize: 14 
  }
});

export default HomeScreen;