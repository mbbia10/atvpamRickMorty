import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CharactersListScreen from '../screens/CharactersListScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="CharactersList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#00ff00',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: {
            backgroundColor: '#1a1a1a'
          }
        }}
      >
        <Stack.Screen 
          name="CharactersList" 
          component={CharactersListScreen}
          options={{ 
            title: 'Rick and Morty Characters',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="CharacterDetail" 
          component={CharacterDetailScreen}
          options={{ 
            title: 'Detalhes do Personagem',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;