const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventora.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventora.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventora.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventora.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventora.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventora.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@eventora.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@eventora.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@eventora.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'Global Leaders Business Summit',
        description: 'A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'The Ritz-Carlton, London',
        category: 'Business',
        totalSeats: 150,
        availableSeats: 150,
        ticketPrice: 5000,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'AI & Machine Learning Conference',
        description: 'Explore the latest developments in artificial intelligence, machine learning, generative AI, and AI agents with industry experts.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Bangalore International Convention Centre, Bangalore',
        category: 'Technology',
        totalSeats: 500,
        availableSeats: 500,
        ticketPrice: 1499,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'CodeStorm Hackathon 2026',
        description: 'A 24-hour coding hackathon where developers and students collaborate to build innovative technology solutions.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'HITEX Exhibition Centre, Hyderabad',
        category: 'Hackathon',
        totalSeats: 300,
        availableSeats: 300,
        ticketPrice: 299,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Full Stack Development Workshop',
        description: 'A hands-on workshop covering React, Node.js, Express, MongoDB, REST APIs, authentication, and deployment.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Tech Park, Pune',
        category: 'Workshop',
        totalSeats: 100,
        availableSeats: 100,
        ticketPrice: 799,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Startup India Entrepreneurship Summit',
        description: 'Meet startup founders, entrepreneurs, investors, and industry leaders while exploring ideas, funding, and startup growth.',
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        location: 'Jio World Convention Centre, Mumbai',
        category: 'Entrepreneurship',
        totalSeats: 600,
        availableSeats: 600,
        ticketPrice: 999,
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Cyber Security & Ethical Hacking Workshop',
        description: 'Learn about cybersecurity, ethical hacking, network security, penetration testing, and modern cyber threats.',
        date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        location: 'India Habitat Centre, New Delhi',
        category: 'Cyber Security',
        totalSeats: 200,
        availableSeats: 200,
        ticketPrice: 599,
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Career & Placement Fair 2026',
        description: 'Connect with leading companies offering internships, graduate roles, and career opportunities across technology and business.',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        location: 'Pune University Campus, Pune',
        category: 'Career',
        totalSeats: 1000,
        availableSeats: 1000,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Generative AI & LLM Workshop',
        description: 'Learn how to build applications using large language models, prompt engineering, RAG, embeddings, and AI agents.',
        date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        location: 'IIT Bombay, Mumbai',
        category: 'Artificial Intelligence',
        totalSeats: 250,
        availableSeats: 250,
        ticketPrice: 1299,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Python & Data Science Bootcamp',
        description: 'An intensive bootcamp covering Python, NumPy, Pandas, data visualization, machine learning, and real-world projects.',
        date: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
        location: 'Symbiosis Institute of Technology, Pune',
        category: 'Data Science',
        totalSeats: 120,
        availableSeats: 120,
        ticketPrice: 699,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Cloud Computing & DevOps Summit',
        description: 'Discover cloud architecture, AWS, Docker, Kubernetes, CI/CD, microservices, and modern DevOps practices.',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        location: 'Hinjewadi IT Park, Pune',
        category: 'Cloud & DevOps',
        totalSeats: 350,
        availableSeats: 350,
        ticketPrice: 899,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'React & Next.js Developer Meetup',
        description: 'A developer meetup focused on React, Next.js, TypeScript, modern frontend architecture, APIs, and deployment.',
        date: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
        location: 'WeWork, Kharadi, Pune',
        category: 'Web Development',
        totalSeats: 180,
        availableSeats: 180,
        ticketPrice: 399,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'AI Agents & Multi-Agent Systems Summit',
        description: 'Discover autonomous AI agents, multi-agent orchestration, LangGraph, tool calling, RAG, and enterprise AI architectures.',
        date: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
        location: 'Hyderabad International Convention Centre, Hyderabad',
        category: 'Artificial Intelligence',
        totalSeats: 400,
        availableSeats: 400,
        ticketPrice: 1599,
        image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'College Cultural Fest 2026',
        description: 'A large cultural festival featuring music, dance, drama, competitions, food, entertainment, and student activities.',
        date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        location: 'College Ground, Pune',
        category: 'Cultural',
        totalSeats: 2000,
        availableSeats: 2000,
        ticketPrice: 100,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Digital Marketing Masterclass',
        description: 'Learn SEO, social media marketing, content strategy, Google Ads, analytics, and modern digital marketing techniques.',
        date: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
        location: 'Taj Convention Centre, Mumbai',
        category: 'Marketing',
        totalSeats: 250,
        availableSeats: 250,
        ticketPrice: 499,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Free Tech Career Guidance Seminar',
        description: 'A career guidance session covering software engineering, DSA, resume building, interviews, internships, and placement preparation.',
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        location: 'G H Raisoni College, Pune',
        category: 'Career',
        totalSeats: 500,
        availableSeats: 500,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'React & Node.js Developer Retreat',
        description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'Silicon Valley Innovation Center, CA',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights EDM Festival',
        description: 'Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        location: 'Grand Arena, New York',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Leaders Business Summit',
        description: 'A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        location: 'The Ritz-Carlton, London',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Modern Art Expo 2024',
        description: 'Discover breathtaking contemporary and modern arts from underground and trending artists this season.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Downtown Art Museum',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup Pitch & Pitch Competition',
        description: 'Watch 25 startups pitch for 1 million dollars in seed funding. Great networking for entrepreneurs and angel investors.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Convention Center, Miami',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Cloud Computing Architecture Seminar',
        description: 'A purely technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        location: 'Tech Hub, Seattle',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventora');
        console.log('\n✅ MongoDB connection open...');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️  Cleared existing data.');

        // Hash user passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');
        console.log(`👤 Created ${createdUsers.length} total dummy users.`);

        // Link events to admin
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} distinct events with Unsplash images.`);

        // Generate Bookings Data
        const bookingsData = [];

        for (const event of createdEvents) {
            // Assign 3-6 random users to each event
            const randomCount = Math.floor(Math.random() * 4) + 3;
            // Shuffle and pick random users
            const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, randomCount);

            for (const user of selectedUsers) {
                // Randomize statuses
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                let paymentStatus = 'not_paid';
                if (status === 'confirmed' && event.ticketPrice > 0) {
                    // Usually confirmed tickets are marked paid (90% of the time)
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
                } else if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }

                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status: status,
                    paymentStatus: paymentStatus,
                    amount: event.ticketPrice
                });

                // Deduct available seats specifically for confirmed tickets!
                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookingsData);
        console.log(`🎫 Inserted ${bookingsData.length} randomized dummy bookings (confirmed, pending, cancelled, paid, not_paid).`);

        console.log('\n🚀 Database seeded successfully!');
        console.log('-------------------------------------------');
        console.log('Admin Email: admin@eventora.com');
        console.log('User Email:  user@eventora.com');
        console.log('Password for all users: password123');
        console.log('-------------------------------------------\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();
