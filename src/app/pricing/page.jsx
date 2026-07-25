import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Basic",
        price: "$199",
        description: "Perfect for personal portraits and small sessions.",
        featured: false,
        features: [
            "1 Hour Session",
            "25 Edited Photos",
            "Online Gallery",
            "High Resolution Images",
            "3 Days Delivery",
        ],
    },
    {
        name: "Premium",
        price: "$499",
        description: "Ideal for couples, events, and brand shoots.",
        featured: true,
        features: [
            "3 Hour Session",
            "80 Edited Photos",
            "Professional Retouching",
            "Online Gallery",
            "Priority Delivery",
            "Behind The Scenes Photos",
        ],
    },
    {
        name: "Luxury",
        price: "$999",
        description: "Complete experience for weddings and commercial projects.",
        featured: false,
        features: [
            "Full Day Coverage",
            "Unlimited Edited Photos",
            "Premium Retouching",
            "Drone Photography",
            "Cinematic Highlight Video",
            "Luxury Album Included",
        ],
    },
];

const Pricing = () => {
    return (
        <section className="bg-black text-white pt-30 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-mono mb-3">
                        Pricing
                    </p>

                    <h2 className="text-4xl md:text-6xl font-black uppercase">
                        Choose Your Package
                    </h2>

                    <p className="text-neutral-400 mt-5 leading-relaxed">
                        Simple pricing with no hidden fees. Every package includes
                        professional editing, private online delivery, and premium support.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${plan.featured
                                ? "border-red-500 bg-neutral-900 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
                                : "border-neutral-800 bg-neutral-950"
                                }`}
                        >
                            {plan.featured && (
                                <span className="absolute top-5 right-5 rounded-full bg-red-500 px-4 py-1 text-xs font-bold uppercase">
                                    Most Popular
                                </span>
                            )}

                            <div className="p-8">
                                <h3 className="text-3xl font-black">{plan.name}</h3>

                                <p className="mt-3 text-neutral-400">
                                    {plan.description}
                                </p>

                                <div className="mt-8">
                                    <span className="text-5xl font-black">{plan.price}</span>
                                    <span className="text-neutral-500"> / session</span>
                                </div>

                                <Link href='/contact'>
                                    <button
                                        className={`mt-8 w-full rounded-xl py-4 font-semibold transition ${plan.featured
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-white text-black hover:bg-neutral-200"
                                            }`}
                                    >
                                        Book Now
                                    </button></Link>

                                <div className="mt-10 border-t border-neutral-800 pt-8 space-y-4">
                                    {plan.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-3"
                                        >
                                            <Check className="w-5 h-5 text-red-500" />
                                            <span className="text-neutral-300">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 rounded-3xl border border-neutral-800 bg-neutral-950 p-12 text-center">
                    <h3 className="text-4xl font-black uppercase">
                        Need a Custom Package?
                    </h3>

                    <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
                        Every project is unique. If your shoot doesn't fit one of the
                        packages above, I'd be happy to create a custom quote tailored to
                        your needs.
                    </p>

                    <Link href={'/contact'}>
                        <button className="mt-8 rounded-full bg-red-500 px-8 py-4 font-semibold hover:bg-red-600 transition">
                            Contact Me
                        </button></Link>
                </div>
            </div>
        </section>
    );
};

export default Pricing;