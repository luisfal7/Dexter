import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';
import { getPokemonDetails, getPokemonSpecies } from '../services/api';

const { width } = Dimensions.get('window');

const PokemonDetailContent = ({ pokemon, color, onBackPressed }) => {
    const [details, setDetails] = useState(null);
    const [species, setSpecies] = useState(null);
    const [activeTab, setActiveTab] = useState('About');
    const [backgroundColor, setBackgroundColor] = useState(color);
    const [isShiny, setIsShiny] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // FORCE fetching the pokemon endpoint for stats/moves using ID if possible
                // This fixes the issue where generation list passed a species URL
                let detailUrl = pokemon.url;

                if (pokemon.id) {
                    detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
                } else if (pokemon.url.includes('pokemon-species')) {
                    // If we only have URL and it's species, try to guess or fail. 
                    // But we should usually have ID from the list screens.
                    const parts = pokemon.url.split('/');
                    const id = parts[parts.length - 2];
                    detailUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
                }

                const detailData = await getPokemonDetails(detailUrl);
                setDetails(detailData);

                // Update background color based on type
                if (detailData.types && detailData.types.length > 0) {
                    const type = detailData.types[0].type.name;
                    const typeColor = colors.types[type];
                    if (typeColor) {
                        setBackgroundColor(typeColor);
                    }
                }

                const speciesData = await getPokemonSpecies(pokemon.id || detailData.id);
                setSpecies(speciesData);
            } catch (e) {
                console.error("Error fetching detail data:", e);
            }
        };
        fetchData();
    }, [pokemon]);

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${pokemon.id}.png`;
    const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;

    const renderTabContent = () => {
        if (!details || !species) return null;

        const flavor = species.flavor_text_entries.find(entry => entry.language.name === 'en');
        const description = flavor ? flavor.flavor_text.replace(/\n|\f/g, ' ') : '';

        switch (activeTab) {
            case 'About':
                return (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.description}>{description}</Text>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Height</Text>
                                <Text style={styles.statValue}>{details.height / 10} m</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Weight</Text>
                                <Text style={styles.statValue}>{details.weight / 10} kg</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Strong against</Text>
                        <View style={styles.typeRow}>
                            <View style={[styles.typePill, { backgroundColor: colors.types.poison, marginRight: 10 }]}>
                                <Ionicons name="skull" size={16} color="white" />
                            </View>
                            <View style={[styles.typePill, { backgroundColor: colors.types.water }]}>
                                <Ionicons name="water" size={16} color="white" />
                            </View>
                        </View>
                    </ScrollView>
                );
            case 'Status':
                return (
                    <View>
                        {details.stats?.map(stat => (
                            <View key={stat.stat.name} style={styles.statBarRow}>
                                <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
                                <Text style={styles.statNum}>{stat.base_stat}</Text>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${(stat.base_stat / 255) * 100}%`, backgroundColor: backgroundColor }]} />
                                </View>
                            </View>
                        ))}
                    </View>
                );
            case 'Moves':
                return (
                    <ScrollView>
                        {details.moves?.slice(0, 10).map(move => (
                            <Text key={move.move.name} style={styles.moveText}>{move.move.name.replace('-', ' ')}</Text>
                        ))}
                    </ScrollView>
                )
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            {/* Header */}
            <SafeAreaView style={styles.header}>
                <View style={styles.topNav}>
                    <TouchableOpacity onPress={onBackPressed}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    {/*<Ionicons name="heart-outline" size={28} color="white" />*/}
                </View>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                        <View style={styles.badges}>
                            {details && details.types?.map(t => (
                                <View key={t.type.name} style={styles.badge}>
                                    <Text style={styles.badgeText}>{t.type.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Text style={styles.idText}>{formattedId}</Text>
                </View>
                <View style={styles.pokeballDecoration} />
            </SafeAreaView>

            {/* Shiny Toggle Button */}
            <TouchableOpacity
                style={styles.shinyButton}
                onPress={() => setIsShiny(!isShiny)}
                activeOpacity={0.7}
            >
                <Ionicons name={isShiny ? "sunny" : "sunny-outline"} size={20} color={isShiny ? "#FFD700" : "white"} />
            </TouchableOpacity>

            {/* Floating Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.tabContainer}>
                    {['About', 'Status', 'Moves'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            {activeTab === tab && <View style={styles.activeLine} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.contentArea}>
                    {renderTabContent()}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: metrics.marginHorizontal,
        zIndex: 1,
    },
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    badges: {
        flexDirection: 'row',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginRight: 5,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    idText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    pokeballDecoration: {
        position: 'absolute',
        top: 150,
        right: -20,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: -1,
    },
    imageContainer: {
        position: 'absolute',
        top: 130,
        alignSelf: 'center',
        zIndex: 2,
    },
    image: {
        width: 250,
        height: 250,
    },
    shinyButton: {
        position: 'absolute',
        top: 300,
        right: metrics.marginHorizontal,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 200,
        paddingTop: 50,
        paddingHorizontal: metrics.marginHorizontal,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 10,
    },
    tab: {
        paddingBottom: 10,
        alignItems: 'center',
    },
    tabText: {
        color: colors.grey,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: colors.text,
    },
    activeLine: {
        height: 2,
        backgroundColor: colors.primary,
        width: '100%',
        marginTop: 5,
    },
    contentArea: {
        flex: 1,
    },
    description: {
        lineHeight: 22,
        color: colors.text,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
        justifyContent: 'space-around'
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: colors.grey,
        marginBottom: 5,
        fontSize: 12,
    },
    statValue: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    typeRow: {
        flexDirection: 'row',
    },
    typePill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    statName: {
        width: 50,
        color: colors.grey,
        fontSize: 12,
        fontWeight: 'bold',
    },
    statNum: {
        width: 40,
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'right',
        marginRight: 10,
    },
    progressBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: colors.lightGrey,
        borderRadius: 2,
    },
    progressBarFill: {
        height: 4,
        borderRadius: 2,
    },
    moveText: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        paddingBottom: 5,
    }
});

export default PokemonDetailContent;
