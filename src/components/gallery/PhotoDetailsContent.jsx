"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, Lock } from "lucide-react";
import PurchaseAccess from "@/components/gallery/PurchaseAccess";
import { isPhotoPurchased } from "@/lib/gallery/purchase-state";

export default function PhotoDetailsContent({ photo, photoId, isFree, priceText }) {
    const [isUnlocked, setIsUnlocked] = useState(() => isPhotoPurchased(photoId));

    useEffect(() => {
        const syncUnlockState = () => setIsUnlocked(isPhotoPurchased(photoId));

        syncUnlockState();
        window.addEventListener("focus", syncUnlockState);
        window.addEventListener("storage", syncUnlockState);

        return () => {
            window.removeEventListener("focus", syncUnlockState);
            window.removeEventListener("storage", syncUnlockState);
        };
    }, [photoId]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 pt-24 sm:px-6 lg:px-8">
                <Link
                    href="/gallery"
                    className="flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back to gallery
                </Link>

                <div className="grid gap-8 rounded-3xl border border-white/10 bg-neutral-900/60 p-6 shadow-2xl shadow-black/30 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
                        <div className="relative h-full min-h-80 w-full">
                            <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className={`h-full w-full object-cover ${!isUnlocked && !isFree ? "brightness-[0.65] contrast-[0.9] saturate-[0.6]" : ""}`}
                            />

                            {!isUnlocked && !isFree && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-black/60 px-6 py-6 text-center backdrop-blur-xl">
                                        <div className="rounded-full bg-red-600/20 p-3 text-red-400">
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Watermarked preview</p>
                                            <p className="mt-1 text-xs text-neutral-400">Purchase to unlock the full image.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                                    {photo.category || "Gallery"}
                                </span>
                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isFree ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400"}`}>
                                    {isFree ? "Free access" : "Premium"}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">{photo.title}</h1>
                                <p className="mt-3 text-sm leading-7 text-neutral-400">
                                    {photo.description || "A carefully curated photography piece from the gallery collection."}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="flex items-center justify-between text-sm text-neutral-400">
                                    <span>Price</span>
                                    <span className="font-semibold text-white">
                                        {isFree ? "$0.00" : `$${priceText}`}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
                                    <ShieldCheck size={16} className="text-red-400" />
                                    Secure checkout and instant access after purchase.
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {isFree ? (
                                <a
                                    href={photo.imageUrl}
                                    download={(photo.title || "photo").replace(/[^a-z0-9._-]+/gi, "_").toLowerCase()}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                                >
                                    Download photo
                                </a>
                            ) : (
                                <PurchaseAccess photo={photo} priceText={priceText} />
                            )}

                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-400">
                                <Sparkles size={16} className="text-red-400" />
                                {isFree ? "This photo is free to download." : "This photo requires a one-time purchase."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
