"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data, error } = await authClient.signUp.email({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Failed to create account.");
                return;
            }

            toast.success("Account created successfully!");
            router.push("/");
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative pt-10 min-h-screen flex items-center justify-center bg-neutral-950 px-6 text-white overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/40 p-8 backdrop-blur-2xl shadow-2xl shadow-black/80"
            >
                <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 uppercase">
                        Join Us
                    </span>

                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400">
                        Enter your details below to get started.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {/* Name Field */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                        <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            placeholder="Full Name"
                            onChange={handleChange}
                            className="w-full rounded-xl bg-black/50 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            placeholder="Email address"
                            onChange={handleChange}
                            className="w-full rounded-xl bg-black/50 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    {/* Password Field with Toggle */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full rounded-xl bg-black/50 border border-white/10 pl-11 pr-12 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-[0.99]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-400">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="text-red-500 hover:text-red-400 font-medium hover:underline transition"
                    >
                        Log in
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}