import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative mb-16 overflow-hidden rounded-[2rem] bg-neutral-950 text-white shadow-2xl">

                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=85&w=2200')"
                    }}
                />

                {/* Dark overlays */}
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Decorative glow */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 px-6 py-16 md:px-14 lg:px-20 lg:py-24">

                    <div className="max-w-4xl">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-7 rounded-full
                            bg-white/10 border border-white/20 backdrop-blur-md
                            text-sm font-semibold text-white shadow-lg">

                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400"></span>
                            </span>

                            Discover What's Happening
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-7">
                            Experience Events
                            <br />

                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                                Worth Remembering.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="max-w-2xl text-base md:text-lg lg:text-xl text-gray-300
                          leading-relaxed mb-9">
                            Discover conferences, workshops, hackathons, concerts, and unforgettable
                            experiences happening around you. Find your next event and secure your
                            seat in seconds.
                        </p>

                        {/* Search */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">

                            <div className="relative flex-1 group">

                                <FaSearch
                                    className="absolute left-5 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg
                                   group-focus-within:text-black transition"
                                />

                                <input
                                    type="text"
                                    placeholder="Search events, workshops, conferences..."
                                    className="w-full pl-14 pr-5 py-4 rounded-2xl
                                   bg-white text-gray-900
                                   placeholder-gray-400
                                   border border-white/20
                                   focus:outline-none
                                   focus:ring-4 focus:ring-white/20
                                   shadow-xl transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                            </div>

                            <button
                                onClick={() =>
                                    document
                                        .getElementById('upcoming-events')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                                className="px-7 py-4 rounded-2xl
                               bg-white text-black
                               font-bold
                               hover:bg-gray-100
                               active:scale-95
                               transition-all
                               shadow-xl"
                            >
                                Explore Events
                            </button>

                        </div>

                        {/* Category chips */}
                        <div className="flex flex-wrap gap-2 mt-7">

                            {[
                                'Technology',
                                'Business',
                                'AI & ML',
                                'Hackathons',
                                'Workshops'
                            ].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSearch(category)}
                                    className="px-4 py-2 rounded-full
                                   text-sm font-medium
                                   bg-white/10
                                   border border-white/10
                                   backdrop-blur-md
                                   text-gray-200
                                   hover:bg-white
                                   hover:text-black
                                   transition-all"
                                >
                                    {category}
                                </button>
                            ))}

                        </div>

                    </div>

                    {/* Floating Stats */}
                    <div className="hidden lg:flex absolute right-12 bottom-12 gap-4">

                        <div className="bg-white/10 backdrop-blur-xl
                            border border-white/15
                            rounded-2xl px-6 py-5
                            min-w-[140px] shadow-xl">

                            <div className="text-3xl font-black">
                                500+
                            </div>

                            <div className="text-sm text-gray-300 mt-1">
                                Events
                            </div>

                        </div>

                        <div className="bg-white/10 backdrop-blur-xl
                            border border-white/15
                            rounded-2xl px-6 py-5
                            min-w-[140px] shadow-xl">

                            <div className="text-3xl font-black">
                                50K+
                            </div>

                            <div className="text-sm text-gray-300 mt-1">
                                Attendees
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* Why Choose Us / Features row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-200/50">
                        <FaRegClock />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Booking</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-200/50">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Access</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Download tickets instantly or manage them right from your personal dashboard with easily.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-200/50">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Platform</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech.</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
                <div className="text-gray-500 font-medium">{events.length} results found</div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                    {event.ticketPrice === 0 ? <span className="text-green-600">FREE</span> : <span className="text-gray-900">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{event.category}</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-auto pt-16 pb-8 border-t border-gray-200 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaTicketAlt className="text-gray-800 text-2xl" />
                    <span className="text-xl font-bold text-gray-900">Eventora</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
