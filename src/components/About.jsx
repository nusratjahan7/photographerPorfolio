"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
    return (
        <section
            id="about"
            className="bg-black py-10 text-white overflow-hidden"
        >

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">


                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                >

                    <div className="absolute -left-5 -top-5 h-32 w-32 border-l-2 border-t-2 border-red-600" />

                    <div className="relative overflow-hidden rounded-3xl border border-white/10">

                        <Image
                            src="/about.png"
                            alt="Photographer"
                            width={600}
                            height={700}
                            className="h-[500px] w-full object-cover"
                        />

                    </div>


                    <div className="absolute -bottom-6 -right-6 rounded-2xl bg-red-600 px-8 py-5 text-black">

                        <h3 className="text-4xl font-black">
                            10+
                        </h3>

                        <p className="text-sm font-bold uppercase">
                            Years Experience
                        </p>

                    </div>


                </motion.div>



                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >

                    <p className="text-sm uppercase tracking-[6px] text-red-500">
                        About Me
                    </p>


                    <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                        Capturing
                        <span className="text-red-600">
                            {" "}moments
                        </span>
                        ,
                        creating stories.
                    </h2>


                    <p className="mt-6 max-w-xl leading-relaxed text-neutral-400">
                        I am a professional photographer passionate about
                        capturing authentic emotions and unforgettable moments.
                        From weddings to brand campaigns, I transform simple
                        frames into powerful visual stories.
                    </p>


                    <p className="mt-4 max-w-xl leading-relaxed text-neutral-400">
                        My approach combines creativity, cinematic lighting,
                        and attention to detail to create photographs that
                        feel timeless.
                    </p>



                    {/* Skills */}
                    <div className="mt-8 flex flex-wrap gap-3">

                        {[
                            "Wedding Photography",
                            "Portrait",
                            "Brand Photography",
                            "Event Coverage",
                        ].map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-neutral-300"
                            >
                                {skill}
                            </span>
                        ))}

                    </div>



                    <Link href="/gallery">
                        <button
                            className="mt-10 rounded-full bg-red-600 px-8 py-4 font-bold text-black transition hover:bg-red-500"
                        >
                            Explore My Work
                        </button>
                    </Link>


                </motion.div>


            </div>

        </section>
    );
}