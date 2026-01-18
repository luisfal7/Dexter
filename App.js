import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AppNavigator from './src/navigation/AppNavigator';
import { queryClient, asyncStoragePersister } from './src/api/queryClient';

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
