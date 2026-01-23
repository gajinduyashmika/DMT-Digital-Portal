require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('Testing Gemini API with multiple models...');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found in .env');
        return;
    }

    // List of models to try, based on available_models.txt
    const models = ["gemini-2.0-flash", "gemini-pro-latest", "gemini-2.5-flash", "gemini-2.5-pro"];

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });
            const chat = model.startChat({ history: [] });

            const result = await chat.sendMessage("Hello, are you online?");
            console.log(`[SUCCESS] ${modelName} responded:`, result.response.text());
            return; // Exit on first success
        } catch (error) {
            console.error(`[FAILED] ${modelName}:`, error.message || error);
        }
    }
    console.error('\nAll models failed.');
}

testGemini();
