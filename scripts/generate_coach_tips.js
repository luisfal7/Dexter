require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
    process.exit(1);
});

// Configuration
const API_KEY = process.env.GEMINI_API_KEY;
const OUTPUT_FILE = path.join(__dirname, '../src/features/pokemon/data/coach_tips.ts');
const REQUESTS_PER_MINUTE = 15;
const REQUEST_DELAY_MS = Math.ceil(60000 / REQUESTS_PER_MINUTE); // 4000ms
const MODEL_NAME = "gemini-2.5-flash";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllPokemon() {
    try {
        console.log("Fetching full Pokemon list from PokeAPI...");
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await response.json();
        return data.results.map(p => p.name);
    } catch (error) {
        console.error("Error fetching Pokemon list:", error);
        return [];
    }
}

async function generateAllTips() {
    if (!API_KEY) {
        console.error("Error: GEMINI_API_KEY is missing.");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Load existing tips
    let tips = {};
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            const content = fs.readFileSync(OUTPUT_FILE, 'utf8');
            // Extract content between curly braces
            const match = content.match(/export const coachTips: Record<string, string> = {([\s\S]*?)};/);
            if (match && match[1]) {
                const innerContent = match[1];
                // Regex to capture key and value (handling escaped backticks)
                // Matches "key": `value` where value does NOT end with a backslash
                const entryRegex = /"([^"]+)": `([\s\S]*?[^\\])`/g;
                let entryMatch;
                while ((entryMatch = entryRegex.exec(innerContent)) !== null) {
                    tips[entryMatch[1]] = entryMatch[2].replace(/\\`/g, '`'); // Unescape backticks
                }
            }
            console.log(`Loaded ${Object.keys(tips).length} existing tips.`);
        } catch (error) {
            console.error("Error parsing existing tips file:", error);
        }
    }

    // Get full list
    const pokemonList = await fetchAllPokemon();
    if (pokemonList.length === 0) return;

    console.log(`Starting generation for ${pokemonList.length} Pokemon using ${MODEL_NAME}...`);

    let requestsMade = 0;
    // START_INDEX removed - iterating all and trusting the skip logic
    // const START_INDEX = 13; 

    for (const [index, pokemon] of pokemonList.entries()) {
        const progressStr = `[Progress: ${index + 1}/${pokemonList.length}]`;

        // CHECK: If tip already exists, skip it entirely
        if (tips[pokemon] && tips[pokemon].trim().length > 0) {
            // console.log(`${progressStr} ✅ Tip for ${pokemon} already exists. Skipping.`);
            continue;
        }

        const prompt = `
Act as a World Champion Pokémon Coach (VGC and Competitive Singles format).
Analyze ${pokemon} and generate a high-level "Coach Report".
The response MUST have strictly 3 paragraphs.

Mandatory Structure:
1.  **Viability Analysis:** Describe its greatest strengths (Key Stats, Typing, Ability) and fatal weaknesses (4x Weaknesses, low stats, weather dependence). Be raw and realistic about its tier.
2.  **The Winning Strategy:** Explain HOW to build it. Mention the mandatory Item, Key Ability, and ideal Move Set. Is it a Physical Sweeper? Special Wall? Pivot?
3.  **Game Plan:** Explain WHEN to bring it onto the field. Is it a Lead or a Cleaner? Which teammates does it synergize with, and which threats must it flee from immediately?

Style Rules:
- Do not use greetings or farewells. Get straight to the point.
- Use competitive terminology (STAB, Bulk, Sweeper, Check, Counter) but briefly explained.
- Tone: Serious, strategic, and technical.
`;

        let success = false;
        let retries = 3;

        while (!success && retries > 0) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().trim();

                tips[pokemon] = text;

                // Save immediately in TS format
                let tsContent = 'export const coachTips: Record<string, string> = {\n';
                // iterate tips
                for (const [k, v] of Object.entries(tips)) {
                    // Escape backticks in value
                    tsContent += `  "${k}": \`${v.replace(/`/g, '\\`')}\`,\n`;
                }
                tsContent += '};\n';

                fs.writeFileSync(OUTPUT_FILE, tsContent);

                console.log(`${progressStr} ✅ Estrategia guardada para ${pokemon.charAt(0).toUpperCase() + pokemon.slice(1)}.`);
                success = true;
                requestsMade++;

            } catch (error) {
                console.error(`${progressStr} ❌ Error generating for ${pokemon}: ${error.message}. Retries left: ${retries - 1}`);
                retries--;
                if (retries > 0) await sleep(5000 + Math.random() * 2000); // Backoff
            }
        }

        if (!success) {
            console.error(`${progressStr} ❌ Failed to generate for ${pokemon} after retries.`);
        }

        // Rate limit delay
        await sleep(REQUEST_DELAY_MS);
    }

    console.log("Generation process completed.");
}

generateAllTips();
