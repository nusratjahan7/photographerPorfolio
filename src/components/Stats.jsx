"use client";

import { useSyncExternalStore } from "react";
import Marquee from "react-fast-marquee";

const stats = [
    "10+ YEARS EXPERIENCE",
    "500+ HAPPY CLIENTS",
    "1200+ PHOTOS CAPTURED",
    "50+ AWARDS WON",
    "99% CLIENT SATISFACTION",
];


export default function StatsMarquee() {
    const isMounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false,
    );

    return (
        <section className="bg-red-600 py-4 overflow-hidden">
            {isMounted ? (
                <Marquee speed={80} pauseOnHover={true} gradient={false}>
                    <StatsItems />
                </Marquee>
            ) : (
                <StatsItems />
            )}

        </section>
    );
}

function StatsItems() {
    return (
        <div className="flex items-center gap-10">
            {[...stats, ...stats].map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-10 text-black font-bold uppercase tracking-widest text-lg"
                >
                    <span>{item}</span>
                    <span className="text-black">✦</span>
                </div>
            ))}
        </div>
    );
}