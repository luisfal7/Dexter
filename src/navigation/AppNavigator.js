import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import TypeListScreen from '../screens/TypeListScreen';
import PokemonListScreen from '../screens/PokemonListScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import GenerationsListScreen from '../screens/GenerationsListScreen';
import NewsListScreen from '../screens/NewsListScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

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
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
