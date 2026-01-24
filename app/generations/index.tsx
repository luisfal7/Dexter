import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../src/theme';

const generations = [
    { id: 1, name: 'Generation I', region: 'Kanto', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    { id: 2, name: 'Generation II', region: 'Johto', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png' },
    { id: 3, name: 'Generation III', region: 'Hoenn', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png' },
    { id: 4, name: 'Generation IV', region: 'Sinnoh', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png' },
    { id: 5, name: 'Generation V', region: 'Unova', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png' },
    { id: 6, name: 'Generation VI', region: 'Kalos', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png' },
    { id: 7, name: 'Generation VII', region: 'Alola', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png' },
    { id: 8, name: 'Generation VIII', region: 'Galar', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png' },
];

const GenerationsListRoute = () => {
    const router = useRouter();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: '/pokemon/list',
                params: { generation: item.id, title: item.name }
            })}
        >
            <View style={styles.cardContent}>
                <Text style={styles.genName}>{item.name}</Text>
                <Text style={styles.regionName}>{item.region}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.genImage} contentFit="contain" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Generations</Text>
            </View>
            <FlatList
                data={generations}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 10,
    },
    list: {
        padding: metrics.marginHorizontal,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden'
    },
    cardContent: {
        justifyContent: 'center',
    },
    genName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    regionName: {
        fontSize: 14,
        color: colors.grey,
        marginTop: 5,
    },
    genImage: {
        width: 100,
        height: 100,
        right: -10,
        bottom: -10,
    }
});

export default GenerationsListRoute;
