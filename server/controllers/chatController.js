const { extractEventIntent } = require("../utils/eventIntent");
const { searchEvents } = require("../utils/eventSearch");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const chatWithEventora = async (req, res) => {
    try {
        const {
            message,
            history = []
        } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // ==========================================
        // STEP 1: DETECT USER INTENT
        // ==========================================

        const intent = await extractEventIntent(
            message,
            history
        );

        console.log("Detected intent:", intent);

        let events = [];

        // ==========================================
        // STEP 2: NEW EVENT SEARCH
        // ==========================================

        if (intent.intent === "search_events") {
            events = await searchEvents(intent);
        }

        // ==========================================
        // STEP 3: EVENT DETAILS
        // ==========================================

        else if (intent.intent === "event_details") {

            // Find the latest assistant message
            // containing events.
            for (let i = history.length - 1; i >= 0; i--) {

                const previousMessage = history[i];

                if (
                    previousMessage.role === "assistant" &&
                    Array.isArray(previousMessage.events) &&
                    previousMessage.events.length > 0
                ) {
                    events = previousMessage.events;
                    break;
                }
            }

            console.log(
                "Previous events used for details:",
                events.length
            );
        }

        // ==========================================
        // STEP 4: FOLLOW-UP
        // ==========================================

        else if (intent.intent === "follow_up") {

            // For now, use the previous search results.
            // This can later be changed to perform
            // another MongoDB search.
            for (let i = history.length - 1; i >= 0; i--) {

                const previousMessage = history[i];

                if (
                    previousMessage.role === "assistant" &&
                    Array.isArray(previousMessage.events) &&
                    previousMessage.events.length > 0
                ) {
                    events = previousMessage.events;
                    break;
                }
            }
        }

        // ==========================================
        // STEP 5: GENERATE RESPONSE
        // ==========================================

        let prompt;

        if (events.length === 0) {

            prompt = `
You are Eventora AI.

User message:
"${message}"

No matching event information is available.

Tell the user politely that no matching event was found.

Do not invent an event.
Do not invent event information.
`;

        } else {

            prompt = `
You are Eventora AI, an intelligent event discovery assistant.

USER MESSAGE:
"${message}"

EVENTS AVAILABLE:
${JSON.stringify(events, null, 2)}

RULES:

1. Use ONLY the event information provided above.
2. Never invent event information.
3. Never invent price, date, location, category or seat count.
4. If this is a new search, show the matching events.
5. If there is only one matching event, focus on that event.
6. If there are multiple matching events, list them clearly.
7. If the user asks for details, give detailed information about the
   previously shown event.
8. For event details include:
   - Event name
   - Description
   - Date
   - Location
   - Category
   - Ticket price
   - Total seats
   - Available seats
9. Keep the response easy to read.
10. Use emojis where useful.

IMPORTANT:
Do NOT respond only with:
"I found X events."

Actually show the event information.
`;

        }

        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt
        });

        const botResponse = result.text;

        // ==========================================
        // STEP 6: RETURN RESPONSE
        // ==========================================

        return res.json({
            success: true,
            userMessage: message,
            response: botResponse,
            events: events
        });

    } catch (error) {

        console.error("Chat error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing your request."
        });
    }
};

module.exports = {
    chatWithEventora
};