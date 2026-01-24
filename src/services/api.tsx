import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const getPokemonList = async (limit: number = 20, offset: number = 0) => {
    try {
        const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pokemon list:', error);
        throw error;
    }
};

export const getAllPokemonNames = async () => {
    try {
        const response = await api.get('/pokemon?limit=10000');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching all pokemon names:', error);
        throw error;
    }
};


export const getPokemonDetails = async (url: string) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching pokemon details:', error);
        throw error;
    }
};

export const getPokemonSpecies = async (id: string | number) => {
    try {
        const response = await api.get(`/pokemon-species/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error;
    }
}

export const getTypes = async () => {
    try {
        const response = await api.get('/type');
        return response.data;
    } catch (error) {
        console.error('Error fetching types:', error);
        throw error;
    }
};

export const getPokemonsByType = async (type: string) => {
    try {
        const response = await api.get(`/type/${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pokemons by type:', error);
        throw error;
    }
}


export const getGenerations = async () => {
    try {
        const response = await api.get('/generation');
        return response.data;
    } catch (error) {
        console.error('Error fetching generations:', error);
        throw error;
    }
};

export const getGenerationDetails = async (nameOrId: string | number) => {
    try {
        // api.get will automatically prepend baseURL 'https://pokeapi.co/api/v2'
        const response = await api.get(`/generation/${nameOrId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching generation details:', error);
        throw error;
    }
};

export const getEvolutionChain = async (url: string) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        throw error;
    }
};

export const getTypeDetails = async (url: string) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching type details:', error);
        throw error;
    }
};

export default api;
