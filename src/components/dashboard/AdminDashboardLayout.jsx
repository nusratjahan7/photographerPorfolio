"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BarChart3,
    Users,
    Image as GalleryIcon,
    UploadCloud,
    LogOut,
    Menu,
    X,
    Shield,
    Bell,
    ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const adminNavItems = [
        {
            label: "Analytics Overview",
            path: "/dashboard/admin",
            icon: BarChart3,
            badge: "Live",
        },
        {
            label: "User Management",
            path: "/dashboard/admin/users",
            icon: Users,
        },
        {
            label: "Gallery",
            path: "/dashboard/admin/gallery",
            icon: GalleryIcon,
        },
        {
            label: "Upload",
            path: "/dashboard/admin/upload",
            icon: UploadCloud,
        },
    ];

    const handleSignOut = async () => {
        try {
            setLoggingOut(true);
            await authClient.signOut();
            toast.success("Signed out safely");
            router.push("/auth/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to sign out. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    };

    const AdminSidebarContent = () => (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl w-full flex flex-col justify-between min-h-[82vh]">
            <div>
                {/* Admin Header / Brand Title */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                            <Shield size={20} />
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-base tracking-tight block">
                                Admin Console
                            </span>
                            <span className="text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                Super Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${isActive
                                        ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <Icon
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-white"
                                                : "text-neutral-500 group-hover:text-neutral-300"
                                        }
                                    />
                                    <span>{item.label}</span>
                                </div>

                                {item.badge && (
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Exit & Sign Out Actions */}
            <div className="pt-6 border-t border-white/10 space-y-2 mt-6">
                <Link
                    href="/"
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors w-full"
                >
                    <span>Return to Public Site</span>
                    <ArrowUpRight size={14} />
                </Link>

                <button
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full disabled:opacity-50"
                >
                    <LogOut size={18} />
                    <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white antialiased p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Ambient Red Glow Effects */}
            <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
                {/* Mobile Navigation Header */}
                <div className="lg:hidden col-span-1 w-full flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-neutral-900 border border-white/10 rounded-2xl px-5 py-3.5 shadow-xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                                A
                            </div>
                            <span className="text-sm font-bold text-white">Admin Portal</span>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="w-full animate-in fade-in slide-in-from-top-2 duration-200">
                            <AdminSidebarContent />
                        </div>
                    )}
                </div>

                {/* Desktop Sticky Sidebar */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-8 w-full">
                    <AdminSidebarContent />
                </aside>

                {/* Main Workspace Area */}
                <main className="col-span-1 lg:col-span-9 w-full bg-neutral-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl min-h-[82vh]">
                    {/* Top Admin Status Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                Control Panel
                            </h1>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                Manage users, monitor platform health, and moderate site content.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toast.info("No new security alerts.")}
                                className="p-2.5 rounded-xl bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white transition duration-200 relative"
                                aria-label="Notifications"
                            >
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            </button>

                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/10 text-xs font-medium text-neutral-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>System Health 100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    {children}
                </main>
            </div>
        </div>
    );
}