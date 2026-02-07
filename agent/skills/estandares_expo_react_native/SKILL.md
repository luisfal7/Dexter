---
name: Estándares Expo React Native
description: ESTA SKILL ES OBLIGATORIA. Úsala SIEMPRE que el usuario pida generar, modificar o revisar código.Guía de mejores prácticas, arquitectura y patrones de diseño para el desarrollo en Expo React Native.
---

# Estándares de Desarrollo Expo React Native

Esta habilidad define los estándares obligatorios que debes seguir al escribir código para este proyecto. Asegúrate de cumplir con cada uno de los siguientes puntos.

## 1. Arquitectura "Feature-First"
Organiza el código por **funcionalidad** (features) en lugar de por tipo de archivo.
*   **Estructura recomendada**: `src/features/<nombre-feature>/`
*   Dentro de cada feature, incluye sus propios componentes, hooks, y lógica.
*   Evita carpetas gigantes de `components` o `screens` en la raíz mezclando dominios.

## 2. Patrón "Container/Presentational"
Separa la lógica de negocio de la interfaz de usuario.
*   **Presentational Components**: Solo se encargan de renderizar la UI. Reciben datos y callbacks por props. No tienen lógica de negocio compleja ni llamadas a APIs.
*   **Container Components**: Manejan el estado, efectos y llamadas a APIs. Pasan los datos a los componentes de presentación.

## 3. Gestión del Estado: Divide y Vencerás
No pongas todo en un estado global.
*   **Estado Local**: Usa `useState` para estados efímeros de UI (modales, inputs).
*   **Server State**: Usa librerías como `TanStack Query` (si está disponible) para datos del servidor.
*   **Global State**: Usa Context API o Zustand solo para datos realmente globales (tema, autenticación).

## 4. Expo Router y Navegación
Usa **Expo Router** para la navegación basada en archivos.
*   Estructura tus rutas en la carpeta `app/`.
*   Usa `Stack` y `Tabs` de `expo-router` para layouts.
*   Mantén las rutas planas y usa nombres de archivo descriptivos.

## 5. Tipado Estricto con TypeScript
*   Genera código TypeScript en modo estricto.
*   Usa interfaces para Props y respuestas API.
*   Tipa explícitamente los hooks (`useState<User | null>`).
*   Utiliza Utility Types (`Pick`, `Omit`) para evitar duplicación.
*   Tipa los parámetros de Expo Router y evita `any` en eventos nativos.

## 6. Diseño de UI y Estilos (Scalable Styling)
*   Define un sistema de diseño (colores, espaciado, tipografía) y úsalo consistentemente.
*   Si usas `StyleSheet`, agrupa los estilos al final del archivo o en un archivo separado si es muy grande.
*   Si usas Tailwind/NativeWind, mantén las clases legibles y extrae componentes para repeticiones frecuentes.

## 7. Barrel Exports (Clean Imports)
Usa archivos `index.ts` para exportar la API pública de tus módulos/carpetas.
*   Esto permite imports más limpios: `import { Button } from '@/components'` en lugar de `import { Button } from '@/components/Button/Button'`.
*   Un feature debe exponer solo lo necesario al resto de la app.

## 8. Optimización de Imágenes y Assets
*   Usa el componente `<Image>` de `expo-image` para mejor rendimiento y caché.
*   Optimiza las imágenes antes de añadirlas al proyecto.
*   Usa SVGs para iconos e ilustraciones vectoriales.

## 9. Reglas Clean Code
*   **Nombres descriptivos**: Variables y funciones deben explicar qué hacen (`fetchUserData` vs `getData`).
*   **Funciones pequeñas**: Una función debe hacer una sola cosa.
*   **Evita números mágicos**: Usa constantes con nombres.
*   **Comentarios**: Comenta el "por qué", no el "qué" (el código ya dice el "qué").

## 10. SOLID Principles
*   **S - Single Responsibility (Responsabilidad Única)**: Un archivo o función debe tener una sola razón para cambiar.
*   **O - Open/Closed (Abierto/Cerrado)**: El código debe estar abierto para extenderse, pero cerrado para modificarse.
*   **L - Liskov Substitution**: Una clase hija debe poder usarse igual que su padre sin romper nada.
*   **I - Interface Segregation**: Es mejor tener muchas interfaces pequeñas y específicas (Readable, Writable) que una gigante (SuperUser).
*   **D - Dependency Inversion**: Depende de abstracciones, no de implementaciones concretas.

## 11. Patrón "Adapter"
*   **Propósito**: Aislar la UI de la estructura de datos externa (APIs).
*   **Regla**: Nunca usar datos crudos de la API directamente en componentes. Crea funciones "mappers" (`apiToUser(data)`) que transformen la respuesta (nesting, snake_case) a interfaces limpias y planas (camelCase).
*   **Beneficio**: Si la API cambia, solo cambias el mapper, no toda la UI.

## 12. Patrón "Facade"
*   **Propósito**: Ocultar la complejidad de librerías y gestión de estado.
*   **Regla**: Usa **Custom Hooks** como fachadas. Un componente no debe importar `axios` ni `useQuery` directamente. Debe usar `useGetPokemons()` que expone solo lo necesario (`data`, `isLoading`, `error`).
*   **Beneficio**: Desacoplamiento total. Puedes cambiar React Query por SWR sin tocar la vista.

## 13. Patrón "Singleton"
*   **Propósito**: Gestión centralizada de recursos compartidos.
*   **Regla**: Para clientes HTTP (Axios), Analytics, o Configuración, usa una única instancia exportada.
*   **Ejemplo**: Un archivo `api.ts` que exporta una instancia de axios configurada con `baseURL` headers y mddleware, en lugar de crear `axios.create()` en cada archivo.

## 14. Comentarios Bilingües
*   **Regla**: Todos los comentarios en el código deben estar escritos en **Inglés y Español**.
*   **Propósito**: Facilitar la comprensión del código para equipos internacionales o diversos.
*   **Formato**:
    ```typescript
    // English: This function calculates the total price
    // Español: Esta función calcula el precio total
    const calculateTotal = () => { ... }
    ```
