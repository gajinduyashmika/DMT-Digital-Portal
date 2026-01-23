const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.json({
                response: "I'm sorry, I haven't been configured with an API key yet. Please contact the administrator to set up my brain!"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Helper to run chat
        const runChat = async (modelName) => {
            const m = genAI.getGenerativeModel({ model: modelName });
            const c = m.startChat({
                history: history || [],
                generationConfig: { maxOutputTokens: 500 },
            });

            // Knowledge Base - DMT Portal Specifics
            const KNOWLEDGE_BASE = `
            [OFFICIAL FEES - 2026]
            - Car: 5,000 LKR
            - Motorcycle: 2,000 LKR
            - Three-Wheel: 2,500 LKR
            - Van: 4,500 LKR
            - Bus: 7,000 LKR
            - Lorry: 6,500 LKR
            - Tractor: 3,000 LKR
            - Heavy Vehicle: 9,000 LKR
            
            [VIP NUMBERS]
            - Letter Increment: 10,000 LKR per increment (e.g. CAA to CAC = 20,000)
            - Special Digits (e.g. 1111, 7777): 300,000 - 500,000 LKR
            - Palindromes (e.g. 1221): ~150,000 LKR
            
            [REQUIRED DOCUMENTS]
            1. Consular Invoice (for imports)
            2. Customs Declaration (CUSDEC)
            3. Insurance Certificate
            4. Identity Card (NIC) Copy
            
            [CONTACT]
            - Hotline: 1919
            - Email: info@dmt.gov.lk
            `;

            // Safely format context
            let contextString = "User is on the main dashboard.";
            if (req.body.context) {
                try {
                    // Create a safe copy of context to avoid circular refs and huge payloads
                    const safeContext = { ...req.body.context };

                    // Remove heavy fields if they exist in details
                    if (safeContext.details) {
                        const { documents, vehicleImage, ...safeDetails } = safeContext.details;
                        safeContext.details = safeDetails;
                    }

                    contextString = `User is currently viewing: ${JSON.stringify(safeContext)}`;
                } catch (e) {
                    console.error("Context serialization error:", e);
                    contextString = "User is viewing a specific application (details omitted due to error).";
                }
            }

            const systemInstruction = `You are the "DMT Digital Portal Support Assistant".
            
            [YOUR ROLE]
            - Assist with Vehicle Registration, Transfers, and Status Checks.
            - Provide accurate fees from the Knowledge Base below.
            - Be concise, professional, and friendly.
            - If uncertain, advise visiting the nearest DMT office.
            
            [KNOWLEDGE BASE]
            ${KNOWLEDGE_BASE}
            
            [CURRENT CONTEXT]
            ${contextString}
            `;

            let msgToSend = message;

            if ((!history || history.length === 0)) {
                // Prepend system instruction to the very first message
                msgToSend = `${systemInstruction}\n\nUser Question: ${message}`;
            }

            const result = await c.sendMessage(msgToSend);
            return result.response.text();
        };

        let text;
        try {
            // Try the standard Flash model first (best balance)
            text = await runChat("gemini-2.0-flash");
        } catch (e1) {
            console.error("Failed with gemini-2.0-flash:", e1.message);
            try {
                // Fallback to the 'Lite' preview model (fastest, likely high availability)
                console.log("Attempting fallback to gemini-2.0-flash-lite-preview-02-05");
                text = await runChat("gemini-2.0-flash-lite-preview-02-05");
            } catch (e2) {
                console.error("Failed with gemini-2.0-flash-lite-preview-02-05:", e2.message);
                // Last resort fallback to experimental or standard flash preview
                console.log("Attempting fallback to gemini-2.0-flash-exp");
                text = await runChat("gemini-2.0-flash-exp");
            }
        }

        res.json({ response: text });
    } catch (error) {
        console.error('AI Error:', error);

        let errorMessage = "I'm having trouble connecting to my brain right now.";

        // Handle Rate Limits (429) gracefully
        if (error.message.includes('429') || error.message.includes('quota') || error.status === 429) {
            errorMessage = "I'm receiving too many messages right now! As a free customized bot, I have a speed limit. Please wait about a minute and try again.";
            return res.status(429).json({ response: errorMessage });
        }

        // Handle other errors (cleanup raw JSON if present)
        if (error.message) {
            errorMessage = `System Error: ${error.message.replace(/\[.*?\]/g, '').substring(0, 100)}... (Check logs)`;
        }

        res.status(500).json({
            response: errorMessage
        });
    }
});

module.exports = router;
