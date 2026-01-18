import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 15, // 15 minutes
            gcTime: 1000 * 60 * 60 * 72, // 72 hours (formerly cacheTime)
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export { queryClient, asyncStoragePersister };
