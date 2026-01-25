import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pokemon } from '../types';

interface PokemonStore {
    favorites: Pokemon[];
    addFavorite: (pokemon: Pokemon) => void;
    removeFavorite: (pokemonId: number) => void;
    isFavorite: (pokemonId: number) => boolean;
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
