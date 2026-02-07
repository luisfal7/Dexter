---
name: Creador de Habilidades
description: Una habilidad para ayudar a crear nuevas habilidades en el sistema, asegurando la estructura y formato correctos.
---

# Creador de Habilidades

Esta habilidad te guiará en el proceso de creación de una nueva habilidad (skill) para el agente.

## Pasos

1.  **Solicitar Información Básica**:
    Si el usuario aún no lo ha proporcionado, solicita la siguiente información:
    *   **Nombre de la Habilidad**: Un nombre corto y descriptivo (usado para el nombre de la carpeta).
    *   **Título**: El nombre legible para humanos que irá en el frontmatter.
    *   **Descripción**: Una breve descripción de lo que hace la habilidad.
    *   **Instrucciones**: Las instrucciones detalladas que debe seguir el agente.

2.  **Determinar la Ruta**:
    *   La base para todas las habilidades es `.agent/skills/`.
    *   El nombre de la carpeta debe ser en minúsculas y usar guiones bajos en lugar de espacios (snake_case). Ejemplo: `mi_nueva_habilidad`.

3.  **Crear la Estructura**:
    *   Crea el directorio: `.agent/skills/<nombre_de_la_carpeta>`.

4.  **Crear el Archivo de Definición**:
    *   Crea el archivo `SKILL.md` dentro del nuevo directorio.
    *   El contenido debe seguir este formato YAML frontmatter + Markdown:

    ```markdown
    ---
    name: <Título>
    description: <Descripción>
    ---

    # <Título>

    <Instrucciones detalladas...>
    ```

5.  **Confirmación**:
    *   Informa al usuario que la habilidad ha sido creada exitosamente y dónde se encuentra.

## Ejemplo de Uso

Si el usuario dice: "Crea una habilidad para revisar errores de ortografía".

Tú deberías:
1.  Pensar un nombre de carpeta: `revisor_ortografia`.
2.  Crear `.agent/skills/revisor_ortografia/`.
3.  Crear `SKILL.md` con el contenido adecuado.
