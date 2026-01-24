import { Stack } from 'expo-router';
import { usePokemonStore } from '../src/store/usePokemonStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api/queryClient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

// We need to wrap the root in the Providers that were in App.js
// But `expo-router` is the entry point now.
// The `_layout.js` acts as the root component.

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <StatusBar style="dark" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colors.background },
                    }}
                >
                    <Stack.Screen name="index" />
                </Stack>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
