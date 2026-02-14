import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { useRef } from 'react';
import { colors, metrics } from '../../../../theme';
import PokemonHeader from './PokemonHeader';
import PokemonAbout from './PokemonAbout';
import PokemonStats from './PokemonStats';
import PokemonMoves from './PokemonMoves';
import PokemonEvolution from './PokemonEvolution';
import PokemonTypeMatchups from './PokemonTypeMatchups';
import PokemonCoach from './PokemonCoach';
import { coachTips } from '../../data/coach_tips';

import { Pokemon, PokemonDetails, PokemonSpecies } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100; // Cap scrolling up
const MIN_TRANSLATE_Y = 0; // Cap scrolling down (initial position)

// English: Props for the PokemonDetailView component
// Español: Props para el componente PokemonDetailView
interface PokemonDetailViewProps {
    pokemon: Pokemon;
    details: PokemonDetails | undefined;
    species: PokemonSpecies | undefined;
    onBackPressed: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

// English: Presentational component for Pokemon details with animated bottom sheet
// Español: Componente de presentación para detalles de Pokémon con hoja inferior animada
// English: Presentational component for Pokemon details with animated bottom sheet (Scroll-to-Expand)
// Español: Componente de presentación para detalles de Pokémon con hoja inferior animada (Desplazamiento para expandir)
const PokemonDetailView: React.FC<PokemonDetailViewProps> = ({
    pokemon,
    details,
    species,
    onBackPressed,
    isFavorite,
    onToggleFavorite
}) => {
    const [activeTab, setActiveTab] = useState('About');
    const [backgroundColor, setBackgroundColor] = useState(colors.primary);
    const [isShiny, setIsShiny] = useState(false);

    // English: Constants for Scroll Dimensions
    // Español: Constantes para dimensiones de desplazamiento
    const FULL_HEADER_HEIGHT = SCREEN_HEIGHT * 0.85; // Allow almost full reveal
    const DEFAULT_VISIBLE_HEADER = SCREEN_HEIGHT * 0.55;
    const COLLAPSED_VISIBLE_HEADER = SCREEN_HEIGHT * 0.10;

    const INITIAL_SCROLL_OFFSET = FULL_HEADER_HEIGHT - DEFAULT_VISIBLE_HEADER;
    const MAX_SCROLL_OFFSET = FULL_HEADER_HEIGHT - COLLAPSED_VISIBLE_HEADER;

    // Use FULL_HEADER_HEIGHT for the ghost spacer
    const INITIAL_SPACER_HEIGHT = FULL_HEADER_HEIGHT;

    // English: Reference for initial scroll position
    const scrollRef = useRef<Animated.ScrollView>(null);
    const [isReady, setIsReady] = useState(false);

    // English: Scroll to default position on mount
    useEffect(() => {
        if (isReady && scrollRef.current) {
            scrollRef.current.scrollTo({ y: INITIAL_SCROLL_OFFSET, animated: false });
        }
    }, [isReady]);

    // English: Update background color based on type when details load
    // Español: Actualizar el color de fondo según el tipo cuando se cargan los detalles
    useEffect(() => {
        if (details && details.types && details.types.length > 0) {
            const type = details.types[0].type.name;
            const typeColor = colors.types[type as keyof typeof colors.types];
            if (typeColor) {
                setBackgroundColor(typeColor);
            }
        }
    }, [details]);

    // English: Tab switching logic
    // Español: Lógica de cambio de pestañas
    const tabs = ['About', 'Stats', 'Moves', 'Coach'];

    const handleTabChange = (direction: 'next' | 'prev') => {
        const currentIndex = tabs.indexOf(activeTab);
        let newIndex = currentIndex;

        if (direction === 'next') {
            newIndex = Math.min(currentIndex + 1, tabs.length - 1);
        } else {
            newIndex = Math.max(currentIndex - 1, 0);
        }

        if (newIndex !== currentIndex) {
            runOnJS(setActiveTab)(tabs[newIndex]);
        }
    };

    // English: Horizontal swipe gestures
    // Español: Gestos de deslizamiento horizontal
    const panGesture = Gesture.Pan()
        .activeOffsetX([-20, 20]) // Only activate on horizontal movement > 20px
        .failOffsetY([-20, 20])   // Fail if vertical movement > 20px
        .onEnd((e) => {
            if (e.translationX < -50) {
                // Swipe Left -> Next Tab
                runOnJS(handleTabChange)('next');
            } else if (e.translationX > 50) {
                // Swipe Right -> Prev Tab
                runOnJS(handleTabChange)('prev');
            }
        });

    // English: Scroll Handler for Parallax Header
    // Español: Manejador de desplazamiento para el encabezado de paralaje
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: scrollY.value } // Keep header fixed relative to screen by negating scroll
            ],
            // English: Ensure header is behind sheet content but interactive
            // Español: Asegurar que el encabezado esté detrás del contenido de la hoja pero interactivo
            // zIndex: 0, 
        };
    });

    const imageStyle = useAnimatedStyle(() => {
        // Range:
        // 0 to INITIAL_SCROLL_OFFSET (0 -> Default): Zoom out from 1.5 to 1
        // INITIAL_SCROLL_OFFSET -> MAX: No zoom

        const scale = interpolate(
            scrollY.value,
            [0, INITIAL_SCROLL_OFFSET],
            [1.5, 1], // Scale 1.5 at very bottom (scroll 0), 1 at default
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            [0, INITIAL_SCROLL_OFFSET],
            [50, 0], // Move down slightly when expanded to center better
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { scale },
                { translateY }
            ]
        };
    });

    // English: Gesture handler for the bottom sheet
    // Español: Manejador de gestos para la hoja inferior
    // const gesture = Gesture.Pan()
    //     .onStart(() => {
    //         context.value = { y: translateY.value };
    //     })
    //     .onUpdate((event) => {
    //         translateY.value = event.translationY + context.value.y;
    //         // Limit movement
    //         // English: Allow dragging up to cover header
    //         // Español: Permitir arrastrar hacia arriba para cubrir el encabezado
    //         translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y); // Upper limit (near top of screen)
    //         translateY.value = Math.min(translateY.value, 0); // Lower limit (initial position)
    //     })
    //     .onEnd(() => {
    //         // English: Snap to positions based on drag position
    //         // Español: Ajustar a posiciones basadas en la posición de arrastre
    //         if (translateY.value < -SCREEN_HEIGHT * 0.2) {
    //             // Snap to top (expanded state)
    //             translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
    //         } else {
    //             // Snap to bottom (default/collapsed state)
    //             translateY.value = withSpring(0, { damping: 50 });
    //         }
    //     });

    // const rBottomSheetStyle = useAnimatedStyle(() => {
    //     return {
    //         transform: [{ translateY: translateY.value }],
    //     };
    // });

    const renderTabContent = () => {
        if (!details || !species) return null;

        const flavor = species.flavor_text_entries.find((entry) => entry.language.name === 'en');
        const description = flavor ? flavor.flavor_text.replace(/\n|\f/g, ' ') : '';

        let content;
        switch (activeTab) {
            case 'About':
                content = (
                    <View style={styles.scrollContent}>
                        <PokemonAbout
                            description={description}
                            height={details.height}
                            weight={details.weight}
                        />
                        <PokemonEvolution
                            evolutionUrl={species.evolution_chain?.url}
                            isShiny={isShiny}
                            currentPokemonId={details.id}
                        />
                        <PokemonTypeMatchups types={details.types} />
                    </View>
                );
                break;
            case 'Stats':
                content = (
                    <PokemonStats
                        stats={details.stats}
                        color={backgroundColor}
                    />
                );
                break;
            case 'Moves':
                content = (
                    <PokemonMoves
                        moves={details.moves}
                    />
                );
                break;
            case 'Coach':
                const tipKey = pokemon.name.toLowerCase();
                const tip = (coachTips as Record<string, string>)[tipKey];
                content = (
                    <PokemonCoach
                        tip={tip}
                    />
                );
                break;
            default:
                content = null;
        }

        return (
            <GestureDetector gesture={panGesture}>
                <View style={{ flex: 1, minHeight: 400 }}>
                    {/* MinHeight ensures gesture area exists even if content is small */}
                    {content}
                </View>
            </GestureDetector>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            {/* Visual Header (Fixed Background - No Jitter) */}
            <View style={styles.headerContainer}>
                <PokemonHeader
                    pokemon={pokemon}
                    details={details}
                    backgroundColor={backgroundColor}
                    isShiny={isShiny}
                    setIsShiny={setIsShiny}
                    onBackPressed={onBackPressed}
                    isFavorite={isFavorite}
                    onToggleFavorite={onToggleFavorite}
                    imageStyle={imageStyle}
                />
            </View>

            {/* Scroll-to-Expand Implementation */}
            {/* English: Animated ScrollView that covers the screen. */}
            {/* Español: ScrollView animado que cubre la pantalla. */}
            <Animated.ScrollView
                ref={scrollRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                snapToOffsets={[0, INITIAL_SCROLL_OFFSET, MAX_SCROLL_OFFSET]}
                decelerationRate="fast"
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                onLayout={() => setIsReady(true)}
            >
                {/* Interactable Ghost Header (Parallaxed - Invisible) */}
                {/* English: Keeps touch targets aligned with background header while scrolling handles gestures */}
                {/* Español: Mantiene los objetivos táctiles alineados con el encabezado de fondo mientras el desplazamiento maneja los gestos */}
                <Animated.View style={[{ height: INITIAL_SPACER_HEIGHT, width: '100%', opacity: 0 }, headerStyle]}>
                    <PokemonHeader
                        pokemon={pokemon}
                        details={details}
                        backgroundColor={backgroundColor}
                        isShiny={isShiny}
                        setIsShiny={setIsShiny}
                        onBackPressed={onBackPressed}
                        isFavorite={isFavorite}
                        onToggleFavorite={onToggleFavorite}
                    />
                </Animated.View>

                {/* The Actual Bottom Sheet Content */}
                <View style={styles.sheetContent}>
                    {/* Handle indicator */}
                    <View style={styles.handleIndicator} />

                    <View style={styles.tabContainer}>
                        {['About', 'Stats', 'Moves', 'Coach'].map(tab => (
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
                        {/* Extra padding at bottom to prevent cutoff */}
                        <View style={{ height: 100 }} />
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
};

// English: Styles for the component
// Español: Estilos para el componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%', // Fill screen to show header components
        zIndex: 0,
    },
    scrollView: {
        flex: 1,
        zIndex: 100, // Above header
    },
    scrollContentContainer: {
        flexGrow: 1,
    },
    sheetContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: SCREEN_HEIGHT, // Ensure it fills screen when scrolled up
        paddingHorizontal: metrics.marginHorizontal,
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    handleIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 15, // Increased touch area visual
    },
    dragArea: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // Make this area large enough to drag easily
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 5,
    },
    tab: {
        paddingBottom: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 0,
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
    scrollContent: {
        paddingBottom: 20,
    }
});

export default PokemonDetailView;
