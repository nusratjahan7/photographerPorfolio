"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Send,
    ArrowUpRight,
    ShieldCheck,
    Heart,
    Loader2,
} from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { toast } from "sonner";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        setTimeout(() => {
            toast.success("Welcome aboard! You've been subscribed.", {
                duration: 4000,
            });
            setEmail("");
            setLoading(false);
        }, 1000);
    };

    const footerLinks = [
        {
            title: "Product",
            links: [
                { name: "Features", href: "#" },
                { name: "Integrations", href: "#" },
                { name: "Pricing", href: "#" },
                { name: "Changelog", href: "#", badge: "v2.4" },
                { name: "Docs", href: "#" },
            ],
        },

        {
            title: "Resources",
            links: [
                { name: "Community", href: "#" },
                { name: "Guides & Tutorials", href: "#" },
                { name: "API Reference", href: "#" },
                { name: "Partners", href: "#" },
                { name: "Status", href: "#" },
            ],
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Security", href: "#" },
                { name: "Cookie Settings", href: "#" },
            ],
        },
    ];

    const socialUrls = [
        "https://x.com",
        "https://github.com",
        "https://linkedin.com",
        "https://instagram.com",
    ];

    return (
        <footer className="relative bg-neutral-950 text-neutral-300 pt-20 pb-12 overflow-hidden border-t border-white/10">
            {/* Ambient Glow Effects */}
            <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Top Section: CTA / Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-center">
                    <div className="lg:col-span-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Stay Ahead
                        </span>
                        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Join our monthly newsletter.
                        </h2>
                        <p className="mt-2 text-neutral-400 text-sm sm:text-base max-w-md">
                            Get exclusive updates, product releases, and engineering insights delivered directly to your inbox.
                        </p>
                    </div>

                    <div className="lg:col-span-6">
                        <form
                            onSubmit={handleSubscribe}
                            className="flex flex-col sm:flex-row gap-3 max-w-md lg:ml-auto"
                        >
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full rounded-xl bg-neutral-900/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 backdrop-blur-md"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 text-sm transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>Subscribe</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="mt-3 text-xs text-neutral-500 text-left lg:text-right">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>

                {/* Middle Section: Brand & Nav Links */}
                <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {/* Brand Info */}
                    <div className="col-span-3 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-600/30">
                                P
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Portfolio<span className="text-red-500">.</span>
                            </span>
                        </Link>

                        <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
                            Empowering developers and teams to build high-performance, beautiful web applications with speed and confidence.
                        </p>

                        {/* Social Links using react-social-icons */}
                        <div className="flex items-center gap-2 pt-2">
                            {socialUrls.map((url) => (
                                <div
                                    key={url}
                                    className="transition-transform duration-200 hover:scale-110"
                                >
                                    <SocialIcon
                                        url={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        bgColor="#171717"
                                        fgColor="#a3a3a3"
                                        style={{ height: 38, width: 38 }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Link Columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="space-y-4">
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                {column.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition duration-200"
                                        >
                                            <span>{link.name}</span>
                                            {link.badge && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                                    {link.badge}
                                                </span>
                                            )}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-200 text-red-500" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Copyright & System Status */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <p className="flex items-center gap-1">
                        © {new Date().getFullYear()} Portfolio Built with{" "}
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the modern web.
                    </p>

                    {/* System Status Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-neutral-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}