import {
    Camera,
    ImageIcon,
    Sparkles,
    Plane,
    Heart,
    Video,
} from "lucide-react";
import Link from "next/link";

const services = [
    {
        icon: Camera,
        title: "Portrait Photography",
        description:
            "Professional portraits that capture your personality with cinematic lighting and premium editing.",
    },
    {
        icon: Heart,
        title: "Wedding Photography",
        description:
            "Timeless wedding moments documented with emotion, elegance, and attention to every detail.",
    },
    {
        icon: ImageIcon,
        title: "Commercial Shoots",
        description:
            "High-quality branding and product photography designed for businesses and social media campaigns.",
    },
    {
        icon: Sparkles,
        title: "Photo Retouching",
        description:
            "Natural colour correction, skin retouching, and premium post-production for every image.",
    },
    {
        icon: Video,
        title: "Cinematic Videos",
        description:
            "Creative highlight films and promotional videos with smooth transitions and storytelling.",
    },
    {
        icon: Plane,
        title: "Travel Photography",
        description:
            "Available for destination shoots, travel campaigns, and adventure storytelling worldwide.",
    },
];

const Service = () => {
    return (
        <section className="bg-black text-white pt-30 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="mb-14">
                    <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-mono mb-3">
                        What I Offer
                    </p>

                    <h2 className="text-4xl md:text-5xl font-black uppercase">
                        Photography Services
                    </h2>

                    <p className="text-neutral-400 mt-4 max-w-2xl">
                        Every project is crafted with creativity, precision, and attention
                        to detail. From portraits to commercial campaigns, I deliver images
                        that tell memorable stories.
                    </p>
                </div>

                {/* Services */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <div
                                key={index}
                                className="group rounded-2xl border border-neutral-800 bg-neutral-950 p-8 hover:border-red-500 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500 transition-all duration-300">
                                    <Icon
                                        size={28}
                                        className="text-red-500 group-hover:text-white transition"
                                    />
                                </div>

                                <h3 className="text-2xl font-bold mb-3">
                                    {service.title}
                                </h3>

                                <p className="text-neutral-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-20 rounded-3xl border border-neutral-800 bg-neutral-950 p-10 text-center">
                    <h3 className="text-3xl font-black uppercase">
                        Ready to Create Something Amazing?
                    </h3>

                    <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
                        Let's capture unforgettable moments together. Whether it's a
                        personal portrait, wedding, brand campaign, or cinematic video,
                        I'm ready to bring your vision to life.
                    </p>

                    <Link href='/pricing'>
                        <button className="mt-8 bg-red-500 hover:bg-red-600 transition px-8 py-4 rounded-full font-semibold">
                            Book a Session
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Service;