import React, { useState } from "react";
import {
    FaRobot,
    FaTimes,
    FaPaperPlane
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Chatbot = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Welcome to Eventora! 👋",
            events: []
        },
        {
            sender: "bot",
            text: "What brings you to our website today?",
            events: []
        }
    ]);

    // ==========================================
    // QUICK REPLIES
    // ==========================================

    const quickReplies = [
        "I'm interested in Eventora services",
        "I'm just browsing",
        "I'd like some technical help"
    ];

    // ==========================================
    // QUICK REPLY HANDLER
    // ==========================================

    const handleQuickReply = (text) => {

        let botResponse = "";

        if (text.includes("services")) {
            botResponse =
                "Great! I can help you discover events, workshops, conferences and other experiences on Eventora.";
        }

        else if (text.includes("browsing")) {
            botResponse =
                "Take your time! 🎉 You can explore our upcoming events and find something interesting for you.";
        }

        else if (text.includes("technical")) {
            botResponse =
                "Sure! Please describe the technical issue you're facing and I'll try to help.";
        }

        else {
            botResponse =
                "Thanks for your message! How can I help you?";
        }

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text,
                events: []
            },
            {
                sender: "bot",
                text: botResponse,
                events: []
            }
        ]);
    };

    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSend = async () => {

        if (!message.trim() || isLoading) {
            return;
        }

        const userMessage = message.trim();

        // Save current history before adding
        // the new user message.
        const previousHistory = messages;

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userMessage,
                events: []
            }
        ]);

        setMessage("");
        setIsLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: userMessage,

                        // Send previous conversation
                        // to backend
                        history: previousHistory
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Server error: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Chat response:", data);

            // Save bot response AND events
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",

                    text:
                        data.response ||
                        "I couldn't generate a response.",

                    events:
                        Array.isArray(data.events)
                            ? data.events
                            : []
                }
            ]);

        } catch (error) {

            console.error(
                "Chat error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text:
                        "Sorry, I couldn't connect to the Eventora server.",
                    events: []
                }
            ]);

        } finally {

            setIsLoading(false);
        }
    };

    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "Date not available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>

            {/* ==================================
                FLOATING CHAT BUTTON
            ================================== */}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="
                        fixed bottom-6 right-6 z-50
                        w-16 h-16
                        rounded-2xl
                        bg-green-500
                        hover:bg-green-600
                        text-white
                        flex items-center justify-center
                        shadow-2xl
                        transition-all duration-300
                        hover:scale-105
                        active:scale-95
                    "
                >
                    <FaRobot className="text-2xl" />
                </button>
            )}

            {/* ==================================
                CHAT WINDOW
            ================================== */}

            {isOpen && (
                <div
                    className="
                        fixed
                        bottom-5
                        right-5
                        z-50
                        w-[370px]
                        max-w-[calc(100vw-2rem)]
                        h-[620px]
                        max-h-[calc(100vh-2rem)]
                        bg-white
                        rounded-3xl
                        shadow-2xl
                        overflow-hidden
                        flex flex-col
                        border border-gray-100
                    "
                >

                    {/* ==================================
                        HEADER
                    ================================== */}

                    <div
                        className="
                            bg-gradient-to-r
                            from-green-500
                            to-emerald-500
                            text-white
                            px-5
                            py-5
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-11 h-11
                                    rounded-full
                                    bg-white
                                    flex
                                    items-center
                                    justify-center
                                    text-green-500
                                    shadow-md
                                "
                            >
                                <FaRobot className="text-xl" />
                            </div>

                            <div>

                                <h2 className="font-bold text-lg">
                                    Eventora
                                </h2>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        text-green-50
                                    "
                                >
                                    <span
                                        className="
                                            w-2 h-2
                                            bg-green-200
                                            rounded-full
                                        "
                                    />

                                    Online
                                </div>

                            </div>

                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="
                                w-9 h-9
                                rounded-full
                                hover:bg-white/20
                                flex
                                items-center
                                justify-center
                                transition
                            "
                        >
                            <FaTimes />
                        </button>

                    </div>

                    {/* ==================================
                        MESSAGES
                    ================================== */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            px-4
                            py-5
                            space-y-3
                            bg-white
                        "
                    >

                        {/* DATE */}

                        <div
                            className="
                                text-center
                                text-xs
                                text-gray-400
                                mb-5
                            "
                        >
                            Today
                        </div>

                        {/* MESSAGES */}

                        {messages.map((msg, index) => (

                            <div key={index}>

                                {/* MESSAGE */}

                                <div
                                    className={`
                                        flex
                                        ${msg.sender === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                        }
                                    `}
                                >

                                    {/* BOT ICON */}

                                    {msg.sender === "bot" && (
                                        <div
                                            className="
                                                w-7 h-7
                                                rounded-full
                                                bg-white
                                                border
                                                border-green-500
                                                flex
                                                items-center
                                                justify-center
                                                mr-2
                                                mt-1
                                                flex-shrink-0
                                            "
                                        >
                                            <FaRobot
                                                className="
                                                    text-green-500
                                                    text-xs
                                                "
                                            />
                                        </div>
                                    )}

                                    {/* MESSAGE TEXT */}

                                    <div
                                        className={`
                                            max-w-[78%]
                                            px-4
                                            py-3
                                            rounded-2xl
                                            text-sm
                                            leading-relaxed
                                            whitespace-pre-line

                                            ${msg.sender === "user"
                                                ? `
                                                        bg-green-500
                                                        text-white
                                                        rounded-br-md
                                                    `
                                                : `
                                                        bg-gray-100
                                                        text-gray-700
                                                        rounded-bl-md
                                                    `
                                            }
                                        `}
                                    >
                                        {msg.text}
                                    </div>

                                </div>

                                {/* ==================================
                                    EVENT CARDS
                                ================================== */}

                                {msg.sender === "bot" &&
                                    msg.events &&
                                    msg.events.length > 0 && (

                                        <div
                                            className="
                                                ml-9
                                                mt-3
                                                space-y-3
                                            "
                                        >

                                            {msg.events.map(
                                                (event) => (

                                                    <div
                                                        key={event._id}
                                                        className="
                                                            rounded-2xl
                                                            border
                                                            border-gray-200
                                                            bg-white
                                                            p-4
                                                            shadow-sm
                                                        "
                                                    >

                                                        {/* EVENT IMAGE */}

                                                        {event.image && (
                                                            <img
                                                                src={event.image}
                                                                alt={event.title}
                                                                className="
                                                                    w-full
                                                                    h-32
                                                                    object-cover
                                                                    rounded-xl
                                                                    mb-3
                                                                "
                                                            />
                                                        )}

                                                        {/* TITLE */}

                                                        <h3
                                                            className="
                                                                text-base
                                                                font-semibold
                                                                text-gray-900
                                                            "
                                                        >
                                                            🎫 {event.title}
                                                        </h3>

                                                        {/* DESCRIPTION */}

                                                        {event.description && (
                                                            <p
                                                                className="
                                                                    mt-2
                                                                    text-xs
                                                                    text-gray-500
                                                                    line-clamp-3
                                                                "
                                                            >
                                                                {event.description}
                                                            </p>
                                                        )}

                                                        {/* DATE */}

                                                        <p
                                                            className="
                                                                mt-3
                                                                text-sm
                                                                text-gray-600
                                                            "
                                                        >
                                                            📅{" "}
                                                            {formatDate(
                                                                event.date
                                                            )}
                                                        </p>

                                                        {/* LOCATION */}

                                                        <p
                                                            className="
                                                                text-sm
                                                                text-gray-600
                                                            "
                                                        >
                                                            📍{" "}
                                                            {event.location}
                                                        </p>

                                                        {/* CATEGORY */}

                                                        <p
                                                            className="
                                                                text-sm
                                                                text-gray-600
                                                            "
                                                        >
                                                            🏷️{" "}
                                                            {event.category}
                                                        </p>

                                                        {/* PRICE */}

                                                        <p
                                                            className="
                                                                text-sm
                                                                text-gray-600
                                                            "
                                                        >
                                                            🎟️ ₹
                                                            {event.ticketPrice}
                                                        </p>

                                                        {/* AVAILABLE SEATS */}

                                                        <p
                                                            className="
                                                                text-sm
                                                                text-gray-600
                                                            "
                                                        >
                                                            💺{" "}
                                                            {event.availableSeats}
                                                            {" "}
                                                            seats available
                                                        </p>

                                                        {/* TOTAL SEATS */}

                                                        {event.totalSeats !==
                                                            undefined && (
                                                                <p
                                                                    className="
                                                                    text-sm
                                                                    text-gray-600
                                                                "
                                                                >
                                                                    🪑{" "}
                                                                    {event.totalSeats}
                                                                    {" "}
                                                                    total seats
                                                                </p>
                                                            )}

                                                        {/* VIEW EVENT */}

                                                        <Link
                                                            to={`/events/${event._id}`}
                                                            className="
                                                                mt-3
                                                                inline-block
                                                                w-full
                                                                text-center
                                                                bg-green-500
                                                                hover:bg-green-600
                                                                text-white
                                                                text-sm
                                                                font-semibold
                                                                py-2
                                                                rounded-xl
                                                                transition
                                                            "
                                                        >
                                                            View Event →
                                                        </Link>

                                                    </div>

                                                )
                                            )}

                                        </div>
                                    )}

                            </div>

                        ))}

                        {/* ==================================
                            LOADING
                        ================================== */}

                        {isLoading && (
                            <div
                                className="
                                    flex
                                    justify-start
                                    items-center
                                    gap-2
                                    ml-9
                                "
                            >
                                <div
                                    className="
                                        bg-gray-100
                                        text-gray-500
                                        px-4
                                        py-3
                                        rounded-2xl
                                        text-sm
                                    "
                                >
                                    Eventora is thinking...
                                </div>
                            </div>
                        )}

                        {/* ==================================
                            QUICK REPLIES
                        ================================== */}

                        {messages.length <= 2 &&
                            !isLoading && (

                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-end
                                        gap-2
                                        mt-5
                                    "
                                >

                                    {quickReplies.map(
                                        (reply, index) => (

                                            <button
                                                key={index}
                                                onClick={() =>
                                                    handleQuickReply(
                                                        reply
                                                    )
                                                }
                                                className="
                                                    px-4
                                                    py-2.5
                                                    rounded-full
                                                    border
                                                    border-green-500
                                                    text-green-600
                                                    text-sm
                                                    font-medium
                                                    hover:bg-green-500
                                                    hover:text-white
                                                    transition
                                                    text-right
                                                "
                                            >
                                                {reply}
                                            </button>

                                        )
                                    )}

                                </div>
                            )}

                    </div>

                    {/* ==================================
                        INPUT
                    ================================== */}

                    <div
                        className="
                            border-t
                            border-gray-200
                            p-3
                            bg-white
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                bg-gray-100
                                rounded-full
                                px-4
                                py-2
                            "
                        >

                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="
                                    flex-1
                                    bg-transparent
                                    outline-none
                                    text-sm
                                    text-gray-800
                                "
                            />

                            <button
                                onClick={handleSend}
                                disabled={
                                    !message.trim() ||
                                    isLoading
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-green-500
                                    hover:bg-green-600
                                    disabled:bg-gray-300
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    transition
                                "
                            >
                                <FaPaperPlane className="text-xs" />
                            </button>

                        </div>

                        <p
                            className="
                                text-center
                                text-[10px]
                                text-gray-400
                                mt-2
                            "
                        >
                            Eventora AI Assistant
                        </p>

                    </div>

                </div>
            )}

        </>
    );
};

export default Chatbot;