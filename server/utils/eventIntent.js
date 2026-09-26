const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const extractEventIntent = async (message, history = []) => {
    const prompt = `
You are the intent classifier for Eventora, an event discovery chatbot.

Current user message:
"${message}"

Previous conversation:
${JSON.stringify(history, null, 2)}

Classify the user's request into exactly one of these intents:

1. search_events
User wants to find/search/filter events.

Examples:
"Show me AI events"
"Show me AI events in Mumbai"
"events under 1500"
"show me technology events in Pune"

2. event_details
User wants details about an event that was already shown.

Examples:
"give it details"
"give me details"
"tell me more"
"what is the price?"
"where is it?"
"what is the date?"
"how many seats?"
"tell me about this event"

3. follow_up
User wants another event or wants to continue searching.

Examples:
"show me another one"
"give me more events"
"show another event"

4. general
General conversation.

Examples:
"hello"
"hi"
"thanks"

IMPORTANT:
- If the user refers to an event already shown in the conversation, use event_details.
- For event_details, do NOT create a new search.
- For follow_up, do not reuse the previous event as the only result.
- Return ONLY valid JSON.

Return exactly this structure:

{
  "intent": "search_events",
  "keyword": null,
  "location": null,
  "maxPrice": null,
  "minPrice": null,
  "freeOnly": false
}
`;

    try {
        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt
        });

        const text = result.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(text);

    } catch (error) {
        console.error("Intent extraction error:", error);

        return {
            intent: "general",
            keyword: null,
            location: null,
            maxPrice: null,
            minPrice: null,
            freeOnly: false
        };
    }
};

module.exports = {
    extractEventIntent
};