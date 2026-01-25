import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';
import { GENERATIONS } from '../constants/generations';
import GenerationCard from '../components/GenerationCard';

const GenerationsListScreen = () => {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof GENERATIONS[0] }) => (
        <GenerationCard
            name={item.name}
            region={item.region}
            starters={item.starters}
            onPress={() => router.push({
                pathname: '/pokemon/list',
                params: { generation: item.id, title: item.name }
            })}
        />
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
                data={GENERATIONS}
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
    backButton: {
        marginRight: 10,
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
});

export default GenerationsListScreen;
