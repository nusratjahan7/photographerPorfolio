'use client';

import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Quote, Star } from 'lucide-react';


const FeedbackRow = ({ items, direction = 'left', speed = 45 }) => {
    const track = [...items, ...items];
    const controls = useAnimationControls();
    const target = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

    const runLoop = () => {
        controls.start({
            x: target,
            transition: { duration: speed, ease: 'linear', repeat: Infinity },
        });
    };

    useEffect(() => {
        runLoop();

    }, []);

    return (
        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <motion.div
                className="flex gap-5 w-max"
                animate={controls}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                style={{ willChange: 'transform' }}
                onHoverStart={() => controls.stop()}
                onHoverEnd={() => runLoop()}
            >
                {track.map((item, i) => (
                    <FeedbackCard key={`${item.id}-${i}`} {...item} />
                ))}
            </motion.div>
        </div>
    );
};

const FeedbackCard = ({ name, role, quote, rating = 5, avatarUrl }) => (
    <div className="w-80 shrink-0 rounded-xl border border-neutral-800 bg-black shadow-lg p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <Quote className="w-5 h-5 text-neutral-600" />

            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rating
                            ? "fill-orange-500 text-orange-400"
                            : "text-neutral-700"
                            }`}
                    />
                ))}
            </div>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed">
            {quote}
        </p>

        <div className="flex items-center gap-3 mt-1">
            <div className="w-9 h-9 rounded-full bg-red-600 border border-red-700 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-white">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    name?.charAt(0).toUpperCase()
                )}
            </div>

            <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                    {name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                    {role}
                </p>
            </div>
        </div>
    </div>
);


const sampleRowOne = [
    { id: 1, name: 'Ayesha Rahman', role: 'Product Designer', rating: 5, quote: 'The turnaround was fast and the communication was clear at every step. Exactly what I needed for launch.' },
    { id: 2, name: 'Tanvir Ahmed', role: 'Founder, Loopline', rating: 5, quote: 'Clean code, thoughtful UX decisions, and genuinely enjoyable to work with.' },
    { id: 3, name: 'Priya Sharma', role: 'Marketing Lead', rating: 4, quote: 'Delivered exactly what we scoped, and pushed back with good reasoning when something did not make sense.' },
    { id: 4, name: 'Michael Chen', role: 'CTO, Fintra', rating: 5, quote: 'One of the smoothest handoffs we have had with a contractor. Documentation was excellent.' },
];

const sampleRowTwo = [
    { id: 5, name: 'Nusrat Jahan', role: 'Creative Director', rating: 5, quote: 'Attention to detail on the small stuff, animations, spacing, made the whole product feel premium.' },
    { id: 6, name: 'David Okafor', role: 'Founder, Streamly', rating: 5, quote: 'Understood the brief immediately and shipped ahead of schedule without cutting corners.' },
    { id: 7, name: 'Sara Islam', role: 'Operations Manager', rating: 4, quote: 'Reliable, responsive, and easy to hand off recurring work to.' },
    { id: 8, name: 'James Park', role: 'Head of Growth', rating: 5, quote: 'Our conversion rate went up right after the redesign shipped. Would work together again.' },
];


const ClientFeedback = ({
    rowOne = sampleRowOne,
    rowTwo = sampleRowTwo,
}) => {
    return (
        <section className="w-full py-20 bg-black">
            <div className="max-w-7xl mx-auto px-6 mb-10">
                <h2 className="text-4xl font-black tracking-tight uppercase text-white">
                    What <span className='text-red-600'>Clients Say</span>
                </h2>

                <p className="mt-2 text-neutral-400">
                    Feedback from people I've worked with.
                </p>
            </div>

            <div className="space-y-6">
                <FeedbackRow
                    items={rowOne}
                    direction="left"
                    speed={50}
                />
                <FeedbackRow
                    items={rowTwo}
                    direction="right"
                    speed={55}
                />
            </div>
        </section>
    );
};

export default ClientFeedback; 