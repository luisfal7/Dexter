import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Pokemon {
    id: string;
    name: string;
    [key: string]: any; // Allow other properties flexibility for now
}

interface PokemonStore {
    favorites: Pokemon[];
    addFavorite: (pokemon: Pokemon) => void;
    removeFavorite: (pokemonId: string) => void;
    isFavorite: (pokemonId: string) => boolean;
    toggleFavorite: (pokemon: Pokemon) => void;
}

export const usePokemonStore = create<PokemonStore>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (pokemon) => set((state) => ({
                favorites: [...state.favorites, pokemon]
            })),
            removeFavorite: (pokemonId) => set((state) => ({
                favorites: state.favorites.filter((p) => p.id !== pokemonId)
            })),
            isFavorite: (pokemonId) => {
                return get().favorites.some((p) => p.id === pokemonId);
            },
            toggleFavorite: (pokemon) => {
                const { isFavorite, addFavorite, removeFavorite } = get();
                if (isFavorite(pokemon.id)) {
                    removeFavorite(pokemon.id);
                } else {
                    addFavorite(pokemon);
                }
            }
        }),
        {
            name: 'pokemon-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
