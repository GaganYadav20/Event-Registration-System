const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateChatResponse = async (message, events) => {

    const eventContext = events.map((event) => ({
        id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        category: event.category,
        availableSeats: event.availableSeats,
        totalSeats: event.totalSeats,
        ticketPrice: event.ticketPrice
    }));

    const prompt = `
You are Eventora AI, an intelligent event discovery assistant.

Your job is to help users discover and understand events available on Eventora.

USER QUESTION:
${message}

AVAILABLE EVENTS:
${JSON.stringify(eventContext, null, 2)}

RULES:
1. Only use information from the provided events.
2. Never invent an event.
3. Never invent prices, dates, locations, or seat counts.
4. If no event matches the user's request, clearly say that.
5. Keep the response concise and friendly.
6. Use emojis when useful.
7. When showing events, include:
   - Event name
   - Date
   - Location
   - Ticket price
   - Available seats
8. If the user asks about a specific event, provide its relevant details.
9. If the user asks for recommendations, recommend only from the provided events.

Return a natural conversational response.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
};

module.exports = {
    generateChatResponse
};