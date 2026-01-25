import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity, Keyboard, Image, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, metrics } from '../theme';
import { getAllPokemonNames } from '../services';

interface SearchBarProps {
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
}

interface SearchResult {
    name: string;
    url: string;
    id: number;
    imageUrl: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search Pokemon name or ID", style }) => {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [allPokemons, setAllPokemons] = useState<any[]>([]); // English: API returns raw objects initially | Español: La API retorna objetos crudos inicialmente
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
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

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (!text) {
            setFilteredResults([]);
            setShowDropdown(false);
            return;
        }

        const lowerText = text.toLowerCase();

        // English: Filter logic: Name or ID
        // Español: Lógica de filtrado: Nombre o ID
        const filtered = allPokemons.filter((p: any) => {
            const urlParts = p.url.split('/');
            const id = urlParts[urlParts.length - 2];
            return p.name.toLowerCase().includes(lowerText) || id.includes(lowerText);
        }).map((p: any) => {
            // English: Map to useful object
            // Español: Mapear a objeto útil
            const urlParts = p.url.split('/');
            const id = urlParts[urlParts.length - 2];
            return {
                name: p.name,
                url: p.url,
                id: parseInt(id),
                imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` // English: Small sprite for list | Español: Sprite pequeño para lista
            };
        });

        setFilteredResults(filtered);
        setShowDropdown(true);
    };

    const handleSelect = (pokemon: SearchResult) => {
        setSearchText('');
        setShowDropdown(false);
        Keyboard.dismiss();

        // English: Navigate to details
        // Español: Navegar a detalles
        router.push({
            pathname: `/pokemon/${pokemon.id}`,
            params: {
                name: pokemon.name,
                url: pokemon.url,
                color: colors.primary
            }
        });
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

            {/* English: Dropdown Overlay | Español: Superposición desplegable */}
            {showDropdown && filteredResults.length > 0 && (
                <View style={styles.dropdown}>
                    <ScrollView
                        style={styles.list}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
                    >
                        {/* English: Render ALL results. MaxHeight effectively limits view to ~6 items, user scrolls for more */}
                        {/* Español: Renderizar TODOS los resultados. MaxHeight limita efectivamente la vista a ~6 elementos, el usuario se desplaza para ver más */}
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
        zIndex: 100, // English: Ensure it sits on top of other content | Español: Asegurar que se sitúe sobre otro contenido
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
