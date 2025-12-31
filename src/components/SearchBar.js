import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity, Keyboard, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import metrics from '../theme/metrics';
import { colors } from '../theme/colors';
import { getAllPokemonNames } from '../services/api';

const SearchBar = ({ placeholder = "Search Pokemon name or ID", style }) => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [allPokemons, setAllPokemons] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const loadAllPokemons = async () => {
            try {
                const results = await getAllPokemonNames();
                setAllPokemons(results);
            } catch (error) {
                console.error("Failed to load global pokemon list", error);
            }
        };
        loadAllPokemons();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        if (!text) {
            setFilteredResults([]);
            setShowDropdown(false);
            return;
        }

        const lowerText = text.toLowerCase();

        // Filter logic: Name or ID
        const filtered = allPokemons.filter(p => {
            const urlParts = p.url.split('/');
            const id = urlParts[urlParts.length - 2];
            return p.name.toLowerCase().includes(lowerText) || id.includes(lowerText);
        }).map(p => {
            // Map to useful object
            const urlParts = p.url.split('/');
            const id = urlParts[urlParts.length - 2];
            return {
                name: p.name,
                url: p.url,
                id: parseInt(id),
                imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` // Small sprite for list
            };
        });

        setFilteredResults(filtered);
        setShowDropdown(true);
    };

    const handleSelect = (pokemon) => {
        setSearchText(''); // Clear search on select? or keep it? usually clear or keep name.
        setShowDropdown(false);
        Keyboard.dismiss();

        // Navigate to details
        // Note: Detail screen needs 'color', we default to primary if not known yet (Detail screen fetches it anyway)
        navigation.navigate('PokemonDetail', { pokemon: pokemon, color: colors.primary });
    };

    return (
        <View style={[styles.wrapper, style]}>
            <View style={styles.container}>
                <Ionicons name="search" size={20} color={colors.text} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.grey}
                    value={searchText}
                    onChangeText={handleSearch}
                    onFocus={() => searchText.length > 0 && setShowDropdown(true)}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => { setSearchText(''); setShowDropdown(false); }}>
                        <Ionicons name="close-circle" size={18} color={colors.grey} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Dropdown Overlay */}
            {showDropdown && filteredResults.length > 0 && (
                <View style={styles.dropdown}>
                    <ScrollView
                        style={styles.list}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
                    >
                        {/* Render ALL results. MaxHeight effectively limits view to ~6 items, user scrolls for more */}
                        {filteredResults.map((item) => (
                            <TouchableOpacity key={item.name} style={styles.item} onPress={() => handleSelect(item)}>
                                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                                <Text style={styles.itemText}>
                                    #{item.id.toString().padStart(3, '0')} {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 100, // Ensure it sits on top of other content
    },
    container: {
        height: 50,
        backgroundColor: colors.lightGrey,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: metrics.baseMargin,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
    },
    dropdown: {
        position: 'absolute',
        top: 55, // Below the input
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        maxHeight: 350, // Constrain height to avoid going off screen too much
        zIndex: 1000,
    },
    list: {
        flex: 1, // Fill the dropdown view
        width: '100%',
        borderRadius: 15,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
        color: colors.text,
        textTransform: 'capitalize'
    },
    showMoreButton: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row'
    },
    showMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textLight,
        marginRight: 5,
        opacity: 0.7
    }
});

export default SearchBar;
