import { useEffect } from 'react';
import Constants from 'expo-constants';

// English: Custom hook to manage in-app updates
// Español: Hook personalizado para gestionar actualizaciones dentro de la aplicación
export const useInAppUpdate = () => {
    useEffect(() => {
        // English: In Expo Go, we cannot use native modules like sp-react-native-in-app-updates.
        // Español: En Expo Go, no podemos usar módulos nativos como sp-react-native-in-app-updates.
        if (Constants.appOwnership === 'expo') {
            return;
        }

        const checkForUpdates = async () => {
            try {
                // English: Dynamically import to avoid crash in Expo Go
                // Español: Importar dinámicamente para evitar caídas en Expo Go
                const SpInAppUpdates = require('sp-react-native-in-app-updates').default;
                const { IAUUpdateKind } = require('sp-react-native-in-app-updates');

                const inAppUpdates = new SpInAppUpdates(
                    false // isDebug
                );

                // English: Check if an update is required
                // Español: Verificar si se requiere una actualización
                const result = await inAppUpdates.checkNeedsUpdate();

                if (result.shouldUpdate) {
                    await inAppUpdates.startUpdate({
                        updateType: IAUUpdateKind ? IAUUpdateKind.IMMEDIATE : 1,
                    });
                }
            } catch {
                // English: Silently fail in dev/expo environments
                // Español: Fallar silenciosamente en entornos de desarrollo/expo
            }
        };

        checkForUpdates();
    }, []);
};
