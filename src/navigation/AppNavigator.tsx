import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../features/home/screens/HomeScreen';
import TypeListScreen from '../features/pokemon/screens/TypeListScreen';
import PokemonListScreen from '../features/pokemon/screens/PokemonListScreen';
import PokemonDetailScreen from '../features/pokemon/screens/PokemonDetailScreen';
import GenerationsListScreen from '../features/pokemon/screens/GenerationsListScreen';
import NewsListScreen from '../features/news/screens/NewsListScreen';
import PrivacyPolicyScreen from '../features/shared/screens/PrivacyPolicyScreen';
import FavoritesScreen from '../features/pokemon/screens/FavoritesScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
    Home: undefined;
    TypeList: undefined;
    PokemonList: { type?: string; generation?: string; title?: string };
    PokemonDetail: { pokemon: any; color: string };
    GenerationsList: undefined;
    NewsList: undefined;
    Favorites: undefined;
    PrivacyPolicy: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: colors.background },
                    // Add transition specs if needed for that smooth feel
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="TypeList" component={TypeListScreen} />
                <Stack.Screen name="PokemonList" component={PokemonListScreen} />
                <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
                <Stack.Screen name="GenerationsList" component={GenerationsListScreen} />
                <Stack.Screen name="NewsList" component={NewsListScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
