const Event = require("../models/Event");

const EVENT_KEYWORDS = {
    tech: ["tech", "technology", "software", "developer", "programming", "AI", "AI", "artificial intelligence", "machine learning", "deep learning", "data", "web3", "blockchain"],
    music: ["music", "concert", "live band", "performance", "DJ", "audio", "festival", "EDM"],
    art: ["art", "painting", "sketching", "artwork", "design", "creative", "gallery", "craft"],
    food: ["food", "cooking", "culinary", "gastronomy", "chef", "recipe", "workshop"],
    workshop: ["workshop", "training", "skill", "learning", "class", "educational"],
    comedy: ["comedy", "standup", "funny", "humor"],
    dance: ["dance", "choreography", "performance", "stage"],
    startup: ["startup", "entrepreneur", "business", "networking", "pitching"],
    fashion: ["fashion", "style", "ramp walk", "couture"],
    gaming: ["gaming", "esports", "competition", "tournament"],
    finance: ["finance", "investment", "trading", "money"],
    health: ["health", "fitness", "wellness", "yoga", "gym"],
    marketing: ["marketing", "digital marketing", "SEO", "social media"],
    photography: ["photography", "camera", "photo", "image"],
    science: ["science", "research", "experiment"],
    writing: ["writing", "poetry", "creative writing", "literature"],
    travel: ["travel", "trip", "journey", "explore"],
    sports: ["sports", "football", "cricket", "basketball", "fitness"],
    theatre: ["theatre", "drama", "stage play", "acting"],
    film: ["film", "movie", "cinema", "director"],
    fashion: ["fashion", "style", "ramp walk", "couture"],
    gaming: ["gaming", "esports", "competition", "tournament"],
    finance: ["finance", "investment", "trading", "money"],
    health: ["health", "fitness", "wellness", "yoga", "gym"],
    marketing: ["marketing", "digital marketing", "SEO", "social media"],
    photography: ["photography", "camera", "photo", "image"],
    science: ["science", "research", "experiment"],
    writing: ["writing", "poetry", "creative writing", "literature"],
    travel: ["travel", "trip", "journey", "explore"],
    sports: ["sports", "football", "cricket", "basketball", "fitness"],
    theatre: ["theatre", "drama", "stage play", "acting"],
    film: ["film", "movie", "cinema", "director"],
    free: ["free", "no cost", "0 cost"],
    discounted: ["discount", "offers", "limited time"]
};

const searchEvents = async (filters) => {
    const mongoFilter = {};

    // ==========================================
    // LOCATION
    // ==========================================

    if (filters.location) {
        mongoFilter.location = {
            $regex: filters.location,
            $options: "i"
        };
    }

    // ==========================================
    // PRICE
    // ==========================================

    if (
        filters.maxPrice !== null &&
        filters.maxPrice !== undefined
    ) {
        mongoFilter.ticketPrice = {
            $lte: Number(filters.maxPrice)
        };
    }

    if (
        filters.minPrice !== null &&
        filters.minPrice !== undefined
    ) {
        mongoFilter.ticketPrice = {
            ...(mongoFilter.ticketPrice || {}),
            $gte: Number(filters.minPrice)
        };
    }

    // ==========================================
    // FREE EVENTS
    // ==========================================

    if (filters.freeOnly === true) {
        mongoFilter.ticketPrice = 0;
    }

    // ==========================================
    // KEYWORD
    // ==========================================

    if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase().trim();

        const keywords = EVENT_KEYWORDS[keyword] || [keyword];

        const escapedKeywords = keywords.map((word) =>
            word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );

        const regex = new RegExp(
            escapedKeywords.join("|"),
            "i"
        );

        mongoFilter.$or = [
            { title: regex },
            { description: regex },
            { category: regex }
        ];
    }

    console.log(
        "MongoDB filter:",
        JSON.stringify(mongoFilter, null, 2)
    );

    const events = await Event.find(mongoFilter)
        .select(
            "_id title description date location category totalSeats availableSeats ticketPrice image"
        )
        .sort({ date: 1 })
        .lean();

    console.log("Matching events:", events.length);

    return events;
};

module.exports = {
    searchEvents
};