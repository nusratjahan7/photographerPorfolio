"use client";

import { motion } from "framer-motion";
import PhotoCard from "./photocard/PhotoCard";


export default function FeaturedLatestClient({ latest }) {
    return (
        <section className="w-full bg-black text-neutral-100 pt-16 sm:py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.p
                            className="font-mono text-xs tracking-[0.3em] text-red-500 uppercase mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Latest Frames
                        </motion.p>

                        <motion.h2
                            className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Featured Work
                        </motion.h2>
                    </motion.div>
                </div>

                {latest.length === 0 ? (
                    <p className="text-neutral-500 text-sm">No photos yet.</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {latest.map((photo) => (
                            <PhotoCard key={photo._id} photo={photo} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}