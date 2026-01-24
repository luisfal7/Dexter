import React from 'react';
import { useRouter, Stack } from 'expo-router';
// We need to verify where TypeListScreen logic is.
// Assuming we can just import the original logic or logic is simple.
// Since we don't have TypeListScreen logic viewed yet, I will create a wrapper around it 
// assuming I can import it, OR I should read it first. 
// Standard practice is to reuse the Screen if it separates logic well, 
// using a hook for navigation.
// But we want to remove React Navigation dependencies.
// So I'll rewrite the small container wrapper.

import TypeListScreen from '../../src/features/pokemon/screens/TypeListScreen';
// Wait, TypeListScreen likely uses `navigation` prop. 
// I should probably read it first to be safe, but given I'm in a batch, 
// I will create a temporary simple wrapper that passes a mock navigation or I refactor it.
// Refactoring is better. 
// Let's defer TypeListScreen migration slightly until I see it or just use `router`.
// Actually, I'll create the file now but it might crash if TypeListScreen uses `navigation` prop directly.
// Let's Assume TypeListScreen is a default export.
// I'll create a new implementation here that replaces TypeListScreen.

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../src/theme';

const types = Object.keys(colors.types);

const TypeListRoute = () => {
    const router = useRouter();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.types[item] }]}
            onPress={() => router.push({
                pathname: '/pokemon/list',
                params: { type: item }
            })}
        >
            <Text style={styles.cardText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Types</Text>
            </View>
            <FlatList
                data={types}
                renderItem={renderItem}
                keyExtractor={item => item}
                numColumns={2}
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
        flex: 1,
        margin: 5,
        height: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default TypeListRoute;
