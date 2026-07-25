"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, DollarSign, Eye } from "lucide-react";

export default function PhotoCard({ photo }) {
    const { _id, id, title, category, isPaid, price, imageUrl, description } = photo;
    const photoId = _id || id;

    return (
        <Link
            href={`/gallery/${photoId}`}
            className="group bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10 flex flex-col justify-between cursor-pointer"
        >
            {/* Photo Image Container */}
            <div className="relative aspect-square overflow-hidden bg-neutral-950">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category & Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {category}
                    </span>

                    {isPaid ? (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <DollarSign size={12} />
                            {price ? Number(price).toFixed(2) : "0.00"}
                        </span>
                    ) : (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={12} />
                            Free
                        </span>
                    )}
                </div>

                {/* Hover Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="p-3 bg-red-600/90 text-white rounded-full backdrop-blur-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-600">
                        <Eye size={18} />
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                            {description}
                        </p>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>{isPaid ? "Premium" : "Free Access"}</span>
                    <span className="font-semibold text-white">
                        {isPaid ? `$${price}` : "$0.00"}
                    </span>
                </div>
            </div>
        </Link>
    );
}