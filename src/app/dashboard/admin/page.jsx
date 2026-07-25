'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Shield,
    UserX,
    Image as ImageIcon,
    Tag,
    DollarSign,
    Lock,
    Unlock,
    Clock,
} from 'lucide-react';
import { getAnalyticsOverview } from '@/lib/actions/admin';

const StatCard = ({ icon: Icon, label, value, hint }) => (
    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-black text-white rounded-lg shrink-0">
            <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">{label}</p>
            <p className="text-2xl font-black text-black dark:text-white truncate">{value}</p>
            {hint && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{hint}</p>
            )}
        </div>
    </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-black dark:text-white">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const CategoryBar = ({ name, count, max }) => {
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-black dark:text-white">{name || 'Uncategorized'}</span>
                <span className="text-neutral-400 dark:text-neutral-500">{count}</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const timeAgo = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const AnalyticsOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getAnalyticsOverview();
                if (active) setData(result);
            } catch (err) {
                console.error('Analytics fetch error:', err);
                if (active) setError(err.message || 'Failed to load analytics.');
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Loading analytics...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
                <p className="text-rose-600 dark:text-rose-400 text-sm">{error || 'No analytics data available.'}</p>
            </div>
        );
    }

    const {
        totalUsers,
        totalAdmins,
        regularUsers,
        totalGalleryItems,
        paidItems,
        freeItems,
        potentialRevenue,
        categoryBreakdown = [],
        recentUsers = [],
        recentGallery = [],
    } = data;

    const maxCategoryCount = categoryBreakdown.reduce((m, c) => Math.max(m, c.count), 0);

    return (
        <div className="min-h-screen rounded-2xl bg-black p-6 sm:p-10 font-sans text-neutral-100 transition-colors">
            <div className="max-w-7xl mx-auto space-y-8">

                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                        Analytics Overview
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        A snapshot of users and gallery activity across the platform.
                    </p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard icon={Users} label="Total Users" value={totalUsers} />
                    <StatCard icon={Shield} label="Admin" value={totalAdmins} />
                    <StatCard icon={UserX} label="Users" value={regularUsers} />
                    <StatCard icon={ImageIcon} label="Gallery Items" value={totalGalleryItems} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard icon={Lock} label="Paid Items" value={paidItems} />
                    <StatCard icon={Unlock} label="Free Items" value={freeItems} />
                    <StatCard
                        icon={DollarSign}
                        label="Catalog Value"
                        value={`$${potentialRevenue.toFixed(2)}`}
                        hint="Sum of listed prices, not confirmed sales"
                    />
                </div>

                {/* Category Breakdown + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <SectionCard title="Items by Category" icon={Tag}>
                        {categoryBreakdown.length === 0 ? (
                            <p className="text-sm text-neutral-400 dark:text-neutral-500">No gallery items yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {categoryBreakdown.map((cat) => (
                                    <CategoryBar
                                        key={cat._id || 'uncategorized'}
                                        name={cat._id}
                                        count={cat.count}
                                        max={maxCategoryCount}
                                    />
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Recent Signups" icon={Clock}>
                        {recentUsers.length === 0 ? (
                            <p className="text-sm text-neutral-400 dark:text-neutral-500">No users yet.</p>
                        ) : (
                            <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {recentUsers.map((u) => (
                                    <li key={u._id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white text-xs font-bold flex items-center justify-center border border-neutral-300 dark:border-neutral-700 shrink-0">
                                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-black dark:text-white truncate">
                                                    {u.name || 'Unnamed User'}
                                                </p>
                                                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{u.email}</p>
                                            </div>
                                        </div>
                                        {u.role === 'admin' && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black shrink-0 ml-2">
                                                Admin
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>
                </div>

                <SectionCard title="Recently Uploaded" icon={ImageIcon}>
                    {recentGallery.length === 0 ? (
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">No gallery items yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {recentGallery.map((item) => (
                                <div
                                    key={item._id}
                                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-950"
                                >
                                    <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                        {item.imageUrl && (

                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-2.5">
                                        <p className="text-xs font-semibold text-black dark:text-white truncate">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                                {timeAgo(item.createdAt)}
                                            </span>
                                            {item.isPaid ? (
                                                <span className="text-[10px] font-bold text-black dark:text-white">
                                                    ${Number(item.price).toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

            </div>
        </div>
    );
};

export default AnalyticsOverview;