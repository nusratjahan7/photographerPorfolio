"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Sparkles, DollarSign, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { getGallery } from "@/lib/api/gallery";
import PhotoCard from "@/components/photocard/PhotoCard";


const CATEGORIES = [
    "All Categories",
    "Nature & Wildlife",
    "Architecture",
    "Portraits",
    "Technology",
    "Abstract & Art",
    "Travel & Events",
    "Minimalist",
    "Other",
];

const ITEMS_PER_PAGE = 8;

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [priceType, setPriceType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Gallery Data using getGallery()
    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                setLoading(true);
                const data = await getGallery();
                if (Array.isArray(data)) {
                    setPhotos(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    // Fallback in case serverFetch wraps response in { data: [...] }
                    setPhotos(data.data);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    // Filter Logic
    const filteredPhotos = useMemo(() => {
        return photos.filter((photo) => {
            // 1. Search Query
            const matchesSearch =
                photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                photo.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Category Filter
            const matchesCategory =
                selectedCategory === "All Categories" || photo.category === selectedCategory;

            // 3. Free / Paid Filter
            const matchesPrice =
                priceType === "all" ||
                (priceType === "free" && !photo.isPaid) ||
                (priceType === "paid" && photo.isPaid);

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [photos, searchQuery, selectedCategory, priceType]);

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, priceType]);

    // Pagination Calculations
    const totalPages = Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredPhotos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen  bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Page Header */}
                <div className="flex flex-col pt-20 md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <ImageIcon className="text-red-500" size={32} />
                            Explore Gallery
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1">
                            Browse, filter, and discover high-quality photography.
                        </p>
                    </div>

                    <div className="text-xs text-neutral-400 bg-neutral-900 border border-white/10 px-4 py-2 rounded-full w-fit">
                        Total Photos: <span className="text-white font-bold">{filteredPhotos.length}</span>
                    </div>
                </div>

                {/* Filter Bar Controls */}
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

                    {/* Search Input */}
                    <div className="lg:col-span-5 relative">
                        <Search className="absolute left-3.5 top-3 text-neutral-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search photo titles or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div className="lg:col-span-4 relative">
                        <Filter className="absolute left-3.5 top-3 text-neutral-500" size={18} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat} className="bg-neutral-900 text-white">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Free / Paid Toggle Buttons */}
                    <div className="lg:col-span-3 flex bg-neutral-950 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setPriceType("all")}
                            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${priceType === "all"
                                ? "bg-neutral-800 text-white shadow-sm"
                                : "text-neutral-400 hover:text-white"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setPriceType("free")}
                            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${priceType === "free"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "text-neutral-400 hover:text-white"
                                }`}
                        >
                            <Sparkles size={12} />
                            Free
                        </button>
                        <button
                            onClick={() => setPriceType("paid")}
                            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${priceType === "paid"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "text-neutral-400 hover:text-white"
                                }`}
                        >
                            <DollarSign size={12} />
                            Paid
                        </button>
                    </div>
                </div>

                {/* Gallery Content Area */}
                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-red-500" size={32} />
                        <p className="text-sm text-neutral-400">Loading gallery photos...</p>
                    </div>
                ) : currentItems.length > 0 ? (
                    <>
                        {/* 4 Cards per Row Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currentItems.map((photo) => (
                                <PhotoCard key={photo._id || photo.id} photo={photo} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                <p className="text-xs text-neutral-400">
                                    Showing <span className="text-white font-medium">{startIndex + 1}</span> to{" "}
                                    <span className="text-white font-medium">
                                        {Math.min(startIndex + ITEMS_PER_PAGE, filteredPhotos.length)}
                                    </span>{" "}
                                    of <span className="text-white font-medium">{filteredPhotos.length}</span> entries
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 bg-neutral-900 border border-white/10 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <span className="text-xs text-neutral-300 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-xl">
                                        Page <strong className="text-white">{currentPage}</strong> of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 bg-neutral-900 border border-white/10 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 transition-colors"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="min-h-[350px] bg-neutral-900/50 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
                            <ImageIcon size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white">No photos found</h3>
                        <p className="text-xs text-neutral-400 max-w-sm mt-1">
                            Try adjusting your search queries or clearing active category and price filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;