import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { usePokemonStore } from '../src/store/usePokemonStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api/queryClient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';
import { useInAppUpdate } from '../src/hooks/useInAppUpdate';

// English: Root Layout component that wraps the application
// Español: Componente de diseño raíz que envuelve la aplicación
export default function RootLayout() {
    // English: Trigger in-app update check
    // Español: Activar verificación de actualización en la aplicación
    useInAppUpdate();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
    );
}
